import type { Metadata } from "next";
import { VerificationPage } from "@/components/verification-page";
import { CredentialsJsonLd } from "@/components/credentials-jsonld";
import { TOTALS } from "@/lib/credentials";
import { alternatesFor } from "@/lib/seo";

export const metadata: Metadata = {
  title:
    "Credentials & verification — Gabriel Guillen-Gonzalez, California Bar #361094",
  description:
    `Every credential itemised with a third-party verification link: ${TOTALS.argentineRegistryDegrees} university degrees in Argentina's ` +
    `national graduate registry, ${TOTALS.internationalDegreeProgrammes} international postgraduate programmes, ` +
    `${TOTALS.legalAdmissions} legal admissions and ${TOTALS.professionalCertifications} professional certifications. ` +
    "Links go to government registries and issuing authorities.",
  alternates: alternatesFor("/verification"),
};

export default function Page() {
  return (
    <>
      <CredentialsJsonLd lang="en" />
      <VerificationPage lang="en" />
    </>
  );
}
