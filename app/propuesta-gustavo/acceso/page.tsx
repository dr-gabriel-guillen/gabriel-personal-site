// Pantalla de acceso de /propuesta-gustavo. El middleware reescribe acá toda
// petición sin cookie válida: la URL no cambia y el contenido no se sirve.
// Es un componente de servidor sin JS propio: el formulario postea directo al
// Route Handler y el error vuelve por querystring (?e=...).

export const dynamic = "force-dynamic";

const ERRORES: Record<string, string> = {
  clave: "La clave no es correcta. Revisala y probá de nuevo.",
  limite:
    "Demasiados intentos. Esperá unos quince minutos y volvé a probar.",
  config:
    "El acceso no está configurado en el servidor. Avisale a quien te compartió el enlace.",
};

export default async function AccesoPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const { e } = await searchParams;
  const error = e ? (ERRORES[e] ?? ERRORES.clave) : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-5 pt-20">
      <main className="w-full max-w-md">
        <div className="rounded-lg border border-border bg-navy-card p-8 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
            Documento privado
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-cream">
            Acceso al documento
          </h1>
          <p className="mt-4 text-sm leading-7 text-cream-dim">
            Esta propuesta fue preparada para una destinataria en particular.
            Ingresá la clave que recibiste junto al enlace.
          </p>

          <form method="POST" action="/propuesta-gustavo/acceso/entrar" className="mt-8">
            <label
              htmlFor="clave"
              className="block text-xs font-bold uppercase tracking-[0.2em] text-cream"
            >
              Clave de acceso
            </label>
            <input
              id="clave"
              name="clave"
              type="password"
              required
              autoComplete="current-password"
              autoFocus
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "error-clave" : undefined}
              className="mt-2 w-full rounded border border-border bg-navy px-4 py-3 text-base text-cream outline-none transition focus:border-gold"
            />
            {error && (
              <p
                id="error-clave"
                role="alert"
                className="mt-3 rounded border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-300"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              className="mt-6 w-full bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-navy transition hover:bg-gold-light"
            >
              Entrar
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs leading-6 text-cream-dim">
          Si no tenés la clave, escribí a quien te compartió este enlace.
        </p>
      </main>
    </div>
  );
}
