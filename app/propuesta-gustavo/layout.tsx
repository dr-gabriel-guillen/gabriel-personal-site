import type { Metadata } from "next";

// Sala de entrega privada. Fuera del buscador (noindex + X-Robots-Tag en el
// middleware), fuera del menú, fuera del sitemap. Se llega solo por link.
export const metadata: Metadata = {
  title: "Programa Piloto de Registro y Seguimiento de Propuestas Vecinales",
  description:
    "Documento de trabajo preparado para una destinataria en particular. Morón, provincia de Buenos Aires.",
  robots: { index: false, follow: false, noarchive: true },
  openGraph: {
    title: "Programa Piloto de Registro y Seguimiento de Propuestas Vecinales",
    description: "Documento de trabajo · Morón, julio de 2026",
    url: "https://drgabrielguillen.com/propuesta-gustavo",
    // TODO: generar una imagen Open Graph propia (1200×630) a partir de la
    // portada del proyecto y ponerla en /public (tiene que ser pública para
    // que WhatsApp la levante; que no muestre contenido del documento).
  },
};

export default function PropuestaLayout({ children }: { children: React.ReactNode }) {
  // El sitio declara lang="en"; esta subpágina es en español.
  return (
    <div lang="es" data-page="propuesta">
      {children}
    </div>
  );
}
