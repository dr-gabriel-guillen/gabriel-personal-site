import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research — Dr. Gabriel B. Guillen",
};

const thesis = [
  {
    level: "PhD Dissertation",
    title: "Use of Bio-Inspired Metaheuristic Methods for Modeling and Prediction of High-Volatility Stock Markets: The Argentinian Case",
    institution: "Universidad Nacional de la Matanza — PhD in Economic Sciences",
    year: 2021,
    description:
      "Doctoral thesis applying evolutionary algorithms, swarm intelligence, and other bio-inspired metaheuristic techniques to model and forecast price behavior in volatile equity markets, with a focus on the Argentine stock market (Merval index). Investigated the effectiveness of genetic algorithms, particle swarm optimization, and ant colony optimization for financial time-series prediction.",
  },
];

const research = [
  {
    title: "Exploration of Lyme Disease Incidence Rate Modeling and Risk Assessment Mapping",
    venue: "Harvard University — Data Science Capstone",
    year: 2022,
    type: "Capstone",
    authors: "Dr. Gabriel Guillen, Yang Ming (Jason) Lin, Peter Masters",
    description:
      "Developed predictive models for Lyme disease incidence using geospatial analysis, epidemiological data, and machine learning to produce county-level risk assessment maps across the Northeastern United States.",
  },
  {
    title: "Predicting COVID-19 Disease Spread Using Google Mobility Data and Clustering in Census Data",
    venue: "Harvard University — Data Science Research",
    year: 2021,
    type: "Research",
    authors: "Dr. Gabriel Guillen et al.",
    description:
      "Applied clustering algorithms to Google Mobility Reports combined with U.S. Census demographic data to build predictive models for COVID-19 transmission rates at county and state levels during the pandemic.",
  },
  {
    title: "Benford's Law Applied to Twitter Data",
    venue: "Harvard University — Data Science Research",
    year: 2021,
    type: "Research",
    authors: "Dr. Gabriel Guillen et al.",
    description:
      "Investigated whether naturally occurring Twitter engagement metrics (retweets, likes, follower counts) conform to Benford's Law, exploring applications for fraud detection and anomaly identification in social media data.",
  },
  {
    title: "Predicting U.S. Future Derivatives Market of Wheat Using NLP in President Trump Tweets",
    venue: "Harvard University — Data Science Research",
    year: 2021,
    type: "Research",
    authors: "Dr. Gabriel Guillen et al.",
    description:
      "Used natural language processing (NLP) and sentiment analysis on the former U.S. President's social media output to build predictive models for wheat futures price movements, demonstrating the market impact of political communication.",
  },
  {
    title: "How to Predict Spread Movements",
    venue: "Lehigh University — 2019 IAFC Competition",
    year: 2019,
    type: "Competition Paper",
    authors: "Dr. Gabriel Guillen",
    description:
      "Analyzed quantitative models for predicting bid-ask spread movements in equity and derivatives markets, presented at the International Association of Financial Colleges competition.",
  },
];

const typeColors: Record<string, string> = {
  Capstone: "bg-amber-900/40 text-amber-300 border-amber-700",
  Research: "bg-blue-900/40 text-blue-300 border-blue-700",
  "Competition Paper": "bg-violet-900/40 text-violet-300 border-violet-700",
};

export default function ResearchPage() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="border-b border-border bg-navy-mid px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Academic Work</p>
          <h1 className="mt-5 font-display text-6xl font-bold text-cream lg:text-7xl">
            Research & Publications
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-9 text-cream-dim">
            Doctoral dissertation, Harvard capstone, and research papers spanning quantitative finance,
            epidemiology, social media analytics, and natural language processing.
          </p>
        </div>
      </section>

      {/* Doctoral Thesis */}
      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-gold">Doctoral Dissertation</p>
          {thesis.map((t) => (
            <div key={t.title} className="rounded-lg border border-gold/30 bg-gold/5 p-8">
              <div className="flex flex-wrap items-start gap-3">
                <span className="rounded border border-gold/50 bg-gold/10 px-3 py-1 text-xs font-bold text-gold">
                  {t.level}
                </span>
                <span className="rounded border border-border bg-navy px-3 py-1 text-xs text-cream-dim">
                  {t.year}
                </span>
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold text-cream">{t.title}</h2>
              <p className="mt-2 text-sm font-bold text-gold">{t.institution}</p>
              <p className="mt-4 text-base leading-8 text-cream-dim">{t.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Research papers */}
      <section className="border-t border-border px-5 pb-16 pt-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-gold">Research Papers & Projects</p>
          <div className="space-y-4">
            {research.map((r) => (
              <div key={r.title} className="rounded-lg border border-border bg-navy-card p-6">
                <div className="flex flex-wrap items-start gap-3">
                  <span className={`rounded border px-2 py-0.5 text-xs font-bold ${typeColors[r.type]}`}>
                    {r.type}
                  </span>
                  <span className="rounded border border-border bg-navy px-2 py-0.5 text-xs text-cream-dim">
                    {r.year}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold text-cream">{r.title}</h3>
                <p className="mt-1 text-sm text-gold">{r.venue}</p>
                <p className="mt-1 text-xs italic text-cream-dim">{r.authors}</p>
                <p className="mt-3 text-sm leading-8 text-cream-dim">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="border-t border-border bg-navy-mid px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Research Methods & Tools</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              "Python", "R", "SQL", "Jupyter Notebooks", "Machine Learning", "NLP",
              "Time-Series Analysis", "Geospatial Analysis", "Clustering Algorithms",
              "Genetic Algorithms", "Particle Swarm Optimization", "Sentiment Analysis",
              "Financial Econometrics", "Derivatives Modeling", "Bloomberg Terminal",
              "Big Data (Hadoop/Spark)", "Data Visualization",
            ].map((skill) => (
              <span
                key={skill}
                className="rounded border border-border bg-navy-card px-4 py-2 text-sm text-cream-dim"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
