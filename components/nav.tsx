"use client";
import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/components/language";

const links = [
  { href: "/about", key: "nav.about" },
  { href: "/degrees", key: "nav.degrees" },
  { href: "/certifications", key: "nav.certifications" },
  { href: "/experience", key: "nav.experience" },
  { href: "/research", key: "nav.research" },
  { href: "/contact", key: "nav.contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  const toggle = () => setLang(lang === "en" ? "es" : "en");

  // /verification and /verificacion are separate server-rendered URLs rather
  // than one page behind the client language toggle, so the link has to pick
  // the right one. That split is deliberate: this content must be crawlable
  // and archivable with JavaScript disabled.
  const verifyHref = lang === "es" ? "/verificacion" : "/verification";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-navy/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-lg font-bold text-gold">
            Gabriel Guillen-Gonzalez
          </span>
          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.3em] text-cream-dim">
            {t("nav.tagline")}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-xs font-bold uppercase tracking-[0.18em] text-cream-dim lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-gold">
              {t(l.key)}
            </Link>
          ))}
          <Link href={verifyHref} className="text-gold transition hover:text-gold-light">
            {t("nav.verification")}
          </Link>
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 rounded border border-gold/40 px-3 py-1.5 text-gold transition hover:bg-gold/10"
            aria-label="Switch language"
          >
            <span>🌐</span> {t("nav.toggle")}
          </button>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={toggle}
            className="rounded border border-gold/40 px-2.5 py-1 text-xs font-bold text-gold"
            aria-label="Switch language"
          >
            {lang === "en" ? "ES" : "EN"}
          </button>
          <button className="text-cream" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-border bg-navy-mid px-5 pb-6 pt-4 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-bold uppercase tracking-[0.18em] text-cream-dim transition hover:text-gold"
            >
              {t(l.key)}
            </Link>
          ))}
          <Link
            href={verifyHref}
            onClick={() => setOpen(false)}
            className="block py-3 text-sm font-bold uppercase tracking-[0.18em] text-gold"
          >
            {t("nav.verification")}
          </Link>
        </nav>
      )}
    </header>
  );
}
