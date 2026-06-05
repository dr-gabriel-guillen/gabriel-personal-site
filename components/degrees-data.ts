export type DocStatus =
  | "original_spanish"
  | "original_english"
  | "apostille"
  | "english_translation"
  | "translator_cert"
  | "second_apostille";

export type DegreeStatus =
  | "in_hand"       // "En mano" — conferred, diploma in hand
  | "processing"    // "En trámite" — finished studying, diploma being issued
  | "to_collect"    // "A retirar" — diploma ready, pending pickup
  | "in_progress";  // Currently enrolled/pursuing

export type DegreeLevel =
  | "pre_grad"
  | "grad"
  | "specialist"
  | "master"
  | "doctorate";

export interface Degree {
  id: number;
  level: DegreeLevel;
  titleEs: string;
  titleEn: string;
  university: string;
  universityDomain?: string; // for logo via clearbit
  country: "Argentina" | "USA" | "Spain";
  year: number | null;
  estimatedYear?: number;
  status: DegreeStatus;
  docs: DocStatus[];
  highlights?: string[];
  file?: string;
}

export const DEGREES: Degree[] = [
  // PRE-GRAD / TERCIARIO — ordered by importance
  {
    id: 2,
    level: "pre_grad",
    titleEs: "Traductor Técnico Científico en lengua inglesa",
    titleEn: "Technical-Scientific Translator (English)",
    university: "Liceo Superior de Cultura Inglesa",
    universityDomain: "liceosuperior.edu.ar",
    country: "Argentina",
    year: 2021,
    status: "in_hand",
    docs: ["original_spanish", "apostille", "english_translation", "translator_cert", "second_apostille"],
    file: "08_Technical_Translator.pdf",
  },
  {
    id: 3,
    level: "pre_grad",
    titleEs: "Martillero, Corredor Público y Corredor Inmobiliario",
    titleEn: "Auctioneer, Public Broker & Real Estate Broker",
    university: "Universidad Empresarial Siglo XXI",
    universityDomain: "siglo21.edu.ar",
    country: "Argentina",
    year: 2022,
    status: "in_hand",
    docs: ["original_spanish", "apostille", "english_translation", "translator_cert", "second_apostille"],
    file: "13_broker_degree.pdf",
  },
  {
    id: 1,
    level: "pre_grad",
    titleEs: "Operador en Psicología Social",
    titleEn: "Social Psychology Practitioner",
    university: "Escuela Superior de Psicología Social",
    country: "Argentina",
    year: 2014,
    status: "in_hand",
    docs: ["original_spanish", "apostille", "english_translation", "translator_cert", "second_apostille"],
    file: "01_Social_Psycology_Practitioner.pdf",
  },

  // GRADO / BACHELOR — ordered by importance
  {
    id: 8,
    level: "grad",
    titleEs: "Abogado",
    titleEn: "Juris Doctor (J.D.)",
    university: "Universidad Nacional del Chaco Austral",
    universityDomain: "uncaus.edu.ar",
    country: "Argentina",
    year: 2021,
    status: "in_hand",
    docs: ["original_spanish", "apostille", "english_translation", "translator_cert", "second_apostille"],
    highlights: [
      "Admitted to the Buenos Aires State Bar (2022)",
      "Admitted to the California State Bar (2025) — License #361094",
    ],
    file: "09_Attorney.pdf",
  },
  {
    id: 4,
    level: "grad",
    titleEs: "Ingeniero en Informática",
    titleEn: "Computer Engineer",
    university: "Universidad Nacional de la Matanza",
    universityDomain: "unlam.edu.ar",
    country: "Argentina",
    year: 2014,
    status: "in_hand",
    docs: ["original_spanish", "apostille", "english_translation", "translator_cert", "second_apostille"],
    highlights: ["Member of the National Professional Council of Telecommunications, Electronics & Computing (CPETI)"],
    file: "02_ComputerEngineer.pdf",
  },
  {
    id: 5,
    level: "grad",
    titleEs: "Contador Público Nacional",
    titleEn: "Certified Public Accountant (CPA)",
    university: "Universidad Nacional de Quilmes",
    universityDomain: "unq.edu.ar",
    country: "Argentina",
    year: 2016,
    status: "in_hand",
    docs: ["original_spanish", "apostille", "english_translation", "translator_cert", "second_apostille"],
    highlights: ["Admitted as CPA at the Professional Council of Economic Sciences of Buenos Aires (2018)"],
    file: "03_CPA_degree.pdf",
  },
  {
    id: 6,
    level: "grad",
    titleEs: "Licenciado en Administración",
    titleEn: "Bachelor of Business Administration",
    university: "Universidad Nacional de Quilmes",
    universityDomain: "unq.edu.ar",
    country: "Argentina",
    year: 2016,
    status: "in_hand",
    docs: ["original_spanish", "apostille", "english_translation", "translator_cert", "second_apostille"],
    file: "04_Business_bachelor.pdf",
  },
  {
    id: 7,
    level: "grad",
    titleEs: "Profesor de Enseñanza de Nivel Medio y Superior en Matemática",
    titleEn: "University Mathematics Professor",
    university: "Universidad Nacional de Río Negro",
    universityDomain: "unrn.edu.ar",
    country: "Argentina",
    year: 2017,
    status: "in_hand",
    docs: ["original_spanish", "apostille", "english_translation", "translator_cert", "second_apostille"],
    file: "06_Teacher_Degree.pdf",
  },
  {
    id: 9,
    level: "grad",
    titleEs: "Escribano",
    titleEn: "Notary Public",
    university: "Universidad Empresarial Siglo XXI",
    universityDomain: "siglo21.edu.ar",
    country: "Argentina",
    year: 2022,
    status: "in_hand",
    docs: ["original_spanish", "apostille", "english_translation", "translator_cert", "second_apostille"],
    file: "14_notarial_degree.pdf",
  },
  {
    id: 10,
    level: "grad",
    titleEs: "Traductor Público en inglés",
    titleEn: "Sworn Public Translator (English)",
    university: "Universidad de Concepción del Uruguay",
    universityDomain: "ucu.edu.ar",
    country: "Argentina",
    year: 2024,
    status: "in_hand",
    docs: ["original_spanish", "apostille", "english_translation", "translator_cert", "second_apostille"],
    file: "15_public_translator.pdf",
  },
  {
    id: 11,
    level: "grad",
    titleEs: "Licenciatura en Gestión de Negocios Inmobiliarios",
    titleEn: "Bachelor in Real Estate Business Management",
    university: "Universidad Empresarial Siglo XXI",
    universityDomain: "siglo21.edu.ar",
    country: "Argentina",
    year: 2025,
    status: "to_collect",
    docs: ["original_spanish"],
  },
  {
    id: 12,
    level: "grad",
    titleEs: "Actuario",
    titleEn: "Actuary",
    university: "Universidad Empresarial Siglo XXI",
    universityDomain: "siglo21.edu.ar",
    country: "Argentina",
    year: 2026,
    status: "processing",
    docs: [],
  },
  {
    id: 13,
    level: "grad",
    titleEs: "Bachelor en Ciencias de la Salud",
    titleEn: "Bachelor in Health Sciences",
    university: "University of the People",
    universityDomain: "uopeople.edu",
    country: "USA",
    year: null,
    estimatedYear: 2028,
    status: "in_progress",
    docs: [],
  },

  // ESPECIALIZACIÓN — ordered by importance
  {
    id: 15,
    level: "specialist",
    titleEs: "Especialista en Industria Petroquímica",
    titleEn: "Specialist in Petrochemical Industry",
    university: "Universidad Nacional de General San Martín",
    universityDomain: "unsam.edu.ar",
    country: "Argentina",
    year: 2021,
    status: "in_hand",
    docs: ["original_spanish", "apostille", "english_translation", "translator_cert", "second_apostille"],
    file: "10_petro_chemical.pdf",
  },
  {
    id: 14,
    level: "specialist",
    titleEs: "Especialista en Higiene y Seguridad en el Trabajo",
    titleEn: "Specialist in Occupational Health & Safety",
    university: "Universidad de Morón",
    universityDomain: "unimoron.edu.ar",
    country: "Argentina",
    year: 2016,
    status: "in_hand",
    docs: ["original_spanish", "apostille", "english_translation", "translator_cert", "second_apostille"],
    file: "05_Specialist_Safety.pdf",
  },
  {
    id: 16,
    level: "specialist",
    titleEs: "Especialista en Docencia en Entornos Virtuales",
    titleEn: "Specialist in Teaching in Virtual Environments",
    university: "Universidad Nacional de Quilmes",
    universityDomain: "unq.edu.ar",
    country: "Argentina",
    year: 2021,
    status: "in_hand",
    docs: ["original_spanish", "apostille", "english_translation", "translator_cert", "second_apostille"],
    file: "11_Online_education_degree.pdf",
  },
  {
    id: 17,
    level: "specialist",
    titleEs: "Especialista en Evaluación Universitaria",
    titleEn: "Specialist in University Assessment",
    university: "Universidad de Buenos Aires",
    universityDomain: "uba.ar",
    country: "Argentina",
    year: 2026,
    status: "to_collect",
    docs: ["original_spanish"],
  },

  // MASTER — ordered by importance: Harvard first, then Lehigh, then others
  {
    id: 20,
    level: "master",
    titleEs: "Master en Ciencia de Datos",
    titleEn: "Master in Data Science",
    university: "Harvard University",
    universityDomain: "harvard.edu",
    country: "USA",
    year: 2021,
    status: "in_hand",
    docs: ["original_english"],
    highlights: [
      "CGPA: 3.77",
      "Capstone: Lyme Disease Incidence Rate Modeling & Risk Assessment Mapping",
      "Research: COVID-19 spread prediction using Google Mobility data",
      "Research: Benford's Law applied to Twitter data",
    ],
  },
  {
    id: 19,
    level: "master",
    titleEs: "Master of Science in Financial Engineering",
    titleEn: "Master of Science in Financial Engineering",
    university: "Lehigh University",
    universityDomain: "lehigh.edu",
    country: "USA",
    year: 2020,
    status: "in_hand",
    docs: ["original_english"],
    highlights: [
      "Fulbright Scholarship Recipient",
      "2020 Bloomberg Competition Participant",
      "2019 IAFC Competition Participant",
      "Graduate Senate Representative",
    ],
  },
  {
    id: 18,
    level: "master",
    titleEs: "Master en Administración de Empresas de Base Tecnológica",
    titleEn: "MBA in Technology-Based Business",
    university: "Universidad Europea del Atlántico",
    universityDomain: "uneatlantico.es",
    country: "Spain",
    year: 2018,
    status: "in_hand",
    docs: ["original_spanish", "apostille", "english_translation", "translator_cert", "second_apostille"],
    file: "07_master_IT.pdf",
  },
  {
    id: 21,
    level: "master",
    titleEs: "Master en Ingeniería Matemática y Computación",
    titleEn: "Master in Mathematical Engineering & Computer Science",
    university: "Universidad Internacional de La Rioja",
    universityDomain: "unir.net",
    country: "Spain",
    year: 2025,
    status: "to_collect",
    docs: ["original_spanish"],
  },
  {
    id: 22,
    level: "master",
    titleEs: "Master en Educación",
    titleEn: "Master in Education",
    university: "Universidad Nacional de Quilmes",
    universityDomain: "unq.edu.ar",
    country: "Argentina",
    year: 2026,
    status: "processing",
    docs: [],
  },
  {
    id: 23,
    level: "master",
    titleEs: "Master en Filosofía",
    titleEn: "Master in Philosophy",
    university: "Universidad Nacional de Quilmes",
    universityDomain: "unq.edu.ar",
    country: "Argentina",
    year: null,
    estimatedYear: 2027,
    status: "in_progress",
    docs: [],
  },
  {
    id: 24,
    level: "master",
    titleEs: "Master en Computación Cuántica",
    titleEn: "Master in Quantum Computing",
    university: "Universidad Internacional de La Rioja",
    universityDomain: "unir.net",
    country: "Spain",
    year: null,
    estimatedYear: 2027,
    status: "in_progress",
    docs: [],
  },

  // DOCTORADO
  {
    id: 25,
    level: "doctorate",
    titleEs: "Doctor en Ciencias Económicas",
    titleEn: "PhD in Economic Sciences",
    university: "Universidad Nacional de la Matanza",
    universityDomain: "unlam.edu.ar",
    country: "Argentina",
    year: 2021,
    status: "in_hand",
    docs: ["original_spanish", "apostille", "english_translation", "translator_cert", "second_apostille"],
    highlights: [
      "Thesis: Use of bio-inspired metaheuristic methods for modeling and prediction of high-volatility stock markets: The Argentinian Case",
    ],
    file: "12_PHD.pdf",
  },
];

export const DOC_LABELS: Record<DocStatus, string> = {
  original_spanish: "Original Diploma (Spanish)",
  original_english: "Original Diploma (English)",
  apostille: "Apostille (The Hague)",
  english_translation: "Certified English Translation",
  translator_cert: "Translator Association Certification",
  second_apostille: "Second Apostille",
};

export const LEVEL_LABELS: Record<DegreeLevel, string> = {
  pre_grad:   "Pre-Graduate",
  grad:       "Bachelor's",
  specialist: "Specialist",
  master:     "Master's",
  doctorate:  "Doctorate",
};

export const STATUS_LABELS: Record<DegreeStatus, string> = {
  in_hand: "Conferred",
  processing: "Diploma Processing",
  to_collect: "Ready to Collect",
  in_progress: "Currently Pursuing",
};
