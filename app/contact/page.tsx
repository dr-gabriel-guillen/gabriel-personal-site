"use client";
import { useState } from "react";
import { useLang } from "@/components/language";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const { t } = useLang();

  return (
    <div className="pt-20">
      <section className="border-b border-border bg-navy-mid px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">{t("contact.eyebrow")}</p>
          <h1 className="mt-5 font-display text-6xl font-bold text-cream lg:text-7xl">{t("contact.title")}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-9 text-cream-dim">{t("contact.intro")}</p>
        </div>
      </section>

      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.2fr]">
          {/* Info */}
          <div className="space-y-6">
            {[
              { icon: "✉️", label: t("contact.email"), value: "gguillen@alumni.harvard.edu", href: "mailto:gguillen@alumni.harvard.edu" },
              { icon: "📞", label: t("contact.phone"), value: "+1 (470) 685-8701", href: "tel:+14706858701" },
              { icon: "💼", label: "LinkedIn", value: "linkedin.com/in/gabriel-guillen", href: "https://www.linkedin.com/in/gabriel-guillen/" },
              { icon: "⚖️", label: t("contact.bar"), value: "License #361094", href: "https://apps.calbar.ca.gov/attorney/Licensee/Detail/361094" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-lg border border-border bg-navy-card p-5 transition hover:border-gold/40"
              >
                <span className="mt-0.5 text-2xl">{item.icon}</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">{item.label}</p>
                  <p className="mt-1 text-base text-cream">{item.value}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          {sent ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-gold/30 bg-gold/5 p-12 text-center">
              <span className="text-5xl">✅</span>
              <h2 className="mt-6 font-display text-3xl font-bold text-cream">{t("contact.sent.title")}</h2>
              <p className="mt-3 text-base text-cream-dim">{t("contact.sent.desc")}</p>
            </div>
          ) : (
            <form
              className="space-y-5 rounded-lg border border-border bg-navy-card p-8"
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t("contact.first")} name="first" required />
                <Field label={t("contact.last")} name="last" required />
              </div>
              <Field label={t("contact.email")} name="email" type="email" required />
              <Field label={t("contact.org")} name="org" />
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-cream-dim">{t("contact.subject")}</label>
                <select
                  name="subject"
                  className="rounded border border-border bg-navy px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
                >
                  <option>{t("contact.subj.guinness")}</option>
                  <option>{t("contact.subj.legal")}</option>
                  <option>{t("contact.subj.speaking")}</option>
                  <option>{t("contact.subj.academic")}</option>
                  <option>{t("contact.subj.tech")}</option>
                  <option>{t("contact.subj.general")}</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-cream-dim">{t("contact.message")}</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="resize-none rounded border border-border bg-navy px-4 py-3 text-sm text-cream placeholder-cream-dim/40 focus:border-gold focus:outline-none"
                  placeholder={t("contact.message.ph")}
                />
              </div>
              <p className="text-xs leading-5 text-cream-dim">{t("contact.disclaimer")}</p>
              <button
                type="submit"
                className="w-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-navy transition hover:bg-gold-light"
              >
                {t("contact.send")}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-xs font-bold uppercase tracking-[0.2em] text-cream-dim">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="rounded border border-border bg-navy px-4 py-3 text-sm text-cream placeholder-cream-dim/40 focus:border-gold focus:outline-none"
      />
    </div>
  );
}
