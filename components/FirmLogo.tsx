"use client";

import { useState } from "react";

/**
 * Renders a company logo by domain, with an automatic fallback to a
 * clean initials badge if the logo can't be found (wrong/unlisted domain,
 * firm has no favicon, network hiccup, etc). Never shows a broken image icon.
 *
 * ZERO-SETUP MODE (default): uses Google's public favicon service.
 * No signup, no API key, works immediately. Resolution is capped (~128px),
 * fine for a comparison table / grid.
 *
 * UPGRADE PATH: once you want sharper logos, sign up free at logo.dev,
 * grab a publishable token, and swap LOGO_SOURCE to "logodev" below.
 * Free tier is 500k requests/month — plenty for a directory like this.
 */

const LOGO_SOURCE: "google" | "logodev" = "google";
const LOGO_DEV_TOKEN = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN ?? "";

function logoUrl(domain: string, size: number) {
  if (LOGO_SOURCE === "logodev" && LOGO_DEV_TOKEN) {
    return `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=${size}&format=png`;
  }
  // Google's favicon endpoint — no key required, decent up to ~128px
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

// Deterministic color per firm so the fallback badges still look intentional,
// not random — same firm always gets the same color.
function colorFor(name: string) {
  const palette = ["#D42B3F", "#2563EB", "#059669", "#7C3AED", "#EA580C", "#0891B2"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

export default function FirmLogo({
  name,
  domain,
  size = 40,
}: {
  name: string;
  domain: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !domain) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          background: colorFor(name),
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: size * 0.38,
          flexShrink: 0,
        }}
        title={name}
      >
        {initials(name)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- external favicon URL, intentionally not next/image
    <img
      src={logoUrl(domain, size * 2)} // fetch 2x for retina screens
      alt={`${name} logo`}
      width={size}
      height={size}
      style={{ borderRadius: 8, objectFit: "contain", flexShrink: 0, background: "#fff" }}
      onError={() => setFailed(true)}
    />
  );
}

/* USAGE EXAMPLE — inside your matrix table/grid, per row:

import FirmLogo from "./FirmLogo";
import firms from "./prop-firms-data.json";

{firms.futures.map((firm) => (
  <div key={firm.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <FirmLogo name={firm.name} domain={firm.domain} />
    <span>{firm.name}</span>
  </div>
))}

*/
