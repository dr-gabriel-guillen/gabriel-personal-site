#!/usr/bin/env node
/**
 * Copies the canonical credential PDFs out of the private Google Drive folder
 * into public/documents/, named by credential id.
 *
 * Gabriel decided to publish the documents in full, unredacted, after being
 * shown what they contain (national ID, date and place of birth, university
 * student IDs, signatures). That is his call and this script implements it.
 *
 * Two things it still does NOT do, because they are not redaction:
 *
 *  1. Filenames. Four source PDFs are named after the national ID, which would
 *     put it in the URL, in server and CDN logs, in Referer headers and in
 *     analytics — places that outlive the page itself. Every file is renamed to
 *     its credential id instead. The document content is untouched.
 *  2. Overwrite blindly. It reports size and skips nothing silently.
 *
 *   node scripts/import-documents.mjs          # copy
 *   node scripts/import-documents.mjs --dry    # report only
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const SOURCE_ROOT =
  process.env.CREDENTIAL_DOCS_ROOT ??
  "G:/Other computers/My Laptop/Google Drive/TitulosNuevaCarpeta";

const OUT_DIR = resolve("public/documents");
const dry = process.argv.includes("--dry");

/**
 * credential id -> canonical source PDF, relative to SOURCE_ROOT.
 * The "Completos" files are the merged packages: diploma + academic transcript
 * + apostille + certified translation in one document.
 */
const DOCS = {
  "psico-social": "Completos/01_Social_Psycology_Practitioner.pdf",
  "eng-unlam": "Completos/02_ComputerEngineer.pdf",
  "cpn-unq": "Completos/03_CPA_degree.pdf",
  "lic-adm-unq": "Completos/04_Business_bachelor.pdf",
  "esp-hys-moron": "Completos/05_Specialist_Safety.pdf",
  "prof-mat-unrn": "Completos/06_Teacher_Degree.pdf",
  "master-uneatlantico": "Completos/07_master_IT.pdf",
  "traductor-tecnico": "Completos/08_Technical_Translator.pdf",
  "abogado-uncaus": "Completos/09_Attorney.pdf",
  "esp-petro-unsam": "Completos/10_petro_chemical.pdf",
  "esp-dev-unq": "Completos/11_Online_education_degree.pdf",
  "phd-unlam": "Completos/12_PHD.pdf",
  "martillero-ues21": "Completos/13_broker_degree.pdf",
  "escribano-ues21": "Completos/14_notarial_degree.pdf",
  "traductor-publico-ucu": "Completos/15_public_translator.pdf",
  "alm-harvard": "Master Ciencia de Datos/_Harvard_full.pdf",
  "msfe-lehigh": "Master Ingenieria Financiera/_lehigh_full.pdf",
  "maestria-unini": "Titulo Unini/MBA_full.pdf",
};

const inventory = JSON.parse(readFileSync(resolve("data/credentials.json"), "utf8"));
const known = new Set(inventory.credentials.map((c) => c.id));

const unknown = Object.keys(DOCS).filter((id) => !known.has(id));
if (unknown.length) {
  console.error(`✖ unknown credential ids in DOCS: ${unknown.join(", ")}`);
  process.exit(1);
}

if (!dry) mkdirSync(OUT_DIR, { recursive: true });

const results = [];
let missing = 0;
let bytes = 0;

for (const [id, rel] of Object.entries(DOCS)) {
  const src = join(SOURCE_ROOT, rel);
  if (!existsSync(src)) {
    console.error(`  ✗ MISSING  ${id}  <-  ${rel}`);
    missing++;
    continue;
  }
  const size = statSync(src).size;
  bytes += size;
  const dest = join(OUT_DIR, `${id}.pdf`);
  if (!dry) copyFileSync(src, dest);
  results.push({ id, size });
  console.log(
    `  ${dry ? "would copy" : "copied"}  ${id}.pdf  ${(size / 1024 / 1024).toFixed(1)} MB`,
  );
}

// A manifest so the site knows which credentials have a document without
// probing the filesystem at render time.
const manifest = Object.fromEntries(
  results.map((r) => [r.id, { path: `/documents/${r.id}.pdf`, bytes: r.size }]),
);
if (!dry) {
  writeFileSync(
    resolve("data/documents.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
}

const withoutDocs = [...known].filter(
  (id) => !DOCS[id] && !["maestria-educacion-unq", "maestria-filosofia-unq"].includes(id),
);

console.log(
  `\n${dry ? "[dry run] " : ""}import-documents: ${results.length} documents, ` +
    `${(bytes / 1024 / 1024).toFixed(0)} MB total${missing ? `, ${missing} MISSING` : ""}.`,
);
console.log(
  `  ${withoutDocs.length} credentials have no document on file: ${withoutDocs.join(", ")}`,
);

if (missing) process.exit(1);
