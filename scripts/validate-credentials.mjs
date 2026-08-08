#!/usr/bin/env node
/**
 * Schema-validates data/credentials.json.
 *
 * The point of this file is that a claim cannot get onto the site without
 * evidence attached. Anything conferred needs either a third-party
 * verification route or an explicit, published acknowledgement that no public
 * registry exists. Silence is not an option the schema permits.
 *
 *   node scripts/validate-credentials.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const DATA = join(process.cwd(), "data", "credentials.json");
const doc = JSON.parse(readFileSync(DATA, "utf8"));

const errors = [];
const warnings = [];

const CATEGORIES = new Set([
  "legal_admission",
  "professional_licence",
  "certification",
  "doctorate",
  "postgraduate_international",
  "postgraduate_argentina",
  "undergraduate",
  "tertiary_non_university",
  "coursework_not_conferred",
]);

/** Levels that make a record a university degree, which must cite a registry. */
const UNIVERSITY_LEVELS = new Set(["doctorado", "master", "posgrado", "grado", "pregrado"]);

/** Categories exempt from needing a conferral date or verification route. */
const NOT_YET_CONFERRED = new Set(["coursework_not_conferred"]);

const ISO_DATE = /^\d{4}(-\d{2}(-\d{2})?)?$/;

const accepted = new Map(
  (doc._meta?.accepted_gaps ?? []).map((g) => [`${g.id}::${g.field}`, g]),
);
const usedGaps = new Set();

function accept(id, field) {
  const key = `${id}::${field}`;
  if (!accepted.has(key)) return false;
  usedGaps.add(key);
  return true;
}

const seen = new Set();
const creds = doc.credentials ?? [];

if (!Array.isArray(creds) || creds.length === 0) {
  errors.push("credentials: must be a non-empty array");
}

for (const [i, c] of creds.entries()) {
  const where = c.id ? `credential "${c.id}"` : `credential #${i}`;

  if (!c.id) {
    errors.push(`${where}: missing id`);
    continue;
  }
  if (seen.has(c.id)) errors.push(`${where}: duplicate id`);
  seen.add(c.id);

  if (!CATEGORIES.has(c.category)) {
    errors.push(`${where}: unknown category "${c.category}"`);
  }
  if (!c.institution) errors.push(`${where}: missing institution`);
  if (!c.title_en && !c.title_es) errors.push(`${where}: needs a title in at least one language`);
  if (typeof c.counts_as_university_degree !== "boolean") {
    errors.push(`${where}: counts_as_university_degree must be an explicit boolean`);
  }
  if (!c.status) errors.push(`${where}: missing status`);

  const exempt = NOT_YET_CONFERRED.has(c.category) || c.status === "unconfirmed";

  // Rule: missing conferral date.
  if (!exempt) {
    if (!c.conferred) {
      if (!accept(c.id, "conferred")) {
        errors.push(`${where}: missing conferral date (add it, or record an accepted_gap)`);
      } else {
        warnings.push(`${where}: conferral date is a tracked gap — ${accepted.get(`${c.id}::conferred`).todo}`);
      }
    } else if (!ISO_DATE.test(c.conferred)) {
      errors.push(`${where}: conferred "${c.conferred}" is not YYYY, YYYY-MM or YYYY-MM-DD`);
    }
  }

  // Rule: a university-level credential must cite the registry that holds it.
  if (UNIVERSITY_LEVELS.has(c.level) && c.counts_as_university_degree) {
    // An institutional digital-diploma validator is the issuer's own record,
    // so it satisfies this rule the same way a public registry does.
    const hasRegistry =
      Boolean(c.registry) ||
      Boolean(c.registry_number) ||
      c.verify_kind === "validator" ||
      c.no_public_registry === true;
    if (!hasRegistry) {
      errors.push(
        `${where}: university-level credential with no registry, no registry_number, no issuer validator and no no_public_registry acknowledgement`,
      );
    }
    if (c.registry && !doc._meta?.registries?.[c.registry]) {
      errors.push(`${where}: registry "${c.registry}" is not defined in _meta.registries`);
    }
  }

  // Rule: conferred with no verification route and no explicit acknowledgement.
  if (!exempt) {
    const routed =
      Boolean(c.verify_url) ||
      Boolean(c.registry) ||
      c.no_public_registry === true ||
      c.verify_status === "pending";
    if (!routed) {
      errors.push(
        `${where}: conferred but has no verify_url, no registry, no verify_status "pending" and no no_public_registry: true`,
      );
    }
    if (c.verify_status === "pending" && !c.internal_note?.includes("TODO(gabriel)")) {
      errors.push(`${where}: verify_status "pending" requires a TODO(gabriel) note saying what closes the gap`);
    }
    if (c.no_public_registry === true && !c.no_public_registry_note_en) {
      errors.push(`${where}: no_public_registry: true requires no_public_registry_note_en to render the honest badge`);
    }
  }

  // Hard constraint 3: never link a prefilled CPACF detail URL.
  if (typeof c.verify_url === "string" && /GuiaAboDetalle/i.test(c.verify_url)) {
    errors.push(`${where}: links a prefilled CPACF detail URL, which exposes home address, mobile and a private email`);
  }
  if (typeof c.verify_url === "string" && !/^https:\/\//.test(c.verify_url)) {
    errors.push(`${where}: verify_url must be https`);
  }

  if (c.dual_issue_group) {
    const partners = creds.filter((o) => o.dual_issue_group === c.dual_issue_group);
    if (partners.length < 2) {
      errors.push(`${where}: dual_issue_group "${c.dual_issue_group}" has only one member`);
    }
  }

  if (c.feature_flag && !c.internal_note?.includes("TODO(gabriel)")) {
    warnings.push(`${where}: gated behind ${c.feature_flag} without a TODO(gabriel) saying what unblocks it`);
  }
}

for (const [key, gap] of accepted) {
  if (!usedGaps.has(key)) {
    warnings.push(`accepted_gap "${key}" no longer applies — remove it from _meta.accepted_gaps (${gap.reason})`);
  }
}

if (doc._meta?.sanitized !== true) {
  errors.push("_meta.sanitized must be true: only the PII-stripped derivative belongs in this repository");
}

for (const w of warnings) console.warn(`  ! ${w}`);

if (errors.length) {
  console.error(`\n✖ validate-credentials: ${errors.length} error${errors.length === 1 ? "" : "s"}.\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error("");
  process.exit(1);
}

console.log(
  `✓ validate-credentials: ${creds.length} credentials valid` +
    (warnings.length ? ` (${warnings.length} tracked gap${warnings.length === 1 ? "" : "s"}).` : "."),
);
