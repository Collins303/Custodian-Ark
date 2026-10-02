import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SolarCalculator } from '@/components/solar-calculator';
import { SectionHeading } from '@/components/section-heading';

export default function CalculatorPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-12 text-white shadow-xl sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100">Preliminary estimate</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Solar system sizing calculator</h1>
        </section>

        <SectionHeading
          eyebrow="Estimate"
          title="Calculate a starting point for your solar needs"
          description="This tool helps estimate your daily load, inverter capacity and solar array scale before a technical assessment."
        />

        <SolarCalculator />
      </main>
      <SiteFooter />
    </>
  );
}
