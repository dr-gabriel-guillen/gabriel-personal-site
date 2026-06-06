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

    // About
    "about.eyebrow": "About",
    "about.contact_line": "San Jose, California · +1 (470) 685-8701",
    "about.bio1": "Dr. Gabriel B. Guillen is a computer engineer, attorney, data scientist, and polymath based in San Jose, California. He holds 22 university-level degrees — spanning engineering, law, mathematics, economics, education, philosophy, and health sciences — earned across Argentina, the United States, and Spain over 15 years of continuous academic study.",
    "about.bio2": "Professionally, he currently serves as a Sr. Software Engineer and Project Leader at PayPal, where he leads cross-border wallet interoperability initiatives and serves as the team's Legal & Privacy liaison. He previously engineered ML pipelines at Meta (Sunnyvale) and led multinational software teams as a country manager.",
    "about.bio3": "A Fulbright Scholar, he completed his Master's in Financial Engineering at Lehigh University (2020) and his Master's in Data Science at Harvard University (2022, CGPA 3.77). His doctoral dissertation at UNLaM applied bio-inspired metaheuristic algorithms to predict high-volatility stock markets.",
    "about.bio4": "Admitted to the California State Bar (License #361094) in 2025 and previously to the Buenos Aires Bar in 2022, he combines deep technical expertise with active legal practice in privacy, technology, and corporate law.",
    "about.credentials": "Selected Credentials",
    "about.languages": "Languages",
    "about.connect": "Connect",
    "about.cta.title": "Explore the full record",
    "about.cta.desc": "Browse all 22 degrees with documentation status, or review 17 professional certifications.",
    "about.lang.spanish": "Spanish",
    "about.lang.spanish.level": "Native",
    "about.lang.english": "English",
    "about.lang.english.level": "Professional (C2)",

    // Contact
    "contact.eyebrow": "Get in Touch",
    "contact.title": "Contact",
    "contact.intro": "Whether you are interested in collaboration, speaking engagements, consulting, legal inquiries, or the Guinness World Record initiative — reach out below.",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.bar": "California State Bar",
    "contact.first": "First name",
    "contact.last": "Last name",
    "contact.org": "Organization / Institution",
    "contact.subject": "Subject",
    "contact.message": "Message",
    "contact.message.ph": "Describe your inquiry...",
    "contact.disclaimer": "This form does not create an attorney-client relationship. Do not include confidential information until representation is confirmed.",
    "contact.send": "Send Message",
    "contact.sent.title": "Message sent!",
    "contact.sent.desc": "Thank you for reaching out. I will be in touch soon.",
    "contact.subj.guinness": "Guinness World Record Inquiry",
    "contact.subj.legal": "Legal Consultation",
    "contact.subj.speaking": "Speaking / Media",
    "contact.subj.academic": "Academic Collaboration",
    "contact.subj.tech": "Technology / Engineering",
    "contact.subj.general": "General Inquiry",

    // Degrees page
    "deg.badge": "Guinness World Record Candidate",
    "deg.title": "22 University Degrees",
    "deg.intro": "Earned across Argentina, the United States, and Spain — spanning five academic levels from pre-graduate through doctorate. Completed degrees are authenticated through a five-step international pipeline for Guinness World Records submission.",
    "deg.pursuing_note": "Additionally pursuing 3 more degrees currently in progress.",
    "deg.stat.conferred": "Conferred",
    "deg.stat.documented": "Fully Documented (5/5)",
    "deg.stat.processing": "Diploma Processing",
    "deg.stat.collect": "Ready to Collect",
    "deg.stat.pursuing": "Currently Pursuing",
    "deg.pipeline.title": "International Documentation Pipeline (Spanish-Language Degrees — Argentina & Spain)",
    "deg.pipeline.note": "US degrees (Lehigh, Harvard, University of the People) are issued in English — no translation pipeline required.",
    "deg.status_label": "Status:",
    "deg.filter": "Filter:",
    "deg.all_levels": "All Levels",
    "deg.all_countries": "All Countries",
    "deg.all_statuses": "All Statuses",
    "deg.shown": "shown",
    "deg.equiv.label": "Degree Equivalency",
    "deg.equiv.title": "Argentine & Spanish Degrees in the U.S. Academic Context",
    "deg.docs": "Docs",

    // Certifications page
    "cert.eyebrow": "Professional Credentials",
    "cert.title": "17 Certifications",
    "cert.intro": "Professional certifications spanning cloud architecture, data privacy, project management, artificial intelligence, and legal practice — from AWS, IAPP, PMI, NVIDIA, and the California State Bar.",
    "cert.privacy.label": "Privacy Depth",
    "cert.privacy.title": "6 IAPP Credentials — All Major Privacy Jurisdictions",
    "cert.privacy.desc": "Holding CIPP certifications for the United States, Europe, and Canada — plus the CIPT (technology), CIPM (management), and AIGP (AI governance) credentials — Dr. Guillen is among a small global cohort to hold all principal IAPP certifications simultaneously.",
    "cert.aws.label": "AWS Depth",
    "cert.aws.title": "7 AWS Credentials — Professional Through Specialty",
    "cert.aws.desc": "Dual Professional-level certifications (Solutions Architect + DevOps Engineer), three Specialty-level credentials (ML, Security, Advanced Networking), plus Associate and Foundational credentials — covering the full AWS professional certification track.",

    // Experience page
    "exp.eyebrow": "Career History",
    "exp.title": "14+ Years of Experience",
    "exp.intro": "From founding a web studio in Buenos Aires to engineering at PayPal and Meta in Silicon Valley — bridging software engineering, legal practice, data science, and academia across three continents.",
    "exp.stat.roles": "Roles",
    "exp.stat.countries": "Countries",
    "exp.stat.start": "Career Start",

    // Research page
    "res.eyebrow": "Academic Work",
    "res.title": "Research & Publications",
    "res.intro": "Doctoral dissertation, Harvard capstone, and research papers spanning quantitative finance, epidemiology, social media analytics, and natural language processing.",
    "res.thesis.label": "Doctoral Dissertation",
    "res.papers.label": "Research Papers & Projects",
    "res.methods.label": "Research Methods & Tools",
    "level.pre_grad": "Pre-Graduate",
    "level.grad": "Bachelor's",
    "level.specialist": "Specialist",
    "level.master": "Master's",
    "level.doctorate": "Doctorate",
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

    // About
    "about.eyebrow": "Perfil",
    "about.contact_line": "San José, California · +1 (470) 685-8701",
    "about.bio1": "El Dr. Gabriel B. Guillen es ingeniero en informática, abogado, científico de datos y polímata radicado en San José, California. Posee 22 títulos de nivel universitario —en ingeniería, derecho, matemática, economía, educación, filosofía y ciencias de la salud— obtenidos en Argentina, Estados Unidos y España a lo largo de 15 años de estudio académico continuo.",
    "about.bio2": "Profesionalmente, se desempeña como Ingeniero de Software Senior y Líder de Proyecto en PayPal, donde lidera iniciativas de interoperabilidad de billeteras transfronterizas y actúa como enlace Legal y de Privacidad del equipo. Anteriormente desarrolló pipelines de aprendizaje automático en Meta (Sunnyvale) y dirigió equipos de software multinacionales como country manager.",
    "about.bio3": "Becario Fulbright, completó su Maestría en Ingeniería Financiera en Lehigh University (2020) y su Maestría en Ciencia de Datos en Harvard University (2022, promedio 3.77). Su tesis doctoral en la UNLaM aplicó algoritmos metaheurísticos bioinspirados para predecir mercados bursátiles de alta volatilidad.",
    "about.bio4": "Admitido al Colegio de Abogados de California (Licencia #361094) en 2025 y previamente al Colegio de Abogados de Buenos Aires en 2022, combina una profunda experiencia técnica con la práctica legal activa en privacidad, tecnología y derecho corporativo.",
    "about.credentials": "Credenciales Seleccionadas",
    "about.languages": "Idiomas",
    "about.connect": "Contacto",
    "about.cta.title": "Explora el registro completo",
    "about.cta.desc": "Consulta los 22 títulos con su estado de documentación, o revisa las 17 certificaciones profesionales.",
    "about.lang.spanish": "Español",
    "about.lang.spanish.level": "Nativo",
    "about.lang.english": "Inglés",
    "about.lang.english.level": "Profesional (C2)",

    // Contact
    "contact.eyebrow": "Ponte en Contacto",
    "contact.title": "Contacto",
    "contact.intro": "Ya sea que te interese una colaboración, conferencias, consultoría, consultas legales o la iniciativa del Récord Mundial Guinness — escríbeme a continuación.",
    "contact.email": "Correo",
    "contact.phone": "Teléfono",
    "contact.bar": "Colegio de Abogados de California",
    "contact.first": "Nombre",
    "contact.last": "Apellido",
    "contact.org": "Organización / Institución",
    "contact.subject": "Asunto",
    "contact.message": "Mensaje",
    "contact.message.ph": "Describe tu consulta...",
    "contact.disclaimer": "Este formulario no crea una relación abogado-cliente. No incluyas información confidencial hasta confirmar la representación.",
    "contact.send": "Enviar Mensaje",
    "contact.sent.title": "¡Mensaje enviado!",
    "contact.sent.desc": "Gracias por escribir. Me pondré en contacto pronto.",
    "contact.subj.guinness": "Consulta sobre Récord Guinness",
    "contact.subj.legal": "Consulta Legal",
    "contact.subj.speaking": "Conferencias / Prensa",
    "contact.subj.academic": "Colaboración Académica",
    "contact.subj.tech": "Tecnología / Ingeniería",
    "contact.subj.general": "Consulta General",

    // Degrees page
    "deg.badge": "Candidato al Récord Mundial Guinness",
    "deg.title": "22 Títulos Universitarios",
    "deg.intro": "Obtenidos en Argentina, Estados Unidos y España, abarcando cinco niveles académicos desde pregrado hasta doctorado. Los títulos completados se autentican mediante un proceso internacional de cinco pasos para la presentación al Récord Mundial Guinness.",
    "deg.pursuing_note": "Además, cursando 3 títulos más actualmente en progreso.",
    "deg.stat.conferred": "Obtenidos",
    "deg.stat.documented": "Totalmente Documentados (5/5)",
    "deg.stat.processing": "Diploma en Trámite",
    "deg.stat.collect": "Listos para Retirar",
    "deg.stat.pursuing": "En Curso",
    "deg.pipeline.title": "Proceso de Documentación Internacional (Títulos en Español — Argentina y España)",
    "deg.pipeline.note": "Los títulos de EE.UU. (Lehigh, Harvard, University of the People) se emiten en inglés — no requieren proceso de traducción.",
    "deg.status_label": "Estado:",
    "deg.filter": "Filtrar:",
    "deg.all_levels": "Todos los Niveles",
    "deg.all_countries": "Todos los Países",
    "deg.all_statuses": "Todos los Estados",
    "deg.shown": "mostrados",
    "deg.equiv.label": "Equivalencia de Títulos",
    "deg.equiv.title": "Títulos Argentinos y Españoles en el Contexto Académico de EE.UU.",
    "deg.docs": "Docs",

    // Certifications page
    "cert.eyebrow": "Credenciales Profesionales",
    "cert.title": "17 Certificaciones",
    "cert.intro": "Certificaciones profesionales que abarcan arquitectura en la nube, privacidad de datos, gestión de proyectos, inteligencia artificial y práctica legal — de AWS, IAPP, PMI, NVIDIA y el Colegio de Abogados de California.",
    "cert.privacy.label": "Profundidad en Privacidad",
    "cert.privacy.title": "6 Credenciales IAPP — Todas las Jurisdicciones Principales de Privacidad",
    "cert.privacy.desc": "Con certificaciones CIPP para Estados Unidos, Europa y Canadá —además de las credenciales CIPT (tecnología), CIPM (gestión) y AIGP (gobernanza de IA)— el Dr. Guillen pertenece a un reducido grupo global que posee simultáneamente todas las certificaciones principales de la IAPP.",
    "cert.aws.label": "Profundidad en AWS",
    "cert.aws.title": "7 Credenciales AWS — De Profesional a Especialidad",
    "cert.aws.desc": "Dos certificaciones de nivel Profesional (Solutions Architect + DevOps Engineer), tres credenciales de Especialidad (ML, Seguridad, Redes Avanzadas), más credenciales Associate y Foundational — cubriendo toda la trayectoria de certificación profesional de AWS.",

    // Experience page
    "exp.eyebrow": "Trayectoria Profesional",
    "exp.title": "Más de 14 Años de Experiencia",
    "exp.intro": "Desde fundar un estudio web en Buenos Aires hasta la ingeniería en PayPal y Meta en Silicon Valley — uniendo ingeniería de software, práctica legal, ciencia de datos y academia en tres continentes.",
    "exp.stat.roles": "Cargos",
    "exp.stat.countries": "Países",
    "exp.stat.start": "Inicio de Carrera",

    // Research page
    "res.eyebrow": "Trabajo Académico",
    "res.title": "Investigación y Publicaciones",
    "res.intro": "Tesis doctoral, proyecto final de Harvard y artículos de investigación que abarcan finanzas cuantitativas, epidemiología, análisis de redes sociales y procesamiento de lenguaje natural.",
    "res.thesis.label": "Tesis Doctoral",
    "res.papers.label": "Artículos y Proyectos de Investigación",
    "res.methods.label": "Métodos y Herramientas de Investigación",
    "level.pre_grad": "Pregrado",
    "level.grad": "Grado / Licenciatura",
    "level.specialist": "Especialización",
    "level.master": "Maestría",
    "level.doctorate": "Doctorado",
  },
};
