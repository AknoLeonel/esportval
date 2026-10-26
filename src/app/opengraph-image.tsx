import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const quarter = (background: string) => ({ width: 60, height: 60, background });

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
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* Anéis em caixas separadas: borda dentro da caixa de 120px faria os quadrantes quebrarem linha. */}
        <div style={{ display: "flex", padding: 5, borderRadius: 140, background: "#ff6a13" }}>
          <div style={{ display: "flex", padding: 6, borderRadius: 140, background: "#0b0e13" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                width: 120,
                height: 120,
                borderRadius: 120,
                overflow: "hidden",
              }}
            >
              <div style={quarter("#ffffff")} />
              <div style={quarter("#ff6a13")} />
              <div style={quarter("#ffd2b3")} />
              <div style={quarter("#0b0e13")} />
            </div>
          </div>
        </div>
        <div
          style={{ fontSize: 44, letterSpacing: 10, textTransform: "uppercase", fontWeight: 800 }}
        >
          {site.name}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 92,
          lineHeight: 1,
          fontWeight: 800,
          textTransform: "uppercase",
        }}
      >
        <span>Projetos esportivos</span>
        <span style={{ color: "#ff6a13" }}>com as contas abertas.</span>
      </div>
      <div style={{ fontSize: 30, color: "#a9b2bf" }}>
        Projetos · Transparência · Prestação de contas
      </div>
    </div>,
    size,
  );
}
