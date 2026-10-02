import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isValidPaystackSignature, PaystackProvider } from '@/lib/payments/paystack';

export const runtime = 'nodejs';

const schema = z.object({
  event: z.string(),
  data: z.object({ reference: z.string().optional() }).passthrough(),
}).passthrough();

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 1_000_000) {
    return NextResponse.json({ ok: false, error: 'Payload too large.' }, { status: 413 });
  }

  let rawBody: Uint8Array;
  try {
    rawBody = new Uint8Array(await request.arrayBuffer());
  } catch {
    return NextResponse.json({ ok: false, error: 'Unable to read webhook payload.' }, { status: 400 });
  }

  if (rawBody.byteLength > 1_000_000) {
    return NextResponse.json({ ok: false, error: 'Payload too large.' }, { status: 413 });
  }

  try {
    if (!isValidPaystackSignature(rawBody, request.headers.get('x-paystack-signature'))) {
      return NextResponse.json({ ok: false, error: 'Invalid Paystack signature.' }, { status: 401 });
    }
  } catch (error) {
    console.error('Paystack webhook configuration error:', error);
    return NextResponse.json({ ok: false, error: 'Webhook is not configured.' }, { status: 503 });
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(new TextDecoder().decode(rawBody));
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const parsedPayload = schema.safeParse(parsedBody);
  if (!parsedPayload.success) {
    return NextResponse.json({ ok: false, error: 'Invalid Paystack webhook payload.' }, { status: 400 });
  }

  try {
    const result = await new PaystackProvider().handleWebhook(parsedPayload.data);
    if (['unmatched', 'order_already_paid', 'order_not_payable', 'amount_mismatch', 'currency_mismatch', 'verification_mismatch'].includes(result)) {
      console.error('Paystack webhook requires review:', result, parsedPayload.data.data.reference);
    }
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error('Paystack webhook processing failed:', error);
    return NextResponse.json({ ok: false, error: 'Unable to process Paystack webhook.' }, { status: 500 });
  }
}
