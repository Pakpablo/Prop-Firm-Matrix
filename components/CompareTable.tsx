import FirmLogo from "@/components/FirmLogo";
import { CATEGORY_KEYS, type DetailFieldKey, type PakFirm } from "@/lib/pakPoints";

const DETAIL_ROWS: { key: DetailFieldKey; label: string }[] = [
  { key: "hq", label: "HQ / Jurisdiction" },
  { key: "platforms", label: "Markets & Platforms" },
  { key: "accountTypes", label: "Account Types" },
  { key: "drawdown", label: "Drawdown Rules" },
  { key: "payoutTerms", label: "Payout Terms" },
  { key: "pricing", label: "Pricing Model" },
  { key: "reputation", label: "Reputation" },
];

function detailValue(firm: PakFirm, key: DetailFieldKey): string | null {
  return firm.details && !firm.details.note ? firm.details[key] ?? null : null;
}

export default function CompareTable({
  firmA,
  firmB,
  lockA, // true if firmA is a fixed anchor (e.g. Day Traders) — visually pinned, not a "vs" of equals
}: {
  firmA: PakFirm;
  firmB: PakFirm;
  lockA?: boolean;
}) {
  return (
    <div>
      {/* ---- Head-to-head cards ---- */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <FirmHeader firm={firmA} pinned={lockA} />
        <div style={{ fontWeight: 800, color: "#ccc", fontSize: 18 }}>VS</div>
        <FirmHeader firm={firmB} />
      </div>

      {/* ---- Total PAK Points ---- */}
      <div
        style={{
          padding: 14, borderRadius: 10, background: "#0B0B0D", color: "#fff",
          display: "flex", justifyContent: "space-around", textAlign: "center", marginBottom: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{firmA.breakdown.pakPoints}</div>
          <div style={{ fontSize: 10, color: "#bbb" }}>PAK POINTS</div>
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{firmB.breakdown.pakPoints}</div>
          <div style={{ fontSize: 10, color: "#bbb" }}>PAK POINTS</div>
        </div>
      </div>

      {/* ---- Category-by-category bars ---- */}
      <div style={{ fontSize: 12, fontWeight: 800, color: "#333", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>
        PAK Points Breakdown
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {CATEGORY_KEYS.map((cat) => {
          const aVal = firmA.breakdown[cat.key];
          const bVal = firmB.breakdown[cat.key];
          return (
            <div key={cat.key}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "#555", marginBottom: 4 }}>
                {cat.label} <span style={{ color: "#aaa", fontWeight: 400 }}>/ {cat.max} pts</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Bar value={aVal} max={cat.max} win={aVal > bVal} align="right" />
                <div style={{ width: 56, textAlign: "center", fontSize: 11, color: "#999" }}>
                  {aVal} &ndash; {bVal}
                </div>
                <Bar value={bVal} max={cat.max} win={bVal > aVal} align="left" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- Full attribute-by-attribute table ---- */}
      <div style={{ fontSize: 12, fontWeight: 800, color: "#333", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>
        Full Comparison
      </div>
      <div style={{ border: "1px solid #eee", borderRadius: 10, overflow: "hidden" }}>
        <MetaRow label="Overall Rank" a={`#${firmA.rank} of 59`} b={`#${firmB.rank} of 59`} />
        <MetaRow label="Vertical" a={cap(firmA.vertical)} b={cap(firmB.vertical)} />
        <MetaRow label="Tier" a={`Tier ${firmA.tier}`} b={`Tier ${firmB.tier}`} />
        <MetaRow
          label="Data Confidence"
          a={firmA.confidence === "researched" ? "Researched" : "Provisional"}
          b={firmB.confidence === "researched" ? "Researched" : "Provisional"}
          highlightMismatch
        />
        {DETAIL_ROWS.map((row, i) => (
          <MetaRow
            key={row.key}
            label={row.label}
            a={detailValue(firmA, row.key)}
            b={detailValue(firmB, row.key)}
            striped={i % 2 === 1}
          />
        ))}
      </div>
      <p style={{ fontSize: 10.5, color: "#999", marginTop: 8, lineHeight: 1.5 }}>
        &quot;Not yet researched&quot; means that firm&apos;s score is a provisional tier-based
        estimate rather than data pulled from its own disclosed terms.
      </p>
    </div>
  );
}

function FirmHeader({ firm, pinned }: { firm: PakFirm; pinned?: boolean }) {
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <FirmLogo name={firm.name} domain={firm.domain} size={44} />
      <div style={{ fontWeight: 700, fontSize: 13, marginTop: 6 }}>{firm.name}</div>
      <div style={{ fontSize: 10.5, color: pinned ? "#D42B3F" : "#999" }}>
        {pinned ? "Anchor firm" : `#${firm.rank} overall`}
      </div>
    </div>
  );
}

function Bar({ value, max, win, align }: { value: number; max: number; win: boolean; align: "left" | "right" }) {
  const pct = Math.max(4, (value / max) * 100);
  return (
    <div style={{ flex: 1, height: 9, background: "#eee", borderRadius: 6, overflow: "hidden", display: "flex", justifyContent: align === "right" ? "flex-end" : "flex-start" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: win ? "#D42B3F" : "#ccc", borderRadius: 6 }} />
    </div>
  );
}

function MetaRow({
  label, a, b, striped, highlightMismatch,
}: {
  label: string; a: string | null; b: string | null; striped?: boolean; highlightMismatch?: boolean;
}) {
  const mismatch = highlightMismatch && a !== b;
  return (
    <div style={{ background: striped ? "#FAFAFB" : "#fff", borderBottom: "1px solid #f0f0f0" }}>
      <div style={{ padding: "8px 12px 2px", fontSize: 10, fontWeight: 700, color: "#D42B3F", textTransform: "uppercase", letterSpacing: 0.3 }}>
        {label}
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, padding: "2px 12px 10px", fontSize: 12.5, color: a ? "#222" : "#bbb", fontStyle: a ? "normal" : "italic", lineHeight: 1.45 }}>
          {a ?? "Not yet researched"}
        </div>
        <div style={{ width: 1, background: "#eee" }} />
        <div style={{ flex: 1, padding: "2px 12px 10px", fontSize: 12.5, color: b ? "#222" : "#bbb", fontStyle: b ? "normal" : "italic", lineHeight: 1.45 }}>
          {b ?? "Not yet researched"}
        </div>
      </div>
      {mismatch && (
        <div style={{ padding: "0 12px 8px", fontSize: 9.5, color: "#b7791f" }}>
          &#9888; different confidence levels &mdash; treat scores accordingly
        </div>
      )}
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
