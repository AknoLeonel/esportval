import { site } from "@/data/site";
import { ContactSection } from "@/features/contact/ContactSection";
import { GallerySection } from "@/features/gallery/GallerySection";
import { Hero } from "@/features/hero/Hero";
import { MatchesSection } from "@/features/matches/MatchesSection";
import { NewsSection } from "@/features/news/NewsSection";
import { SquadSection } from "@/features/squad/SquadSection";
import { StandingsSection } from "@/features/standings/StandingsSection";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsTeam",
  name: site.name,
  sport: "Futsal",
  url: site.url,
  slogan: site.tagline,
  logo: `${site.url}/icon.svg`,
  sameAs: [site.instagram.url],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <MatchesSection />
      <StandingsSection />
      <SquadSection />
      <NewsSection />
      <GallerySection />
      <ContactSection />
    </>
  );
}
