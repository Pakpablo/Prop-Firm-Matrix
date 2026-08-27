import pakData from "@/data/pak-points-scored.json";

export type Vertical = "futures" | "forex";
export type Confidence = "researched" | "provisional";

export interface PakBreakdown {
  trust: number;
  payout: number;
  economics: number;
  rules: number;
  longevity: number;
  pakPoints: number;
}

export interface FirmDetails {
  /** Present instead of the profile fields below when a firm hasn't been researched in depth yet. */
  note?: string;
  hq?: string;
  platforms?: string;
  accountTypes?: string;
  drawdown?: string;
  payoutTerms?: string;
  pricing?: string;
  reputation?: string;
}

export interface PakFirm {
  name: string;
  vertical: Vertical;
  tier: number;
  confidence: Confidence;
  breakdown: PakBreakdown;
  rank: number;
  domain: string;
  details?: FirmDetails;
}

export interface PakCategory {
  name: string;
  points: number;
  detail: string;
}

export interface PakMethodology {
  totalPoints: number;
  categories: PakCategory[];
  note: string;
}

export const methodology: PakMethodology = pakData.methodology;
export const firms: PakFirm[] = pakData.firms as PakFirm[];

export function sortedByPakPoints(): PakFirm[] {
  return [...firms].sort((a, b) => b.breakdown.pakPoints - a.breakdown.pakPoints);
}

export function getFirm(name: string): PakFirm | undefined {
  return firms.find((f) => f.name === name);
}

export type DetailFieldKey = keyof Omit<FirmDetails, "note">;

export const CATEGORY_KEYS = [
  { key: "trust", label: "Trust & Reputation", max: 30 },
  { key: "payout", label: "Payout Reliability", max: 25 },
  { key: "economics", label: "Trader Economics", max: 20 },
  { key: "rules", label: "Rules Flexibility", max: 15 },
  { key: "longevity", label: "Longevity & Scale", max: 10 },
] as const satisfies { key: keyof Omit<PakBreakdown, "pakPoints">; label: string; max: number }[];
