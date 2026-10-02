import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/lib/env';
import { PaystackProvider } from '@/lib/payments/paystack';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const schema = z.object({
  orderId: z.string().uuid(),
});

export async function POST(request: Request) {
  let paymentId: string | undefined;
  let admin: ReturnType<typeof createSupabaseAdminClient> | undefined;

  try {
    const payload = schema.parse(await request.json());
    const sessionClient = await createSupabaseServerClient();
    const { data: { user } } = await sessionClient.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ ok: false, error: 'Sign in before starting checkout.' }, { status: 401 });
    }

    admin = createSupabaseAdminClient();
    const reference = `CA-${randomUUID()}`;
    const { data: payments, error: paymentError } = await admin.rpc('create_paystack_pending_payment', {
      p_order_id: payload.orderId,
      p_user_id: user.id,
      p_reference: reference,
    });

    if (paymentError) {
      if (paymentError.message.includes('order_not_found')) {
        return NextResponse.json({ ok: false, error: 'Order not found.' }, { status: 404 });
      }
      if (paymentError.message.includes('order_not_payable') || paymentError.message.includes('payment_in_progress')) {
        return NextResponse.json({ ok: false, error: 'Order is not payable or already has a payment in progress.' }, { status: 409 });
      }
      if (paymentError.message.includes('unsupported_order_currency') || paymentError.message.includes('invalid_order_amount')) {
        return NextResponse.json({ ok: false, error: 'Order amount or currency is invalid.' }, { status: 400 });
      }
      throw new Error('Unable to create pending payment.');
    }

    const payment = payments?.[0] as {
      payment_id: string;
      amount: number | string;
      currency: string;
      provider_reference: string;
      authorization_url: string | null;
    } | undefined;
    if (!payment) throw new Error('Unable to create pending payment.');
    paymentId = payment.payment_id;

    if (payment.authorization_url) {
      return NextResponse.json({
        ok: true,
        data: { authorization_url: payment.authorization_url, reference: payment.provider_reference },
      });
    }

    const total = Number(payment.amount);
    const amountMinorUnits = Math.round(total * 100);
    if (!Number.isSafeInteger(amountMinorUnits) || Math.abs(total * 100 - amountMinorUnits) > 0.000001) {
      throw new Error('Order amount is invalid.');
    }

    const data = await new PaystackProvider().initializePayment({
      amountMinorUnits,
      email: user.email,
      reference: payment.provider_reference,
      callbackUrl: new URL('/checkout', env.NEXT_PUBLIC_SITE_URL).toString(),
    });

    if (data.reference !== payment.provider_reference) throw new Error('Paystack returned a mismatched payment reference.');

    const { error: updateError } = await admin
      .from('payments')
      .update({ metadata: { authorization_url: data.authorization_url } })
      .eq('id', paymentId);
    if (updateError) throw new Error('Unable to save payment authorization details.');

    return NextResponse.json({ ok: true, data: { authorization_url: data.authorization_url, reference } });
  } catch (error) {
    if (paymentId && admin) {
      await admin.from('payments').update({ status: 'initialization_failed' }).eq('id', paymentId);
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'A valid order ID is required.' }, { status: 400 });
    }
    console.error('Paystack initialization failed:', error);
    return NextResponse.json({ ok: false, error: 'Unable to initialize payment.' }, { status: 500 });
  }
}
