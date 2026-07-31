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

En Amplify (App settings → Environment variables) hay que cargar:

| Variable | Valor |
|---|---|
| `PROPUESTA_PASSWORD` | la clave acordada (hoy: la que empieza con G…) |
| `PROPUESTA_COOKIE_SECRET` | 64 hex al azar: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

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

1. **Video (35 MB) y audio (21 MB).** Están en Descargas de la máquina de
   Gabriel (`Piloto_de_90_Días.mp4` y
   `Organizar_propuestas_vecinales_con_seis_datos_básicos.m4a`).
   **No commitearlos al repo.** Camino recomendado: subir el video a YouTube
   como **no listado** y poner el ID en `MEDIA.video.youtubeId` de
   `app/propuesta-gustavo/_lib/config.ts` (se embebe vía `youtube-nocookie.com`
   y no carga nada hasta que se toca reproducir). Alternativa: copiar los
   archivos a `private/propuesta-gustavo/media/` y poner el nombre en
   `MEDIA.*.src` (se sirven por la ruta protegida, con soporte de Range).
   Mientras estén vacíos, la página muestra "Disponible a pedido".
2. **CV de Gustavo.** No existe todavía. Cuando esté: guardarlo como
   `private/propuesta-gustavo/pdf/cv-gustavo-guillen.pdf` y poner
   `CV_DISPONIBLE = true` en `_lib/config.ts`. Nada más.
3. **Imagen Open Graph.** TODO en `app/propuesta-gustavo/layout.tsx`. Tiene
   que ser un asset público (WhatsApp la busca sin cookie), así que debe ser
   una portada neutra sin contenido del documento.
4. ~~Peso real de cada archivo~~ — resuelto: la página hace `fs.stat` en cada
   request y muestra el peso real.

## El ZIP de "Descargar todo"

`zip/Propuesta-Programa-Piloto-completo.zip` está prearmado (el pipeline de
Amplify no tiene `zip` garantizado y no quisimos sumar dependencias). Si se
actualiza algún documento, regenerarlo:

```powershell
$b="private\propuesta-gustavo"
Compress-Archive -Force -DestinationPath "$b\zip\Propuesta-Programa-Piloto-completo.zip" -Path "$b\pdf\3-Resumen-de-una-pagina.pdf","$b\pdf\2-Proyecto-Programa-Piloto.pdf","$b\pdf\8-Presentacion-completa.pdf","$b\xlsx\7-Plantillas-operativas.xlsx","$b\docx\2-Proyecto-Programa-Piloto.docx","$b\pptx\8-Presentacion-completa.pptx"
```

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
