import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";

export const Route = createFileRoute("/")({ component: Index });

const scenes = [
  { title: "EUDORIA", tag: "UM MUNDO ALÉM DOS LIMITES", duration: 10, color: "#63e8ff", narration: "Eudoria. Um mundo onde a geografia desafia os sentidos, a magia molda civilizações e o poder pode mudar o destino de tudo." },
  { title: "TERRAS QUE RESPIRAM MAGIA", tag: "GEOGRAFIA DE EUDORIA", duration: 11, color: "#6fffc4", narration: "De florestas ancestrais a cordilheiras suspensas, cada região guarda correntes mágicas próprias. Rios luminosos cruzam vales, enquanto ruínas antigas escondem forças que ninguém domina por completo." },
  { title: "O CÉU SE ABRE", tag: "FENÔMENOS IMPOSSÍVEIS", duration: 12, color: "#a78bfa", narration: "Há zonas em que a gravidade falha, tempestades arcanas rasgam o horizonte e portais aparecem sem aviso. Em Eudoria, o terreno não é só cenário: ele também é uma ameaça." },
  { title: "PODERES SEM FREIO", tag: "VFX • ENERGIA • DOMÍNIO", duration: 11, color: "#ffbd69", narration: "Chamas que dobram o espaço, rajadas capazes de partir rochas, escudos de energia e sombras que engolem a luz. O limite de um poder depende tanto de quem o usa quanto do preço que aceita pagar." },
  { title: "AS CLASSES", tag: "CAMINHOS DE PODER", duration: 12, color: "#ff77b7", narration: "As classes ajudam a entender como cada pessoa luta e canaliza sua força. Combatentes dominam a linha de frente; conjuradores moldam energia; guardiões protegem aliados; e especialistas misturam técnica, velocidade e estratégia." },
  { title: "NENHUMA CLASSE É TUDO", tag: "TÉCNICA • CONTROLE • ESCOLHAS", duration: 12, color: "#77b9ff", narration: "Uma classe não define tudo o que alguém pode se tornar. Treino, criatividade e experiência abrem combinações inesperadas. A verdadeira vantagem não é ter o maior poder, mas saber quando e como usá-lo." },
  { title: "CAELIS × TENEBRIS", tag: "DOIS LEGADOS EXTREMOS", duration: 13, color: "#d6c4ff", narration: "Dr. Caelis e Tenebris representam forças extraordinárias e caminhos muito diferentes. Seus poderes parecem pertencer a outra escala, capazes de transformar qualquer confronto e desafiar tudo o que se conhece sobre magia." },
  { title: "OS IRMÃOS", tag: "O POTENCIAL NÃO TEM FIM", duration: 14, color: "#ffffff", narration: "E aqui está o detalhe mais insano: os irmãos podem aprender quase todos os poderes de Dr. Caelis e Tenebris. Quase todos. Isso não significa dominar tudo de imediato, mas revela um potencial gigantesco. Este vídeo é um mergulho no universo de Eudoria — não um episódio canônico. O que vocês querem ver a seguir?" },
];

const total = scenes.reduce((sum, scene) => sum + scene.duration, 0);
const starts = scenes.map((_, i) => scenes.slice(0, i).reduce((sum, scene) => sum + scene.duration, 0));

function Index() {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [voiceOn, setVoiceOn] = useState(true);
  const [muted, setMuted] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);
  const spokenScene = useRef(-1);
  const currentScene = scenes.reduce((found, scene, i) => elapsed >= starts[i] ? i : found, 0);
  const scene = scenes[currentScene];

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const update = () => setVoiceReady(window.speechSynthesis.getVoices().length > 0);
    update();
    window.speechSynthesis.onvoiceschanged = update;
    return () => { window.speechSynthesis.onvoiceschanged = null; window.speechSynthesis.cancel(); };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setElapsed((value) => {
        const next = Math.min(total, value + 0.1);
        return next;
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    if (playing && elapsed >= total) setPlaying(false);
  }, [elapsed, playing]);

  useEffect(() => {
    if (!playing || muted || !voiceOn || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (spokenScene.current === currentScene) return;
    spokenScene.current = currentScene;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(scene.narration);
    utterance.lang = "pt-BR";
    utterance.rate = 0.94;
    utterance.pitch = 0.82;
    const voices = window.speechSynthesis.getVoices();
    const portuguese = voices.filter((voice) => voice.lang.toLowerCase().startsWith("pt"));
    const preferred = portuguese.find((voice) => /male|masculino|daniel|ricardo|antonio|felipe/i.test(voice.name));
    if (preferred || portuguese[0]) utterance.voice = preferred || portuguese[0];
    window.speechSynthesis.speak(utterance);
  }, [currentScene, playing, muted, voiceOn, scene.narration]);

  useEffect(() => {
    if (!playing && typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, [playing]);

  const start = () => {
    if (elapsed >= total) { setElapsed(0); spokenScene.current = -1; }
    setPlaying(true);
  };
  const restart = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setElapsed(0); spokenScene.current = -1; setPlaying(false);
  };
  const seek = (value: number) => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    spokenScene.current = -1; setElapsed(value); setPlaying(false);
  };
  const format = (seconds: number) => {
    const s = Math.floor(seconds);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  return (
    <main className="eudoria-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}.eudoria-page{min-height:100vh;background:#06070c;color:#f7f8ff;font-family:Inter,system-ui,sans-serif;padding:24px 16px 36px;overflow:hidden}
        .studio{max-width:1040px;margin:0 auto}.eyebrow{color:#aeb7ce;font-size:11px;letter-spacing:.28em;font-weight:800;text-transform:uppercase}.topline{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:0 0 18px}.live{border:1px solid #ffffff22;border-radius:999px;padding:7px 10px;color:#bfc7d8;font-size:10px;letter-spacing:.15em}
        .layout{display:grid;grid-template-columns:minmax(260px,390px) minmax(0,1fr);gap:30px;align-items:center}.poster-wrap{display:flex;justify-content:center}.poster{position:relative;isolation:isolate;width:min(100%,360px);aspect-ratio:9/16;overflow:hidden;border:1px solid #ffffff28;border-radius:20px;background:#070b19;box-shadow:0 30px 100px #000b,0 0 60px color-mix(in srgb,var(--glow),transparent 85%)}
        .sky{position:absolute;inset:0;z-index:-5;background:radial-gradient(ellipse at 50% 35%,color-mix(in srgb,var(--glow),transparent 65%),transparent 48%),linear-gradient(165deg,#111b36 0%,#090b18 46%,#020308 100%);transition:background .7s}
        .planet{position:absolute;width:72%;aspect-ratio:1;border-radius:50%;left:14%;top:20%;background:radial-gradient(circle at 32% 26%,#fff8 0 1%,transparent 2%),radial-gradient(circle at 40% 35%,color-mix(in srgb,var(--glow),white 12%),#222c56 45%,#050611 72%);box-shadow:0 0 32px var(--glow),0 0 95px color-mix(in srgb,var(--glow),transparent 55%);opacity:.76;animation:planet 8s ease-in-out infinite}
        .ring{position:absolute;left:0;right:0;top:40%;height:22%;border:2px solid color-mix(in srgb,var(--glow),transparent 25%);border-radius:50%;transform:rotate(-18deg) scaleY(.35);box-shadow:0 0 18px var(--glow);animation:ring 7s linear infinite}
        .mountain{position:absolute;left:-12%;right:-12%;bottom:20%;height:38%;background:linear-gradient(150deg,#26314c,#070913 70%);clip-path:polygon(0 75%,12% 44%,22% 61%,39% 10%,51% 55%,64% 25%,76% 64%,89% 35%,100% 70%,100% 100%,0 100%);filter:drop-shadow(0 0 14px var(--glow));opacity:.9}
        .mountain.back{bottom:26%;height:28%;opacity:.5;transform:scaleX(-1);background:linear-gradient(150deg,#3b3c68,#0a0c1b)}
        .beam{position:absolute;width:2px;height:65%;left:50%;top:7%;background:linear-gradient(transparent,var(--glow),transparent);box-shadow:0 0 20px var(--glow);opacity:.45;transform:rotate(23deg);animation:beam 3s ease-in-out infinite}
        .sigil{position:absolute;top:27%;left:50%;width:42%;aspect-ratio:1;transform:translateX(-50%);border:1px solid color-mix(in srgb,var(--glow),transparent 20%);border-radius:50%;box-shadow:0 0 22px color-mix(in srgb,var(--glow),transparent 50%),inset 0 0 22px color-mix(in srgb,var(--glow),transparent 75%);animation:spin 22s linear infinite}
        .sigil:before,.sigil:after{content:"";position:absolute;inset:13%;border:1px solid var(--glow);transform:rotate(45deg);clip-path:polygon(50% 0,100% 100%,0 100%);opacity:.7}.sigil:after{transform:rotate(105deg);inset:21%}
        .particles{position:absolute;inset:0;background-image:radial-gradient(circle,var(--glow) 1px,transparent 1.8px),radial-gradient(circle,#fff 1px,transparent 1.8px);background-size:53px 67px,91px 113px;background-position:0 0,23px 34px;opacity:.48;animation:drift 16s linear infinite}
        .lightning{position:absolute;top:13%;left:16%;width:70%;height:40%;opacity:.72;filter:drop-shadow(0 0 8px var(--glow));animation:flash 3s infinite}
        .lightning path{stroke:var(--glow);stroke-width:1.6;fill:none;stroke-linecap:round}
        .poster-content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:24px 21px 25px;background:linear-gradient(180deg,#050712a8,transparent 26%,transparent 55%,#03040bea 100%)}
        .poster-kicker{font-size:8px;letter-spacing:.28em;font-weight:800;color:#e2e8ff;text-shadow:0 0 10px var(--glow)}.poster-title{font-family:'Barlow Condensed',Impact,sans-serif;font-weight:900;font-size:clamp(38px,8vw,62px);line-height:.84;letter-spacing:-.035em;text-transform:uppercase;text-shadow:0 0 24px color-mix(in srgb,var(--glow),transparent 35%);margin:0;max-width:100%;overflow-wrap:anywhere;animation:title-in .65s both}.poster-tag{font-size:9px;font-weight:800;letter-spacing:.16em;color:var(--glow);margin-top:12px}.scene-bottom{display:flex;justify-content:space-between;align-items:end;gap:8px}.scene-index{font-family:'Barlow Condensed',Impact,sans-serif;font-size:34px;line-height:1;font-weight:800;color:var(--glow)}.scene-note{font-size:8px;letter-spacing:.18em;color:#aeb6cb;text-align:right;line-height:1.7}
        .info h1{font-size:clamp(28px,4vw,48px);line-height:1.03;letter-spacing:-.045em;margin:13px 0 12px;font-weight:800}.info h1 span{color:#9ca9c8}.description{color:#aab3c8;font-size:14px;line-height:1.8;max-width:520px}.meta{display:flex;gap:8px;flex-wrap:wrap;margin:19px 0 22px}.chip{border:1px solid #ffffff1e;border-radius:7px;padding:8px 10px;font-size:10px;color:#d2d9e8;letter-spacing:.08em}
        .control-panel{background:#0d101b;border:1px solid #ffffff18;border-radius:14px;padding:15px;margin-top:20px}.progress-line{height:4px;border-radius:10px;background:#282d3d;overflow:hidden;cursor:pointer}.progress-fill{height:100%;background:linear-gradient(90deg,#6deaff,#b9a2ff);box-shadow:0 0 12px #6deaff;transition:width .1s linear}.time-row{display:flex;justify-content:space-between;color:#9da8be;font-size:11px;margin:9px 0 15px;font-variant-numeric:tabular-nums}.buttons{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn{border:1px solid #ffffff24;border-radius:9px;padding:11px 13px;background:#171b29;color:#eef2ff;font-size:12px;font-weight:700;cursor:pointer;transition:transform .2s,border .2s}.btn:hover{transform:translateY(-1px);border-color:#8cecff}.btn.primary{background:#eafaff;color:#08111b;border-color:#eafaff}.btn:focus-visible{outline:2px solid #74e7ff;outline-offset:3px}.caption{font-size:13px;line-height:1.7;color:#e3e7f3;min-height:84px;padding:14px 0 2px}.caption-label{font-size:9px;letter-spacing:.2em;color:#8490aa;font-weight:800;margin-bottom:7px}.footnote{font-size:10px;color:#778199;line-height:1.6;margin-top:15px}
        @keyframes spin{to{rotate:360deg}}@keyframes planet{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-10px) scale(1.035)}}@keyframes ring{0%,100%{transform:rotate(-18deg) scaleY(.35)}50%{transform:rotate(-12deg) scaleY(.43)}}@keyframes beam{0%,100%{opacity:.15}50%{opacity:.8}}@keyframes drift{to{background-position:0 -180px,23px -210px}}@keyframes flash{0%,85%,100%{opacity:.15}87%,89%{opacity:.95}}@keyframes title-in{from{opacity:0;transform:translateY(14px);filter:blur(7px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
        @media(max-width:760px){.eudoria-page{padding:18px 12px 30px}.layout{grid-template-columns:1fr;gap:23px}.poster{width:min(78vw,340px);border-radius:16px}.info{max-width:560px;margin:0 auto;width:100%}.topline{margin-bottom:15px}.info h1{font-size:32px}.description{font-size:13px}.poster-title{font-size:52px}.control-panel{margin-top:15px}}
        @media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}}
      `}</style>
      <div className="studio">
        <div className="topline"><div className="eyebrow">Arquivo de Eudoria <span style={{ color: "#64718e" }}> / EXTRA ESPECIAL</span></div><div className="live">VÍDEO • 9:16</div></div>
        <div className="layout">
          <div className="poster-wrap">
            <div className="poster" style={{ "--glow": scene.color } as CSSProperties} aria-label={`Cena ${currentScene + 1}: ${scene.title}`}>
              <div className="sky" />
              <div className="planet" />
              <div className="ring" />
              <div className="beam" />
              <div className="sigil" />
              <svg className="lightning" viewBox="0 0 260 260" aria-hidden="true"><path d="M35 10 L90 85 L65 112 L132 145 L105 183 L180 250 M210 0 L160 65 L190 92 L140 128" /></svg>
              <div className="mountain back" /><div className="mountain" /><div className="particles" />
              <div className="poster-content">
                <div className="poster-kicker">EUDORIA • LORE VISUAL</div>
                <div key={currentScene}><h2 className="poster-title">{scene.title}</h2><div className="poster-tag">{scene.tag}</div></div>
                <div className="scene-bottom"><div className="scene-index">0{currentScene + 1}</div><div className="scene-note">RELATÓRIO NÃO CANÔNICO<br />VFX PROCEDURAIS · 4K LOOK</div></div>
              </div>
            </div>
          </div>
          <section className="info">
            <div className="eyebrow">UMA EXPERIÊNCIA CINEMATOGRÁFICA</div>
            <h1>Os poderes mais insanos <span>de Eudoria.</span></h1>
            <p className="description">Um especial fora da linha canônica: viaje pelas regiões impossíveis, conheça as classes e descubra o potencial absurdo dos irmãos. Luz volumétrica, sigilos arcanos e energia animada em tempo real.</p>
            <div className="meta"><span className="chip">⏱ 01:35</span><span className="chip">▣ Vertical 9:16</span><span className="chip">◉ Narração PT-BR</span><span className="chip">✦ VFX em código</span></div>
            <div className="control-panel">
              <div className="progress-line" role="slider" aria-label="Progresso do vídeo" aria-valuemin={0} aria-valuemax={total} aria-valuenow={Math.floor(elapsed)} tabIndex={0} onClick={(event) => { const rect = event.currentTarget.getBoundingClientRect(); seek(Math.round(((event.clientX - rect.left) / rect.width) * total)); }} onKeyDown={(event) => { if (event.key === "ArrowRight") seek(Math.min(total, elapsed + 5)); if (event.key === "ArrowLeft") seek(Math.max(0, elapsed - 5)); }}><div className="progress-fill" style={{ width: `${elapsed / total * 100}%` }} /></div>
              <div className="time-row"><span>{format(elapsed)} / 1:35</span><span>CENA {String(currentScene + 1).padStart(2, "0")} DE 08</span></div>
              <div className="buttons">
                <button className="btn primary" onClick={() => playing ? setPlaying(false) : start()}>{playing ? "Ⅱ  Pausar" : elapsed >= total ? "↻  Reproduzir novamente" : "▶  Assistir especial"}</button>
                <button className="btn" onClick={restart}>↺ Reiniciar</button>
                <button className="btn" onClick={() => { setVoiceOn(!voiceOn); if (voiceOn && "speechSynthesis" in window) window.speechSynthesis.cancel(); }}>{voiceOn ? "◖ Narração ligada" : "◖ Narração desligada"}</button>
                <button className="btn" onClick={() => { setMuted(!muted); if (!muted && "speechSynthesis" in window) window.speechSynthesis.cancel(); }}>{muted ? "Som desativado" : "Som ativado"}</button>
              </div>
              <div className="caption"><div className="caption-label">NARRAÇÃO • CENA ATUAL</div>{scene.narration}</div>
            </div>
            <p className="footnote">{voiceReady ? "Vozes do dispositivo detectadas. A voz masculina depende das vozes PT-BR instaladas no navegador." : "A narração usa a síntese de voz do navegador; permita áudio e aguarde a voz PT-BR carregar."} Os efeitos visuais são gerados por código. A voz e a reprodução começam ao tocar em Assistir.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
