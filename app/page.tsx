"use client";
import Link from "next/link";
import { DEGREES } from "@/components/degrees-data";
import { useLang } from "@/components/language";

const domains = [
  { icon: "⚖️", titleKey: "home.domain.law",  items: ["California Attorney (Bar #361094)", "Buenos Aires Bar Member", "Immigration, Privacy & Corporate Law", "Argentine Notary (Escribano)", "Sworn Public Translator"] },
  { icon: "💻", titleKey: "home.domain.eng",  items: ["Computer Engineer (UNLaM)", "Sr. Engineer at PayPal", "ML Pipelines at Meta", "AWS Certified (7 credentials)", "Quantum Computing (in progress)"] },
  { icon: "📊", titleKey: "home.domain.data", items: ["Harvard Master in Data Science", "MS Financial Engineering — Lehigh (Fulbright)", "PhD in Economic Sciences", "Bloomberg & IAFC Competition Participant", "Algorithmic Trading & Derivatives"] },
  { icon: "🎓", titleKey: "home.domain.edu",  items: ["University Professor (Math, CS)", "Teaching Assistant — Lehigh University", "5 Specializations / Master's in Education", "Academic Research Published", "Doctoral Thesis on Stock Market AI"] },
  { icon: "🔐", titleKey: "home.domain.priv", items: ["CIPP/US · CIPP/E · CIPP/C (IAPP)", "CIPT · CIPM · AIGP (IAPP)", "Privacy-by-Design at PayPal", "30% Reduction in Privacy Audit Findings", "Cross-Border Data Transfer Reviews"] },
  { icon: "🌐", titleKey: "home.domain.biz",  items: ["CPA (Buenos Aires Professional Council)", "BBA — National University of Quilmes", "Real Estate Broker & Auctioneer", "Country Manager (Adaptone/Quantikis)", "MBA in Technology-Based Business"] },
];

const timeline = [
  { year: "2011–14", event: "Bachelor in Computer Engineering — UNLaM" },
  { year: "2013–16", event: "CPA + BBA — Universidad Nacional de Quilmes" },
  { year: "2016", event: "Specialist in Occupational H&S — Universidad de Morón" },
  { year: "2017", event: "Math Teaching Degree — Universidad Nacional de Río Negro" },
  { year: "2018", event: "MBA Spain — Universidad Europea del Atlántico" },
  { year: "2018–20", event: "MS Financial Engineering — Lehigh University (Fulbright Scholar)" },
  { year: "2020–22", event: "Master in Data Science — Harvard University (CGPA 3.77)" },
  { year: "2017–22", event: "PhD in Economic Sciences — Universidad Nacional de la Matanza" },
  { year: "2021", event: "Juris Doctor — UNCAus · Buenos Aires Bar Admission" },
  { year: "2021", event: "Specialist: Petrochemical + Online Teaching" },
  { year: "2022", event: "Argentine Notary Degree + Broker / Auctioneer Degree" },
  { year: "2023–25", event: "MS Mathematical Engineering & Computer Science — UNIR Spain" },
  { year: "2024", event: "Sworn Public Translator (English) — UCU · CA Bar Admission #361094" },
  { year: "2025–26", event: "Actuarial Science (in progress) · University Assessment Specialist" },
  { year: "2026+", event: "Real Estate Mgmt (to collect) · MS Quantum Computing (est. 2027)" },
];

const conferred = DEGREES.filter((d) => d.status === "in_hand").length;
const awaiting = DEGREES.filter((d) => d.status === "processing" || d.status === "to_collect").length;
const pursuing = DEGREES.filter((d) => d.status === "in_progress").length;
const fullyDoc = DEGREES.filter((d) => d.docs.length === 5).length;

export default function Home() {
  const { t } = useLang();

  const statCards = [
    { value: "22", label: t("home.stat.degrees"), sub: t("home.stat.degrees.sub") },
    { value: "17", label: t("home.stat.certs"), sub: t("home.stat.certs.sub") },
    { value: "14+", label: t("home.stat.years"), sub: t("home.stat.years.sub") },
    { value: "3", label: t("home.stat.countries"), sub: t("home.stat.countries.sub") },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden bg-navy pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(201,168,92,0.12),transparent)]" />
        <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col items-center justify-center px-5 py-24 text-center lg:px-8">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-gold">
            <span>★</span>
            <span>{t("home.badge")}</span>
            <span>★</span>
          </div>

          <h1 className="font-display text-6xl font-bold leading-[0.95] text-cream sm:text-7xl lg:text-8xl xl:text-9xl">
            Dr. Gabriel B.<br />
            <span className="text-gold">Guillen</span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-cream-dim">{t("home.subtitle")}</p>

          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {statCards.map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-navy-card px-6 py-5 text-center">
                <p className="font-display text-4xl font-bold text-gold">{s.value}</p>
                <p className="mt-1 text-sm font-bold text-cream">{s.label}</p>
                <p className="mt-1 text-xs text-cream-dim">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/degrees" className="bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-navy transition hover:bg-gold-light">
              {t("home.cta.degrees")}
            </Link>
            <Link href="/about" className="border border-gold/50 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-gold transition hover:border-gold hover:bg-gold/10">
              {t("home.cta.about")}
            </Link>
          </div>

          <p className="mt-6 text-xs text-cream-dim">
            {conferred} {t("home.record.conferred")} · {awaiting} {t("home.record.awaiting")} · {pursuing} {t("home.record.pursuing")} · {fullyDoc} (5/5)
          </p>
        </div>
      </section>

      {/* GUINNESS RECORD SECTION */}
      <section className="border-y border-border bg-navy-mid px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">{t("home.record.label")}</p>
              <h2 className="mt-5 font-display text-5xl font-bold leading-tight text-cream">{t("home.record.title")}</h2>
              <p className="mt-6 text-lg leading-9 text-cream-dim">{t("home.record.p1")}</p>
              <p className="mt-4 text-base leading-8 text-cream-dim">{t("home.record.p2")}</p>
              <Link href="/degrees" className="mt-8 inline-flex items-center gap-2 border border-gold/50 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-gold transition hover:border-gold hover:bg-gold/10">
                {t("home.record.cta")}
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: t("home.record.conferred"), value: conferred, icon: "🎓" },
                { label: t("home.record.documented"), value: fullyDoc, icon: "📜" },
                { label: t("home.record.awaiting"), value: awaiting, icon: "⏳" },
                { label: t("home.record.pursuing"), value: pursuing, icon: "📚" },
                { label: t("home.record.steps"), value: "5", icon: "✅" },
                { label: t("home.record.countries"), value: "3", icon: "🌎" },
                { label: t("home.record.levels"), value: "5", icon: "🏛️" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 rounded-lg border border-border bg-navy-card p-5">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-display text-3xl font-bold text-gold">{item.value}</p>
                    <p className="mt-1 text-sm text-cream-dim">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DOMAINS OF EXPERTISE */}
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">{t("home.domains.label")}</p>
          <h2 className="mt-5 font-display text-5xl font-bold leading-tight text-cream">{t("home.domains.title")}</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map((d) => (
              <div key={d.titleKey} className="rounded-lg border border-border bg-navy-card p-6 transition hover:border-gold/50">
                <span className="text-3xl">{d.icon}</span>
                <h3 className="mt-3 font-display text-2xl font-bold text-cream">{t(d.titleKey)}</h3>
                <ul className="mt-4 space-y-2">
                  {d.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-cream-dim">
                      <span className="mt-0.5 text-gold">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACADEMIC TIMELINE */}
      <section className="border-t border-border bg-navy-mid px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">{t("home.timeline.label")}</p>
          <h2 className="mt-5 font-display text-5xl font-bold leading-tight text-cream">{t("home.timeline.title")}</h2>
          <div className="relative mt-12">
            <div className="absolute left-[88px] top-0 hidden h-full w-px bg-border lg:block" />
            <div className="space-y-4">
              {timeline.map((item) => (
                <div key={item.event} className="grid gap-2 lg:grid-cols-[88px_1fr] lg:gap-8">
                  <p className="pt-1 text-right text-sm font-bold text-gold lg:text-right">{item.year}</p>
                  <div className="relative rounded border border-border bg-navy-card px-5 py-4 text-sm text-cream-dim lg:ml-8">
                    <div className="absolute -left-[10px] top-1/2 hidden h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-gold bg-navy lg:block" />
                    {item.event}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link href="/degrees" className="text-sm font-bold uppercase tracking-[0.18em] text-gold transition hover:text-gold-light">
              {t("home.timeline.cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="border-t border-border px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/degrees", icon: "🎓", title: t("home.links.degrees.title"), desc: t("home.links.degrees.desc") },
              { href: "/certifications", icon: "📋", title: t("home.links.certs.title"), desc: t("home.links.certs.desc") },
              { href: "/experience", icon: "💼", title: t("home.links.exp.title"), desc: t("home.links.exp.desc") },
              { href: "/research", icon: "🔬", title: t("home.links.research.title"), desc: t("home.links.research.desc") },
            ].map((card) => (
              <Link key={card.href} href={card.href} className="group bg-navy-card p-8 transition hover:bg-navy-mid">
                <span className="text-3xl">{card.icon}</span>
                <h3 className="mt-4 font-display text-2xl font-bold text-cream group-hover:text-gold">{card.title}</h3>
                <p className="mt-2 text-sm leading-7 text-cream-dim">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
