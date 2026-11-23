import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: EudoriaVideo,
});

function EudoriaVideo() {
  const [videoError, setVideoError] = useState(false);

  return (
    <main className="min-h-screen bg-[#070910] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6">
        <header className="text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-violet-300">
            Especial não canônico
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            EUDORIA
          </h1>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            Os poderes mais insanos · 1 minuto e 35 segundos
          </p>
        </header>

        <section className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-violet-300/25 bg-black shadow-[0_0_60px_rgba(139,92,246,0.18)]">
          <video
            className="aspect-[9/16] w-full bg-black object-contain"
            controls
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
            aria-label="Vídeo especial de Eudoria"
          >
            <source src="/eudoria_especial_vertical.mp4" type="video/mp4" />
            Seu navegador não suporta a reprodução de vídeo.
          </video>
          {videoError && (
            <div className="border-t border-white/10 px-4 py-3 text-sm text-amber-200">
              O reprodutor está pronto, mas o arquivo MP4 ainda não está em
              public/eudoria_especial_vertical.mp4. Envie o vídeo para a pasta
              public do projeto para habilitar o play.
            </div>
          )}
        </section>

        <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
          {[
            ["MUNDO VIVO", "Geografia e fenômenos de Eudoria"],
            ["PODERES SELVAGENS", "Habilidades e classes extraordinárias"],
            ["O DESPERTAR", "Os irmãos e o legado de Caelis e Tenebris"],
          ].map(([title, description]) => (
            <article
              key={title}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
            >
              <h2 className="text-sm font-bold tracking-wide text-violet-200">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {description}
              </p>
            </article>
          ))}
        </div>

        <p className="max-w-2xl text-center text-xs leading-relaxed text-slate-500">
          Uma experiência de fantasia em formato vertical. A reprodução exige
          que o arquivo MP4 esteja incluído nos assets públicos do projeto.
        </p>
      </div>
    </main>
  );
}
