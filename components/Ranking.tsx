"use client";

import { useState } from "react";
import FirmLogo from "@/components/FirmLogo";
import { sortedByPakPoints } from "@/lib/pakPoints";

const SIZES = [3, 5, 10, 20] as const;

export default function Ranking() {
  const [count, setCount] = useState<(typeof SIZES)[number]>(10);
  const firms = sortedByPakPoints().slice(0, count);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
        PAK Points Ranking
      </h1>
      <p style={{ color: "#666", marginBottom: 16 }}>
        Highest-scoring prop firms, out of 100 possible PAK Points.
      </p>

      {/* ---- Top N toggle ---- */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {SIZES.map((n) => (
          <button
            key={n}
            onClick={() => setCount(n)}
            style={{
              padding: "6px 16px",
              borderRadius: 20,
              border: count === n ? "none" : "1px solid #ddd",
              background: count === n ? "#0B0B0D" : "#fff",
              color: count === n ? "#fff" : "#333",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Top {n}
          </button>
        ))}
      </div>

      {/* ---- Ranked list ---- */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {firms.map((firm, i) => (
          <div
            key={firm.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
              borderRadius: 10,
              background: i === 0 ? "#0B0B0D" : i < 3 ? "#FCEEEF" : "#F8F8FA",
              color: i === 0 ? "#fff" : "#111",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: i < 3 ? 22 : 16,
                width: 32,
                color: i === 0 ? "#fff" : i < 3 ? "#D42B3F" : "#999",
              }}
            >
              #{i + 1}
            </div>
            <FirmLogo name={firm.name} domain={firm.domain} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{firm.name}</div>
              <div
                style={{
                  fontSize: 11,
                  color: i === 0 ? "#bbb" : "#888",
                  textTransform: "capitalize",
                }}
              >
                {firm.vertical} &middot; Tier {firm.tier}
              </div>
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 20,
                color: i === 0 ? "#fff" : "#D42B3F",
              }}
            >
              {firm.breakdown.pakPoints}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
