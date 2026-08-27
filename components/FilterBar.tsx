"use client";

import type { Category, SortDirection, SortKey, Tier } from "@/lib/types";

const CATEGORIES: (Category | "All")[] = ["All", "Futures", "Forex/CFD"];
const TIERS: Tier[] = [1, 2, 3, 4];
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "tier", label: "Tier" },
  { key: "name", label: "Name" },
  { key: "trustpilotScore", label: "Trustpilot Score" },
  { key: "avgEvaluationFee50k", label: "Eval Fee (50K)" },
  { key: "profitSplit", label: "Profit Split" },
];

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  category: Category | "All";
  onCategoryChange: (v: Category | "All") => void;
  activeTiers: Set<Tier>;
  onToggleTier: (t: Tier) => void;
  sortKey: SortKey;
  sortDir: SortDirection;
  onSortKeyChange: (k: SortKey) => void;
  onToggleSortDir: () => void;
  resultCount: number;
}

export default function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  activeTiers,
  onToggleTier,
  sortKey,
  sortDir,
  onSortKeyChange,
  onToggleSortDir,
  resultCount,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search firm or headquarters…"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none sm:max-w-xs"
        />

        <div className="flex items-center gap-2 text-sm">
          <label className="text-zinc-500">Sort</label>
          <select
            value={sortKey}
            onChange={(e) => onSortKeyChange(e.target.value as SortKey)}
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-2 text-zinc-100 focus:border-zinc-500 focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onToggleSortDir}
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-2 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
            title={sortDir === "asc" ? "Ascending" : "Descending"}
          >
            {sortDir === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCategoryChange(c)}
              className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors ${
                category === c
                  ? "bg-zinc-100 text-zinc-900 ring-zinc-100"
                  : "text-zinc-400 ring-zinc-700 hover:text-zinc-100 hover:ring-zinc-500"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mx-1 h-4 w-px bg-zinc-800" />

        <div className="flex gap-1.5">
          {TIERS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onToggleTier(t)}
              className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors ${
                activeTiers.size === 0 || activeTiers.has(t)
                  ? "text-zinc-200 ring-zinc-600"
                  : "text-zinc-600 ring-zinc-800"
              }`}
            >
              Tier {t}
            </button>
          ))}
        </div>

        <span className="ml-auto text-xs text-zinc-500">
          {resultCount} firm{resultCount === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}
