"use client";

import { useState } from "react";
import FirmLogo from "@/components/FirmLogo";
import { CATEGORY_KEYS, firms, type PakFirm } from "@/lib/pakPoints";

const DT_NAME = "Day Traders";

export default function CompareWithDT() {
  const dayTraders = firms.find((f) => f.name === DT_NAME)!;
  const others = firms
    .filter((f) => f.name !== DT_NAME)
    .sort((a, b) => a.name.localeCompare(b.name));
  const [opponentName, setOpponentName] = useState(others[0].name);
  const opponent = firms.find((f) => f.name === opponentName)!;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
        Compare with Day Traders
      </h1>
      <p style={{ color: "#666", marginBottom: 20 }}>
        See how any firm stacks up against Day Traders on PAK Points.
      </p>

      {/* ---- Opponent picker ---- */}
      <select
        value={opponentName}
        onChange={(e) => setOpponentName(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #ddd",
          fontSize: 14,
          marginBottom: 20,
        }}
      >
        {others.map((f) => (
          <option key={f.name} value={f.name}>
            {f.name} ({f.breakdown.pakPoints} pts)
          </option>
        ))}
      </select>

      {/* ---- Head-to-head header ---- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <FirmCard firm={dayTraders} highlight />
        <div style={{ fontWeight: 800, color: "#ccc", fontSize: 20 }}>VS</div>
        <FirmCard firm={opponent} />
      </div>

      {/* ---- Category-by-category bars ---- */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {CATEGORY_KEYS.map((cat) => {
          const dtVal = dayTraders.breakdown[cat.key];
          const opVal = opponent.breakdown[cat.key];
          const dtWins = dtVal > opVal;
          const opWins = opVal > dtVal;
          return (
            <div key={cat.key}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 4 }}>
                {cat.label} <span style={{ color: "#aaa", fontWeight: 400 }}>/ {cat.max} pts</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BarSide value={dtVal} max={cat.max} win={dtWins} align="right" />
                <div style={{ width: 60, textAlign: "center", fontSize: 11, color: "#999" }}>
                  {dtVal} &ndash; {opVal}
                </div>
                <BarSide value={opVal} max={cat.max} win={opWins} align="left" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- Total ---- */}
      <div
        style={{
          marginTop: 24,
          padding: 16,
          borderRadius: 10,
          background: "#0B0B0D",
          color: "#fff",
          display: "flex",
          justifyContent: "space-around",
          textAlign: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{dayTraders.breakdown.pakPoints}</div>
          <div style={{ fontSize: 11, color: "#bbb" }}>Day Traders</div>
        </div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{opponent.breakdown.pakPoints}</div>
          <div style={{ fontSize: 11, color: "#bbb" }}>{opponent.name}</div>
        </div>
      </div>
    </div>
  );
}

function FirmCard({ firm, highlight }: { firm: PakFirm; highlight?: boolean }) {
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <FirmLogo name={firm.name} domain={firm.domain} size={48} />
      <div style={{ fontWeight: 700, fontSize: 13, marginTop: 6 }}>{firm.name}</div>
      <div style={{ fontSize: 11, color: highlight ? "#D42B3F" : "#999" }}>
        #{firm.rank} overall
      </div>
    </div>
  );
}

function BarSide({
  value,
  max,
  win,
  align,
}: {
  value: number;
  max: number;
  win: boolean;
  align: "left" | "right";
}) {
  const pct = Math.max(4, (value / max) * 100);
  return (
    <div
      style={{
        flex: 1,
        height: 10,
        background: "#eee",
        borderRadius: 6,
        overflow: "hidden",
        display: "flex",
        justifyContent: align === "right" ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: win ? "#D42B3F" : "#ccc",
          borderRadius: 6,
        }}
      />
    </div>
  );
}
