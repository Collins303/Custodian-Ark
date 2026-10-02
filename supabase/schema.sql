create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  parent_id uuid references categories(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sku text not null unique,
  description text,
  short_description text,
  brand_id uuid references brands(id) on delete set null,
  price numeric(12,2) not null default 0,
  compare_at_price numeric(12,2),
  cost_price numeric(12,2),
  currency text not null default 'NGN',
  status text not null default 'draft',
  featured boolean default false,
  bestseller boolean default false,
  new_arrival boolean default false,
  is_quote_only boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists product_categories (
  product_id uuid not null references products(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  primary key (product_id, category_id)
);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  sku text not null unique,
  name text not null,
  price numeric(12,2) not null default 0,
  stock_quantity integer not null default 0,
  attributes jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete cascade,
  url text not null,
  alt text,
  sort_order integer default 0,
  is_main boolean default false,
  created_at timestamptz default now() not null
);

create table if not exists product_specifications (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  specification_name text not null,
  specification_value text not null,
  sort_order integer default 0,
  created_at timestamptz default now() not null
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  title text,
  comment text,
  verified_purchase boolean default false,
  approved boolean default false,
  created_at timestamptz default now() not null
);

create table if not exists carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  session_id text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references carts(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete set null,
  quantity integer not null default 1,
  unit_price numeric(12,2) not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending',
  payment_status text not null default 'pending',
  subtotal numeric(12,2) not null default 0,
  shipping_cost numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  currency text not null default 'NGN',
  shipping_address jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  variant_id uuid references product_variants(id),
  quantity integer not null default 1,
  unit_price numeric(12,2) not null,
  created_at timestamptz default now() not null
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  provider text not null,
  provider_reference text,
  amount numeric(12,2) not null,
  currency text not null default 'NGN',
  status text not null default 'pending',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists payment_events (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references payments(id) on delete cascade,
  event_name text not null,
  payload jsonb,
  created_at timestamptz default now() not null
);

create unique index if not exists payments_provider_reference_unique
  on payments (provider, provider_reference)
  where provider_reference is not null;

create unique index if not exists payments_one_pending_paystack_per_order
  on payments (order_id)
  where provider = 'paystack' and status = 'pending' and order_id is not null;

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
  product_row products%rowtype;
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
    from products
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

  insert into orders (
    order_number, user_id, status, payment_status, subtotal, shipping_cost, tax, total, currency, shipping_address
  ) values (
    order_number, p_user_id, 'pending', 'pending', subtotal, shipping_cost, tax, total, 'NGN', p_shipping_address
  ) returning id into order_id;

  insert into order_items (order_id, product_id, quantity, unit_price)
  select order_id, item.product_id, item.quantity, item.unit_price
  from jsonb_to_recordset(normalized_items) as item(product_id uuid, quantity integer, unit_price numeric);

  return next;
end;
$$;

revoke all on function public.create_checkout_order(text, uuid, jsonb, numeric, numeric, jsonb) from public, anon, authenticated;
grant execute on function public.create_checkout_order(text, uuid, jsonb, numeric, numeric, jsonb) to service_role;

drop function if exists public.create_paystack_pending_payment(uuid, uuid, text);

create or replace function public.create_paystack_pending_payment(
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
  order_row orders%rowtype;
begin
  select * into order_row
  from orders
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
  from payments
  as payment
  where order_id = p_order_id and provider = 'paystack' and status = 'pending';

  if found then
    return next;
    return;
  end if;

  insert into payments (order_id, user_id, provider, provider_reference, amount, currency, status)
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
  payment_row payments%rowtype;
  order_row orders%rowtype;
begin
  if p_transaction_status not in ('success', 'failed') then
    return 'ignored';
  end if;

  select * into payment_row
  from payments
  where provider = 'paystack' and provider_reference = p_reference
  for update;

  if not found then
    return 'unmatched';
  end if;

  if payment_row.order_id is null then
    return 'order_not_payable';
  end if;

  select * into order_row
  from orders
  where id = payment_row.order_id
  for update;

  if not found then
    return 'order_not_payable';
  end if;

  if upper(payment_row.currency) <> upper(p_currency)
    or upper(order_row.currency) <> upper(p_currency) then
    insert into payment_events (payment_id, event_name, payload)
    values (payment_row.id, 'paystack.currency_mismatch', p_payload);
    return 'currency_mismatch';
  end if;

  if round(payment_row.amount * 100)::bigint <> p_amount_minor
    or round(order_row.total * 100)::bigint <> p_amount_minor then
    insert into payment_events (payment_id, event_name, payload)
    values (payment_row.id, 'paystack.amount_mismatch', p_payload);
    return 'amount_mismatch';
  end if;

  if p_transaction_status = 'failed' then
    if payment_row.status = 'pending' then
      update payments set status = 'failed', updated_at = now() where id = payment_row.id;
      insert into payment_events (payment_id, event_name, payload)
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
    update payments set status = 'review_required', updated_at = now() where id = payment_row.id;
    insert into payment_events (payment_id, event_name, payload)
    values (payment_row.id, 'charge.success.review_required', p_payload);
    return 'order_not_payable';
  end if;

  update payments set status = 'success', updated_at = now() where id = payment_row.id;
  update orders
  set payment_status = 'paid',
      status = case when lower(status) = 'pending' then 'processing' else status end,
      updated_at = now()
  where id = order_row.id;
  insert into payment_events (payment_id, event_name, payload)
  values (payment_row.id, 'charge.success', p_payload);

  return 'processed';
end;
$$;

revoke all on function public.process_paystack_charge_event(text, text, bigint, text, jsonb) from public, anon, authenticated;
grant execute on function public.process_paystack_charge_event(text, text, bigint, text, jsonb) to service_role;

create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete cascade,
  stock_quantity integer not null default 0,
  reserved_quantity integer not null default 0,
  low_stock_threshold integer not null default 5,
  updated_at timestamptz default now() not null
);

create table if not exists inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  inventory_id uuid not null references inventory(id) on delete cascade,
  type text not null,
  quantity integer not null,
  note text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null
);

create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  company text,
  email text not null,
  phone text,
  product text,
  quantity text,
  project_type text,
  location text,
  message text,
  status text not null default 'new',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists installation_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  phone text not null,
  email text not null,
  location text not null,
  preferred_date date,
  property_type text,
  additional_information text,
  status text not null default 'requested',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists service_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  service_name text not null,
  description text,
  status text not null default 'new',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists wholesale_inquiries (
  id uuid primary key default gen_random_uuid(),
  company text,
  contact_name text,
  email text,
  phone text,
  products text,
  estimated_quantity text,
  project_details text,
  delivery_location text,
  message text,
  status text default 'new',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  created_at timestamptz default now() not null
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text default 'active',
  created_at timestamptz default now() not null
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists store_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz default now() not null
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz default now() not null
);

create table if not exists solar_calculator_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  payload jsonb not null,
  created_at timestamptz default now() not null
);

create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null,
  value numeric(12,2) not null,
  minimum_order numeric(12,2),
  expiry_date timestamptz,
  usage_limit integer,
  active boolean default true,
  created_at timestamptz default now() not null
);

create table if not exists coupon_usage (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid references coupons(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  order_id uuid references orders(id) on delete cascade,
  created_at timestamptz default now() not null
);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on profiles for each row execute procedure update_updated_at();
create trigger update_categories_updated_at before update on categories for each row execute procedure update_updated_at();
create trigger update_brands_updated_at before update on brands for each row execute procedure update_updated_at();
create trigger update_products_updated_at before update on products for each row execute procedure update_updated_at();
create trigger update_product_variants_updated_at before update on product_variants for each row execute procedure update_updated_at();
create trigger update_orders_updated_at before update on orders for each row execute procedure update_updated_at();
create trigger update_inventory_updated_at before update on inventory for each row execute procedure update_updated_at();
create trigger update_quote_requests_updated_at before update on quote_requests for each row execute procedure update_updated_at();
create trigger update_installation_requests_updated_at before update on installation_requests for each row execute procedure update_updated_at();
create trigger update_service_requests_updated_at before update on service_requests for each row execute procedure update_updated_at();
create trigger update_wholesale_inquiries_updated_at before update on wholesale_inquiries for each row execute procedure update_updated_at();
create trigger update_blog_posts_updated_at before update on blog_posts for each row execute procedure update_updated_at();
create trigger update_store_settings_updated_at before update on store_settings for each row execute procedure update_updated_at();

create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_brand on products(brand_id);
create index if not exists idx_product_variants_product on product_variants(product_id);
create index if not exists idx_carts_user_id on carts(user_id);
create index if not exists idx_orders_user_id on orders(user_id);
create index if not exists idx_quotes_email on quote_requests(email);
create index if not exists idx_installation_email on installation_requests(email);
create index if not exists idx_newsletter_email on newsletter_subscribers(email);
