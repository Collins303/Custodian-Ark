create or replace function public.create_checkout_order(
  p_order_number text,
  p_user_id uuid,
  p_shipping_address jsonb,
  p_shipping_cost numeric,
  p_tax numeric,
  p_items jsonb
)
returns table (order_id uuid, order_number text, subtotal numeric, shipping_cost numeric, tax numeric, total numeric)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  item_row record;
  product_row public.products%rowtype;
  normalized_items jsonb := '[]'::jsonb;
  quantity_value integer;
  subtotal_value numeric(12,2) := 0;
begin
  if p_user_id is null or p_shipping_address is null or jsonb_typeof(p_shipping_address) <> 'object' then
    raise exception using errcode = 'P0001', message = 'invalid_checkout_details';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception using errcode = 'P0001', message = 'invalid_checkout_items';
  end if;
  if jsonb_array_length(p_items) = 0 or p_shipping_cost < 0 or p_tax < 0 then
    raise exception using errcode = 'P0001', message = 'invalid_checkout_totals';
  end if;

  for item_row in select value from jsonb_array_elements(p_items) as items(value) loop
    quantity_value := (item_row.value->>'quantity')::integer;
    if quantity_value is null or quantity_value < 1 then
      raise exception using errcode = 'P0001', message = 'invalid_checkout_quantity';
    end if;

    select * into product_row
    from public.products
    where id = (item_row.value->>'product_id')::uuid
      and lower(status) = 'active'
      and currency = 'NGN'
      and is_quote_only is not true
    for share;

    if not found or product_row.price <= 0 then
      raise exception using errcode = 'P0001', message = 'checkout_product_unavailable';
    end if;

    subtotal_value := subtotal_value + product_row.price * quantity_value;
    normalized_items := normalized_items || jsonb_build_array(jsonb_build_object(
      'product_id', product_row.id,
      'quantity', quantity_value,
      'unit_price', product_row.price
    ));
  end loop;

  if subtotal_value <= 0 then
    raise exception using errcode = 'P0001', message = 'invalid_checkout_totals';
  end if;

  subtotal := subtotal_value;
  shipping_cost := p_shipping_cost;
  tax := p_tax;
  total := subtotal + shipping_cost + tax;
  order_number := p_order_number;

  insert into public.orders (
    order_number, user_id, status, payment_status, subtotal, shipping_cost, tax, total, currency, shipping_address
  ) values (
    order_number, p_user_id, 'pending', 'pending', subtotal, shipping_cost, tax, total, 'NGN', p_shipping_address
  ) returning id into order_id;

  insert into public.order_items (order_id, product_id, quantity, unit_price)
  select order_id, item.product_id, item.quantity, item.unit_price
  from jsonb_to_recordset(normalized_items) as item(product_id uuid, quantity integer, unit_price numeric);

  return next;
end;
$$;

revoke all on function public.create_checkout_order(text, uuid, jsonb, numeric, numeric, jsonb) from public, anon, authenticated;
grant execute on function public.create_checkout_order(text, uuid, jsonb, numeric, numeric, jsonb) to service_role;

drop function public.create_paystack_pending_payment(uuid, uuid, text);

create function public.create_paystack_pending_payment(
  p_order_id uuid,
  p_user_id uuid,
  p_reference text
)
returns table (payment_id uuid, amount numeric, currency text, provider_reference text, authorization_url text)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  order_row public.orders%rowtype;
begin
  select * into order_row
  from public.orders
  where id = p_order_id
  for update;

  if not found or order_row.user_id is distinct from p_user_id then
    raise exception using errcode = 'P0002', message = 'order_not_found';
  end if;

  if order_row.payment_status <> 'pending'
    or lower(order_row.status) in ('cancelled', 'canceled') then
    raise exception using errcode = 'P0001', message = 'order_not_payable';
  end if;

  if upper(order_row.currency) <> 'NGN' then
    raise exception using errcode = 'P0001', message = 'unsupported_order_currency';
  end if;

  if order_row.total <= 0 or round(order_row.total * 100) > 9007199254740991 then
    raise exception using errcode = 'P0001', message = 'invalid_order_amount';
  end if;

  select payment.id, payment.amount, payment.currency, payment.provider_reference, payment.metadata->>'authorization_url'
  into payment_id, amount, currency, provider_reference, authorization_url
  from public.payments as payment
  where payment.order_id = p_order_id and payment.provider = 'paystack' and payment.status = 'pending';

  if found then
    return next;
    return;
  end if;

  insert into public.payments (order_id, user_id, provider, provider_reference, amount, currency, status)
  values (order_row.id, p_user_id, 'paystack', p_reference, order_row.total, order_row.currency, 'pending')
  returning id into payment_id;

  amount := order_row.total;
  currency := order_row.currency;
  provider_reference := p_reference;
  authorization_url := null;
  return next;
end;
$$;

revoke all on function public.create_paystack_pending_payment(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.create_paystack_pending_payment(uuid, uuid, text) to service_role;