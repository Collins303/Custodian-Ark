import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">404</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you requested could not be found.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
          Return home
        </Link>
      </div>
    </main>
  );
}
