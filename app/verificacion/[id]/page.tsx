import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CredentialDetail } from "@/components/credential-detail";
import { CredentialsJsonLd } from "@/components/credentials-jsonld";
import { CREDENTIALS, byId, formatDate, title } from "@/lib/credentials";
import { CANONICAL_NAME, alternatesFor } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return CREDENTIALS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const c = byId(id);
  if (!c) return {};
  const name = title(c, "es");
  return {
    title: `${name} — ${CANONICAL_NAME}`,
    description:
      `${name}, ${c.institution}` +
      (c.conferred ? `, otorgado el ${formatDate(c.conferred, "es")}` : "") +
      `. Cómo verificarlo de forma independiente.`,
    alternates: alternatesFor(`/verificacion/${id}`),
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = byId(id);
  if (!c) notFound();
  return (
    <div lang="es">
      <CredentialsJsonLd lang="es" only={c} />
      <CredentialDetail c={c} lang="es" />
    </div>
  );
}
