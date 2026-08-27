"use client";

import { useMemo, useState } from "react";
import { firms as allFirms, profitSplitSortValue, stats } from "@/lib/data";
import type { Category, SortDirection, SortKey, Tier } from "@/lib/types";
import FilterBar from "@/components/FilterBar";
import MatrixTable from "@/components/MatrixTable";
import StatCards from "@/components/StatCards";
import CompareBar from "@/components/CompareBar";
import CompareModal from "@/components/CompareModal";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [activeTiers, setActiveTiers] = useState<Set<Tier>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("tier");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  function toggleTier(t: Tier) {
    setActiveTiers((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = allFirms.filter((f) => {
      if (category !== "All" && f.category !== category) return false;
      if (activeTiers.size > 0 && !activeTiers.has(f.tier)) return false;
      if (
        q &&
        !`${f.name} ${f.profile?.headquarters ?? ""}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "tier":
          cmp = a.tier - b.tier;
          break;
        case "trustpilotScore":
          cmp = (a.profile?.trustpilotScore ?? -1) - (b.profile?.trustpilotScore ?? -1);
          break;
        case "avgEvaluationFee50k":
          cmp =
            (a.profile?.pricing.avgEvaluationFee50k ?? Infinity) -
            (b.profile?.pricing.avgEvaluationFee50k ?? Infinity);
          break;
        case "profitSplit":
          cmp =
            profitSplitSortValue(a.profile?.payoutTerms.profitSplit) -
            profitSplitSortValue(b.profile?.payoutTerms.profitSplit);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [search, category, activeTiers, sortKey, sortDir]);

  const compareFirms = useMemo(
    () => compareIds.map((id) => allFirms.find((f) => f.id === id)!).filter(Boolean),
    [compareIds]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-24 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
          Prop Firm Competitor Matrix
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-zinc-400">
          Tracking {allFirms.length} Futures and Forex/CFD proprietary trading firms —
          {" "}
          {stats.profiledCount} with full pricing, drawdown rule, payout term, and
          reputation detail, the rest logo-identified pending deeper research.
        </p>
      </header>

      <div className="mb-6">
        <StatCards />
      </div>

      <div className="mb-4">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          activeTiers={activeTiers}
          onToggleTier={toggleTier}
          sortKey={sortKey}
          sortDir={sortDir}
          onSortKeyChange={setSortKey}
          onToggleSortDir={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          resultCount={filtered.length}
        />
      </div>

      <MatrixTable
        firms={filtered}
        expandedId={expandedId}
        onToggleExpand={(id) => setExpandedId((cur) => (cur === id ? null : id))}
        compareIds={compareIds}
        onToggleCompare={toggleCompare}
        compareFull={compareIds.length >= 3}
      />

      <footer className="mt-8 text-center text-xs text-zinc-600">
        Data compiled from Trustpilot and official firm pricing pages, August 2026.
        Fields marked &ldquo;—&rdquo; or &ldquo;withheld&rdquo; could not be verified at research time.
      </footer>

      <CompareBar
        firms={compareFirms}
        onRemove={toggleCompare}
        onClear={() => setCompareIds([])}
        onCompare={() => setCompareOpen(true)}
      />

      {compareOpen && (
        <CompareModal firms={compareFirms} onClose={() => setCompareOpen(false)} />
      )}
    </div>
  );
}
