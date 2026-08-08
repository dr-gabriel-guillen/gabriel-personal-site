import type { Metadata } from "next";
import Link from "next/link";
import {
  COUNTRY_LABELS,
  COUNTING_RULES,
  LEVEL_LABELS,
  TOTALS,
  academicTitlesByLevel,
  credentialPath,
  formatDate,
  originalTitle,
  title,
} from "@/lib/credentials";
import { CANONICAL_NAME, SITE } from "@/lib/seo";

/**
 * The degree record.
 *
 * Rewritten from a Guinness-record framing to a verification-first one. It was
 * previously headed "22 University Degrees" over a list that included two
 * coursework-only programmes and three unevidenced ones; every figure here is
 * now computed from data/credentials.json and every entry links to its proof.
 *
 * Server-rendered on purpose: this is the content that has to be crawlable.
 */
export const metadata: Metadata = {
  title: `University degrees — ${CANONICAL_NAME}`,
  description:
    `${TOTALS.argentineRegistryDegrees} university degrees recorded in Argentina's national graduate registry, ` +
    `plus ${TOTALS.internationalDegreeProgrammes} international postgraduate programmes. Each one links to independent verification.`,
  alternates: { canonical: `${SITE}/degrees` },
};

export default function DegreesPage() {
  const groups = academicTitlesByLevel();

  const stats = [
    {
      value: TOTALS.universityDegreeProgrammes,
      label: "distinct university degree programmes",
    },
    {
      value: TOTALS.argentineRegistryDegrees,
      label: "recorded in Argentina's national graduate registry",
    },
    {
      value: TOTALS.internationalDegreeProgrammes,
      label: "international postgraduate programmes",
    },
    { value: TOTALS.apostilled, label: "apostilled under the Hague Convention" },
    {
      value: TOTALS.tertiaryNonUniversity,
      label: "non-university tertiary titles, counted separately",
    },
  ];

  return (
    <div className="pt-20">
      <section className="border-b border-border bg-navy-mid px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
            Academic record
          </p>
          <h1 className="mt-5 font-display text-5xl font-bold text-cream lg:text-6xl">
            {TOTALS.universityDegreeProgrammes} university degree programmes
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-cream-dim">
            Earned in Argentina, the United States, Spain and Puerto Rico. Every
            entry below links to a page showing how to verify it independently —
            in most cases through Argentina&rsquo;s national graduate registry,
            which anyone can search by name.
          </p>
          <div className="mt-8 flex flex-wrap gap-8">
            {stats.map((s) => (
              <div key={s.label} className="max-w-[190px]">
                <p className="font-display text-4xl font-bold text-gold">{s.value}</p>
                <p className="mt-1 text-xs leading-5 text-cream-dim">{s.label}</p>
              </div>
            ))}
          </div>
          <Link
            href="/verification"
            className="mt-8 inline-block border border-gold/60 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold/10"
          >
            See the full verification page →
          </Link>
        </div>
      </section>

      {/* How the count works — generated from the data so it cannot drift. */}
      <section className="border-b border-border px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-5 text-base leading-8 text-cream-dim">
          <h2 className="font-display text-3xl font-bold text-cream">
            How the count works
          </h2>
          <p>
            <strong className="text-cream">
              {TOTALS.argentineRegistryDegrees}
            </strong>{" "}
            of these appear in Argentina&rsquo;s Registro Público de Graduados
            Universitarios. The remaining{" "}
            <strong className="text-cream">
              {TOTALS.internationalDegreeProgrammes}
            </strong>{" "}
            are international: Harvard, Lehigh, and one dual-issued
            Spain / Puerto Rico master&rsquo;s.
          </p>
          <p>{COUNTING_RULES.dual_issue_note_en}</p>
          <p>{COUNTING_RULES.tertiary_note_en}</p>
          <p>{COUNTING_RULES.coursework_note_en}</p>
        </div>
      </section>

      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {groups.map(({ level, items }) => (
            <div key={level} className="mb-12">
              <h2 className="mb-5 font-display text-3xl font-bold text-cream">
                {LEVEL_LABELS[level]?.en ?? level}
                <span className="ml-3 font-sans text-base font-normal text-cream-dim">
                  ({items.length})
                </span>
              </h2>
              <ul className="space-y-3">
                {items.map((c) => {
                  const country = c.country ? COUNTRY_LABELS[c.country] : null;
                  const original = originalTitle(c, "en");
                  return (
                    <li
                      key={c.id}
                      className="rounded-lg border border-border bg-navy-card p-5 transition hover:border-gold/30"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <Link
                            href={credentialPath(c, "en")}
                            className="text-base font-bold leading-snug text-cream hover:text-gold"
                          >
                            {title(c, "en")}
                          </Link>
                          {original && (
                            <p className="mt-0.5 text-sm italic text-cream-dim">
                              {original}
                            </p>
                          )}
                          <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-cream-dim">
                            {country && (
                              <span>
                                <span aria-hidden="true">{country.flag}</span>{" "}
                                {c.institution}
                              </span>
                            )}
                            <span className="font-bold text-gold">
                              {formatDate(c.conferred, "en")}
                            </span>
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <Link
                            href={credentialPath(c, "en")}
                            className="inline-block border border-gold/50 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold/10"
                          >
                            How to verify →
                          </Link>
                          {c.apostille && (
                            <p className="mt-2 text-xs text-cream-dim">Apostilled</p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-navy-mid px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Degree equivalency
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold text-cream">
            Argentine and Spanish degrees in the U.S. academic context
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-cream-dim">
            These are general guides to how each level maps, not formal
            credential evaluations. A U.S. institution requiring an equivalency
            determination should commission one from a NACES-member evaluator.
          </p>
          <div className="mt-6 grid gap-4 text-sm leading-8 text-cream-dim sm:grid-cols-2 lg:grid-cols-3">
            {[
              [
                "Terciario / Pregrado",
                "Non-university tertiary, or an intermediate university title awarded inside a longer degree. Broadly comparable to a U.S. associate degree or professional certificate.",
              ],
              [
                "Grado / Licenciatura",
                "The first full university degree, typically 4–6 years, thesis often required. Broadly comparable to a U.S. bachelor's, and in some fields to a master's.",
              ],
              [
                "Especialización",
                "Postgraduate specialisation taken after a grado degree, 1–2 years. Broadly comparable to a U.S. graduate certificate.",
              ],
              [
                "Maestría / Máster",
                "Two years of coursework plus a research project. Broadly comparable to a U.S. master's degree.",
              ],
              [
                "Doctorado",
                "Original research thesis defended before a jury, 4–5 years. Broadly comparable to a U.S. PhD.",
              ],
              [
                "Apostille",
                "A Hague Convention apostille authenticates the signature and seal on a diploma for use abroad. It certifies the document, not the academic level.",
              ],
            ].map(([term, desc]) => (
              <div key={term} className="rounded border border-border bg-navy-card p-4">
                <p className="font-bold text-cream">{term}</p>
                <p className="mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
