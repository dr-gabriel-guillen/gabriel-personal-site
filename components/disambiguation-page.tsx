/**
 * Name disambiguation.
 *
 * The accented and honorific forms of the name are currently lost entirely:
 * "Gabriel Guillén" returns a Middlebury linguistics professor and "Dr. Gabriel
 * Guillen" returns Latin American physicians. This page is genuinely useful to
 * a searcher who landed on the wrong person, and it is the cheapest way to win
 * a name collision — an honest page that helps people leave beats keyword
 * stuffing that traps them.
 *
 * Server-rendered, one URL per language.
 */
import Link from "next/link";
import { TOTALS } from "@/lib/credentials";
import { ALTERNATE_NAMES, CANONICAL_NAME, PERSON_ID, SITE } from "@/lib/seo";
import type { Lang } from "@/lib/credentials";

const COPY = {
  en: {
    eyebrow: "Name disambiguation",
    h1: "There are several people named Gabriel Guillén.",
    lede: "I am the California attorney, State Bar licence #361094. If you were looking for someone else, this page should get you unstuck quickly.",
    whoIAm: "Who I am",
    whoImNot: "Who I am not",
    tell: "How to tell us apart",
    other: "Read this page in Spanish",
    otherHref: "/desambiguacion",
    verify: "Verify California Bar licence #361094",
    names: "Names I publish under",
    namesNote:
      "The State Bar record reads Gabriel Guillen-Gonzalez, and that is the canonical form. Older work appears under Gabriel B. Guillen, and Argentine records use Gabriel Bernardo Guillen.",
    identifiers: "The identifiers that actually pin me down",
    footer:
      "If you are trying to confirm whether a particular credential belongs to me, the verification page lists every one of them with the registry that holds the record.",
    cta: "Every credential, independently verifiable",
  },
  es: {
    eyebrow: "Desambiguación de nombre",
    h1: "Hay varias personas llamadas Gabriel Guillén.",
    lede: "Yo soy el abogado de California, licencia #361094 del Colegio de Abogados del Estado. Si buscaba a otra persona, esta página debería resolverlo rápido.",
    whoIAm: "Quién soy",
    whoImNot: "Quién no soy",
    tell: "Cómo distinguirnos",
    other: "Leer esta página en inglés",
    otherHref: "/disambiguation",
    verify: "Verificar la licencia #361094 del Colegio de Abogados de California",
    names: "Nombres con los que publico",
    namesNote:
      "El registro del Colegio de Abogados dice Gabriel Guillen-Gonzalez, y esa es la forma canónica. Trabajos anteriores aparecen como Gabriel B. Guillen, y los registros argentinos usan Gabriel Bernardo Guillen.",
    identifiers: "Los identificadores que realmente me distinguen",
    footer:
      "Si intenta confirmar si una credencial concreta me pertenece, la página de verificación las lista todas con el registro que guarda el asiento.",
    cta: "Cada credencial, verificable de forma independiente",
  },
} as const;

export function DisambiguationPage({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const es = lang === "es";

  const iAm = es
    ? [
        "Abogado admitido en California en 2025, licencia #361094.",
        "Fundador de Guillen-Gonzalez Law PC, en San José, California.",
        "Ingeniero en informática y científico de datos; antes ingeniero de software sénior en PayPal y Meta.",
        `Titular de ${TOTALS.universityDegreeProgrammes} programas de título universitario obtenidos en Argentina, Estados Unidos, España y Puerto Rico.`,
        "Traductor público de inglés matriculado en la provincia de Buenos Aires.",
      ]
    : [
        "A California attorney, admitted in 2025, licence #361094.",
        "Founder of Guillen-Gonzalez Law PC in San Jose, California.",
        "A computer engineer and data scientist; previously a senior software engineer at PayPal and Meta.",
        `Holder of ${TOTALS.universityDegreeProgrammes} university degree programmes earned in Argentina, the United States, Spain and Puerto Rico.`,
        "A sworn English public translator registered in Buenos Aires Province.",
      ];

  const iAmNot = es
    ? [
        "No soy el profesor de lingüística de Middlebury College que aparece al buscar «Gabriel Guillén».",
        "No soy ninguno de los médicos latinoamericanos que aparecen al buscar «Dr. Gabriel Guillen».",
        "No soy escribano en ejercicio en Argentina: tengo el título de escribano, pero no matrícula activa.",
        "No estoy afiliado a ninguna otra firma legal ni ejerzo bajo otro nombre.",
      ]
    : [
        "I am not the Middlebury College linguistics professor who comes up for “Gabriel Guillén”.",
        "I am not any of the Latin American physicians who come up for “Dr. Gabriel Guillen”.",
        "I am not a practising Argentine notary. I hold the escribano degree but have no active registration.",
        "I am not affiliated with any other law firm and do not practise under another name.",
      ];

  const identifiers = [
    {
      label: es ? "Licencia del Colegio de Abogados de California" : "California State Bar licence",
      value: "#361094",
      href: "https://apps.calbar.ca.gov/attorney/Licensee/Detail/361094",
    },
    {
      label: es ? "Estudio jurídico" : "Law firm",
      value: "Guillen-Gonzalez Law PC, San Jose, California",
      href: "https://guillengonzalezlaw.com",
    },
    {
      label: es ? "Matrícula de traductor público" : "Sworn translator registration",
      value: "CTPIPBA Regional Morón",
      href: "https://traductoresmoron.org.ar/matriculado/guillen-gabriel-bernardo/",
    },
  ];

  return (
    <div className="pt-20">
      <section className="border-b border-border bg-navy-mid px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
            {t.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-cream lg:text-5xl">
            {t.h1}
          </h1>
          <p className="mt-6 text-lg leading-9 text-cream-dim">{t.lede}</p>
          <p className="mt-4 text-sm">
            <Link
              href={t.otherHref}
              hrefLang={es ? "en" : "es"}
              className="text-gold underline underline-offset-4"
            >
              {t.other}
            </Link>
          </p>
        </div>
      </section>

      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-cream">{t.whoIAm}</h2>
            <ul className="mt-5 space-y-3">
              {iAm.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-8 text-cream-dim">
                  <span className="mt-1 text-gold" aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-cream">{t.whoImNot}</h2>
            <ul className="mt-5 space-y-3">
              {iAmNot.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-8 text-cream-dim">
                  <span className="mt-1 text-cream-dim" aria-hidden="true">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-navy-mid px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-cream">{t.identifiers}</h2>
          <dl className="mt-6">
            {identifiers.map((i) => (
              <div
                key={i.label}
                className="grid gap-1 border-b border-border py-4 sm:grid-cols-[260px_1fr] sm:gap-6"
              >
                <dt className="text-xs font-bold uppercase tracking-[0.15em] text-cream-dim">
                  {i.label}
                </dt>
                <dd className="text-base text-cream">
                  <a
                    href={i.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold underline underline-offset-4"
                  >
                    {i.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-10 font-display text-2xl font-bold text-cream">{t.names}</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {[CANONICAL_NAME, ...ALTERNATE_NAMES].map((n) => (
              <li
                key={n}
                className="rounded border border-border bg-navy-card px-3 py-1.5 text-sm text-cream-dim"
              >
                {n}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-7 text-cream-dim">{t.namesNote}</p>
        </div>
      </section>

      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-base leading-8 text-cream-dim">{t.footer}</p>
          <Link
            href={es ? "/verificacion" : "/verification"}
            className="mt-6 inline-block border border-gold/60 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold/10"
          >
            {t.cta} →
          </Link>
        </div>
      </section>

      {/* A minimal Person node so this page also answers the identity question
          for machines, pointing at the same @id as everywhere else. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": PERSON_ID,
            name: CANONICAL_NAME,
            alternateName: ALTERNATE_NAMES,
            url: SITE,
            jobTitle: es ? "Abogado" : "Attorney at Law",
            identifier: {
              "@type": "PropertyValue",
              propertyID: "State Bar of California licence",
              value: "361094",
            },
            sameAs: [
              "https://apps.calbar.ca.gov/attorney/Licensee/Detail/361094",
              "https://guillengonzalezlaw.com",
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
