"use client";

import { Fragment } from "react";
import type { Firm } from "@/lib/types";
import { CategoryPill, Chip, StarRating, TierBadge } from "@/components/badges";
import FirmLogo from "@/components/FirmLogo";

interface MatrixTableProps {
  firms: Firm[];
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  compareFull: boolean;
}

function money(v: number | "None" | null | undefined): string {
  if (v === null || v === undefined) return "—";
  if (v === "None") return "None";
  return `$${v}`;
}

export default function MatrixTable({
  firms,
  expandedId,
  onToggleExpand,
  compareIds,
  onToggleCompare,
  compareFull,
}: MatrixTableProps) {
  if (firms.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-10 text-center text-sm text-zinc-500">
        No firms match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/60">
      <table className="w-full min-w-[920px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
            <th className="w-10 px-3 py-3"> </th>
            <th className="px-3 py-3 font-medium">Firm</th>
            <th className="px-3 py-3 font-medium">Category</th>
            <th className="px-3 py-3 font-medium">Tier</th>
            <th className="px-3 py-3 font-medium">Trustpilot</th>
            <th className="px-3 py-3 font-medium">Eval Fee (50K)</th>
            <th className="px-3 py-3 font-medium">Profit Split</th>
            <th className="px-3 py-3 font-medium">Drawdown</th>
            <th className="px-3 py-3 font-medium">Payout</th>
            <th className="w-8 px-3 py-3"> </th>
          </tr>
        </thead>
        <tbody>
          {firms.map((firm) => {
            const isExpanded = expandedId === firm.id;
            const isSelected = compareIds.includes(firm.id);
            const disableSelect = !isSelected && compareFull;
            const profile = firm.profile;
            return (
              <Fragment key={firm.id}>
                <tr
                  onClick={() => onToggleExpand(firm.id)}
                  className={`cursor-pointer border-b border-zinc-800/70 transition-colors hover:bg-zinc-800/40 ${
                    isExpanded ? "bg-zinc-800/40" : ""
                  }`}
                >
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={disableSelect}
                      onChange={() => onToggleCompare(firm.id)}
                      title={
                        disableSelect
                          ? "Compare up to 3 firms at a time"
                          : "Add to comparison"
                      }
                      className="h-4 w-4 rounded border-zinc-600 bg-zinc-950 accent-emerald-500 disabled:opacity-30"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <FirmLogo name={firm.name} domain={firm.domain} size={28} />
                      <div>
                        <div className="font-medium text-zinc-100">{firm.name}</div>
                        <div className="text-xs text-zinc-500">
                          {profile?.headquarters ?? "Not yet profiled"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <CategoryPill category={firm.category} />
                  </td>
                  <td className="px-3 py-3">
                    <TierBadge tier={firm.tier} compact />
                  </td>
                  <td className="px-3 py-3">
                    <StarRating
                      score={profile?.trustpilotScore ?? null}
                      count={profile?.trustpilotReviewsCount ?? null}
                      profiled={!!profile}
                    />
                  </td>
                  <td className="px-3 py-3 text-zinc-300">
                    {money(profile?.pricing.avgEvaluationFee50k)}
                  </td>
                  <td className="px-3 py-3 text-zinc-300">
                    {profile?.payoutTerms.profitSplit ?? "—"}
                  </td>
                  <td className="px-3 py-3 text-zinc-300">
                    {profile
                      ? `${profile.drawdownRules.type} · ${profile.drawdownRules.dailyLossLimit}`
                      : "—"}
                  </td>
                  <td className="px-3 py-3 text-zinc-300">
                    {profile?.payoutTerms.frequency ?? "—"}
                  </td>
                  <td className="px-3 py-3 text-zinc-500">
                    <span
                      className={`inline-block transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      ▾
                    </span>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="border-b border-zinc-800/70 bg-zinc-950/40">
                    <td colSpan={10} className="px-6 py-5">
                      {!profile ? (
                        <div className="flex items-center justify-between gap-4 rounded-lg border border-dashed border-zinc-700 px-4 py-3 text-sm text-zinc-400">
                          <span>
                            Full profile not yet researched for {firm.name} — pricing,
                            drawdown, and payout detail are unavailable.
                          </span>
                          <a
                            href={`https://${firm.domain}`}
                            target="_blank"
                            rel="noreferrer"
                            className="shrink-0 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
                          >
                            Visit {firm.domain} ↗
                          </a>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div>
                              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                Pricing
                              </h4>
                              <dl className="space-y-1 text-sm">
                                <Row label="Type" value={profile.pricing.pricingType} />
                                <Row
                                  label="Activation Fee"
                                  value={money(profile.pricing.activationFee)}
                                />
                                <Row
                                  label="Reset Fee"
                                  value={money(profile.pricing.resetFee)}
                                />
                                <Row
                                  label="Bulk Discounts"
                                  value={
                                    profile.pricing.hasBulkDiscounts === null
                                      ? "—"
                                      : profile.pricing.hasBulkDiscounts
                                      ? "Yes"
                                      : "No"
                                  }
                                />
                              </dl>
                            </div>

                            <div>
                              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                Drawdown &amp; Payout
                              </h4>
                              <dl className="space-y-1 text-sm">
                                <Row
                                  label="Min Trading Days"
                                  value={
                                    profile.drawdownRules.minTradingDays?.toString() ?? "—"
                                  }
                                />
                                <Row
                                  label="Consistency Rule"
                                  value={profile.drawdownRules.consistencyRule}
                                  wrap
                                />
                                <Row
                                  label="Min Payout"
                                  value={money(profile.payoutTerms.minPayoutAmount)}
                                />
                                <Row
                                  label="Payout Cap"
                                  value={profile.payoutTerms.payoutCap ?? "—"}
                                  wrap
                                />
                              </dl>
                            </div>

                            <div>
                              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                Platforms &amp; Accounts
                              </h4>
                              <div className="mb-2 flex flex-wrap gap-1.5">
                                {profile.platforms.map((p) => (
                                  <Chip key={p}>{p}</Chip>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {profile.accountSizes.map((s) => (
                                  <Chip key={s}>{s}</Chip>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-500">
                                Unique Selling Points
                              </h4>
                              <ul className="space-y-1.5 text-sm text-zinc-300">
                                {profile.uniqueSellingPoints.map((point, i) => (
                                  <li key={i} className="flex gap-2">
                                    <span className="text-emerald-500">✓</span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-500">
                                Weaknesses
                              </h4>
                              <ul className="space-y-1.5 text-sm text-zinc-300">
                                {profile.weaknesses.map((point, i) => (
                                  <li key={i} className="flex gap-2">
                                    <span className="text-amber-500">⚠</span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Row({
  label,
  value,
  wrap = false,
}: {
  label: string;
  value: string;
  wrap?: boolean;
}) {
  return (
    <div className={wrap ? "" : "flex items-baseline justify-between gap-3"}>
      <dt className="text-zinc-500">{label}</dt>
      <dd className={wrap ? "mt-0.5 text-zinc-300" : "text-right text-zinc-300"}>
        {value}
      </dd>
    </div>
  );
}
