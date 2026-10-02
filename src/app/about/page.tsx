import { CheckCircle2, ShieldCheck, TrendingUp } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-12 text-white shadow-xl sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100">Our mission</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Energy independence built on trust, engineering and performance.</h1>
        </section>

        <div className="grid gap-8 lg:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'Reliability', text: 'We design and deliver systems built for resilience in real-world voltage, weather and load conditions.' },
            { icon: TrendingUp, title: 'Growth', text: 'From residences to industrial sites, our recommendations balance savings, scale and future flexibility.' },
            { icon: CheckCircle2, title: 'Technical clarity', text: 'Our team explains the design, sizing and support model so customers can make informed decisions.' },
          ].map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700"><item.icon className="h-6 w-6" /></div>
              <h2 className="text-xl font-black text-slate-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>

        <SectionHeading eyebrow="Why Custodian Ark" title="A company built for technical energy outcomes" description="We combine solar design, storage strategy, infrastructure expertise and installation experience to deliver solutions that work consistently over time." />
      </main>
      <SiteFooter />
    </>
  );
}
