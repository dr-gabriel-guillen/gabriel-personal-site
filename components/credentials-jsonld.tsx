/**
 * Structured data for the credential record.
 *
 * This is what lets Google, and any AI system answering "who is Gabriel
 * Guillen", surface the verified record instead of the name collisions. One
 * stable Person node, one EducationalOccupationalCredential per credential
 * pointing at its verification URL, and alumniOf for each institution.
 *
 * Emitted server-side so it survives with JavaScript disabled.
 */
import {
  COUNTRY_LABELS,
  CREDENTIALS,
  type Credential,
  type Lang,
  credentialPath,
  hasLiveVerification,
  title,
  verification,
} from "@/lib/credentials";
import { ALTERNATE_NAMES, CANONICAL_NAME, PERSON_ID, SITE } from "@/lib/seo";
import { META } from "@/lib/credentials";

type Node = Record<string, unknown>;

const CATEGORY_LABEL: Record<string, string> = {
  legal_admission: "Professional license",
  professional_licence: "Professional license",
  certification: "Professional certification",
  doctorate: "Doctorate degree",
  postgraduate_international: "Postgraduate degree",
  postgraduate_argentina: "Postgraduate degree",
  undergraduate: "University degree",
  tertiary_non_university: "Non-university tertiary title",
};

/** A link that is specifically about this one credential, not a search form. */
function isDeepLink(c: Credential): boolean {
  return hasLiveVerification(c) && c.verify_kind === "deep_link";
}

/** Stable @id for an institution so alumniOf and recognizedBy point at one node. */
function orgId(institution: string): string {
  const slug = institution
    .toLowerCase()
    .normalize("NFD")
    // Combining diacritics, written as escapes so the slug is not at the mercy
    // of this file's encoding.
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  return `${SITE}/#org-${slug}`;
}

function organizationNodes(creds: Credential[]): Node[] {
  const seen = new Map<string, Node>();
  for (const c of creds) {
    const id = orgId(c.institution);
    if (seen.has(id)) continue;
    const node: Node = {
      "@type": c.category === "certification" ? "Organization" : "CollegeOrUniversity",
      "@id": id,
      name: c.institution,
    };
    if (c.institution_url) node.url = c.institution_url;
    seen.set(id, node);
  }
  return [...seen.values()];
}

function credentialNode(c: Credential, lang: Lang): Node {
  const v = verification(c, lang);
  const node: Node = {
    "@type": "EducationalOccupationalCredential",
    "@id": `${SITE}${credentialPath(c, "en")}#credential`,
    name: title(c, lang),
    url: `${SITE}${credentialPath(c, lang)}`,
    credentialCategory: CATEGORY_LABEL[c.category] ?? "Credential",
    recognizedBy: { "@id": orgId(c.institution) },
  };
  if (c.conferred) node.dateCreated = c.conferred;
  if (c.expires) node.expires = c.expires;
  if (c.country) {
    node.validIn = { "@type": "Country", name: COUNTRY_LABELS[c.country]?.en ?? c.country };
  }
  if (c.registry_number) node.identifier = c.registry_number;
  // sameAs means "another page about this same thing", so it only gets deep
  // links. A registry's name-search form is not a page about this credential,
  // and pointing 17 credentials at the same search URL would be noise.
  if (isDeepLink(c) && v.url) node.sameAs = v.url;
  const desc = lang === "es" ? c.public_note_es : c.public_note_en;
  if (desc) node.description = desc;
  return node;
}

export function CredentialsJsonLd({
  lang,
  only,
}: {
  lang: Lang;
  /** Restrict the credential list to one record, for per-credential pages. */
  only?: Credential;
}) {
  const creds = only ? [only] : CREDENTIALS;

  // Third-party pages that identify this same person by name — a Credly badge,
  // the Cal Bar record, the translators' association profile. Registry search
  // forms are excluded: they are not pages about him.
  const verifiedLinks = CREDENTIALS.filter(isDeepLink)
    .map((c) => verification(c, "en").url)
    .filter((u): u is string => Boolean(u));

  const person: Node = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: CANONICAL_NAME,
    alternateName: ALTERNATE_NAMES,
    url: SITE,
    jobTitle: lang === "es" ? "Abogado" : "Attorney at Law",
    worksFor: { "@type": "Organization", name: "Guillen-Gonzalez Law PC", url: META.firm_url },
    sameAs: [...new Set([...(META.same_as as string[]), ...verifiedLinks])],
    alumniOf: [
      ...new Set(
        CREDENTIALS.filter((c) => c.counts_as_university_degree).map((c) =>
          orgId(c.institution),
        ),
      ),
    ].map((id) => ({ "@id": id })),
    hasCredential: CREDENTIALS.map((c) => ({
      "@id": `${SITE}${credentialPath(c, "en")}#credential`,
    })),
  };

  const graph: Node[] = [
    person,
    ...organizationNodes(CREDENTIALS),
    ...creds.map((c) => credentialNode(c, lang)),
  ];

  // When rendering a single credential, still emit the full credential list so
  // the Person node's hasCredential references resolve inside the graph.
  if (only) {
    const extra = CREDENTIALS.filter((c) => c.id !== only.id).map((c) =>
      credentialNode(c, lang),
    );
    graph.push(...extra);
  }

  return (
    <script
      type="application/ld+json"
      // Data comes from a checked-in JSON file, never from user input.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(
          /</g,
          "\\u003c",
        ),
      }}
    />
  );
}
