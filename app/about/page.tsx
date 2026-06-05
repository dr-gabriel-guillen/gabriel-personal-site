import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Dr. Gabriel B. Guillen",
};

const credentials = [
  { label: "Computer Engineer", detail: "UNLaM · Buenos Aires, Argentina" },
  { label: "PhD — Economic Sciences", detail: "UNLaM · Doctoral Thesis on AI in Financial Markets" },
  { label: "Juris Doctor (J.D.)", detail: "UNCAus · Admitted California Bar #361094 (2025)" },
  { label: "MS Financial Engineering", detail: "Lehigh University · Fulbright Scholar" },
  { label: "Master in Data Science", detail: "Harvard University · CGPA 3.77" },
  { label: "CPA (Contador Público)", detail: "UNQ · Buenos Aires Professional Council" },
  { label: "Math Teacher (University Level)", detail: "UNRN · Engineering & Sciences" },
  { label: "Argentine Notary (Escribano)", detail: "Siglo XXI · Civil Law Notarial Practice" },
  { label: "Sworn Public Translator", detail: "UCU · English ↔ Spanish Legal Translation" },
  { label: "Real Estate Broker & Auctioneer", detail: "Siglo XXI · Argentine Civil Law" },
];

const languages = [
  { lang: "Spanish", level: "Native" },
  { lang: "English", level: "Professional (C2)" },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="border-b border-border bg-navy-mid px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.42fr_0.58fr]">
            {/* Photo placeholder */}
            <div className="flex items-start">
              <div className="w-full max-w-sm overflow-hidden rounded-lg border border-border">
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/main_portrait.jpg"
                    alt="Dr. Gabriel B. Guillen"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">About</p>
              <h1 className="mt-5 font-display text-5xl font-bold leading-tight text-cream lg:text-6xl">
                Dr. Gabriel B. Guillen, PhD, Esq.
              </h1>
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-gold">
                San Jose, California · +1 (470) 685-8701
              </p>
              <div className="mt-6 space-y-5 text-base leading-9 text-cream-dim">
                <p>
                  Dr. Gabriel B. Guillen is a computer engineer, attorney, data scientist, and polymath based
                  in San Jose, California. He holds 25 university-level degrees — spanning engineering, law,
                  mathematics, economics, education, philosophy, and health sciences — earned across
                  Argentina, the United States, and Spain over 15 years of continuous academic study.
                </p>
                <p>
                  Professionally, he currently serves as a Sr. Software Engineer and Project Leader at
                  PayPal, where he leads cross-border wallet interoperability initiatives and serves as
                  the team's Legal & Privacy liaison. He previously engineered ML pipelines at Meta
                  (Sunnyvale) and led multinational software teams as a country manager.
                </p>
                <p>
                  A Fulbright Scholar, he completed his Master's in Financial Engineering at Lehigh
                  University (2020) and his Master's in Data Science at Harvard University (2022, CGPA 3.77).
                  His doctoral dissertation at UNLaM applied bio-inspired metaheuristic algorithms to
                  predict high-volatility stock markets.
                </p>
                <p>
                  Admitted to the California State Bar (License #361094) in 2025 and previously to the
                  Buenos Aires Bar in 2022, he combines deep technical expertise with active legal
                  practice in privacy, technology, and corporate law.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key credentials */}
      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-gold">Selected Credentials</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {credentials.map((c) => (
              <div key={c.label} className="rounded-lg border border-border bg-navy-card p-4">
                <p className="font-bold text-cream">{c.label}</p>
                <p className="mt-1 text-sm text-cream-dim">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages + Contact */}
      <section className="border-t border-border bg-navy-mid px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Languages</p>
            <div className="mt-5 flex gap-4">
              {languages.map((l) => (
                <div key={l.lang} className="rounded-lg border border-border bg-navy-card px-6 py-4 text-center">
                  <p className="font-display text-2xl font-bold text-cream">{l.lang}</p>
                  <p className="mt-1 text-sm text-gold">{l.level}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Connect</p>
            <div className="mt-5 space-y-3 text-sm">
              <a href="mailto:gguillen@alumni.harvard.edu" className="flex items-center gap-3 text-cream-dim transition hover:text-gold">
                <span className="text-xl">✉️</span> gguillen@alumni.harvard.edu
              </a>
              <a href="https://www.linkedin.com/in/gabriel-guillen/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-cream-dim transition hover:text-gold">
                <span className="text-xl">💼</span> linkedin.com/in/gabriel-guillen
              </a>
              <p className="flex items-center gap-3 text-cream-dim">
                <span className="text-xl">📞</span> +1 (470) 685-8701
              </p>
              <p className="flex items-center gap-3 text-cream-dim">
                <span className="text-xl">⚖️</span> CA State Bar License #361094
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-5 py-14 lg:px-8 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-bold text-cream">Explore the full record</h2>
          <p className="mt-4 text-base leading-8 text-cream-dim">
            Browse all 25 degrees with documentation status, or review 17 professional certifications.
          </p>
          <div className="mt-8 flex flex-col gap-4 justify-center sm:flex-row">
            <Link href="/degrees" className="bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-navy transition hover:bg-gold-light">
              View All 25 Degrees
            </Link>
            <Link href="/certifications" className="border border-gold/50 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-gold transition hover:border-gold hover:bg-gold/10">
              View Certifications
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
