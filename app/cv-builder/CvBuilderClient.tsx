"use client";

import { ArrowDown, ArrowUp, Download, Save } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CareerItem, PersonalInfo, SkillGroup } from "@/lib/content";

type CvBuilderClientProps = {
  personalInfo: PersonalInfo;
  items: CareerItem[];
  skillGroups: SkillGroup[];
};

type DraftBullets = Record<string, string[]>;

function itemKey(item: CareerItem) {
  return `${item.kind}:${item.slug}`;
}

function countBullets(selectedItems: CareerItem[], draftBullets: DraftBullets) {
  return selectedItems.reduce((total, item) => {
    const key = itemKey(item);
    return total + (draftBullets[key] ?? item.bullets).filter(Boolean).length;
  }, 0);
}

function formatDateRange(item: CareerItem) {
  if (item.startDate && item.endDate) return `${item.startDate} - ${item.endDate}`;
  return item.endDate ?? item.startDate ?? "";
}

export function CvBuilderClient({
  personalInfo,
  items,
  skillGroups
}: CvBuilderClientProps) {
  const [selectedKeys, setSelectedKeys] = useState(() =>
    items.slice(0, 6).map((item) => itemKey(item))
  );
  const [selectedSkills, setSelectedSkills] = useState(() =>
    skillGroups.flatMap((group) => group.items).slice(0, 12)
  );
  const [draftBullets, setDraftBullets] = useState<DraftBullets>({});
  const [template, setTemplate] = useState("pdf-reference");
  const [onePageMode, setOnePageMode] = useState(true);
  const [targetKeywords, setTargetKeywords] = useState("AI, backend, API, data, cloud");

  const selectedItems = useMemo(
    () =>
      selectedKeys
        .map((key) => items.find((item) => itemKey(item) === key))
        .filter((item): item is CareerItem => Boolean(item)),
    [items, selectedKeys]
  );
  const formalEducationItems = useMemo(
    () =>
      items.filter(
        (item) =>
          item.kind === "education" &&
          [item.category, item.type]
            .filter(Boolean)
            .some((value) => ["formal education", "school", "university"].includes(String(value).toLowerCase()))
      ),
    [items]
  );

  const bulletTotal = countBullets(selectedItems, draftBullets);
  const missingKeywords = targetKeywords
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .filter((keyword) => {
      const haystack = [
        ...selectedItems.flatMap((item) => [
          item.title,
          item.summary,
          ...item.bullets,
          ...item.tags,
          ...item.technologies
        ]),
        ...selectedSkills
      ]
        .join(" ")
        .toLowerCase();

      return !haystack.includes(keyword.toLowerCase());
    });

  const warnings = [
    !personalInfo.email ? "Missing contact email." : null,
    onePageMode && selectedItems.length > 6 ? "One-page mode may be too long." : null,
    onePageMode && bulletTotal > 18 ? "Too many bullets for a one-page CV." : null,
    missingKeywords.length > 0
      ? `Missing target keywords: ${missingKeywords.join(", ")}.`
      : null
  ].filter(Boolean);

  function toggleKey(key: string) {
    setSelectedKeys((current) =>
      current.includes(key) ? current.filter((value) => value !== key) : [...current, key]
    );
  }

  function moveKey(key: string, direction: -1 | 1) {
    setSelectedKeys((current) => {
      const index = current.indexOf(key);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const copy = [...current];
      const [item] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, item);
      return copy;
    });
  }

  function updateBullet(key: string, index: number, value: string) {
    setDraftBullets((current) => {
      const item = items.find((entry) => itemKey(entry) === key);
      const bullets = [...(current[key] ?? item?.bullets ?? [])];
      bullets[index] = value;
      return { ...current, [key]: bullets };
    });
  }

  async function saveVersion() {
    const company = window.prompt("Company or target name for this CV version?");
    const role = window.prompt("Role title?");

    if (!company || !role) return;

    const response = await fetch("/api/cv/versions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company,
        role,
        template,
        onePageMode,
        selectedKeys,
        selectedSkills,
        draftBullets
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unable to save CV version." }));
      window.alert(error.error ?? "Unable to save CV version.");
      return;
    }

    const result = await response.json();
    window.alert(`CV version prepared: ${result.path}`);
  }

  return (
    <div className="grid min-h-screen gap-0 bg-slate-100 lg:grid-cols-[390px_1fr]">
      <aside className="border-r border-slate-200 bg-white p-5 print:hidden">
        <div className="mb-5">
          <Link href="/" className="text-sm font-bold text-accent">
            Back to portfolio
          </Link>
          <h1 className="mt-3 text-2xl font-extrabold text-ink">CV Builder</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Select career content from the repository source of truth and tailor wording
            for this CV only.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-ink">Template</span>
            <select
              value={template}
              onChange={(event) => setTemplate(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="pdf-reference">PDF reference template</option>
              <option value="focused">Focused technical</option>
              <option value="compact">Compact one-page</option>
              <option value="portfolio">Portfolio narrative</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={onePageMode}
              onChange={(event) => setOnePageMode(event.target.checked)}
            />
            One-page mode
          </label>

          <label className="block">
            <span className="text-sm font-bold text-ink">Job keywords</span>
            <input
              value={targetKeywords}
              onChange={(event) => setTargetKeywords(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="mt-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-[0.1em] text-slate-500">
            Content Database
          </h2>
          <div className="space-y-2">
            {items.map((item) => {
              const key = itemKey(item);
              return (
                <label
                  key={key}
                  className="flex gap-3 rounded-md border border-slate-200 p-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedKeys.includes(key)}
                    onChange={() => toggleKey(key)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block font-bold text-ink">{item.title}</span>
                    <span className="text-xs font-semibold text-muted">{item.kind}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-[0.1em] text-slate-500">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skillGroups.flatMap((group) => group.items).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() =>
                  setSelectedSkills((current) =>
                    current.includes(skill)
                      ? current.filter((value) => value !== skill)
                      : [...current, skill]
                  )
                }
                className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                  selectedSkills.includes(skill)
                    ? "bg-accent text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="p-5 print:bg-white print:p-0 lg:p-8">
        {warnings.length > 0 ? (
          <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
            {warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        ) : null}

        <div className="mb-4 flex flex-wrap gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-bold text-white"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </button>
          <button
            type="button"
            onClick={saveVersion}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-ink"
          >
            <Save className="h-4 w-4" />
            Save Version
          </button>
        </div>

        <article
          className={`cv-print-page mx-auto bg-white shadow-card print:shadow-none ${
            template === "compact" ? "text-[12px]" : "text-[13px]"
          }`}
        >
          <header className="grid grid-cols-[110px_1fr] gap-7">
            <Image
              src={personalInfo.profileImage}
              alt={`${personalInfo.displayName} profile`}
              width={92}
              height={118}
              className="h-[118px] w-[92px] object-cover"
            />
            <div>
              <h2 className="font-serif text-[34px] font-extrabold leading-tight text-black">
                {personalInfo.displayName}
              </h2>
              <div className="mt-5 grid gap-x-10 gap-y-1 font-serif text-[17px] leading-tight text-black sm:grid-cols-2">
                <p>
                  <strong>Phone:</strong> <span className="ml-8">{personalInfo.phone}</span>
                </p>
                <p>
                  <strong>Email:</strong> <span className="ml-8">{personalInfo.email}</span>
                </p>
                <p>
                  <strong>Github:</strong>{" "}
                  <span className="ml-7">github.com/{personalInfo.github}</span>
                </p>
                <p>
                  <strong>Hugging Face:</strong>{" "}
                  <span className="ml-3">{personalInfo.huggingFace}</span>
                </p>
                <p className="sm:col-span-2">
                  <strong>LinkedIn:</strong>{" "}
                  <span className="ml-5">{personalInfo.linkedIn}</span>
                </p>
              </div>
            </div>
          </header>

          <section className="mt-4">
            <h3 className="cv-section-title">Introduction</h3>
            <p className="cv-body mt-2">{personalInfo.about}</p>
          </section>

          <section className="mt-3 space-y-3">
            <h3 className="cv-section-title">Experience / Projects</h3>
            {selectedItems.map((item) => {
              const key = itemKey(item);
              const bullets = draftBullets[key] ?? item.bullets;
              return (
                <div key={key} className="break-inside-avoid">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-serif text-[17px] font-extrabold leading-tight text-black">
                        {item.title}
                      </h4>
                      {item.role ? (
                        <p className="font-serif text-[15px] font-bold leading-tight text-black">
                          {item.role}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-serif text-[16px] font-extrabold text-black">
                        {formatDateRange(item)}
                      </p>
                      <div className="flex gap-1 print:hidden">
                        <button
                          type="button"
                          onClick={() => moveKey(key, -1)}
                          className="rounded border border-slate-200 p-1"
                          aria-label={`Move ${item.title} up`}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveKey(key, 1)}
                          className="rounded border border-slate-200 p-1"
                          aria-label={`Move ${item.title} down`}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <ul className="cv-body mt-2 list-disc space-y-1 pl-6">
                    {bullets.map((bullet, index) => (
                      <li key={`${key}-${index}`}>
                        <input
                          value={bullet}
                          onChange={(event) => updateBullet(key, index, event.target.value)}
                          className="w-full bg-transparent outline-none print:border-0"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>

          <section className="mt-3">
            <h3 className="cv-section-title">Education</h3>
            <div className="mt-2 space-y-2">
              {formalEducationItems.map((item) => (
                <div key={item.slug} className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-serif text-[17px] font-extrabold leading-tight text-black">
                      {item.title}
                    </h4>
                    <p className="cv-body">{item.role ?? item.summary}</p>
                  </div>
                  <p className="font-serif text-[16px] font-extrabold text-black">
                    {formatDateRange(item) || "Present"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-3">
            <h3 className="cv-section-title">Skills and Interests</h3>
            <p className="cv-body mt-2">
              <strong>Selected Skills:</strong> {selectedSkills.join(", ")}
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
