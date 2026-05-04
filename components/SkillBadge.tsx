type SkillBadgeProps = {
  label: string;
  tone?: "light" | "strong";
};

export function SkillBadge({ label, tone = "light" }: SkillBadgeProps) {
  const classes =
    tone === "strong"
      ? "border-accent/20 bg-accent text-white"
      : "border-slate-200 bg-white text-ink";

  return (
    <span
      className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium shadow-sm ${classes}`}
    >
      {label}
    </span>
  );
}
