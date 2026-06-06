"use client";
import { useState } from "react";
import { useLang } from "@/components/language";
import {
  DEGREES,
  DOC_LABELS,
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

const LEVEL_ORDER: DegreeLevel[] = ["doctorate", "master", "grad", "specialist", "pre_grad"];

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

const UNI_META: Record<string, { initials: string; color: string; logo?: string }> = {
  // Universities with clean, legible logos:
  "siglo21.edu.ar":        { initials: "SXXI",  color: "#c25c16", logo: "/logos/siglo21.jpg" },
  "unlam.edu.ar":          { initials: "UNLaM", color: "#1e3a8a", logo: "/logos/unlam.jpg" },
  "unq.edu.ar":            { initials: "UNQ",   color: "#166534" }, // official logo is white-on-transparent → use initials
  "unrn.edu.ar":           { initials: "UNRN",  color: "#7c2d12" }, // logo too faint → use initials
  "uopeople.edu":          { initials: "UoP",   color: "#0369a1", logo: "/logos/uopeople.webp" },
  "unsam.edu.ar":          { initials: "UNSAM", color: "#14532d", logo: "/logos/unsam.png" },
  "uba.ar":                { initials: "UBA",   color: "#7f1d1d" }, // official logo is white-on-transparent → use initials
  "uneatlantico.es":       { initials: "UNEA",  color: "#92400e", logo: "/logos/uneatlantico.jpg" },
  "lehigh.edu":            { initials: "LU",    color: "#8b0000", logo: "/logos/lehigh.png" },
  "harvard.edu":           { initials: "HU",    color: "#a51c30", logo: "/logos/harvard.png" },
  "unir.net":              { initials: "UNIR",  color: "#1e3a8a", logo: "/logos/unir.png" },
  // No high-quality logo available → clean colored initials badge:
  "uncaus.edu.ar":         { initials: "UNCA",  color: "#831843" },
  "ucu.edu.ar":            { initials: "UCU",   color: "#1e40af" },
  "unimoron.edu.ar":       { initials: "UM",    color: "#4a1d96" },
  "liceosuperior.edu.ar":  { initials: "LSCI",  color: "#1a6985" },
  "psicologiasocial.edu.ar": { initials: "ESPS", color: "#5b21d9" },
};

function UniversityLogo({ domain, name }: { domain?: string; name: string }) {
  const meta = domain ? UNI_META[domain] : null;
  const initials = meta?.initials ?? "U";
  const color = meta?.color ?? "#2a3355";

  // Logo universities get a clean white rounded-square tile (object-contain handles
  // any aspect ratio without distortion). Others get a colored initials badge.
  if (meta?.logo) {
    return (
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-1.5"
        title={name}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={meta.logo}
          alt={name}
          className="max-h-full max-w-full object-contain"
          onError={(e) => {
            const t = e.currentTarget;
            t.style.display = "none";
            const parent = t.parentElement;
            if (parent) {
              parent.style.background = color;
              parent.innerHTML = `<span style="color:#fff;font-weight:700;font-size:${initials.length > 3 ? "7px" : "9px"};text-align:center;line-height:1.1">${initials}</span>`;
            }
          }}
        />
      </div>
    );
  }
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border"
      style={{ background: color }}
      title={name}
    >
      <span className="text-center font-bold text-white" style={{ fontSize: initials.length > 3 ? "7px" : "9px", lineHeight: 1.1 }}>
        {initials}
      </span>
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
  const { lang, t } = useLang();
  const [filterLevel,   setFilterLevel]   = useState<DegreeLevel | "all">("all");
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterStatus,  setFilterStatus]  = useState<string>("all");

  const levelLabel = (l: DegreeLevel) => t(`level.${l}`);
  const statusLabel = (s: keyof typeof STATUS_COLORS) =>
    t(`common.${s === "in_hand" ? "conferred" : s}`);

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
            ★ {t("deg.badge")}
          </div>
          <h1 className="mt-6 font-display text-6xl font-bold text-cream lg:text-7xl">
            {earnedCount} {t("home.stat.degrees")}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-cream-dim">
            {t("deg.intro")} {t("deg.pursuing_note")}
          </p>
          <div className="mt-8 flex flex-wrap gap-8">
            <div><p className="font-display text-4xl font-bold text-gold">{conferred}</p><p className="mt-1 text-xs text-cream-dim">{t("deg.stat.conferred")}</p></div>
            <div><p className="font-display text-4xl font-bold text-gold">{fullyDoc}</p><p className="mt-1 text-xs text-cream-dim">{t("deg.stat.documented")}</p></div>
            <div><p className="font-display text-4xl font-bold text-gold">{processing}</p><p className="mt-1 text-xs text-cream-dim">{t("deg.stat.processing")}</p></div>
            <div><p className="font-display text-4xl font-bold text-gold">{toCollect}</p><p className="mt-1 text-xs text-cream-dim">{t("deg.stat.collect")}</p></div>
            <div><p className="font-display text-4xl font-bold text-gold">{inProgress}</p><p className="mt-1 text-xs text-cream-dim">{t("deg.stat.pursuing")}</p></div>
          </div>
        </div>
      </section>

      {/* Pipeline legend */}
      <section className="border-b border-border bg-navy px-5 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-gold">
            {t("deg.pipeline.title")}
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
            {t("deg.pipeline.note")}
          </p>
        </div>
      </section>

      {/* Status legend */}
      <section className="border-b border-border bg-navy-mid px-5 py-4 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-cream-dim">{t("deg.status_label")}</span>
          {(Object.keys(STATUS_LABELS) as (keyof typeof STATUS_COLORS)[]).map((key) => (
            <div key={key} className={`rounded border px-2 py-0.5 text-xs font-bold ${STATUS_COLORS[key]}`}>
              {statusLabel(key)}
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
            {t("deg.all_levels")}
          </button>
          {LEVEL_ORDER.map((l) => (
            <button
              key={l}
              onClick={() => setFilterLevel(l)}
              className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] transition ${filterLevel === l ? "bg-gold text-navy" : "border border-border text-cream-dim hover:border-gold/50 hover:text-gold"}`}
            >
              {levelLabel(l)}
            </button>
          ))}

          <div className="ml-auto flex gap-2">
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="rounded border border-border bg-navy-card px-3 py-1.5 text-xs text-cream-dim focus:border-gold focus:outline-none"
            >
              <option value="all">🌍 {t("deg.all_countries")}</option>
              <option value="Argentina">🇦🇷 Argentina</option>
              <option value="USA">🇺🇸 USA</option>
              <option value="Spain">🇪🇸 España</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded border border-border bg-navy-card px-3 py-1.5 text-xs text-cream-dim focus:border-gold focus:outline-none"
            >
              <option value="all">{t("deg.all_statuses")}</option>
              <option value="in_hand">{t("common.conferred")}</option>
              <option value="processing">{t("common.processing")}</option>
              <option value="to_collect">{t("common.to_collect")}</option>
              <option value="in_progress">{t("common.in_progress")}</option>
            </select>
          </div>
          <span className="text-xs text-cream-dim">{filtered.length} {t("deg.shown")}</span>
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
                  {levelLabel(level)}
                  <span className="ml-3 font-sans text-base font-normal text-cream-dim">({group.length})</span>
                </h2>
                <div className="space-y-3">
                  {group.map((degree) => {
                    // For US degrees we show a different doc indicator
                    const isUsEnglish = degree.country === "USA";
                    const docCount = degree.docs.length;

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
                                <span className="text-base font-bold leading-snug text-cream">
                                  {lang === "es" && degree.country !== "USA" ? degree.titleEs : degree.titleEn}
                                </span>
                                <span className={`shrink-0 rounded border px-2 py-0.5 text-xs font-bold ${LEVEL_COLORS[degree.level]}`}>
                                  {levelLabel(degree.level)}
                                </span>
                                <span className={`shrink-0 rounded border px-2 py-0.5 text-xs font-bold ${STATUS_COLORS[degree.status]}`}>
                                  {statusLabel(degree.status)}
                                </span>
                              </div>

                              {degree.country !== "USA" && (
                                <p className="mt-0.5 text-sm italic text-cream-dim">
                                  {lang === "es" ? degree.titleEn : degree.titleEs}
                                </p>
                              )}

                              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-cream-dim">
                                <span className="flex items-center gap-1.5">
                                  <img src={COUNTRY_FLAG_URLS[degree.country]} alt={degree.country} width={20} height={14} className="inline-block rounded-sm" />
                                  <span>{degree.university}</span>
                                </span>
                                <span className="font-bold text-gold">
                                  {degree.year ?? (degree.estimatedYear ? `${lang === "es" ? "Est." : "Est."} ${degree.estimatedYear}` : (lang === "es" ? "En curso" : "In progress"))}
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
                            <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-cream-dim">                              {t("deg.docs")}
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
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">{t("deg.equiv.label")}</p>
          <h2 className="mt-4 font-display text-3xl font-bold text-cream">
            {t("deg.equiv.title")}
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
