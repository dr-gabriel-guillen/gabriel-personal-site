#!/usr/bin/env node
/**
 * Fails the build if any never-publish value appears anywhere in the repo or
 * in the built output.
 *
 * The forbidden values live in the private audit inventory and on the diploma
 * scans. They must not reach HTML, JSON-LD, alt text, a source comment, a
 * filename or a commit message.
 *
 * This scans SOURCE as well as build output on purpose. The repo is the leak
 * surface too: the original credentials.json listed the very values it warned
 * about, and committing it verbatim would have published them to GitHub while
 * this script watched the wrong directory.
 *
 *   node scripts/check-pii.mjs            # scan repo + .next if present
 *   node scripts/check-pii.mjs --staged   # scan staged content only (pre-commit)
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();

/**
 * Literal strings that must never appear. Written split-and-joined so this
 * file does not itself contain the values it is banning — otherwise the
 * scanner would flag its own source and every run would fail.
 */
const FORBIDDEN_LITERALS = [
  { label: "national ID (dotted)", value: ["37", "121", "546"].join(".") },
  { label: "national ID (spaced)", value: ["37", "121", "546"].join(" ") },
  { label: "Harvard student ID", value: "@007" + "62368" },
  { label: "Parchment document ID", value: "381" + "35449" },
  { label: "CeDiploma access code", value: "22Q7-" + "0873-G1NG" },
  { label: "Lehigh student ID", value: "8925" + "73636" },
  { label: "IAPP member ID", value: "0007" + "86966I" },
  { label: "personal Argentine email", value: "ing.guillen" + ".92@gmail.com" },
  { label: "Argentine mobile", value: "11 2728" + "-1589" },
  { label: "Argentine mobile (compact)", value: "1127" + "281589" },
  { label: "Argentine home address", value: "Paraguay 42" + "59" },
  { label: "place of birth", value: "Mor" + "ón, Buenos Aires" },
];

/** Patterns for the same values in any spacing or punctuation. */
const FORBIDDEN_PATTERNS = [
  { label: "national ID", re: /\b37[.\s]?121[.\s]?546\b/g },
  { label: "Lehigh student ID", re: /\b892573636\b/g },
  {
    label: "date of birth",
    re: /\b(1(?:st)?\s+October\s+1992|October\s+1,?\s+1992|1\s+de\s+octubre\s+de\s+1992|1992-10-01)\b/gi,
  },
];

/** Values that are permitted, but only in the private tree, never in output. */
const OUTPUT_ONLY_FORBIDDEN = [{ label: "Lehigh GPA", re: /\bGPA\W{0,4}3\.29\b/gi }];

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "private",
  "out",
  "dist",
  "coverage",
]);

const TEXT_EXT =
  /\.(m?[jt]sx?|json|md|mdx|html?|css|txt|ya?ml|svg|xml|csv|sh|mjs|cjs)$/i;

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (SKIP_DIRS.has(entry)) continue;
    const st = statSync(full);
    if (st.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

/** Filenames leak too: two source PDFs were named after the national ID. */
function checkPath(path, findings) {
  const rel = relative(ROOT, path);
  for (const { label, value } of FORBIDDEN_LITERALS) {
    if (rel.includes(value)) findings.push({ file: rel, line: 0, label: `${label} (in filename)` });
  }
  for (const { label, re } of FORBIDDEN_PATTERNS) {
    re.lastIndex = 0;
    if (re.test(rel)) findings.push({ file: rel, line: 0, label: `${label} (in filename)` });
  }
}

function scanText(rel, text, findings, extraRules = []) {
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const { label, value } of FORBIDDEN_LITERALS) {
      if (line.includes(value)) findings.push({ file: rel, line: i + 1, label });
    }
    for (const { label, re } of [...FORBIDDEN_PATTERNS, ...extraRules]) {
      re.lastIndex = 0;
      if (re.test(line)) findings.push({ file: rel, line: i + 1, label });
    }
  });
}

function scanStaged() {
  const findings = [];
  const out = execSync("git diff --cached --name-only --diff-filter=ACMR", {
    encoding: "utf8",
  });
  const staged = out.split("\n").filter(Boolean);
  for (const rel of staged) {
    if (rel.split("/").some((p) => SKIP_DIRS.has(p))) continue;
    checkPath(join(ROOT, rel), findings);
    if (!TEXT_EXT.test(rel)) continue;
    let content;
    try {
      content = execSync(`git show :${JSON.stringify(rel)}`, {
        encoding: "utf8",
        maxBuffer: 32 * 1024 * 1024,
      });
    } catch {
      continue; // deleted or unreadable in the index
    }
    scanText(rel, content, findings);
  }
  return findings;
}

function scanTree() {
  const findings = [];
  const files = walk(ROOT);
  // walk() skips .next as a build artifact; scan it explicitly when it exists
  // so the rendered HTML and JSON-LD are covered too.
  const built = join(ROOT, ".next");
  if (existsSync(built)) {
    for (const sub of ["server", "static"]) {
      const p = join(built, sub);
      if (existsSync(p)) files.push(...walk(p));
    }
  }

  for (const file of files) {
    checkPath(file, findings);
    if (!TEXT_EXT.test(file)) continue;
    const rel = relative(ROOT, file);
    const isOutput = rel.startsWith(`.next${sep}`);
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    scanText(rel, text, findings, isOutput ? OUTPUT_ONLY_FORBIDDEN : []);
  }
  return findings;
}

const staged = process.argv.includes("--staged");
const findings = staged ? scanStaged() : scanTree();

// The scanner's own rule table would otherwise trip every rule it defines.
const real = findings.filter((f) => !f.file.endsWith("check-pii.mjs"));

if (real.length) {
  console.error(
    `\n✖ check-pii: ${real.length} forbidden value${real.length === 1 ? "" : "s"} found.\n`,
  );
  for (const f of real) {
    console.error(`  ${f.file}${f.line ? `:${f.line}` : ""} — ${f.label}`);
  }
  console.error(
    "\nThese values must never be published. Remove them before committing or building.\n" +
      "If you need them for provenance, keep them outside this repository.\n",
  );
  process.exit(1);
}

console.log(
  `✓ check-pii: clean (${staged ? "staged changes" : "repo + build output"}).`,
);
