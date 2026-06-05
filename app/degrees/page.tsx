"use client";
import { useState } from "react";
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
  pre_grad: "bg-sky-900/50 text-sky-300 border-sky-700",
  grad: "bg-blue-900/50 text-blue-300 border-blue-700",
  specialist: "bg-violet-900/50 text-violet-300 border-violet-700",
  master: "bg-amber-900/50 text-amber-300 border-amber-700",
  doctorate: "bg-rose-900/50 text-rose-300 border-rose-700",
};

const STATUS_COLORS = {
  in_hand: "bg-emerald-900/40 text-emerald-300 border-emerald-700",
  in_progress: "bg-amber-900/40 text-amber-300 border-amber-700",
  to_collect: "bg-blue-900/40 text-blue-300 border-blue-700",
  estimated: "bg-slate-800 text-slate-400 border-slate-600",
};

const COUNTRY_FLAGS: Record<string, string> = {
  Argentina: "🇦🇷",
  USA: "🇺🇸",
  Spain: "🇪🇸",
};

export default function DegreesPage() {
  const [filterLevel, setFilterLevel] = useState<DegreeLevel | "all">("all");
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = DEGREES.filter((d) => {
    if (filterLevel !== "all" && d.level !== filterLevel) return false;
    if (filterCountry !== "all" && d.country !== filterCountry) return false;
    if (filterStatus !== "all" && d.status !== filterStatus) return false;
    return true;
  });

  const conferred = DEGREES.filter((d) => d.status === "in_hand").length;
  const fullyDoc = DEGREES.filter((d) => d.docs.length === 5).length;

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="border-b border-border bg-navy-mid px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-gold">
            ★ Guinness World Record Candidate
          </div>
          <h1 className="mt-6 font-display text-6xl font-bold text-cream lg:text-7xl">
            25 University Degrees
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-cream-dim">
            Earned across Argentina, the United States, and Spain — spanning five academic levels
            from pre-graduate through doctorate. Each completed degree is being authenticated through
            a five-step international documentation pipeline for Guinness World Records submission.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="text-center">
              <p className="font-display text-4xl font-bold text-gold">{conferred}</p>
              <p className="mt-1 text-xs text-cream-dim">Conferred</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-bold text-gold">{fullyDoc}</p>
              <p className="mt-1 text-xs text-cream-dim">Fully Documented</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-bold text-gold">5</p>
              <p className="mt-1 text-xs text-cream-dim">Doc Steps per Degree</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-bold text-gold">3</p>
              <p className="mt-1 text-xs text-cream-dim">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation pipeline explanation */}
      <section className="border-b border-border bg-navy px-5 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-gold">
            International Documentation Pipeline
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {DOC_STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="rounded border border-border bg-navy-card px-4 py-2 text-xs text-cream-dim">
                  <span className="mr-1.5 font-bold text-gold">{i + 1}.</span>
                  {DOC_LABELS[step]}
                </div>
                {i < DOC_STEPS.length - 1 && <span className="text-gold">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[73px] z-40 border-b border-border bg-navy/95 px-5 py-4 backdrop-blur-sm lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-cream-dim">Filter:</span>

          {/* Level filter */}
          <div className="flex flex-wrap gap-2">
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
          </div>

          <div className="ml-auto flex gap-2">
            {/* Country filter */}
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="rounded border border-border bg-navy-card px-3 py-1.5 text-xs text-cream-dim focus:border-gold focus:outline-none"
            >
              <option value="all">All Countries</option>
              <option value="Argentina">🇦🇷 Argentina</option>
              <option value="USA">🇺🇸 USA</option>
              <option value="Spain">🇪🇸 Spain</option>
            </select>
            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded border border-border bg-navy-card px-3 py-1.5 text-xs text-cream-dim focus:border-gold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="in_hand">Conferred</option>
              <option value="in_progress">In Progress</option>
              <option value="to_collect">To Collect</option>
              <option value="estimated">Estimated</option>
            </select>
          </div>

          <span className="text-xs text-cream-dim">{filtered.length} degrees shown</span>
        </div>
      </section>

      {/* Degrees list */}
      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-4">
          {LEVEL_ORDER.filter((l) => filterLevel === "all" || filterLevel === l).map((level) => {
            const group = filtered.filter((d) => d.level === level);
            if (group.length === 0) return null;
            return (
              <div key={level}>
                <h2 className="mb-4 mt-8 font-display text-3xl font-bold text-cream first:mt-0">
                  {LEVEL_LABELS[level]}
                  <span className="ml-3 font-sans text-base font-normal text-cream-dim">({group.length})</span>
                </h2>
                <div className="space-y-3">
                  {group.map((degree) => (
                    <div
                      key={degree.id}
                      className="rounded-lg border border-border bg-navy-card p-6 transition hover:border-gold/30"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Title */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-lg font-bold text-cream">{degree.titleEn}</span>
                            <span className={`rounded border px-2 py-0.5 text-xs font-bold ${LEVEL_COLORS[degree.level]}`}>
                              {LEVEL_LABELS[degree.level]}
                            </span>
                            <span className={`rounded border px-2 py-0.5 text-xs font-bold ${STATUS_COLORS[degree.status]}`}>
                              {STATUS_LABELS[degree.status]}
                            </span>
                          </div>

                          {/* Spanish title */}
                          <p className="mt-1 text-sm italic text-cream-dim">{degree.titleEs}</p>

                          {/* University + year */}
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-cream-dim">
                            <span>
                              {COUNTRY_FLAGS[degree.country]} {degree.university}
                            </span>
                            <span className="text-gold">
                              {degree.year
                                ? degree.year
                                : degree.estimatedYear
                                ? `Est. ${degree.estimatedYear}`
                                : "In progress"}
                            </span>
                          </div>

                          {/* Highlights */}
                          {degree.highlights && (
                            <ul className="mt-3 space-y-1">
                              {degree.highlights.map((h) => (
                                <li key={h} className="flex items-start gap-2 text-xs text-cream-dim">
                                  <span className="mt-0.5 text-gold">›</span>
                                  {h}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Document pipeline */}
                        <div className="shrink-0">
                          <p className="mb-2 text-right text-xs font-bold uppercase tracking-[0.2em] text-cream-dim">
                            Documentation
                          </p>
                          <div className="flex gap-1.5">
                            {DOC_STEPS.map((step) => {
                              const has = degree.docs.includes(step);
                              return (
                                <div
                                  key={step}
                                  title={DOC_LABELS[step]}
                                  className={`h-6 w-6 rounded-sm text-center text-xs leading-6 transition ${has ? "bg-gold text-navy font-bold" : "border border-border bg-navy text-cream-dim opacity-40"}`}
                                >
                                  {DOC_STEPS.indexOf(step) + 1}
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-1 text-right text-xs text-cream-dim">
                            {degree.docs.length}/5 steps complete
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Equivalency note */}
      <section className="border-t border-border bg-navy-mid px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">Degree Equivalency</p>
          <h2 className="mt-4 font-display text-3xl font-bold text-cream">
            Argentine Degrees in the U.S. Academic Context
          </h2>
          <div className="mt-6 grid gap-6 text-sm leading-8 text-cream-dim sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded border border-border bg-navy-card p-5">
              <p className="font-bold text-cream">Terciario / Pre-Grado</p>
              <p className="mt-1">Equivalent to U.S. Associate's Degree or professional certificate (2–3 years post-secondary study)</p>
            </div>
            <div className="rounded border border-border bg-navy-card p-5">
              <p className="font-bold text-cream">Grado / Licenciatura</p>
              <p className="mt-1">Equivalent to U.S. Bachelor's or Master's degree (4–6 years; Argentine "Licenciatura" often requires a thesis)</p>
            </div>
            <div className="rounded border border-border bg-navy-card p-5">
              <p className="font-bold text-cream">Especialización</p>
              <p className="mt-1">Post-graduate specialization; equivalent to U.S. Graduate Certificate or first Master's-level coursework (1–2 years)</p>
            </div>
            <div className="rounded border border-border bg-navy-card p-5">
              <p className="font-bold text-cream">Maestría / Master</p>
              <p className="mt-1">Equivalent to U.S. Master of Arts / Master of Science (2 years; requires coursework and research project)</p>
            </div>
            <div className="rounded border border-border bg-navy-card p-5">
              <p className="font-bold text-cream">Doctorado</p>
              <p className="mt-1">Equivalent to U.S. PhD (typically 4–5 years; original research thesis required; evaluated by jury)</p>
            </div>
            <div className="rounded border border-border bg-navy-card p-5">
              <p className="font-bold text-cream">Authentication Pipeline</p>
              <p className="mt-1">Hague Apostille + certified English translation + translator association certification ensures full U.S. and international recognition</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
