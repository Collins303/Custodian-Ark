import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import type { Product } from '@/lib/site-data';
import { AddToCartButton } from '@/components/cart-ui';

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_8px_30px_-24px_rgba(10,18,36,0.4)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-solar-500/30 hover:shadow-[0_28px_60px_-30px_rgba(10,18,36,0.32)] focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-white to-slate-50">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw" className="object-contain p-7 transition-transform duration-500 ease-out motion-safe:group-hover:scale-105 motion-reduce:transform-none" />
        <div className="absolute left-4 top-4 rounded-full border border-emerald-100 bg-emerald-50/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800 shadow-sm">{product.category}</div>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 border-t border-slate-100/80 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{product.brand}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-solar-50 px-2.5 py-1 text-xs font-semibold text-ink-900">
            <Star className="h-3.5 w-3.5 fill-current text-solar-400" /> {product.rating}
          </span>
        </div>

        <Link href={`/products/${product.slug}`} className="line-clamp-2 rounded-sm font-display text-base font-semibold leading-snug text-ink-900 transition-colors hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:text-lg motion-reduce:transition-none">
          {product.name}
        </Link>

        <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">{product.shortDescription}</p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-display text-xl font-bold tabular-nums text-ink-900">₦{product.price.toLocaleString()}</span>
            {product.compareAtPrice ? <span className="text-sm tabular-nums text-slate-400 line-through">₦{product.compareAtPrice.toLocaleString()}</span> : null}
          </div>

          <AddToCartButton productId={product.id} />
        </div>

        <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">
          View details <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </Link>
      </div>
    </article>
  );
}
