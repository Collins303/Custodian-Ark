import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShieldCheck, Star, Truck } from 'lucide-react';
import { notFound } from 'next/navigation';
import { SectionHeading } from '@/components/section-heading';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/site-data';
import { AddToCartButton, BuyNowButton } from '@/components/cart-ui';

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ProductDetailPageContent params={params} />;
}

async function ProductDetailPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to catalog
        </Link>

        <article className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm">
              <img src={product.image} alt={product.name} className="h-[470px] w-full rounded-[1.5rem] object-cover" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {product.gallery.map((image, index) => (
                <div key={`${image}-${index}`} className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white p-2 shadow-sm">
                  <img src={image} alt={`${product.name} view ${index + 1}`} className="h-28 w-full rounded-xl object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">{product.category}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700">
                <Star className="h-4 w-4 fill-current" /> {product.rating}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{product.name}</h1>
            <p className="mt-3 text-sm text-slate-500">{product.brand} • {product.reviews} reviews</p>

            <div className="mt-5 flex items-end gap-3">
              <span className="text-3xl font-black text-slate-900">₦{product.price.toLocaleString()}</span>
              {product.compareAtPrice ? <span className="text-lg text-slate-500 line-through">₦{product.compareAtPrice.toLocaleString()}</span> : null}
            </div>

            <div className="mt-6 flex items-center gap-3 text-sm text-slate-600">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Warranty included
            </div>
            <div className="mt-2 flex items-center gap-3 text-sm text-slate-600">
              <Truck className="h-4 w-4 text-emerald-600" /> Ready for dispatch in 48 hours
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <AddToCartButton productId={product.id} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-solar-400 px-5 text-sm font-semibold text-ink-950 shadow-sm shadow-solar-500/25 transition hover:bg-solar-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2" />
              <button className="flex-1 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800">Wishlist</button>
            </div>
            <div className="mt-3"><BuyNowButton productId={product.id} /></div>

            <div className="mt-7 rounded-[1.5rem] bg-slate-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Overview</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{product.description}</p>
            </div>
          </div>
        </article>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Key features</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-600">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" /> {feature}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Technical specifications</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {Object.entries(product.specs).map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
                  <div className="mt-2 text-base font-bold text-slate-900">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading eyebrow="Related products" title="Frequently paired with this system" />
          <div className="grid gap-6 md:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
