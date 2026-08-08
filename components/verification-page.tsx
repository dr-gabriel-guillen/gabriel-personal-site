/**
 * The verification page, in both languages.
 *
 * Server-rendered with no client JavaScript: this content has to be crawlable
 * by search engines, readable by AI systems answering "who is Gabriel Guillen",
 * and archivable. It must not depend on a language toggle held in localStorage.
 *
 * Every number on this page comes from lib/credentials.ts, which computes it
 * from data/credentials.json. Nothing here is typed by hand.
 */
import Link from "next/link";
import {
  CREDENTIALS,
  COUNTING_RULES,
  COUNTRY_LABELS,
  LEVEL_LABELS,
  SECTION_LABELS,
  SECTION_ORDER,
  TOTALS,
  type Category,
  type Credential,
  type Lang,
  credentialPath,
  formatDate,
  inCategory,
  originalTitle,
  title,
  verification,
} from "@/lib/credentials";

const COPY = {
  en: {
    eyebrow: "Independent verification",
    h1: "Every credential below can be verified independently.",
    lede: "Links go to government registries and issuing authorities, not to me. Where a registry needs a name search rather than a direct link, the exact search terms are given. Where no public registry exists, it says so.",
    tiles: "What the record contains",
    counted: "How the count works",
    verifyCta: "Verify independently",
    searchCta: "How to verify",
    noRegistry: "No public registry",
    pending: "Verification link pending",
    apostille: "Apostilled (Hague)",
    translated: "Certified English translation",
    conferred: "Conferred",
    diplomaIssued: "Diploma issued",
    studiesCompleted: "Studies completed",
    studiesStarted: "Coursework began",
    expires: "Valid to",
    institution: "Institution",
    level: "Level",
    registryNo: "Registry reference",
    ects: "Credits",
    thesis: "Thesis",
    detail: "Full record",
    verifiableNow: "independently verifiable right now",
    ofTotal: "of",
    honesty:
      "This page reports its own gaps. The tile above is the share of credentials a stranger can check today without asking me for anything.",
    lastGenerated: "Source data compiled",
  },
  es: {
    eyebrow: "Verificación independiente",
    h1: "Cada credencial de esta página puede verificarse de forma independiente.",
    lede: "Los enlaces van a registros oficiales y a las autoridades emisoras, no a mí. Cuando un registro requiere una búsqueda por nombre en lugar de un enlace directo, se indican los términos exactos de búsqueda. Cuando no existe un registro público, se dice.",
    tiles: "Qué contiene el registro",
    counted: "Cómo se hace la cuenta",
    verifyCta: "Verificar de forma independiente",
    searchCta: "Cómo verificar",
    noRegistry: "Sin registro público",
    pending: "Enlace de verificación pendiente",
    apostille: "Apostillado (La Haya)",
    translated: "Traducción certificada al inglés",
    conferred: "Otorgado",
    diplomaIssued: "Diploma emitido",
    studiesCompleted: "Estudios completados",
    studiesStarted: "Inicio de la cursada",
    expires: "Vigente hasta",
    institution: "Institución",
    level: "Nivel",
    registryNo: "Referencia de registro",
    ects: "Créditos",
    thesis: "Tesis",
    detail: "Ficha completa",
    verifiableNow: "verificables de forma independiente ahora mismo",
    ofTotal: "de",
    honesty:
      "Esta página informa sus propias brechas. El indicador anterior es la proporción de credenciales que un tercero puede comprobar hoy sin pedirme nada.",
    lastGenerated: "Datos de origen compilados",
  },
} as const;

function Badge({
  tone,
  children,
}: {
  tone: "gold" | "muted" | "warn";
  children: React.ReactNode;
}) {
  const tones = {
    gold: "border-gold/50 bg-gold/10 text-gold",
    muted: "border-border bg-navy text-cream-dim",
    warn: "border-amber-700/60 bg-amber-900/20 text-amber-300",
  };
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-xs font-bold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-xs font-bold uppercase tracking-[0.15em] text-cream-dim">
        {label}
      </dt>
      <dd className="mb-3 mt-1 text-sm text-cream">{children}</dd>
    </>
  );
}

function CredentialCard({ c, lang }: { c: Credential; lang: Lang }) {
  const t = COPY[lang];
  const v = verification(c, lang);
  const original = originalTitle(c, lang);
  const country = c.country ? COUNTRY_LABELS[c.country] : null;
  const level = c.level ? LEVEL_LABELS[c.level] : null;
  const note = lang === "es" ? c.public_note_es : c.public_note_en;
  const noRegNote =
    lang === "es" ? c.no_public_registry_note_es : c.no_public_registry_note_en;
  const pendingNote =
    lang === "es" ? c.verify_pending_note_es : c.verify_pending_note_en;

  return (
    <article
      id={c.id}
      className="rounded-lg border border-border bg-navy-card p-6 scroll-mt-24"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-display text-2xl font-bold leading-snug text-cream">
          <Link href={credentialPath(c, lang)} className="hover:text-gold">
            {title(c, lang)}
          </Link>
        </h3>
        {country && (
          <span className="shrink-0 text-sm text-cream-dim">
            <span aria-hidden="true">{country.flag}</span>{" "}
            {lang === "es" ? country.es : country.en}
          </span>
        )}
      </div>

      {original && (
        <p className="mt-1 text-sm italic text-cream-dim">{original}</p>
      )}

      <dl className="mt-5 sm:grid sm:grid-cols-2 sm:gap-x-8">
        <Field label={t.institution}>{c.institution}</Field>
        {level && <Field label={t.level}>{lang === "es" ? level.es : level.en}</Field>}
        {c.studies_started && (
          <Field label={t.studiesStarted}>{formatDate(c.studies_started, lang)}</Field>
        )}
        {c.studies_completed && (
          <Field label={t.studiesCompleted}>
            {formatDate(c.studies_completed, lang)}
          </Field>
        )}
        {c.conferred && (
          <Field label={t.conferred}>{formatDate(c.conferred, lang)}</Field>
        )}
        {c.diploma_issued && (
          <Field label={t.diplomaIssued}>{formatDate(c.diploma_issued, lang)}</Field>
        )}
        {c.expires && <Field label={t.expires}>{formatDate(c.expires, lang)}</Field>}
        {c.registry_number && (
          <Field label={t.registryNo}>{c.registry_number}</Field>
        )}
        {c.ects && <Field label={t.ects}>{c.ects}</Field>}
      </dl>

      {(c.apostille || c.english_translation) && (
        <p className="flex flex-wrap gap-2">
          {c.apostille && (
            <Badge tone="muted">
              {t.apostille}
              {c.apostille_number ? ` · ${c.apostille_number}` : ""}
            </Badge>
          )}
          {c.english_translation && <Badge tone="muted">{t.translated}</Badge>}
        </p>
      )}

      {(c.thesis_en || c.thesis_es) && (
        <p className="mt-4 text-sm leading-7 text-cream-dim">
          <span className="font-bold text-cream">{t.thesis}: </span>
          {lang === "es" ? c.thesis_es ?? c.thesis_en : c.thesis_en ?? c.thesis_es}
        </p>
      )}

      {note && <p className="mt-4 text-sm leading-7 text-cream-dim">{note}</p>}

      <div className="mt-5 border-t border-border pt-4">
        {v.url ? (
          <>
            {/* The visible text is short and repeats down the page, so the
                full specific label goes on the element itself — that is what a
                screen reader announces when listing links out of context. */}
            <a
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={v.label ?? undefined}
              className="inline-block border border-gold/60 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold/10"
            >
              {v.kind === "search" ? t.searchCta : t.verifyCta} →
            </a>
            {v.instructions && (
              <p className="mt-3 text-sm leading-7 text-cream-dim">{v.instructions}</p>
            )}
          </>
        ) : c.verify_status === "pending" ? (
          <>
            <Badge tone="warn">{t.pending}</Badge>
            {pendingNote && (
              <p className="mt-3 text-sm leading-7 text-cream-dim">{pendingNote}</p>
            )}
          </>
        ) : (
          <>
            <Badge tone="muted">{t.noRegistry}</Badge>
            {noRegNote && (
              <p className="mt-3 text-sm leading-7 text-cream-dim">{noRegNote}</p>
            )}
          </>
        )}
      </div>
    </article>
  );
}

function Tile({
  value,
  label,
  href,
}: {
  value: string | number;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block rounded-lg border border-border bg-navy-card p-5 transition hover:border-gold/50"
    >
      <p className="font-display text-4xl font-bold text-gold">{value}</p>
      <p className="mt-2 text-sm leading-6 text-cream-dim">{label}</p>
    </a>
  );
}

export function VerificationPage({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const es = lang === "es";

  const tiles = [
    {
      value: TOTALS.argentineRegistryDegrees,
      label: es
        ? "títulos universitarios en el registro nacional de graduados de Argentina"
        : "university degrees in Argentina's national graduate registry",
      href: "#undergraduate",
    },
    {
      value: TOTALS.internationalDegreeProgrammes,
      label: es
        ? `programas de posgrado internacionales (${TOTALS.internationalDegreeTitles} títulos emitidos — dos son un programa de doble emisión)`
        : `international postgraduate programmes (${TOTALS.internationalDegreeTitles} issued titles — two of them are one dual-issued programme)`,
      href: "#postgraduate_international",
    },
    {
      value: TOTALS.legalAdmissions,
      label: es ? "admisiones para ejercer la abogacía" : "admissions to practise law",
      href: "#legal_admission",
    },
    {
      value: TOTALS.professionalLicences,
      label: es ? "matrículas profesionales activas" : "active professional licences",
      href: "#professional_licence",
    },
    {
      value: TOTALS.professionalCertifications,
      label: es
        ? "certificaciones profesionales vigentes"
        : "current professional certifications",
      href: "#certification",
    },
    {
      value: `${TOTALS.verifiable}/${TOTALS.total}`,
      label: es
        ? "credenciales con enlace de verificación de terceros en vivo"
        : "credentials with a live third-party verification link",
      href: "#honesty",
    },
  ];

  return (
    <div className="pt-20">
      <section className="border-b border-border bg-navy-mid px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
            {t.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-cream lg:text-5xl">
            {t.h1}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-9 text-cream-dim">{t.lede}</p>
          <p className="mt-4 text-sm text-cream-dim">
            <Link
              href={es ? "/verification" : "/verificacion"}
              hrefLang={es ? "en" : "es"}
              className="text-gold underline underline-offset-4"
            >
              {es ? "Read this page in English" : "Leer esta página en español"}
            </Link>
          </p>
        </div>
      </section>

      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-bold text-cream">{t.tiles}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map((tile) => (
              <Tile key={tile.href + tile.label} {...tile} />
            ))}
          </div>
          <p id="honesty" className="mt-6 scroll-mt-24 text-sm leading-7 text-cream-dim">
            {t.honesty}
          </p>
        </div>
      </section>

      {/* The count explanation. Generated from the data, so it can never drift
          away from the itemised list above it. */}
      <section className="border-y border-border bg-navy-mid px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-cream">{t.counted}</h2>
          <div className="mt-6 space-y-5 text-base leading-9 text-cream-dim">
            <p>
              {es ? (
                <>
                  <strong className="text-cream">
                    {TOTALS.argentineRegistryDegrees} títulos universitarios
                  </strong>{" "}
                  figuran en el Registro Público de Graduados Universitarios de
                  Argentina, buscables por apellido y nombre. A eso se suman{" "}
                  <strong className="text-cream">
                    {TOTALS.internationalDegreeProgrammes} programas de posgrado
                    internacionales
                  </strong>{" "}
                  (Harvard, Lehigh y el máster de doble emisión España / Puerto
                  Rico), lo que da{" "}
                  <strong className="text-cream">
                    {TOTALS.universityDegreeProgrammes} programas universitarios
                    distintos
                  </strong>
                  .
                </>
              ) : (
                <>
                  <strong className="text-cream">
                    {TOTALS.argentineRegistryDegrees} university degrees
                  </strong>{" "}
                  are recorded in Argentina&rsquo;s Registro Público de Graduados
                  Universitarios, searchable by surname and given name. Added to
                  those are{" "}
                  <strong className="text-cream">
                    {TOTALS.internationalDegreeProgrammes} international
                    postgraduate programmes
                  </strong>{" "}
                  (Harvard, Lehigh, and the dual-issued Spain / Puerto Rico
                  master&rsquo;s), giving{" "}
                  <strong className="text-cream">
                    {TOTALS.universityDegreeProgrammes} distinct university degree
                    programmes
                  </strong>
                  .
                </>
              )}
            </p>
            <p>{es ? COUNTING_RULES.dual_issue_note_es : COUNTING_RULES.dual_issue_note_en}</p>
            <p>
              {es ? COUNTING_RULES.tertiary_note_es : COUNTING_RULES.tertiary_note_en}
            </p>
            <p>
              {es ? COUNTING_RULES.coursework_note_es : COUNTING_RULES.coursework_note_en}
            </p>
          </div>
        </div>
      </section>

      {SECTION_ORDER.map((category) => {
        const group = inCategory(category as Category);
        if (!group.length) return null;
        const label = SECTION_LABELS[category as Category];
        return (
          <section
            key={category}
            id={category}
            className="scroll-mt-20 border-b border-border px-5 py-14 lg:px-8"
          >
            <div className="mx-auto max-w-5xl">
              <h2 className="font-display text-3xl font-bold text-cream">
                {es ? label.es : label.en}{" "}
                <span className="text-gold">({group.length})</span>
              </h2>
              <div className="mt-8 space-y-5">
                {group.map((c) => (
                  <CredentialCard key={c.id} c={c} lang={lang} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-3xl text-sm leading-8 text-cream-dim">
          <p>
            {es
              ? "Los documentos originales —diplomas, analíticos, apostillas y traducciones certificadas— no se publican en internet. Se entregan directamente a quien tenga una razón legítima para pedirlos."
              : "The underlying documents — diplomas, transcripts, apostilles and certified translations — are not published online. They are provided directly to anyone with a legitimate reason to ask."}
          </p>
          <p className="mt-4">
            {t.lastGenerated}: {formatDate("2026-08-07", lang)}.
          </p>
          <p className="mt-4">
            <Link
              href={es ? "/desambiguacion" : "/disambiguation"}
              className="text-gold underline underline-offset-4"
            >
              {es
                ? "¿Buscaba a otra persona llamada Gabriel Guillén?"
                : "Looking for a different Gabriel Guillén?"}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

/** Used by the per-credential routes to prerender one page per credential. */
export function allCredentialIds(): string[] {
  return CREDENTIALS.map((c) => c.id);
}
