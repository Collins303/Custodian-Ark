# Production deployment checklist

Complete each provider setup against production credentials before enabling live traffic. Keep test and production projects, keys, and webhook configurations separate.

## Vercel

- [ ] Import the production branch into Vercel and attach the production domain.
- [ ] Set the production environment variables below in Vercel. Keep secret values server-only and never commit them.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin, without a trailing slash. Add the same production values to the Production environment only; configure Preview separately if needed.
- [ ] Deploy, then verify the live domain, TLS certificate, and canonical metadata.

| Variable | Production value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production Supabase publishable/anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production service-role key; server only |
| `GOOGLE_CLIENT_ID` | Google OAuth web client ID used by the app's OAuth configuration check |
| `GOOGLE_CLIENT_SECRET` | Google OAuth web client secret; keep server-only and configure in Supabase Auth too |
| `MAILGUN_API_KEY` | Mailgun API key authorized for the sending domain |
| `MAILGUN_DOMAIN` | Mailgun domain verified for production sending |
| `MAILGUN_FROM_EMAIL` | Sender address authorized for that Mailgun domain |
| `MAILGUN_FROM_NAME` | Customer-facing sender name |
| `PAYSTACK_PUBLIC_KEY` | Paystack live public key |
| `PAYSTACK_SECRET_KEY` | Paystack live secret key; server only |
| `NEXT_PUBLIC_SITE_URL` | Canonical production origin, for example `https://www.example.com` |

## Supabase

- [ ] Create a dedicated production project and apply the reviewed SQL schema/migrations to that project.
- [ ] Set the production project URL, publishable/anon key, and service-role key in the matching Vercel environment. Never expose the service-role key to browser code.
- [ ] Enable and verify Row Level Security and least-privilege policies for every table exposed to customers; do not assume creating the schema installs safe policies.
- [ ] In **Authentication → URL Configuration**, set the Site URL to the canonical production origin and add `https://<production-domain>/auth/callback` to the allowed redirect URLs. Add only the exact alternate production host if it is used.
- [ ] Confirm email templates, SMTP/delivery settings, and production auth flows. Test signup, confirmation, login, logout, and password recovery on the live domain.

## Google OAuth

- [ ] Configure the Google OAuth consent screen, publishing status, and authorized domains for the production site.
- [ ] Create/use a Web application OAuth client. In Google Cloud, register the production site origin as an authorized JavaScript origin and `https://<project-ref>.supabase.co/auth/v1/callback` as the authorized redirect URI. Use the exact callback shown by the Supabase project if a custom auth domain is configured.
- [ ] In **Supabase Authentication → Providers → Google**, enable Google and enter that OAuth client ID and secret. Set the same credentials in Vercel as required by `.env.example`; the app checks `GOOGLE_CLIENT_ID` before starting Google sign-in.
- [ ] Confirm the production `/auth/callback` URL is allowed in Supabase redirect settings, then test a complete sign-in and sign-out on the production domain.

## Paystack webhooks

- [ ] Configure Paystack with live keys only after the payment flow has passed test-mode verification. Set the live public and secret keys in Vercel.
- [ ] Register `https://<production-domain>/api/paystack/webhook` in the Paystack dashboard using the exact production domain and HTTPS.
- [ ] Apply `supabase/migrations/20261001000000_paystack_production_processing.sql` and `supabase/migrations/20261001000100_checkout_order_flow.sql` to existing Supabase projects before deploying checkout. New projects can apply `supabase/schema.sql`. Resolve duplicate provider references or pending Paystack payments before adding the unique indexes.
- [ ] Checkout requires a signed-in user. The server creates the order and line items from active Supabase product prices; never accept browser-submitted prices or totals.
- [ ] Review the current checkout fee values (`₦28,000` shipping and `₦55,000` VAT) against the business's production delivery and tax rules before launch.
- [ ] Confirm the webhook validates `x-paystack-signature` with HMAC SHA-512 over the raw request bytes and independently verifies reference, status, amount, and currency through Paystack's transaction verification API.
- [ ] Send a test-mode event first and confirm delivery, response status, and server logs. After switching to live mode, make a low-value controlled payment and verify its reference, amount, currency, and final status server-side before fulfilling an order.
- [ ] Make webhook processing idempotent so retries cannot fulfill or record the same payment twice.

**Checkout integration still required:** the current `/checkout` page is a static presentation and does not create an order or call `/api/paystack/initialize`. Connect the customer/cart UI to a server-side order-creation flow before treating the customer-facing checkout as live. The initialization endpoint intentionally rejects arbitrary client amounts and requires an existing order owned by the signed-in user.

## Mailgun domain verification

- [ ] Choose the production sending domain in Mailgun (a dedicated sending subdomain such as `mg.example.com` is recommended) and set that exact domain in `MAILGUN_DOMAIN`.
- [ ] Add every DNS record Mailgun lists for the domain at the authoritative DNS provider. This typically includes SPF and DKIM records; add tracking CNAME and MX records when Mailgun enables those features. Use Mailgun's exact hostnames and values rather than copied examples.
- [ ] Avoid publishing multiple SPF records for one hostname; merge authorized senders into the existing SPF record if one already exists.
- [ ] Wait for DNS propagation, refresh Mailgun's domain page, and confirm the domain is verified and sending is enabled. Set `MAILGUN_FROM_EMAIL` to an address permitted by the verified sending domain.
- [ ] Set the Mailgun API key and sender values in Vercel, deploy, then send a production test email and confirm delivery, authentication results, and bounce handling.

## Go-live verification

- [ ] Confirm production uses only production Supabase, Google, Mailgun, and Paystack credentials; no test keys or placeholder defaults remain.
- [ ] Exercise production auth, a Mailgun test message, and the Paystack flow in test mode before enabling live payments.
- [ ] Review Vercel and provider logs for failed callbacks, rejected DNS/authentication, and webhook retries. Keep credentials out of logs and browser bundles.
- [ ] Confirm canonical URLs, metadata, and Open Graph URLs use the live production domain.
