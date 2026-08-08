/**
 * Canonical naming and hreflang pairing.
 *
 * Two problems this solves.
 *
 * 1. Name collision. "Gabriel Guillén" returns a Middlebury linguistics
 *    professor and "Dr. Gabriel Guillen" returns Latin American physicians.
 *    The accented and full legal forms have to appear in alternateName and in
 *    page metadata or those searches stay lost.
 * 2. Name drift. The California Bar record says Gabriel Guillen-Gonzalez.
 *    Everything published should match it, with Gabriel B. Guillen kept only
 *    as a secondary brand form.
 */
import { META } from "@/lib/credentials";

export const SITE = META.site_url;
export const CANONICAL_NAME = META.canonical_name;
export const ALTERNATE_NAMES = META.alternate_names as string[];
export const PERSON_ID = META.person_id;

/** Every EN route paired with its ES counterpart, for hreflang and toggles. */
export const ROUTE_PAIRS: Record<string, string> = {
  "/verification": "/verificacion",
  "/disambiguation": "/desambiguacion",
};

export function counterpart(path: string): string | null {
  for (const [en, es] of Object.entries(ROUTE_PAIRS)) {
    if (path === en) return es;
    if (path === es) return en;
    if (path.startsWith(`${en}/`)) return `${es}/${path.slice(en.length + 1)}`;
    if (path.startsWith(`${es}/`)) return `${en}/${path.slice(es.length + 1)}`;
  }
  return null;
}

/**
 * Builds `alternates` for a bilingual route. `x-default` points at the English
 * page, which is the one that ranks for the professional queries.
 */
export function alternatesFor(path: string) {
  const other = counterpart(path);
  if (!other) return { canonical: `${SITE}${path}` };
  const isEs = Object.values(ROUTE_PAIRS).some(
    (es) => path === es || path.startsWith(`${es}/`),
  );
  const en = isEs ? other : path;
  const es = isEs ? path : other;
  return {
    canonical: `${SITE}${path}`,
    languages: {
      en: `${SITE}${en}`,
      es: `${SITE}${es}`,
      "x-default": `${SITE}${en}`,
    },
  };
}
