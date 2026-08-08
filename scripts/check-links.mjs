#!/usr/bin/env node
/**
 * HTTP-checks every verification URL and reports dead ones.
 *
 * Runs weekly in CI, NOT on every build: several of these registries rate-limit
 * and one sits behind a reCAPTCHA. A verification page whose links have rotted
 * is worse than no verification page, so this is the watchdog.
 *
 * Exits non-zero only on hard failures (DNS, connection, 4xx/5xx). A 403 from a
 * registry that dislikes robots is reported but tolerated — those pages work
 * fine for a human, which is who they are for.
 *
 *   node scripts/check-links.mjs
 *   node scripts/check-links.mjs --strict   # treat tolerated responses as failures
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const doc = JSON.parse(readFileSync(join(process.cwd(), "data", "credentials.json"), "utf8"));
const strict = process.argv.includes("--strict");
const TIMEOUT_MS = 20_000;

/** Hosts known to reject automated requests while serving humans normally. */
const BOT_HOSTILE = [/cpacf\.org\.ar$/i, /cponline\.org\.ar$/i, /calbar\.ca\.gov$/i];

const targets = new Map();

/**
 * `critical` marks a URL the verification page actually sends a reader to.
 * Institution homepages are context links, not verification routes, so a
 * university that blocks bots must not fail the build.
 */
function add(url, label, critical) {
  if (!url) return;
  if (!targets.has(url)) targets.set(url, { labels: [], critical: false });
  const t = targets.get(url);
  t.labels.push(label);
  t.critical = t.critical || critical;
}

for (const [key, reg] of Object.entries(doc._meta?.registries ?? {})) {
  add(reg.url, `registry:${key}`, true);
}
for (const c of doc.credentials ?? []) {
  add(c.verify_url, c.id, true);
  add(c.institution_url, `${c.id} (institution)`, false);
}

function tolerated(url, status) {
  const host = new URL(url).hostname;
  return BOT_HOSTILE.some((re) => re.test(host)) && [401, 403, 405, 406, 429].includes(status);
}

async function probe(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const opts = {
    signal: ctrl.signal,
    redirect: "follow",
    headers: {
      // Identify honestly; several registries block blank user agents outright.
      "user-agent":
        "drgabrielguillen.com verification-link-checker (+https://drgabrielguillen.com/verification)",
      accept: "text/html,application/xhtml+xml,*/*",
    },
  };
  try {
    let res = await fetch(url, { ...opts, method: "HEAD" });
    // Plenty of these servers do not implement HEAD properly.
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { ...opts, method: "GET" });
    }
    return { status: res.status, ok: res.ok };
  } catch (err) {
    return { status: 0, ok: false, error: err.name === "AbortError" ? "timeout" : err.message };
  } finally {
    clearTimeout(timer);
  }
}

const results = await Promise.all(
  [...targets.entries()].map(async ([url, { labels, critical }]) => ({
    url,
    labels,
    critical,
    ...(await probe(url)),
  })),
);

results.sort((a, b) => a.url.localeCompare(b.url));

const failures = [];
const warned = [];

for (const r of results) {
  if (r.ok) {
    console.log(`  ✓ ${r.status} ${r.url}`);
  } else if (r.status && tolerated(r.url, r.status) && !strict) {
    warned.push(r);
    console.log(`  ~ ${r.status} ${r.url}  (bot-hostile registry; reachable for humans)`);
  } else if (!r.critical) {
    warned.push(r);
    console.log(`  ~ ${r.status || r.error} ${r.url}  (institution link, not a verification route)`);
  } else {
    failures.push(r);
    console.log(`  ✗ ${r.status || r.error} ${r.url}  [${r.labels.join(", ")}]`);
  }
}

console.log(
  `\ncheck-links: ${results.length} URLs · ${results.length - failures.length - warned.length} ok · ` +
    `${warned.length} tolerated · ${failures.length} failed`,
);

if (failures.length) {
  console.error("\n✖ Dead verification links. A broken link is worse than no link — fix or remove:\n");
  for (const f of failures) console.error(`  ${f.url} — ${f.labels.join(", ")}`);
  process.exit(1);
}
