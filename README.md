# Custodian Ark

Custodian Ark is a premium solar energy and power equipment platform built with Next.js, TypeScript and Tailwind CSS. The storefront combines product catalog experiences, solar solution design, technical content and administrative dashboards for a real commercial brand experience.

## Features

- Premium storefront and company branding
- Product catalog and dynamic product pages
- Solar sizing calculator with estimated system recommendations
- Contact, quote and newsletter API routes
- Services and solar solutions sections
- Admin overview dashboard
- Responsive, SEO-friendly layout structure

## Local development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Environment variables

Copy `.env.example` to `.env.local` and fill in the required values for Supabase, Google OAuth, Mailgun and Paystack.

## Production deployment

This project is designed for Vercel deployment. Configure production environment variables in the Vercel dashboard and set the production domain before launch.

## Important status

This is a working storefront foundation with actual pages, app structure and validation. External services such as Supabase Auth, Paystack and Mailgun require live credentials before full production activation.
