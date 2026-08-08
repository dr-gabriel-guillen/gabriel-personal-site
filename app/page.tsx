import type { Metadata } from "next";
import Link from "next/link";
import { CredentialsJsonLd } from "@/components/credentials-jsonld";
import { TOTALS, byId, formatDate } from "@/lib/credentials";
import { CANONICAL_NAME, SITE } from "@/lib/seo";

/**
 * Home page.
 *
 * Rebuilt around verifiable claims. Every figure below is computed from
 * data/credentials.json. The previous version led with "22 University Degrees ·
 * 17 Professional Certifications · Guinness Record Candidate", none of which
 * reconciled with the itemised evidence; the Guinness material now lives at
 * /about/personal-projects.
 *
 * Server-rendered so the claims and their links are crawlable.
 */
export const metadata: Metadata = {
  title: `${CANONICAL_NAME} — attorney, engineer, data scientist`,
  description:
    `California attorney (Bar #361094) and software engineer. ` +
    `${TOTALS.argentineRegistryDegrees} university degrees recorded in Argentina's national graduate registry, ` +
    `${TOTALS.internationalDegreeProgrammes} international postgraduate programmes, ` +
    `${TOTALS.professionalCertifications} professional certifications — every one independently verifiable.`,
  alternates: { canonical: SITE },
  openGraph: {
    title: CANONICAL_NAME,
    description: `California attorney, Bar #361094. Every credential independently verifiable.`,
    url: SITE,
  },
};

/**
 * Domain summaries. Each bullet is a fact traceable to a credential record or
 * to employment history — no unevidenced certification counts, and no legal or
 * privacy framing of what were software-engineering roles.
 */
const domains = [
  {
    icon: "⚖️",
    title: "Law and legal practice",
    items: [
      { text: "California attorney, Bar #361094", href: "/verification/calbar" },
      {
        text: "U.S. District Court, Northern District of California",
        href: "/verification/ndcal",
      },
      { text: "Buenos Aires bar, matrícula T° 143 F° 615", href: "/verification/cpacf" },
      { text: "Abogado, Universidad Nacional del Chaco Austral", href: "/verification/abogado-uncaus" },
      { text: "Sworn public translator, English", href: "/verification/ctpipba" },
    ],
  },
  {
    icon: "💻",
    title: "Engineering and technology",
    items: [
      { text: "Computer engineer, UNLaM", href: "/verification/eng-unlam" },
      { text: "Senior software engineer at PayPal", href: "/experience" },
      { text: "Large-scale data infrastructure at Meta", href: "/experience" },
      {
        text: "AWS Certified Generative AI Developer – Professional",
        href: "/verification/aws-genai-pro",
      },
    ],
  },
  {
    icon: "📊",
    title: "Data science and finance",
    items: [
      {
        text: "Harvard ALM, field: Data Science",
        href: "/verification/alm-harvard",
      },
      { text: "MS Financial Engineering, Lehigh (Fulbright)", href: "/verification/msfe-lehigh" },
      { text: "PhD in Economic Sciences", href: "/verification/phd-unlam" },
      { text: "Doctoral thesis on metaheuristics in volatile markets", href: "/research" },
    ],
  },
  {
    icon: "🔐",
    title: "Privacy and AI governance",
    items: [
      { text: "CIPP/US, CIPP/E, CIPP/C — IAPP", href: "/verification#certification" },
      { text: "CIPT, CIPM, AIGP — IAPP", href: "/verification/iapp-aigp" },
      { text: "EU AI Act and cross-border transfer advisory", href: "https://guillengonzalezlaw.com" },
    ],
  },
  {
    icon: "🎓",
    title: "Education and academia",
    items: [
      { text: "Mathematics teaching degree, UNRN", href: "/verification/prof-mat-unrn" },
      {
        text: "Specialist in teaching in virtual environments",
        href: "/verification/esp-dev-unq",
      },
      { text: "Specialist in university evaluation, UBA", href: "/verification/esp-eval-uba" },
      { text: "Teaching assistant, Lehigh University", href: "/experience" },
    ],
  },
  {
    icon: "🌐",
    title: "Business and accounting",
    items: [
      { text: "Contador Público, CPCECABA licence", href: "/verification/cpcecaba-cp" },
      { text: "Licenciado en Administración, CPCECABA licence", href: "/verification/cpcecaba-la" },
      { text: "Actuary, Universidad Siglo 21", href: "/verification/actuario-ues21" },
      {
        text: "Auctioneer and real estate broker degree",
        href: "/verification/martillero-ues21",
      },
    ],
  },
];

/** Milestones, dated from the credential records rather than from memory. */
const MILESTONE_IDS = [
  "tec-soft-unlam",
  "eng-unlam",
  "cpn-unq",
  "esp-hys-moron",
  "prof-mat-unrn",
  "msfe-lehigh",
  "master-uneatlantico",
  "phd-unlam",
  "abogado-uncaus",
  "alm-harvard",
  "traductor-publico-ucu",
  "calbar",
  "ndcal",
  "esp-eval-uba",
  "actuario-ues21",
];

export default function Home() {
  const statCards = [
    {
      value: TOTALS.argentineRegistryDegrees,
      label: "University degrees",
      sub: "in Argentina's national graduate registry",
    },
    {
      value: TOTALS.internationalDegreeProgrammes,
      label: "International postgraduate programmes",
      sub: "Harvard · Lehigh · Spain / Puerto Rico",
    },
    {
      value: TOTALS.professionalCertifications,
      label: "Professional certifications",
      sub: "IAPP · AWS",
    },
    {
      value: `${TOTALS.verifiable}/${TOTALS.total}`,
      label: "Independently verifiable",
      sub: "with a live third-party link",
    },
  ];

  const milestones = MILESTONE_IDS.map(byId)
    .filter((c) => c !== undefined)
    .sort((a, b) => (a.conferred ?? "").localeCompare(b.conferred ?? ""));

  return (
    <>
      <CredentialsJsonLd lang="en" />

      <section className="relative overflow-hidden bg-navy pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(201,168,92,0.12),transparent)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-5 py-24 text-center lg:px-8">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-gold">
            <span>California Bar #361094</span>
          </div>

          <h1 className="font-display text-6xl font-bold leading-[0.95] text-cream sm:text-7xl lg:text-8xl">
            Gabriel<br />
            <span className="text-gold">Guillen-Gonzalez</span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-cream-dim">
            Attorney, computer engineer and data scientist. Immigration,
            privacy and technology law in San Jose, California.
          </p>

          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {statCards.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-border bg-navy-card px-6 py-5 text-center"
              >
                <p className="font-display text-4xl font-bold text-gold">{s.value}</p>
                <p className="mt-1 text-sm font-bold text-cream">{s.label}</p>
                <p className="mt-1 text-xs leading-5 text-cream-dim">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/verification"
              className="bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-navy transition hover:bg-gold-light"
            >
              Verify every credential
            </Link>
            <Link
              href="/about"
              className="border border-gold/50 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-gold transition hover:border-gold hover:bg-gold/10"
            >
              About Gabriel
            </Link>
          </div>
        </div>
      </section>

      {/* The verification pitch, replacing the world-record section. */}
      <section className="border-y border-border bg-navy-mid px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
                Verification first
              </p>
              <h2 className="mt-5 font-display text-5xl font-bold leading-tight text-cream">
                Don&rsquo;t take my word for any of it.
              </h2>
              <p className="mt-6 text-lg leading-9 text-cream-dim">
                Credential claims are cheap. Checkable credential claims are not.
                Every degree, licence and certification on this site is itemised
                on one page, each with a link to the government registry or
                issuing authority that holds the record — and where no public
                registry exists, it says so instead of glossing over it.
              </p>
              <p className="mt-4 text-base leading-8 text-cream-dim">
                {TOTALS.argentineRegistryDegrees} of the university degrees are
                in Argentina&rsquo;s Registro Público de Graduados Universitarios,
                which anyone can search by surname.
              </p>
              <Link
                href="/verification"
                className="mt-8 inline-flex items-center gap-2 border border-gold/50 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-gold transition hover:border-gold hover:bg-gold/10"
              >
                Open the verification page →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "University degree programmes", value: TOTALS.universityDegreeProgrammes, icon: "🎓" },
                { label: "In the Argentine state registry", value: TOTALS.argentineRegistryDegrees, icon: "🇦🇷" },
                { label: "Legal admissions", value: TOTALS.legalAdmissions, icon: "⚖️" },
                { label: "Professional licences", value: TOTALS.professionalLicences, icon: "📋" },
                { label: "Professional certifications", value: TOTALS.professionalCertifications, icon: "🔐" },
                { label: "Apostilled under the Hague Convention", value: TOTALS.apostilled, icon: "📜" },
                { label: "Countries of study", value: TOTALS.countriesOfStudy, icon: "🌎" },
                { label: "With a live verification link", value: `${TOTALS.verifiable}/${TOTALS.total}`, icon: "✅" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 rounded-lg border border-border bg-navy-card p-5"
                >
                  <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                  <div>
                    <p className="font-display text-3xl font-bold text-gold">{item.value}</p>
                    <p className="mt-1 text-sm leading-6 text-cream-dim">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
            Areas of expertise
          </p>
          <h2 className="mt-5 font-display text-5xl font-bold leading-tight text-cream">
            Six domains, each with the credential behind it.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map((d) => (
              <div
                key={d.title}
                className="rounded-lg border border-border bg-navy-card p-6 transition hover:border-gold/50"
              >
                <span className="text-3xl" aria-hidden="true">{d.icon}</span>
                <h3 className="mt-3 font-display text-2xl font-bold text-cream">
                  {d.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {d.items.map((item) => (
                    <li key={item.text} className="flex items-start gap-2 text-sm text-cream-dim">
                      <span className="mt-0.5 text-gold" aria-hidden="true">›</span>
                      <Link href={item.href} className="hover:text-gold">
                        {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-navy-mid px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
            Academic and professional milestones
          </p>
          <h2 className="mt-5 font-display text-5xl font-bold leading-tight text-cream">
            Dated from the record, not from memory.
          </h2>
          <div className="relative mt-12">
            <div className="absolute left-[132px] top-0 hidden h-full w-px bg-border lg:block" />
            <ol className="space-y-4">
              {milestones.map((c) => (
                <li key={c.id} className="grid gap-2 lg:grid-cols-[132px_1fr] lg:gap-8">
                  <p className="pt-1 text-right text-sm font-bold text-gold">
                    {formatDate(c.conferred, "en")}
                  </p>
                  <div className="relative rounded border border-border bg-navy-card px-5 py-4 text-sm text-cream-dim lg:ml-8">
                    <div className="absolute -left-[10px] top-1/2 hidden h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-gold bg-navy lg:block" />
                    <Link href={`/verification/${c.id}`} className="hover:text-gold">
                      {c.title_en ?? c.title_es} — {c.institution}
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-10 text-center">
            <Link
              href="/degrees"
              className="text-sm font-bold uppercase tracking-[0.18em] text-gold transition hover:text-gold-light"
            >
              View the full degree record →
            </Link>
          </p>
        </div>
      </section>

      <section className="border-t border-border px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/verification",
                icon: "✅",
                title: "Verification",
                desc: "Every credential, itemised, with the link that proves it",
              },
              {
                href: "/degrees",
                icon: "🎓",
                title: "Degrees",
                desc: `${TOTALS.universityDegreeProgrammes} university degree programmes across four jurisdictions`,
              },
              {
                href: "/certifications",
                icon: "📋",
                title: "Certifications",
                desc: `${TOTALS.professionalCertifications} current IAPP and AWS credentials`,
              },
              {
                href: "/experience",
                icon: "💼",
                title: "Experience",
                desc: "PayPal, Meta, academia and private practice",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group bg-navy-card p-8 transition hover:bg-navy-mid"
              >
                <span className="text-3xl" aria-hidden="true">{card.icon}</span>
                <h3 className="mt-4 font-display text-2xl font-bold text-cream group-hover:text-gold">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-cream-dim">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
