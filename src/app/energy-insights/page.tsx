import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { blogPosts } from '@/lib/site-data';

export default function EnergyInsightsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-slate-900 px-6 py-12 text-white shadow-xl sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Knowledge centre</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Energy insights for smarter decisions.</h1>
        </section>

        <SectionHeading eyebrow="Featured articles" title="Guides to solar, systems and resilience" />

        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.map((post) => (
            <article key={post.title} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <img src={post.image} alt={post.title} className="h-52 w-full object-cover" />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">{post.category}</p>
                <h2 className="mt-3 text-xl font-black text-slate-900">{post.title}</h2>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                  <span>{post.readTime}</span>
                  <Link href="/energy-insights" className="inline-flex items-center gap-2 text-emerald-700">
                    Read more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
