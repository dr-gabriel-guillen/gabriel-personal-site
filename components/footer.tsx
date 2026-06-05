import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-navy-mid px-5 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold text-gold">Dr. Gabriel B. Guillen</p>
            <p className="mt-2 text-sm leading-7 text-cream-dim">
              Polymath · Engineer · Attorney · Data Scientist · Fulbright Scholar
            </p>
            <p className="mt-3 text-xs text-cream-dim">San Jose, California</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">Navigation</p>
            <ul className="mt-4 space-y-2 text-sm text-cream-dim">
              {["/about", "/degrees", "/certifications", "/experience", "/research", "/contact"].map((href) => (
                <li key={href}>
                  <Link href={href} className="capitalize transition hover:text-gold">
                    {href.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">Contact</p>
            <ul className="mt-4 space-y-2 text-sm text-cream-dim">
              <li>
                <a href="mailto:gguillen@alumni.harvard.edu" className="transition hover:text-gold">
                  gguillen@alumni.harvard.edu
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/gabriel-guillen/" target="_blank" rel="noopener noreferrer" className="transition hover:text-gold">
                  LinkedIn Profile
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
          <p>© {new Date().getFullYear()} Dr. Gabriel B. Guillen. All rights reserved.</p>
          <p className="mt-1">
            The information on this site is provided for informational purposes only and does not constitute legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
