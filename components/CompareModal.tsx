"use client";

import { useEffect } from "react";
import type { Firm } from "@/lib/types";
import { CategoryPill, Chip, StarRating, TierBadge } from "@/components/badges";

interface CompareModalProps {
  firms: Firm[];
  onClose: () => void;
}

function money(v: number | "None" | null): string {
  if (v === null) return "—";
  if (v === "None") return "None";
  return `$${v}`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <tr className="bg-zinc-900/80">
        <td
          colSpan={99}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          {title}
        </td>
      </tr>
      {children}
    </>
  );
}

function CompareRow({
  label,
  values,
}: {
  label: string;
  values: React.ReactNode[];
}) {
  return (
    <tr className="border-b border-zinc-800/70">
      <td className="sticky left-0 bg-zinc-950 px-4 py-3 text-sm text-zinc-500">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="min-w-[220px] px-4 py-3 text-sm text-zinc-200 align-top">
          {v}
        </td>
      ))}
    </tr>
  );
}

export default function CompareModal({ firms, onClose }: CompareModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-8">
      <div className="w-full max-w-6xl rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-zinc-100">Firm Comparison</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          >
            Close ✕
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-800">
                <td className="sticky left-0 bg-zinc-950 px-4 py-3" />
                {firms.map((f) => (
                  <td key={f.id} className="min-w-[220px] px-4 py-3">
                    <div className="font-semibold text-zinc-100">{f.name}</div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <CategoryPill category={f.category} />
                      <TierBadge tier={f.tier} compact />
                    </div>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow
                label="Headquarters"
                values={firms.map((f) => f.headquarters)}
              />
              <CompareRow
                label="Trustpilot"
                values={firms.map((f) => (
                  <StarRating
                    key={f.id}
                    score={f.trustpilotScore}
                    count={f.trustpilotReviewsCount}
                  />
                ))}
              />

              <Section title="Pricing">
                <CompareRow
                  label="Pricing Type"
                  values={firms.map((f) => f.pricing.pricingType)}
                />
                <CompareRow
                  label="Eval Fee (50K)"
                  values={firms.map((f) => money(f.pricing.avgEvaluationFee50k))}
                />
                <CompareRow
                  label="Activation Fee"
                  values={firms.map((f) => money(f.pricing.activationFee))}
                />
                <CompareRow
                  label="Reset Fee"
                  values={firms.map((f) => money(f.pricing.resetFee))}
                />
                <CompareRow
                  label="Bulk Discounts"
                  values={firms.map((f) =>
                    f.pricing.hasBulkDiscounts === null
                      ? "—"
                      : f.pricing.hasBulkDiscounts
                      ? "Yes"
                      : "No"
                  )}
                />
              </Section>

              <Section title="Drawdown Rules">
                <CompareRow
                  label="Type"
                  values={firms.map((f) => f.drawdownRules.type)}
                />
                <CompareRow
                  label="Daily Loss Limit"
                  values={firms.map((f) => f.drawdownRules.dailyLossLimit)}
                />
                <CompareRow
                  label="Min Trading Days"
                  values={firms.map((f) => f.drawdownRules.minTradingDays?.toString() ?? "—")}
                />
                <CompareRow
                  label="Consistency Rule"
                  values={firms.map((f) => f.drawdownRules.consistencyRule)}
                />
              </Section>

              <Section title="Payout Terms">
                <CompareRow
                  label="Profit Split"
                  values={firms.map((f) => f.payoutTerms.profitSplit)}
                />
                <CompareRow
                  label="Frequency"
                  values={firms.map((f) => f.payoutTerms.frequency)}
                />
                <CompareRow
                  label="Min Payout"
                  values={firms.map((f) => money(f.payoutTerms.minPayoutAmount))}
                />
                <CompareRow
                  label="Payout Cap"
                  values={firms.map((f) => f.payoutTerms.payoutCap ?? "—")}
                />
              </Section>

              <Section title="Platforms & Accounts">
                <CompareRow
                  label="Platforms"
                  values={firms.map((f) => (
                    <div key={f.id} className="flex flex-wrap gap-1">
                      {f.platforms.map((p) => (
                        <Chip key={p}>{p}</Chip>
                      ))}
                    </div>
                  ))}
                />
                <CompareRow
                  label="Account Sizes"
                  values={firms.map((f) => (
                    <div key={f.id} className="flex flex-wrap gap-1">
                      {f.accountSizes.map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>
                  ))}
                />
              </Section>

              <Section title="Strengths & Weaknesses">
                <CompareRow
                  label="USPs"
                  values={firms.map((f) => (
                    <ul key={f.id} className="space-y-1">
                      {f.uniqueSellingPoints.map((p, i) => (
                        <li key={i} className="flex gap-1.5">
                          <span className="text-emerald-500">✓</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  ))}
                />
                <CompareRow
                  label="Weaknesses"
                  values={firms.map((f) => (
                    <ul key={f.id} className="space-y-1">
                      {f.weaknesses.map((p, i) => (
                        <li key={i} className="flex gap-1.5">
                          <span className="text-amber-500">⚠</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  ))}
                />
              </Section>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
