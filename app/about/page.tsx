import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TOTALS, byId, credentialPath, formatDate, title } from "@/lib/credentials";
import { CANONICAL_NAME, SITE } from "@/lib/seo";

/**
 * About page.
 *
 * Corrections applied here:
 *  - Harvard degree named correctly (ALM in Extension Studies, field Data
 *    Science) with the true 2019–2022 span.
 *  - "Juris Doctor (J.D.)" replaced with Abogado, the degree actually held.
 *  - Escribano described as a degree, not a licence to practise.
 *  - PayPal and Meta described as the senior software-engineering roles they
 *    were. The previous copy called him his team's "Legal & Privacy liaison",
 *    which reads as legal work performed before his 2025 bar admission.
 *  - Degree and certification counts computed, not asserted.
 */
export const metadata: Metadata = {
  title: `About — ${CANONICAL_NAME}`,
  description:
    `California attorney (Bar #361094), computer engineer and data scientist. ` +
    `${TOTALS.universityDegreeProgrammes} university degree programmes across four jurisdictions, each independently verifiable.`,
  alternates: { canonical: `${SITE}/about` },
};

/** Headline credentials, each resolved from the record so nothing drifts. */
const HIGHLIGHT_IDS = [
  "calbar",
  "ndcal",
  "cpacf",
  "abogado-uncaus",
  "phd-unlam",
  "alm-harvard",
  "msfe-lehigh",
  "eng-unlam",
  "cpn-unq",
  "traductor-publico-ucu",
  "escribano-ues21",
  "actuario-ues21",
];

export default function AboutPage() {
  const highlights = HIGHLIGHT_IDS.map(byId).filter((c) => c !== undefined);

  return (
    <div className="pt-20">
      <section className="border-b border-border bg-navy-mid px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.42fr_0.58fr]">
            <div className="flex items-start">
              <div className="w-full max-w-sm overflow-hidden rounded-lg border border-border">
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/main_portrait.jpg"
                    alt={CANONICAL_NAME}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
                About
              </p>
              <h1 className="mt-5 font-display text-5xl font-bold leading-tight text-cream lg:text-6xl">
                Gabriel Guillen-Gonzalez
              </h1>
              <p className="mt-3 text-base text-cream-dim">
                Also published as Gabriel B. Guillen and Gabriel Guillén.
              </p>
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-gold">
                San Jose, California · California Bar #361094
              </p>
              <div className="mt-6 space-y-5 text-base leading-9 text-cream-dim">
                <p>
                  Gabriel Guillen-Gonzalez is an attorney, computer engineer and
                  data scientist based in San Jose, California, and the founder
                  of Guillen-Gonzalez Law PC. He holds{" "}
                  {TOTALS.universityDegreeProgrammes} university degree
                  programmes across engineering, law, accounting, mathematics,
                  economics and education, earned in Argentina, the United
                  States, Spain and Puerto Rico. Of those,{" "}
                  {TOTALS.argentineRegistryDegrees} are recorded in
                  Argentina&rsquo;s national registry of university graduates and
                  can be looked up by anyone.
                </p>
                <p>
                  Before founding the firm he worked as a senior software
                  engineer and project leader at PayPal, on cross-border wallet
                  interoperability, and previously built machine-learning data
                  pipelines at Meta in Sunnyvale. Both were engineering roles.
                  Combined with six IAPP privacy and AI-governance
                  certifications, that background gives him an unusually concrete
                  understanding of how data actually moves through modern
                  systems — which is what he now applies to privacy and
                  technology law.
                </p>
                <p>
                  A Fulbright scholar, he completed his MS in Financial
                  Engineering at Lehigh University in{" "}
                  {formatDate("2020-05-18", "en")}, and Harvard University
                  awarded him the Master of Liberal Arts in Extension Studies,
                  field Data Science, on {formatDate("2022-03-08", "en")};
                  coursework began in the spring 2019 term. His doctoral
                  dissertation at UNLaM applied bio-inspired metaheuristic
                  algorithms to predicting high-volatility stock markets.
                </p>
                <p>
                  He was admitted to the State Bar of California in 2025
                  (licence #361094), to the U.S. District Court for the Northern
                  District of California in December 2025, and to the Buenos
                  Aires bar in 2022.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
              Selected credentials
            </p>
            <Link
              href="/verification"
              className="text-sm font-bold text-gold underline underline-offset-4"
            >
              Verify all {TOTALS.total} independently →
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((c) => (
              <Link
                key={c.id}
                href={credentialPath(c, "en")}
                className="rounded-lg border border-border bg-navy-card p-4 transition hover:border-gold/50"
              >
                <p className="font-bold text-cream">{title(c, "en")}</p>
                <p className="mt-1 text-sm text-cream-dim">
                  {c.institution}
                  {c.conferred ? ` · ${formatDate(c.conferred, "en")}` : ""}
                </p>
              </Link>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-cream-dim">
            The escribano (civil-law notary) title above is an academic degree.
            There is no active escribano registration in Argentina and no
            Argentine notarial practice is offered.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-navy-mid px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
              Languages
            </p>
            <div className="mt-5 flex gap-4">
              {[
                { lang: "Spanish", level: "Native" },
                { lang: "English", level: "Professional (C2)" },
              ].map((l) => (
                <div
                  key={l.lang}
                  className="rounded-lg border border-border bg-navy-card px-6 py-4 text-center"
                >
                  <p className="font-display text-2xl font-bold text-cream">{l.lang}</p>
                  <p className="mt-1 text-sm text-gold">{l.level}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 max-w-md text-sm leading-7 text-cream-dim">
              Sworn public translator for English, registered with the Buenos
              Aires Province translators&rsquo; association.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
              Connect
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href="mailto:gguillen@alumni.harvard.edu"
                  className="flex items-center gap-3 text-cream-dim transition hover:text-gold"
                >
                  <span className="text-xl" aria-hidden="true">✉️</span>{" "}
                  gguillen@alumni.harvard.edu
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/gabriel-guillen/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-cream-dim transition hover:text-gold"
                >
                  <span className="text-xl" aria-hidden="true">💼</span>{" "}
                  linkedin.com/in/gabriel-guillen
                </a>
              </li>
              <li>
                <a
                  href="https://guillengonzalezlaw.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-cream-dim transition hover:text-gold"
                >
                  <span className="text-xl" aria-hidden="true">⚖️</span>{" "}
                  Guillen-Gonzalez Law PC
                </a>
              </li>
              <li>
                <a
                  href="https://apps.calbar.ca.gov/attorney/Licensee/Detail/361094"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-cream-dim transition hover:text-gold"
                >
                  <span className="text-xl" aria-hidden="true">🔎</span> Verify
                  California Bar licence #361094
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-5 py-14 text-center lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-bold text-cream">
            Explore the full record
          </h2>
          <p className="mt-4 text-base leading-8 text-cream-dim">
            Every credential itemised with the registry or issuing authority that
            holds it, and an honest note wherever no public registry exists.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/verification"
              className="bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-navy transition hover:bg-gold-light"
            >
              Verification page
            </Link>
            <Link
              href="/degrees"
              className="border border-gold/50 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-gold transition hover:border-gold hover:bg-gold/10"
            >
              All {TOTALS.universityDegreeProgrammes} degree programmes
            </Link>
          </div>
          <p className="mt-8 text-sm text-cream-dim">
            <Link href="/about/personal-projects" className="underline underline-offset-4 hover:text-gold">
              Personal projects
            </Link>
            {" · "}
            <Link href="/disambiguation" className="underline underline-offset-4 hover:text-gold">
              Not the Gabriel Guillén you were looking for?
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
