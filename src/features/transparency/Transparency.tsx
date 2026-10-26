import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";
import { getInstitutionalDocuments, getPartnerships } from "@/data/transparency";
import { formatBRL, formatDate } from "@/lib/format";
import { organizationLabel } from "@/lib/organization";
import { summarizePartnerships } from "@/lib/transparency";
import { PartnershipsExplorer } from "./PartnershipsExplorer";

export async function Summary() {
  const summary = summarizePartnerships(await getPartnerships());
  const items = [
    { label: "Parcerias publicadas", value: String(summary.count) },
    { label: "Valor total pactuado", value: formatBRL(summary.total) },
    { label: "Valor liberado", value: formatBRL(summary.released) },
    { label: "Contas aprovadas", value: `${summary.approved} de ${summary.count}` },
  ];
  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <Reveal
          key={item.label}
          on="mount"
          index={index}
          className="flex flex-col-reverse rounded-2xl bg-ink-800 p-5 ring-1 ring-white/10"
        >
          <dt className="mt-1 text-sm text-fg-muted">{item.label}</dt>
          <dd className="font-display text-3xl font-extrabold tabular-nums">{item.value}</dd>
        </Reveal>
      ))}
    </dl>
  );
}

export async function Partnerships() {
  return (
    <PartnershipsExplorer
      partnerships={await getPartnerships()}
      organization={organizationLabel(site.organization, site.name)}
      showIllustrative={site.illustrativeContent}
    />
  );
}

export async function InstitutionalDocuments() {
  const documents = await getInstitutionalDocuments();
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {documents.map((doc, index) => (
        <Reveal
          as="li"
          key={doc.id}
          index={index}
          className="flex items-start justify-between gap-4 rounded-2xl bg-ink-800 p-5 ring-1 ring-white/10"
        >
          <div>
            <h3 className="font-display text-xl font-bold uppercase">
              {doc.href ? (
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  {doc.title}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              ) : (
                doc.title
              )}
            </h3>
            <p className="mt-1 text-sm text-fg-muted">{doc.description}</p>
          </div>
          {doc.href ? (
            <Badge tone="ok">{doc.publishedAt ? formatDate(doc.publishedAt) : "PDF"}</Badge>
          ) : (
            <Badge>Em publicação</Badge>
          )}
        </Reveal>
      ))}
    </ul>
  );
}
