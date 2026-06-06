"use client";
import Link from "next/link";
import { useLang } from "@/components/language";

const navItems = [
  { href: "/about", key: "nav.about" },
  { href: "/degrees", key: "nav.degrees" },
  { href: "/certifications", key: "nav.certifications" },
  { href: "/experience", key: "nav.experience" },
  { href: "/research", key: "nav.research" },
  { href: "/contact", key: "nav.contact" },
];

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border bg-navy-mid px-5 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold text-gold">Dr. Gabriel B. Guillen</p>
            <p className="mt-2 text-sm leading-7 text-cream-dim">{t("footer.tagline")}</p>
            <p className="mt-3 text-xs text-cream-dim">{t("footer.location")}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">{t("footer.navigation")}</p>
            <ul className="mt-4 space-y-2 text-sm text-cream-dim">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-gold">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">{t("footer.contact")}</p>
            <ul className="mt-4 space-y-2 text-sm text-cream-dim">
              <li>
                <a href="mailto:gguillen@alumni.harvard.edu" className="transition hover:text-gold">
                  gguillen@alumni.harvard.edu
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/gabriel-guillen/" target="_blank" rel="noopener noreferrer" className="transition hover:text-gold">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://www.calbar.ca.gov/" target="_blank" rel="noopener noreferrer" className="transition hover:text-gold">
                  CA Bar License #361094
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-cream-dim">
          <p>© {new Date().getFullYear()} Dr. Gabriel B. Guillen. {t("footer.rights")}</p>
          <p className="mt-1">{t("footer.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
