import { site } from "@/data/site";
import { ContactSection } from "@/features/contact/ContactSection";
import { About } from "@/features/home/About";
import { FeaturedProjects } from "@/features/home/FeaturedProjects";
import { Hero } from "@/features/home/Hero";
import { TransparencyCallout } from "@/features/home/TransparencyCallout";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: site.name,
  ...(site.organization.legalName ? { legalName: site.organization.legalName } : {}),
  ...(site.organization.cnpj ? { taxID: site.organization.cnpj } : {}),
  description: site.description,
  url: site.url,
  slogan: site.motto,
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
      <FeaturedProjects />
      <TransparencyCallout />
      <About />
      <ContactSection />
    </>
  );
}
