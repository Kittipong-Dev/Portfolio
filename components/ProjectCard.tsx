import { Code2, ExternalLink, Github, Hammer } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { ImageFallback } from "./ImageFallback";
import { SkillBadge } from "./SkillBadge";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:border-accent/25 md:grid-cols-[0.9fr_1.3fr]">
      <ImageFallback
        src={project.image}
        alt={`${project.name} preview`}
        label={`${project.name} image`}
        className="h-full min-h-[220px] rounded-none border-0 md:min-h-full"
      />
      <div className="p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
            {project.type}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            <Hammer className="h-3.5 w-3.5" aria-hidden="true" />
            {project.role}
          </span>
        </div>
        <h3 className="text-xl font-bold text-ink">{project.name}</h3>
        <p className="mt-3 leading-7 text-muted">{project.description}</p>
        {project.liveUrl || project.sourceUrl ? (
          <div className="mt-5 flex flex-wrap gap-3">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-900"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Live Demo
              </a>
            ) : null}
            {project.sourceUrl ? (
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm transition hover:border-accent/30 hover:text-accent"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                GitHub
              </a>
            ) : null}
          </div>
        ) : null}
        <div className="mt-5">
          <p className="text-sm font-bold text-ink">What I did</p>
          <p className="mt-2 leading-7 text-muted">{project.contribution}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <SkillBadge key={tech} label={tech} />
          ))}
        </div>
      </div>
    </article>
  );
}
