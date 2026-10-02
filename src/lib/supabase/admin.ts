import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

export function createSupabaseAdminClient() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY === 'placeholder-service-role-key') {
    throw new Error('Supabase service role key is not configured.');
  }

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}