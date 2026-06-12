"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { CareerItem } from "@/lib/content";
import { SkillBadge } from "./SkillBadge";

type ContentExplorerProps = {
  items: CareerItem[];
  filters: string[];
};

export function ContentExplorer({ items, filters }: ContentExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const haystack = [
        item.title,
        item.organization,
        item.role,
        item.type,
        item.category,
        item.summary,
        ...item.tags,
        ...item.technologies,
        ...item.bullets
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const filterMatch =
        activeFilter === "all" ||
        [
          item.kind,
          item.type,
          item.category,
          ...item.tags,
          ...item.technologies
        ]
          .filter(Boolean)
          .map((value) => String(value).toLowerCase())
          .includes(activeFilter.toLowerCase());

      return filterMatch && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [activeFilter, items, query]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
        <label className="relative block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, tag, skill, technology, or summary"
            className="w-full rounded-md border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm font-medium text-ink outline-none transition focus:border-accent"
          />
        </label>
        <select
          value={activeFilter}
          onChange={(event) => setActiveFilter(event.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-ink outline-none transition focus:border-accent"
        >
          <option value="all">All categories</option>
          {filters.map((filter) => (
            <option key={filter} value={filter}>
              {filter}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {visibleItems.map((item) => (
          <article
            key={`${item.kind}-${item.slug}`}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-card"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="rounded-md bg-accent/10 px-2.5 py-1 text-accent">
                {item.kind}
              </span>
              {item.type ? (
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-600">
                  {item.type}
                </span>
              ) : null}
            </div>
            <h3 className="text-lg font-bold text-ink">{item.title}</h3>
            {item.role || item.organization ? (
              <p className="mt-1 text-sm font-semibold text-accent">
                {[item.role, item.organization].filter(Boolean).join(" at ")}
              </p>
            ) : null}
            <p className="mt-3 leading-7 text-muted">{item.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[...item.tags, ...item.technologies].slice(0, 8).map((tag) => (
                <SkillBadge key={tag} label={tag} />
              ))}
            </div>
          </article>
        ))}
      </div>

      {visibleItems.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm font-semibold text-muted">
          No content matches this search.
        </p>
      ) : null}
    </div>
  );
}
