"use client";
import { useState } from "react";

// Facade para YouTube: no se carga NADA de YouTube (ni cookies, ni JS) hasta
// que la persona toca reproducir. Recién ahí se monta el iframe, siempre por
// youtube-nocookie.com y sin autoplay forzado por nosotros.
export function LiteYouTube({ id, titulo }: { id: string; titulo: string }) {
  const [activo, setActivo] = useState(false);

  if (activo) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={titulo}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActivo(true)}
      className="relative flex aspect-video w-full items-center justify-center rounded-lg border border-border bg-navy transition hover:border-gold"
      aria-label={`Reproducir: ${titulo}`}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-2xl text-navy transition group-hover:bg-gold-light">
        ▶
      </span>
      <span className="absolute bottom-4 left-4 right-4 text-sm text-cream-dim">
        Tocá para cargar el video (se abre desde YouTube, sin cookies hasta este
        paso)
      </span>
    </button>
  );
}
