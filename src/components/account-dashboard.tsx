'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Heart, LoaderCircle, LogOut, PackageCheck, UserRound } from 'lucide-react';

type AccountOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  createdAt: string;
};

type AccountDashboardProps = {
  email: string;
  fullName: string;
  phone: string | null;
  memberSince: string;
  orders: AccountOrder[];
  ordersError: string | null;
};

const tabs = [
  { id: 'orders', label: 'Recent Orders', icon: PackageCheck },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'profile', label: 'Profile Details', icon: UserRound },
] as const;

type TabId = typeof tabs[number]['id'];

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(value));
}

function formatStatus(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function AccountDashboard({ email, fullName, phone, memberSince, orders, ordersError }: AccountDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('orders');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');

  async function handleSignOut() {
    setIsSigningOut(true);
    setSignOutError('');

    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Unable to sign out right now.');
      window.location.assign('/login');
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : 'Unable to sign out right now.');
      setIsSigningOut(false);
    }
  }

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const nextIndex = event.key === 'ArrowRight'
      ? (currentIndex + 1) % tabs.length
      : event.key === 'ArrowLeft'
        ? (currentIndex - 1 + tabs.length) % tabs.length
        : -1;

    if (nextIndex < 0) return;
    event.preventDefault();
    setActiveTab(tabs[nextIndex].id);
    document.getElementById(`account-tab-${tabs[nextIndex].id}`)?.focus();
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="relative overflow-hidden rounded-3xl bg-ink-950 p-6 text-white shadow-[0_30px_70px_-45px_rgba(10,18,36,0.65)] sm:p-9">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,165,36,0.16),transparent_42%)]" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-solar-300">Customer account</p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Welcome back, {fullName}</h1>
            <p className="mt-2 text-sm text-slate-300">Your orders, saved products, and account details.</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/35 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:cursor-wait disabled:opacity-60"
          >
            {isSigningOut ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            {isSigningOut ? 'Signing out' : 'Sign out'}
          </button>
        </div>
        {signOutError ? <p role="alert" className="relative mt-4 text-sm text-rose-300">{signOutError}</p> : null}
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_16px_50px_-42px_rgba(10,18,36,0.35)]">
        <div role="tablist" aria-label="Account sections" className="flex gap-1 overflow-x-auto border-b border-slate-200/70 px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-5">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`account-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`account-panel-${id}`}
              tabIndex={activeTab === id ? 0 : -1}
              onClick={() => setActiveTab(id)}
              onKeyDown={handleTabKeyDown}
              className={`inline-flex h-14 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-semibold transition-colors sm:px-4 ${activeTab === id ? 'border-solar-500 text-ink-900' : 'border-transparent text-slate-500 hover:text-ink-900'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-inset`}
            >
              <Icon className={`h-4 w-4 ${activeTab === id ? 'text-emerald-700' : ''}`} />
              {label}
            </button>
          ))}
        </div>

        <div id={`account-panel-${activeTab}`} role="tabpanel" aria-labelledby={`account-tab-${activeTab}`} className="p-5 sm:p-8">
          {activeTab === 'orders' ? (
            <div>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-ink-900">Recent orders</h2>
                  <p className="mt-1 text-sm text-slate-500">Your latest purchases and payment status.</p>
                </div>
                <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800">
                  Continue shopping <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {ordersError ? <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{ordersError}</p> : orders.length ? (
                <ul className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <li key={order.id} className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-ink-900">{order.orderNumber}</p>
                        <p className="mt-1 text-sm text-slate-500">Placed {formatDate(order.createdAt)}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{formatStatus(order.status)}</span>
                        <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>{formatStatus(order.paymentStatus)}</span>
                        <span className="w-full font-display text-base font-bold tabular-nums text-ink-900 sm:w-auto sm:pl-3">{formatAmount(order.total, order.currency)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
                  <PackageCheck className="mx-auto h-8 w-8 text-slate-400" />
                  <h3 className="mt-4 font-semibold text-ink-900">No orders yet</h3>
                  <p className="mt-2 text-sm text-slate-500">Your completed and in-progress orders will appear here.</p>
                  <Link href="/shop" className="mt-5 inline-flex h-10 items-center rounded-xl bg-solar-400 px-4 text-sm font-semibold text-ink-950 transition hover:bg-solar-300">Browse products</Link>
                </div>
              )}
            </div>
          ) : null}

          {activeTab === 'wishlist' ? (
            <div>
              <div className="mb-6">
                <h2 className="font-display text-xl font-bold text-ink-900">Wishlist</h2>
                <p className="mt-1 text-sm text-slate-500">Keep the equipment you’re considering close at hand.</p>
              </div>
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
                <Heart className="mx-auto h-8 w-8 text-slate-400" />
                <h3 className="mt-4 font-semibold text-ink-900">No saved products</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">Wishlist syncing isn’t available yet. Browse the catalog to find a system that fits your needs.</p>
                <Link href="/shop" className="mt-5 inline-flex h-10 items-center rounded-xl bg-solar-400 px-4 text-sm font-semibold text-ink-950 transition hover:bg-solar-300">Explore products</Link>
              </div>
            </div>
          ) : null}

          {activeTab === 'profile' ? (
            <div>
              <div className="mb-6">
                <h2 className="font-display text-xl font-bold text-ink-900">Profile details</h2>
                <p className="mt-1 text-sm text-slate-500">The contact information associated with your account.</p>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Full name</dt>
                  <dd className="mt-2 font-medium text-ink-900">{fullName}</dd>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Email address</dt>
                  <dd className="mt-2 break-all font-medium text-ink-900">{email}</dd>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Phone</dt>
                  <dd className="mt-2 font-medium text-ink-900">{phone || 'Not added'}</dd>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white p-5">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Member since</dt>
                  <dd className="mt-2 font-medium text-ink-900">{formatDate(memberSince)}</dd>
                </div>
              </dl>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}