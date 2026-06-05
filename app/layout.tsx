import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Dr. Gabriel B. Guillen — Polymath | Engineer · Attorney · Data Scientist",
  description:
    "Personal site of Dr. Gabriel B. Guillen: computer engineer, attorney, PhD, Harvard data scientist, Fulbright scholar — 25 university degrees across 3 countries.",
  openGraph: {
    title: "Dr. Gabriel B. Guillen",
    description: "25 University Degrees · 17 Professional Certifications · Guinness Record Candidate",
    url: "https://drgabrielguillen.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
