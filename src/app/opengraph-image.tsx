import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build time so the social card always matches the live copy in
 * `siteConfig` — no stale hand-exported PNG to keep in sync.
 *
 * Satori (the renderer behind ImageResponse) requires an explicit `display`
 * on any element with more than one child, so every wrapper below sets one.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#14120e",
          color: "#f1ece2",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: "#e2984a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1c1108",
              fontSize: "44px",
              fontWeight: 800,
            }}
          >
            L
          </div>
          <div style={{ display: "flex", fontSize: "48px", fontWeight: 800 }}>
            <span>linky</span>
            <span style={{ color: "#e2984a" }}>.</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "22px",
            marginTop: "48px",
            fontSize: "76px",
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: "900px",
          }}
        >
          <span>Short links, done</span>
          <span style={{ color: "#e2984a" }}>properly.</span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "28px",
            fontSize: "32px",
            color: "#a49a89",
            maxWidth: "860px",
            lineHeight: 1.35,
          }}
        >
          {siteConfig.description}
        </div>
      </div>
    ),
    size
  );
}
