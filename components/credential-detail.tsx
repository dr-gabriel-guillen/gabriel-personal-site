/**
 * One page per credential.
 *
 * These are the pages built to rank for `"Gabriel Guillen" <credential name>`
 * queries: a single credential, its exact title in both languages, its dates,
 * its registry reference, and the link that proves it.
 */
import Link from "next/link";
import {
  COUNTRY_LABELS,
  LEVEL_LABELS,
  SECTION_LABELS,
  type Credential,
  type Lang,
  credentialPath,
  documentFor,
  formatBytes,
  formatDate,
  originalTitle,
  registryFor,
  title,
  verification,
} from "@/lib/credentials";

const COPY = {
  en: {
    back: "All credentials",
    verify: "Verify independently",
    howTo: "How to verify this",
    noRegistry: "No public registry exists for this credential",
    pending: "Verification link pending",
    apostille: "Apostille of The Hague",
    apostilleNo: "Apostille number",
    translation: "Certified English translation",
    yes: "Held",
    facts: "Record",
    institution: "Institution",
    country: "Country",
    level: "Level",
    category: "Category",
    conferred: "Conferred",
    diplomaIssued: "Diploma issued",
    studiesStarted: "Coursework began",
    studiesCompleted: "Studies completed",
    expires: "Valid to",
    registry: "Registry",
    registryNo: "Registry reference",
    ects: "Credits",
    thesis: "Thesis",
    document: "The document",
    documentCta: "Open the full document",
    documentNote:
      "The original diploma, academic transcript, apostille and certified translation, published in full exactly as issued.",
    docsNote:
      "No document is published for this credential. It is verified through the registry above, or the document is provided directly on request.",
  },
  es: {
    back: "Todas las credenciales",
    verify: "Verificar de forma independiente",
    howTo: "Cómo verificar esto",
    noRegistry: "No existe un registro público para esta credencial",
    pending: "Enlace de verificación pendiente",
    apostille: "Apostilla de La Haya",
    apostilleNo: "Número de apostilla",
    translation: "Traducción certificada al inglés",
    yes: "Sí",
    facts: "Ficha",
    institution: "Institución",
    country: "País",
    level: "Nivel",
    category: "Categoría",
    conferred: "Otorgado",
    diplomaIssued: "Diploma emitido",
    studiesStarted: "Inicio de la cursada",
    studiesCompleted: "Estudios completados",
    expires: "Vigente hasta",
    registry: "Registro",
    registryNo: "Referencia de registro",
    ects: "Créditos",
    thesis: "Tesis",
    document: "El documento",
    documentCta: "Abrir el documento completo",
    documentNote:
      "El diploma original, el certificado analítico, la apostilla y la traducción certificada, publicados íntegros tal como fueron emitidos.",
    docsNote:
      "No se publica documento para esta credencial. Se verifica mediante el registro indicado arriba, o el documento se entrega directamente a pedido.",
  },
} as const;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-border py-4 sm:grid-cols-[220px_1fr] sm:gap-6">
      <dt className="text-xs font-bold uppercase tracking-[0.15em] text-cream-dim">
        {label}
      </dt>
      <dd className="text-base leading-7 text-cream">{children}</dd>
    </div>
  );
}

export function CredentialDetail({ c, lang }: { c: Credential; lang: Lang }) {
  const t = COPY[lang];
  const es = lang === "es";
  const v = verification(c, lang);
  const reg = registryFor(c);
  const original = originalTitle(c, lang);
  const country = c.country ? COUNTRY_LABELS[c.country] : null;
  const level = c.level ? LEVEL_LABELS[c.level] : null;
  const section = SECTION_LABELS[c.category];
  const doc = documentFor(c);
  const note = es ? c.public_note_es : c.public_note_en;
  const noRegNote = es ? c.no_public_registry_note_es : c.no_public_registry_note_en;
  const pendingNote = es ? c.verify_pending_note_es : c.verify_pending_note_en;
  const listPath = es ? "/verificacion" : "/verification";

  return (
    <div className="pt-20">
      <section className="border-b border-border bg-navy-mid px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
            <Link href={listPath} className="hover:text-gold-light">
              ← {t.back}
            </Link>
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-cream">
            {title(c, lang)}
          </h1>
          {original && <p className="mt-3 text-lg italic text-cream-dim">{original}</p>}
          <p className="mt-4 text-base text-cream-dim">
            {c.institution}
            {country ? ` · ${es ? country.es : country.en}` : ""}
          </p>
          <p className="mt-6 text-sm">
            <Link
              href={credentialPath(c, es ? "en" : "es")}
              hrefLang={es ? "en" : "es"}
              className="text-gold underline underline-offset-4"
            >
              {es ? "Read this page in English" : "Leer esta página en español"}
            </Link>
          </p>
        </div>
      </section>

      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {note && (
            <p className="mb-8 border-l-2 border-gold/60 pl-5 text-base leading-8 text-cream-dim">
              {note}
            </p>
          )}

          <h2 className="font-display text-2xl font-bold text-cream">{t.facts}</h2>
          <dl className="mt-4">
            <Row label={t.category}>{es ? section.es : section.en}</Row>
            <Row label={t.institution}>
              {c.institution_url ? (
                <a
                  href={c.institution_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold underline underline-offset-4"
                >
                  {c.institution}
                </a>
              ) : (
                c.institution
              )}
            </Row>
            {country && (
              <Row label={t.country}>
                <span aria-hidden="true">{country.flag}</span>{" "}
                {es ? country.es : country.en}
              </Row>
            )}
            {level && <Row label={t.level}>{es ? level.es : level.en}</Row>}
            {c.studies_started && (
              <Row label={t.studiesStarted}>{formatDate(c.studies_started, lang)}</Row>
            )}
            {c.studies_completed && (
              <Row label={t.studiesCompleted}>
                {formatDate(c.studies_completed, lang)}
              </Row>
            )}
            {c.conferred && (
              <Row label={t.conferred}>{formatDate(c.conferred, lang)}</Row>
            )}
            {c.diploma_issued && (
              <Row label={t.diplomaIssued}>{formatDate(c.diploma_issued, lang)}</Row>
            )}
            {c.expires && <Row label={t.expires}>{formatDate(c.expires, lang)}</Row>}
            {reg && <Row label={t.registry}>{es ? reg.name_es ?? reg.name_en : reg.name_en}</Row>}
            {c.registry_number && <Row label={t.registryNo}>{c.registry_number}</Row>}
            {c.ects && <Row label={t.ects}>{c.ects}</Row>}
            {c.apostille && <Row label={t.apostille}>{t.yes}</Row>}
            {c.apostille_number && (
              <Row label={t.apostilleNo}>{c.apostille_number}</Row>
            )}
            {c.english_translation && <Row label={t.translation}>{t.yes}</Row>}
            {(c.thesis_en || c.thesis_es) && (
              <Row label={t.thesis}>
                {es ? c.thesis_es ?? c.thesis_en : c.thesis_en ?? c.thesis_es}
              </Row>
            )}
          </dl>

          <div className="mt-10 rounded-lg border border-border bg-navy-card p-6">
            {v.url ? (
              <>
                <h2 className="font-display text-2xl font-bold text-cream">
                  {v.kind === "search" ? t.howTo : t.verify}
                </h2>
                {v.instructions && (
                  <p className="mt-3 text-base leading-8 text-cream-dim">
                    {v.instructions}
                  </p>
                )}
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block border border-gold/60 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold/10"
                >
                  {v.label ?? t.verify} →
                </a>
              </>
            ) : c.verify_status === "pending" ? (
              <>
                <h2 className="font-display text-2xl font-bold text-cream">
                  {t.pending}
                </h2>
                {pendingNote && (
                  <p className="mt-3 text-base leading-8 text-cream-dim">
                    {pendingNote}
                  </p>
                )}
              </>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold text-cream">
                  {t.noRegistry}
                </h2>
                {noRegNote && (
                  <p className="mt-3 text-base leading-8 text-cream-dim">{noRegNote}</p>
                )}
              </>
            )}
          </div>

          {/* The document sits below the verification block deliberately: a
              PDF served from this domain is weaker evidence than a registry a
              stranger can query independently. */}
          {doc ? (
            <div className="mt-8 rounded-lg border border-border bg-navy-card p-6">
              <h2 className="font-display text-2xl font-bold text-cream">{t.document}</h2>
              <p className="mt-3 text-base leading-8 text-cream-dim">
                {(es ? c.document_note_es : c.document_note_en) ?? t.documentNote}
              </p>
              <a
                href={doc.path}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.documentCta}: ${title(c, lang)} (PDF, ${formatBytes(doc.bytes)})`}
                className="mt-5 inline-block border border-gold/60 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold/10"
              >
                {t.documentCta} — PDF, {formatBytes(doc.bytes)} ↓
              </a>
            </div>
          ) : (
            <p className="mt-8 text-sm leading-7 text-cream-dim">{t.docsNote}</p>
          )}
        </div>
      </section>
    </div>
  );
}
