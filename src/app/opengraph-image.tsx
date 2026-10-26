import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #0b0e13 0%, #07090d 60%, #3a1403 100%)",
        color: "#f4f1ea",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 28, height: 28, borderRadius: 28, background: "#ff6a13" }} />
        <div
          style={{
            fontSize: 34,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#ff6a13",
            fontWeight: 700,
          }}
        >
          Esportval Futsal
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 108,
          lineHeight: 1,
          fontWeight: 800,
          textTransform: "uppercase",
        }}
      >
        <span>Oportunidades não surgem.</span>
        <span style={{ color: "#ff6a13" }}>É você que as cria.</span>
      </div>
      <div style={{ fontSize: 30, color: "#a9b2bf" }}>Projeto Futsal · Fut’Art</div>
    </div>,
    size,
  );
}
