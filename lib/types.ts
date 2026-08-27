export type Category = "Futures" | "Forex/CFD";
export type Tier = 1 | 2 | 3 | 4;

export interface Pricing {
  pricingType: "Monthly Subscription" | "One-Time Fee";
  avgEvaluationFee50k: number | null;
  activationFee: number | "None" | null;
  resetFee: number | null;
  hasBulkDiscounts: boolean | null;
}

export interface DrawdownRules {
  type: "EOD" | "Trailing" | "Static";
  dailyLossLimit: "Hard Stop" | "Soft Stop" | "None";
  consistencyRule: string;
  minTradingDays: number | null;
}

export interface PayoutTerms {
  profitSplit: string;
  frequency: string;
  minPayoutAmount: number | null;
  payoutCap: string | null;
}

export interface Firm {
  id: string;
  name: string;
  category: Category;
  tier: Tier;
  headquarters: string;
  trustpilotScore: number | null;
  trustpilotReviewsCount: number | null;
  platforms: string[];
  dataFeeds: string[] | null;
  accountSizes: string[];
  pricing: Pricing;
  drawdownRules: DrawdownRules;
  payoutTerms: PayoutTerms;
  uniqueSellingPoints: string[];
  weaknesses: string[];
}

export type SortKey =
  | "name"
  | "tier"
  | "trustpilotScore"
  | "avgEvaluationFee50k"
  | "profitSplit";

export type SortDirection = "asc" | "desc";
