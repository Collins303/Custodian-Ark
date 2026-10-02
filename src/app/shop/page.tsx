import Link from 'next/link';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import { CategoryIcon } from '@/components/category-icon';
import { ProductCard } from '@/components/product-card';
import { SectionHeading } from '@/components/section-heading';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { categories, products } from '@/lib/site-data';

export default function ShopPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-6 py-10 text-white shadow-2xl shadow-slate-900/10 sm:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Full catalog</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Shop premium solar equipment</h1>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <SlidersHorizontal className="h-4 w-4" />
              Filtered for solar, power storage and infrastructure
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <SectionHeading eyebrow="Categories" title="Browse by product type" />
            <Link href="/calculator" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
              Energy calculator <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {categories.map((category) => (
              <div key={category.name} className="group rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/25 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none">
                <CategoryIcon name={category.name} />
                <h3 className="font-display text-lg font-semibold text-ink-900">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading eyebrow="Featured products" title="Engineered for energy reliability" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
