'use client';

import Link from 'next/link';
import { LoaderCircle, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { products } from '@/lib/site-data';
import { useCart } from '@/components/cart-context';

type CheckoutSummary = {
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  items: Array<{ name: string; unitPrice: number; quantity: number }>;
};

const checkoutShipping = 28_000;
const checkoutTax = 55_000;

const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

export function CheckoutForm({ userEmail }: { userEmail: string | null }) {
  const { items, isHydrated, clearCart } = useCart();
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let currentOrderId = orderId;
      if (!currentOrderId) {
        if (!items.length) throw new Error('Your cart is empty.');
        const formData = new FormData(event.currentTarget);
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            street: formData.get('street'),
            city: formData.get('city'),
            state: formData.get('state'),
            items: items.map(({ productId, quantity }) => ({ productId, quantity })),
          }),
        });
        const orderPayload = await orderResponse.json() as {
          error?: string;
          order?: CheckoutSummary & { id: string };
        };

        if (!orderResponse.ok || !orderPayload.order) {
          throw new Error(orderPayload.error ?? 'Unable to create your order.');
        }

        currentOrderId = orderPayload.order.id;
        setOrderId(currentOrderId);
        setSummary(orderPayload.order);
        clearCart();
      }

      const paymentResponse = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: currentOrderId }),
      });
      const paymentPayload = await paymentResponse.json() as {
        error?: string;
        data?: { authorization_url?: string };
      };

      if (!paymentResponse.ok || !paymentPayload.data?.authorization_url) {
        throw new Error(paymentPayload.error ?? 'Unable to start Paystack checkout.');
      }

      const authorizationUrl = new URL(paymentPayload.data.authorization_url);
      if (authorizationUrl.protocol !== 'https:' || !['checkout.paystack.com', 'standard.paystack.co'].includes(authorizationUrl.hostname)) {
        throw new Error('Paystack returned an invalid checkout address.');
      }

      window.location.assign(authorizationUrl.toString());
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to submit checkout.');
      setIsSubmitting(false);
    }
  }

  if (!isHydrated) {
    return <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-12 sm:px-6 lg:px-8"><p className="text-sm text-slate-500">Loading your cart…</p></main>;
  }

  if (!items.length && !orderId) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-ink-900">Your cart is empty</h1>
        <p className="mt-3 text-slate-600">Add equipment to your cart before continuing to checkout.</p>
        <Link href="/shop" className="mt-6 inline-flex h-11 items-center rounded-xl bg-electric-600 px-5 text-sm font-semibold text-white hover:bg-electric-700">Browse products</Link>
      </main>
    );
  }

  const displayedItems = summary?.items ?? items.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return product ? [{ name: product.name, unitPrice: product.price, quantity: item.quantity }] : [];
  });
  const subtotal = summary?.subtotal ?? displayedItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const shippingCost = summary?.shippingCost ?? checkoutShipping;
  const tax = summary?.tax ?? checkoutTax;
  const total = summary?.total ?? subtotal + shippingCost + tax;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-slate-900 px-6 py-10 text-white shadow-xl sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Secure checkout</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Complete your order</h1>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <section>
            <h2 className="text-xl font-black text-slate-900">Customer information</h2>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Account email
              <input value={userEmail ?? 'Sign in to continue'} readOnly className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-3 text-sm text-slate-600" />
            </label>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900">Shipping address</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Full name
                <input name="fullName" autoComplete="name" required minLength={2} maxLength={120} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Phone
                <input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={32} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900" />
              </label>
              <label className="text-sm font-medium text-slate-700 md:col-span-2">
                Street address
                <input name="street" autoComplete="street-address" required minLength={4} maxLength={200} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                City
                <input name="city" autoComplete="address-level2" required minLength={2} maxLength={100} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                State
                <input name="state" autoComplete="address-level1" required minLength={2} maxLength={100} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900" />
              </label>
            </div>
          </section>

          {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
          {!userEmail ? (
            <p className="text-sm text-slate-600">
              Sign in before placing your order.{' '}
              <Link href="/login?next=%2Fcheckout" className="font-semibold text-emerald-700">Sign in</Link>
            </p>
          ) : null}
          <button type="submit" disabled={!userEmail || isSubmitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-solar-400 px-4 text-sm font-semibold text-ink-950 shadow-sm shadow-solar-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-solar-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none">
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
            {isSubmitting ? 'Preparing secure payment' : 'Continue to Paystack'}
          </button>
        </form>

        <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Order summary</h2>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            {displayedItems.map((item) => (
              <div key={item.name} className="flex items-start justify-between gap-4">
                <span>{item.name}</span><span className="shrink-0">{formatNaira(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 font-semibold text-slate-900"><span>Subtotal</span><span>{formatNaira(subtotal)}</span></div>
            <div className="flex items-center justify-between"><span>Shipping</span><span>{formatNaira(shippingCost)}</span></div>
            <div className="flex items-center justify-between"><span>VAT</span><span>{formatNaira(tax)}</span></div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xl font-black text-slate-900"><span>Total</span><span>{formatNaira(total)}</span></div>
          </div>
        </aside>
      </div>
    </main>
  );
}