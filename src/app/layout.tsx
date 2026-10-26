import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { RouteProgress } from "@/components/layout/RouteProgress";
import { Observability } from "@/components/observability/Observability";
import { MotionProvider } from "@/components/ui/Providers";
import { headerCta, nav, site } from "@/data/site";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const sans = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.headline}`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#07090d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <body>
        <MotionProvider>
          <a
            href="#conteudo"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:bg-brand focus:px-5 focus:py-2 focus:font-semibold focus:text-ink-950"
          >
            Pular para o conteúdo
          </a>
          <Suspense fallback={null}>
            <RouteProgress />
          </Suspense>
          <Header nav={nav} cta={headerCta} />
          <main id="conteudo">{children}</main>
          <Footer
            nav={[...nav, headerCta]}
            instagram={site.instagram}
            motto={site.motto}
            organization={site.organization}
          />
          <Observability />
        </MotionProvider>
      </body>
    </html>
  );
}
