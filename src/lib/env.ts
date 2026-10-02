import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().default('https://placeholder.supabase.co'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default('placeholder-anon-key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('placeholder-service-role-key'),
  GOOGLE_CLIENT_ID: z.string().default(''),
  GOOGLE_CLIENT_SECRET: z.string().default(''),
  MAILGUN_API_KEY: z.string().default(''),
  MAILGUN_DOMAIN: z.string().default(''),
  MAILGUN_FROM_EMAIL: z.string().default('hello@custodianark.com'),
  MAILGUN_FROM_NAME: z.string().default('Custodian Ark'),
  PAYSTACK_PUBLIC_KEY: z.string().default(''),
  PAYSTACK_SECRET_KEY: z.string().default(''),
  NEXT_PUBLIC_SITE_URL: z.string().default('http://localhost:3000'),
});

export const env = envSchema.parse(process.env);
