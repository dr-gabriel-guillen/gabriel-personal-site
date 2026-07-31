import { promises as fs } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { FigureViewer } from "./_components/figure-viewer";
import { LiteYouTube } from "./_components/lite-youtube";
import {
  ARCHIVOS,
  CONTACTO_ASUNTO,
  CONTACTO_EMAIL,
  CV_DISPONIBLE,
  FIGURAS_DETALLE,
  FIGURAS_PRINCIPALES,
  MEDIA,
  archivoUrl,
} from "./_lib/config";

// Componente de SERVIDOR a propósito: el contenido solo se serializa en la
// respuesta de esta ruta, que el middleware protege. Nada de este texto (ni la
// clave) termina en los bundles estáticos de /_next/static.
export const dynamic = "force-dynamic";

const PRIVATE_ROOT = path.join(process.cwd(), "private", "propuesta-gustavo");

async function pesoDe(slug: string): Promise<string | null> {
  const def = ARCHIVOS[slug];
  if (!def) return null;
  try {
    const st = await fs.stat(path.join(PRIVATE_ROOT, def.rel));
    const kb = st.size / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1).replace(".", ",")} MB`;
  } catch {
    return null;
  }
}

const CIFRAS = [
  { valor: "90", etiqueta: "días de prueba" },
  { valor: "6", etiqueta: "datos por caso" },
  { valor: "3 a 5", etiqueta: "fichas de proyecto" },
  { valor: "$0", etiqueta: "costo directo" },
];

const PROBLEMAS = [
  {
    titulo: "No se ve el patrón",
    texto:
      "Si en un mes llegaron doce pedidos por alumbrado y todos de la misma zona, eso es un tema legislativo. Repartidos en cuatro teléfonos, nadie ve los doce.",
  },
  {
    titulo: "Se pierde el seguimiento",
    texto:
      "Un vecino plantea algo, se hace la gestión, y tres semanas después nadie sabe con certeza en qué quedó.",
  },
  {
    titulo: "El trabajo no se puede mostrar",
    texto:
      "Cuando hay que rendir cuentas de lo actuado, hay que reconstruir de memoria algo que se hizo bien pero no se anotó.",
  },
];

interface Descarga {
  slug: string;
  titulo: string;
  descripcion: string;
  formato: string;
  miniatura?: string; // slug de la miniatura (preview/...)
  destacada?: boolean;
}

const DESCARGAS: Descarga[] = [
  {
    slug: "pdf/3-Resumen-de-una-pagina.pdf",
    titulo: "Resumen de una página",
    descripcion: "Lo esencial en una carilla. Si tiene dos minutos, empiece acá.",
    formato: "PDF",
    miniatura: "preview/3-Resumen-de-una-pagina-1.jpg",
    destacada: true,
  },
  {
    slug: "pdf/2-Proyecto-Programa-Piloto.pdf",
    titulo: "El proyecto completo",
    descripcion:
      "Documento de 16 páginas con metodología, etapas, indicadores y anexos.",
    formato: "PDF",
    miniatura: "preview/2-Proyecto-Programa-Piloto-01.jpg",
  },
  {
    slug: "pdf/8-Presentacion-completa.pdf",
    titulo: "Presentación",
    descripcion: "17 placas que recorren el programa de punta a punta.",
    formato: "PDF",
    miniatura: "preview/8-Presentacion-completa-01.jpg",
  },
  {
    slug: "xlsx/7-Plantillas-operativas.xlsx",
    titulo: "Plantillas operativas",
    descripcion:
      "Las siete planillas listas para usar: registro, matriz, tablero, informes.",
    formato: "Excel",
  },
  {
    slug: "docx/2-Proyecto-Programa-Piloto.docx",
    titulo: "El proyecto, editable",
    descripcion: "La misma propuesta en Word, por si su equipo quiere trabajarla.",
    formato: "Word",
    miniatura: "preview/2-Proyecto-Programa-Piloto-01.jpg",
  },
  {
    slug: "pptx/8-Presentacion-completa.pptx",
    titulo: "Presentación, editable",
    descripcion: "El deck en PowerPoint, con notas del orador.",
    formato: "PowerPoint",
    miniatura: "preview/8-Presentacion-completa-01.jpg",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
      {children}
    </p>
  );
}

export default async function PropuestaGustavoPage() {
  const pesos = Object.fromEntries(
    await Promise.all(
      [...DESCARGAS.map((d) => d.slug), "zip/Propuesta-Programa-Piloto-completo.zip"].map(
        async (slug) => [slug, await pesoDe(slug)] as const,
      ),
    ),
  );

  const mailto = `mailto:${CONTACTO_EMAIL}?subject=${encodeURIComponent(CONTACTO_ASUNTO)}`;

  return (
    <div className="pt-20">
      {/* 1 — Cabecera */}
      <section className="border-b border-border bg-navy-mid px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Sello de destinataria: único lugar donde aparece --violet */}
          <div className="border-l-2 pl-4" style={{ borderColor: "var(--violet)" }}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cream-dim">
              Documento preparado para
            </p>
            <p className="mt-2 font-display text-xl font-semibold leading-snug text-cream sm:text-2xl">
              Concejala María Gabriela Mobilia Rodríguez
              <span className="text-cream-dim"> · </span>
              <span className="text-cream-dim">
                Honorable Concejo Deliberante de Morón
              </span>
            </p>
          </div>

          <h1 className="mt-10 font-display text-4xl font-bold leading-tight text-cream sm:text-5xl lg:text-6xl">
            Programa Piloto de Registro y Seguimiento de{" "}
            <span className="text-gold">Propuestas Vecinales</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-9 text-cream-dim">
            Noventa días para ordenar lo que llega al despacho y convertirlo en
            pedidos, proyectos y respuestas verificables.
          </p>

          <p className="mt-10 text-sm leading-7 text-cream">
            Gustavo Omar Guillen · Licenciado en Psicología Social · Vecino de
            Morón
          </p>
          <p className="mt-1 text-sm text-cream-dim">Julio de 2026</p>
        </div>
      </section>

      {/* 2 — Barra de cifras */}
      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {CIFRAS.map((c) => (
            <div
              key={c.etiqueta}
              className="rounded-lg border border-border bg-navy-card px-4 py-5 text-center sm:px-6"
            >
              <p className="font-display text-4xl font-bold text-gold">{c.valor}</p>
              <p className="mt-1 text-sm text-cream-dim">{c.etiqueta}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3 — El problema */}
      <section className="border-y border-border bg-navy-mid px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Eyebrow>El problema</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold text-cream sm:text-4xl">
            Tres cosas que hoy no se pueden hacer
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {PROBLEMAS.map((p) => (
              <div key={p.titulo} className="rounded-lg border border-border bg-navy-card p-6">
                <h3 className="font-display text-xl font-bold text-gold">{p.titulo}</h3>
                <p className="mt-3 text-sm leading-7 text-cream-dim">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Cómo funciona */}
      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Eyebrow>Cómo funciona</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold text-cream sm:text-4xl">
            El programa, en cinco figuras
          </h2>
          <p className="mt-4 text-base leading-8 text-cream-dim">
            Tocá cualquier figura para verla en pantalla completa.
          </p>

          <div className="mt-10 space-y-12">
            {FIGURAS_PRINCIPALES.map((f, i) => (
              <figure key={f.slug}>
                <figcaption className="mb-3 font-display text-xl font-bold text-cream sm:text-2xl">
                  {f.titulo}
                </figcaption>
                <FigureViewer
                  src={archivoUrl(f.slug)}
                  alt={f.alt}
                  width={f.width}
                  height={f.height}
                  priority={i === 0}
                />
              </figure>
            ))}
          </div>

          <details className="group mt-12 rounded-lg border border-border bg-navy-card">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-gold transition hover:text-gold-light [&::-webkit-details-marker]:hidden">
              <span>Ver más detalle — cinco figuras adicionales</span>
              <span aria-hidden="true" className="text-lg transition group-open:rotate-180">
                ▾
              </span>
            </summary>
            <div className="space-y-12 border-t border-border px-4 py-8 sm:px-6">
              {FIGURAS_DETALLE.map((f) => (
                <figure key={f.slug}>
                  <figcaption className="mb-3 font-display text-lg font-bold text-cream sm:text-xl">
                    {f.titulo}
                  </figcaption>
                  <FigureViewer
                    src={archivoUrl(f.slug)}
                    alt={f.alt}
                    width={f.width}
                    height={f.height}
                  />
                </figure>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* 5 — Video y audio */}
      <section className="border-y border-border bg-navy-mid px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Eyebrow>Para escuchar o mirar</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold text-cream sm:text-4xl">
            La propuesta, contada
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {/* Video */}
            <div className="rounded-lg border border-border bg-navy-card p-6">
              <p className="font-display text-xl font-bold text-cream">
                {MEDIA.video.titulo}{" "}
                <span className="font-sans text-sm font-normal text-cream-dim">
                  · {MEDIA.video.duracion} min
                </span>
              </p>
              <p className="mt-2 text-sm leading-7 text-cream-dim">
                {MEDIA.video.descripcion}
              </p>
              <div className="mt-4">
                {MEDIA.video.youtubeId ? (
                  <LiteYouTube id={MEDIA.video.youtubeId} titulo={MEDIA.video.titulo} />
                ) : MEDIA.video.src ? (
                  <video
                    controls
                    preload="metadata"
                    poster={MEDIA.video.poster || undefined}
                    className="w-full rounded-lg border border-border"
                  >
                    <source src={archivoUrl(`media/${MEDIA.video.src}`)} type="video/mp4" />
                  </video>
                ) : (
                  <p className="rounded border border-dashed border-border px-4 py-3 text-sm text-cream-dim">
                    Disponible a pedido
                  </p>
                )}
              </div>
            </div>
            {/* Audio */}
            <div className="rounded-lg border border-border bg-navy-card p-6">
              <p className="font-display text-xl font-bold text-cream">
                {MEDIA.audio.titulo}{" "}
                <span className="font-sans text-sm font-normal text-cream-dim">
                  · {MEDIA.audio.duracion} min
                </span>
              </p>
              <p className="mt-2 text-sm leading-7 text-cream-dim">
                {MEDIA.audio.descripcion}
              </p>
              <div className="mt-4">
                {MEDIA.audio.youtubeId ? (
                  <LiteYouTube id={MEDIA.audio.youtubeId} titulo={MEDIA.audio.titulo} />
                ) : MEDIA.audio.src ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <audio controls preload="none" className="w-full">
                    <source src={archivoUrl(`media/${MEDIA.audio.src}`)} type="audio/mp4" />
                  </audio>
                ) : (
                  <p className="rounded border border-dashed border-border px-4 py-3 text-sm text-cream-dim">
                    Disponible a pedido
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Descargas */}
      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Eyebrow>Descargas</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold text-cream sm:text-4xl">
            Todo el material, para llevar
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {DESCARGAS.map((d) => {
              const peso = pesos[d.slug];
              return (
                <div
                  key={d.slug}
                  className={`flex gap-5 rounded-lg border bg-navy-card p-5 ${
                    d.destacada ? "border-gold sm:col-span-2" : "border-border"
                  }`}
                >
                  <div className="w-16 shrink-0 self-start overflow-hidden rounded border border-border bg-white sm:w-20">
                    {d.miniatura ? (
                      <Image
                        src={archivoUrl(d.miniatura)}
                        alt=""
                        width={160}
                        height={226}
                        unoptimized
                        loading="lazy"
                        className="h-auto w-full"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex h-full min-h-24 items-center justify-center bg-navy text-xs font-bold uppercase tracking-widest text-gold"
                      >
                        {d.formato}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    {d.destacada && (
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
                        Empiece por acá
                      </p>
                    )}
                    <h3 className="mt-1 font-display text-xl font-bold text-cream">
                      {d.titulo}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-cream-dim">{d.descripcion}</p>
                    <p className="mt-2 text-xs text-cream-dim">
                      {d.formato}
                      {peso ? ` · ${peso}` : ""}
                    </p>
                    <a
                      href={archivoUrl(d.slug)}
                      download
                      className="mt-4 inline-flex min-h-11 items-center gap-2 bg-gold px-6 py-2.5 text-sm font-bold uppercase tracking-[0.15em] text-navy transition hover:bg-gold-light"
                    >
                      <span aria-hidden="true">↓</span> Descargar
                    </a>
                  </div>
                </div>
              );
            })}

            {/* 7 — Currículum, placeholder */}
            {!CV_DISPONIBLE && (
              <div
                aria-disabled="true"
                className="flex flex-col justify-center rounded-lg border border-dashed border-border p-5 opacity-70"
              >
                <h3 className="font-display text-xl font-bold text-cream-dim">
                  Currículum de Gustavo Omar Guillen
                </h3>
                <p className="mt-2 text-sm text-cream-dim">En preparación</p>
              </div>
            )}
            {CV_DISPONIBLE && (
              <div className="flex gap-5 rounded-lg border border-border bg-navy-card p-5">
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl font-bold text-cream">
                    Currículum del autor
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-cream-dim">
                    Trayectoria de Gustavo Omar Guillen.
                  </p>
                  <a
                    href={archivoUrl("pdf/cv-gustavo-guillen.pdf")}
                    download
                    className="mt-4 inline-flex min-h-11 items-center gap-2 bg-gold px-6 py-2.5 text-sm font-bold uppercase tracking-[0.15em] text-navy transition hover:bg-gold-light"
                  >
                    <span aria-hidden="true">↓</span> Descargar
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 rounded-lg border border-gold/40 bg-gold/10 p-6 text-center">
            <p className="text-sm text-cream-dim">
              Los seis documentos en un solo archivo
              {pesos["zip/Propuesta-Programa-Piloto-completo.zip"]
                ? ` · ZIP · ${pesos["zip/Propuesta-Programa-Piloto-completo.zip"]}`
                : ""}
            </p>
            <a
              href={archivoUrl("zip/Propuesta-Programa-Piloto-completo.zip")}
              download
              className="mt-4 inline-flex min-h-12 items-center gap-2 bg-gold px-8 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-navy transition hover:bg-gold-light"
            >
              <span aria-hidden="true">↓</span> Descargar todo
            </a>
          </div>
        </div>
      </section>

      {/* 8 — Cierre y contacto */}
      <section className="border-t border-border bg-navy-mid px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Lo único que se pide</Eyebrow>
          <blockquote className="mt-6 font-display text-2xl font-semibold leading-relaxed text-cream sm:text-3xl">
            “Una reunión de trabajo de veinte a treinta minutos para evaluar la
            conveniencia de poner a prueba el programa durante un período
            inicial de noventa días.”
          </blockquote>
          <p className="mt-6 text-sm text-cream-dim">
            No se solicita la creación de un cargo, ni presupuesto, ni personal.
          </p>
          <a
            href={mailto}
            className="mt-10 inline-flex min-h-12 items-center bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-navy transition hover:bg-gold-light"
          >
            Escribir a Gustavo
          </a>
          <p className="mt-4 text-xs text-cream-dim">{CONTACTO_EMAIL}</p>
        </div>
      </section>
    </div>
  );
}
