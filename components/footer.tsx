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
  const { lang, t } = useLang();
  const verifyHref = lang === "es" ? "/verificacion" : "/verification";
  const disambigHref = lang === "es" ? "/desambiguacion" : "/disambiguation";
  return (
    <footer className="border-t border-border bg-navy-mid px-5 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold text-gold">
              Gabriel Guillen-Gonzalez
            </p>
            <p className="mt-2 text-sm leading-7 text-cream-dim">{t("footer.tagline")}</p>
            <p className="mt-3 text-xs text-cream-dim">{t("footer.location")}</p>
            <p className="mt-3 text-xs text-cream-dim">
              <Link href={disambigHref} className="underline underline-offset-4 hover:text-gold">
                {t("footer.disambiguation")}
              </Link>
            </p>
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
              <li>
                <Link href={verifyHref} className="text-gold transition hover:text-gold-light">
                  {t("nav.verification")}
                </Link>
              </li>
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
                {/* Deep link to the licensee record, not the Bar's home page:
                    the point is that a reader can check it in one click. */}
                <a
                  href="https://apps.calbar.ca.gov/attorney/Licensee/Detail/361094"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-gold"
                >
                  {t("footer.verifyBar")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-cream-dim">
          <p>
            © {new Date().getFullYear()} Gabriel Guillen-Gonzalez. {t("footer.rights")}
          </p>
          <p className="mt-1">{t("footer.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
