import React, { useEffect, useRef, useState } from 'react';
import { Truck, CloudRain, TreePine, Wind, Play, Pause } from 'lucide-react';
import { useSlideActive } from '../components/SlideActiveContext';

const ZONES = [
  { id: 1, num: '01', tag: 'Nguồn phát thải', title: 'Xe cộ & Khói nhà máy', color: '#FF875F', icon: Truck, eq: 'N₂ + O₂ → 2NO',
    desc: 'Đốt nhiên liệu ở nhiệt độ cao (>1200°C) trong động cơ xe máy, ô tô và lò hơi nhiệt điện làm N₂ và O₂ phản ứng, sinh ra khí NO không màu thoát vào khí quyển.' },
  { id: 2, num: '02', tag: 'Biến đổi khí quyển', title: 'Gió đưa đi xa & Phản ứng trong mây', color: '#54D7E8', icon: CloudRain, eq: '4NO₂ + O₂ + 2H₂O → 4HNO₃',
    desc: 'Gió tầng đối lưu cuốn chất ô nhiễm đi xa hàng chục đến hàng trăm km. Trên đường đi, NO bị oxi hóa thành NO₂, rồi phản ứng với H₂O và O₂ tạo axit nitric (HNO₃).' },
  { id: 3, num: '03', tag: 'Nơi tiếp nhận', title: 'Hồ nước, Đất rừng & Công trình', color: '#D8F36A', icon: TreePine, eq: 'HNO₃ → H⁺ + NO₃⁻',
    desc: 'Axit lắng đọng xuống mặt đất qua mưa, sương (lắng đọng ướt) hoặc hạt, khí bám dính (lắng đọng khô), gây tác động ở những vùng cách rất xa ống xả ban đầu.' },
];

const BANDS = { 1: [10, 290], 2: [315, 745], 3: [770, 1090] };
const TOUR_MS = 7000;

const CSS = `
.rx2{font-family:'Be Vietnam Pro','Segoe UI',system-ui,sans-serif}
.rx2>*{flex-shrink:0}
.rx2-title{padding:.04em 0 .14em;background:linear-gradient(100deg,#fff 20%,#BFEFF6 60%,#E6FA9A);-webkit-background-clip:text;background-clip:text;color:transparent}
.rx2-rise{opacity:0;transform:translateY(18px);animation:rx2rise .85s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:var(--d,0ms)}
@keyframes rx2rise{to{opacity:1;transform:none}}
.rx2-panel{position:relative;background:linear-gradient(160deg,rgba(20,51,73,.75),rgba(5,15,25,.92));box-shadow:0 36px 90px -34px rgba(84,215,232,.4),inset 0 1px 0 rgba(255,255,255,.08)}
.rx2-panel::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:1px;background:linear-gradient(120deg,#FF875F99,#54D7E899,#D8F36A99);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
.rx2-zone{cursor:pointer;outline:none;transition:opacity .5s}
.rx2-zone:hover{opacity:1!important}
.rx2-zone:focus-visible .rx2-pill{stroke-width:3.5;filter:drop-shadow(0 0 6px #fff)}
.rx2-band{transition:opacity .6s}
.rx2-flow{animation:rx2dash 1.2s linear infinite}
@keyframes rx2dash{to{stroke-dashoffset:-28}}
.rx2-tw{animation:rx2tw 3.4s ease-in-out infinite;animation-delay:var(--sd,0s)}
@keyframes rx2tw{50%{opacity:.2}}
.rx2-pulse{transform-box:fill-box;transform-origin:center;animation:rx2pulse 1.9s ease-out infinite;animation-delay:var(--sd,0s)}
@keyframes rx2pulse{0%{transform:scale(.6);opacity:.7}100%{transform:scale(2.4);opacity:0}}
.rx2-smoke{transform-box:fill-box;transform-origin:center;opacity:0;animation:rx2smoke 4.4s ease-out infinite;animation-delay:var(--sd,0s)}
@keyframes rx2smoke{0%{opacity:.6;transform:translate(0,0) scale(.5)}100%{opacity:0;transform:translate(80px,-50px) scale(3.2)}}
.rx2-cloud{animation:rx2drift 8s ease-in-out infinite alternate}
@keyframes rx2drift{to{transform:translateX(12px)}}
.rx2-rain{animation:rx2rain 1.1s linear infinite;animation-delay:var(--sd,0s)}
@keyframes rx2rain{0%{stroke-dashoffset:0;opacity:0}20%{opacity:.95}100%{stroke-dashoffset:-40;opacity:0}}
.rx2-rip{transform-box:fill-box;transform-origin:center;animation:rx2rip 3.2s ease-out infinite;animation-delay:var(--sd,0s)}
@keyframes rx2rip{0%{transform:scale(.4);opacity:.9}100%{transform:scale(1.6);opacity:0}}
.rx2-aur{animation:rx2aur 14s ease-in-out infinite alternate}
@keyframes rx2aur{to{transform:translateX(40px) scaleY(1.15)}}
.rx2-beam{transition:transform .9s cubic-bezier(.6,.1,.2,1)}
.rx2-step{position:relative;overflow:hidden;text-align:left;background:linear-gradient(165deg,rgba(26,60,84,.5),rgba(7,21,33,.85));border:1px solid rgba(120,160,185,.25);transition:transform .35s,border-color .35s,box-shadow .35s,background .35s}
.rx2-step:hover{transform:translateX(4px)}
.rx2-step:focus-visible{outline:2px solid var(--c);outline-offset:3px}
.rx2-step[data-active=true]{border-color:var(--c);background:linear-gradient(165deg,color-mix(in srgb,var(--c) 18%,#0B1C2A),rgba(7,21,33,.9));box-shadow:0 16px 40px -16px var(--c)}
.rx2-prog{height:4px;border-radius:4px;background:rgba(255,255,255,.12);overflow:hidden}
.rx2-prog>i{display:block;height:100%;width:0;background:var(--c);border-radius:4px}
.rx2-prog>i.on{animation:rx2fill var(--t) linear forwards}
.rx2-prog>i.done{width:100%}
@keyframes rx2fill{to{width:100%}}
.rx2-detail{position:relative;overflow:hidden;background:linear-gradient(150deg,color-mix(in srgb,var(--c) 14%,#0B1C2A),rgba(5,14,23,.95) 65%);border:1px solid color-mix(in srgb,var(--c) 55%,transparent);box-shadow:0 30px 70px -34px var(--c)}
.rx2-swap{animation:rx2swap .6s cubic-bezier(.2,.8,.2,1) both}
@keyframes rx2swap{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.rx2-eqbox{display:inline-flex;flex-wrap:wrap;align-items:center;gap:8px 12px;padding:12px 18px;border-radius:16px;font-family:ui-monospace,Menlo,monospace;font-weight:800;background:rgba(3,10,17,.85);border:1px solid color-mix(in srgb,var(--c) 55%,transparent);box-shadow:inset 0 0 26px color-mix(in srgb,var(--c) 16%,transparent)}
@media (prefers-reduced-motion:reduce){.rx2 *{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}.rx2-rise{opacity:1;transform:none}}
`;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(m.matches);
    const h = (e) => setReduced(e.matches);
    m.addEventListener && m.addEventListener('change', h);
    return () => m.removeEventListener && m.removeEventListener('change', h);
  }, []);
  return reduced;
}

/* Chữ trong SVG luôn có viền tối để đọc rõ trên mọi nền */
const T = ({ children, ...p }) => (
  <text paintOrder="stroke" stroke="#050E17" strokeWidth="5" strokeLinejoin="round" {...p}>{children}</text>
);

function Particle({ path, color, dur = 3.2, begin = 0, r = 5 }) {
  const fade = { attributeName: 'opacity', values: '0;1;1;0', keyTimes: '0;0.12;0.88;1', dur: `${dur}s`, begin: `${begin}s`, repeatCount: 'indefinite' };
  const mo = { dur: `${dur}s`, begin: `${begin}s`, repeatCount: 'indefinite', path };
  return (
    <g>
      <circle r={r * 2.6} fill={color} fillOpacity="0.2"><animateMotion {...mo} /><animate {...fade} /></circle>
      <circle r={r} fill={color} stroke="#fff" strokeWidth="1.2"><animateMotion {...mo} /><animate {...fade} /></circle>
    </g>
  );
}

function Pill({ x, y, w, h = 40, size = 19, color, active, children }) {
  return (
    <g>
      <rect className="rx2-pill" x={x} y={y} width={w} height={h} rx={h / 2} fill="#07121C" fillOpacity="0.96" stroke={color} strokeWidth={active ? 2.5 : 1.2} />
      <text x={x + w / 2} y={y + h / 2 + size * 0.35} fill={active ? '#fff' : color} fontSize={size} fontWeight="800" textAnchor="middle">{children}</text>
    </g>
  );
}

function Pine({ x, y, s = 1, c = '#3C9A4B' }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x="-2.5" y="30" width="5" height="12" fill="#5D4037" />
      <polygon points="-16,34 0,6 16,34" fill={c} opacity="0.85" />
      <polygon points="-12,20 0,-8 12,20" fill={c} />
      <polygon points="-8,6 0,-20 8,6" fill="#6BC36F" />
    </g>
  );
}

const BUILDINGS = [{ x: 36, w: 40, h: 110 }, { x: 82, w: 54, h: 150 }, { x: 142, w: 44, h: 96 }, { x: 192, w: 50, h: 128 }];

function Panorama({ activeZone, reduced, pick }) {
  const P1 = 'M 220 178 C 280 124, 330 120, 378 142';
  const P2 = 'M 400 216 C 480 256, 580 206, 700 240';
  const P3 = 'M 700 170 C 780 182, 830 232, 880 282';
  const [bx, bx2] = BANDS[activeZone];
  const zp = (id) => ({
    className: 'rx2-zone', role: 'button', tabIndex: 0, 'aria-pressed': activeZone === id, 'aria-label': ZONES[id - 1].title,
    opacity: activeZone === id ? 1 : 0.62, onClick: () => pick(id),
    onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(id); } },
  });

  return (
    <svg viewBox="0 0 1100 400" className="w-full h-auto rounded-2xl select-none" role="group" aria-labelledby="rx2T rx2D">
      <title id="rx2T">Đường đi của chất gây lắng đọng axit từ nguồn thải đến hệ sinh thái</title>
      <desc id="rx2D">Khí thải NOx từ xe cộ và nhà máy bay lên khí quyển, được gió đưa đi xa và chuyển hóa trong mây thành HNO3, sau đó lắng đọng ướt và khô xuống hồ, rừng và công trình đá.</desc>
      <defs>
        <linearGradient id="rxSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#020712" /><stop offset=".55" stopColor="#0A2236" /><stop offset="1" stopColor="#1D4A66" /></linearGradient>
        <linearGradient id="rxLake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#45C2E3" /><stop offset="1" stopColor="#0A2F43" /></linearGradient>
        <linearGradient id="rxBld" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2B536B" /><stop offset="1" stopColor="#102433" /></linearGradient>
        <linearGradient id="rxCloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3F7C9C" /><stop offset="1" stopColor="#1B455C" /></linearGradient>
        <linearGradient id="rxStone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#E9E4D6" /><stop offset="1" stopColor="#9E9886" /></linearGradient>
        <linearGradient id="rxBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".18" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <radialGradient id="rxCity" cx=".5" cy="1" r=".8"><stop offset="0" stopColor="#FF875F" stopOpacity=".5" /><stop offset="1" stopColor="#FF875F" stopOpacity="0" /></radialGradient>
        <radialGradient id="rxGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#54D7E8" stopOpacity=".45" /><stop offset="1" stopColor="#54D7E8" stopOpacity="0" /></radialGradient>
        <radialGradient id="rxMoon" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset=".4" stopColor="#BFEFF6" stopOpacity=".25" /><stop offset="1" stopColor="#BFEFF6" stopOpacity="0" /></radialGradient>
        <filter id="rxBlur"><feGaussianBlur stdDeviation="14" /></filter>
        {[['Lime', '#D8F36A'], ['Cyan', '#54D7E8'], ['Orange', '#FF875F']].map(([n, c]) => (
          <marker key={n} id={`rxA${n}`} markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto"><path d="M0,0 L0,7 L9,3.5 z" fill={c} /></marker>
        ))}
      </defs>

      <rect width="1100" height="400" rx="20" fill="url(#rxSky)" />
      <g filter="url(#rxBlur)" opacity=".5">
        <ellipse className="rx2-aur" cx="520" cy="80" rx="260" ry="26" fill="#54D7E8" opacity=".35" />
        <ellipse className="rx2-aur" cx="820" cy="60" rx="200" ry="20" fill="#D8F36A" opacity=".22" style={{ animationDelay: '-5s' }} />
      </g>
      <circle cx="1035" cy="110" r="64" fill="url(#rxMoon)" />
      <circle cx="1035" cy="110" r="14" fill="#EAF7FB" />
      {[[80, 100, 0], [340, 80, 0.8], [620, 76, 1.6], [730, 40, 0.4], [890, 70, 2.1], [960, 150, 1.2], [460, 40, 2.6], [250, 70, 1.9], [150, 110, 1.1], [1060, 40, 0.6]].map(([x, y, d], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="#fff" className="rx2-tw" style={{ '--sd': `${d}s` }} />
      ))}
      <ellipse cx="150" cy="340" rx="230" ry="150" fill="url(#rxCity)" />

      <path d="M0 280 L110 232 L210 268 L340 215 L480 275 L620 230 L760 280 L900 225 L1100 268 V400 H0 Z" fill="#0A1E31" />
      <path d="M0 305 L140 266 L290 298 L450 258 L620 300 L800 262 L960 296 L1100 272 V400 H0 Z" fill="#0E2A3D" />

      <rect className="rx2-beam" x="0" y="8" width={bx2 - bx} height="384" rx="18" fill="url(#rxBeam)" style={{ transform: `translateX(${bx}px)` }} />
      {ZONES.map((z) => (
        <rect key={z.id} className="rx2-band" x={BANDS[z.id][0]} y="8" width={BANDS[z.id][1] - BANDS[z.id][0]} height="384" rx="18"
          fill={z.color} fillOpacity="0.07" stroke={z.color} strokeOpacity="0.7" strokeWidth="1.5" strokeDasharray="7 7" opacity={activeZone === z.id ? 1 : 0} />
      ))}

      <path d="M0 322 Q180 292 340 320 T700 304 T1100 294 V400 H0 Z" fill="#102B2A" />
      <path d="M0 345 Q240 320 520 340 T1100 330 V400 H0 Z" fill="#183A33" />
      <path d="M700 330 Q820 310 950 330 T1090 326 V400 H700 Z" fill="url(#rxLake)" stroke="#54D7E8" strokeWidth="1.5" />
      {[[770, 346, 0], [1060, 350, 1.4]].map(([x, y, d], i) => (
        <ellipse key={i} cx={x} cy={y} rx="30" ry="6" fill="none" stroke="#9BEAF5" strokeWidth="1.6" className="rx2-rip" style={{ '--sd': `${d}s` }} />
      ))}

      {/* TRẠM 1 */}
      <g {...zp(1)}>
        <Pill x={30} y={16} w={230} color="#FF875F" active={activeZone === 1}>1. Nguồn phát thải</Pill>
        {BUILDINGS.map((b, i) => {
          const y = 322 - b.h;
          return (
            <g key={i}>
              <rect x={b.x} y={y} width={b.w} height={b.h} rx="3" fill="url(#rxBld)" stroke="#4A7A95" strokeOpacity=".7" />
              {Array.from({ length: Math.floor((b.h - 6) / 24) }).map((_, r) =>
                Array.from({ length: Math.floor((b.w - 8) / 14) }).map((__, c) => (
                  <rect key={`${r}${c}`} x={b.x + 7 + c * 14} y={y + 9 + r * 24} width="8" height="12" rx="1.5" fill="#FFD27A"
                    fillOpacity={(r * 3 + c + i) % 4 === 0 ? 0.25 : 0.95} className="rx2-tw" style={{ '--sd': `${((r + c + i) % 6) * 0.6}s` }} />
                ))
              )}
            </g>
          );
        })}
        {[[262, 190], [96, 150]].map(([cx, top], k) => (
          <g key={k}>
            <polygon points={`${cx - 7},322 ${cx - 5},${top} ${cx + 5},${top} ${cx + 7},322`} fill="#314E61" stroke="#FF875F" strokeWidth="1.2" />
            <rect x={cx - 6} y={top} width="12" height="6" fill="#FF875F" />
            <circle cx={cx} cy={top - 4} r="9" fill="#FF875F" opacity=".45" className="rx2-pulse" style={{ '--sd': `${k * 0.8}s` }} />
            {[0, 1.5, 3].map((d, i) => <circle key={i} cx={cx} cy={top - 8} r="7" fill="#C7D3DC" className="rx2-smoke" style={{ '--sd': `${d + k * 0.7}s` }} />)}
          </g>
        ))}
        <rect x="26" y="322" width="248" height="16" rx="5" fill="#0A1620" stroke="#29485A" />
        <line x1="36" y1="330" x2="264" y2="330" stroke="#FFD27A" strokeOpacity=".55" strokeDasharray="10 8" />
        <g>
          <path d="M214 316 l6 -13 h20 l8 13 Z" fill="#FF875F" />
          <rect x="222" y="306" width="9" height="6" rx="1" fill="#FFE3D6" />
          <circle cx="222" cy="319" r="4" fill="#fff" /><circle cx="240" cy="319" r="4" fill="#fff" />
          {!reduced && <animateTransform attributeName="transform" type="translate" values="0 0; -150 0; 0 0" dur="9s" repeatCount="indefinite" />}
        </g>
        <Pill x={26} y={352} w={248} h={36} size={16.5} color="#FF875F" active={activeZone === 1}>Xe cộ &amp; nhà máy thải NO</Pill>
      </g>

      {/* TRẠM 2 */}
      <g {...zp(2)}>
        <Pill x={330} y={16} w={400} color="#54D7E8" active={activeZone === 2}>2. Vận chuyển &amp; phản ứng khí quyển</Pill>
        <ellipse cx="540" cy="146" rx="200" ry="90" fill="url(#rxGlow)" />
        {['M 330 288 C 420 266, 470 304, 560 284 S 690 270, 745 288', 'M 340 306 C 430 290, 500 320, 590 304 S 700 292, 745 306'].map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#54D7E8" strokeOpacity={0.6 - i * 0.15} strokeWidth="2.2" strokeDasharray="5 7" strokeLinecap="round" className="rx2-flow" style={{ animationDelay: `${-i * 0.4}s` }} />
        ))}
        <g className="rx2-cloud">
          <g fill="url(#rxCloud)" stroke="#54D7E8" strokeWidth="1.8">
            <ellipse cx="450" cy="152" rx="80" ry="33" />
            <ellipse cx="632" cy="154" rx="78" ry="32" stroke="#D8F36A" />
            <ellipse cx="541" cy="126" rx="98" ry="52" />
          </g>
          <path d="M480 90 Q540 72 600 90" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="2.5" strokeLinecap="round" />
          <T x="541" y="134" fill="#fff" fontSize="25" fontWeight="900" textAnchor="middle">NO → NO₂ → HNO₃</T>
          <T x="541" y="164" fill="#D8F36A" fontSize="16" fontWeight="800" textAnchor="middle">+ O₂ và H₂O trong giọt mây</T>
        </g>
        <path d={P1} fill="none" stroke="#FF875F" strokeWidth="4" strokeDasharray="8 6" strokeLinecap="round" markerEnd="url(#rxAOrange)" className="rx2-flow" />
        <rect x="236" y="84" width="170" height="36" rx="18" fill="#07121C" stroke="#FF875F" strokeWidth="1.5" />
        <text x="321" y="108" fill="#FFB596" fontSize="18" fontWeight="800" textAnchor="middle">NO + O₂ → NO₂</text>
        <path d={P2} fill="none" stroke="#54D7E8" strokeWidth="3.5" strokeDasharray="6 6" strokeLinecap="round" markerEnd="url(#rxACyan)" className="rx2-flow" />
        <Pill x={330} y={352} w={400} h={36} size={16.5} color="#54D7E8" active={activeZone === 2}>Gió đưa đi xa hàng chục – hàng trăm km</Pill>
      </g>

      {/* TRẠM 3 */}
      <g {...zp(3)}>
        <Pill x={800} y={16} w={270} color="#D8F36A" active={activeZone === 3}>3. Lắng đọng ướt &amp; khô</Pill>
        <path d={P3} fill="none" stroke="#D8F36A" strokeWidth="4" strokeDasharray="8 6" strokeLinecap="round" markerEnd="url(#rxALime)" className="rx2-flow" />
        <g stroke="#D8F36A" strokeWidth="2.2" strokeDasharray="4 6" strokeLinecap="round" opacity=".9">
          {[[800, 170], [850, 166], [910, 176], [970, 170], [1020, 178]].map(([x, y], i) => (
            <line key={i} x1={x} y1={y} x2={x - 18} y2={y + 112} className="rx2-rain" style={{ '--sd': `${-i * 0.2}s` }} />
          ))}
        </g>
        {[[742, 270, 1], [776, 278, 0.8], [806, 272, 0.9]].map(([x, y, s], i) => <Pine key={i} x={x} y={y} s={s} c={i === 1 ? '#8EA82A' : '#3C9A4B'} />)}
        <g transform="translate(1006,262)">
          <polygon points="-4,16 28,-2 60,16" fill="url(#rxStone)" />
          <rect x="-2" y="16" width="60" height="6" fill="url(#rxStone)" />
          {[6, 20, 34, 48].map((x) => <rect key={x} x={x - 3} y="22" width="6" height="34" fill="url(#rxStone)" />)}
          <path d="M20 26 l3 6 -3 6 3 6" fill="none" stroke="#050E17" strokeOpacity=".5" strokeWidth="1.4" />
          <rect x="-6" y="56" width="68" height="7" rx="2" fill="url(#rxStone)" />
        </g>
        <rect x="784" y="68" width="296" height="78" rx="16" fill="#07121C" fillOpacity=".96" stroke="#D8F36A" strokeWidth="1.5" />
        <text x="802" y="98" fill="#D8F36A" fontSize="17" fontWeight="800">Ướt: mưa, sương mù, tuyết axit</text>
        <text x="802" y="128" fill="#fff" fontSize="17" fontWeight="700">Khô: khí &amp; hạt bụi mịn nitrate</text>
        <Pill x={790} y={352} w={290} h={36} size={16.5} color="#D8F36A" active={activeZone === 3}>Hồ nước · Đất rừng · Di tích đá</Pill>
      </g>

      {!reduced && (
        <g pointerEvents="none">
          <Particle path={P1} color="#FF875F" dur={3.2} begin={0} />
          <Particle path={P1} color="#FF875F" dur={3.2} begin={1.6} r={4} />
          <Particle path={P2} color="#54D7E8" dur={4} begin={0.4} />
          <Particle path={P2} color="#54D7E8" dur={4} begin={2.4} r={4} />
          <Particle path={P3} color="#D8F36A" dur={3} begin={0.8} />
          <Particle path={P3} color="#D8F36A" dur={3} begin={2.3} r={4} />
        </g>
      )}
    </svg>
  );
}

function Slide02Inner() {
  const [activeZone, setActiveZone] = useState(1);
  const [playing, setPlaying] = useState(true);
  const reduced = useReducedMotion();
  const active = useSlideActive(); // false khi đang được dựng sẵn ở nền

  useEffect(() => {
    if (!playing || reduced || !active) return undefined;
    const t = setTimeout(() => setActiveZone((z) => (z % 3) + 1), TOUR_MS);
    return () => clearTimeout(t);
  }, [playing, activeZone, reduced, active]);

  const pick = (id) => { setPlaying(false); setActiveZone(id); };
  const z = ZONES[activeZone - 1];
  const ZIcon = z.icon;

  return (
    <div className="rx2 w-full min-h-full flex flex-col justify-between py-1 gap-3 relative">
      <style>{CSS}</style>

      <header className="rx2-rise" style={{ '--d': '0ms' }}>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="px-3.5 py-1.5 rounded-full bg-[#FF875F]/15 border border-[#FF875F]/50 text-[#FFB596] text-sm font-bold flex items-center gap-2">
            <Wind size={15} /> Mở đầu vấn đề · Ô nhiễm xuyên biên giới
          </span>
          <span className="text-sm text-[#C9D8E3] hidden sm:inline">Khói trên cao, tác động ở rất xa</span>
        </div>
        <h2 className="rx2-title text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] [text-wrap:balance]">Ô nhiễm không dừng ở nơi phát thải</h2>
        <div className="mt-3 h-[4px] w-48 rounded-full" style={{ background: 'linear-gradient(90deg,#FF875F,#54D7E8,#D8F36A)' }} />
      </header>

      <div className="rx2-panel rx2-rise rounded-3xl p-2.5 sm:p-3.5 overflow-hidden" style={{ '--d': '140ms' }}>
        <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Tạm dừng hành trình' : 'Phát hành trình'}
          className="absolute z-10 top-5 right-5 sm:top-6 sm:right-6 w-10 h-10 rounded-full flex items-center justify-center bg-[#071521]/90 border border-white/30 text-white hover:bg-white/10 transition-colors">
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <Panorama activeZone={activeZone} reduced={reduced} pick={pick} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 rx2-rise" style={{ '--d': '300ms' }}>
        {/* Danh sách trạm */}
        <div className="flex lg:flex-col gap-3">
          {ZONES.map((s) => {
            const Icon = s.icon;
            const isSel = activeZone === s.id;
            const done = activeZone > s.id;
            return (
              <button key={s.id} type="button" onClick={() => pick(s.id)} aria-pressed={isSel} data-active={isSel}
                style={{ '--c': s.color, '--t': `${TOUR_MS}ms` }}
                className="rx2-step flex-1 rounded-2xl p-3 sm:p-3.5 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{ background: isSel ? s.color : `${s.color}1f`, borderColor: `${s.color}88`, color: isSel ? '#050E17' : s.color }}>
                    <Icon size={22} />
                  </span>
                  <div className="min-w-0">
                    <span className="block text-sm font-bold" style={{ color: s.color }}>Trạm {s.num} · {s.tag}</span>
                    <span className="block text-base sm:text-lg font-extrabold text-white leading-snug">{s.title}</span>
                  </div>
                </div>
                <div className="rx2-prog" aria-hidden="true">
                  <i key={`${activeZone}-${playing}`} className={isSel && playing && !reduced ? 'on' : isSel || done ? 'done' : ''} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Chi tiết trạm đang chọn */}
        <section className="rx2-detail rounded-3xl p-5 sm:p-6 flex flex-col justify-center" style={{ '--c': z.color }} aria-live="polite">
          <div aria-hidden="true" className="absolute -right-4 -bottom-12 font-black leading-none pointer-events-none"
            style={{ fontSize: 170, color: 'transparent', WebkitTextStroke: `2px ${z.color}`, opacity: 0.14 }}>{z.num}</div>
          <div key={z.id} className="rx2-swap relative">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: z.color, color: '#050E17', boxShadow: `0 10px 26px ${z.color}66` }}>
                <ZIcon size={24} />
              </span>
              <span className="text-base sm:text-lg font-bold" style={{ color: z.color }}>Trạm {z.num} · {z.tag}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight [text-wrap:balance]">{z.title}</h3>
            <p className="mt-2.5 text-base sm:text-lg text-[#E8F0F7] leading-relaxed max-w-3xl [text-wrap:pretty]">{z.desc}</p>
            <div className="mt-4">
              <span className="block text-sm text-[#C9D8E3] mb-1.5">Phương trình hóa học chính</span>
              <div className="rx2-eqbox text-lg sm:text-xl" style={{ '--c': z.color, color: z.color }}>
                {z.eq.split(' → ').map((part, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-white">→</span>}
                    <span style={{ color: i === 0 ? '#fff' : z.color }}>{part}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function Slide02Problem() {
  return (
    <div className="w-full min-h-full">
      <Slide02Inner />
    </div>
  );
}