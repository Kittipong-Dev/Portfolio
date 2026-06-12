"use client";

import { Clipboard } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CareerItem, PersonalInfo } from "@/lib/content";

type LinkedInClientProps = {
  personalInfo: PersonalInfo;
  items: CareerItem[];
};

function copy(value: string) {
  void navigator.clipboard.writeText(value);
}

export function LinkedInClient({ personalInfo, items }: LinkedInClientProps) {
  const [selectedSlug, setSelectedSlug] = useState(`${items[0]?.kind}:${items[0]?.slug}`);
  const selectedItem = items.find((item) => `${item.kind}:${item.slug}` === selectedSlug);
  const about = `${personalInfo.about}\n\nI focus on ${[
    ...new Set(items.flatMap((item) => [...item.tags, ...item.technologies]))
  ]
    .slice(0, 10)
    .join(", ")}.`;
  const selectedText = useMemo(() => {
    if (!selectedItem) return "";
    return `${selectedItem.title}\n${selectedItem.summary}\n\n${selectedItem.bullets
      .map((bullet) => `- ${bullet}`)
      .join("\n")}`;
  }, [selectedItem]);
  const achievementPost = selectedItem
    ? `I recently added ${selectedItem.title} to my portfolio.\n\n${selectedItem.summary}\n\nKey work:\n${selectedItem.bullets
        .slice(0, 3)
        .map((bullet) => `- ${bullet}`)
        .join("\n")}\n\n#AI #SoftwareDevelopment #Portfolio`
    : "";

  const blocks = [
    { title: "LinkedIn About", value: about },
    { title: "Experience / Project Description", value: selectedText },
    { title: "Achievement Post", value: achievementPost }
  ];

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <Link href="/" className="text-sm font-bold text-accent">
          Back to portfolio
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold text-ink">LinkedIn Helper</h1>
        <p className="mt-2 max-w-3xl leading-7 text-muted">
          Generates LinkedIn-ready text only. It does not automate LinkedIn profile
          editing or use unofficial browser automation.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
            <label className="block">
              <span className="text-sm font-bold text-ink">Content item</span>
              <select
                value={selectedSlug}
                onChange={(event) => setSelectedSlug(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              >
                {items.map((item) => (
                  <option key={`${item.kind}:${item.slug}`} value={`${item.kind}:${item.slug}`}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-muted">
              <p className="font-bold text-ink">Manual update checklist</p>
              <label className="mt-3 flex gap-2">
                <input type="checkbox" /> Update About section
              </label>
              <label className="mt-2 flex gap-2">
                <input type="checkbox" /> Add project or experience
              </label>
              <label className="mt-2 flex gap-2">
                <input type="checkbox" /> Add certificate or media
              </label>
              <label className="mt-2 flex gap-2">
                <input type="checkbox" /> Publish achievement post
              </label>
            </div>
          </aside>

          <section className="space-y-4">
            {blocks.map((block) => (
              <article
                key={block.title}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-card"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-extrabold text-ink">{block.title}</h2>
                  <button
                    type="button"
                    onClick={() => copy(block.value)}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold"
                  >
                    <Clipboard className="h-4 w-4" />
                    Copy
                  </button>
                </div>
                <textarea
                  value={block.value}
                  readOnly
                  className="h-44 w-full rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6"
                />
              </article>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
