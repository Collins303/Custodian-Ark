import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BatteryCharging, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { CategoryIcon } from '@/components/category-icon';
import { SectionHeading } from '@/components/section-heading';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { blogPosts, categories, featuredMetrics, products, testimonials } from '@/lib/site-data';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex w-full flex-1 flex-col gap-20 bg-white pb-20 md:gap-24">
        <section className="relative isolate min-h-[640px] overflow-hidden bg-ink-950 text-white sm:min-h-[680px]">
          <Image
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80"
            alt="Solar panels installed on a rooftop"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-transparent to-ink-950/10" />
          <div className="relative mx-auto grid min-h-[640px] w-full max-w-7xl items-center gap-10 px-4 py-20 sm:min-h-[680px] sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-solar-400">Smart energy solutions</p>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Power your future with smarter energy.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
                Premium solar, power storage and electrical solutions for homes, businesses and commercial projects.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/shop" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-solar-400 px-6 text-sm font-semibold text-ink-950 shadow-lg shadow-solar-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-solar-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 motion-reduce:transform-none motion-reduce:transition-none">
                  Shop products <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/calculator" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/15 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 motion-reduce:transform-none motion-reduce:transition-none">
                  Get a solar solution
                </Link>
              </div>
            </div>

            <div className="justify-self-end rounded-3xl border border-white/20 bg-ink-950/35 p-5 shadow-2xl shadow-ink-950/30 backdrop-blur-xl sm:p-7 lg:mt-24 lg:max-w-md">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-solar-400 text-ink-950">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-solar-300">Complete energy systems</p>
                  <h2 className="mt-1 font-display text-lg font-bold text-white">Built around your power needs</h2>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {['Solar panels', 'Hybrid inverters', 'Storage batteries'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />{item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-32 grid w-full max-w-7xl grid-cols-2 gap-3 px-4 sm:-mt-36 sm:grid-cols-4 sm:gap-4 sm:px-6 lg:px-8">
          {featuredMetrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-slate-200/70 bg-white/95 p-4 shadow-[0_12px_40px_-20px_rgba(10,18,36,0.28)] backdrop-blur-xl sm:p-5">
              <div className="font-display text-2xl font-bold tabular-nums text-ink-900 sm:text-3xl">{metric.value}</div>
              <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-xs">{metric.label}</div>
            </div>
          ))}
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Featured categories" title="Energy systems built for every scale" centered />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {categories.map((category) => (
              <div key={category.name} className="group rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(10,18,36,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/25 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none">
                <CategoryIcon name={category.name} />
                <h3 className="font-display text-base font-semibold leading-snug text-ink-900 sm:text-lg">{category.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{category.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Featured products" title="Reliability powered by premium equipment" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-ink-950 px-4 py-16 text-white sm:px-6 md:py-20 lg:px-8">
          <Image src={products[0].gallery[2]} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-25" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/75" />
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
              <div className="[&_.text-emerald-700]:text-solar-300 [&_h2]:text-white">
                <SectionHeading eyebrow="Why choose us" title="The engineering partner behind dependable power" />
              </div>
              <Link href="/solar-solutions" className="inline-flex items-center gap-2 text-sm font-semibold text-solar-300 transition-colors hover:text-solar-400 md:mb-14">
                Explore solutions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                { icon: BatteryCharging, title: 'System design', text: 'Tailored solar and storage design based on your actual usage profile.' },
                { icon: ShieldCheck, title: 'Quality control', text: 'Commercial-grade equipment and best-practice installation standards.' },
                { icon: CheckCircle2, title: 'Ongoing support', text: 'Maintenance, service and optimization for long-term system performance.' },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/15 bg-white/[0.08] p-6 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.12] motion-reduce:transform-none motion-reduce:transition-none">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/15 text-emerald-200"><item.icon className="h-6 w-6" /></div>
                  <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Testimonials" title="Customers trust us with critical power decisions" />
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(10,18,36,0.04)]">
                <p className="text-base leading-relaxed text-slate-600">“{testimonial.quote}”</p>
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <div className="font-display font-semibold text-ink-900">{testimonial.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Energy insights" title="Expert guidance for smarter solar choices" />
          <div className="grid gap-5 md:grid-cols-3">
            {blogPosts.map((post) => (
              <article key={post.title} className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(10,18,36,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(10,18,36,0.24)] motion-reduce:transform-none motion-reduce:transition-none">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image src={post.image} alt={post.title} fill sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">{post.category}</p>
                  <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink-900">{post.title}</h3>
                  <div className="mt-4 text-sm text-slate-500">{post.readTime}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Need a custom system?</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900">Request a professional solar assessment.</h2>
            </div>
            <Link href="/contact" className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-solar-400 px-6 text-sm font-semibold text-ink-950 shadow-sm shadow-solar-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-solar-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500 focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none">
              Get consultation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
