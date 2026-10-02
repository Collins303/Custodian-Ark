import Link from 'next/link';
import Image from 'next/image';

export function SiteFooter() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t-[3px] border-solar-400 bg-ink-950 text-slate-200">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,165,36,0.09),transparent_38%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr] lg:px-8">
        <div className="max-w-sm">
          <Image
            src="/logo.png"
            alt="Custodian Ark Electrical Supplies"
            width={500}
            height={500}
            className="mb-4 h-[72px] w-[190px] object-cover"
          />
          <p className="text-sm leading-6 text-slate-400">
            Premium solar and power solutions for homes, businesses and industrial operations.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Powering a brighter Nigeria
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Solar solutions</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li><Link className="transition-colors hover:text-white" href="/solar-solutions">Residential solar</Link></li>
            <li><Link className="transition-colors hover:text-white" href="/solar-solutions">Commercial systems</Link></li>
            <li><Link className="transition-colors hover:text-white" href="/shop">Panels, inverters & storage</Link></li>
            <li><Link className="transition-colors hover:text-white" href="/calculator">System sizing calculator</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Services</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li><Link className="transition-colors hover:text-white" href="/services">Installation & commissioning</Link></li>
            <li><Link className="transition-colors hover:text-white" href="/services">Maintenance & support</Link></li>
            <li><Link className="transition-colors hover:text-white" href="/contact">Request a consultation</Link></li>
            <li><Link className="transition-colors hover:text-white" href="/energy-insights">Energy insights</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Trust & contact</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>Warranty-backed equipment</li>
            <li>Nationwide delivery</li>
            <li>Lagos, Nigeria - Mon-Sat, 8am-6pm</li>
            <li><a className="transition-colors hover:text-white" href="tel:+2348000000000">+234 (0)800 000 0000</a></li>
            <li><a className="transition-colors hover:text-white" href="mailto:hello@custodianark.com">hello@custodianark.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-800 py-5 text-center text-xs text-slate-500">
        © 2026 Custodian Ark Electrical Supplies. Built for energy independence.
      </div>
    </footer>
  );
}
