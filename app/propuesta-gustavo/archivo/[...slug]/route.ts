import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { NextRequest, NextResponse } from "next/server";
import { PROPUESTA_COOKIE, verifyPropuestaCookieValue } from "@/lib/propuesta-auth";
import { presignS3Get, s3Config } from "@/lib/propuesta-s3";
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

  // Archivos grandes (video, audio, ZIP): viven en el bucket privado; acá,
  // ya validada la cookie, se redirige a un link firmado de 1 hora.
  if (def.s3Key) {
    const s3 = s3Config();
    if (!s3) {
      return new NextResponse("No disponible", {
        status: 503,
        headers: { "Cache-Control": NO_STORE },
      });
    }
    const nombre = def.nombre ?? path.basename(def.s3Key);
    const url = presignS3Get({
      ...s3,
      key: def.s3Key,
      expires: 3600,
      responseContentDisposition: `${def.disposition}; filename="${nombre}"`,
      responseContentType: def.contentType,
    });
    const res = NextResponse.redirect(url, 302);
    res.headers.set("Cache-Control", NO_STORE);
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return res;
  }

  const abs = path.join(PRIVATE_ROOT, def.rel!);
  let size: number;
  try {
    size = (await fs.stat(abs)).size;
  } catch {
    return new NextResponse("No encontrado", {
      status: 404,
      headers: { "Cache-Control": NO_STORE },
    });
  }

  const nombre = def.nombre ?? path.basename(def.rel!);
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
    const end = m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
    if (start >= size || start > end) {
      return new NextResponse(null, {
        status: 416,
        headers: { ...headersBase, "Content-Range": `bytes */${size}` },
      });
    }
    const stream = Readable.toWeb(
      createReadStream(abs, { start, end }),
    ) as ReadableStream;
    return new NextResponse(stream, {
      status: 206,
      headers: {
        ...headersBase,
        "Content-Length": String(end - start + 1),
        "Content-Range": `bytes ${start}-${end}/${size}`,
      },
    });
  }

  // Stream (no buffer): el compute de Amplify limita las respuestas
  // buffereadas a ~6 MB y el ZIP completo lo supera (413 sin esto).
  const stream = Readable.toWeb(createReadStream(abs)) as ReadableStream;
  return new NextResponse(stream, {
    status: 200,
    headers: { ...headersBase, "Content-Length": String(size) },
  });
}
