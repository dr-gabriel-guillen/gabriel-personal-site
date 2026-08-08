import type { Metadata } from "next";
import Link from "next/link";
import {
  CREDENTIALS,
  TOTALS,
  credentialPath,
  formatDate,
  title,
  verification,
} from "@/lib/credentials";
import { CANONICAL_NAME, SITE } from "@/lib/seo";

/**
 * Professional certifications.
 *
 * This page previously claimed 17 certifications across AWS, IAPP, PMI and
 * NVIDIA. The audit could evidence 8: six IAPP credentials and two AWS badges.
 *
 * TODO(gabriel): the following were listed here and are NOT in
 * data/credentials.json because no credential ID or badge URL could be found
 * for any of them. They are removed rather than displayed unverified. Supply an
 * ID for any that are real, add it to data/credentials.json, and it renders
 * here automatically — nothing on this page is hardcoded.
 *
 *   - AWS Certified Solutions Architect – Professional
 *   - AWS Certified DevOps Engineer – Professional
 *   - AWS Certified Machine Learning – Specialty
 *   - AWS Certified Security – Specialty
 *   - AWS Certified Advanced Networking – Specialty
 *   - AWS Certified Data Engineer – Associate
 *   - AWS Certified AI Practitioner
 *   - Project Management Professional (PMP), PMI
 *   - NVIDIA Certificate Associate in Generative AI & LLMs
 *
 * Note that none of the seven AWS certifications listed above matches either of
 * the two AWS badges the audit actually verified on Credly.
 */
export const metadata: Metadata = {
  title: `Professional certifications — ${CANONICAL_NAME}`,
  description:
    `${TOTALS.professionalCertifications} current professional certifications, each with an issuer-verified badge or an ` +
    `explicit note on what is still needed to verify it. Privacy (IAPP) and cloud (AWS).`,
  alternates: { canonical: `${SITE}/certifications` },
};

export default function CertificationsPage() {
  const certs = CREDENTIALS.filter((c) => c.category === "certification");
  const byIssuer = new Map<string, typeof certs>();
  for (const c of certs) {
    const key = c.institution;
    if (!byIssuer.has(key)) byIssuer.set(key, []);
    byIssuer.get(key)!.push(c);
  }

  const verified = certs.filter((c) => verification(c, "en").url).length;

  return (
    <div className="pt-20">
      <section className="border-b border-border bg-navy-mid px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
            Professional credentials
          </p>
          <h1 className="mt-5 font-display text-5xl font-bold text-cream lg:text-6xl">
            {TOTALS.professionalCertifications} professional certifications
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-cream-dim">
            Six IAPP privacy and AI-governance credentials and{" "}
            {certs.filter((c) => c.issuer === "AWS").length} AWS certifications.{" "}
            {verified} of {certs.length} carry a live issuer-verified badge you
            can open right now; the rest say plainly what is missing.
          </p>
          <Link
            href="/verification#certification"
            className="mt-8 inline-block border border-gold/60 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold/10"
          >
            Verify these independently →
          </Link>
        </div>
      </section>

      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-12">
          {[...byIssuer.entries()].map(([issuer, group]) => (
            <div key={issuer}>
              <h2 className="mb-5 font-display text-3xl font-bold text-cream">
                {issuer}
                <span className="ml-3 font-sans text-base font-normal text-cream-dim">
                  ({group.length})
                </span>
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {group.map((c) => {
                  const v = verification(c, "en");
                  return (
                    <li
                      key={c.id}
                      className="rounded-lg border border-border bg-navy-card p-5"
                    >
                      <Link
                        href={credentialPath(c, "en")}
                        className="font-bold leading-6 text-cream hover:text-gold"
                      >
                        {title(c, "en")}
                      </Link>
                      <p className="mt-2 text-sm text-cream-dim">
                        {formatDate(c.conferred, "en")}
                        {c.expires ? ` — valid to ${formatDate(c.expires, "en")}` : ""}
                      </p>
                      <p className="mt-3">
                        {v.url ? (
                          <a
                            href={v.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-gold underline underline-offset-4"
                          >
                            {v.label ?? "Verify this certification"} →
                          </a>
                        ) : (
                          <span className="inline-block rounded border border-amber-700/60 bg-amber-900/20 px-2 py-0.5 text-xs font-bold text-amber-300">
                            {c.verify_status === "pending"
                              ? "Verification link pending"
                              : "No public registry"}
                          </span>
                        )}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-navy-mid px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
            Privacy depth
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold text-cream">
            All six principal IAPP credentials
          </h2>
          <p className="mt-5 text-base leading-8 text-cream-dim">
            CIPP certifications for the United States, Europe and Canada, plus
            CIPT for technology, CIPM for programme management and AIGP for AI
            governance. Holding all six simultaneously is unusual, and every one
            of them is issuer-verified rather than self-asserted.
          </p>
          <p className="mt-6 text-sm leading-7 text-cream-dim">
            This page lists only certifications that can be evidenced. Where a
            badge URL has not yet been published, the card says so rather than
            quietly implying the credential is checkable.
          </p>
        </div>
      </section>
    </div>
  );
}
