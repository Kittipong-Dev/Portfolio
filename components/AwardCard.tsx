import { Award as AwardIcon } from "lucide-react";
import type { Award } from "@/data/portfolio";

type AwardCardProps = {
  award: Award;
};

export function AwardCard({ award }: AwardCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
        <AwardIcon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-ink">{award.name}</h3>
      <p className="mt-2 text-sm font-semibold text-accent">{award.result}</p>
      <p className="mt-4 leading-7 text-muted">{award.description}</p>
    </article>
  );
}
