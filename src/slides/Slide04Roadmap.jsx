import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, ChevronLeft, Eye, FlaskConical, Scale, Lightbulb, ListFilter, Layers } from 'lucide-react';
import { sfx } from '../audio/sfx';

/* ───────────────────────── DỮ LIỆU ───────────────────────── */
const CARDS = [
  {
    step: '01',
    title: 'Hình thành',
    subtitle: 'Cơ chế hóa học NOₓ',
    color: '#54D7E8',
    question: 'NO → NO₂ → HNO₃ diễn ra thế nào?',
    eq: { left: '4NO₂ + O₂ + 2H₂O', right: '4HNO₃' },
    details: [
      'Nhiệt độ cao (>1200°C) bẻ gãy liên kết N≡N tạo khí NO',
      'Oxygen không khí oxi hóa tiếp 2NO + O₂ → 2NO₂',
      'NO₂ phản ứng với H₂O và O₂ trong mây tạo HNO₃',
      'Chứng minh và cân bằng nguyên tử mọi phương trình',
    ],
  },
  {
    step: '02',
    title: 'Tác động',
    subtitle: 'Hệ sinh thái & Vật liệu',
    color: '#D8F36A',
    question: 'Mưa axit ảnh hưởng đến nước, đất, đá và kim loại ra sao?',
    eq: { left: 'CaCO₃ + 2HNO₃', right: 'Ca(NO₃)₂ + CO₂↑ + H₂O' },
    details: [
      'Axit hóa ao hồ, hòa tan ion Al³⁺ gây độc mang cá',
      'Rửa trôi khoáng Ca²⁺, Mg²⁺ làm suy kiệt rễ cây rừng',
      'Hòa tan đá carbonate (CaCO₃) làm mòn di tích lịch sử',
      'Thúc đẩy ăn mòn điện hóa kim loại & tạo bụi mịn PM2.5',
    ],
  },
  {
    step: '03',
    title: 'Hành động',
    subtitle: 'Giải pháp từ gốc rễ',
    color: '#FF875F',
    question: 'Có thể giảm khí thải và hạn chế tác động bằng cách nào?',
    eq: { left: '4NO + 4NH₃ + O₂', right: '4N₂ + 6H₂O' },
    details: [
      'Cắt giảm từ nguồn: giao thông xanh, tiết kiệm điện',
      'Công nghệ xúc tác chọn lọc SCR khử NOₓ thành N₂',
      'Quan trắc tự động mưa axit và kiểm định khí thải',
      'Phân biệt giải pháp gốc (giảm thải) vs tạm thời (bón vôi)',
    ],
  },
];

const METHOD = [
  { label: 'Quan sát hiện tượng', icon: Eye },
  { label: 'Giải thích bằng phương trình', icon: FlaskConical },
  { label: 'Đánh giá tác động', icon: Scale },
  { label: 'Đề xuất giải pháp', icon: Lightbulb },
];

/* ───────────────────────── CSS TỰ CHỨA ───────────────────────── */
const CSS = `
.rm4 { --ink:#050E17; --mute:#A8BBC8; }
@keyframes rm4-rise { from{opacity:0;transform:translateY(22px) scale(.98)} to{opacity:1;transform:none} }
@keyframes rm4-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
@keyframes rm4-spin { to{transform:rotate(360deg)} }
@keyframes rm4-flow { to{stroke-dashoffset:-24} }
@keyframes rm4-fall { 0%{transform:translateY(-6px);opacity:0} 20%{opacity:1} 80%{opacity:1} 100%{transform:translateY(34px);opacity:0} }
@keyframes rm4-ripple { 0%{transform:scale(.3);opacity:.9} 100%{transform:scale(1.4);opacity:0} }
@keyframes rm4-smoke { 0%{transform:translate(0,0) scale(.6);opacity:.8} 100%{transform:translate(14px,-26px) scale(1.5);opacity:0} }
@keyframes rm4-bubble { 0%{transform:translateY(6px);opacity:0} 30%{opacity:1} 100%{transform:translateY(-16px);opacity:0} }
@keyframes rm4-blob { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,24px) scale(1.12)} }
@keyframes rm4-sheen { 0%{transform:translateX(-120%)} 60%,100%{transform:translateX(220%)} }
@keyframes rm4-dot { 0%{left:0;opacity:0} 15%{opacity:1} 85%{opacity:1} 100%{left:100%;opacity:0} }

.rm4-rise { animation: rm4-rise .8s cubic-bezier(.2,.7,.2,1) both; animation-delay: var(--d,0ms); }
.rm4-blob { animation: rm4-blob 16s ease-in-out infinite; }
.rm4-float { animation: rm4-float 3.6s ease-in-out infinite; }
.rm4-spin { animation: rm4-spin 18s linear infinite; transform-box: fill-box; transform-origin: center; }
.rm4-spin-rev { animation: rm4-spin 26s linear infinite reverse; transform-box: fill-box; transform-origin: center; }
.rm4-flow { stroke-dasharray: 6 6; animation: rm4-flow 1.1s linear infinite; }
.rm4-fall { animation: rm4-fall 2.4s ease-in infinite; animation-delay: var(--k,0s); }
.rm4-ripple { animation: rm4-ripple 2.4s ease-out infinite; animation-delay: var(--k,0s); transform-box: fill-box; transform-origin: center; }
.rm4-smoke { animation: rm4-smoke 3s ease-out infinite; animation-delay: var(--k,0s); transform-box: fill-box; transform-origin: center; }
.rm4-bubble { animation: rm4-bubble 2.2s ease-in-out infinite; animation-delay: var(--k,0s); }

.rm4-card {
  position: relative; overflow: hidden;
  background: linear-gradient(165deg, rgba(255,255,255,.075), rgba(255,255,255,.018) 55%);
  border: 1px solid rgba(255,255,255,.09);
  backdrop-filter: blur(10px);
  transition: transform .45s cubic-bezier(.2,.7,.2,1), border-color .45s, box-shadow .45s;
}
.rm4-card:hover { transform: translateY(-6px); border-color: var(--c); box-shadow: 0 28px 60px -28px var(--c), inset 0 0 0 1px rgba(255,255,255,.04); }
.rm4-sheen { position:absolute; inset:0; pointer-events:none; overflow:hidden; border-radius:inherit; }
.rm4-sheen::after { content:''; position:absolute; top:0; bottom:0; width:40%; left:0;
  background: linear-gradient(100deg, transparent, rgba(255,255,255,.07), transparent);
  transform: translateX(-120%); }
.rm4-card:hover .rm4-sheen::after { animation: rm4-sheen 1.1s ease; }
.rm4-linkdot { position:absolute; top:50%; width:7px; height:7px; margin-top:-3.5px; border-radius:9999px;
  background: var(--c); box-shadow: 0 0 10px var(--c); animation: rm4-dot 2.4s ease-in-out infinite; animation-delay: var(--d,0s); }

@media (prefers-reduced-motion: reduce) {
  .rm4 *, .rm4 *::before, .rm4 *::after { animation: none !important; transition: none !important; }
}
`;

/* ───────────────────────── SVG MINH HỌA ───────────────────────── */
function Atom({ x, y, r = 11, kind, label }) {
  const isN = kind === 'N';
  return (
    <g>
      <circle cx={x} cy={y} r={r + 5} fill={isN ? '#54D7E8' : '#FF875F'} opacity="0.14" />
      <circle cx={x} cy={y} r={r} fill={`url(#${isN ? 'gN' : 'gO'})`} />
      <circle cx={x} cy={y} r={r} fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="0.8" />
      <ellipse cx={x - r * 0.35} cy={y - r * 0.4} rx={r * 0.32} ry={r * 0.2} fill="#fff" opacity="0.5" />
      <text x={x} y={y + 3.6} textAnchor="middle" fontSize="10" fontWeight="900" fill="#050E17">{label ?? kind}</text>
    </g>
  );
}

function Defs({ id, color }) {
  return (
    <defs>
      <radialGradient id="gN" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#B9F4FB" /><stop offset="1" stopColor="#2AA9C0" />
      </radialGradient>
      <radialGradient id="gO" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#FFC9B3" /><stop offset="1" stopColor="#E8582B" />
      </radialGradient>
      <linearGradient id={`bg${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={color} stopOpacity="0.22" />
        <stop offset="1" stopColor="#050E17" stopOpacity="0.2" />
      </linearGradient>
      <pattern id={`dots${id}`} width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.8" fill="#fff" opacity="0.18" />
      </pattern>
    </defs>
  );
}

function Illustration({ step, color }) {
  const frame = (
    <>
      <Defs id={step} color={color} />
      <rect width="240" height="132" rx="18" fill={`url(#bg${step})`} />
      <rect width="240" height="132" rx="18" fill={`url(#dots${step})`} />
      <rect x="0.5" y="0.5" width="239" height="131" rx="17.5" fill="none" stroke={color} strokeOpacity="0.35" />
    </>
  );

  if (step === '01') {
    return (
      <svg viewBox="0 0 240 132" className="w-full h-auto block" aria-hidden="true">
        {frame}
        {/* N2 */}
        <g className="rm4-float">
          <path d="M42 46 H66 M42 50 H66 M42 54 H66" stroke="#54D7E8" strokeWidth="2" strokeLinecap="round" />
          <Atom x={34} y={50} kind="N" />
          <Atom x={74} y={50} kind="N" />
        </g>
        {/* O2 */}
        <g className="rm4-float" style={{ animationDelay: '-1.6s' }}>
          <path d="M42 94 H66 M42 99 H66" stroke="#FF875F" strokeWidth="2" strokeLinecap="round" />
          <Atom x={34} y={97} kind="O" />
          <Atom x={74} y={97} kind="O" />
        </g>
        <text x="54" y="76" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" opacity="0.7">+</text>

        {/* Nhiệt */}
        <circle cx="120" cy="66" r="24" fill="none" stroke="#FF875F" strokeOpacity="0.35" strokeDasharray="2 5" className="rm4-spin" />
        <path d="M120 44 C112 56 108 62 108 70 A12 12 0 0 0 132 70 C132 62 128 56 120 44 Z" fill="#FF875F" fillOpacity="0.9" />
        <path d="M120 58 C116 64 114 68 114 72 A6 6 0 0 0 126 72 C126 68 124 64 120 58 Z" fill="#FFD9A0" />
        <path d="M96 66 H100 M140 66 H146" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" className="rm4-flow" />
        <text x="120" y="108" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#FF875F">&gt;1200°C</text>

        {/* 2 NO */}
        <g className="rm4-float" style={{ animationDelay: '-0.8s' }}>
          <path d="M184 50 H198" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
          <Atom x={176} y={50} kind="N" r={10} />
          <Atom x={206} y={50} kind="O" r={10} />
          <path d="M184 97 H198" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
          <Atom x={176} y={97} kind="N" r={10} />
          <Atom x={206} y={97} kind="O" r={10} />
        </g>
        <text x="191" y="76" textAnchor="middle" fontSize="11" fontWeight="900" fill="#54D7E8">2NO</text>
      </svg>
    );
  }

  if (step === '02') {
    return (
      <svg viewBox="0 0 240 132" className="w-full h-auto block" aria-hidden="true">
        {frame}
        <defs>
          <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#54D7E8" stopOpacity="0.55" /><stop offset="1" stopColor="#1B6F86" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="stone" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#E9E4D6" /><stop offset="1" stopColor="#A8A290" />
          </linearGradient>
        </defs>
        {/* Mây */}
        <g className="rm4-float">
          <path d="M44 40 A14 14 0 0 1 58 26 A18 18 0 0 1 92 24 A15 15 0 0 1 112 40 Z" fill="#2B4A5E" stroke="#D8F36A" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M60 33 A8 8 0 0 1 72 31" fill="none" stroke="#fff" strokeOpacity="0.35" strokeLinecap="round" />
        </g>
        {/* Giọt axit */}
        {[0, 1, 2].map((i) => (
          <g key={i} className="rm4-fall" style={{ '--k': `${i * 0.8}s` }}>
            <path d={`M${58 + i * 20} 48 q-5 8 -5 11 a5 5 0 0 0 10 0 q0 -3 -5 -11 Z`} fill="#D8F36A" />
            <text x={58 + i * 20} y="62" textAnchor="middle" fontSize="4.6" fontWeight="900" fill="#050E17">H⁺</text>
          </g>
        ))}
        {/* Cột đá bị ăn mòn */}
        <g>
          <rect x="164" y="30" width="44" height="7" rx="2" fill="url(#stone)" />
          <path d="M170 37 H202 V86 H170 Z" fill="url(#stone)" />
          <path d="M170 52 l5 3 -3 5 5 3 -4 6 4 4" fill="none" stroke="#050E17" strokeOpacity="0.45" strokeWidth="1.4" />
          <path d="M202 44 l-5 3 3 5 -4 4 3 5" fill="none" stroke="#050E17" strokeOpacity="0.35" strokeWidth="1.4" />
          <circle cx="186" cy="70" r="3" fill="#050E17" opacity="0.3" />
          <rect x="164" y="86" width="44" height="7" rx="2" fill="url(#stone)" />
          <text x="186" y="25" textAnchor="middle" fontSize="8" fontWeight="800" fill="#D8F36A">CaCO₃</text>
        </g>
        {/* Hồ */}
        <path d="M0 96 Q30 90 60 96 T120 96 T180 96 T240 96 V132 H0 Z" fill="url(#lake)" />
        <path d="M0 96 Q30 90 60 96 T120 96 T180 96 T240 96" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.5" />
        {[0, 1].map((i) => (
          <ellipse key={i} cx={78} cy="98" rx="20" ry="4" fill="none" stroke="#D8F36A" strokeWidth="1.4" className="rm4-ripple" style={{ '--k': `${i * 1.2}s` }} />
        ))}
        {/* Cá */}
        <g className="rm4-float" style={{ animationDelay: '-1s' }}>
          <path d="M104 114 q10 -9 22 0 q-12 9 -22 0 Z M126 114 l8 -6 v12 Z" fill="#fff" fillOpacity="0.8" />
          <circle cx="111" cy="112.5" r="1.4" fill="#050E17" />
        </g>
        <text x="30" y="118" fontSize="8.5" fontWeight="800" fill="#fff" opacity="0.85">pH ↓</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 240 132" className="w-full h-auto block" aria-hidden="true">
      {frame}
      <defs>
        <linearGradient id="reactor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF875F" stopOpacity="0.55" /><stop offset="1" stopColor="#FF875F" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {/* Ống khói + khói NOx */}
      <rect x="22" y="62" width="22" height="52" rx="3" fill="#2B4A5E" stroke="#fff" strokeOpacity="0.35" />
      <rect x="22" y="62" width="22" height="7" fill="#FF875F" opacity="0.8" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={33 + i * 2} cy="56" r="5" fill="#8C6A5C" className="rm4-smoke" style={{ '--k': `${i * 1}s` }} />
      ))}
      <text x="33" y="38" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#FF875F">NOₓ</text>

      {/* Dòng khí vào */}
      <path d="M48 88 H78" stroke="#FF875F" strokeWidth="2.5" strokeLinecap="round" className="rm4-flow" />
      <path d="M72 82 l8 6 -8 6" fill="none" stroke="#FF875F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Lò phản ứng SCR */}
      <rect x="84" y="46" width="76" height="76" rx="14" fill="url(#reactor)" stroke="#FF875F" strokeWidth="2" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <path
            key={`${r}${c}`}
            d={`M${99 + c * 20 + (r % 2) * 10} ${60 + r * 17} l6 -3.5 6 3.5 v7 l-6 3.5 -6 -3.5 Z`}
            fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.2"
          />
        ))
      )}
      <rect x="96" y="30" width="52" height="16" rx="8" fill="#050E17" stroke="#FF875F" strokeWidth="1.4" />
      <text x="122" y="41.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff">SCR + NH₃</text>

      {/* Dòng khí ra */}
      <path d="M164 88 H194" stroke="#54D7E8" strokeWidth="2.5" strokeLinecap="round" className="rm4-flow" />
      <path d="M188 82 l8 6 -8 6" fill="none" stroke="#54D7E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={206 + (i % 2) * 8} cy={100 - i * 6} r="3.2" fill="#54D7E8" className="rm4-bubble" style={{ '--k': `${i * 0.7}s` }} />
      ))}
      <text x="214" y="70" textAnchor="middle" fontSize="11" fontWeight="900" fill="#54D7E8">N₂</text>
      <text x="214" y="82" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff" opacity="0.75">sạch</text>
    </svg>
  );
}

/* ───────────────────────── THÀNH PHẦN PHỤ ───────────────────────── */
function Connector({ from, to, delay }) {
  return (
    <div className="hidden lg:flex items-center justify-center w-14 shrink-0 rm4-rise" style={{ '--d': `${delay}ms` }} aria-hidden="true">
      <div className="relative w-full h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, ${from}, ${to})` }}>
        <span className="rm4-linkdot" style={{ '--c': to, '--d': `${delay / 1000}s` }} />
        <span
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center bg-[#050E17] border"
          style={{ borderColor: `${to}88`, color: to }}
        >
          <ChevronRight size={16} />
        </span>
      </div>
    </div>
  );
}

function trackMouse(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}

function SinglePillarCard({ card, onPrev, onNext, isFirst, isLast, stepIndex, totalSteps, onSelectStep }) {
  return (
    <article
      style={{ '--c': card.color }}
      className="rm4-card rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 flex flex-col justify-between border shadow-2xl bg-[#071624]/90 backdrop-blur-md w-full max-w-[1240px] mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 md:gap-6 items-center">
        {/* CỘT TRÁI (md:col-span-5): Tiêu đề + Hình minh họa + Phương trình */}
        <div className="md:col-span-5 flex flex-col gap-2.5 sm:gap-3">
          {/* Header của trụ cột */}
          <div className="flex items-center gap-2.5">
            <span
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm shrink-0"
              style={{ background: card.color, color: '#050E17', boxShadow: `0 4px 16px ${card.color}66` }}
            >
              {card.step}
            </span>
            <div>
              <span className="block text-[11px] sm:text-xs font-bold tracking-wide" style={{ color: card.color }}>
                Trụ cột {card.step} · {card.subtitle}
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">{card.title}</h3>
            </div>
          </div>

          {/* Khung minh họa SVG - khống chế kích thước chuẩn, không bao giờ bị phóng to hay tràn */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#050E17]/80 w-full max-w-[340px] mx-auto p-1 shadow-inner">
            <div className="w-full aspect-[240/132] max-h-[160px] flex items-center justify-center">
              <Illustration step={card.step} color={card.color} />
            </div>
          </div>

          {/* Phương trình hóa học tiêu biểu */}
          <div
            className="rounded-xl px-3 py-2 bg-[#050E17]/95 border font-mono font-bold text-[11px] sm:text-xs leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-1 shadow-sm"
            style={{ borderColor: `${card.color}45`, boxShadow: `inset 0 0 16px ${card.color}10` }}
          >
            <span className="text-white">{card.eq.left}</span>
            <span
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full inline-flex items-center justify-center text-[10px] sm:text-xs shrink-0"
              style={{ background: `${card.color}26`, color: card.color }}
            >
              →
            </span>
            <span style={{ color: card.color }}>{card.eq.right}</span>
          </div>
        </div>

        {/* CỘT PHẢI (md:col-span-7): Câu hỏi trọng tâm + Checklist 4 ý + Stepper điều hướng */}
        <div className="md:col-span-7 flex flex-col justify-between gap-3 h-full">
          {/* Câu hỏi trọng tâm */}
          <div
            className="pl-3.5 pr-3 py-2 border-l-[3.5px] rounded-r-xl"
            style={{ borderColor: card.color, background: `linear-gradient(90deg, ${card.color}18, transparent)` }}
          >
            <span className="block text-[10.5px] uppercase tracking-wider font-extrabold text-[#A8BBC8] mb-0.5">
              Câu hỏi trọng tâm
            </span>
            <p className="text-sm sm:text-base font-bold text-white leading-snug">
              {card.question}
            </p>
          </div>

          {/* 4 Ý chính */}
          <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13px] text-[#DCE6F0]">
            {card.details.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 leading-snug">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: card.color }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Stepper điều hướng giữa 3 trụ cột */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-1">
            <button
              type="button"
              onClick={onPrev}
              disabled={isFirst}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-25 disabled:cursor-not-allowed text-white hover:bg-white/10 active:scale-95"
            >
              <ChevronLeft size={16} />
              <span>Trụ trước</span>
            </button>

            {/* Indicator Dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectStep(i)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: stepIndex === i ? '24px' : '8px',
                    height: '8px',
                    backgroundColor: stepIndex === i ? card.color : 'rgba(255,255,255,0.25)',
                    boxShadow: stepIndex === i ? `0 0 10px ${card.color}88` : 'none',
                  }}
                  aria-label={`Đi tới Trụ cột ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={onNext}
              disabled={isLast}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-25 disabled:cursor-not-allowed text-white hover:bg-white/10 active:scale-95"
            >
              <span>Trụ tiếp theo</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ───────────────────────── SLIDE ───────────────────────── */
export default function Slide04Roadmap() {
  const [activeStep, setActiveStep] = useState(0);
  const [showAll, setShowAll] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 1024 && Math.min(window.innerWidth, window.innerHeight) >= 600;
  });

  const handleSelectTab = (idx) => {
    setActiveStep(idx);
    setShowAll(false);
    sfx.pop?.(1 + idx * 0.15);
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
      sfx.tick?.();
    }
  };

  const handleNext = () => {
    if (activeStep < CARDS.length - 1) {
      setActiveStep((prev) => prev + 1);
      sfx.tick?.();
    }
  };

  const activeCard = CARDS[activeStep];

  return (
    <div className="rm4 w-full min-h-full flex flex-col justify-between gap-3 sm:gap-4 py-1 relative select-none">
      <style>{CSS}</style>

      {/* Nền */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="rm4-blob absolute -top-28 -left-24 w-[460px] h-[460px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #54D7E8, transparent 65%)' }} />
        <div className="rm4-blob absolute top-1/3 left-1/2 w-[360px] h-[360px] rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #D8F36A, transparent 65%)', animationDelay: '-4s' }} />
        <div className="rm4-blob absolute -bottom-36 -right-20 w-[480px] h-[480px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #FF875F, transparent 65%)', animationDelay: '-8s' }} />
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse at 50% 40%, #000 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, #000 30%, transparent 75%)',
          }} />
      </div>

      {/* Header */}
      <header className="relative z-10 rm4-rise flex flex-col md:flex-row md:items-end md:justify-between gap-2.5 sm:gap-4 max-w-[1240px] mx-auto w-full" style={{ '--d': '0ms' }}>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#54D7E8]/12 border border-[#54D7E8]/35 text-[#54D7E8] text-[11px] sm:text-xs font-bold tracking-wide">
              Mục tiêu &amp; Lộ trình khoa học
            </span>
            <span className="text-[11px] sm:text-xs text-[#A8BBC8]">Bám sát 3 câu hỏi trọng tâm của đề bài</span>
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-[1.1]">
            Hôm nay, chúng ta sẽ trả lời{' '}
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg,#54D7E8 0%,#D8F36A 50%,#FF875F 100%)' }}>
              3 câu hỏi lớn
            </span>
          </h2>
          <div className="mt-2 h-[2.5px] w-36 sm:w-44 rounded-full" style={{ background: 'linear-gradient(90deg,#54D7E8,#D8F36A,#FF875F)' }} />
        </div>

        {/* Chuỗi phản ứng tổng quát */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-mono font-bold shrink-0">
          {[['NO', '#54D7E8'], ['NO₂', '#D8F36A'], ['HNO₃', '#FF875F']].map(([t, c], i) => (
            <React.Fragment key={t}>
              <span className="px-2.5 py-1 rounded-xl border bg-[#071521]/80" style={{ color: c, borderColor: `${c}55` }}>{t}</span>
              {i < 2 && <ChevronRight size={13} className="text-[#A8BBC8]" />}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Tab bar chọn Trụ cột & Chế độ xem */}
      <div className="relative z-10 flex items-center justify-between gap-2.5 max-w-[1240px] mx-auto w-full">
        {/* 3 Pills: 01, 02, 03 */}
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-2xl bg-[#050E17]/90 border border-white/10 backdrop-blur-md shadow-md">
          {CARDS.map((card, idx) => {
            const isActive = !showAll && activeStep === idx;
            return (
              <button
                key={card.step}
                type="button"
                onClick={() => handleSelectTab(idx)}
                className={`relative py-1.5 px-2.5 sm:px-3.5 rounded-xl text-center transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${
                  isActive
                    ? 'text-white font-black shadow-md'
                    : 'text-[#A8BBC8] hover:text-white font-semibold'
                }`}
                style={{
                  backgroundColor: isActive ? `${card.color}24` : 'transparent',
                  border: isActive ? `1px solid ${card.color}88` : '1px solid transparent',
                }}
              >
                <span
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0"
                  style={{
                    background: isActive ? card.color : 'rgba(255,255,255,0.1)',
                    color: isActive ? '#050E17' : '#A8BBC8',
                  }}
                >
                  {card.step}
                </span>
                <span className="text-xs sm:text-sm whitespace-nowrap">{card.title}</span>
              </button>
            );
          })}
        </div>

        {/* Nút Xem cả 3 / Xem từng trụ */}
        <button
          type="button"
          onClick={() => {
            setShowAll(!showAll);
            sfx.pop?.(1.4);
          }}
          className={`px-3 py-1.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs sm:text-sm font-semibold shrink-0 ${
            showAll
              ? 'bg-[#54D7E8]/20 border-[#54D7E8] text-white shadow-[0_0_12px_rgba(84,215,232,0.3)]'
              : 'bg-[#050E17]/90 border-white/10 text-[#A8BBC8] hover:text-white'
          }`}
        >
          {showAll ? <ListFilter size={15} /> : <Layers size={15} />}
          <span>{showAll ? 'Xem từng trụ' : 'Xem cả 3'}</span>
        </button>
      </div>

      {/* Khu vực nội dung thẻ */}
      <div className="relative z-10 my-auto w-full">
        {showAll ? (
          /* Chế độ xem cả 3 thẻ: 3 cột ngang trên màn hình rộng / xếp dọc trên màn hình hẹp */
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-3.5 lg:gap-0 max-w-[1240px] mx-auto w-full">
            {CARDS.map((card, idx) => (
              <React.Fragment key={card.step}>
                <article
                  onMouseMove={trackMouse}
                  style={{ '--d': `${160 + idx * 140}ms`, '--c': card.color }}
                  className="rm4-rise rm4-card group flex-1 min-w-0 rounded-2xl xl:rounded-3xl p-3 xl:p-4 flex flex-col justify-between"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-2xl xl:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(360px circle at var(--mx, 50%) var(--my, 0%), ${card.color}26, transparent 62%)` }}
                  />
                  <div className="rm4-sheen" aria-hidden="true" />
                  <div
                    className="absolute top-0 left-6 right-6 h-[2px] rounded-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${card.color}, transparent)` }}
                  />

                  {/* Ảnh minh họa */}
                  <div className="relative max-w-[280px] mx-auto w-full">
                    <div className="w-full aspect-[240/132] max-h-[135px] flex items-center justify-center">
                      <Illustration step={card.step} color={card.color} />
                    </div>
                    <span
                      className="absolute top-2 left-2 w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs"
                      style={{ background: card.color, color: '#050E17', boxShadow: `0 4px 12px ${card.color}66` }}
                    >
                      {card.step}
                    </span>
                  </div>

                  {/* Tiêu đề */}
                  <div className="relative mt-2">
                    <span className="block text-[11px] font-semibold tracking-wide" style={{ color: card.color }}>
                      Trụ cột {card.step} · {card.subtitle}
                    </span>
                    <h3 className="text-lg xl:text-xl font-black text-white leading-tight">{card.title}</h3>
                  </div>

                  {/* Câu hỏi */}
                  <p
                    className="relative mt-1.5 pl-2.5 py-0.5 border-l-[3px] rounded-r-lg text-xs xl:text-sm font-bold text-white leading-snug"
                    style={{ borderColor: card.color, background: `linear-gradient(90deg, ${card.color}1A, transparent)` }}
                  >
                    {card.question}
                  </p>

                  {/* Checklist */}
                  <ul className="relative mt-2 space-y-1 xl:space-y-1.5 text-[11px] xl:text-xs text-[#DCE6F0]">
                    {card.details.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-snug">
                        <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: card.color }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Phương trình */}
                  <div className="relative mt-auto pt-2.5">
                    <div className="border-t border-white/10 pt-2">
                      <span className="block text-[10px] text-[#A8BBC8] mb-1">Phương trình hóa học tiêu biểu</span>
                      <div
                        className="rounded-xl px-2 py-1.5 bg-[#050E17]/90 border font-mono font-bold text-[11px] xl:text-xs leading-relaxed flex flex-wrap items-center gap-x-1.5 gap-y-0.5"
                        style={{ borderColor: `${card.color}55`, boxShadow: `inset 0 0 20px ${card.color}14` }}
                      >
                        <span className="text-white">{card.eq.left}</span>
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-flex items-center justify-center text-[9px]"
                          style={{ background: `${card.color}26`, color: card.color }}
                        >
                          →
                        </span>
                        <span style={{ color: card.color }}>{card.eq.right}</span>
                      </div>
                    </div>
                  </div>
                </article>

                {idx < CARDS.length - 1 && (
                  <Connector from={card.color} to={CARDS[idx + 1].color} delay={420 + idx * 140} />
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          /* Chế độ xem từng Trụ cột: layout 2 cột cân xứng hoàn hảo, hiển thị đầy đủ không bị tràn màn hình */
          <SinglePillarCard
            card={activeCard}
            onPrev={handlePrev}
            onNext={handleNext}
            isFirst={activeStep === 0}
            isLast={activeStep === CARDS.length - 1}
            stepIndex={activeStep}
            totalSteps={CARDS.length}
            onSelectStep={(i) => {
              setActiveStep(i);
              sfx.pop?.(1 + i * 0.15);
            }}
          />
        )}
      </div>

      {/* Phương pháp 4 bước */}
      <div className="relative z-10 rm4-rise rm4-card rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3 max-w-[1240px] mx-auto w-full" style={{ '--d': '640ms', '--c': '#54D7E8' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <span className="text-xs sm:text-sm font-bold text-[#54D7E8] tracking-wide shrink-0">Phương pháp tiếp cận 4 bước</span>
          <ol className="flex-1 grid grid-cols-2 md:flex md:flex-nowrap items-center justify-between gap-2">
            {METHOD.map((m, i) => {
              const Icon = m.icon;
              return (
                <React.Fragment key={m.label}>
                  <li className="flex items-center gap-2 bg-[#071521]/85 px-2.5 py-1 sm:px-3 rounded-xl border border-[#29485A]/80">
                    <span className="w-5 h-5 rounded-lg bg-[#54D7E8]/15 text-[#54D7E8] flex items-center justify-center font-mono text-[11px] font-bold shrink-0">{i + 1}</span>
                    <Icon size={13} className="text-[#D8F36A] shrink-0" />
                    <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-white whitespace-nowrap truncate">{m.label}</span>
                  </li>
                  {i < METHOD.length - 1 && (
                    <span aria-hidden="true" className="hidden md:block flex-1 h-px min-w-2"
                      style={{ background: 'linear-gradient(90deg,#54D7E8,#D8F36A)', opacity: 0.55 }} />
                  )}
                </React.Fragment>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}