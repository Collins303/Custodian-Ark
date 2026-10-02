'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { products } from '@/lib/site-data';
import { useCart } from '@/components/cart-context';

export function HeaderCartButton() {
  const { itemCount, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 md:w-auto md:gap-2 md:rounded-xl md:bg-solar-400 md:px-5 md:text-ink-950 md:shadow-sm md:shadow-solar-500/25 md:hover:-translate-y-0.5 md:hover:bg-solar-300"
      aria-label={`Cart${itemCount ? `, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}` : ', empty'}`}
    >
      <ShoppingCart className="h-4 w-4" />
      <span className="hidden md:inline">Cart</span>
      {itemCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-solar-400 px-1 text-[10px] font-bold tabular-nums text-ink-950 ring-2 ring-white md:-right-1 md:-top-1">
          {itemCount}
        </span>
      ) : null}
    </button>
  );
}

export function AddToCartButton({ productId, className }: { productId: string; className?: string }) {
  const { addItem, openCart } = useCart();

  function handleAdd() {
    if (addItem(productId)) openCart();
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={className ?? 'inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-solar-400 px-4 text-sm font-semibold text-ink-950 shadow-sm shadow-solar-500/25 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-solar-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'}
    >
      <ShoppingCart className="h-4 w-4" />
      Add to cart
    </button>
  );
}

export function BuyNowButton({ productId }: { productId: string }) {
  const { addItem } = useCart();
  const router = useRouter();

  function handleBuyNow() {
    if (addItem(productId)) router.push('/checkout');
  }

  return (
    <button type="button" onClick={handleBuyNow} className="flex-1 rounded-xl bg-solar-400 px-5 py-3 text-sm font-semibold text-ink-950 shadow-sm shadow-solar-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-solar-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">
      Buy now
    </button>
  );
}

export function CartDrawer() {
  const { items, isHydrated, isCartOpen, closeCart, updateQuantity, removeItem } = useCart();
  const cartLines = items.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return product ? [{ ...item, product }] : [];
  });
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartLines.reduce((total, item) => total + item.product.price * item.quantity, 0);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button type="button" onClick={closeCart} className="absolute inset-0 bg-ink-950/45" aria-label="Close cart" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onKeyDown={(event) => { if (event.key === 'Escape') closeCart(); }}
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200/70 px-5 py-4">
          <div>
            <h2 id="cart-title" className="font-display text-xl font-bold text-ink-900">Your cart</h2>
            <p className="text-sm text-slate-500">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
          </div>
          <button type="button" onClick={closeCart} aria-label="Close cart" className="flex h-11 w-11 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isHydrated ? (
          <p className="p-6 text-sm text-slate-500">Loading your cart…</p>
        ) : cartLines.length ? (
          <>
            <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto px-5">
              {cartLines.map(({ product, productId, quantity }) => (
                <li key={productId} className="flex gap-4 py-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                    <Image src={product.image} alt={product.name} fill sizes="80px" className="object-contain p-2" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/products/${product.slug}`} onClick={closeCart} className="line-clamp-2 font-semibold text-ink-900 hover:text-electric-700">{product.name}</Link>
                    <p className="mt-1 text-sm font-semibold tabular-nums text-ink-900">₦{(product.price * quantity).toLocaleString('en-NG')}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button type="button" onClick={() => updateQuantity(productId, quantity - 1)} aria-label={`Decrease ${product.name} quantity`} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"><Minus className="h-4 w-4" /></button>
                      <span className="min-w-6 text-center text-sm tabular-nums text-ink-900">{quantity}</span>
                      <button type="button" onClick={() => updateQuantity(productId, quantity + 1)} aria-label={`Increase ${product.name} quantity`} disabled={quantity >= product.stock} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><Plus className="h-4 w-4" /></button>
                      <button type="button" onClick={() => removeItem(productId)} aria-label={`Remove ${product.name} from cart`} className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-200/70 p-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-slate-600">Items subtotal</span>
                <span className="font-display text-lg font-bold tabular-nums text-ink-900">₦{subtotal.toLocaleString('en-NG')}</span>
              </div>
              <Link href="/checkout" onClick={closeCart} className="flex h-11 w-full items-center justify-center rounded-xl bg-solar-400 px-5 text-sm font-semibold text-ink-950 shadow-sm shadow-solar-500/20 transition hover:bg-solar-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">
                Continue to checkout
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingCart className="h-8 w-8 text-slate-400" />
            <p className="mt-4 font-semibold text-ink-900">Your cart is empty</p>
            <Link href="/shop" onClick={closeCart} className="mt-4 text-sm font-semibold text-electric-600 hover:text-electric-700">Browse products</Link>
          </div>
        )}
      </aside>
    </div>
  );
}