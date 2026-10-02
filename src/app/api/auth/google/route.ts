import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const requestBody = await request.json().catch(() => ({})) as { next?: unknown };
  const requestedNext = typeof requestBody.next === 'string' ? requestBody.next : '/account';
  const next = requestedNext.startsWith('/') && !requestedNext.startsWith('//') && !requestedNext.includes('\\')
    ? requestedNext
    : '/account';
  const callbackUrl = new URL('/auth/callback', origin);
  callbackUrl.searchParams.set('next', next);
  const supabase = await createSupabaseServerClient();

  if (!env.GOOGLE_CLIENT_ID) {
    return NextResponse.json({ error: 'Google OAuth is not configured.' }, { status: 400 });
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl.toString(),
    },
  });

  if (error || !data.url) {
    return NextResponse.json({ error: error?.message ?? 'Unable to start Google sign-in.' }, { status: 400 });
  }

  return NextResponse.json({ url: data.url });
}
