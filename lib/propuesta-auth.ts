// Sesión firmada para /propuesta-gustavo.
// Usa Web Crypto (HMAC-SHA256) para funcionar tanto en el middleware (edge)
// como en los Route Handlers (Node). La cookie guarda `exp.firma`, nunca la clave.

const COOKIE_PREFIX = "propuesta-gustavo-v1";

const enc = new TextEncoder();

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array | null {
  if (!/^[0-9a-f]+$/.test(hex) || hex.length % 2 !== 0) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

export const PROPUESTA_COOKIE = "pg_sesion";
export const PROPUESTA_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 días, en segundos

export async function createPropuestaCookieValue(secret: string): Promise<string> {
  const exp = Date.now() + PROPUESTA_COOKIE_MAX_AGE * 1000;
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`${COOKIE_PREFIX}.${exp}`));
  return `${exp}.${toHex(sig)}`;
}

export async function verifyPropuestaCookieValue(
  value: string | undefined,
  secret: string | undefined,
): Promise<boolean> {
  if (!value || !secret) return false;
  const dot = value.indexOf(".");
  if (dot <= 0) return false;
  const expStr = value.slice(0, dot);
  const sigHex = value.slice(dot + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const sig = fromHex(sigHex);
  if (!sig) return false;
  const key = await hmacKey(secret);
  // crypto.subtle.verify hace la comparación en tiempo constante.
  return crypto.subtle.verify("HMAC", key, sig as BufferSource, enc.encode(`${COOKIE_PREFIX}.${exp}`));
}
