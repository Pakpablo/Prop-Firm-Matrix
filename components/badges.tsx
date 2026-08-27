import type { Category, Tier } from "@/lib/types";

const TIER_STYLES: Record<Tier, string> = {
  1: "bg-amber-400/15 text-amber-300 ring-amber-400/30",
  2: "bg-sky-400/15 text-sky-300 ring-sky-400/30",
  3: "bg-zinc-400/15 text-zinc-300 ring-zinc-400/30",
  4: "bg-zinc-600/15 text-zinc-500 ring-zinc-600/30",
};

const TIER_LABEL: Record<Tier, string> = {
  1: "Tier 1 · Leader",
  2: "Tier 2 · Challenger",
  3: "Tier 3 · Secondary",
  4: "Tier 4 · Niche",
};

export function TierBadge({ tier, compact = false }: { tier: Tier; compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TIER_STYLES[tier]}`}
    >
      {compact ? `T${tier}` : TIER_LABEL[tier]}
    </span>
  );
}

const CATEGORY_STYLES: Record<Category, string> = {
  Futures: "bg-indigo-400/15 text-indigo-300 ring-indigo-400/30",
  "Forex/CFD": "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
};

export function CategoryPill({ category }: { category: Category }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${CATEGORY_STYLES[category]}`}
    >
      {category}
    </span>
  );
}

export function StarRating({
  score,
  count,
  profiled = true,
}: {
  score: number | null;
  count: number | null;
  /** False for roster-only firms with no researched profile at all — renders a plain dash instead of implying Trustpilot withheld the score. */
  profiled?: boolean;
}) {
  if (!profiled) {
    return <span className="text-xs text-zinc-600">—</span>;
  }
  if (score === null) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-zinc-500" title="Trustpilot score currently withheld/unavailable">
        <span className="text-amber-500">&#9888;</span> withheld
      </span>
    );
  }
  return (
    <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
      <span className="font-medium text-zinc-100">{score.toFixed(1)}</span>
      <span className="text-amber-400" aria-hidden>
        {"★".repeat(Math.round(score))}
        <span className="text-zinc-700">{"★".repeat(5 - Math.round(score))}</span>
      </span>
      {count !== null && (
        <span className="text-xs text-zinc-500">({count.toLocaleString()})</span>
      )}
    </span>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-zinc-800/80 px-2 py-1 text-xs text-zinc-300 ring-1 ring-inset ring-zinc-700/50">
      {children}
    </span>
  );
}
