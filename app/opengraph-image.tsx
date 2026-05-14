import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "MICTO UI Kit — Build Digital Giants in the Art Capital";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#09090b", // zinc-950
          color: "#ffffff",
          padding: 80,
          fontFamily: "sans-serif",
          boxSizing: "border-box",
          border: "4px solid #18181b",
        }}
      >
        {/* Background accent glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 600,
            height: 600,
            borderRadius: "50%",
            backgroundColor: "rgba(24, 24, 27, 0.6)",
            filter: "blur(100px)",
            zIndex: -1,
          }}
        />

        {/* Top Header / Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              backgroundColor: "#ffffff",
              color: "#000000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              fontWeight: 900,
              fontSize: 24,
            }}
          >
            M
          </div>
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.05em",
            }}
          >
            MICTO UI KIT
          </span>
          <span
            style={{
              fontSize: 20,
              color: "#a1a1aa", // zinc-400
              borderLeft: "2px solid #27272a", // zinc-800
              paddingLeft: 16,
              marginLeft: 4,
            }}
          >
            Municipal ICT Office of Angono
          </span>
        </div>

        {/* Main Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            maxWidth: 950,
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 1.1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Build Digital Giants in the</span>
            <span style={{ color: "#38bdf8" }}>Art Capital.</span>
          </div>
          <p
            style={{
              fontSize: 26,
              color: "#a1a1aa",
              lineHeight: 1.5,
              fontWeight: 500,
            }}
          >
            A reliable, technology-driven React component library and design system specifically engineered for scalable, accessible municipal applications.
          </p>
        </div>

        {/* Footer / URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #27272a",
            paddingTop: 32,
          }}
        >
          <div style={{ display: "flex", gap: 32, color: "#d4d4d8", fontSize: 20, fontWeight: 600 }}>
            <span>⚡ TanStack Table v8</span>
            <span>🚀 Laravel Inertia.js</span>
            <span>🛡️ RBAC Guard</span>
          </div>
          <span
            style={{
              fontSize: 20,
              color: "#71717a",
              fontFamily: "monospace",
              fontWeight: 700,
            }}
          >
            micto-ui-kit.misangono.net
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
