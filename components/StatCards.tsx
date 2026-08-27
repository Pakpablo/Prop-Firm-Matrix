import { stats } from "@/lib/data";

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-1.5 text-2xl font-semibold text-zinc-100">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-zinc-500">{sub}</div>}
    </div>
  );
}

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard
        label="Firms Tracked"
        value={String(stats.total)}
        sub={`${stats.futuresCount} Futures · ${stats.forexCount} Forex/CFD`}
      />
      <StatCard
        label="Avg Trustpilot"
        value={stats.avgTrustpilotScore.toFixed(2)}
        sub="across scored firms"
      />
      <StatCard
        label="Cheapest 50K Eval"
        value={
          stats.cheapestEval
            ? `$${stats.cheapestEval.pricing.avgEvaluationFee50k}`
            : "—"
        }
        sub={stats.cheapestEval?.name}
      />
      <StatCard
        label="Top Rated"
        value={stats.topRated ? stats.topRated.trustpilotScore!.toFixed(1) : "—"}
        sub={stats.topRated?.name}
      />
    </div>
  );
}
