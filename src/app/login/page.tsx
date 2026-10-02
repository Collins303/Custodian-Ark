'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function getReturnPath() {
    const requestedPath = new URLSearchParams(window.location.search).get('next');
    if (!requestedPath?.startsWith('/') || requestedPath.startsWith('//') || requestedPath.includes('\\')) {
      return '/account';
    }
    return requestedPath;
  }

  async function handleEmailLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? 'Unable to log in.');
      return;
    }

    router.push(getReturnPath());
    router.refresh();
  }

  async function handleGoogleLogin() {
    setError('');
    try {
      const supabase = createSupabaseBrowserClient();
      const callbackUrl = new URL('/auth/callback', window.location.origin);
      callbackUrl.searchParams.set('next', getReturnPath());

      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: callbackUrl.toString() },
      });

      if (googleError) {
        setError(googleError.message || 'Google sign-in is not available right now.');
      }
    } catch {
      setError('Supabase Google sign-in is not configured.');
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-12 sm:px-6">
      <div className="grid w-full gap-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl lg:grid-cols-2">
        <div className="rounded-[1.5rem] bg-slate-900 p-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Member access</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Sign in to your Custodian Ark account.</h1>
          <p className="mt-4 text-slate-300">Manage your orders, wishlist, power system documents and service requests from one secure dashboard.</p>
        </div>

        <div className="p-2">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-emerald-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-emerald-400"
              />
            </label>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button type="submit" className="w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25">
              Sign in
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            or
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-2 4.6-4.3 6l6.8 5.3c4-3.7 6.1-9.1 6.1-15z" />
              <path fill="#34A853" d="M24 44c5.6 0 10.3-1.9 13.7-5.1l-6.8-5.3c-1.9 1.3-4.2 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4l-7.1 5.5C7 39.4 14.8 44 24 44z" />
              <path fill="#FBBC05" d="M12.6 27.2a12 12 0 0 1 0-6.4l-7.1-5.5a20 20 0 0 0 0 17.4z" />
              <path fill="#EA4335" d="M24 9.5c3.1 0 5.9 1.1 8.1 3.2l6.1-6.1C34.5 3.5 29.7 1.5 24 1.5 14.8 1.5 7 6.1 3.5 12.8l7.1 5.5C12.2 13 17.4 9.5 24 9.5z" />
            </svg>
            Sign in with Google
          </button>

          <p className="mt-5 text-sm text-slate-600">
            Need an account?{' '}
            <Link href="/signup" className="font-semibold text-emerald-700">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
