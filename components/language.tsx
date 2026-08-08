"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Client-side language toggle for the narrative pages (experience, research,
 * contact) plus the shared chrome.
 *
 * Deliberately NOT used by the credential pages. /verification, /verificacion,
 * /disambiguation and /desambiguacion are separate server-rendered URLs,
 * because credential claims have to be crawlable, indexable and archivable
 * with JavaScript disabled — a toggle held in localStorage gives search
 * engines and archives only one language and no stable URL for the other.
 *
 * Dictionary rule: no key in here may contain a credential total. Totals are
 * computed from data/credentials.json by lib/credentials.ts. This file used to
 * hardcode "22 University Degrees" and "17 Certifications" in eight places,
 * which is precisely how the site's headline numbers drifted away from the
 * evidence. Those keys are gone; do not reintroduce them.
 */

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
    "nav.verification": "Verification",
    "nav.tagline": "Attorney · Engineer · Data Scientist",
    "nav.toggle": "Español",

    // Footer
    "footer.tagline": "Attorney · Computer engineer · Data scientist · Fulbright scholar",
    "footer.location": "San Jose, California",
    "footer.navigation": "Navigation",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    "footer.disambiguation": "Not the Gabriel Guillén you were looking for?",
    "footer.verifyBar": "Verify California Bar licence #361094",
    "footer.disclaimer":
      "The information on this site is provided for informational purposes only and does not constitute legal advice.",

    // Contact
    "contact.eyebrow": "Get in Touch",
    "contact.title": "Contact",
    "contact.intro":
      "Whether you are interested in collaboration, speaking engagements, consulting, legal inquiries, or verifying a credential — reach out below.",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.bar": "California State Bar",
    "contact.first": "First name",
    "contact.last": "Last name",
    "contact.org": "Organization / Institution",
    "contact.subject": "Subject",
    "contact.message": "Message",
    "contact.message.ph": "Describe your inquiry...",
    "contact.disclaimer":
      "This form does not create an attorney-client relationship. Do not include confidential information until representation is confirmed.",
    "contact.send": "Send Message",
    "contact.sent.title": "Message sent!",
    "contact.sent.desc": "Thank you for reaching out. I will be in touch soon.",
    "contact.subj.legal": "Legal Consultation",
    "contact.subj.credentials": "Credential Verification",
    "contact.subj.speaking": "Speaking / Media",
    "contact.subj.academic": "Academic Collaboration",
    "contact.subj.tech": "Technology / Engineering",
    "contact.subj.general": "General Inquiry",

    // Experience page
    "exp.eyebrow": "Career History",
    "exp.title": "14+ Years of Experience",
    "exp.intro":
      "From founding a web studio in Buenos Aires to engineering at PayPal and Meta in Silicon Valley — bridging software engineering, legal practice, data science, and academia across three continents.",
    "exp.stat.roles": "Roles",
    "exp.stat.countries": "Countries",
    "exp.stat.start": "Career Start",

    // Research page
    "res.eyebrow": "Academic Work",
    "res.title": "Research & Publications",
    "res.intro":
      "Doctoral dissertation, Harvard capstone, and research papers spanning quantitative finance, epidemiology, social media analytics, and natural language processing.",
    "res.thesis.label": "Doctoral Dissertation",
    "res.papers.label": "Research Papers & Projects",
    "res.methods.label": "Research Methods & Tools",
  },

  es: {
    // Nav
    "nav.about": "Perfil",
    "nav.degrees": "Títulos",
    "nav.certifications": "Certificaciones",
    "nav.experience": "Experiencia",
    "nav.research": "Investigación",
    "nav.contact": "Contacto",
    "nav.verification": "Verificación",
    "nav.tagline": "Abogado · Ingeniero · Científico de Datos",
    "nav.toggle": "English",

    // Footer
    "footer.tagline":
      "Abogado · Ingeniero en informática · Científico de datos · Becario Fulbright",
    "footer.location": "San José, California",
    "footer.navigation": "Navegación",
    "footer.contact": "Contacto",
    "footer.rights": "Todos los derechos reservados.",
    "footer.disambiguation": "¿Buscaba a otro Gabriel Guillén?",
    "footer.verifyBar": "Verificar la licencia #361094 del Colegio de Abogados de California",
    "footer.disclaimer":
      "La información de este sitio se proporciona únicamente con fines informativos y no constituye asesoramiento legal.",

    // Contact
    "contact.eyebrow": "Ponte en Contacto",
    "contact.title": "Contacto",
    "contact.intro":
      "Ya sea que te interese una colaboración, conferencias, consultoría, consultas legales o verificar una credencial — escríbeme a continuación.",
    "contact.email": "Correo",
    "contact.phone": "Teléfono",
    "contact.bar": "Colegio de Abogados de California",
    "contact.first": "Nombre",
    "contact.last": "Apellido",
    "contact.org": "Organización / Institución",
    "contact.subject": "Asunto",
    "contact.message": "Mensaje",
    "contact.message.ph": "Describe tu consulta...",
    "contact.disclaimer":
      "Este formulario no crea una relación abogado-cliente. No incluyas información confidencial hasta confirmar la representación.",
    "contact.send": "Enviar Mensaje",
    "contact.sent.title": "¡Mensaje enviado!",
    "contact.sent.desc": "Gracias por escribir. Me pondré en contacto pronto.",
    "contact.subj.legal": "Consulta Legal",
    "contact.subj.credentials": "Verificación de Credenciales",
    "contact.subj.speaking": "Conferencias / Prensa",
    "contact.subj.academic": "Colaboración Académica",
    "contact.subj.tech": "Tecnología / Ingeniería",
    "contact.subj.general": "Consulta General",

    // Experience page
    "exp.eyebrow": "Trayectoria Profesional",
    "exp.title": "Más de 14 Años de Experiencia",
    "exp.intro":
      "Desde fundar un estudio web en Buenos Aires hasta la ingeniería en PayPal y Meta en Silicon Valley — uniendo ingeniería de software, práctica legal, ciencia de datos y academia en tres continentes.",
    "exp.stat.roles": "Cargos",
    "exp.stat.countries": "Países",
    "exp.stat.start": "Inicio de Carrera",

    // Research page
    "res.eyebrow": "Trabajo Académico",
    "res.title": "Investigación y Publicaciones",
    "res.intro":
      "Tesis doctoral, proyecto final de Harvard y artículos de investigación que abarcan finanzas cuantitativas, epidemiología, análisis de redes sociales y procesamiento de lenguaje natural.",
    "res.thesis.label": "Tesis Doctoral",
    "res.papers.label": "Artículos y Proyectos de Investigación",
    "res.methods.label": "Métodos y Herramientas de Investigación",
  },
};
