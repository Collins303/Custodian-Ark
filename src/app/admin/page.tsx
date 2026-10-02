import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

const stats = [
  { label: 'Revenue', value: '₦42.8M', tone: 'emerald' },
  { label: 'Orders', value: '1,240', tone: 'slate' },
  { label: 'Customers', value: '890', tone: 'sky' },
  { label: 'Inventory', value: '94%', tone: 'amber' },
];

export default function AdminPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-slate-900 px-6 py-10 text-white shadow-2xl shadow-slate-900/10 sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Admin overview</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Dashboard</h1>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{stat.label}</div>
              <div className="mt-3 text-3xl font-black text-slate-900">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">Recent orders</h2>
            <div className="mt-5 space-y-4">
              {[
                ['CA-2026-000101', 'Lagos', '₦1,560,000', 'Paid'],
                ['CA-2026-000098', 'Abuja', '₦890,000', 'Processing'],
                ['CA-2026-000095', 'Port Harcourt', '₦2,140,000', 'Shipped'],
              ].map(([id, location, amount, status]) => (
                <div key={id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 text-sm">
                  <div>
                    <div className="font-semibold text-slate-900">{id}</div>
                    <div className="text-slate-500">{location}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{amount}</div>
                    <div className="text-emerald-700">{status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">Top categories</h2>
            <div className="mt-5 space-y-4 text-sm">
              {['Solar Panels', 'Batteries', 'Inverters', 'Accessories'].map((category, index) => (
                <div key={category}>
                  <div className="mb-2 flex items-center justify-between text-slate-600">
                    <span>{category}</span>
                    <span>{[48, 36, 29, 22][index]}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-emerald-600" style={{ width: `${[48, 36, 29, 22][index]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
