# Security guidance

## Principles

- Validate all user input on the server with Zod.
- Never expose secret keys in client code.
- Use server-side checks for price, inventory, coupons and payment validation.
- Restrict customer access to only their own records.
- Log admin actions and protect privileged routes.

## Sensitive keys to keep out of browser code

- SUPABASE_SERVICE_ROLE_KEY
- MAILGUN_API_KEY
- PAYSTACK_SECRET_KEY
- GOOGLE_CLIENT_SECRET

## Production notes

Store these values in Vercel environment variables or in Supabase secret storage. The public keys can be exposed only where explicitly required by the client.
