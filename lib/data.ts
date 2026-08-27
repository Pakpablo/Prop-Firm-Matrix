import rawFirms from "@/data/firms.json";
import type { Firm } from "@/lib/types";

export const firms = rawFirms as Firm[];

export function getFirm(id: string): Firm | undefined {
  return firms.find((f) => f.id === id);
}

export const stats = {
  total: firms.length,
  futuresCount: firms.filter((f) => f.category === "Futures").length,
  forexCount: firms.filter((f) => f.category === "Forex/CFD").length,
  avgTrustpilotScore: average(
    firms.map((f) => f.trustpilotScore).filter((v): v is number => v !== null)
  ),
  cheapestEval: firms.reduce<Firm | null>((min, f) => {
    const fee = f.pricing.avgEvaluationFee50k;
    if (fee === null) return min;
    if (min === null || (min.pricing.avgEvaluationFee50k ?? Infinity) > fee) return f;
    return min;
  }, null),
  topRated: firms.reduce<Firm | null>((max, f) => {
    if (f.trustpilotScore === null) return max;
    if (max === null || (max.trustpilotScore ?? 0) < f.trustpilotScore) return f;
    return max;
  }, null),
};

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/** Extracts the first whole-number percentage in a profit-split string, e.g. "90/10" -> 90, for sorting. */
export function profitSplitSortValue(profitSplit: string): number {
  const match = profitSplit.match(/(\d{1,3})\s*\/\s*\d{1,3}/);
  if (match) return Number(match[1]);
  const percentMatch = profitSplit.match(/(\d{1,3})%/);
  return percentMatch ? Number(percentMatch[1]) : 0;
}
