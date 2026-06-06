"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "es";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (saved === "en" || saved === "es") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", l);
      document.documentElement.lang = l;
    }
  };

  const t = (key: string): string => {
    const dict = TRANSLATIONS[lang];
    return dict[key] ?? TRANSLATIONS.en[key] ?? key;
  };

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const c = useContext(Ctx);
  if (!c) {
    // Fallback so non-wrapped usage doesn't crash (returns English)
    return { lang: "en", setLang: () => {}, t: (k) => TRANSLATIONS.en[k] ?? k };
  }
  return c;
}

type Dict = Record<string, string>;

export const TRANSLATIONS: Record<Lang, Dict> = {
  en: {
    // Nav
    "nav.about": "About",
    "nav.degrees": "Degrees",
    "nav.certifications": "Certifications",
    "nav.experience": "Experience",
    "nav.research": "Research",
    "nav.contact": "Contact",
    "nav.tagline": "Engineer · Attorney · Data Scientist",
    "nav.toggle": "Español",

    // Footer
    "footer.tagline": "Polymath · Engineer · Attorney · Data Scientist · Fulbright Scholar",
    "footer.location": "San Jose, California",
    "footer.navigation": "Navigation",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    "footer.disclaimer": "The information on this site is provided for informational purposes only and does not constitute legal advice.",

    // Home — hero
    "home.badge": "Guinness World Record Candidate — Most University Degrees",
    "home.subtitle": "Computer Engineer · Attorney · PhD · Fulbright Scholar · Harvard Data Scientist · Certified Privacy Professional · AWS Architect · Actuary (in progress) · Quantum Computing Researcher",
    "home.stat.degrees": "University Degrees",
    "home.stat.degrees.sub": "3 countries · 5 academic levels",
    "home.stat.certs": "Professional Certifications",
    "home.stat.certs.sub": "AWS · IAPP · PMI · NVIDIA",
    "home.stat.years": "Years of Experience",
    "home.stat.years.sub": "Engineering, Law & Academia",
    "home.stat.countries": "Countries of Study",
    "home.stat.countries.sub": "Argentina · USA · Spain",
    "home.cta.degrees": "View All 22 Degrees",
    "home.cta.about": "About Gabriel",
    "home.summary": "conferred · awaiting diploma · currently pursuing · fully apostilled with certified English translation",

    // Home — record section
    "home.record.label": "World Record Attempt",
    "home.record.title": "Pursuing the Guinness Record for Most University Degrees",
    "home.record.p1": "With 22 university-level degrees spanning pre-graduate, graduate, specialist, master's, and doctoral programs across Argentina, the United States, and Spain — Dr. Guillen is actively compiling the documentation necessary to submit a Guinness World Records application.",
    "home.record.p2": "Each degree is being authenticated through a rigorous five-step pipeline: original diploma, Apostille of The Hague, certified English translation, translator association certification, and a second Apostille — ensuring full international legal recognition.",
    "home.record.cta": "See Documentation Status →",
    "home.record.conferred": "Degrees Conferred",
    "home.record.documented": "Fully Documented",
    "home.record.awaiting": "Awaiting Diploma",
    "home.record.pursuing": "Currently Pursuing",
    "home.record.steps": "Doc Pipeline Steps",
    "home.record.countries": "Countries of Study",
    "home.record.levels": "Academic Levels",

    // Home — domains
    "home.domains.label": "Areas of Expertise",
    "home.domains.title": "Multidisciplinary mastery across six domains.",
    "home.domain.law": "Law & Legal Practice",
    "home.domain.eng": "Engineering & Technology",
    "home.domain.data": "Data Science & Finance",
    "home.domain.edu": "Education & Academia",
    "home.domain.priv": "Privacy & Compliance",
    "home.domain.biz": "Business & Real Estate",

    // Home — timeline
    "home.timeline.label": "Academic Journey",
    "home.timeline.title": "15 years of continuous education.",
    "home.timeline.cta": "View full degrees documentation →",

    // Home — quick links
    "home.links.degrees.title": "All Degrees",
    "home.links.degrees.desc": "22 degrees with doc status and equivalency",
    "home.links.certs.title": "Certifications",
    "home.links.certs.desc": "AWS, IAPP, PMI, NVIDIA credentials",
    "home.links.exp.title": "Experience",
    "home.links.exp.desc": "PayPal, Meta, academia & entrepreneurship",
    "home.links.research.title": "Research",
    "home.links.research.desc": "Publications, theses & academic work",

    // Generic
    "common.conferred": "Conferred",
    "common.processing": "Diploma Processing",
    "common.to_collect": "Ready to Collect",
    "common.in_progress": "Currently Pursuing",
  },

  es: {
    // Nav
    "nav.about": "Perfil",
    "nav.degrees": "Títulos",
    "nav.certifications": "Certificaciones",
    "nav.experience": "Experiencia",
    "nav.research": "Investigación",
    "nav.contact": "Contacto",
    "nav.tagline": "Ingeniero · Abogado · Científico de Datos",
    "nav.toggle": "English",

    // Footer
    "footer.tagline": "Polímata · Ingeniero · Abogado · Científico de Datos · Becario Fulbright",
    "footer.location": "San José, California",
    "footer.navigation": "Navegación",
    "footer.contact": "Contacto",
    "footer.rights": "Todos los derechos reservados.",
    "footer.disclaimer": "La información de este sitio se proporciona únicamente con fines informativos y no constituye asesoramiento legal.",

    // Home — hero
    "home.badge": "Candidato al Récord Guinness — Mayor Cantidad de Títulos Universitarios",
    "home.subtitle": "Ingeniero en Informática · Abogado · Doctor · Becario Fulbright · Científico de Datos de Harvard · Profesional Certificado en Privacidad · Arquitecto AWS · Actuario (en curso) · Investigador en Computación Cuántica",
    "home.stat.degrees": "Títulos Universitarios",
    "home.stat.degrees.sub": "3 países · 5 niveles académicos",
    "home.stat.certs": "Certificaciones Profesionales",
    "home.stat.certs.sub": "AWS · IAPP · PMI · NVIDIA",
    "home.stat.years": "Años de Experiencia",
    "home.stat.years.sub": "Ingeniería, Derecho y Academia",
    "home.stat.countries": "Países de Estudio",
    "home.stat.countries.sub": "Argentina · EE.UU. · España",
    "home.cta.degrees": "Ver los 22 Títulos",
    "home.cta.about": "Sobre Gabriel",
    "home.summary": "obtenidos · diploma en trámite · en curso · con apostilla completa y traducción certificada al inglés",

    // Home — record section
    "home.record.label": "Intento de Récord Mundial",
    "home.record.title": "En busca del Récord Guinness a la Mayor Cantidad de Títulos Universitarios",
    "home.record.p1": "Con 22 títulos de nivel universitario que abarcan programas de pregrado, grado, especialización, maestría y doctorado en Argentina, Estados Unidos y España, el Dr. Guillen está reuniendo activamente la documentación necesaria para presentar una solicitud al Récord Mundial Guinness.",
    "home.record.p2": "Cada título se autentica mediante un riguroso proceso de cinco pasos: diploma original, Apostilla de La Haya, traducción certificada al inglés, certificación del colegio de traductores y una segunda Apostilla, garantizando pleno reconocimiento legal internacional.",
    "home.record.cta": "Ver Estado de Documentación →",
    "home.record.conferred": "Títulos Obtenidos",
    "home.record.documented": "Totalmente Documentados",
    "home.record.awaiting": "Diploma en Trámite",
    "home.record.pursuing": "En Curso",
    "home.record.steps": "Pasos de Documentación",
    "home.record.countries": "Países de Estudio",
    "home.record.levels": "Niveles Académicos",

    // Home — domains
    "home.domains.label": "Áreas de Especialización",
    "home.domains.title": "Dominio multidisciplinario en seis áreas.",
    "home.domain.law": "Derecho y Práctica Legal",
    "home.domain.eng": "Ingeniería y Tecnología",
    "home.domain.data": "Ciencia de Datos y Finanzas",
    "home.domain.edu": "Educación y Academia",
    "home.domain.priv": "Privacidad y Cumplimiento",
    "home.domain.biz": "Negocios e Inmobiliario",

    // Home — timeline
    "home.timeline.label": "Trayectoria Académica",
    "home.timeline.title": "15 años de educación continua.",
    "home.timeline.cta": "Ver documentación completa de títulos →",

    // Home — quick links
    "home.links.degrees.title": "Todos los Títulos",
    "home.links.degrees.desc": "22 títulos con estado de documentación y equivalencia",
    "home.links.certs.title": "Certificaciones",
    "home.links.certs.desc": "Credenciales de AWS, IAPP, PMI, NVIDIA",
    "home.links.exp.title": "Experiencia",
    "home.links.exp.desc": "PayPal, Meta, academia y emprendimiento",
    "home.links.research.title": "Investigación",
    "home.links.research.desc": "Publicaciones, tesis y trabajo académico",

    // Generic
    "common.conferred": "Obtenido",
    "common.processing": "Diploma en Trámite",
    "common.to_collect": "Listo para Retirar",
    "common.in_progress": "En Curso",
  },
};
