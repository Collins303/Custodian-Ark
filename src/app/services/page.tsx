import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { services } from '@/lib/site-data';

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 px-6 py-12 text-white shadow-xl sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Professional services</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Technical support for every energy decision.</h1>
        </section>

        <SectionHeading eyebrow="What we offer" title="End-to-end solar and power services" />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">{service.audience}</p>
              <h2 className="mt-4 text-2xl font-black text-slate-900">{service.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{service.summary}</p>
              <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{service.benefit}</div>
              <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                Request service <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
