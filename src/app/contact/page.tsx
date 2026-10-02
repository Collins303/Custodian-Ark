import { Mail, MapPin, Phone } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-slate-900 px-6 py-12 text-white shadow-2xl shadow-slate-900/10 sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Talk to our team</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Let’s design your next energy system.</h1>
        </section>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading eyebrow="Reach us" title="Support that understands power systems" />
            <div className="space-y-5 text-sm text-slate-600">
              <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-emerald-700" /> +234 (0) 800 000 0000</div>
              <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-emerald-700" /> hello@custodianark.com</div>
              <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-emerald-700" /> 14 Admiralty Way, Lekki Phase 1, Lagos</div>
            </div>
          </div>

          <form action="/api/contact" method="POST" className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Name
                <input name="name" required className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-emerald-400" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Email
                <input type="email" name="email" required className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-emerald-400" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Phone
                <input name="phone" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-emerald-400" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Subject
                <input name="subject" required className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-emerald-400" />
              </label>
            </div>

            <label className="mt-5 block text-sm font-medium text-slate-700">
              Message
              <textarea name="message" required rows={6} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-emerald-400" />
            </label>

            <button type="submit" className="mt-6 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-500">
              Send message
            </button>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
