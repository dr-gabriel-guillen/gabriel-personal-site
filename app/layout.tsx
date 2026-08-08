import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { LanguageProvider } from "@/components/language";
import { TOTALS } from "@/lib/credentials";
import { CANONICAL_NAME, SITE } from "@/lib/seo";

/**
 * Site metadata.
 *
 * The canonical name matches the California Bar record. The previous title and
 * description led with "22 university degrees" and "17 Professional
 * Certifications · Guinness Record Candidate"; both totals are now computed
 * from data/credentials.json and the unverifiable one is gone.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: `${CANONICAL_NAME} — attorney, engineer, data scientist`,
    template: `%s`,
  },
  description:
    `${CANONICAL_NAME} (also published as Gabriel B. Guillen and Gabriel Guillén): California attorney, ` +
    `State Bar licence #361094, computer engineer and data scientist. ` +
    `${TOTALS.argentineRegistryDegrees} university degrees in Argentina's national graduate registry, ` +
    `${TOTALS.internationalDegreeProgrammes} international postgraduate programmes — each independently verifiable.`,
  openGraph: {
    title: CANONICAL_NAME,
    description: `California attorney, Bar #361094. Every credential independently verifiable.`,
    url: SITE,
    siteName: CANONICAL_NAME,
    type: "profile",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
