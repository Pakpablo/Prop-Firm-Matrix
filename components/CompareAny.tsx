"use client";

import { useState } from "react";
import CompareTable from "@/components/CompareTable";
import { firms } from "@/lib/pakPoints";

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
        Every PAK Points category and every tracked detail, side by side.
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <select value={nameA} onChange={(e) => setNameA(e.target.value)} style={selectStyle}>
          {sorted.map((f) => (
            <option key={f.name} value={f.name}>{f.name}</option>
          ))}
        </select>
        <select value={nameB} onChange={(e) => setNameB(e.target.value)} style={selectStyle}>
          {sorted.map((f) => (
            <option key={f.name} value={f.name}>{f.name}</option>
          ))}
        </select>
      </div>

      {nameA === nameB ? (
        <div style={{ color: "#D42B3F", fontSize: 12.5, padding: "16px 0" }}>
          Pick two different firms to see a real comparison.
        </div>
      ) : (
        <CompareTable firmA={firmA} firmB={firmB} />
      )}
    </div>
  );
}

const selectStyle = { flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13 };
