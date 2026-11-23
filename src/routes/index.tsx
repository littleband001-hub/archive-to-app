import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: EudoriaEpisode });

const scenes = [
  {
    title: "O PODER QUE NÃO DEVERIA EXISTIR",
    narration: "Episódio quatro. Depois de escolherem a primeira porta, os irmãos descobriram que aquele lugar escondia muito mais do que um simples caminho. E agora, eles teriam que decidir em quem confiar.",
    caption: "EPISÓDIO 4",
    place: "hall",
    duration: 15,
  },
  {
    title: "OS GUARDIÕES",
    narration: "No fim do corredor, dois guardiões de pedra bloqueavam a passagem. Símbolos dourados brilhavam em seus corpos. Um deles deu um passo à frente. Quem tentar passar terá que provar que merece continuar.",
    caption: "NENHUMA PASSAGEM É LIVRE",
    place: "hall",
    duration: 18,
  },
  {
    title: "UM PODER DIFERENTE",
    narration: "Enquanto isso, o irmão mais novo percebeu algo estranho na própria mão. Uma luz roxa surgiu entre seus dedos. Não parecia magia comum. Era como se a energia estivesse viva — e respondesse aos seus sentimentos.",
    caption: "A ENERGIA RESPONDE",
    place: "magic",
    duration: 18,
  },
  {
    title: "ALGO NA ESCURIDÃO",
    narration: "Mas aquela luz chamou atenção. Entre as árvores, uma criatura observava cada movimento. Ela não atacou. Apenas acompanhou os irmãos, esperando o momento certo para revelar sua verdadeira intenção.",
    caption: "ELES NÃO ESTÃO SOZINHOS",
    place: "forest",
    duration: 18,
  },
  {
    title: "O PODER IMPOSSÍVEL",
    narration: "Quando o guardião avançou, o irmão mais velho tentou protegê-lo. A energia roxa explodiu em volta dos dois e fez até a criatura recuar. Os irmãos perceberam que aquela força não deveria existir — pelo menos, não em alguém como eles.",
    caption: "UMA FORÇA FORA DAS REGRAS",
    place: "battle",
    duration: 20,
  },
  {
    title: "A ESCOLHA",
    narration: "Agora, o corredor estava aberto, mas a criatura ainda os esperava adiante. Fugir poderia mantê-los seguros por enquanto. Enfrentar os guardiões talvez revelasse a verdade sobre aquele poder. E você, o que faria no lugar deles?",
    caption: "O QUE OS IRMÃOS DEVEM FAZER?",
    place: "choice",
    duration: 18,
  },
];

const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

function EudoriaEpisode() {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [choice, setChoice] = useState("");
  const sceneIndex = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < scenes.length; i += 1) {
      sum += scenes[i].duration;
      if (elapsed < sum) return i;
    }
    return scenes.length - 1;
  }, [elapsed]);
  const scene = scenes[sceneIndex];
  const start = scenes.slice(0, sceneIndex).reduce((sum, item) => sum + item.duration, 0);

  useEffect(() => {
    if (!playing) return;
    const startAt = Date.now() - elapsed * 1000;
    const timer = window.setInterval(() => {
      const next = Math.min(totalDuration, Math.floor((Date.now() - startAt) / 1000));
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
    utterance.rate = 0.88;
    utterance.pitch = 0.78;
    const voices = window.speechSynthesis?.getVoices() ?? [];
    const voice = voices.find(v => v.lang.toLowerCase().startsWith("pt-br") && /male|masculino|daniel|ricardo/i.test(v.name))
      ?? voices.find(v => v.lang.toLowerCase().startsWith("pt-br"))
      ?? voices.find(v => v.lang.toLowerCase().startsWith("pt"));
    if (voice) utterance.voice = voice;
    window.speechSynthesis?.cancel();
    window.speechSynthesis?.speak(utterance);
    return () => window.speechSynthesis?.cancel();
  }, [playing, sceneIndex]);

  const restart = () => {
    window.speechSynthesis?.cancel();
    setElapsed(0);
    setChoice("");
    setPlaying(true);
  };

  return (
    <main className="min-h-screen bg-[#11101a] px-3 py-5 text-white sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4">
        <header className="text-center">
          <p className="text-[10px] font-extrabold tracking-[0.3em] text-amber-300">ANIMAÇÃO 2D · FANTASIA</p>
          <h1 className="mt-2 text-2xl font-black uppercase leading-tight sm:text-4xl">Eudoria — Episódio 4</h1>
          <p className="mt-2 text-xs text-white/60">O poder que não deveria existir</p>
        </header>

        <section className="relative w-full max-w-[540px] overflow-hidden rounded-xl border-2 border-white/10 bg-[#211b31] shadow-2xl">
          <div className="relative aspect-[9/16] overflow-hidden bg-[#221a37]">
            <CartoonScene place={scene.place} sceneIndex={sceneIndex} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            <div className="absolute inset-x-3 top-4 z-20 text-center sm:top-6">
              <div className="inline-block rounded-sm bg-black/50 px-3 py-1 text-[9px] font-black tracking-[0.2em] text-amber-300">
                {scene.caption}
              </div>
              <h2 className="mx-auto mt-3 max-w-sm text-balance text-xl font-black uppercase leading-tight text-amber-300 drop-shadow-[0_3px_0_#44250b] sm:text-3xl">
                {scene.title}
              </h2>
            </div>
            <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-4 pt-16 sm:px-6">
              <p className="text-center text-xs font-medium leading-relaxed text-white sm:text-sm">{scene.narration}</p>
              <div className="mt-4 flex items-center justify-between text-[9px] font-bold tracking-widest text-white/70">
                <span>CENA {String(sceneIndex + 1).padStart(2, "0")} / 06</span>
                <span>{time(elapsed)} / {time(totalDuration)}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
                <div className="h-full bg-amber-400 transition-[width] duration-200" style={{ width: `${Math.min(100, ((elapsed - start) / scene.duration) * 100)}%` }} />
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => elapsed >= totalDuration ? restart() : setPlaying(v => !v)} className="rounded-full bg-amber-400 px-7 py-3 text-sm font-black text-[#21160a] shadow-lg transition hover:bg-amber-300">
            {playing ? "Ⅱ  PAUSAR" : elapsed >= totalDuration ? "↻  ASSISTIR NOVAMENTE" : "▶  DAR PLAY"}
          </button>
          <button onClick={restart} className="rounded-full border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold hover:bg-white/10">RECOMEÇAR</button>
        </div>

        {scene.place === "choice" && (
          <div className="grid w-full max-w-[540px] gap-3 sm:grid-cols-2">
            <button onClick={() => setChoice("fugir")} className={`rounded-lg border-2 p-4 text-left text-sm font-bold ${choice === "fugir" ? "border-amber-300 bg-amber-300/15" : "border-amber-400/70 bg-black/20"}`}>
              <span className="mr-2 text-amber-300">A</span> Fugir das câmaras e tentar se reunir.
            </button>
            <button onClick={() => setChoice("enfrentar")} className={`rounded-lg border-2 p-4 text-left text-sm font-bold ${choice === "enfrentar" ? "border-violet-300 bg-violet-300/15" : "border-violet-400/70 bg-black/20"}`}>
              <span className="mr-2 text-violet-300">B</span> Enfrentar os guardiões e descobrir a verdade.
            </button>
            {choice && <p className="sm:col-span-2 text-center text-sm text-amber-200">Você escolheu {choice === "fugir" ? "fugir e tentar se reunir" : "enfrentar os guardiões"}. A aventura continua...</p>}
          </div>
        )}
        <p className="max-w-lg text-center text-[10px] leading-relaxed text-white/40">
          A animação e a narração são reproduzidas na prévia. A voz depende das vozes em português instaladas no navegador ou celular.
        </p>
      </div>
    </main>
  );
}

function time(value: number) {
  const mins = Math.floor(value / 60);
  const secs = value % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function CartoonScene({ place, sceneIndex }: { place: string; sceneIndex: number }) {
  const isForest = place === "forest" || place === "choice";
  const isMagic = place === "magic" || place === "battle";
  const showRobot = place === "hall" || place === "battle";
  return (
    <svg viewBox="0 0 360 640" className="absolute inset-0 h-full w-full" role="img" aria-label="Cena animada em estilo desenho 2D">
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop stopColor={isForest ? "#201638" : "#59402e"}/><stop offset="1" stopColor={isForest ? "#100e22" : "#241b1b"}/></linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#46312b"/><stop offset="1" stopColor="#17121a"/></linearGradient>
        <radialGradient id="magic"><stop stopColor="#f3c6ff"/><stop offset=".35" stopColor="#b04cff"/><stop offset="1" stopColor="#8d22ff" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width="360" height="640" fill="url(#wall)"/>
      {isForest ? (
        <g opacity=".9">
          {Array.from({length: 9},(_,i)=><g key={i}><path d={`M${i*48-15} 450 L${i*48+10} ${90+(i%3)*50} L${i*48+42} 450 Z`} fill={i%2?"#171226":"#2a1d3b"}/><path d={`M${i*48+10} 450 L${i*48+10} 620`} stroke="#100d1c" strokeWidth="9"/></g>)}
          {Array.from({length: 7},(_,i)=><g key={i} fill="#d8aaff"><ellipse cx={25+i*52} cy={150+(i%3)*65} rx="3" ry="8" opacity=".9"/><ellipse cx={33+i*52} cy={150+(i%3)*65} rx="3" ry="8" opacity=".9"/></g>)}
        </g>
      ) : (
        <g>
          {Array.from({length: 11},(_,i)=><g key={i}><path d={`M0 ${55+i*43} H360`} stroke="#241b1b" strokeWidth="3"/><path d={`M${(i%2)*30} ${55+i*43} V${98+i*43}`} stroke="#322324" strokeWidth="2"/></g>)}
          {Array.from({length: 7},(_,i)=><g key={i} fill="#d7a33b" opacity=".6"><circle cx={25+i*52} cy={82+(i%2)*30} r="7" fill="none" stroke="#d7a33b" strokeWidth="1.5"/><path d={`M${21+i*52} ${82+(i%2)*30} h8 m-4 -4 v8`} stroke="#e4b84f"/></g>)}
        </g>
      )}
      <path d="M0 445 L360 445 L360 640 L0 640Z" fill="url(#floor)"/>
      <path d="M0 455 L360 455" stroke="#8a6850" strokeOpacity=".35" strokeWidth="3"/>
      {isMagic && <g className="animate-pulse"><circle cx="280" cy="380" r="100" fill="url(#magic)" opacity=".75"/>{Array.from({length:8},(_,i)=><path key={i} d={`M${245+i*9} 430 q${(i%2?24:-24)} -45 0 -100`} fill="none" stroke="#c96cff" strokeWidth="2.5" strokeLinecap="round"/>)}</g>}
      {place === "choice" && <g transform="translate(260 360)"><path d="M0 160 Q-35 100 -10 40 L-25 0 L8 25 L30 -20 L40 28 L70 4 L58 65 Q80 125 45 160Z" fill="#090812" stroke="#35224e" strokeWidth="4"/><ellipse cx="12" cy="62" rx="6" ry="3" fill="#b99aff"/><ellipse cx="42" cy="62" rx="6" ry="3" fill="#b99aff"/><path d="M12 96 Q28 110 43 94" fill="none" stroke="#553476" strokeWidth="4"/></g>}
      {showRobot && <g transform={`translate(${sceneIndex===1?205:218} 315)`} className="animate-[float_3s_ease-in-out_infinite]">
        <ellipse cx="0" cy="148" rx="43" ry="10" fill="#08080d" opacity=".6"/>
        <rect x="-30" y="25" width="60" height="76" rx="10" fill="#96989e" stroke="#696b73" strokeWidth="3"/>
        <rect x="-25" y="-22" width="50" height="47" rx="8" fill="#a7a9ae" stroke="#696b73" strokeWidth="3"/>
        <rect x="-18" y="-7" width="11" height="5" rx="2" fill="#ffd94f"/><rect x="7" y="-7" width="11" height="5" rx="2" fill="#ffd94f"/>
        <rect x="-42" y="38" width="13" height="53" rx="5" fill="#92949a"/><rect x="29" y="38" width="13" height="53" rx="5" fill="#92949a"/>
        <rect x="-23" y="100" width="15" height="48" rx="5" fill="#777982"/><rect x="8" y="100" width="15" height="48" rx="5" fill="#777982"/>
        <circle cx="0" cy="58" r="12" fill="none" stroke="#e6b941" strokeWidth="3"/><path d="M-8 58 H8 M0 50 V66" stroke="#e6b941" strokeWidth="2"/>
      </g>}
      <CartoonBoy x={place==="magic"?155:place==="forest"?125:place==="choice"?105:82} y={438} small={false} older={true} />
      <CartoonBoy x={place==="magic"?175:place==="forest"?177:place==="choice"?145:135} y={493} small={true} older={false} />
      {place === "battle" && <g className="animate-pulse"><circle cx="172" cy="430" r="65" fill="url(#magic)"/><path d="M150 450 l-22 -45 27 13 -4 -35 23 34 28 -22 -8 40" fill="none" stroke="#d5a2ff" strokeWidth="5" strokeLinecap="round"/></g>}
      {place === "magic" && <g><circle cx="214" cy="405" r="34" fill="url(#magic)"/><circle cx="214" cy="405" r="8" fill="#f4d9ff"/><path d="M212 440 q-20 -20 0 -40 q20 -20 0 -40" fill="none" stroke="#df9cff" strokeWidth="3" className="animate-pulse"/></g>}
      <style>{`@keyframes float {0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </svg>
  );
}

function CartoonBoy({ x, y, small, older }: { x: number; y: number; small: boolean; older: boolean }) {
  const scale = small ? 0.72 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="animate-[float_4s_ease-in-out_infinite]">
      <ellipse cx="0" cy="3" rx="24" ry="6" fill="#08080d" opacity=".5"/>
      <path d="M-11 -2 L-14 25 L-7 25 L-3 1 M4 0 L7 25 L14 25 L12 -2" fill="#50372e"/>
      <path d="M-17 -42 Q0 -48 17 -42 L20 -5 L-20 -5Z" fill={older ? "#8e4b2b" : "#2e8ba5"} stroke="#56362d" strokeWidth="2"/>
      <path d="M-17 -38 L-27 -20 L-22 -15 L-10 -29 M17 -38 L27 -22 L22 -17 L11 -29" fill="#d9a47c"/>
      <circle cx="0" cy="-61" r="22" fill="#f2c49c" stroke="#6b4738" strokeWidth="2"/>
      {older ? <path d="M-22 -63 L-24 -80 L-12 -74 L-8 -91 L2 -78 L15 -87 L18 -71 L24 -64 L17 -65 L12 -70 L6 -64 L0 -70 L-8 -63Z" fill="#38251f" stroke="#38251f" strokeWidth="3"/> : <path d="M-22 -65 Q-28 -84 -8 -82 Q10 -91 20 -73 L20 -63 L11 -70 L4 -65 L-4 -71 L-12 -64Z" fill="#a46b35" stroke="#704625" strokeWidth="2"/>}
      <ellipse cx="-7" cy="-61" rx="2.8" ry="4" fill="#211914"/><ellipse cx="8" cy="-61" rx="2.8" ry="4" fill="#211914"/>
      <path d="M-5 -49 Q0 -45 6 -49" fill="none" stroke="#a65b50" strokeWidth="2" strokeLinecap="round"/>
      {older && <path d="M-12 -36 L0 -28 L12 -36" fill="none" stroke="#438a47" strokeWidth="5"/>}
    </g>
  );
}
