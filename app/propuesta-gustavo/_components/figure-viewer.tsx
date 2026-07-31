"use client";
import Image from "next/image";
import { useRef } from "react";

// Figura con apertura a pantalla completa (el texto interno es chico en un
// teléfono). <dialog> nativo: foco, Escape y backdrop resueltos por el browser.
// `unoptimized`: el optimizador de next/image haría un fetch del lado del
// servidor SIN la cookie de sesión y rompería la puerta; la imagen ya viene
// exportada al peso correcto.
export function FigureViewer({
  src,
  alt,
  width,
  height,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="block w-full cursor-zoom-in rounded-lg border border-border bg-white p-2 transition hover:border-gold sm:p-3"
        aria-label="Ver la figura en pantalla completa"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          unoptimized
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="h-auto w-full rounded"
          sizes="(max-width: 1024px) 100vw, 896px"
        />
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          // click sobre el backdrop (el propio dialog) cierra
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto max-h-[96dvh] w-[min(97vw,1500px)] rounded-lg bg-white p-2 sm:p-4"
      >
        <div className="max-h-[85dvh] overflow-auto">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            unoptimized
            className="h-auto w-full"
          />
        </div>
        <form method="dialog" className="mt-3 text-right">
          <button className="min-h-11 rounded border border-[#0b0f1e]/30 px-6 py-2 text-sm font-bold uppercase tracking-[0.15em] text-[#0b0f1e] transition hover:bg-[#0b0f1e]/5">
            Cerrar
          </button>
        </form>
      </dialog>
    </>
  );
}
