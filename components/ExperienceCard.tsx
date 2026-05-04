import { Lightbulb, Trophy } from "lucide-react";
import type { Hackathon } from "@/data/portfolio";

type ExperienceCardProps = {
  experience: Hackathon;
};

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-accent/25">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
          <Lightbulb className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-3 py-1 text-xs font-semibold text-accent">
          <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
          {experience.result}
        </span>
      </div>
      <h3 className="text-lg font-bold text-ink">{experience.name}</h3>
      <p className="mt-2 text-sm font-semibold text-accent">{experience.role}</p>
      <p className="mt-4 leading-7 text-muted">{experience.description}</p>
    </article>
  );
}
