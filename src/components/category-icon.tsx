import {
  BatteryCharging,
  Cable,
  Factory,
  Gauge,
  Lightbulb,
  PlugZap,
  ShieldCheck,
  Sun,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

const categoryIcons: Record<string, LucideIcon> = {
  'Solar Panels': Sun,
  Inverters: Zap,
  'Batteries & Energy Storage': BatteryCharging,
  Transformers: Factory,
  Cables: Cable,
  'Solar Lighting': Lightbulb,
  'Charge Controllers': Gauge,
  Accessories: Wrench,
  'Electrical Equipment': PlugZap,
  'Power Protection': ShieldCheck,
};

export function CategoryIcon({ name }: { name: string }) {
  const Icon = categoryIcons[name] ?? Sun;

  return (
    <span aria-hidden="true" className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-600 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-amber-500/15">
      <Icon className="h-6 w-6" strokeWidth={1.8} />
    </span>
  );
}