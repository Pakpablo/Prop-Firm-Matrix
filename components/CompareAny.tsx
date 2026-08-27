"use client";

import { useState } from "react";
import FirmLogo from "@/components/FirmLogo";
import { CATEGORY_KEYS, firms, type PakFirm } from "@/lib/pakPoints";

export default function CompareAny() {
  const sorted = [...firms].sort((a, b) => a.name.localeCompare(b.name));
  const [nameA, setNameA] = useState(sorted[0].name);
  const [nameB, setNameB] = useState(sorted[1].name);
  const firmA = firms.find((f) => f.name === nameA)!;
  const firmB = firms.find((f) => f.name === nameB)!;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
        Compare Any Two Firms
      </h1>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Pick any two firms from the list to compare PAK Points side by side.
      </p>

      {/* ---- Pickers ---- */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <select value={nameA} onChange={(e) => setNameA(e.target.value)} style={selectStyle}>
          {sorted.map((f) => (
            <option key={f.name} value={f.name}>
              {f.name}
            </option>
          ))}
        </select>
        <select value={nameB} onChange={(e) => setNameB(e.target.value)} style={selectStyle}>
          {sorted.map((f) => (
            <option key={f.name} value={f.name}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {nameA === nameB && (
        <div style={{ color: "#D42B3F", fontSize: 12, marginBottom: 16 }}>
          Pick two different firms to see a real comparison.
        </div>
      )}

      {/* ---- Header cards ---- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <FirmCard firm={firmA} />
        <div style={{ fontWeight: 800, color: "#ccc", fontSize: 20 }}>VS</div>
        <FirmCard firm={firmB} />
      </div>

      {/* ---- Category bars ---- */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {CATEGORY_KEYS.map((cat) => {
          const aVal = firmA.breakdown[cat.key];
          const bVal = firmB.breakdown[cat.key];
          return (
            <div key={cat.key}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 4 }}>
                {cat.label} <span style={{ color: "#aaa", fontWeight: 400 }}>/ {cat.max} pts</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Bar value={aVal} max={cat.max} win={aVal > bVal} align="right" />
                <div style={{ width: 60, textAlign: "center", fontSize: 11, color: "#999" }}>
                  {aVal} &ndash; {bVal}
                </div>
                <Bar value={bVal} max={cat.max} win={bVal > aVal} align="left" />
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
          <div style={{ fontSize: 24, fontWeight: 800 }}>{firmA.breakdown.pakPoints}</div>
          <div style={{ fontSize: 11, color: "#bbb" }}>{firmA.name}</div>
        </div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{firmB.breakdown.pakPoints}</div>
          <div style={{ fontSize: 11, color: "#bbb" }}>{firmB.name}</div>
        </div>
      </div>
    </div>
  );
}

const selectStyle = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 13,
};

function FirmCard({ firm }: { firm: PakFirm }) {
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <FirmLogo name={firm.name} domain={firm.domain} size={48} />
      <div style={{ fontWeight: 700, fontSize: 13, marginTop: 6 }}>{firm.name}</div>
      <div style={{ fontSize: 11, color: "#999" }}>#{firm.rank} overall</div>
    </div>
  );
}

function Bar({
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
          background: win ? "#2563EB" : "#ccc",
          borderRadius: 6,
        }}
      />
    </div>
  );
}
