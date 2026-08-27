"use client";

import type { Firm } from "@/lib/types";

interface CompareBarProps {
  firms: Firm[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onCompare: () => void;
}

export default function CompareBar({ firms, onRemove, onClear, onCompare }: CompareBarProps) {
  if (firms.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Compare ({firms.length}/3)
        </span>
        <div className="flex flex-wrap gap-2">
          {firms.map((f) => (
            <span
              key={f.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-200 ring-1 ring-inset ring-zinc-700"
            >
              {f.name}
              <button
                type="button"
                onClick={() => onRemove(f.id)}
                className="text-zinc-500 hover:text-zinc-200"
                aria-label={`Remove ${f.name} from comparison`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-100"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onCompare}
            disabled={firms.length < 2}
            className="rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
}
