import Link from 'next/link';
import Image from 'next/image';
import { Search, UserRound, Heart, MapPin, PhoneCall } from 'lucide-react';
import { navItems } from '@/lib/site-data';
import { HeaderCartButton } from '@/components/cart-ui';

export function SiteHeader() {
  return (
    <>
      <div className="bg-solar-400 px-4 py-2 text-center text-[11px] font-semibold tracking-wide text-ink-950">
        Nationwide delivery <span className="px-2 text-ink-700/50">•</span> Genuine warranty on every system
      </div>
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 shadow-[0_10px_30px_-28px_rgba(10,18,36,0.35)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2" aria-label="Custodian Ark home">
            <Image
              src="/logo.png"
              alt="Custodian Ark Electrical Supplies"
              width={500}
              height={500}
              className="h-12 w-32 object-cover sm:h-14 sm:w-40"
              priority
            />
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="h-4 w-4 text-emerald-700" />
              <span className="text-xs font-medium">Lagos, Nigeria</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-slate-500">
              <PhoneCall className="h-4 w-4 text-emerald-700" />
              <span className="text-xs font-medium">+234 (0)800 000 0000</span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button className="hidden h-11 w-11 items-center justify-center rounded-full text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 motion-reduce:transition-none md:flex" aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
            <button className="hidden h-11 w-11 items-center justify-center rounded-full text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 motion-reduce:transition-none md:flex" aria-label="Wishlist">
              <Heart className="h-4 w-4" />
            </button>
            <Link href="/account" className="hidden h-11 w-11 items-center justify-center rounded-full text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 motion-reduce:transition-none md:flex" aria-label="Account">
              <UserRound className="h-4 w-4" />
            </Link>
            <HeaderCartButton />
          </div>
        </div>

        <div className="border-t border-ink-800 bg-ink-950">
          <nav aria-label="Product navigation" className="mx-auto flex h-12 w-full max-w-7xl items-center gap-7 overflow-x-auto px-4 text-sm font-medium text-slate-300 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6 lg:justify-center lg:px-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="relative flex h-full shrink-0 items-center transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-solar-400 after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 motion-reduce:transition-none">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
