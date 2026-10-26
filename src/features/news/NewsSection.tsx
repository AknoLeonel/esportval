import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Skeleton, SkeletonRegion, SkeletonText } from "@/components/ui/Skeleton";
import { getNews } from "@/data/news";
import { site } from "@/data/site";
import { formatLongDate } from "@/lib/matches";

function NewsSkeleton() {
  return (
    <SkeletonRegion label="Carregando notícias">
      <div className="grid gap-4 md:grid-cols-3">
        {["a", "b", "c"].map((key) => (
          <div key={key} className="space-y-4 rounded-[var(--radius-card)] bg-ink-800 p-6">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-8 w-full" />
            <SkeletonText lines={3} />
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}

export async function NewsList() {
  const items = await getNews();
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {items.map((item, index) => (
        <Reveal as="li" key={item.id} index={index}>
          <article className="flex h-full flex-col rounded-[var(--radius-card)] bg-ink-800 p-6 ring-1 ring-white/10 transition-[background-color,box-shadow] duration-200 hover:bg-ink-700 hover:ring-brand/40">
            <p className="flex items-center justify-between text-sm">
              <span className="rounded-full bg-brand/15 px-3 py-0.5 font-display font-bold tracking-widest text-brand uppercase">
                {item.category}
              </span>
              <time dateTime={item.date} className="text-fg-subtle">
                {formatLongDate(item.date)}
              </time>
            </p>
            <h3 className="mt-5 font-display text-3xl leading-[1.05] font-extrabold uppercase">
              {item.title}
            </h3>
            <p className="mt-3 text-fg-muted">{item.excerpt}</p>
          </article>
        </Reveal>
      ))}
    </ul>
  );
}

export function NewsSection() {
  return (
    <Section
      id="noticias"
      eyebrow="Bastidores"
      title="Notícias"
      description="O que está acontecendo dentro e fora da quadra."
      illustrative={site.illustrativeContent}
      className="bg-ink-900"
    >
      <Suspense fallback={<NewsSkeleton />}>
        <NewsList />
      </Suspense>
      <Reveal className="mt-10">
        <ButtonLink href={site.instagram.url} external variant="secondary">
          Mais novidades no Instagram
        </ButtonLink>
      </Reveal>
    </Section>
  );
}
