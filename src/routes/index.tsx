import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: EudoriaExperience,
});

const scenes = [
  {
    title: "EUDORIA",
    eyebrow: "UM MUNDO ALÉM DOS LIMITES",
    narration:
      "Eudoria. Um mundo onde a própria realidade parece viva. Aqui, cada região esconde forças antigas, e cada passo pode despertar algo impossível.",
    description: "Um mundo onde a realidade respira.",
    duration: 10,
    color: "from-violet-950 via-slate-950 to-black",
    symbol: "✦",
  },
  {
    title: "TERRAS VIVAS",
    eyebrow: "A GEOGRAFIA DO IMPOSSÍVEL",
    narration:
      "Florestas que brilham como constelações. Montanhas cortadas por rios de energia. E desertos onde o horizonte muda quando ninguém está olhando.",
    description: "Florestas luminosas, montanhas colossais e desertos que desafiam os sentidos.",
    duration: 12,
    color: "from-emerald-950 via-slate-950 to-black",
    symbol: "⌁",
  },
  {
    title: "FENÔMENOS SELVAGENS",
    eyebrow: "A NATUREZA NÃO OBEDECE",
    narration:
      "Em Eudoria, a gravidade pode falhar, tempestades podem carregar memórias, e portais surgem onde o mundo está ferido. Nada é apenas cenário. Tudo pode reagir.",
    description: "Gravidade instável, tempestades de energia e portais imprevisíveis.",
    duration: 12,
    color: "from-cyan-950 via-indigo-950 to-black",
    symbol: "ϟ",
  },
  {
    title: "PODERES SELVAGENS",
    eyebrow: "FORÇAS QUE TRANSFORMAM",
    narration:
      "Há quem controle elementos, quem dobre o espaço, quem transforme matéria e quem escute a energia escondida em todas as coisas. Mas poder sem domínio pode consumir seu próprio portador.",
    description: "Elementos, espaço, matéria e energia — cada dom tem um preço.",
    duration: 12,
    color: "from-orange-950 via-red-950 to-black",
    symbol: "✹",
  },
  {
    title: "CLASSES",
    eyebrow: "CADA CAMINHO MUDA O DESTINO",
    narration:
      "Os guardiões protegem. Os arcanistas estudam. Os errantes sobrevivem. E os raros despertos quebram as regras que todos acreditavam eternas. Nenhuma classe define tudo o que alguém pode se tornar.",
    description: "Guardiões, arcanistas, errantes e despertos.",
    duration: 13,
    color: "from-blue-950 via-slate-950 to-black",
    symbol: "⟡",
  },
  {
    title: "O LIMITE",
    eyebrow: "PODER EXIGE CONTROLE",
    narration:
      "Aprender uma habilidade é só o começo. Para dominar uma força, é preciso técnica, coragem e entender aquilo que ela pode tirar de você. Em Eudoria, o erro mais perigoso é acreditar que já sabe tudo.",
    description: "Técnica, coragem e escolhas definem quem sobrevive.",
    duration: 12,
    color: "from-slate-900 via-violet-950 to-black",
    symbol: "◈",
  },
  {
    title: "CAELIS × TENEBRIS",
    eyebrow: "DOIS LEGADOS, UMA RIVALIDADE",
    narration:
      "Dr. Caelis e Tenebris representam caminhos opostos — conhecimento e sombra, precisão e caos. Suas habilidades parecem impossíveis de alcançar. Mas os dois irmãos estão prestes a descobrir algo que muda tudo.",
    description: "Dois legados que podem mudar o equilíbrio do mundo.",
    duration: 12,
    color: "from-indigo-950 via-fuchsia-950 to-black",
    symbol: "⚡",
  },
  {
    title: "O DESPERTAR",
    eyebrow: "O IMPOSSÍVEL ESTÁ COMEÇANDO",
    narration:
      "Os irmãos descobrem que podem aprender quase todos os poderes de Caelis e Tenebris. Não porque já sejam invencíveis, mas porque seu potencial não segue as regras conhecidas. E isso é apenas o começo. O que vocês acharam dessa troca de poderes?",
    description: "Eles podem aprender quase todos os poderes. Mas a que custo?",
    duration: 12,
    color: "from-violet-950 via-black to-amber-950",
    symbol: "✦",
  },
];

const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

function EudoriaExperience() {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const sceneIndex = useMemo(() => {
    let accumulated = 0;
    for (let i = 0; i < scenes.length; i += 1) {
      accumulated += scenes[i].duration;
      if (elapsed < accumulated) return i;
    }
    return scenes.length - 1;
  }, [elapsed]);
  const scene = scenes[sceneIndex];
  const sceneStart = scenes
    .slice(0, sceneIndex)
    .reduce((sum, item) => sum + item.duration, 0);
  const sceneProgress = Math.min(
    100,
    ((elapsed - sceneStart) / scene.duration) * 100,
  );

  useEffect(() => {
    if (!playing) return;
    const startedAt = Date.now() - elapsed * 1000;
    const timer = window.setInterval(() => {
      const next = Math.min(totalDuration, Math.floor((Date.now() - startedAt) / 1000));
      setElapsed(next);
      if (next >= totalDuration) setPlaying(false);
    }, 200);
    return () => window.clearInterval(timer);
  }, [playing, elapsed]);

  useEffect(() => {
    if (!playing) {
      window.speechSynthesis?.cancel();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(scene.narration);
    utterance.lang = "pt-BR";
    utterance.rate = 0.91;
    utterance.pitch = 0.78;
    const voices = window.speechSynthesis?.getVoices() ?? [];
    const portugueseVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("pt-br"))
      ?? voices.find((voice) => voice.lang.toLowerCase().startsWith("pt"));
    if (portugueseVoice) utterance.voice = portugueseVoice;
    window.speechSynthesis?.cancel();
    window.speechSynthesis?.speak(utterance);
    return () => window.speechSynthesis?.cancel();
  }, [playing, sceneIndex]);

  const restart = () => {
    window.speechSynthesis?.cancel();
    setElapsed(0);
    setPlaying(true);
  };

  return (
    <main className="min-h-screen bg-[#05060b] px-4 py-7 text-white sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6">
        <header className="text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-violet-300 sm:text-xs">
            Especial animado · não canônico
          </p>
          <h1 className="text-4xl font-black tracking-[0.16em] sm:text-6xl">EUDORIA</h1>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            Os poderes mais insanos · experiência cinematográfica
          </p>
        </header>

        <section
          className={`relative isolate w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br ${scene.color} shadow-[0_0_70px_rgba(139,92,246,0.2)]`}
          aria-label="Animação de Eudoria"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-[12%] top-[16%] h-36 w-36 rounded-full bg-violet-400/15 blur-3xl animate-pulse" />
            <div className="absolute right-[5%] top-[42%] h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl animate-pulse [animation-delay:700ms]" />
            <div className="absolute bottom-[-8%] left-[20%] h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl animate-pulse [animation-delay:300ms]" />
            {Array.from({ length: 26 }, (_, i) => (
              <span
                key={i}
                className="absolute block h-1 w-1 rounded-full bg-white/70 animate-pulse"
                style={{
                  left: `${(i * 37 + 11) % 100}%`,
                  top: `${(i * 53 + 7) % 100}%`,
                  animationDelay: `${(i % 7) * 180}ms`,
                  opacity: 0.25 + (i % 5) * 0.13,
                }}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-black/80 to-transparent" />
          </div>

          <div className="relative flex aspect-[9/16] flex-col items-center justify-between px-6 py-8 text-center sm:px-8 sm:py-10">
            <div className="relative z-10">
              <p className="text-[9px] font-bold uppercase tracking-[0.34em] text-white/60">
                {scene.eyebrow}
              </p>
            </div>

            <div className="relative flex flex-1 flex-col items-center justify-center">
              <div
                key={sceneIndex}
                className="mb-8 flex h-40 w-40 items-center justify-center rounded-full border border-white/20 bg-white/[0.035] shadow-[0_0_55px_rgba(167,139,250,0.22)] animate-[spin_24s_linear_infinite] sm:h-48 sm:w-48"
              >
                <div className="flex h-[78%] w-[78%] items-center justify-center rounded-full border border-violet-200/30 bg-black/20 text-6xl text-violet-100 drop-shadow-[0_0_18px_rgba(196,181,253,0.8)] animate-[spin_18s_linear_infinite_reverse] sm:text-7xl">
                  {scene.symbol}
                </div>
              </div>
              <h2
                key={scene.title}
                className="text-3xl font-black uppercase tracking-[0.1em] drop-shadow-lg sm:text-4xl animate-pulse"
              >
                {scene.title}
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75 sm:text-base">
                {scene.description}
              </p>
            </div>

            <div className="relative z-10 w-full">
              <div className="mb-2 flex items-center justify-between text-[10px] font-medium tracking-widest text-white/55">
                <span>CAPÍTULO {String(sceneIndex + 1).padStart(2, "0")} / 08</span>
                <span>
                  {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
                  {String(elapsed % 60).padStart(2, "0")} / 01:35
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-violet-300 transition-[width] duration-200"
                  style={{ width: `${sceneProgress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (elapsed >= totalDuration) {
                setElapsed(0);
                setPlaying(true);
              } else {
                setPlaying((value) => !value);
              }
            }}
            className="rounded-full bg-violet-200 px-7 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-violet-950/40 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            {playing ? "Ⅱ  PAUSAR" : elapsed >= totalDuration ? "▶  ASSISTIR NOVAMENTE" : "▶  DAR PLAY"}
          </button>
          <button
            type="button"
            onClick={restart}
            className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/50 hover:bg-white/10"
          >
            ↺ RECOMEÇAR
          </button>
        </div>

        <div className="max-w-xl text-center text-xs leading-relaxed text-slate-500">
          A animação roda dentro da prévia da Lovable e usa a narração de voz disponível no navegador.
          Para ouvir, aumente o volume do aparelho. A voz pode variar conforme o celular ou navegador.
        </div>
      </div>
    </main>
  );
}
