import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatBRL, formatDate } from "@/lib/format";
import {
  ACCOUNTABILITY,
  disclosureUntil,
  memberTotal,
  releasedPercent,
  teamTotal,
} from "@/lib/transparency";
import type { Partnership } from "@/lib/types";

const NOT_INFORMED = "—";
const date = (iso?: string) => (iso ? formatDate(iso) : NOT_INFORMED);

/** Todos os campos mínimos do art. 11 da Lei 13.019/2014 para uma parceria. */
export function PartnershipDetails({
  partnership,
  organization,
}: {
  partnership: Partnership;
  organization: string;
}) {
  const status = ACCOUNTABILITY[partnership.accountability.status];
  const until = disclosureUntil(partnership);
  const released = releasedPercent(partnership);

  return (
    <div className="grid gap-8 border-t border-white/10 px-5 pt-6 pb-6 sm:px-6 lg:grid-cols-2 [&>*]:min-w-0">
      <section aria-label="Dados da parceria">
        <dl className="grid gap-4 sm:grid-cols-2 [&>*]:min-w-0">
          <Field label="Instrumento (I)">{partnership.instrument}</Field>
          <Field label="Órgão responsável (I)">{partnership.agency}</Field>
          <Field label="Data de assinatura (I)">{formatDate(partnership.signedAt)}</Field>
          <Field label="Vigência até">{date(partnership.validUntil)}</Field>
          <Field label="Organização e CNPJ (II)" wide>
            {organization}
          </Field>
          <Field label="Objeto (III)" wide>
            {partnership.object}
          </Field>
          <Field label="Valor total (IV)">{formatBRL(partnership.totalValue)}</Field>
          <Field label="Valor liberado (IV)">
            {formatBRL(partnership.releasedValue)}
            <ProgressBar
              value={released}
              label="Percentual liberado"
              valueText={`${released}% do valor total liberado`}
              className="mt-2"
            />
          </Field>
        </dl>
      </section>

      <section aria-label="Prestação de contas" className="grid content-start gap-6 [&>*]:min-w-0">
        <div>
          <h4 className="mb-3 font-display text-sm font-bold tracking-[0.28em] text-brand uppercase">
            Prestação de contas (V)
          </h4>
          <p className="mb-4 flex flex-wrap items-center gap-3">
            <Badge tone={status.tone}>{status.label}</Badge>
            <span className="text-sm text-fg-muted">{status.description}</span>
          </p>
          <dl className="grid gap-4 sm:grid-cols-2 [&>*]:min-w-0">
            <Field label="Data prevista para apresentação">
              {date(partnership.accountability.dueAt)}
            </Field>
            <Field label="Data de apresentação">
              {date(partnership.accountability.submittedAt)}
            </Field>
            <Field label="Prazo de análise">
              {date(partnership.accountability.analysisDeadline)}
            </Field>
            <Field label="Resultado conclusivo">
              {partnership.accountability.result ?? NOT_INFORMED}
            </Field>
          </dl>
          <p className="mt-3 text-sm text-fg-subtle">
            {until
              ? `Divulgação obrigatória até ${formatDate(until)} (180 dias após a prestação de contas final).`
              : "Divulgação obrigatória até 180 dias após a apresentação da prestação de contas final."}
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-display text-sm font-bold tracking-[0.28em] text-brand uppercase">
            Equipe paga com a parceria (VI)
          </h4>
          {partnership.team.length === 0 ? (
            <p className="text-fg-muted">
              Nenhuma remuneração de equipe com recursos desta parceria.
            </p>
          ) : (
            <section
              aria-label="Tabela de remuneração da equipe"
              // focável: no celular a tabela rola na horizontal e precisa ser acessível pelo teclado
              tabIndex={0}
              className="overflow-x-auto rounded-xl ring-1 ring-white/10"
            >
              <table className="w-full min-w-[30rem] text-left text-sm">
                <caption className="sr-only">Funções e remuneração da equipe</caption>
                <thead className="text-fg-subtle">
                  <tr className="border-b border-white/10">
                    <th scope="col" className="px-3 py-2 font-semibold">
                      Função
                    </th>
                    <th scope="col" className="px-3 py-2 text-right font-semibold">
                      Pessoas
                    </th>
                    <th scope="col" className="px-3 py-2 text-right font-semibold">
                      Mensal
                    </th>
                    <th scope="col" className="px-3 py-2 text-right font-semibold">
                      Meses
                    </th>
                    <th scope="col" className="px-3 py-2 text-right font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {partnership.team.map((member, index) => (
                    // a mesma função pode aparecer mais de uma vez (ex.: em períodos diferentes)
                    <tr key={`${index}-${member.role}`} className="border-b border-white/5">
                      <th scope="row" className="px-3 py-2 font-normal">
                        {member.role}
                      </th>
                      <td className="px-3 py-2 text-right tabular-nums">{member.people ?? 1}</td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {formatBRL(member.monthlyPay)}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">{member.months}</td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {formatBRL(memberTotal(member))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row" colSpan={4} className="px-3 py-2 text-right font-semibold">
                      Total da remuneração
                    </th>
                    <td className="px-3 py-2 text-right font-semibold tabular-nums">
                      {formatBRL(teamTotal(partnership.team))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </section>
          )}
        </div>

        <div>
          <h4 className="mb-3 font-display text-sm font-bold tracking-[0.28em] text-brand uppercase">
            Documentos
          </h4>
          <ul className="grid gap-2">
            {partnership.documents.map((doc, index) => (
              <li
                // títulos se repetem (vários "Termo aditivo"): a posição desambigua
                key={`${index}-${doc.href ?? doc.title}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-ink-950/60 px-4 py-3"
              >
                {doc.href ? (
                  <a
                    href={doc.href}
                    className="font-semibold text-fg underline-offset-4 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {doc.title}
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                ) : (
                  <span className="text-fg-muted">{doc.title}</span>
                )}
                {doc.href ? (
                  <Badge tone="ok">{doc.publishedAt ? formatDate(doc.publishedAt) : "PDF"}</Badge>
                ) : (
                  <Badge>Em publicação</Badge>
                )}
              </li>
            ))}
          </ul>
          {partnership.projectSlug && (
            <Link
              href={`/projetos/${partnership.projectSlug}`}
              className="mt-4 inline-block text-brand-300 underline-offset-4 hover:underline"
            >
              Ver o projeto executado →
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-sm text-fg-subtle">{label}</dt>
      <dd className="text-fg break-words">{children}</dd>
    </div>
  );
}
