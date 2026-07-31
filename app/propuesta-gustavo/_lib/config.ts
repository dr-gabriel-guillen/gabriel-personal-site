// Configuración central de /propuesta-gustavo.
// Todo lo que puede cambiar (archivos, video, audio, CV) se toca SOLO acá.

export const CONTACTO_EMAIL = "guillengus@yahoo.com.ar";
export const CONTACTO_ASUNTO =
  "Reunión de trabajo — Programa Piloto de Propuestas Vecinales";

// ── Currículum ────────────────────────────────────────────────────────────────
// TODO: cuando exista el CV, guardarlo como
//   private/propuesta-gustavo/pdf/cv-gustavo-guillen.pdf
// y cambiar este booleano a true. No hay que tocar nada más.
export const CV_DISPONIBLE = false;

// ── Video y audio ─────────────────────────────────────────────────────────────
// Los archivos pesados (35 MB + 21 MB) NO viven en el repo ni pasan por
// Amplify (corta respuestas de ~6 MB): viven en el bucket S3 PRIVADO
// (PROPUESTA_S3_BUCKET) bajo media/, y la ruta protegida redirige a un link
// firmado tras validar la cookie. `src` es la key dentro de media/ en S3.
// Si `src` está vacío o el bucket no está configurado, la tarjeta muestra
// "Disponible a pedido". `youtubeId` (no listado, youtube-nocookie) sigue
// disponible como alternativa y tiene prioridad si ambos están.
export const MEDIA = {
  video: {
    titulo: "Video explicativo",
    duracion: "7:31",
    descripcion:
      "Recorre el problema, la propuesta, el circuito y los límites del programa.",
    youtubeId: "",
    src: "piloto-90-dias.mp4", // key en s3://<bucket>/media/
    poster: "",
  },
  audio: {
    titulo: "Resumen en audio",
    duracion: "11:00",
    descripcion:
      "Conversación entre dos voces que repasa la propuesta completa.",
    youtubeId: "",
    src: "organizar-propuestas-vecinales.m4a", // key en s3://<bucket>/media/
    poster: "",
  },
} as const;

// ── Archivos descargables ─────────────────────────────────────────────────────
// Lista blanca EXPLÍCITA: la ruta /propuesta-gustavo/archivo/<slug> solo sirve
// lo que figura acá. Cualquier otro slug devuelve 404. Nunca se concatena la
// URL contra el filesystem.
export interface ArchivoDef {
  /** ruta relativa dentro de private/propuesta-gustavo/ (archivos chicos) */
  rel?: string;
  /** key en el bucket privado (archivos grandes: se redirige a link firmado) */
  s3Key?: string;
  contentType: string;
  /** attachment = descarga; inline = se muestra (figuras, miniaturas, media) */
  disposition: "attachment" | "inline";
  /** nombre limpio con el que se descarga */
  nombre?: string;
}

export const ARCHIVOS: Record<string, ArchivoDef> = {
  // Documentos descargables
  "pdf/3-Resumen-de-una-pagina.pdf": {
    rel: "pdf/3-Resumen-de-una-pagina.pdf",
    contentType: "application/pdf",
    disposition: "attachment",
    nombre: "Resumen-de-una-pagina.pdf",
  },
  "pdf/2-Proyecto-Programa-Piloto.pdf": {
    rel: "pdf/2-Proyecto-Programa-Piloto.pdf",
    contentType: "application/pdf",
    disposition: "attachment",
    nombre: "Proyecto-Programa-Piloto.pdf",
  },
  "pdf/8-Presentacion-completa.pdf": {
    rel: "pdf/8-Presentacion-completa.pdf",
    contentType: "application/pdf",
    disposition: "attachment",
    nombre: "Presentacion-completa.pdf",
  },
  "xlsx/7-Plantillas-operativas.xlsx": {
    rel: "xlsx/7-Plantillas-operativas.xlsx",
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    disposition: "attachment",
    nombre: "Plantillas-operativas.xlsx",
  },
  "docx/2-Proyecto-Programa-Piloto.docx": {
    rel: "docx/2-Proyecto-Programa-Piloto.docx",
    contentType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    disposition: "attachment",
    nombre: "Proyecto-Programa-Piloto.docx",
  },
  "pptx/8-Presentacion-completa.pptx": {
    rel: "pptx/8-Presentacion-completa.pptx",
    contentType:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    disposition: "attachment",
    nombre: "Presentacion-completa.pptx",
  },
  // El ZIP (7 MB) supera el límite de respuesta de Amplify → S3 firmado.
  "zip/Propuesta-Programa-Piloto-completo.zip": {
    s3Key: "zip/Propuesta-Programa-Piloto-completo.zip",
    contentType: "application/zip",
    disposition: "attachment",
    nombre: "Propuesta-Programa-Piloto-completo.zip",
  },
  // TODO CV: se activa con CV_DISPONIBLE = true (ver arriba)
  "pdf/cv-gustavo-guillen.pdf": {
    rel: "pdf/cv-gustavo-guillen.pdf",
    contentType: "application/pdf",
    disposition: "attachment",
    nombre: "CV-Gustavo-Guillen.pdf",
  },
  // Figuras (se muestran dentro de la página, también protegidas)
  ...Object.fromEntries(
    [
      "f1-cronograma",
      "f2-circuito",
      "f3-posicion",
      "f4-entregables",
      "f5-indicadores",
      "f6-continuidad",
      "f7-localidades",
      "f8-matriz",
      "f9-datos",
      "f10-ritmo",
    ].map((f) => [
      `img/${f}.png`,
      {
        rel: `img/${f}.png`,
        contentType: "image/png",
        disposition: "inline" as const,
      },
    ]),
  ),
  // Video/audio en S3 (solo si se configuró MEDIA.*.src; ver arriba)
  ...(MEDIA.video.src
    ? {
        [`media/${MEDIA.video.src}`]: {
          s3Key: `media/${MEDIA.video.src}`,
          contentType: "video/mp4",
          disposition: "inline" as const,
        },
      }
    : {}),
  ...(MEDIA.audio.src
    ? {
        [`media/${MEDIA.audio.src}`]: {
          s3Key: `media/${MEDIA.audio.src}`,
          contentType: "audio/mp4",
          disposition: "inline" as const,
        },
      }
    : {}),
  // Miniaturas de primera página para las tarjetas de descarga
  ...Object.fromEntries(
    [
      "2-Proyecto-Programa-Piloto-01",
      "3-Resumen-de-una-pagina-1",
      "8-Presentacion-completa-01",
    ].map((f) => [
      `preview/${f}.jpg`,
      {
        rel: `preview/${f}.jpg`,
        contentType: "image/jpeg",
        disposition: "inline" as const,
      },
    ]),
  ),
};

/** URL pública (protegida por middleware + cookie) de un slug de la lista blanca */
export function archivoUrl(slug: string): string {
  return `/propuesta-gustavo/archivo/${slug}`;
}

/** Peso mostrado del ZIP (vive en S3, no se puede hacer fs.stat).
 *  Actualizar si se regenera el ZIP (ver private/propuesta-gustavo/README.md). */
export const ZIP_PESO = "6,8 MB";

// ── Figuras de la sección "Cómo funciona" ────────────────────────────────────
export interface Figura {
  slug: string;
  width: number;
  height: number;
  titulo: string;
  alt: string;
}

export const FIGURAS_PRINCIPALES: Figura[] = [
  {
    slug: "img/f2-circuito.png",
    width: 2448,
    height: 1344,
    titulo: "De un mensaje suelto a un expediente",
    alt: "Diagrama del circuito de una propuesta en ocho pasos: se recibe, se registra con número de caso y seis datos, se clasifica por localidad y tema, se verifica la competencia, se prioriza, se convierte en ficha de una carilla, se sigue en un tablero, y se informa y devuelve al vecino. Abajo, los cuatro destinos posibles de una ficha según el artículo 77 de la Ley Orgánica de las Municipalidades: comunicación, resolución, ordenanza o gestión directa.",
  },
  {
    slug: "img/f1-cronograma.png",
    width: 2448,
    height: 1680,
    titulo: "Los noventa días, semana por semana",
    alt: "Cronograma de trece semanas en tres etapas de treinta días: Escuchar y ordenar (días 1 a 30, hito: registro en marcha), Priorizar y transformar (días 31 a 60, hito: tres a cinco fichas entregadas) y Seguir e informar (días 61 a 90, hito: informe final entregado). Con reunión de revisión al cierre de cada mes.",
  },
  {
    slug: "img/f4-entregables.png",
    width: 2448,
    height: 1008,
    titulo: "Qué queda en el despacho",
    alt: "Los diez entregables del piloto con su frecuencia: registro único de propuestas, mapa de temas por localidad, protocolo de recepción y respuesta, matriz de priorización, fichas de proyecto (3 a 5), tablero de seguimiento, informe mensual de dos páginas, reunión de revisión, capacitación breve al equipo e informe final. Todos quedan en poder del despacho en formatos abiertos.",
  },
  {
    slug: "img/f9-datos.png",
    width: 2448,
    height: 1296,
    titulo: "Qué se registra y qué no",
    alt: "Cuadro comparativo bajo la Ley 25.326 de Protección de los Datos Personales. Se registra: fecha de ingreso y canal, localidad, barrio y tema, estado del caso, y datos de contacto solo con autorización escrita. No se registra: opiniones políticas o pertenencia partidaria, salud, religión u origen étnico, fichas de militantes, ni ningún dato innecesario. Dos registros separados: uno nominal restringido y otro agregado sin nombres.",
  },
  {
    slug: "img/f6-continuidad.png",
    width: 2448,
    height: 1080,
    titulo: "Cómo se decide al día noventa",
    alt: "Los cinco criterios fijados de antemano para evaluar el piloto (fichas entregadas, fichas con acto del Concejo, registros con clasificación completa, informes en fecha y personas con devolución) y las tres salidas posibles: continuar si se cumplen cuatro o cinco, continuar con cambios si se cumplen dos o tres, cerrar si se cumple uno o ninguno.",
  },
];

export const FIGURAS_DETALLE: Figura[] = [
  {
    slug: "img/f3-posicion.png",
    width: 2448,
    height: 1128,
    titulo: "Qué existe hoy en Morón y dónde entra el piloto",
    alt: "Instrumentos vigentes en Morón: del municipio, el Presupuesto Participativo, la aplicación Morón a Mano y las Unidades de Gestión Comunitaria; del Concejo Deliberante, la Banca Abierta, los canales propios y la gestión documental digital. El piloto ocupa el único espacio que ninguno cubre: qué le pidieron a este despacho en particular y qué pasó después con cada cosa.",
  },
  {
    slug: "img/f5-indicadores.png",
    width: 2448,
    height: 1142,
    titulo: "Los ocho indicadores del piloto",
    alt: "Ocho indicadores que se calculan contando filas y columnas de una planilla: propuestas registradas, clasificación completa, localidades y barrios alcanzados, días hasta la primera revisión, propuestas convertidas en ficha, fichas con acto o gestión, estado actualizado en los últimos treinta días y personas con devolución. No se mide intención de voto ni ninguna característica personal.",
  },
  {
    slug: "img/f7-localidades.png",
    width: 2448,
    height: 1008,
    titulo: "Las cinco localidades del partido",
    alt: "Temas señalados por la prensa en cada localidad de Morón: tránsito y deterioro del casco comercial en Morón centro; motos, ruidos y zonas gastronómicas en Castelar; congestión y pasos a nivel en Haedo; mantenimiento urbano y alumbrado en El Palomar; Acceso Oeste y transformación residencial en Villa Sarmiento. Es un diagnóstico de prensa que el piloto usa como hipótesis inicial, no como conclusión.",
  },
  {
    slug: "img/f8-matriz.png",
    width: 2448,
    height: 1056,
    titulo: "Cómo se decide qué tema va primero",
    alt: "Matriz de priorización con cuatro criterios de 1 a 3 puntos cada uno: personas afectadas, urgencia, competencia y viabilidad. La suma, de 4 a 12, ordena la lista y queda escrita. El puntaje sugiere el orden; la concejala puede cambiarlo y esa decisión se anota.",
  },
  {
    slug: "img/f10-ritmo.png",
    width: 2448,
    height: 816,
    titulo: "El ritmo de trabajo, una vez que arranca",
    alt: "Cuatro rutinas fijas: todos los días, cargar lo que llegó (cinco minutos, seis datos por caso); una vez por semana, actualizar el tablero; una vez por mes, informe de dos páginas y reunión de 30 a 45 minutos; al día noventa, informe final con indicadores medidos y recomendación fundada.",
  },
];
