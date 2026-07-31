import { promises as fs } from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { PROPUESTA_COOKIE, verifyPropuestaCookieValue } from "@/lib/propuesta-auth";
import { ARCHIVOS, CV_DISPONIBLE } from "../../_lib/config";

// Sirve los archivos de la propuesta DESDE FUERA de /public, para que
// CloudFront no pueda entregarlos sin pasar por la puerta.
// 1) valida la cookie firmada (además del middleware: defensa en profundidad);
// 2) valida el slug contra la lista blanca de config.ts — jamás se concatena
//    la URL contra el filesystem, así que no hay path traversal posible.

export const dynamic = "force-dynamic";

const NO_STORE = "private, no-store, max-age=0, must-revalidate";
const PRIVATE_ROOT = path.join(process.cwd(), "private", "propuesta-gustavo");

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string[] }> },
) {
  const authed = await verifyPropuestaCookieValue(
    req.cookies.get(PROPUESTA_COOKIE)?.value,
    process.env.PROPUESTA_COOKIE_SECRET,
  );
  if (!authed) {
    return new NextResponse("Acceso denegado", {
      status: 401,
      headers: {
        "Cache-Control": NO_STORE,
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  }

  const { slug } = await ctx.params;
  const key = (slug ?? []).join("/");
  const def = ARCHIVOS[key];
  const esCv = key === "pdf/cv-gustavo-guillen.pdf";
  if (!def || (esCv && !CV_DISPONIBLE)) {
    return new NextResponse("No encontrado", {
      status: 404,
      headers: { "Cache-Control": NO_STORE },
    });
  }

  let data: Buffer;
  try {
    data = await fs.readFile(path.join(PRIVATE_ROOT, def.rel));
  } catch {
    return new NextResponse("No encontrado", {
      status: 404,
      headers: { "Cache-Control": NO_STORE },
    });
  }

  const nombre = def.nombre ?? path.basename(def.rel);
  const headersBase: Record<string, string> = {
    "Content-Type": def.contentType,
    "Content-Disposition": `${def.disposition}; filename="${nombre}"`,
    "Cache-Control": NO_STORE,
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "X-Content-Type-Options": "nosniff",
    "Accept-Ranges": "bytes",
  };

  // Soporte mínimo de Range para que el video/audio local permita saltar
  // en la línea de tiempo (Safari/iOS lo exigen para reproducir).
  const range = req.headers.get("range");
  const m = range?.match(/^bytes=(\d+)-(\d*)$/);
  if (m) {
    const start = Number(m[1]);
    const end = m[2] ? Math.min(Number(m[2]), data.byteLength - 1) : data.byteLength - 1;
    if (start >= data.byteLength || start > end) {
      return new NextResponse(null, {
        status: 416,
        headers: { ...headersBase, "Content-Range": `bytes */${data.byteLength}` },
      });
    }
    const chunk = data.subarray(start, end + 1);
    return new NextResponse(new Uint8Array(chunk), {
      status: 206,
      headers: {
        ...headersBase,
        "Content-Length": String(chunk.byteLength),
        "Content-Range": `bytes ${start}-${end}/${data.byteLength}`,
      },
    });
  }

  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: { ...headersBase, "Content-Length": String(data.byteLength) },
  });
}
