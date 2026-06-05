import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience — Dr. Gabriel B. Guillen",
};

const jobs = [
  {
    company: "PayPal Inc.",
    logo: "/companies/paypal.png",
    role: "Project Leader — Sr. Software Engineer",
    location: "San Jose, California",
    years: "2025 – Present",
    icon: "💳",
    bullets: [
      "Lead the Cross-border initiative for the search team — capacity planning, project tracking, and system integration via JIRA/Confluence",
      "Lead PayPal/Venmo wallet interoperability with WeChat Pay, Mercado Pago, and partner ecosystems across money-movement, identity, and settlement flows",
      "Own indexing, relevance, query understanding, and latency optimization services on the Search team using Python & REST APIs",
      "Serve as Legal & Privacy liaison — privacy-by-design, data minimization, DPIA inputs, cross-border data transfer reviews — reducing privacy audit findings by 30%",
      "Lead AI acceleration: LLM-assisted code reviews, automated testing, AI development cycle dashboarding",
    ],
  },
  {
    company: "Meta Platforms, Inc.",
    logo: "/companies/meta.png",
    role: "Software Engineer",
    location: "Sunnyvale, California",
    years: "2024",
    icon: "🌐",
    bullets: [
      "Optimized ML pipelines, cutting process time from 50 to 34 hours (32% reduction) across Instagram, Facebook, and WhatsApp data",
      "Enhanced ML pipeline reliability through auto-remediation and stabilization techniques affecting content ranking across platforms",
      "Streamlined ML pipelines via refactoring — cut error rates by 25%, improved data handling",
      "Coordinated with London AEMI team via dashboarding tools, shortening project timelines by 20%",
      "Managed 300 TB of data through ML pipelines improving speed and accuracy for ad experiments",
    ],
  },
  {
    company: "Adaptone LLC (Quantikis / Open System Inc.)",
    role: "Country Manager — Software Team Leader",
    location: "Georgia, United States",
    years: "2021 – 2023",
    icon: "🏢",
    bullets: [
      "Led a team of 7 engineers in Argentina plus developers in the US, Italy, and Spain as software architect",
      "Selected, onboarded, and trained new employees across multiple countries",
      "Managed offshore staffing solutions to enhance business operations and support company expansion",
      "Oversaw HR functions in Argentina ensuring local legal and accounting compliance",
    ],
  },
  {
    company: "Adaptone LLC",
    role: "Full Stack Developer",
    location: "Atlanta, Georgia",
    years: "2020 – 2021",
    icon: "💻",
    bullets: [
      "Directed architectural overhaul of multicultural software team — 40% improvement in system integration efficiency",
      "Pioneered microservices architecture: 50% increase in deployment speed, 30% reduction in downtime",
      "Developed technical roadmap transitioning legacy systems to modern architecture — 25% operational efficiency gain",
      "Introduced automation tools reducing time-to-market by 30% and increasing customer satisfaction by 25%",
    ],
  },
  {
    company: "Lehigh University",
    logo: "/companies/lehigh.png",
    role: "Graduate Teaching Assistant",
    location: "Bethlehem, Pennsylvania",
    years: "2019 – 2020",
    icon: "🎓",
    bullets: [
      "Evaluated and graded assignments, supervised exams, held office hours for eight sections of BIS 044",
      "Developed instructional materials including PowerPoint slides and Jupyter Notebook labs",
      "Designed and led laboratory sessions with Excel and Python reinforcing lecture concepts",
      "Maintained attendance records, coordinated class schedules, organized academic resources",
    ],
  },
  {
    company: "CS Business Services",
    role: "Full Stack Software Developer",
    location: "Buenos Aires, Argentina",
    years: "2015 – 2020",
    icon: "🔧",
    bullets: [
      "Championed Agile/Scrum development — 30% faster project turnaround",
      "Directed legacy code refactoring with Java/Hibernate/Spring — 25% reduction in bug rates",
      "Optimized PostgreSQL performance — 45% increase in transaction processing speeds",
    ],
  },
  {
    company: "National University of La Matanza",
    logo: "/logos/unlam.jpg",
    role: "Head of Advanced Programming / Teacher",
    location: "Buenos Aires, Argentina",
    years: "2013 – 2018",
    icon: "🏛️",
    bullets: [
      "Instructed Programming I/II and Foundations of ICT in C, C++, Java, and C# — Engineering Department",
      "Conducted Continuing Education courses in Marketing, Product Development, and Advanced Programming using Scrum",
      "Taught Computing I/II for the Pedagogy Department using Microsoft Office Suite and Visual Basic",
      "Reviewed academic publications in software engineering applying risk-assessment criteria",
    ],
  },
  {
    company: "Morón City Hall Project",
    role: "Team Leader & Full Stack Developer",
    location: "Argentina",
    years: "2013 – 2015",
    icon: "🏙️",
    bullets: [
      "Led development of a GIS Application using Java, PHP, and .NET enhancing municipal data accessibility",
      "Directed design of municipal applications including GIS and financial software with Hibernate and Flask",
      "Managed client relationships and oversaw project execution from inception to completion",
    ],
  },
  {
    company: "Studio Webstern",
    role: "Partner",
    location: "Buenos Aires, Argentina",
    years: "2011 – 2013",
    icon: "🌟",
    bullets: [
      "Co-founded web design and printing solutions company using HTML, CSS, JavaScript, Dreamweaver, Flash",
      "Drove business growth through new opportunities, strategic plans, and market expansion partnerships",
      "Managed client relationships ensuring high-quality, on-time project delivery",
    ],
  },
];

export default function ExperiencePage() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="border-b border-border bg-navy-mid px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Career History</p>
          <h1 className="mt-5 font-display text-6xl font-bold text-cream lg:text-7xl">
            14+ Years of Experience
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-9 text-cream-dim">
            From founding a web studio in Buenos Aires to engineering at PayPal and Meta in Silicon Valley —
            bridging software engineering, legal practice, data science, and academia across three continents.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">
            {[
              { value: "9", label: "Roles" },
              { value: "4", label: "Countries" },
              { value: "PayPal · Meta", label: "Current / Recent" },
              { value: "2011", label: "Career Start" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-bold text-gold">{s.value}</p>
                <p className="mt-1 text-xs text-cream-dim">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="relative">
            <div className="absolute left-6 top-0 h-full w-px bg-border" />
            <div className="space-y-6">
              {jobs.map((job) => (
                <div key={`${job.company}-${job.years}`} className="relative pl-16">
                  <div className="absolute left-3 top-5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-gold bg-navy text-base">
                    {job.icon}
                  </div>
                  <div className="rounded-lg border border-border bg-navy-card p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-4">
                        {"logo" in job && job.logo && (
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white p-1.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={job.logo} alt={job.company} className="h-full w-full object-contain" />
                          </span>
                        )}
                        <div>
                        <h2 className="font-display text-2xl font-bold text-cream">{job.company}</h2>
                        <p className="mt-1 text-base font-bold text-gold">{job.role}</p>
                        <p className="mt-1 text-sm text-cream-dim">{job.location}</p>
                        </div>
                      </div>
                      <span className="rounded border border-border bg-navy px-3 py-1 text-xs font-bold text-cream-dim">
                        {job.years}
                      </span>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {job.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm leading-7 text-cream-dim">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
