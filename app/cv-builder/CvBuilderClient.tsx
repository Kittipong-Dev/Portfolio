"use client";

import { ArrowDown, ArrowUp, Download, Save } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { CareerItem, PersonalInfo, SkillGroup } from "@/lib/content";

type CvBuilderClientProps = {
  personalInfo: PersonalInfo;
  items: CareerItem[];
  skillGroups: SkillGroup[];
};

type DraftBullets = Record<string, string[]>;
type FontSizeMode = "auto" | "small" | "normal" | "large";

function itemKey(item: CareerItem) {
  return `${item.kind}:${item.slug}`;
}

function isFormalEducation(item: CareerItem) {
  return (
    item.kind === "education" &&
    [item.category, item.type]
      .filter(Boolean)
      .some((value) =>
        ["formal education", "school", "university"].includes(String(value).toLowerCase())
      )
  );
}

function defaultCvItems(items: CareerItem[]) {
  return [...items]
    .filter((item) => !isFormalEducation(item))
    .sort((a, b) => a.priority - b.priority || a.title.localeCompare(b.title))
    .slice(0, 8)
    .map((item) => itemKey(item));
}

function countBullets(selectedItems: CareerItem[], draftBullets: DraftBullets) {
  return selectedItems.reduce((total, item) => {
    const key = itemKey(item);
    return total + (draftBullets[key] ?? item.bullets).filter(Boolean).length;
  }, 0);
}

function renderItemsFromSelection(selectedItems: CareerItem[]) {
  const selectedKeySet = new Set(selectedItems.map(itemKey));
  const childItemsByParent = selectedItems.reduce<Record<string, CareerItem[]>>(
    (groups, item) => {
      if (item.parentKey && selectedKeySet.has(item.parentKey)) {
        groups[item.parentKey] = [...(groups[item.parentKey] ?? []), item];
      }

      return groups;
    },
    {}
  );

  return selectedItems
    .filter((item) => !item.parentKey || !selectedKeySet.has(item.parentKey))
    .map((item) => ({
      ...item,
      children: childItemsByParent[itemKey(item)] ?? []
    }));
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const shortMonthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

function formatDate(value: string, variant: "short" | "long") {
  if (/^\d{4}$/.test(value)) return value;
  if (value.toLowerCase() === "present") return "Present";

  const match = /^(\d{4})-(\d{2})/.exec(value);
  if (!match) return value;

  const monthIndex = Number(match[2]) - 1;
  const month = variant === "short" ? shortMonthNames[monthIndex] : monthNames[monthIndex];
  return `${month} ${match[1]}`;
}

function formatDateRange(item: CareerItem) {
  if (item.startDate && item.endDate) {
    if (/^\d{4}$/.test(item.startDate) && /^\d{4}$/.test(item.endDate)) {
      return `${item.startDate}-${item.endDate}`;
    }

    return `${formatDate(item.startDate, "short")} - ${formatDate(item.endDate, "long")}`;
  }

  if (item.endDate) return formatDate(item.endDate, "long");
  if (item.startDate) return formatDate(item.startDate, "long");
  return "";
}

function isMatchingSkill(skill: string, patterns: string[]) {
  const normalizedSkill = skill.toLowerCase();
  return patterns.some((pattern) => normalizedSkill.includes(pattern.toLowerCase()));
}

function skillRows(selectedSkills: string[]) {
  const rows = [
    {
      label: "AI / ML",
      patterns: [
        "LLM",
        "RAG",
        "Agentic",
        "NLP",
        "Fine-tuning",
        "Evaluation",
        "Computer Vision",
        "Time Series",
        "Signal Processing",
        "Machine Learning",
        "Deep Learning",
        "CNN"
      ]
    },
    {
      label: "Tools",
      patterns: [
        "Python",
        "PyTorch",
        "Hugging Face",
        "SQL",
        "Docker",
        "Linux",
        "Git",
        "GitHub",
        "EasyOCR",
        "ONNX",
        "TensorRT",
        "Postman"
      ]
    },
    {
      label: "Engineering",
      patterns: [
        "AWS",
        "Pipeline",
        "API",
        "Data Pipeline",
        "Deployment",
        "MLOps",
        "Web Development",
        "Cloud",
        "Database",
        "Backend"
      ]
    },
    {
      label: "Soft Skills",
      patterns: [
        "Team",
        "Leadership",
        "Presentation",
        "Communication",
        "Pitching",
        "Problem Solving"
      ]
    }
  ];

  const assigned = new Set<string>();

  return rows.map((row) => {
    const skills = selectedSkills.filter((skill) => {
      const matches =
        skill !== row.label && !assigned.has(skill) && isMatchingSkill(skill, row.patterns);
      if (matches) assigned.add(skill);
      return matches;
    });

    return { label: row.label, skills };
  });
}

function autoFontScale(params: {
  selectedItemCount: number;
  bulletTotal: number;
  selectedSkillCount: number;
}) {
  const density =
    params.selectedItemCount * 1.65 + params.bulletTotal + params.selectedSkillCount * 0.14;

  if (density <= 28) return 1;
  if (density <= 34) return 0.96;
  if (density <= 40) return 0.92;
  if (density <= 46) return 0.88;
  return 0.84;
}

function fontScaleForMode(
  mode: FontSizeMode,
  selectedItemCount: number,
  bulletTotal: number,
  selectedSkillCount: number
) {
  if (mode === "small") return 0.92;
  if (mode === "large") return 1.08;
  if (mode === "normal") return 1;

  return autoFontScale({ selectedItemCount, bulletTotal, selectedSkillCount });
}

export function CvBuilderClient({
  personalInfo,
  items,
  skillGroups
}: CvBuilderClientProps) {
  const [selectedKeys, setSelectedKeys] = useState(() => defaultCvItems(items));
  const [selectedSkills, setSelectedSkills] = useState(() =>
    skillGroups.flatMap((group) => group.items).slice(0, 28)
  );
  const [draftBullets, setDraftBullets] = useState<DraftBullets>({});
  const [template, setTemplate] = useState("pdf-reference");
  const [fontSizeMode, setFontSizeMode] = useState<FontSizeMode>("auto");
  const [onePageMode, setOnePageMode] = useState(true);
  const [targetKeywords, setTargetKeywords] = useState("AI, backend, API, data, cloud");

  const selectedItems = useMemo(
    () =>
      selectedKeys
        .map((key) => items.find((item) => itemKey(item) === key))
        .filter((item): item is CareerItem => Boolean(item)),
    [items, selectedKeys]
  );
  const renderItems = useMemo(() => renderItemsFromSelection(selectedItems), [selectedItems]);
  const formalEducationItems = useMemo(
    () =>
      items.filter(
        (item) =>
          isFormalEducation(item)
      ),
    [items]
  );

  const bulletTotal = countBullets(selectedItems, draftBullets);
  const fontScale = fontScaleForMode(
    fontSizeMode,
    selectedItems.length,
    bulletTotal,
    selectedSkills.length
  );
  const cvStyle = { "--cv-scale": fontScale } as CSSProperties;
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
        fontSizeMode,
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
            <span className="text-sm font-bold text-ink">PDF font size</span>
            <select
              value={fontSizeMode}
              onChange={(event) => setFontSizeMode(event.target.value as FontSizeMode)}
              className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="auto">Auto fit A4</option>
              <option value="small">Small</option>
              <option value="normal">Normal</option>
              <option value="large">Large</option>
            </select>
            <span className="mt-1 block text-xs font-semibold text-slate-500">
              Current scale: {Math.round(fontScale * 100)}%
            </span>
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
          style={cvStyle}
          className={`cv-print-page mx-auto bg-white shadow-card print:shadow-none ${
            template === "compact" ? "text-[12px]" : "text-[13px]"
          }`}
        >
          <header className="grid grid-cols-[105px_1fr] gap-6">
            <Image
              src={personalInfo.profileImage}
              alt={`${personalInfo.displayName} profile`}
              width={92}
              height={118}
              className="h-[118px] w-[92px] object-cover"
            />
            <div className="pt-[14px]">
              <h2 className="cv-name cv-serif font-extrabold leading-tight text-black">
                {personalInfo.displayName}
              </h2>
              <div className="cv-contact cv-serif mt-[18px] grid grid-cols-[1fr_1.05fr] gap-x-[54px] gap-y-[1px] leading-[1.05] text-black">
                <p className="grid grid-cols-[90px_1fr]">
                  <strong>Phone:</strong> <span>{personalInfo.phone}</span>
                </p>
                <p className="grid grid-cols-[122px_1fr]">
                  <strong>Email:</strong> <span>{personalInfo.email}</span>
                </p>
                <p className="grid grid-cols-[90px_1fr]">
                  <strong>Github:</strong> <span>github.com/{personalInfo.github}</span>
                </p>
                <p className="grid grid-cols-[122px_1fr]">
                  <strong>Hugging Face:</strong> <span>{personalInfo.huggingFace}</span>
                </p>
                <p className="grid grid-cols-[90px_1fr]">
                  <strong>LinkedIn:</strong> <span>{personalInfo.linkedIn}</span>
                </p>
              </div>
            </div>
          </header>

          <section className="mt-3">
            <h3 className="cv-section-title">Introduction</h3>
            <p className="cv-body mt-1.5">{personalInfo.about}</p>
          </section>

          <section className="mt-2.5 space-y-2">
            <h3 className="cv-section-title">Experience / Projects</h3>
            {renderItems.map((item) => {
              const key = itemKey(item);
              const bullets = draftBullets[key] ?? item.bullets;
              return (
                <div key={key} className="break-inside-avoid">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="cv-entry-title cv-serif font-extrabold leading-tight text-black">
                        {item.title}
                      </h4>
                      {item.role ? (
                        <p className="cv-entry-role cv-serif font-bold leading-tight text-black">
                          {item.role}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex min-w-[155px] items-start justify-end gap-2">
                      <p className="cv-date cv-serif whitespace-nowrap text-right font-extrabold leading-tight text-black">
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
                  <ul className="cv-body mt-1 list-disc space-y-0 pl-6">
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
                  {item.children.length > 0 ? (
                    <div className="mt-1 space-y-1 pl-7">
                      {item.children.map((child) => {
                        const childKey = itemKey(child);
                        const childBullets = draftBullets[childKey] ?? child.bullets;

                        return (
                          <div key={childKey} className="break-inside-avoid">
                            <h5 className="cv-entry-title cv-serif font-extrabold leading-tight text-black">
                              {child.title} {child.role ? `— ${child.role}` : ""}
                            </h5>
                            <ul className="cv-body mt-1 list-disc space-y-0 pl-6">
                              {childBullets.map((bullet, index) => (
                                <li key={`${childKey}-${index}`}>
                                  <input
                                    value={bullet}
                                    onChange={(event) =>
                                      updateBullet(childKey, index, event.target.value)
                                    }
                                    className="w-full bg-transparent outline-none print:border-0"
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </section>

          <section className="mt-2.5">
            <h3 className="cv-section-title">Education</h3>
            <div className="mt-1.5 space-y-1">
              {formalEducationItems.map((item) => (
                <div key={item.slug} className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="cv-entry-title cv-serif font-extrabold leading-tight text-black">
                      {item.title}
                    </h4>
                    <p className="cv-body">{item.role ?? item.summary}</p>
                  </div>
                  <p className="cv-date cv-serif min-w-[155px] whitespace-nowrap text-right font-extrabold leading-tight text-black">
                    {formatDateRange(item) || "Present"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-2.5">
            <h3 className="cv-section-title">Skills and Interests</h3>
            <div className="cv-body mt-1.5 space-y-0">
              {skillRows(selectedSkills)
                .filter((row) => row.skills.length > 0)
                .map((row) => (
                  <p key={row.label}>
                    <strong>{row.label}:</strong> {row.skills.join(", ")}
                  </p>
                ))}
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
