import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  PROPUESTA_COOKIE,
  PROPUESTA_COOKIE_MAX_AGE,
  createPropuestaCookieValue,
} from "@/lib/propuesta-auth";

// Verificación de la clave de /propuesta-gustavo. Corre SIEMPRE en el
// servidor: la clave vive en process.env.PROPUESTA_PASSWORD y no viaja en
// ningún bundle. La comparación es de tiempo constante (se hashean ambos
// valores a SHA-256 para igualar longitudes y se usa timingSafeEqual).

export const dynamic = "force-dynamic";

const NO_STORE = "private, no-store, max-age=0, must-revalidate";

// Rate limit simple en memoria: 5 intentos por IP cada 15 minutos.
// (En Amplify puede haber más de una instancia; alcanza igual para frenar
// el tanteo a máquina, que es lo que importa acá.)
const VENTANA_MS = 15 * 60 * 1000;
const MAX_INTENTOS = 5;
const intentos = new Map<string, { count: number; resetAt: number }>();

function ipDe(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconocida"
  );
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const e = intentos.get(ip);
  if (!e || now > e.resetAt) {
    intentos.set(ip, { count: 1, resetAt: now + VENTANA_MS });
    return false;
  }
  e.count += 1;
  return e.count > MAX_INTENTOS;
}

function claveCorrecta(ingresada: string, esperada: string): boolean {
  const a = createHash("sha256").update(ingresada, "utf8").digest();
  const b = createHash("sha256").update(esperada, "utf8").digest();
  return timingSafeEqual(a, b);
}

// Location relativo a propósito: detrás de Amplify/CloudFront el server ve
// host "localhost:3000", y un redirect absoluto armado desde req.url mandaría
// el browser a localhost. El path relativo lo resuelve el propio browser.
function redirigirA(path: string): NextResponse {
  return new NextResponse(null, {
    status: 303,
    headers: { Location: path, "Cache-Control": NO_STORE },
  });
}

function volverConError(codigo: string): NextResponse {
  return redirigirA(`/propuesta-gustavo?e=${codigo}`);
}

export async function POST(req: NextRequest) {
  const password = process.env.PROPUESTA_PASSWORD;
  const secret = process.env.PROPUESTA_COOKIE_SECRET;
  if (!password || !secret) {
    console.error(
      "[propuesta-gustavo] Faltan PROPUESTA_PASSWORD / PROPUESTA_COOKIE_SECRET en el entorno.",
    );
    return volverConError("config");
  }

  const ip = ipDe(req);
  if (rateLimited(ip)) return volverConError("limite");

  let ingresada = "";
  try {
    const form = await req.formData();
    ingresada = String(form.get("clave") ?? "");
  } catch {
    return volverConError("clave");
  }

  if (!ingresada || !claveCorrecta(ingresada, password)) {
    return volverConError("clave");
  }

  // Login válido: se limpia el contador para que los ingresos legítimos
  // repetidos no terminen bloqueando a la destinataria.
  intentos.delete(ip);

  const res = redirigirA("/propuesta-gustavo");
  res.cookies.set(PROPUESTA_COOKIE, await createPropuestaCookieValue(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/propuesta-gustavo",
    maxAge: PROPUESTA_COOKIE_MAX_AGE,
  });
  res.headers.set("Cache-Control", NO_STORE);
  return res;
}
