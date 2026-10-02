# Paystack setup

1. Create a Paystack account and a business profile.
2. Retrieve the public and secret keys.
3. Configure webhook endpoints in the Paystack dashboard.
4. Add the keys to `.env.local` and Vercel environment variables.
5. Verify transaction status server-side before creating orders.

## Webhook handling

- Validate event signatures.
- Ignore duplicate callbacks using idempotency keys.
- Update payment status and order state only after server-side verification.
