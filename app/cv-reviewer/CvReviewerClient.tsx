"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CareerItem, CareerProfile } from "@/lib/content";
import type { CvReviewResult } from "@/lib/cv-reviewer";

type CvReviewerClientProps = {
  profile: CareerProfile;
};

function itemKey(item: CareerItem) {
  return `${item.kind}:${item.slug}`;
}

export function CvReviewerClient({ profile }: CvReviewerClientProps) {
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyNotes, setCompanyNotes] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(() =>
    profile.allItems.slice(0, 6).map(itemKey)
  );
  const [result, setResult] = useState<CvReviewResult | null>(null);
  const selectedItems = useMemo(
    () => profile.allItems.filter((item) => selectedKeys.includes(itemKey(item))),
    [profile.allItems, selectedKeys]
  );

  async function runReview() {
    const response = await fetch("/api/cv-reviewer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company,
        jobTitle,
        jobDescription,
        companyNotes,
        selectedItemSlugs: selectedKeys
      })
    });
    setResult(await response.json());
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[420px_1fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
          <Link href="/" className="text-sm font-bold text-accent">
            Back to portfolio
          </Link>
          <h1 className="mt-3 text-3xl font-extrabold text-ink">AI CV Reviewer</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            MVP reviewer uses only your existing content and job text. It does not
            invent experience.
          </p>

          <div className="mt-5 space-y-4">
            <input
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Company"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              placeholder="Job title"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste job description"
              className="h-40 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
            <textarea
              value={companyNotes}
              onChange={(event) => setCompanyNotes(event.target.value)}
              placeholder="Optional company notes"
              className="h-24 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-5 space-y-2">
            <p className="text-sm font-bold text-ink">Selected CV content</p>
            {profile.allItems.map((item) => {
              const key = itemKey(item);
              return (
                <label key={key} className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedKeys.includes(key)}
                    onChange={() =>
                      setSelectedKeys((current) =>
                        current.includes(key)
                          ? current.filter((value) => value !== key)
                          : [...current, key]
                      )
                    }
                  />
                  {item.title}
                </label>
              );
            })}
          </div>

          <button
            type="button"
            onClick={runReview}
            className="mt-5 rounded-md bg-accent px-4 py-2 text-sm font-bold text-white"
          >
            Review CV
          </button>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="text-xl font-extrabold text-ink">Review Output</h2>
          {result ? (
            <div className="mt-5 space-y-5">
              <p className="text-4xl font-extrabold text-accent">{result.matchScore}%</p>
              {[
                ["Missing keywords", result.missingKeywords],
                ["Strengths", result.strengths],
                ["Weaknesses", result.weaknesses],
                ["Suggested bullet rewrites", result.suggestedBulletRewrites],
                ["Skills to highlight", result.skillsToHighlight],
                ["Recommended experiences", result.includeExperiences],
                ["Interview preparation topics", result.interviewTopics]
              ].map(([title, values]) => (
                <div key={title as string}>
                  <h3 className="font-bold text-ink">{title as string}</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
                    {(values as string[]).map((value) => (
                      <li key={value}>{value}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-muted">
              Select {selectedItems.length} item(s), paste a job description, and run the review.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
