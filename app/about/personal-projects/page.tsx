import type { Metadata } from "next";
import Link from "next/link";
import { TOTALS } from "@/lib/credentials";
import { CANONICAL_NAME, SITE } from "@/lib/seo";

/**
 * Personal projects.
 *
 * The Guinness World Record material used to sit on the home page — a badge in
 * the hero, a full section, and a line in the site description. Guinness does
 * not publish its applicant pipeline, so the claim cannot be checked in either
 * direction, and an unverifiable claim on the primary professional page taints
 * the verifiable ones next to it. It lives here instead, framed as what it is.
 */
export const metadata: Metadata = {
  title: `Personal projects — ${CANONICAL_NAME}`,
  description:
    "Personal projects, including a long-running effort to document a large number of university degrees to Guinness World Records evidentiary standards.",
  alternates: { canonical: `${SITE}/about/personal-projects` },
  robots: { index: true, follow: true },
};

export default function PersonalProjectsPage() {
  return (
    <div className="pt-20">
      <section className="border-b border-border bg-navy-mid px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
            Personal projects
          </p>
          <h1 className="mt-5 font-display text-5xl font-bold leading-tight text-cream">
            Things I do outside the practice
          </h1>
          <p className="mt-6 text-lg leading-9 text-cream-dim">
            Kept separate from the professional pages on purpose. Nothing here is
            a professional credential and none of it is offered as one.
          </p>
        </div>
      </section>

      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-cream">
            Documenting the degrees
          </h2>
          <div className="mt-5 space-y-5 text-base leading-9 text-cream-dim">
            <p>
              Over about fifteen years I accumulated an unusual number of
              university degrees. At some point the interesting problem stopped
              being the studying and became the paperwork: proving, to an
              evidentiary standard, that each one exists.
            </p>
            <p>
              That meant a repeatable pipeline per degree — the original diploma,
              a Hague apostille, a certified English translation, the
              translators&rsquo; association certification of that translation,
              and in several cases a second apostille over the certification.{" "}
              {TOTALS.apostilled} of the titles have been through the apostille
              stage.
            </p>
            <p>
              I have been assembling that documentation with a Guinness World
              Records submission in mind, in the &ldquo;most university
              degrees&rdquo; category. I want to be precise about the status of
              that, because it is the one claim on this site that cannot be
              checked: <strong className="text-cream">it is an intention, not
              an achievement.</strong> Guinness does not publish its applicant
              pipeline, so no third party can confirm or refute a claim to be a
              candidate — which is exactly why it does not belong next to
              credentials that <em>can</em> be confirmed. If a record is ever
              awarded, there will be a Guinness page to link to, and it will be
              linked from here.
            </p>
            <p>
              The genuinely verifiable version of the underlying claim is on the
              verification page:{" "}
              <strong className="text-cream">
                {TOTALS.argentineRegistryDegrees} university degrees recorded in
                Argentina&rsquo;s Registro Público de Graduados Universitarios
              </strong>
              , searchable by name, plus {TOTALS.internationalDegreeProgrammes}{" "}
              international postgraduate programmes.
            </p>
          </div>

          <Link
            href="/verification"
            className="mt-8 inline-block border border-gold/60 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold/10"
          >
            See the verifiable record →
          </Link>
        </div>
      </section>
    </div>
  );
}
