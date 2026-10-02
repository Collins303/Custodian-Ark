import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { solutions } from '@/lib/site-data';

export default function SolarSolutionsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_35%),linear-gradient(135deg,#0f172a,#111827,#0f172a)] px-6 py-12 text-white shadow-xl sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Energy solutions</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Power systems designed around your energy goals.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            From quiet backup systems for homes to high-capacity commercial arrays, we design practical solar and power solutions based on what your site actually needs.
          </p>
        </section>

        <SectionHeading eyebrow="Solutions" title="Built for each stage of your energy journey" description="Every recommendation is built around load profile, site conditions, financial goals and future scalability." />

        <div className="grid gap-6">
          {solutions.map((solution) => (
            <article key={solution.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">{solution.audience}</p>
                  <h2 className="mt-3 text-2xl font-black text-slate-900">{solution.title}</h2>
                  <p className="mt-4 text-base leading-7 text-slate-600">{solution.summary}</p>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div>
                      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Benefits</p>
                      <ul className="space-y-2 text-sm text-slate-600">
                        {solution.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> {benefit}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Typical components</p>
                      <ul className="space-y-2 text-sm text-slate-600">
                        {solution.components.map((component) => (
                          <li key={component} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> {component}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-slate-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Process</p>
                  <ol className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
                    {solution.process.map((step, index) => (
                      <li key={step} className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">{index + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                    Request a solution <ArrowRight className="h-4 w-4" />
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
