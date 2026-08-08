import type { Metadata } from "next";
import { VerificationPage } from "@/components/verification-page";
import { CredentialsJsonLd } from "@/components/credentials-jsonld";
import { TOTALS } from "@/lib/credentials";
import { alternatesFor } from "@/lib/seo";

export const metadata: Metadata = {
  title:
    "Credenciales y verificación — Gabriel Guillen-Gonzalez, Colegio de Abogados de California #361094",
  description:
    `Cada credencial detallada con un enlace de verificación de terceros: ${TOTALS.argentineRegistryDegrees} títulos universitarios en el ` +
    `Registro Público de Graduados Universitarios de Argentina, ${TOTALS.internationalDegreeProgrammes} programas de posgrado internacionales, ` +
    `${TOTALS.legalAdmissions} admisiones legales y ${TOTALS.professionalCertifications} certificaciones profesionales. ` +
    "Los enlaces van a registros oficiales y autoridades emisoras.",
  alternates: alternatesFor("/verificacion"),
};

export default function Page() {
  // The root layout declares lang="en"; this subtree is Spanish and says so,
  // which is what screen readers and translation tools actually read.
  return (
    <div lang="es">
      <CredentialsJsonLd lang="es" />
      <VerificationPage lang="es" />
    </div>
  );
}
