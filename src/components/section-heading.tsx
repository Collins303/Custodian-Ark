type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
};

export function SectionHeading({ eyebrow, title, description, centered = false }: SectionHeadingProps) {
  return (
    <div className={centered ? 'mx-auto mb-10 flex max-w-2xl flex-col items-center gap-3 text-center md:mb-14' : 'mb-10 flex max-w-2xl flex-col gap-3 md:mb-14'}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p>
      <div className="h-1 w-12 rounded-full bg-gradient-to-r from-emerald-600 to-solar-400" />
      <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">{description}</p> : null}
    </div>
  );
}
