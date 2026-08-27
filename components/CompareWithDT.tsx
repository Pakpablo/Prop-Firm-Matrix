"use client";

import { useState } from "react";
import CompareTable from "@/components/CompareTable";
import { firms } from "@/lib/pakPoints";

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
        Every PAK Points category and every tracked detail, side by side.
      </p>

      <select
        value={opponentName}
        onChange={(e) => setOpponentName(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, marginBottom: 20 }}
      >
        {others.map((f) => (
          <option key={f.name} value={f.name}>
            {f.name} ({f.breakdown.pakPoints} pts)
          </option>
        ))}
      </select>

      <CompareTable firmA={dayTraders} firmB={opponent} lockA />
    </div>
  );
}
