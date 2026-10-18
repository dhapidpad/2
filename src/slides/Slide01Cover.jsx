import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Wind, Flame, CloudRain, Droplet, Volume2 } from 'lucide-react';
import { teamInfo } from '../data/teamMembers';
import { sfx } from '../audio/sfx';


const RAIN = [
  { l: 6, d: 0, t: 5.2, h: 70 },
  { l: 14, d: 1.8, t: 6.4, h: 50 },
  { l: 23, d: 0.6, t: 5.8, h: 90 },
  { l: 31, d: 2.9, t: 7.0, h: 60 },
  { l: 42, d: 1.2, t: 5.5, h: 80 },
  { l: 51, d: 3.6, t: 6.8, h: 55 },
  { l: 60, d: 0.3, t: 6.1, h: 95 },
  { l: 69, d: 2.2, t: 5.6, h: 65 },
  { l: 77, d: 4.1, t: 7.2, h: 75 },
  { l: 85, d: 1.0, t: 6.0, h: 55 },
  { l: 93, d: 2.6, t: 5.9, h: 85 },
];

// ký hiệu phân tử trôi chậm ở nền (t = thời gian bay, giây; d âm = lệch pha ngay từ đầu)
const GLYPHS = [
  { s: 'NO', l: 7, t: 30, d: -4, c: '#FF875F', z: 15, dx: 30 },
  { s: 'NO₂', l: 20, t: 36, d: -22, c: '#D8F36A', z: 17, dx: -24 },
  { s: 'H⁺', l: 34, t: 28, d: -11, c: '#D8F36A', z: 14, dx: 18 },
  { s: 'N₂', l: 47, t: 38, d: -30, c: '#54D7E8', z: 15, dx: -20 },
  { s: 'O₂', l: 59, t: 32, d: -17, c: '#FF875F', z: 14, dx: 26 },
  { s: 'HNO₃', l: 72, t: 40, d: -8, c: '#54D7E8', z: 16, dx: -18 },
  { s: 'NO₃⁻', l: 84, t: 34, d: -26, c: '#54D7E8', z: 14, dx: 22 },
  { s: 'H₂O', l: 93, t: 29, d: -14, c: '#82F2FF', z: 14, dx: -14 },
];
const STARS = Array.from({ length: 36 }, (_, i) => ({
  x: (i * 37.7 + 11) % 100,
  y: (i * 53.3 + 7) % 60,
  z: 1 + (i % 3),
  d: -((i * 0.73) % 5),
  t: 3 + (i % 4),
}));
const SPARKS = [
  { x: 98, y: 128, d: 0 },
  { x: 410, y: 150, d: 1.1 },
  { x: 78, y: 300, d: 2.2 },
  { x: 432, y: 334, d: 0.6 },
  { x: 332, y: 72, d: 1.7 },
];
const TICKER = ['N₂ + O₂ → 2NO', '2NO + O₂ → 2NO₂', '4NO₂ + O₂ + 2H₂O → 4HNO₃', 'HNO₃ → H⁺ + NO₃⁻', 'pH nước mưa < 5,6'];
const TICKER_C = ['#FF875F', '#D8F36A', '#54D7E8', '#82F2FF', '#F06B70'];

const MOLECULE_INFO = {
  NO: {
    formula: 'NO (Nitrogen monoxide)',
    ox: 'Số oxi hóa: N⁺²',
    eq: 'N₂ + O₂ → 2NO',
    desc: 'Khí không màu, hình thành khi N₂ và O₂ phản ứng ở nhiệt độ cao (>1200°C) trong buồng đốt động cơ hoặc tia sét.',
    color: '#FF875F',
  },
  NO2: {
    formula: 'NO₂ (Nitrogen dioxide)',
    ox: 'Số oxi hóa: N⁺⁴',
    eq: '2NO + O₂ → 2NO₂',
    desc: 'Khí màu nâu đỏ ở nồng độ cao, cấu trúc góc ~134°, sinh ra khi NO bị oxygen không khí oxi hóa (2NO + O₂ → 2NO₂).',
    color: '#D8F36A',
  },
  HNO3: {
    formula: 'HNO₃ (Axit Nitric)',
    ox: 'Số oxi hóa: N⁺⁵',
    eq: '4NO₂ + O₂ + 2H₂O → 4HNO₃',
    desc: 'Axit mạnh hình thành trong giọt mây (4NO₂ + O₂ + 2H₂O → 4HNO₃), phân ly hoàn toàn tạo ion H⁺ làm giảm pH nước mưa.',
    color: '#54D7E8',
  },
};
const CHAIN = ['NO', 'NO2', 'HNO3'];
const NEXT = { NO: 'NO2', NO2: 'HNO3', HNO3: 'NO' };

const stat = (label, value, sub, color, delay) => (
  <div
    className="s1-glass s1-rise s1x-card s1-stat-card rounded-xl sm:rounded-2xl p-2 sm:p-3 transition-transform duration-300 hover:-translate-y-1 text-center sm:text-left"
    style={{ '--d': `${delay}ms`, '--c': color }}
  >
    <div className="text-[11px] sm:text-xs font-semibold text-[#94A3B8] leading-tight truncate sm:whitespace-normal">{label}</div>
    <div className="s1-stat-val text-sm sm:text-lg font-black font-mono mt-0.5" style={{ color }}>
      {value}
    </div>
    <div className="text-[10px] sm:text-xs text-[#A8BBC8] leading-tight mt-0.5 truncate sm:whitespace-normal">{sub}</div>
  </div>
);

const CSS = `
.s1x-twinkle{animation:s1xTw var(--t,4s) ease-in-out var(--d,0s) infinite}
@keyframes s1xTw{0%,100%{opacity:.1;transform:scale(.8)}50%{opacity:.85;transform:scale(1.25)}}

.s1x-glyph{opacity:.25;animation:s1xDrift var(--t,30s) linear var(--d,0s) infinite;will-change:transform,opacity}
@keyframes s1xDrift{0%{transform:translate3d(0,0,0);opacity:0}10%{opacity:.5}88%{opacity:.5}100%{transform:translate3d(var(--dx,20px),-112vh,0);opacity:0}}

.s1x-grid{position:absolute;left:-25%;right:-25%;bottom:-6%;height:48%;opacity:.5;transform:perspective(520px) rotateX(64deg);transform-origin:50% 100%;
  background-image:linear-gradient(rgba(84,215,232,.26) 1px,transparent 1px),linear-gradient(90deg,rgba(84,215,232,.26) 1px,transparent 1px);background-size:56px 56px;
  animation:s1xGrid 3.4s linear infinite;-webkit-mask-image:linear-gradient(to top,#000 4%,transparent 80%);mask-image:linear-gradient(to top,#000 4%,transparent 80%)}
@keyframes s1xGrid{to{background-position:0 56px}}

.s1x-spot{position:absolute;inset:0;background:radial-gradient(560px circle at var(--px,72%) var(--py,32%),rgba(84,215,232,.11),transparent 62%)}

.s1x-glitch{position:relative;display:inline-block}
.s1x-glitch::before,.s1x-glitch::after{content:attr(data-text);position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;pointer-events:none}
.s1x-glitch::before{color:#FF4D6D;animation:s1xG1 8s steps(1) 2.4s infinite}
.s1x-glitch::after{color:#2EE6FF;animation:s1xG2 8s steps(1) 2.4s infinite}
@keyframes s1xG1{0%,93%,100%{opacity:0}94%{opacity:.85;transform:translate(-5px,1px);clip-path:inset(8% 0 58% 0)}96%{opacity:.85;transform:translate(4px,-1px);clip-path:inset(62% 0 6% 0)}98%{opacity:0}}
@keyframes s1xG2{0%,93%,100%{opacity:0}94%{opacity:.85;transform:translate(5px,-1px);clip-path:inset(52% 0 12% 0)}96%{opacity:.85;transform:translate(-4px,1px);clip-path:inset(10% 0 60% 0)}98%{opacity:0}}

.s1x-card{position:relative;overflow:hidden}
.s1x-card::before{content:'';position:absolute;inset:0;border-radius:inherit;padding:1px;pointer-events:none;
  background:linear-gradient(120deg,transparent 25%,var(--c,#54D7E8) 50%,transparent 75%);background-size:250% 100%;animation:s1xBorder 5s linear infinite;
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude}
@keyframes s1xBorder{from{background-position:150% 0}to{background-position:-50% 0}}

.s1x-grow{width:var(--w,40%);animation:s1xGrow 1.5s cubic-bezier(.2,.8,.2,1) 1.1s both}
@keyframes s1xGrow{from{width:0}}
.s1x-slide{left:var(--l,40%);animation:s1xSlide 1.5s cubic-bezier(.2,.8,.2,1) 1.1s both}
@keyframes s1xSlide{from{left:0}}

.s1x-ticker{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.s1x-track{display:flex;width:max-content;animation:s1xTick 40s linear infinite}
.s1x-ticker:hover .s1x-track{animation-play-state:paused}
@keyframes s1xTick{to{transform:translateX(-50%)}}

.s1x-tilt{transform:perspective(900px) rotateY(calc(var(--mx,0) * 9deg)) rotateX(calc(var(--my,0) * -7deg));transition:transform .3s ease-out;will-change:transform}
.s1x-rot{animation:s1xRot var(--t,60s) linear infinite}
@keyframes s1xRot{to{transform:rotate(360deg)}}

.s1x-sheen{transform-box:fill-box;transform-origin:center;animation:s1xSheen 6s ease-in-out 1.6s infinite}
@keyframes s1xSheen{0%{transform:translateX(0) skewX(-18deg)}55%,100%{transform:translateX(580px) skewX(-18deg)}}
.s1x-spin{animation:s1xSpin 3.4s linear infinite}
@keyframes s1xSpin{to{transform:rotate(360deg)}}
.s1x-spark{transform-box:fill-box;transform-origin:center;animation:s1xSp 3.6s ease-in-out var(--d,0s) infinite}
@keyframes s1xSp{0%,100%{transform:scale(.2) rotate(0);opacity:0}45%{transform:scale(1) rotate(45deg);opacity:.95}}
.s1x-halo{transform-box:fill-box;transform-origin:center;animation:s1xHalo 1.8s ease-out infinite}
@keyframes s1xHalo{0%{transform:scale(.82);opacity:.95}100%{transform:scale(1.28);opacity:0}}
.s1x-dash{animation:s1xDash 1s linear infinite}
@keyframes s1xDash{to{stroke-dashoffset:-20}}
.s1x-dim{transition:opacity .5s ease}

.s1x-swap{animation:s1xSwap .45s ease-out both}
@keyframes s1xSwap{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

.s1x-cta-ring{position:absolute;inset:0;border-radius:1rem;border:2px solid rgba(84,215,232,.7);pointer-events:none;animation:s1xRing 2.6s ease-out 2s infinite}
@keyframes s1xRing{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.22,1.5);opacity:0}}

/* ============ BẢO ĐẢM CANVAS 1280x720 LUÔN GIỮ BỐ CỤC 2 CỘT CHUẨN ============ */
[data-canvas="true"] .s1-hero-grid {
  display: grid !important;
  grid-template-columns: repeat(12, minmax(0, 1fr)) !important;
  gap: 2.25rem !important;
  align-items: center !important;
  margin-top: auto !important;
  margin-bottom: auto !important;
}
[data-canvas="true"] .s1-col-left {
  grid-column: span 7 / span 7 !important;
  max-width: none !important;
  margin-top: 0 !important;
}
[data-canvas="true"] .s1-col-right {
  grid-column: span 5 / span 5 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  margin-top: 0 !important;
}
[data-canvas="true"] .s1-title {
  font-size: 5.5rem !important;
  line-height: 0.92 !important;
}
[data-canvas="true"] .s1-subtitle {
  font-size: 1.35rem !important;
  line-height: 1.35 !important;
}
[data-canvas="true"] .s1-desc {
  font-size: 0.95rem !important;
  line-height: 1.6 !important;
}
[data-canvas="true"] .s1-stat-grid {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  gap: 0.75rem !important;
}
[data-canvas="true"] .s1-stat-card {
  padding: 0.75rem !important;
  text-align: left !important;
}
[data-canvas="true"] .s1-stat-card div {
  white-space: normal !important;
}
[data-canvas="true"] .s1-stat-val {
  font-size: 1.125rem !important;
}
[data-canvas="true"] .s1-drop-wrap {
  max-width: 420px !important;
}
[data-canvas="true"] .s1-desktop-cta {
  display: flex !important;
}
[data-canvas="true"] .s1-mobile-cta {
  display: none !important;
}
[data-canvas="true"] .s1-mobile-tabs {
  display: none !important;
}
[data-canvas="true"] .s1-orbit-btn {
  display: flex !important;
}
[data-canvas="true"] .s1-header-sub {
  display: inline !important;
}
[data-canvas="true"] .s1x-glyph {
  display: block !important;
}

/* ============ BỐ CỤC DI ĐỘNG REFLOW ============ */
#app-root[data-layout="reflow"] .s1-desktop-cta {
  display: none !important;
}
#app-root[data-layout="reflow"] .s1-mobile-cta {
  display: block !important;
}

@media (prefers-reduced-motion:reduce){
  [class*="s1x-"],[class*="s1x-"]::before,[class*="s1x-"]::after{animation:none!important;transition:none!important}
  .s1x-glitch::before,.s1x-glitch::after{display:none}
}
`;

export default function Slide01Cover({ onNext }) {
  const [activeMol, setActiveMol] = useState('HNO3');
  const [auto, setAuto] = useState(true);
  const rootRef = useRef(null);
  const raf = useRef(0);

  // tự chạy NO → NO₂ → HNO₃ cho tới khi người xem tự bấm
  useEffect(() => {
    if (!auto) return undefined;
    const id = setInterval(() => setActiveMol((m) => NEXT[m]), 4800);
    return () => clearInterval(id);
  }, [auto]);

  // đèn rọi + nghiêng 3D theo chuột (ghi thẳng CSS var → không re-render)
  const onMove = useCallback((e) => {
    if (e.pointerType === 'touch') return;
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty('--px', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--py', `${(py * 100).toFixed(1)}%`);
      el.style.setProperty('--mx', (px * 2 - 1).toFixed(3));
      el.style.setProperty('--my', (py * 2 - 1).toFixed(3));
    });
  }, []);
  const onLeave = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    ['--mx', '--my'].forEach((k) => el.style.setProperty(k, '0'));
  }, []);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const pick = (k) => {
    setAuto(false);
    setActiveMol(k);
    sfx.tick();
  };
  const dim = (k) => ({ opacity: activeMol === k ? 1 : 0.5 });
  const info = MOLECULE_INFO[activeMol];

  return (
    <div
      ref={rootRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="w-full min-h-full flex flex-col justify-between relative select-none py-1"
    >
      <style>{CSS}</style>

      {/* ============ NỀN: aurora + sàn lưới + sao + ký hiệu phân tử + mưa ============ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="s1-aurora absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(84,215,232,.25), transparent 70%)' }}
        />
        <div
          className="s1-aurora absolute -bottom-40 right-[-80px] w-[520px] h-[520px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(216,243,106,.15), rgba(255,135,95,.10) 50%, transparent 70%)',
            animationDelay: '-6s',
          }}
        />
        <div className="s1x-spot" />
        <div className="s1x-grid" />
        {STARS.map((s, i) => (
          <span
            key={i}
            className="s1x-twinkle absolute rounded-full bg-[#BFEFFF]"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.z, height: s.z, '--t': `${s.t}s`, '--d': `${s.d}s` }}
          />
        ))}
        {GLYPHS.map((g, i) => (
          <span
            key={g.s}
            className="s1x-glyph absolute font-mono font-bold hidden sm:block"
            style={{ left: `${g.l}%`, bottom: '-6%', color: g.c, fontSize: g.z, '--t': `${g.t}s`, '--d': `${g.d}s`, '--dx': `${g.dx}px` }}
          >
            {g.s}
          </span>
        ))}
        {RAIN.map((r, i) => (
          <span
            key={i}
            className="s1-rain absolute top-0 w-px rounded-full"
            style={{
              left: `${r.l}%`,
              height: r.h,
              '--t': `${r.t}s`,
              '--d': `${r.d}s`,
              background: 'linear-gradient(to bottom, transparent, rgba(130,242,255,.5))',
            }}
          />
        ))}
      </div>

      {/* ============ HEADER ============ */}
      <div className="flex flex-wrap items-center justify-between gap-2 z-10 mb-2">
        <div className="s1-rise flex items-center gap-2" style={{ '--d': '0ms' }}>
          <span className="px-3 py-1 rounded-full bg-[#54D7E8]/10 border border-[#54D7E8]/30 text-[#54D7E8] text-xs font-bold tracking-widest uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(84,215,232,0.18)]">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-[#54D7E8] opacity-70 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-[#54D7E8]" />
            </span>
            HÓA HỌC • MÔI TRƯỜNG
          </span>
          <span className="s1-header-sub text-xs text-[#94A3B8] hidden sm:inline">Chuyên đề Học tập Hóa học 11</span>
        </div>

        <div
          className="s1-rise s1-glass text-xs font-mono text-[#F4F7FA] px-3.5 py-1 rounded-full"
          style={{ '--d': '120ms' }}
        >
          <span className="text-[#54D7E8] font-bold">{teamInfo.groupName}</span>
          <span className="mx-2 text-[#2B4B60]">|</span>
          Lớp {teamInfo.className}
          <span className="s1-header-sub mx-2 text-[#2B4B60] hidden sm:inline">|</span>
          <span className="s1-header-sub hidden sm:inline text-[#D8F36A]">{teamInfo.presentationDate}</span>
        </div>
      </div>

      {/* ============ HERO ============ */}
      <div className="s1-hero-grid grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center my-auto z-10 py-1">
        {/* ----- Cột trái ----- */}
        <div className="s1-col-left lg:col-span-7 space-y-3.5 sm:space-y-4 text-left">
          <div className="space-y-2.5 sm:space-y-3">
            <div
              className="s1-rise inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF875F]/10 border border-[#FF875F]/30 text-[#FF875F] text-[11px] sm:text-xs font-bold"
              style={{ '--d': '200ms' }}
            >
              <Wind size={14} className="shrink-0" />
              <span className="truncate sm:whitespace-normal">Từ oxide của nitrogen (NO<sub>x</sub>) đến tác động lên môi trường</span>
            </div>

            <h1
              className="s1-rise s1-title text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.92]"
              style={{ '--d': '320ms' }}
            >
              <span
                className="s1x-glitch text-white drop-shadow-[0_4px_24px_rgba(84,215,232,0.25)]"
                data-text="MƯA"
              >
                MƯA
              </span>{' '}
              <span
                className="s1-shine-text bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #54D7E8, #82F2FF, #D8F36A, #82F2FF, #54D7E8)',
                  filter: 'drop-shadow(0 0 22px rgba(84,215,232,.45))',
                }}
              >
                AXIT
              </span>
            </h1>

            <p
              className="s1-rise s1-subtitle text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-[#DCE6F0] max-w-xl leading-snug"
              style={{ '--d': '440ms' }}
            >
              Cơ chế chuyển hóa NO &rarr; NO₂ &rarr; HNO₃, hệ quả sinh thái và công nghệ kiểm soát phát thải
            </p>
          </div>

          <p
            className="s1-rise s1-desc text-xs sm:text-sm md:text-base text-[#A8BBC8] max-w-xl leading-relaxed"
            style={{ '--d': '540ms' }}
          >
            Khám phá hành trình hóa học khí quyển: khi khí nitrogen và oxygen trong vùng cháy nhiệt độ cao tạo ra <strong className="text-[#FF875F]">NO</strong>, tiếp tục bị oxi hóa thành <strong className="text-[#D8F36A]">NO₂</strong> rồi chuyển hóa trong giọt mây thành <strong className="text-[#54D7E8]">axit nitric (HNO₃)</strong> — cùng với H₂SO₄ từ SO₂ làm giảm pH nước mưa dưới mốc tham khảo 5,6.
          </p>

          {/* 3 chỉ số */}
          <div className="s1-stat-grid grid grid-cols-3 gap-2 sm:gap-3 max-w-lg">
            {stat('Mốc tự nhiên', 'pH ≈ 5,6', 'Do CO₂ ⇌ H₂CO₃', '#D8F36A', 640)}
            {stat('Chuỗi NOₓ', 'N⁰ → N⁺⁵', 'NO → NO₂ → HNO₃', '#54D7E8', 740)}
            {stat('Xúc tác SCR', 'Khử NOₓ', 'Thành N₂ + H₂O', '#FF875F', 840)}
          </div>

          {/* Thang pH tóm tắt */}
          <div className="s1-rise max-w-lg" style={{ '--d': '940ms' }}>
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#94A3B8] mb-1">
              <span>Thang pH (0–14) • Mưa axit EPA: <strong className="text-[#FF875F]">4,2–4,4</strong></span>
              <span className="text-[#D8F36A] font-mono font-bold">Mốc tự nhiên: ≈ 5,6</span>
            </div>
            <div className="relative h-2 sm:h-2.5 rounded-full" style={{ background: 'linear-gradient(90deg, #F06B70 0%, #FF875F 22%, #D8F36A 40%, #8FCB89 50%, #54D7E8 70%, #6D5BD0 100%)' }}>
              <div className="s1x-grow absolute top-0 left-0 h-full rounded-l-full border-r-2 border-white/95" style={{ '--w': '40%', boxShadow: '0 0 14px rgba(240,107,112,.55)' }} />
              <div className="s1x-slide s1-marker absolute -top-1" style={{ '--l': '40%' }}>
                <div className="w-[14px] sm:w-[16px] h-[14px] sm:h-[16px] rounded-full bg-white border-[3px] border-[#050E17] shadow-[0_0_14px_rgba(255,255,255,.8)]" />
              </div>
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs font-mono text-[#7F93A8] mt-1">
              <span>0 (Axit mạnh)</span>
              <span className="text-[#D8F36A]">5,6</span>
              <span>7 (Trung tính)</span>
              <span>14 (Kiềm)</span>
            </div>
          </div>

          {/* Nút bắt đầu (Hiển thị ở cột trái trên Desktop/Canvas) */}
          <div className="s1-desktop-cta s1-rise flex flex-wrap items-center gap-3.5 pt-1" style={{ '--d': '1040ms' }}>
            <div className="relative">
              <span className="s1x-cta-ring" aria-hidden="true" />
              <button
                onClick={() => {
                  sfx.unlock();
                  sfx.riser();
                  if (onNext) onNext();
                }}
                className="s1-focus s1-sweep s1-cta-btn group relative overflow-hidden px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#54D7E8] via-[#3FCBE0] to-[#22A4BB] hover:from-[#7AF4FF] hover:to-[#54D7E8] text-[#050E17] font-extrabold text-sm sm:text-base shadow-[0_0_36px_rgba(84,215,232,0.45),inset_0_1px_0_rgba(255,255,255,.5)] flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Volume2 size={16} className="relative z-10 text-[#050E17]" />
                <span className="relative z-10">Bắt đầu </span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="text-xs text-[#94A3B8] flex items-center gap-1.5">
              <span>Điều hướng:</span>
              <kbd className="px-2 py-0.5 bg-[#0D2232] border border-[#1E3A4D] rounded-md font-mono text-white text-xs">
                Space / →
              </kbd>
              <span className="s1-canvas-show hidden sm:inline">hoặc vuốt ngang trên điện thoại</span>
            </div>
          </div>
        </div>

        {/* ----- Cột phải: Giọt kính 3D & Tương tác Phân tử ----- */}
        <div className="s1-col-right lg:col-span-5 flex flex-col items-center justify-center relative mt-3 lg:mt-0">
          {/* Thanh tab chọn phân tử trên di động (Reflow) */}
          <div className="s1-mobile-tabs flex sm:hidden items-center justify-center gap-1.5 mb-2 w-full max-w-[340px]">
            <button
              onClick={() => pick('NO')}
              aria-pressed={activeMol === 'NO'}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all ${
                activeMol === 'NO'
                  ? 'bg-[#FF875F]/20 border border-[#FF875F] text-[#FF875F] shadow-[0_0_12px_rgba(255,135,95,0.3)]'
                  : 'bg-[#0D2232] border border-white/10 text-[#94A3B8]'
              }`}
            >
              <Flame size={12} /> NO
            </button>
            <button
              onClick={() => pick('NO2')}
              aria-pressed={activeMol === 'NO2'}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all ${
                activeMol === 'NO2'
                  ? 'bg-[#D8F36A]/20 border border-[#D8F36A] text-[#D8F36A] shadow-[0_0_12px_rgba(216,243,106,0.3)]'
                  : 'bg-[#0D2232] border border-white/10 text-[#94A3B8]'
              }`}
            >
              <CloudRain size={12} /> NO₂
            </button>
            <button
              onClick={() => pick('HNO3')}
              aria-pressed={activeMol === 'HNO3'}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all ${
                activeMol === 'HNO3'
                  ? 'bg-[#54D7E8]/20 border border-[#54D7E8] text-[#54D7E8] shadow-[0_0_12px_rgba(84,215,232,0.3)]'
                  : 'bg-[#0D2232] border border-white/10 text-[#94A3B8]'
              }`}
            >
              <Droplet size={12} /> HNO₃
            </button>
          </div>

          <div
            className="s1-drop-wrap s1-rise relative w-full max-w-[280px] sm:max-w-[420px] aspect-square flex items-center justify-center"
            style={{ '--d': '500ms' }}
          >
            {/* Quầng sáng */}
            <div className="absolute inset-[6%] bg-gradient-to-tr from-[#54D7E8]/25 via-[#D8F36A]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Radar đồng tâm phía sau giọt */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="s1x-rot absolute inset-[-4%] rounded-full" style={{ '--t': '70s', border: '1px dashed rgba(84,215,232,.18)' }} />
              <div className="s1x-rot absolute inset-[8%] rounded-full" style={{ '--t': '50s', animationDirection: 'reverse', border: '1px dashed rgba(216,243,106,.14)' }} />
            </div>

            {/* 3 Nút chọn phân tử tương tác quanh giọt */}
            <button
              onClick={() => pick('NO')}
              aria-pressed={activeMol === 'NO'}
              className={`s1-glass s1-focus s1-orbit-btn hidden sm:flex absolute left-0 top-[14%] z-20 items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                activeMol === 'NO' ? 'ring-2 ring-[#FF875F] scale-105 text-[#FF875F]' : 'text-[#FF875F]/80 hover:text-[#FF875F]'
              }`}
            >
              <Flame size={13} /> 1. NO (N⁺²)
            </button>
            <button
              onClick={() => pick('NO2')}
              aria-pressed={activeMol === 'NO2'}
              className={`s1-glass s1-focus s1-orbit-btn hidden sm:flex absolute right-0 top-[30%] z-20 items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                activeMol === 'NO2' ? 'ring-2 ring-[#D8F36A] scale-105 text-[#D8F36A]' : 'text-[#D8F36A]/80 hover:text-[#D8F36A]'
              }`}
            >
              <CloudRain size={13} /> 2. NO₂ (N⁺⁴)
            </button>
            <button
              onClick={() => pick('HNO3')}
              aria-pressed={activeMol === 'HNO3'}
              className={`s1-glass s1-focus s1-orbit-btn hidden sm:flex absolute left-[2%] bottom-[16%] z-20 items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                activeMol === 'HNO3' ? 'ring-2 ring-[#54D7E8] scale-105 text-[#54D7E8]' : 'text-[#54D7E8]/80 hover:text-[#54D7E8]'
              }`}
            >
              <Droplet size={13} /> 3. HNO₃ (N⁺⁵)
            </button>

            <div className="s1x-tilt w-full h-full relative z-10">
              <svg
                viewBox="0 0 500 500"
                className="w-full h-full"
                role="img"
                aria-labelledby="coverDropTitle coverDropDesc"
              >
                <title id="coverDropTitle">Giọt mưa axit 3D và quá trình chuyển hóa NOx thành HNO3</title>
                <desc id="coverDropDesc">
                  Minh họa giọt nước mưa lơ lửng phía trên đường chân trời đô thị và nhà máy, bên trong hiển thị cấu trúc phân tử NO, NO2 và sự phân ly HNO3 thành H+ và NO3-.
                </desc>
                <defs>
                  <radialGradient id="s1GlassSphere" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#C4FAFF" stopOpacity="0.95" />
                    <stop offset="25%" stopColor="#54D7E8" stopOpacity="0.65" />
                    <stop offset="55%" stopColor="#1B6F8E" stopOpacity="0.75" />
                    <stop offset="85%" stopColor="#0B2F44" stopOpacity="0.92" />
                    <stop offset="100%" stopColor="#051722" stopOpacity="0.98" />
                  </radialGradient>

                  <radialGradient id="s1CausticGlow" cx="50%" cy="85%" r="45%">
                    <stop offset="0%" stopColor="#D8F36A" stopOpacity="0.75" />
                    <stop offset="60%" stopColor="#54D7E8" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#54D7E8" stopOpacity="0" />
                  </radialGradient>

                  <linearGradient id="s1RimLight" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#E8FEFF" />
                    <stop offset="45%" stopColor="#54D7E8" />
                    <stop offset="100%" stopColor="#D8F36A" />
                  </linearGradient>

                  <linearGradient id="s1xSheen" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                    <stop offset="50%" stopColor="#fff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                  </linearGradient>

                  <radialGradient id="s1AtomN" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#A8F8FF" />
                    <stop offset="40%" stopColor="#38BED4" />
                    <stop offset="90%" stopColor="#0D5969" />
                    <stop offset="100%" stopColor="#062F38" />
                  </radialGradient>
                  <radialGradient id="s1AtomO" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FFC4B0" />
                    <stop offset="40%" stopColor="#FF7A59" />
                    <stop offset="90%" stopColor="#B33B1E" />
                    <stop offset="100%" stopColor="#5C1605" />
                  </radialGradient>
                  <radialGradient id="s1IonH" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#D8F36A" />
                    <stop offset="100%" stopColor="#829B1E" />
                  </radialGradient>

                  <clipPath id="s1DropClip">
                    <path d="M250 55 C190 155 125 240 125 325 A125 125 0 0 0 375 325 C375 240 310 155 250 55 Z" />
                  </clipPath>
                </defs>

                {/* Lớp mây bão phía trên */}
                <g opacity="0.45">
                  <ellipse cx="190" cy="60" rx="75" ry="26" fill="#16384E" />
                  <ellipse cx="265" cy="52" rx="90" ry="30" fill="#1B435C" />
                  <ellipse cx="330" cy="65" rx="65" ry="22" fill="#123044" />
                </g>

                {/* Đường chân trời đô thị & ống khói công nghiệp */}
                <g opacity="0.38">
                  <rect x="40" y="380" width="36" height="100" rx="2" fill="#1E3A4D" />
                  <rect x="85" y="340" width="48" height="140" rx="2" fill="#173142" />
                  <rect x="142" y="390" width="32" height="90" rx="2" fill="#1E3A4D" />
                  <polygon points="190,480 202,310 216,310 228,480" fill="#29485A" />
                  <polygon points="380,480 392,290 406,290 418,480" fill="#29485A" />
                  <g fill="#54D7E8" opacity="0.7">
                    <rect x="94" y="360" width="5" height="5" />
                    <rect x="108" y="378" width="5" height="5" />
                    <rect x="94" y="396" width="5" height="5" />
                    <rect x="116" y="412" width="5" height="5" />
                    <rect x="52" y="402" width="5" height="5" />
                    <rect x="60" y="430" width="5" height="5" />
                  </g>
                  <circle cx="209" cy="310" r="8" fill="#FF875F" opacity="0.3" />
                  <circle cx="209" cy="310" r="4" fill="#FF875F" />
                  <circle cx="399" cy="290" r="8" fill="#FF875F" opacity="0.3" />
                  <circle cx="399" cy="290" r="4" fill="#FF875F" />
                  {/* Luồng khí thải NO bay lên mây */}
                  <path
                    d="M209 308 Q225 245 245 190"
                    stroke="#FF875F"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    fill="none"
                    className="animate-dash-flow"
                  />
                  <path
                    d="M399 288 Q370 225 320 175"
                    stroke="#D8F36A"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    fill="none"
                    className="animate-dash-flow"
                  />
                </g>

                {/* Hạt khí thải bay dọc theo luồng (SMIL, không tốn JS) */}
                {[0, 1.1, 2.2].map((b) => (
                  <g key={b}>
                    <circle r="3.6" fill="#FF875F">
                      <animateMotion dur="3.3s" begin={`${b}s`} repeatCount="indefinite" path="M209 308 Q225 245 245 190" />
                      <animate attributeName="opacity" values="0;1;1;0" dur="3.3s" begin={`${b}s`} repeatCount="indefinite" />
                    </circle>
                    <circle r="3.6" fill="#D8F36A">
                      <animateMotion dur="3.3s" begin={`${b + 0.5}s`} repeatCount="indefinite" path="M399 288 Q370 225 320 175" />
                      <animate attributeName="opacity" values="0;1;1;0" dur="3.3s" begin={`${b + 0.5}s`} repeatCount="indefinite" />
                    </circle>
                  </g>
                ))}

                {/* Gợn nước đồng tâm dưới đáy giọt */}
                <g fill="none" stroke="#54D7E8" strokeWidth="1.5">
                  <ellipse className="s1-ripple" cx="250" cy="458" rx="90" ry="14" style={{ '--d': '0s' }} />
                  <ellipse className="s1-ripple" cx="250" cy="458" rx="90" ry="14" style={{ '--d': '1.2s' }} />
                  <ellipse className="s1-ripple" cx="250" cy="458" rx="90" ry="14" style={{ '--d': '2.4s' }} />
                </g>

                {/* Quỹ đạo khí quyển */}
                <g className="s1-orbit" style={{ '--t': '38s' }}>
                  <ellipse cx="250" cy="250" rx="210" ry="120" transform="rotate(-28 250 250)" fill="none" stroke="#54D7E8" strokeWidth="1.5" strokeDasharray="8 12" opacity="0.5" />
                  <circle cx="430" cy="180" r="9" fill="#54D7E8" opacity="0.25" />
                  <circle cx="430" cy="180" r="4.5" fill="#54D7E8" />
                  <circle cx="70" cy="320" r="8" fill="#D8F36A" opacity="0.25" />
                  <circle cx="70" cy="320" r="3.5" fill="#D8F36A" />
                </g>
                <g className="s1-orbit" style={{ '--t': '55s', animationDirection: 'reverse' }}>
                  <ellipse cx="250" cy="250" rx="180" ry="140" transform="rotate(40 250 250)" fill="none" stroke="#D8F36A" strokeWidth="1.2" strokeDasharray="5 9" opacity="0.35" />
                  <circle cx="380" cy="350" r="8" fill="#FF875F" opacity="0.25" />
                  <circle cx="380" cy="350" r="3.5" fill="#FF875F" />
                </g>

                {/* tia lấp lánh quanh giọt */}
                {SPARKS.map((s, i) => (
                  <g key={i} transform={`translate(${s.x} ${s.y})`}>
                    <path className="s1x-spark" style={{ '--d': `${s.d}s` }} d="M0-9 L2.2-2.2 L9 0 L2.2 2.2 L0 9 L-2.2 2.2 L-9 0 L-2.2-2.2Z" fill="#E8FEFF" />
                  </g>
                ))}

                {/* GIỌT KÍNH CHÍNH */}
                <g className="s1-float" style={{ transformOrigin: '250px 250px' }}>
                  {/* Vector halo viền ngoài thay cho feGaussianBlur để đạt 60fps trên mobile */}
                  <path
                    d="M250 55 C190 155 125 240 125 325 A125 125 0 0 0 375 325 C375 240 310 155 250 55 Z"
                    fill="none"
                    stroke="#54D7E8"
                    strokeWidth="8"
                    opacity="0.18"
                  />
                  <path
                    d="M250 55 C190 155 125 240 125 325 A125 125 0 0 0 375 325 C375 240 310 155 250 55 Z"
                    fill="url(#s1GlassSphere)"
                    stroke="url(#s1RimLight)"
                    strokeWidth="3.5"
                  />
                  <ellipse cx="250" cy="385" rx="80" ry="35" fill="url(#s1CausticGlow)" />

                  {/* Bên trong giọt: bong bóng + mặt thoáng dung dịch + vệt sáng quét */}
                  <g clipPath="url(#s1DropClip)">
                    <circle className="s1-bubble" cx="215" cy="405" r="4" fill="#C4FAFF" opacity="0.8" style={{ '--d': '0s' }} />
                    <circle className="s1-bubble" cx="268" cy="410" r="3" fill="#C4FAFF" opacity="0.8" style={{ '--d': '1.3s' }} />
                    <circle className="s1-bubble" cx="305" cy="395" r="5" fill="#C4FAFF" opacity="0.8" style={{ '--d': '2.5s' }} />
                    <circle className="s1-bubble" cx="180" cy="385" r="2.5" fill="#C4FAFF" opacity="0.8" style={{ '--d': '3.1s' }} />
                    <path d="M125 325 Q187 308 250 325 T375 325 L375 460 L125 460 Z" fill="#54D7E8" opacity="0.14" />
                    <rect className="s1x-sheen" x="-150" y="40" width="80" height="440" fill="url(#s1xSheen)" />
                  </g>

                  {/* Vệt phản xạ quang học trên vỏ giọt nước */}
                  <path
                    d="M210 130 C175 190 155 250 155 315 C155 330 158 340 162 340 C166 340 172 320 182 275 C192 230 220 165 230 135 C232 128 220 115 210 130 Z"
                    fill="#FFFFFF"
                    opacity="0.55"
                  />
                  <path d="M335 240 C350 280 355 320 345 360" stroke="#C4FAFF" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.45" />

                  {/* Phân tử NO₂ góc 134° ở phần trên giọt */}
                  <g className="s1x-dim" style={dim('NO2')}>
                    <g transform="translate(215, 195)">
                      <line x1="35" y1="22" x2="10" y2="40" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                      <line x1="35" y1="22" x2="60" y2="40" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                      <line x1="35" y1="27" x2="60" y2="45" stroke="#D8F36A" strokeWidth="2" strokeDasharray="3 2" />
                      <circle cx="10" cy="40" r="13" fill="url(#s1AtomO)" stroke="#FF875F" strokeWidth="1.5" />
                      <text x="10" y="44" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">O</text>
                      <circle cx="60" cy="40" r="13" fill="url(#s1AtomO)" stroke="#FF875F" strokeWidth="1.5" />
                      <text x="60" y="44" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">O</text>
                      <circle cx="35" cy="22" r="16" fill="url(#s1AtomN)" stroke="#54D7E8" strokeWidth="1.8" />
                      <text x="35" y="27" fill="#FFFFFF" fontSize="12" fontWeight="900" textAnchor="middle">N</text>
                      <g transform="translate(35 22)">
                        <g className="s1x-spin">
                          <circle r="25" fill="none" stroke="#C4FAFF" strokeOpacity="0.3" strokeDasharray="2 4" />
                          <circle cx="25" r="2.6" fill="#FFFFFF" />
                        </g>
                      </g>
                      <text x="35" y="62" fill="#D8F36A" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="monospace">NO₂ (134°)</text>
                    </g>
                  </g>

                  {/* Phân tử NO liên kết đôi/ba ở giữa trái */}
                  <g className="s1x-dim" style={dim('NO')}>
                    <g transform="translate(160, 270)">
                      <line x1="18" y1="18" x2="50" y2="18" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                      <line x1="18" y1="24" x2="50" y2="24" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                      <circle cx="16" cy="21" r="15" fill="url(#s1AtomN)" stroke="#54D7E8" strokeWidth="1.8" />
                      <text x="16" y="25" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle">N</text>
                      <circle cx="52" cy="21" r="13" fill="url(#s1AtomO)" stroke="#FF875F" strokeWidth="1.5" />
                      <text x="52" y="25" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">O</text>
                      <g transform="translate(16 21)">
                        <g className="s1x-spin" style={{ animationDuration: '2.6s' }}>
                          <circle r="23" fill="none" stroke="#C4FAFF" strokeOpacity="0.3" strokeDasharray="2 4" />
                          <circle cx="23" r="2.4" fill="#FFFFFF" />
                        </g>
                      </g>
                    </g>
                  </g>

                  {/* Ion H⁺ phân ly trong pha nước + Anion NO₃⁻ */}
                  <g className="s1x-dim" style={dim('HNO3')}>
                    {activeMol === 'HNO3' && (
                      <line x1="214" y1="354" x2="278" y2="348" stroke="#54D7E8" strokeWidth="2" strokeDasharray="5 5" className="s1x-dash" opacity="0.8" />
                    )}
                    <g transform="translate(302, 345)">
                      <circle r="24" fill="none" stroke="#D8F36A" strokeWidth="1.2" opacity="0.45" strokeDasharray="3 4" />
                      <circle r="15" fill="url(#s1IonH)" stroke="#D8F36A" strokeWidth="1.5" />
                      <text y="4" fill="#050E17" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="monospace">H⁺</text>
                    </g>
                    <g transform="translate(190, 358)">
                      <circle r="22" fill="#0D3B54" stroke="#54D7E8" strokeWidth="1.8" />
                      <circle r="27" fill="none" stroke="#54D7E8" strokeWidth="1" opacity="0.35" strokeDasharray="4 4" />
                      <text y="4" fill="#54D7E8" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="monospace">NO₃⁻</text>
                    </g>
                  </g>

                  {/* Vòng sáng báo phân tử đang chọn (key → chạy lại animation mỗi lần đổi) */}
                  <g key={activeMol} aria-hidden="true">
                    {activeMol === 'NO' && (
                      <>
                        <circle cx="194" cy="291" r="40" fill="#FF875F" opacity="0.1" />
                        <circle className="s1x-halo" cx="194" cy="291" r="40" fill="none" stroke="#FF875F" strokeWidth="2.5" />
                      </>
                    )}
                    {activeMol === 'NO2' && (
                      <>
                        <circle cx="250" cy="232" r="56" fill="#D8F36A" opacity="0.08" />
                        <circle className="s1x-halo" cx="250" cy="232" r="56" fill="none" stroke="#D8F36A" strokeWidth="2.5" />
                      </>
                    )}
                    {activeMol === 'HNO3' && (
                      <>
                        <circle className="s1x-halo" cx="190" cy="358" r="32" fill="none" stroke="#54D7E8" strokeWidth="2.5" />
                        <circle className="s1x-halo" cx="302" cy="345" r="28" fill="none" stroke="#D8F36A" strokeWidth="2.5" style={{ animationDelay: '0.3s' }} />
                      </>
                    )}
                  </g>
                </g>
              </svg>
            </div>
          </div>

          {/* Hộp thông tin phân tử đang chọn */}
          <div className="s1-glass w-full max-w-[400px] rounded-2xl p-3 border border-[#29485A] text-xs mt-1" aria-live="polite">
            <div key={activeMol} className="s1x-swap">
              <div className="flex items-center justify-between mb-1 gap-2">
                <span className="font-mono font-extrabold text-sm" style={{ color: info.color }}>
                  {info.formula}
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#050E17]/80 text-[#DCE6F0] border border-white/10 shrink-0">
                  {info.ox}
                </span>
              </div>
              <div className="font-mono text-xs mb-1.5" style={{ color: info.color }}>
                {info.eq}
              </div>
              <p className="text-[#A8BBC8] text-xs leading-relaxed">{info.desc}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-2.5" aria-hidden="true">
              {CHAIN.map((k, i) => (
                <span
                  key={k}
                  className="h-1.5 flex-1 rounded-full transition-all duration-500"
                  style={{
                    background: i <= CHAIN.indexOf(activeMol) ? MOLECULE_INFO[k].color : '#1E3A4D',
                    opacity: i === CHAIN.indexOf(activeMol) ? 1 : 0.55,
                    boxShadow: i === CHAIN.indexOf(activeMol) ? `0 0 10px ${MOLECULE_INFO[k].color}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nút bắt đầu trên di động (Reflow mode) — đặt ở cuối khối nội dung trước Ticker */}
      <div className="s1-mobile-cta block lg:hidden z-10 my-3 px-1">
        <button
          onClick={() => {
            sfx.unlock();
            sfx.riser();
            if (onNext) onNext();
          }}
          className="s1-focus s1-sweep w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#54D7E8] via-[#3FCBE0] to-[#22A4BB] hover:from-[#7AF4FF] hover:to-[#54D7E8] text-[#050E17] font-extrabold text-sm shadow-[0_0_36px_rgba(84,215,232,0.45)] flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-95"
        >
          <Volume2 size={16} className="text-[#050E17]" />
          <span>Bắt đầu khám phá</span>
          <ArrowRight size={18} />
        </button>
        <div className="text-center text-[11px] text-[#94A3B8] mt-1.5">
          Chạm để bật âm thanh hoặc vuốt sang trái để tiếp tục
        </div>
      </div>

      {/* ============ DẢI PHƯƠNG TRÌNH ============ */}
      <div className="s1x-ticker s1-rise z-10 mt-2 border-y border-white/5 py-1.5" style={{ '--d': '1200ms' }} aria-hidden="true">
        <div className="s1x-track text-xs font-mono">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {TICKER.map((e, i) => (
                <span key={i} className="px-5 whitespace-nowrap" style={{ color: TICKER_C[i % TICKER_C.length] }}>
                  {e}
                  <span className="ml-10 text-[#2B4B60]">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}