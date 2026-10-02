import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '@/lib/env';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export type InitializePaymentPayload = {
  amountMinorUnits: number;
  email: string;
  reference: string;
  callbackUrl: string;
};

type PaystackTransaction = {
  status?: string;
  reference?: string;
  amount?: number;
  currency?: string;
};

type PaystackWebhookPayload = {
  event: string;
  data: { reference?: string; [key: string]: unknown };
};

export function isValidPaystackSignature(rawBody: Uint8Array, signature: string | null) {
  if (!env.PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack secret key is not configured.');
  }

  if (!signature || !/^[a-f\d]{128}$/i.test(signature)) return false;

  const expected = createHmac('sha512', env.PAYSTACK_SECRET_KEY).update(rawBody).digest();
  const received = Buffer.from(signature, 'hex');
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export class PaystackProvider {
  async initializePayment({ amountMinorUnits, email, reference, callbackUrl }: InitializePaymentPayload) {
    if (!env.PAYSTACK_SECRET_KEY) {
      throw new Error('Paystack secret key is not configured.');
    }

    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountMinorUnits,
        email,
        reference,
        callback_url: callbackUrl,
        currency: 'NGN',
      }),
    });

    const payload = await response.json() as {
      status?: boolean;
      data?: { authorization_url?: string; reference?: string };
    };
    if (!response.ok || payload.status !== true || !payload.data?.authorization_url) {
      throw new Error('Unable to initialize Paystack transaction.');
    }

    return payload.data;
  }

  async verifyPayment(reference: string) {
    if (!env.PAYSTACK_SECRET_KEY) {
      throw new Error('Paystack secret key is not configured.');
    }

    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      },
      cache: 'no-store',
    });

    const payload = await response.json() as {
      status?: boolean;
      data?: PaystackTransaction;
    };
    if (!response.ok || payload.status !== true || !payload.data) {
      throw new Error('Unable to verify Paystack payment.');
    }

    return payload.data;
  }

  async refundPayment(reference: string, amount?: number) {
    if (!env.PAYSTACK_SECRET_KEY) {
      throw new Error('Paystack secret key is not configured.');
    }

    const response = await fetch(`${PAYSTACK_BASE_URL}/refund`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transaction: reference, amount: amount ? Math.round(amount) : undefined }),
    });

    if (!response.ok) {
      throw new Error('Unable to process payment refund.');
    }

    return response.json();
  }

  async handleWebhook(payload: PaystackWebhookPayload) {
    if (payload.event !== 'charge.success' && payload.event !== 'charge.failed') {
      return 'ignored';
    }

    const reference = payload.data.reference;
    if (!reference) throw new Error('Paystack event is missing a transaction reference.');

    const transaction = await this.verifyPayment(reference);
    const expectedStatus = payload.event === 'charge.success' ? 'success' : 'failed';
    if (
      transaction.status !== expectedStatus ||
      transaction.reference !== reference ||
      !Number.isSafeInteger(transaction.amount) ||
      !transaction.amount ||
      !transaction.currency
    ) {
      return 'verification_mismatch';
    }

    const { data, error } = await createSupabaseAdminClient().rpc('process_paystack_charge_event', {
      p_reference: reference,
      p_transaction_status: transaction.status,
      p_amount_minor: transaction.amount,
      p_currency: transaction.currency,
      p_payload: transaction,
    });

    if (error) throw new Error('Unable to apply verified Paystack transaction.');
    return data as string;
  }
}
