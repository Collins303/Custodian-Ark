import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { products } from '@/lib/site-data';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(32),
  street: z.string().trim().min(4).max(200),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  items: z.array(z.object({
    productId: z.string().min(1).max(80),
    quantity: z.number().int().min(1).max(99),
  })).min(1).max(20).refine((items) => new Set(items.map((item) => item.productId)).size === items.length),
});

const checkoutShipping = 28_000;
const checkoutTax = 55_000;

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json());
    const sessionClient = await createSupabaseServerClient();
    const { data: { user } } = await sessionClient.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ ok: false, error: 'Sign in before placing your order.' }, { status: 401 });
    }

    const requestedIds = new Set(payload.items.map((item) => item.productId));
    const catalog = products.filter((product) => requestedIds.has(product.id));
    if (catalog.length !== requestedIds.size) {
      return NextResponse.json({ ok: false, error: 'Your cart contains an unavailable product.' }, { status: 400 });
    }
    if (payload.items.some((item) => item.quantity > (products.find((product) => product.id === item.productId)?.stock ?? 0))) {
      return NextResponse.json({ ok: false, error: 'A requested quantity is unavailable.' }, { status: 409 });
    }

    const admin = createSupabaseAdminClient();
    const slugs = catalog.map((product) => product.slug);
    const { data: existingProducts, error: lookupError } = await admin
      .from('products')
      .select('id, slug')
      .in('slug', slugs);
    if (lookupError) throw new Error('Unable to load checkout products.');

    const existingSlugs = new Set((existingProducts ?? []).map((product) => product.slug));
    const missingProducts = catalog.filter((product) => !existingSlugs.has(product.slug));
    if (missingProducts.length) {
      const { error: seedError } = await admin.from('products').upsert(
        missingProducts.map((product) => ({
          sku: product.id,
          slug: product.slug,
          name: product.name,
          description: product.description,
          short_description: product.shortDescription,
          price: product.price,
          currency: 'NGN',
          status: 'active',
        })),
        { onConflict: 'slug', ignoreDuplicates: true },
      );
      if (seedError) throw new Error('Unable to prepare checkout products.');
    }

    const { data: databaseProducts, error: productsError } = await admin
      .from('products')
      .select('id, slug, name, price, currency, status, is_quote_only')
      .in('slug', slugs);
    if (productsError) throw new Error('Unable to load checkout product prices.');

    const productsBySlug = new Map((databaseProducts ?? []).map((product) => [product.slug, product]));
    const orderItems = payload.items.map((item) => {
      const product = catalog.find((candidate) => candidate.id === item.productId);
      if (!product) throw new Error('Checkout catalog is incomplete.');
      const databaseProduct = productsBySlug.get(product.slug);
      if (
        !databaseProduct ||
        databaseProduct.status !== 'active' ||
        databaseProduct.is_quote_only ||
        databaseProduct.currency.toUpperCase() !== 'NGN' ||
        Number(databaseProduct.price) <= 0
      ) {
        throw new Error('A checkout product is unavailable.');
      }

      return {
        product_id: databaseProduct.id,
        quantity: item.quantity,
        name: databaseProduct.name,
        unitPrice: Number(databaseProduct.price),
      };
    });

    const { data: orders, error: orderError } = await admin.rpc('create_checkout_order', {
      p_order_number: `CA-${randomUUID()}`,
      p_user_id: user.id,
      p_shipping_address: {
        full_name: payload.fullName,
        email: user.email,
        phone: payload.phone,
        street: payload.street,
        city: payload.city,
        state: payload.state,
      },
      p_shipping_cost: checkoutShipping,
      p_tax: checkoutTax,
      p_items: orderItems.map(({ product_id, quantity }) => ({ product_id, quantity })),
    });

    if (orderError) throw new Error('Unable to create order.');
    const order = orders?.[0] as {
      order_id: string;
      subtotal: number | string;
      shipping_cost: number | string;
      tax: number | string;
      total: number | string;
    } | undefined;
    if (!order) throw new Error('Unable to create order.');

    return NextResponse.json({
      ok: true,
      order: {
        id: order.order_id,
        subtotal: Number(order.subtotal),
        shippingCost: Number(order.shipping_cost),
        tax: Number(order.tax),
        total: Number(order.total),
        items: orderItems.map(({ name, unitPrice, quantity }) => ({ name, unitPrice, quantity })),
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Check your name, phone, and shipping address.' }, { status: 400 });
    }
    console.error('Order creation failed:', error);
    return NextResponse.json({ ok: false, error: 'Unable to create your order right now.' }, { status: 500 });
  }
}