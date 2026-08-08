import type { Metadata } from "next";
import { DisambiguationPage } from "@/components/disambiguation-page";
import { alternatesFor } from "@/lib/seo";

export const metadata: Metadata = {
  title:
    "¿Cuál Gabriel Guillén? — Gabriel Guillen-Gonzalez, abogado de California #361094",
  description:
    "Varias personas comparten este nombre. Yo soy el abogado de California, licencia #361094 del Colegio de Abogados del Estado y fundador de Guillen-Gonzalez Law PC en San José — no el profesor de lingüística de Middlebury ni los médicos que comparten el nombre.",
  alternates: alternatesFor("/desambiguacion"),
};

export default function Page() {
  return (
    <div lang="es">
      <DisambiguationPage lang="es" />
    </div>
  );
}
