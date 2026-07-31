import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // La URL pedida originalmente, con mayúscula, redirige a la canónica.
      {
        source: "/propuestaGustavo",
        destination: "/propuesta-gustavo",
        permanent: true, // 308
      },
    ];
  },
  async headers() {
    return [
      // Nada bajo /propuesta-gustavo puede quedar cacheado en CloudFront:
      // el sitio cachea con s-maxage de un año y una página autenticada en el
      // borde sería una puerta abierta. (El middleware repite estos headers.)
      {
        source: "/propuesta-gustavo/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, max-age=0, must-revalidate",
          },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },
  // Los archivos de la propuesta viven FUERA de /public (para que la puerta
  // los cubra). Esto los incluye en el bundle serverless del deploy.
  outputFileTracingIncludes: {
    "/propuesta-gustavo/**": ["./private/propuesta-gustavo/**/*"],
  },
};

export default nextConfig;
