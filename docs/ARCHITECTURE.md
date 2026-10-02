# Architecture

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Mailgun
- Paystack
- Zod validation

## Application structure

- App Router pages for storefront, product, contact and admin views
- Shared library data and reusable components
- API routes for contact, newsletter and quote handling
- Strong separation between UI, validation and business logic

## Recommended production path

1. Connect Supabase Postgres database and set up migration folder.
2. Add Supabase Auth with email and Google OAuth.
3. Add Mailgun transactional templates.
4. Configure Paystack payments and webhook verification.
5. Add admin authorization rules and RLS policies.
6. Deploy to Vercel with environment variables configured securely.

## Current implementation status

This repository includes the storefront shell, product catalog, solar calculator and admin dashboard UI. External services are configured for integration but require credentials to activate in production.
