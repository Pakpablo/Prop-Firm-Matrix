import roster from "@/data/prop-firms-data.json";
import legacyProfiles from "@/data/firms.json";
import type { Category, Firm, FirmProfile, Tier } from "@/lib/types";

interface RosterEntry {
  name: string;
  domain: string;
  tier: number;
  verified: boolean;
}

// The old 20-firm dataset used slightly different display names for a few
// firms than the master roster does. Map roster name -> legacy profile name
// so the merge below still finds the researched data for these.
const NAME_ALIASES: Record<string, string> = {
  "Alpha Futures": "Alpha Futures Funding",
  "Blue Guardian": "Blue Guardian Futures",
  "One Up Trader": "OneUp Trader",
  The5ers: "The 5%ers",
};

function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const profileByNormalizedName = new Map<string, FirmProfile>(
  (legacyProfiles as (FirmProfile & { name: string })[]).map((p) => [
    normalize(p.name),
    p,
  ])
);

function buildFirms(entries: RosterEntry[], category: Category): Firm[] {
  return entries.map((entry) => {
    const lookupName = NAME_ALIASES[entry.name] ?? entry.name;
    const profile = profileByNormalizedName.get(normalize(lookupName));
    return {
      id: slugify(entry.name),
      name: entry.name,
      category,
      tier: entry.tier as Tier,
      domain: entry.domain,
      domainVerified: entry.verified,
      profile,
    };
  });
}

export const firms: Firm[] = [
  ...buildFirms((roster as { futures: RosterEntry[] }).futures, "Futures"),
  ...buildFirms((roster as { forex_cfd: RosterEntry[] }).forex_cfd, "Forex/CFD"),
];

export function getFirm(id: string): Firm | undefined {
  return firms.find((f) => f.id === id);
}

const profiled = firms.filter((f) => f.profile);

export const stats = {
  total: firms.length,
  profiledCount: profiled.length,
  futuresCount: firms.filter((f) => f.category === "Futures").length,
  forexCount: firms.filter((f) => f.category === "Forex/CFD").length,
  avgTrustpilotScore: average(
    profiled
      .map((f) => f.profile!.trustpilotScore)
      .filter((v): v is number => v !== null)
  ),
  cheapestEval: profiled.reduce<Firm | null>((min, f) => {
    const fee = f.profile!.pricing.avgEvaluationFee50k;
    if (fee === null) return min;
    if (min === null || (min.profile!.pricing.avgEvaluationFee50k ?? Infinity) > fee)
      return f;
    return min;
  }, null),
  topRated: profiled.reduce<Firm | null>((max, f) => {
    const score = f.profile!.trustpilotScore;
    if (score === null) return max;
    if (max === null || (max.profile!.trustpilotScore ?? 0) < score) return f;
    return max;
  }, null),
};

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/** Extracts the first whole-number percentage in a profit-split string, e.g. "90/10" -> 90, for sorting. */
export function profitSplitSortValue(profitSplit: string | undefined): number {
  if (!profitSplit) return -1;
  const match = profitSplit.match(/(\d{1,3})\s*\/\s*\d{1,3}/);
  if (match) return Number(match[1]);
  const percentMatch = profitSplit.match(/(\d{1,3})%/);
  return percentMatch ? Number(percentMatch[1]) : 0;
}
