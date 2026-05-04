type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className = ""
}: SectionProps) {
  return (
    <section id={id} className={`section-anchor py-12 sm:py-16 ${className}`}>
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="mb-7 max-w-3xl">
          {eyebrow ? (
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-accent">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
          {description ? (
            <p className="mt-3 text-base leading-7 text-muted">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
