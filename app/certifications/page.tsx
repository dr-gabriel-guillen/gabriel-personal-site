import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certifications — Dr. Gabriel B. Guillen",
};

const certGroups = [
  {
    org: "Amazon Web Services (AWS)",
    icon: "☁️",
    color: "amber",
    certs: [
      { name: "AWS Certified Solutions Architect – Professional", level: "Professional", code: "SAP" },
      { name: "AWS Certified DevOps Engineer – Professional", level: "Professional", code: "DOP" },
      { name: "AWS Certified Machine Learning – Specialty", level: "Specialty", code: "MLS" },
      { name: "AWS Certified Security – Specialty", level: "Specialty", code: "SCS" },
      { name: "AWS Certified Advanced Networking – Specialty", level: "Specialty", code: "ANS" },
      { name: "AWS Certified Data Engineer – Associate", level: "Associate", code: "DEA" },
      { name: "AWS Certified AI Practitioner", level: "Foundational", code: "AIF" },
    ],
  },
  {
    org: "International Association of Privacy Professionals (IAPP)",
    icon: "🔐",
    color: "blue",
    certs: [
      { name: "CIPP/US — Certified Information Privacy Professional (United States)", level: "CIPP", code: "CIPP/US" },
      { name: "CIPP/E — Certified Information Privacy Professional (Europe)", level: "CIPP", code: "CIPP/E" },
      { name: "CIPP/C — Certified Information Privacy Professional (Canada)", level: "CIPP", code: "CIPP/C" },
      { name: "CIPT — Certified Information Privacy Technologist", level: "CIPT", code: "CIPT" },
      { name: "CIPM — Certified Information Privacy Manager", level: "CIPM", code: "CIPM" },
      { name: "AIGP — Artificial Intelligence Governance Professional", level: "AIGP", code: "AIGP" },
    ],
  },
  {
    org: "Project Management Institute (PMI)",
    icon: "📋",
    color: "violet",
    certs: [
      { name: "Project Management Professional (PMP)", level: "Professional", code: "PMP" },
    ],
  },
  {
    org: "NVIDIA",
    icon: "🤖",
    color: "green",
    certs: [
      { name: "NVIDIA Certificate Associate in Generative AI & LLMs", level: "Associate", code: "NVIDIA" },
    ],
  },
  {
    org: "State Bar of California",
    icon: "⚖️",
    color: "rose",
    certs: [
      { name: "Attorney at Law — California State Bar", level: "License #361094", code: "CA BAR" },
    ],
  },
];

const colorMap: Record<string, { badge: string; border: string; bg: string }> = {
  amber: {
    badge: "bg-amber-900/40 text-amber-300 border-amber-700",
    border: "border-amber-900/50 hover:border-amber-500/50",
    bg: "bg-amber-900/10",
  },
  blue: {
    badge: "bg-blue-900/40 text-blue-300 border-blue-700",
    border: "border-blue-900/50 hover:border-blue-500/50",
    bg: "bg-blue-900/10",
  },
  violet: {
    badge: "bg-violet-900/40 text-violet-300 border-violet-700",
    border: "border-violet-900/50 hover:border-violet-500/50",
    bg: "bg-violet-900/10",
  },
  green: {
    badge: "bg-emerald-900/40 text-emerald-300 border-emerald-700",
    border: "border-emerald-900/50 hover:border-emerald-500/50",
    bg: "bg-emerald-900/10",
  },
  rose: {
    badge: "bg-rose-900/40 text-rose-300 border-rose-700",
    border: "border-rose-900/50 hover:border-rose-500/50",
    bg: "bg-rose-900/10",
  },
};

const totalCerts = certGroups.reduce((sum, g) => sum + g.certs.length, 0);

export default function CertificationsPage() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="border-b border-border bg-navy-mid px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Professional Credentials</p>
          <h1 className="mt-5 font-display text-6xl font-bold text-cream lg:text-7xl">
            {totalCerts} Certifications
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-9 text-cream-dim">
            Professional certifications spanning cloud architecture, data privacy, project management,
            artificial intelligence, and legal practice — from AWS, IAPP, PMI, NVIDIA, and the
            California State Bar.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">
            {certGroups.map((g) => (
              <div key={g.org} className="text-center">
                <p className="font-display text-4xl font-bold text-gold">{g.certs.length}</p>
                <p className="mt-1 text-xs text-cream-dim">{g.org.split(" ").slice(0, 2).join(" ")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cert groups */}
      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-12">
          {certGroups.map((group) => {
            const c = colorMap[group.color];
            return (
              <div key={group.org}>
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-3xl">{group.icon}</span>
                  <h2 className="font-display text-3xl font-bold text-cream">{group.org}</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.certs.map((cert) => (
                    <div
                      key={cert.code}
                      className={`rounded-lg border ${c.border} ${c.bg} p-5 transition`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-cream leading-6">{cert.name}</p>
                          <span className={`mt-2 inline-block rounded border px-2 py-0.5 text-xs font-bold ${c.badge}`}>
                            {cert.level}
                          </span>
                        </div>
                        <span className="shrink-0 rounded bg-navy px-2 py-1 text-xs font-bold text-cream-dim">
                          {cert.code}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Privacy expertise callout */}
      <section className="border-t border-border bg-navy-mid px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Privacy Depth</p>
              <h2 className="mt-4 font-display text-4xl font-bold text-cream">
                6 IAPP Credentials — All Major Privacy Jurisdictions
              </h2>
              <p className="mt-5 text-base leading-8 text-cream-dim">
                Holding CIPP certifications for the United States, Europe, and Canada — plus the
                CIPT (technology), CIPM (management), and AIGP (AI governance) credentials — Dr. Guillen
                is among a small global cohort to hold all principal IAPP certifications simultaneously.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">AWS Depth</p>
              <h2 className="mt-4 font-display text-4xl font-bold text-cream">
                7 AWS Credentials — Professional Through Specialty
              </h2>
              <p className="mt-5 text-base leading-8 text-cream-dim">
                Dual Professional-level certifications (Solutions Architect + DevOps Engineer),
                three Specialty-level credentials (ML, Security, Advanced Networking), plus Associate
                and Foundational credentials — covering the full AWS professional certification track.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
