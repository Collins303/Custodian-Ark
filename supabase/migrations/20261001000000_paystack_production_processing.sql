create unique index if not exists payments_provider_reference_unique
  on public.payments (provider, provider_reference)
  where provider_reference is not null;

create unique index if not exists payments_one_pending_paystack_per_order
  on public.payments (order_id)
  where provider = 'paystack' and status = 'pending' and order_id is not null;

create or replace function public.create_paystack_pending_payment(
  p_order_id uuid,
  p_user_id uuid,
  p_reference text
)
returns table (payment_id uuid, amount numeric, currency text)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  order_row public.orders%rowtype;
  pending_payment_id uuid;
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

  select id into pending_payment_id
  from public.payments
  where order_id = p_order_id and provider = 'paystack' and status = 'pending';

  if found then
    raise exception using errcode = 'P0001', message = 'payment_in_progress';
  end if;

  insert into public.payments (order_id, user_id, provider, provider_reference, amount, currency, status)
  values (order_row.id, p_user_id, 'paystack', p_reference, order_row.total, order_row.currency, 'pending')
  returning id into payment_id;

  amount := order_row.total;
  currency := order_row.currency;
  return next;
end;
$$;

revoke all on function public.create_paystack_pending_payment(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.create_paystack_pending_payment(uuid, uuid, text) to service_role;

create or replace function public.process_paystack_charge_event(
  p_reference text,
  p_transaction_status text,
  p_amount_minor bigint,
  p_currency text,
  p_payload jsonb
)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  payment_row public.payments%rowtype;
  order_row public.orders%rowtype;
begin
  if p_transaction_status not in ('success', 'failed') then
    return 'ignored';
  end if;

  select * into payment_row
  from public.payments
  where provider = 'paystack' and provider_reference = p_reference
  for update;

  if not found then
    return 'unmatched';
  end if;

  if payment_row.order_id is null then
    return 'order_not_payable';
  end if;

  select * into order_row
  from public.orders
  where id = payment_row.order_id
  for update;

  if not found then
    return 'order_not_payable';
  end if;

  if upper(payment_row.currency) <> upper(p_currency)
    or upper(order_row.currency) <> upper(p_currency) then
    insert into public.payment_events (payment_id, event_name, payload)
    values (payment_row.id, 'paystack.currency_mismatch', p_payload);
    return 'currency_mismatch';
  end if;

  if round(payment_row.amount * 100)::bigint <> p_amount_minor
    or round(order_row.total * 100)::bigint <> p_amount_minor then
    insert into public.payment_events (payment_id, event_name, payload)
    values (payment_row.id, 'paystack.amount_mismatch', p_payload);
    return 'amount_mismatch';
  end if;

  if p_transaction_status = 'failed' then
    if payment_row.status = 'pending' then
      update public.payments set status = 'failed', updated_at = now() where id = payment_row.id;
      insert into public.payment_events (payment_id, event_name, payload)
      values (payment_row.id, 'charge.failed', p_payload);
      return 'failed';
    end if;
    return 'duplicate';
  end if;

  if payment_row.status = 'success' then
    return 'duplicate';
  end if;

  if order_row.payment_status <> 'pending'
    or lower(order_row.status) in ('cancelled', 'canceled') then
    update public.payments set status = 'review_required', updated_at = now() where id = payment_row.id;
    insert into public.payment_events (payment_id, event_name, payload)
    values (payment_row.id, 'charge.success.review_required', p_payload);
    return 'order_not_payable';
  end if;

  update public.payments set status = 'success', updated_at = now() where id = payment_row.id;
  update public.orders
  set payment_status = 'paid',
      status = case when lower(status) = 'pending' then 'processing' else status end,
      updated_at = now()
  where id = order_row.id;
  insert into public.payment_events (payment_id, event_name, payload)
  values (payment_row.id, 'charge.success', p_payload);

  return 'processed';
end;
$$;

revoke all on function public.process_paystack_charge_event(text, text, bigint, text, jsonb) from public, anon, authenticated;
grant execute on function public.process_paystack_charge_event(text, text, bigint, text, jsonb) to service_role;