import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Cores do manual Esportval 2027 (iguais aos tokens de `globals.css`; o OG não lê CSS). */
const brand = { red: "#d8001a", orange: "#f8911b", yellow: "#f6ed30", ink: "#000000" };

export default async function OpengraphImage() {
  const escudo = await readFile(join(process.cwd(), "public/marca/escudo.svg"));
  const escudoSrc = `data:image/svg+xml;base64,${escudo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: brand.ink,
        color: "#f7f7f5",
      }}
    >
      {/* Faixas diagonais das peças do manual, no canto inferior direito */}
      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <path d="M1200 250C1000 330 860 470 800 630H1200Z" fill={brand.yellow} />
        <path d="M1200 350C1050 410 950 520 910 630H1200Z" fill={brand.orange} />
        <path d="M1200 450C1110 490 1050 560 1025 630H1200Z" fill={brand.red} />
      </svg>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          width: 900,
        }}
      >
        <img src={escudoSrc} width={177} height={150} alt="" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 64,
            lineHeight: 1,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          <span>Projetos esportivos</span>
          <span style={{ color: brand.orange }}>com as contas abertas.</span>
        </div>
        <div style={{ fontSize: 30, color: "#b5b5b0" }}>
          Projetos · Transparência · Prestação de contas
        </div>
      </div>
    </div>,
    size,
  );
}
