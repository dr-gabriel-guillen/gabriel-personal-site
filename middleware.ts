import { NextRequest, NextResponse } from "next/server";
import { PROPUESTA_COOKIE, verifyPropuestaCookieValue } from "@/lib/propuesta-auth";

// Puerta de acceso de /propuesta-gustavo.
// Sin cookie válida se reescribe (no redirige) a la pantalla de acceso: la URL
// no cambia y el contenido protegido nunca se serializa en la respuesta.
// Toda respuesta bajo esta ruta sale con no-store para que CloudFront jamás
// guarde en el borde una página autenticada (el resto del sitio cachea 1 año).

const NO_STORE = "private, no-store, max-age=0, must-revalidate";

// Rutas que deben verse SIN cookie: la pantalla de acceso y el POST de la clave.
const OPEN_PATHS = new Set([
  "/propuesta-gustavo/acceso",
  "/propuesta-gustavo/acceso/entrar",
]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const authed = await verifyPropuestaCookieValue(
    req.cookies.get(PROPUESTA_COOKIE)?.value,
    process.env.PROPUESTA_COOKIE_SECRET,
  );

  let res: NextResponse;
  if (authed && pathname === "/propuesta-gustavo/acceso") {
    // Ya está adentro: en vez de la puerta se le sirve el contenido.
    // (Rewrite y no redirect: el runtime del middleware exige Location
    // absoluto, y detrás del proxy el host visible es localhost:3000.)
    const url = req.nextUrl.clone();
    url.pathname = "/propuesta-gustavo";
    res = NextResponse.rewrite(url);
  } else if (!authed && !OPEN_PATHS.has(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/propuesta-gustavo/acceso";
    res = NextResponse.rewrite(url);
  } else {
    res = NextResponse.next();
  }

  res.headers.set("Cache-Control", NO_STORE);
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return res;
}

export const config = {
  matcher: ["/propuesta-gustavo/:path*", "/propuesta-gustavo"],
};
