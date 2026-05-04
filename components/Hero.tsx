import {
  ArrowDown,
  Download,
  Github,
  Instagram,
  Mail,
  MapPin,
  School
} from "lucide-react";
import { personalInfo } from "@/data/portfolio";
import { ImageFallback } from "./ImageFallback";

type HeroProps = {
  hasPortfolioPdf: boolean;
};

export function Hero({ hasPortfolioPdf }: HeroProps) {
  return (
    <header className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
      <div>
        <p className="mb-4 inline-flex rounded-md border border-accent/15 bg-white px-3 py-1.5 text-sm font-semibold text-accent shadow-sm">
          {personalInfo.title}
        </p>
        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-ink sm:text-5xl lg:text-6xl">
          {personalInfo.displayName}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          {personalInfo.hero}
        </p>
        <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-accent">
          {personalInfo.tagline}
        </p>

        <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <span className="inline-flex items-start gap-2">
            <School className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            {personalInfo.school}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" />
            {personalInfo.location}
          </span>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#hackathons"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-indigo-900"
          >
            View Experience
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={`mailto:${personalInfo.email}`}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-accent/30"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Contact Me
          </a>
          {hasPortfolioPdf ? (
            <a
              href="/portfolio.pdf"
              download
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-accent/30"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              PDF Portfolio
            </a>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
          <a
            href="https://github.com/Kittipong-Dev"
            className="inline-flex items-center gap-2 rounded-md px-2 py-1 transition hover:text-accent"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
          <a
            href="https://instagram.com/achi.krab.3"
            className="inline-flex items-center gap-2 rounded-md px-2 py-1 transition hover:text-accent"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            Instagram
          </a>
          <span className="inline-flex items-center rounded-md px-2 py-1">
            Discord: {personalInfo.discord}
          </span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-sm lg:justify-self-end">
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-card">
          <ImageFallback
            src={personalInfo.profileImage}
            alt={`${personalInfo.displayName} profile photo`}
            label="Profile photo"
            className="aspect-[4/5]"
          />
        </div>
      </div>
    </header>
  );
}
