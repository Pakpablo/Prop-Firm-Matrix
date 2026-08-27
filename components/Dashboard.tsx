"use client";

import { useState } from "react";
import FirmLogo from "@/components/FirmLogo";
import FirmDetailModal from "@/components/FirmDetailModal";
import { sortedByPakPoints, type PakFirm } from "@/lib/pakPoints";

const CATEGORIES = [
  { key: "trust", label: "Trust & Rep.", points: 30, color: "#D42B3F" },
  { key: "payout", label: "Payout Reliability", points: 25, color: "#EA580C" },
  { key: "economics", label: "Trader Economics", points: 20, color: "#059669" },
  { key: "rules", label: "Rules Flexibility", points: 15, color: "#2563EB" },
  { key: "longevity", label: "Longevity & Scale", points: 10, color: "#7C3AED" },
] as const;

export default function Dashboard() {
  const [selected, setSelected] = useState<PakFirm | null>(null);
  const firms = sortedByPakPoints();
  const researchedCount = firms.filter((f) => f.confidence === "researched").length;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
        Prop Firm Dashboard
      </h1>
      <p style={{ color: "#666", marginBottom: 20 }}>
        {firms.length} firms tracked &middot; ranked by PAK Points
      </p>

      {/* ==================================================== */}
      {/* PAK POINTS METHODOLOGY NOTE — redesigned              */}
      {/* ==================================================== */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 18,
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: "#0B0B0D",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            i
          </div>
          <div style={{ fontWeight: 800, fontSize: 14 }}>What are PAK Points?</div>
        </div>

        <p style={{ fontSize: 12.5, color: "#555", lineHeight: 1.6, marginBottom: 14 }}>
          A 100-point score built from five weighted categories, applied to every
          firm on the exact same rubric &mdash; no firm is scored differently.
        </p>

        {/* ---- 5 category squares ---- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 8,
            marginBottom: 14,
          }}
        >
          {CATEGORIES.map((c) => (
            <div
              key={c.key}
              style={{
                aspectRatio: "1",
                borderRadius: 10,
                background: `${c.color}12`,
                border: `1px solid ${c.color}33`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 6,
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: c.color, lineHeight: 1 }}>
                {c.points}
              </div>
              <div style={{ fontSize: 8, color: "#999", marginTop: 2 }}>pts</div>
              <div
                style={{
                  fontSize: 9,
                  color: "#444",
                  textAlign: "center",
                  marginTop: 4,
                  lineHeight: 1.2,
                  fontWeight: 600,
                }}
              >
                {c.label}
              </div>
            </div>
          ))}
        </div>

        {/* ---- coverage badge row ---- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#F6F6F8",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 11.5,
            color: "#666",
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              padding: "2px 7px",
              borderRadius: 6,
              background: "#dcfce7",
              color: "#166534",
              whiteSpace: "nowrap",
            }}
          >
            {researchedCount} RESEARCHED
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              padding: "2px 7px",
              borderRadius: 6,
              background: "#fef3c7",
              color: "#92400e",
              whiteSpace: "nowrap",
            }}
          >
            {firms.length - researchedCount} PROVISIONAL
          </span>
          <span>
            of {firms.length} firms have a fully researched score; the rest show a
            tier-based estimate until researched in full.
          </span>
        </div>
      </div>

      {/* ==================================================== */}
      {/* FIRM LIST — click any row for full details             */}
      {/* ==================================================== */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {firms.map((firm, i) => (
          <button
            key={firm.name}
            onClick={() => setSelected(firm)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              border: "1px solid #eee",
              borderRadius: 8,
              background: i < 3 ? "#FFFBF5" : "#fff",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
              font: "inherit",
              transition: "box-shadow 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.08)";
              e.currentTarget.style.borderColor = "#D42B3F55";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#eee";
            }}
          >
            <div style={{ width: 24, fontWeight: 700, color: "#999", fontSize: 13 }}>
              {i + 1}
            </div>
            <FirmLogo name={firm.name} domain={firm.domain} size={32} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{firm.name}</div>
              <div style={{ fontSize: 11, color: "#999", textTransform: "capitalize" }}>
                {firm.vertical} &middot; Tier {firm.tier}
                {firm.confidence === "provisional" && (
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#b7791f",
                      background: "#fef3c7",
                      padding: "1px 6px",
                      borderRadius: 6,
                    }}
                  >
                    PROVISIONAL
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#D42B3F" }}>
                {firm.breakdown.pakPoints}
              </div>
              <div style={{ fontSize: 9, color: "#999" }}>PAK PTS</div>
            </div>
            <div
              style={{
                marginLeft: 4,
                padding: "5px 10px",
                borderRadius: 6,
                background: "#0B0B0D",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              Details &rarr;
            </div>
          </button>
        ))}
      </div>

      {selected && <FirmDetailModal firm={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
