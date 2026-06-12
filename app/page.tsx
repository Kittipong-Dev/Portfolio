import { existsSync } from "fs";
import { join } from "path";
import {
  BadgeCheck,
  Brain,
  ExternalLink,
  GraduationCap,
  Mail,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { AwardCard } from "@/components/AwardCard";
import { ContentExplorer } from "@/components/ContentExplorer";
import { ExperienceCard } from "@/components/ExperienceCard";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/Section";
import { SkillBadge } from "@/components/SkillBadge";
import {
  academicExperiences,
  awards,
  certifications,
  contactLinks,
  hackathons,
  navItems,
  personalInfo,
  projects,
  softSkills,
  technicalSkills
} from "@/data/portfolio";
import { getAllCategories, getCareerProfile } from "@/lib/content";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
        <a href="#" className="shrink-0 text-sm font-extrabold text-ink sm:text-base">
          Kittipong Portfolio
        </a>
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </div>
        <a
          href={`mailto:${personalInfo.email}`}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-900"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Email
        </a>
      </div>
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 pb-3 sm:px-6 lg:hidden">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-accent"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function AboutHighlights() {
  const highlights = [
    {
      label: "Backend & APIs",
      value: "Node.js, Express.js, RESTful API, database design",
      icon: Sparkles
    },
    {
      label: "AI Learning",
      value: "Machine learning, deep learning, CNNs, multimodal prediction",
      icon: Brain
    },
    {
      label: "Cybersecurity",
      value: "CTF, blue team internship, network and threat analysis tools",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {highlights.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-card"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="font-bold text-ink">{item.label}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
}

function AcademicCard({
  item
}: {
  item: (typeof academicExperiences)[number];
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
        <GraduationCap className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-ink">{item.name}</h3>
      {item.date ? (
        <p className="mt-2 text-sm font-semibold text-slate-600">{item.date}</p>
      ) : null}
      {item.result ? (
        <p className="mt-2 text-sm font-semibold text-accent">{item.result}</p>
      ) : null}
      <p className="mt-4 leading-7 text-muted">{item.description}</p>
    </article>
  );
}

function CertificationCard({
  item
}: {
  item: (typeof certifications)[number];
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
        <BadgeCheck className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-ink">{item.name}</h3>
      <p className="mt-2 text-sm font-semibold text-accent">{item.issuer}</p>
      <p className="mt-4 leading-7 text-muted">{item.description}</p>
    </article>
  );
}

export default function Home() {
  const hasPortfolioPdf = existsSync(join(process.cwd(), "public", "portfolio.pdf"));
  const careerProfile = getCareerProfile();
  const filters = getAllCategories(careerProfile);

  return (
    <main>
      <Navbar />
      <Hero hasPortfolioPdf={hasPortfolioPdf} />

      <Section
        id="about"
        eyebrow="About Me"
        title="Student builder focused on AI, software, and practical innovation."
        description={personalInfo.about}
      >
        <AboutHighlights />
      </Section>

      <Section
        id="skills"
        eyebrow="Skills"
        title="Technical tools and team skills"
        description="A quick scan of the programming, backend, AI, cybersecurity, and collaboration skills I use in projects and competitions."
        className="bg-white/55"
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
            <h3 className="mb-4 text-lg font-bold text-ink">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {technicalSkills.map((skill, index) => (
                <SkillBadge
                  key={skill}
                  label={skill}
                  tone={index < 5 ? "strong" : "light"}
                />
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
            <h3 className="mb-4 text-lg font-bold text-ink">Non-Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {softSkills.map((skill) => (
                <SkillBadge key={skill} label={skill} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="experience"
        eyebrow="Content Database"
        title="Searchable career source of truth"
        description="These cards are generated directly from YAML and MDX files in the repository. Add a new project, competition, certificate, or experience file and it appears here automatically."
      >
        <ContentExplorer items={careerProfile.allItems} filters={filters} />
      </Section>

      <Section
        id="competitions"
        eyebrow="Hackathon & Innovation Experience"
        title="Building, pitching, and learning under real constraints"
        description="These experiences are closest to the AI wellness hackathon environment: fast teamwork, problem framing, product thinking, technical planning, and presenting to judges."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {hackathons.map((experience) => (
            <ExperienceCard key={experience.name} experience={experience} />
          ))}
        </div>
      </Section>

      <Section
        id="projects"
        eyebrow="Projects"
        title="Software projects with backend and product responsibility"
        description="Projects that show how I turn ideas into working tools, especially with APIs, Discord applications, databases, and real users."
        className="bg-white/55"
      >
        <div className="grid gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </Section>

      <Section
        id="certifications"
        eyebrow="Certifications"
        title="Cloud certification"
        description="A professional cloud credential that supports my backend, deployment, and system design experience."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {certifications.map((item) => (
            <CertificationCard key={item.name} item={item} />
          ))}
        </div>
      </Section>

      <Section
        id="awards"
        eyebrow="Competitions & Awards"
        title="Competition results across cybersecurity, coding, and web development"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {awards.map((award) => (
            <AwardCard key={award.name} award={award} />
          ))}
        </div>
      </Section>

      <Section
        id="academic"
        eyebrow="Academic / AI Experience"
        title="Focused learning in AI, algorithms, and cybersecurity"
        description="Camps, internships, and academic training that support stronger technical foundations for AI and software projects."
        className="bg-white/55"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {academicExperiences.map((item) => (
            <AcademicCard key={item.name} item={item} />
          ))}
        </div>
      </Section>

      <Section
        id="contact"
        eyebrow="Contact / Links"
        title="Let's connect"
        description="For hackathon teams, judges, or collaborators, these are the best ways to reach me."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactLinks.map((link) => {
            const content = (
              <>
                <span className="text-sm font-semibold text-slate-500">
                  {link.label}
                </span>
                <span className="mt-2 flex items-center gap-2 break-all text-base font-bold text-ink">
                  {link.value}
                  {link.href ? (
                    <ExternalLink className="h-4 w-4 shrink-0 text-accent" />
                  ) : null}
                </span>
              </>
            );

            return link.href ? (
              <a
                key={link.label}
                href={link.href}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-accent/25"
              >
                {content}
              </a>
            ) : (
              <div
                key={link.label}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-card"
              >
                {content}
              </div>
            );
          })}
        </div>
      </Section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>(c) {new Date().getFullYear()} {personalInfo.displayName}</p>
          <p>AI, software, cybersecurity, and innovation portfolio.</p>
        </div>
      </footer>
    </main>
  );
}
