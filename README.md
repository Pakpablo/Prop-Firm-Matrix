# Prop Firm Competitor Matrix

Interactive competitive-intelligence dashboard tracking Futures and Forex/CFD proprietary trading firms — pricing, drawdown rules, payout terms, platforms, and Trustpilot reputation, side by side.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4. No backend — data is static JSON read at build time.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Data

`data/firms.json` holds the dataset (20 firms as of Aug 2026), typed by `lib/types.ts`. Fields that couldn't be verified from a live source are `null` rather than guessed — the UI renders those as "—" or "withheld" (Trustpilot scores are shown as withheld for firms where Trustpilot itself has suspended the score after removing fake reviews).

To add or update a firm, edit `data/firms.json` directly — it's validated against the `Firm` type at build time via `lib/data.ts`.

## Features

- Sortable, filterable matrix table (search, category, tier, sort by score/fee/split)
- Click a row to expand full pricing, drawdown, payout, platform, and USP/weakness detail
- Select up to 3 firms and open a side-by-side comparison modal
- Summary stat cards (firm count, avg Trustpilot score, cheapest eval, top rated)

## Deploy

Zero-config on [Vercel](https://vercel.com/new) — connect the repo and deploy, or run `vercel` from this directory.
