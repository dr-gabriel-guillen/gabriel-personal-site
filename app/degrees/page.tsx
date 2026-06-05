"use client";
import { useState } from "react";
import Image from "next/image";
import {
  DEGREES,
  DOC_LABELS,
  LEVEL_LABELS,
  STATUS_LABELS,
  type DegreeLevel,
  type DocStatus,
} from "@/components/degrees-data";

const DOC_STEPS: DocStatus[] = [
  "original_spanish",
  "apostille",
  "english_translation",
  "translator_cert",
  "second_apostille",
];

const LEVEL_ORDER: DegreeLevel[] = ["pre_grad", "grad", "specialist", "master", "doctorate"];

const LEVEL_COLORS: Record<DegreeLevel, string> = {
  pre_grad:    "bg-sky-900/50 text-sky-300 border-sky-700",
  grad:        "bg-blue-900/50 text-blue-300 border-blue-700",
  specialist:  "bg-violet-900/50 text-violet-300 border-violet-700",
  master:      "bg-amber-900/50 text-amber-300 border-amber-700",
  doctorate:   "bg-rose-900/50 text-rose-300 border-rose-700",
};

const STATUS_COLORS = {
  in_hand:     "bg-emerald-900/40 text-emerald-300 border-emerald-700",
  processing:  "bg-orange-900/40 text-orange-300 border-orange-700",
  to_collect:  "bg-blue-900/40 text-blue-300 border-blue-700",
  in_progress: "bg-purple-900/40 text-purple-300 border-purple-700",
};

const COUNTRY_FLAG_URLS: Record<string, string> = {
  Argentina: "https://flagcdn.com/w20/ar.png",
  USA:       "https://flagcdn.com/w20/us.png",
  Spain:     "https://flagcdn.com/w20/es.png",
};

function UniversityLogo({ domain, name }: { domain?: string; name: string }) {
  if (!domain) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-navy text-lg">
        🎓
      </div>
    );
  }
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-white p-1">
      <Image
        src={`https://logo.clearbit.com/${domain}`}
        alt={name}
        width={32}
        height={32}
        className="object-contain"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        }}
        unoptimized
      />
    </div>
  );
}

const conferred    = DEGREES.filter((d) => d.status === "in_hand").length;
const fullyDoc     = DEGREES.filter((d) => d.docs.length >= 5).length;
const inProgress   = DEGREES.filter((d) => d.status === "in_progress").length;
const toCollect    = DEGREES.filter((d) => d.status === "to_collect").length;
const processing   = DEGREES.filter((d) => d.status === "processing").length;
// 22 = conferred + processing + to_collect (excludes 3 currently pursuing)
const earnedCount  = DEGREES.filter((d) => d.status !== "in_progress").length;

export default function DegreesPage() {
  const [filterLevel,   setFilterLevel]   = useState<DegreeLevel | "all">("all");
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterStatus,  setFilterStatus]  = useState<string>("all");

  const filtered = DEGREES.filter((d) => {
    if (filterLevel   !== "all" && d.level   !== filterLevel)   return false;
    if (filterCountry !== "all" && d.country !== filterCountry) return false;
    if (filterStatus  !== "all" && d.status  !== filterStatus)  return false;
    return true;
  });

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="border-b border-border bg-navy-mid px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-gold">
            ★ Guinness World Record Candidate
          </div>
          <h1 className="mt-6 font-display text-6xl font-bold text-cream lg:text-7xl">
            {earnedCount} University Degrees
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-cream-dim">
            Earned across Argentina, the United States, and Spain — spanning five academic levels
            from pre-graduate through doctorate. Completed degrees are authenticated through a
            five-step international pipeline for Guinness World Records submission.
            Additionally pursuing {inProgress} more degrees currently in progress.
          </p>
          <div className="mt-8 flex flex-wrap gap-8">
            <div><p className="font-display text-4xl font-bold text-gold">{conferred}</p><p className="mt-1 text-xs text-cream-dim">Conferred</p></div>
            <div><p className="font-display text-4xl font-bold text-gold">{fullyDoc}</p><p className="mt-1 text-xs text-cream-dim">Fully Documented (5/5)</p></div>
            <div><p className="font-display text-4xl font-bold text-gold">{processing}</p><p className="mt-1 text-xs text-cream-dim">Diploma Processing</p></div>
            <div><p className="font-display text-4xl font-bold text-gold">{toCollect}</p><p className="mt-1 text-xs text-cream-dim">Ready to Collect</p></div>
            <div><p className="font-display text-4xl font-bold text-gold">{inProgress}</p><p className="mt-1 text-xs text-cream-dim">Currently Pursuing</p></div>
          </div>
        </div>
      </section>

      {/* Pipeline legend */}
      <section className="border-b border-border bg-navy px-5 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-gold">
            International Documentation Pipeline (Argentine Degrees)
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {[
              "1. Original Diploma (Spanish)",
              "2. Apostille (The Hague)",
              "3. Certified English Translation",
              "4. Translator Assoc. Certification",
              "5. Second Apostille",
            ].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="rounded border border-border bg-navy-card px-3 py-1.5 text-xs text-cream-dim">
                  <span className="mr-1 font-bold text-gold">{i + 1}.</span>
                  {step.slice(3)}
                </div>
                {i < 4 && <span className="text-gold text-xs">→</span>}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-cream-dim">
            US degrees (Lehigh, Harvard, University of the People) are issued in English — no translation pipeline required.
          </p>
        </div>
      </section>

      {/* Status legend */}
      <section className="border-b border-border bg-navy-mid px-5 py-4 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-cream-dim">Status:</span>
          {(Object.entries(STATUS_LABELS) as [keyof typeof STATUS_LABELS, string][]).map(([key, label]) => (
            <div key={key} className={`rounded border px-2 py-0.5 text-xs font-bold ${STATUS_COLORS[key]}`}>
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[73px] z-40 border-b border-border bg-navy/95 px-5 py-3 backdrop-blur-sm lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
          <button
            onClick={() => setFilterLevel("all")}
            className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] transition ${filterLevel === "all" ? "bg-gold text-navy" : "border border-border text-cream-dim hover:border-gold/50 hover:text-gold"}`}
          >
            All Levels
          </button>
          {LEVEL_ORDER.map((l) => (
            <button
              key={l}
              onClick={() => setFilterLevel(l)}
              className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] transition ${filterLevel === l ? "bg-gold text-navy" : "border border-border text-cream-dim hover:border-gold/50 hover:text-gold"}`}
            >
              {LEVEL_LABELS[l]}
            </button>
          ))}

          <div className="ml-auto flex gap-2">
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="rounded border border-border bg-navy-card px-3 py-1.5 text-xs text-cream-dim focus:border-gold focus:outline-none"
            >
              <option value="all">🌍 All Countries</option>
              <option value="Argentina">🇦🇷 Argentina</option>
              <option value="USA">🇺🇸 USA</option>
              <option value="Spain">🇪🇸 Spain</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded border border-border bg-navy-card px-3 py-1.5 text-xs text-cream-dim focus:border-gold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="in_hand">Conferred</option>
              <option value="processing">Diploma Processing</option>
              <option value="to_collect">Ready to Collect</option>
              <option value="in_progress">Currently Pursuing</option>
            </select>
          </div>
          <span className="text-xs text-cream-dim">{filtered.length} shown</span>
        </div>
      </section>

      {/* Degrees list */}
      <section className="px-5 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {LEVEL_ORDER.filter((l) => filterLevel === "all" || filterLevel === l).map((level) => {
            const group = filtered.filter((d) => d.level === level);
            if (group.length === 0) return null;
            return (
              <div key={level} className="mb-10">
                <h2 className="mb-4 font-display text-3xl font-bold text-cream">
                  {LEVEL_LABELS[level]}
                  <span className="ml-3 font-sans text-base font-normal text-cream-dim">({group.length})</span>
                </h2>
                <div className="space-y-3">
                  {group.map((degree) => {
                    // For US degrees we show a different doc indicator
                    const isUsEnglish = degree.country === "USA";
                    const docCount = degree.docs.length;
                    const maxDocs = isUsEnglish ? 1 : 5;

                    return (
                      <div
                        key={degree.id}
                        className="rounded-lg border border-border bg-navy-card p-5 transition hover:border-gold/30"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          {/* Left: logo + info */}
                          <div className="flex min-w-0 flex-1 gap-4">
                            <UniversityLogo domain={degree.universityDomain} name={degree.university} />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-base font-bold leading-snug text-cream">{degree.titleEn}</span>
                                <span className={`shrink-0 rounded border px-2 py-0.5 text-xs font-bold ${LEVEL_COLORS[degree.level]}`}>
                                  {LEVEL_LABELS[degree.level]}
                                </span>
                                <span className={`shrink-0 rounded border px-2 py-0.5 text-xs font-bold ${STATUS_COLORS[degree.status]}`}>
                                  {STATUS_LABELS[degree.status]}
                                </span>
                              </div>

                              <p className="mt-0.5 text-sm italic text-cream-dim">{degree.titleEs}</p>

                              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-cream-dim">
                                <span className="flex items-center gap-1.5">
                                  <img src={COUNTRY_FLAG_URLS[degree.country]} alt={degree.country} width={20} height={14} className="inline-block rounded-sm" />
                                  <span>{degree.university}</span>
                                </span>
                                <span className="font-bold text-gold">
                                  {degree.year ?? (degree.estimatedYear ? `Est. ${degree.estimatedYear}` : "In progress")}
                                </span>
                              </div>

                              {degree.highlights && (
                                <ul className="mt-2 space-y-0.5">
                                  {degree.highlights.map((h) => (
                                    <li key={h} className="flex items-start gap-1.5 text-xs text-cream-dim">
                                      <span className="mt-0.5 text-gold">›</span>{h}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>

                          {/* Right: doc pipeline */}
                          <div className="shrink-0 text-right">
                            <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-cream-dim">
                              Docs
                            </p>
                            {isUsEnglish ? (
                              <div className="flex gap-1.5 justify-end">
                                <div
                                  title="Original English Diploma"
                                  className={`flex h-7 w-7 items-center justify-center rounded-sm text-xs font-bold ${degree.docs.includes("original_english") ? "bg-gold text-navy" : "border border-border bg-navy text-cream-dim opacity-40"}`}
                                >
                                  EN
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-1.5 justify-end">
                                {DOC_STEPS.map((step, i) => {
                                  const has = degree.docs.includes(step);
                                  return (
                                    <div
                                      key={step}
                                      title={DOC_LABELS[step]}
                                      className={`flex h-7 w-7 items-center justify-center rounded-sm text-xs font-bold transition ${has ? "bg-gold text-navy" : "border border-border bg-navy text-cream-dim opacity-40"}`}
                                    >
                                      {i + 1}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            <div className="mt-1 text-xs text-cream-dim">
                              {isUsEnglish
                                ? (degree.docs.includes("original_english") ? "English original" : "Pending")
                                : `${docCount}/5 steps`}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Equivalency */}
      <section className="border-t border-border bg-navy-mid px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">Degree Equivalency</p>
          <h2 className="mt-4 font-display text-3xl font-bold text-cream">
            Argentine Degrees in the U.S. Academic Context
          </h2>
          <div className="mt-6 grid gap-4 text-sm leading-8 text-cream-dim sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Terciario / Pre-Grado", "Equivalent to U.S. Associate's Degree or professional certificate (2–3 years post-secondary)"],
              ["Grado / Licenciatura", "Equivalent to U.S. Bachelor's or Master's degree (4–6 years; thesis often required)"],
              ["Especialización", "Post-graduate specialization; equivalent to U.S. Graduate Certificate (1–2 years)"],
              ["Maestría / Master", "Equivalent to U.S. Master of Arts / Science (2 years; coursework + research project)"],
              ["Doctorado", "Equivalent to U.S. PhD (4–5 years; original research thesis required; evaluated by jury)"],
              ["Authentication Pipeline", "Hague Apostille + certified English translation + translator association cert ensures full international recognition"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded border border-border bg-navy-card p-4">
                <p className="font-bold text-cream">{title}</p>
                <p className="mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
