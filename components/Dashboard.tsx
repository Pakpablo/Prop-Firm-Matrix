import FirmLogo from "@/components/FirmLogo";
import { methodology, sortedByPakPoints } from "@/lib/pakPoints";

/**
 * DASHBOARD — overview stats + full firm list, sorted by PAK Points
 * (sortedByPakPoints() sorts defensively even though the source data
 * is already ranked, in case it gets edited later).
 */
export default function Dashboard() {
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

      {/* ---- PAK Points methodology note ---- */}
      <div
        style={{
          background: "#FCEEEF",
          borderLeft: "3px solid #D42B3F",
          padding: "14px 16px",
          borderRadius: 4,
          marginBottom: 24,
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        <b style={{ color: "#D42B3F" }}>What are PAK Points?</b> A 100-point score
        built from five weighted categories:{" "}
        {methodology.categories.map((c) => `${c.name} (${c.points} pts)`).join(" · ")}
        . Every firm is scored on the same rubric.{" "}
        <span style={{ color: "#888" }}>
          {researchedCount} of {firms.length} firms have a fully researched
          score; the rest show a provisional (tier-based) estimate until
          researched in full &mdash; look for the badge on each row.
        </span>
      </div>

      {/* ---- Firm list ---- */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {firms.map((firm, i) => (
          <div
            key={firm.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              border: "1px solid #eee",
              borderRadius: 8,
              background: i < 3 ? "#FFFBF5" : "#fff",
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
          </div>
        ))}
      </div>
    </div>
  );
}
