/**
 * The single source of truth for every credential claim on this site.
 *
 * Rule: no page may hardcode a total. Every number rendered anywhere is
 * computed here from data/credentials.json, so the itemised evidence and the
 * headline figure can never drift apart again. If the data says 17, the page
 * says 17.
 *
 * Run `npm run validate:credentials` after editing the JSON.
 */
import raw from "@/data/credentials.json";
import documents from "@/data/documents.json";

export type Lang = "en" | "es";

export type Category =
  | "legal_admission"
  | "professional_licence"
  | "certification"
  | "doctorate"
  | "postgraduate_international"
  | "postgraduate_argentina"
  | "undergraduate"
  | "tertiary_non_university"
  | "coursework_not_conferred";

export type VerifyKind = "deep_link" | "search" | "validator" | "pending" | "none";

export interface Credential {
  id: string;
  category: Category;
  level?: string;
  title_en?: string;
  title_es?: string;
  institution: string;
  institution_url?: string;
  issuer?: string;
  country?: string;
  conferred: string | null;
  date_precision?: "year" | "month";
  diploma_issued?: string;
  studies_started?: string;
  studies_completed?: string;
  expires?: string;
  ects?: string;
  registry?: string;
  registry_number?: string;
  apostille?: boolean;
  apostille_number?: string;
  english_translation?: boolean | null;
  status: string;
  status_label_es?: string;
  verify_url?: string | null;
  verify_kind?: VerifyKind;
  verify_status?: string;
  verify_source?: string;
  verify_label_en?: string;
  verify_label_es?: string;
  verify_instructions_en?: string;
  verify_instructions_es?: string;
  verify_pending_note_en?: string;
  verify_pending_note_es?: string;
  no_public_registry?: boolean;
  no_public_registry_note_en?: string;
  no_public_registry_note_es?: string;
  public_note_en?: string;
  public_note_es?: string;
  internal_note?: string;
  thesis_en?: string;
  thesis_es?: string;
  counts_as_university_degree: boolean;
  dual_issue_group?: string;
  cert_kind?: "professional" | "academic";
  based_on?: string;
  feature_flag?: string;
  first_published?: boolean;
}

interface Registry {
  name_en: string;
  name_es?: string;
  url: string;
  kind: string;
  search_terms_en?: string;
  search_terms_es?: string;
  link_policy?: string;
}

/**
 * Feature flags. A credential carrying `feature_flag` renders only when its
 * flag is on, and is excluded from every count while it is off. COPITEC stays
 * dark until Gabriel confirms the matrícula is still active.
 */
const FLAGS: Record<string, boolean> = {
  COPITEC_CONFIRMED: process.env.NEXT_PUBLIC_COPITEC_CONFIRMED === "true",
};

const ALL = raw.credentials as Credential[];

/** Everything publishable right now: flag-gated records drop out. */
export const CREDENTIALS: Credential[] = ALL.filter(
  (c) => !c.feature_flag || FLAGS[c.feature_flag] === true,
);

export const META = raw._meta;
export const COUNTING_RULES = raw.counting_rules;
export const REMOVED_CLAIMS = raw.unevidenced_claims_removed;
export const REGISTRIES = raw._meta.registries as unknown as Record<string, Registry>;

export function byId(id: string): Credential | undefined {
  return CREDENTIALS.find((c) => c.id === id);
}

/**
 * The published source document for a credential, where one exists.
 *
 * Kept in its own manifest (data/documents.json, written by
 * scripts/import-documents.mjs) rather than inside credentials.json, so the
 * credential record stays byte-identical to the firm site's copy and the
 * parity check keeps passing.
 *
 * Only 18 of the credentials have a document. The rest are verified purely
 * through their registry, or have no document on file yet.
 */
export function documentFor(c: Credential): { path: string; bytes: number } | null {
  const doc = (documents as Record<string, { path: string; bytes: number }>)[c.id];
  return doc ?? null;
}

export function formatBytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function inCategory(category: Category): Credential[] {
  return CREDENTIALS.filter((c) => c.category === category);
}

export function title(c: Credential, lang: Lang): string {
  const primary = lang === "es" ? c.title_es : c.title_en;
  return primary ?? c.title_en ?? c.title_es ?? c.id;
}

/** The Spanish original, shown alongside the English rendering when they differ. */
export function originalTitle(c: Credential, lang: Lang): string | null {
  const other = lang === "es" ? c.title_en : c.title_es;
  if (!other || other === title(c, lang)) return null;
  return other;
}

export function registryFor(c: Credential): Registry | null {
  return c.registry ? REGISTRIES[c.registry] ?? null : null;
}

/**
 * Resolves where "Verify independently" points, falling back to the registry
 * search page for the Argentine degrees, which are verified by name search
 * rather than by a per-credential deep link.
 */
export function verification(c: Credential, lang: Lang) {
  const reg = registryFor(c);
  const url = c.verify_url ?? reg?.url ?? null;
  const kind: VerifyKind = c.verify_kind ?? (reg ? "search" : "none");
  const label =
    (lang === "es" ? c.verify_label_es : c.verify_label_en) ??
    (reg
      ? lang === "es"
        ? `Verificar «${title(c, "es")}» en ${reg.name_es ?? reg.name_en}`
        : `Verify ${title(c, "en")} in the ${reg.name_en}`
      : null);
  const instructions =
    (lang === "es" ? c.verify_instructions_es : c.verify_instructions_en) ??
    (reg ? (lang === "es" ? reg.search_terms_es : reg.search_terms_en) : null) ??
    null;

  return { url, kind, label, instructions, registry: reg };
}

/** True when this credential has a live third-party link a stranger can click. */
export function hasLiveVerification(c: Credential): boolean {
  if (c.verify_status === "pending") return false;
  return Boolean(verification(c, "en").url);
}

const CONFERRED_STATUSES = new Set(["conferred", "active"]);

export function isConferred(c: Credential): boolean {
  return CONFERRED_STATUSES.has(c.status);
}

/** Distinct programmes: a dual-issued title collapses into its group. */
function programmeKey(c: Credential): string {
  return c.dual_issue_group ?? c.id;
}

function countProgrammes(list: Credential[]): number {
  return new Set(list.map(programmeKey)).size;
}

const universityDegrees = CREDENTIALS.filter((c) => c.counts_as_university_degree);
const argentineRegistryDegrees = universityDegrees.filter(
  (c) => c.registry === "registrograduados",
);
const internationalDegrees = universityDegrees.filter(
  (c) => c.registry !== "registrograduados",
);
const professionalCerts = CREDENTIALS.filter(
  (c) => c.category === "certification" && c.cert_kind === "professional",
);
/** Records that actually assert a credential, so need a verification route. */
const CLAIMED = CREDENTIALS.filter((c) => c.category !== "coursework_not_conferred");
const academicCerts = CREDENTIALS.filter(
  (c) => c.category === "certification" && c.cert_kind === "academic",
);

/**
 * Every headline number the site is allowed to print.
 *
 * `internationalDegreeTitles` vs `internationalDegreeProgrammes` is the whole
 * point of the exercise: four titles were issued, but two of them are one
 * dual-issued programme, so the programme count is what goes in any total.
 */
export const TOTALS = {
  argentineRegistryDegrees: argentineRegistryDegrees.length,
  internationalDegreeTitles: internationalDegrees.length,
  internationalDegreeProgrammes: countProgrammes(internationalDegrees),
  universityDegreeProgrammes: countProgrammes(universityDegrees),
  universityDegreeTitles: universityDegrees.length,

  doctorates: inCategory("doctorate").length,
  postgraduateInternational: inCategory("postgraduate_international").length,
  postgraduateArgentina: inCategory("postgraduate_argentina").length,
  undergraduate: inCategory("undergraduate").length,
  tertiaryNonUniversity: inCategory("tertiary_non_university").length,
  courseworkNotConferred: inCategory("coursework_not_conferred").length,

  legalAdmissions: inCategory("legal_admission").length,
  professionalLicences: inCategory("professional_licence").length,
  professionalCertifications: professionalCerts.length,
  academicCertifications: academicCerts.length,

  apostilled: CREDENTIALS.filter((c) => c.apostille).length,
  withEnglishTranslation: CREDENTIALS.filter((c) => c.english_translation).length,

  countriesOfStudy: new Set(
    universityDegrees.concat(inCategory("tertiary_non_university")).map((c) => c.country),
  ).size,

  /**
   * Verification coverage — what VERIFICATION_REPORT.md reports on.
   *
   * The denominator is credential CLAIMS. The coursework-only records are
   * excluded because they assert the opposite of a credential ("I completed
   * the coursework, no degree was conferred"); counting them as unverifiable
   * would understate coverage for being more honest, which is backwards.
   */
  verifiable: CLAIMED.filter(hasLiveVerification).length,
  total: CLAIMED.length,
  noPublicRegistry: CLAIMED.filter((c) => c.no_public_registry).length,
  verificationPending: CLAIMED.filter((c) => c.verify_status === "pending").length,
};

/** Academic levels, most senior first, for the degrees page. */
export const DEGREE_LEVEL_ORDER = ["doctorado", "master", "posgrado", "grado", "pregrado", "terciario"];

/**
 * Every academic title grouped by level. Includes the non-university tertiary
 * titles, which are labelled as such rather than hidden — the honest
 * explanation of the count is more persuasive than a bigger number.
 */
export function academicTitlesByLevel(): { level: string; items: Credential[] }[] {
  const academic = CREDENTIALS.filter((c) => c.level && c.category !== "certification");
  return DEGREE_LEVEL_ORDER.map((level) => ({
    level,
    items: academic
      .filter((c) => c.level === level)
      .sort((a, b) => (b.conferred ?? "").localeCompare(a.conferred ?? "")),
  })).filter((g) => g.items.length > 0);
}

/** The order the verification page renders sections in. */
export const SECTION_ORDER: Category[] = [
  "legal_admission",
  "professional_licence",
  "doctorate",
  "postgraduate_international",
  "postgraduate_argentina",
  "undergraduate",
  "tertiary_non_university",
  "certification",
  "coursework_not_conferred",
];

export const SECTION_LABELS: Record<Category, { en: string; es: string }> = {
  legal_admission: { en: "Legal admissions", es: "Admisiones legales" },
  professional_licence: { en: "Professional licences", es: "Matrículas profesionales" },
  doctorate: { en: "Doctorate", es: "Doctorado" },
  postgraduate_international: {
    en: "Postgraduate degrees (international)",
    es: "Posgrados (internacionales)",
  },
  postgraduate_argentina: {
    en: "Postgraduate degrees (Argentina)",
    es: "Posgrados (Argentina)",
  },
  undergraduate: {
    en: "University degrees (grado and pregrado)",
    es: "Títulos universitarios (grado y pregrado)",
  },
  tertiary_non_university: {
    en: "Non-university tertiary titles",
    es: "Títulos terciarios no universitarios",
  },
  certification: { en: "Professional certifications", es: "Certificaciones profesionales" },
  coursework_not_conferred: {
    en: "Coursework completed, no degree conferred",
    es: "Cursada completa, sin título otorgado",
  },
};

export const COUNTRY_LABELS: Record<string, { flag: string; en: string; es: string }> = {
  AR: { flag: "🇦🇷", en: "Argentina", es: "Argentina" },
  US: { flag: "🇺🇸", en: "United States", es: "Estados Unidos" },
  ES: { flag: "🇪🇸", en: "Spain", es: "España" },
  PR: { flag: "🇵🇷", en: "Puerto Rico", es: "Puerto Rico" },
};

export const LEVEL_LABELS: Record<string, { en: string; es: string }> = {
  doctorado: { en: "Doctorate", es: "Doctorado" },
  master: { en: "Master's", es: "Maestría" },
  posgrado: { en: "Postgraduate specialisation", es: "Especialización de posgrado" },
  grado: { en: "University degree (grado)", es: "Título de grado" },
  pregrado: { en: "Intermediate university title (pregrado)", es: "Título universitario intermedio (pregrado)" },
  terciario: { en: "Non-university tertiary", es: "Terciario no universitario" },
};

const MONTHS: Record<Lang, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
};

/**
 * Formats an ISO date without going through Date(), which would shift a
 * midnight-UTC date across the international date line and silently print the
 * day before. These are conferral dates; being off by one is not acceptable.
 */
export function formatDate(iso: string | null | undefined, lang: Lang): string {
  if (!iso) return lang === "es" ? "fecha por confirmar" : "date to be confirmed";
  const [y, m, d] = iso.split("-");
  if (!m) return y;
  const month = MONTHS[lang][Number(m) - 1];
  if (!d) return lang === "es" ? `${month} de ${y}` : `${month} ${y}`;
  return lang === "es" ? `${Number(d)} de ${month} de ${y}` : `${Number(d)} ${month} ${y}`;
}

export function credentialPath(c: Credential, lang: Lang): string {
  return lang === "es" ? `/verificacion/${c.id}` : `/verification/${c.id}`;
}
