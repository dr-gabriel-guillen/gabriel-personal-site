# /propuesta-gustavo — sala de entrega privada

Página protegida con clave en `https://drgabrielguillen.com/propuesta-gustavo`
(la variante `/propuestaGustavo` redirige con 308). Destinataria única:
Concejala María Gabriela Mobilia Rodríguez (HCD de Morón). Autor: Gustavo Omar
Guillen.

## Por qué estos archivos viven acá y no en `/public`

Todo lo que está en `/public` lo sirve CloudFront directo, sin pasar por la
puerta de contraseña. Estos archivos se sirven por el Route Handler
`app/propuesta-gustavo/archivo/[...slug]/route.ts`, que valida la cookie de
sesión y una lista blanca antes de entregar nada.
`next.config.ts → outputFileTracingIncludes` los incluye en el bundle del
deploy. **No mover nada de esta carpeta a `/public`.**

## ANTES de desplegar: variables de entorno

En Amplify (Hosting → Environment variables) hay que cargar:

| Variable | Valor |
|---|---|
| `PROPUESTA_PASSWORD` | la clave acordada (hoy: la que empieza con G…) |
| `PROPUESTA_COOKIE_SECRET` | 64 hex al azar: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `PROPUESTA_S3_BUCKET` | `gabriel-personal-site-media-452157035969` |
| `PROPUESTA_S3_REGION` | `us-east-1` |
| `PROPUESTA_S3_KEY_ID` / `PROPUESTA_S3_SECRET` | access key del usuario IAM `personal-site-media-reader` (solo `s3:GetObject` de ese bucket) |

## Archivos grandes: bucket S3 privado

Amplify corta las respuestas de más de ~6 MB (413), así que el **video (35 MB),
el audio (21 MB) y el ZIP (7 MB)** no se sirven desde el repo: viven en el
bucket privado `gabriel-personal-site-media-452157035969` (Block Public Access
activado). La ruta protegida `/propuesta-gustavo/archivo/…` valida la cookie y
redirige a un **link firmado SigV4 de 1 hora** (`lib/propuesta-s3.ts`, sin
dependencias). Layout del bucket:

```
media/piloto-90-dias.mp4
media/organizar-propuestas-vecinales.m4a
zip/Propuesta-Programa-Piloto-completo.zip
```

Subidas (perfil `ggl-deploy` tiene PutObject sobre este bucket):

```bash
aws s3 cp archivo.mp4 s3://gabriel-personal-site-media-452157035969/media/piloto-90-dias.mp4 --profile ggl-deploy --content-type video/mp4
```

Si las variables S3 faltan en el entorno, la página degrada sola: tarjetas de
video/audio en "Disponible a pedido" y sin botón "Descargar todo".

`amplify.yml` las copia a `.env.production` durante el build para que el
middleware y los handlers las vean en runtime. Sin ellas, la puerta devuelve
"El acceso no está configurado". Para desarrollo local van en `.env.local`
(gitignoreado); la plantilla documentada es `.env.example`.

## Nivel de seguridad, con honestidad

La clave actual es corta y adivinable si alguien se lo propone. Alcanza para
lo que tiene que hacer: mantener la página fuera de Google y del paso de
curiosos. **El contenido no es secreto en sentido estricto.** Si en algún
momento hace falta más, el camino es cambiar `PROPUESTA_PASSWORD` por una
clave larga generada al azar (no hay que tocar código). La comparación corre
en el servidor, con `timingSafeEqual`, cookie HMAC `httpOnly` de 30 días y
rate limit de 5 intentos por IP cada 15 minutos.

## Pendientes

1. ~~Video y audio~~ — resuelto vía S3 (ver arriba): `MEDIA.*.src` en
   `_lib/config.ts` apunta a las keys de `media/`. La alternativa YouTube "no
   listado" (`MEDIA.*.youtubeId`, vía `youtube-nocookie.com`) sigue disponible
   y tiene prioridad si se setea.
2. **CV de Gustavo.** No existe todavía. Cuando esté: guardarlo como
   `private/propuesta-gustavo/pdf/cv-gustavo-guillen.pdf` y poner
   `CV_DISPONIBLE = true` en `_lib/config.ts`. Nada más.
3. **Imagen Open Graph.** TODO en `app/propuesta-gustavo/layout.tsx`. Tiene
   que ser un asset público (WhatsApp la busca sin cookie), así que debe ser
   una portada neutra sin contenido del documento. NO usar el mapa mental.
4. ~~Peso real de cada archivo~~ — resuelto: la página hace `fs.stat` en cada
   request (los del ZIP/media, que viven en S3, son constantes: `ZIP_PESO` y
   las duraciones en `_lib/config.ts`).

## El ZIP de "Descargar todo"

Vive en S3 (`zip/Propuesta-Programa-Piloto-completo.zip`), no en el repo. Si
se actualiza algún documento, regenerar y resubir:

```powershell
$b="private\propuesta-gustavo"
Compress-Archive -Force -DestinationPath "$env:TEMP\Propuesta-Programa-Piloto-completo.zip" -Path "$b\pdf\3-Resumen-de-una-pagina.pdf","$b\pdf\2-Proyecto-Programa-Piloto.pdf","$b\pdf\8-Presentacion-completa.pdf","$b\xlsx\7-Plantillas-operativas.xlsx","$b\docx\2-Proyecto-Programa-Piloto.docx","$b\pptx\8-Presentacion-completa.pptx"
aws s3 cp "$env:TEMP\Propuesta-Programa-Piloto-completo.zip" s3://gabriel-personal-site-media-452157035969/zip/ --profile ggl-deploy --content-type application/zip
```

Y actualizar `ZIP_PESO` en `_lib/config.ts` si cambió.

## Qué NO va acá jamás

Los seis documentos internos del paquete (informe previo y auditoría, carpeta
de presentación oral, ayuda memoria privada, tabla de fuentes y verificación,
guía de defensa, presentación versión reunión) **no se suben, no se linkean y
no se mencionan** en la página. Quedan solo en la carpeta local
`Documents\Propuesta Gustavo`. Ante la duda sobre un archivo: no es público.

## Verificación post-deploy (una vez en Amplify)

- `curl -I https://drgabrielguillen.com/propuesta-gustavo` → `Cache-Control:
  private, no-store` y `X-Robots-Tag: noindex`.
- La URL de un PDF en incógnito → pantalla de acceso, no el archivo.
- Con la clave → entra y queda dentro al recargar.
- Confirmar en la consola de CloudFront/Amplify que la ruta no quede detrás
  de un behavior con caché propio.
