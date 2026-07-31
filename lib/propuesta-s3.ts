import { createHash, createHmac } from "node:crypto";

// Presigner SigV4 mínimo para GET de S3 (query auth), sin dependencias.
// Los archivos grandes de /propuesta-gustavo (video, audio, ZIP) no pueden
// servirse a través de Amplify (corta las respuestas de más de ~6 MB con 413)
// ni vivir en git (56 MB de binarios). Viven en un bucket PRIVADO; la ruta
// protegida valida la cookie y redirige a un link firmado de corta duración.

function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac("sha256", key).update(data, "utf8").digest();
}

function sha256Hex(data: string): string {
  return createHash("sha256").update(data, "utf8").digest("hex");
}

// RFC 3986 estricto (SigV4 lo exige; encodeURIComponent deja pasar !'()*)
function enc(s: string): string {
  return encodeURIComponent(s).replace(
    /[!'()*]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase(),
  );
}

export interface PresignOpts {
  bucket: string;
  region: string;
  /** key del objeto, ej. "media/piloto-90-dias.mp4" */
  key: string;
  keyId: string;
  secret: string;
  /** vigencia en segundos */
  expires: number;
  responseContentDisposition?: string;
  responseContentType?: string;
}

export function presignS3Get(o: PresignOpts): string {
  const host = `${o.bucket}.s3.${o.region}.amazonaws.com`;
  const iso = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const date = iso.slice(0, 8);
  const scope = `${date}/${o.region}/s3/aws4_request`;

  const params: Array<[string, string]> = [
    ["X-Amz-Algorithm", "AWS4-HMAC-SHA256"],
    ["X-Amz-Credential", `${o.keyId}/${scope}`],
    ["X-Amz-Date", iso],
    ["X-Amz-Expires", String(o.expires)],
    ["X-Amz-SignedHeaders", "host"],
  ];
  if (o.responseContentDisposition)
    params.push(["response-content-disposition", o.responseContentDisposition]);
  if (o.responseContentType)
    params.push(["response-content-type", o.responseContentType]);
  params.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

  const canonicalQuery = params.map(([k, v]) => `${enc(k)}=${enc(v)}`).join("&");
  const canonicalPath = "/" + o.key.split("/").map(enc).join("/");
  const canonicalRequest = [
    "GET",
    canonicalPath,
    canonicalQuery,
    `host:${host}\n`,
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    iso,
    scope,
    sha256Hex(canonicalRequest),
  ].join("\n");
  const kSigning = hmac(
    hmac(hmac(hmac("AWS4" + o.secret, date), o.region), "s3"),
    "aws4_request",
  );
  const signature = createHmac("sha256", kSigning)
    .update(stringToSign, "utf8")
    .digest("hex");

  return `https://${host}${canonicalPath}?${canonicalQuery}&X-Amz-Signature=${signature}`;
}

export function s3Config():
  | { bucket: string; region: string; keyId: string; secret: string }
  | null {
  const bucket = process.env.PROPUESTA_S3_BUCKET;
  const keyId = process.env.PROPUESTA_S3_KEY_ID;
  const secret = process.env.PROPUESTA_S3_SECRET;
  if (!bucket || !keyId || !secret) return null;
  return {
    bucket,
    region: process.env.PROPUESTA_S3_REGION ?? "us-east-1",
    keyId,
    secret,
  };
}
