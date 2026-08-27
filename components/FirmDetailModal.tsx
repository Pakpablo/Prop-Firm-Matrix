"use client";

import FirmLogo from "@/components/FirmLogo";
import { CATEGORY_KEYS, type DetailFieldKey, type PakFirm } from "@/lib/pakPoints";

const FIELD_LABELS: Record<DetailFieldKey, string> = {
  hq: "HQ / Jurisdiction",
  platforms: "Markets & Platforms",
  accountTypes: "Account Types",
  drawdown: "Drawdown Rules",
  payoutTerms: "Payout Terms",
  pricing: "Pricing Model",
  reputation: "Reputation",
};

const FIELD_ENTRIES = Object.entries(FIELD_LABELS) as [DetailFieldKey, string][];

export default function FirmDetailModal({
  firm,
  onClose,
}: {
  firm: PakFirm;
  onClose: () => void;
}) {
  const hasProfile = !firm.details?.note;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 14,
          maxWidth: 520,
          width: "100%",
          maxHeight: "88vh",
          overflowY: "auto",
          padding: 0,
        }}
      >
        {/* ---- Header ---- */}
        <div
          style={{
            background: "#0B0B0D",
            color: "#fff",
            padding: "20px 22px",
            borderRadius: "14px 14px 0 0",
            position: "relative",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 14,
              right: 16,
              background: "none",
              border: "none",
              color: "#999",
              fontSize: 20,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            &times;
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <FirmLogo name={firm.name} domain={firm.domain} size={44} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{firm.name}</div>
              <div style={{ fontSize: 12, color: "#aaa", textTransform: "capitalize" }}>
                {firm.vertical} &middot; Tier {firm.tier} &middot; #{firm.rank} overall
              </div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#ff6b78" }}>
                {firm.breakdown.pakPoints}
              </div>
              <div style={{ fontSize: 9, color: "#999" }}>PAK PTS</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "18px 22px 22px" }}>
          {/* ---- Confidence badge ---- */}
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 9px",
                borderRadius: 8,
                background: firm.confidence === "researched" ? "#dcfce7" : "#fef3c7",
                color: firm.confidence === "researched" ? "#166534" : "#92400e",
              }}
            >
              {firm.confidence === "researched" ? "FULLY RESEARCHED" : "PROVISIONAL ESTIMATE"}
            </span>
          </div>

          {/* ---- PAK Points breakdown ---- */}
          <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 8 }}>
            PAK POINTS BREAKDOWN
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 6,
              marginBottom: 20,
            }}
          >
            {CATEGORY_KEYS.map((c) => (
              <div
                key={c.key}
                style={{
                  background: "#F6F6F8",
                  borderRadius: 8,
                  padding: "8px 6px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 800, color: "#D42B3F" }}>
                  {firm.breakdown[c.key]}
                </div>
                <div style={{ fontSize: 8, color: "#999" }}>/ {c.max}</div>
                <div style={{ fontSize: 8, color: "#777", marginTop: 2, lineHeight: 1.2 }}>
                  {c.label}
                </div>
              </div>
            ))}
          </div>

          {/* ---- Full profile ---- */}
          {hasProfile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FIELD_ENTRIES.map(([key, label]) =>
                firm.details?.[key] ? (
                  <div key={key}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#D42B3F",
                        textTransform: "uppercase",
                        letterSpacing: 0.3,
                      }}
                    >
                      {label}
                    </div>
                    <div style={{ fontSize: 13, color: "#222", lineHeight: 1.5 }}>
                      {firm.details[key]}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          ) : (
            <div
              style={{
                background: "#fafafa",
                border: "1px dashed #ddd",
                borderRadius: 8,
                padding: 14,
                fontSize: 12,
                color: "#888",
              }}
            >
              {firm.details?.note ?? "No detailed profile yet."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
