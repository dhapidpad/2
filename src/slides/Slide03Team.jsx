import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Compass, NotebookPen, FileText, Mic, PenLine, Search, Palette, Shapes, ShieldCheck,
  Users, ChevronLeft, ChevronRight, ListChecks, Check, Play, Pause, Volume2, VolumeX
} from 'lucide-react';
import { teamMembers, teamInfo, groups } from '../data/teamMembers';
import { ta } from '../audio/teamAudio';

/* Đệm hợp lý cho nội dung thẻ thành viên */
const SAFE_PAD = 'pt-2 pb-6';
const AUTO_MS = 6000; // thời gian mỗi thành viên khi bật "Tự chạy"

const iconMap = { Compass, NotebookPen, FileText, Mic, PenLine, Search, Palette, Shapes, ShieldCheck };
const groupList = Object.values(groups);
const groupOf = (m) => groups[m.group] || groupList[0];
const initials = (name = '') => name.trim().split(/\s+/).slice(-2).map((w) => w[0]).join('').toUpperCase();
const pad = (n) => String(n).padStart(2, '0');

// hạt sáng trôi nhẹ ở nền (cố định → không nhảy khi render lại)
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 61) % 100,
  size: 2 + (i % 3),
  dur: 14 + (i % 5) * 4,
  delay: -(i * 2.3),
  dx: ((i % 7) - 3) * 30,
}));

/* Toàn bộ hiệu ứng mới nằm trong tiền tố s3x- → không đụng CSS s3-* sẵn có */
const STYLE = `
@keyframes s3x-in-r{from{opacity:0;transform:translate3d(48px,0,0) scale(.985);filter:blur(6px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes s3x-in-l{from{opacity:0;transform:translate3d(-48px,0,0) scale(.985);filter:blur(6px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes s3x-rise{from{opacity:0;transform:translate3d(0,18px,0)}to{opacity:1;transform:none}}
@keyframes s3x-word{from{transform:translate3d(0,105%,0)}to{transform:none}}
@keyframes s3x-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes s3x-spin{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes s3x-kb{from{transform:scale(1.08) translate3d(0,0,0)}to{transform:scale(1.18) translate3d(-1.5%,-1%,0)}}
@keyframes s3x-drift{0%{transform:translate3d(0,0,0);opacity:0}15%{opacity:.85}100%{transform:translate3d(var(--dx),-110vh,0);opacity:0}}
@keyframes s3x-pop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
.s3x-enter-r{animation:s3x-in-r .55s cubic-bezier(.2,.8,.2,1) backwards}
.s3x-enter-l{animation:s3x-in-l .55s cubic-bezier(.2,.8,.2,1) backwards}
.s3x-rise{animation:s3x-rise .5s cubic-bezier(.2,.8,.2,1) backwards;animation-delay:var(--d,0ms)}
.s3x-pop{animation:s3x-pop .45s cubic-bezier(.2,.9,.3,1.3) backwards;animation-delay:var(--d,0ms)}
.s3x-word-wrap{display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.1em;margin-right:.28em}
.s3x-word{display:inline-block;animation:s3x-word .65s cubic-bezier(.2,.9,.2,1) backwards;animation-delay:var(--d,0ms)}
.s3x-conic{position:absolute;left:50%;top:50%;width:220%;aspect-ratio:1/1;animation:s3x-spin 8s linear infinite;pointer-events:none}
.s3x-kb{animation:s3x-kb 16s ease-in-out infinite alternate}
.s3x-particle{position:absolute;bottom:-10px;border-radius:9999px;animation:s3x-drift linear infinite;will-change:transform}
.s3x-item{transition:transform .25s ease,background-color .25s ease,border-color .25s ease}
.s3x-item:hover{transform:translate3d(6px,0,0);background-color:rgba(255,255,255,.08)}
@media (prefers-reduced-motion:reduce){[class*="s3x-"]{animation:none !important}}
`;

/* Ảnh avatar; trống/lỗi → tranh quỹ đạo + chữ cái đầu */
function Face({ member, color, big = false }) {
  const url = member.avatar || '';
  const gif = member.gif || '';
  const [failed, setFailed] = useState(false);
  const [gifFailed, setGifFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);
  useEffect(() => setGifFailed(false), [gif]);
  const Icon = iconMap[member.icon] || Users;

  if (url && !failed) {
    return <img src={url} alt={member.name} referrerPolicy="no-referrer" draggable={false}
      onError={() => setFailed(true)} className={`w-full h-full object-cover ${big ? 's3-img' : ''}`} />;
  }
  if (!big) {
    return (
      <div className="w-full h-full flex items-center justify-center s3-display font-extrabold text-sm"
        style={{ color, background: `radial-gradient(circle at 30% 22%, ${color}50, ${color}12 60%, #06141F)` }}>
        {initials(member.name)}
      </div>
    );
  }
  return (
    <div className="relative w-full h-full overflow-hidden"
      style={{ background: `radial-gradient(120% 90% at 25% 12%, ${color}55, ${color}14 55%, #06141F 100%)` }}>
      {[[190, .3, 0], [290, .2, 1], [400, .13, 0], [520, .08, 0]].map(([s, o, dash], i) => (
        <div key={i} className={`s3-orbit ${dash ? 's3-spin' : ''}`}
          style={{ width: s, height: s, border: `1px ${dash ? 'dashed' : 'solid'} ${color}`, opacity: o * 2.4 }}>
          {dash ? <span className="absolute -top-1 left-1/2 w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}` }} /> : null}
        </div>
      ))}
      <div className="s3-orbit flex flex-col items-center justify-center gap-0.5 overflow-hidden"
        style={{ width: gif && !gifFailed ? 156 : 128, height: gif && !gifFailed ? 156 : 128, background: `radial-gradient(circle at 32% 26%, ${color}66, ${color}1c 65%, rgba(5,14,23,.9))`, border: `1.5px solid ${color}`, boxShadow: `0 0 60px ${color}55`, color }}>
        {gif && !gifFailed ? (
          <img src={gif} alt="" referrerPolicy="no-referrer" draggable={false} decoding="async"
            onError={() => setGifFailed(true)} className="w-full h-full object-cover" />
        ) : (
          <>
            <Icon size={20} strokeWidth={1.6} className="opacity-80" />
            <span className="s3-display font-extrabold text-[40px] leading-none">{initials(member.name)}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function Slide03Team() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [auto, setAuto] = useState(false);
  const [hold, setHold] = useState(false); // dừng tự chạy khi rê chuột lên thẻ
  const [muted, setMuted] = useState(() => ta.isMuted());

  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const raf = useRef(0);
  const pt = useRef(null);
  const touchX = useRef(null);
  const tabRefs = useRef([]);
  const indexRef = useRef(0);

  const total = teamMembers.length;
  const member = teamMembers[index];
  const group = groupOf(member);
  const c = group.color;
  const activeIdx = groupList.indexOf(group);
  const mates = teamMembers.filter((m) => groupOf(m) === group);
  indexRef.current = index;

  const go = useCallback((target, d) => {
    setDir(d);
    setIndex(target);
  }, []);
  const next = useCallback(() => {
    ta.tick(1);
    go((indexRef.current + 1) % total, 1);
  }, [go, total]);
  const prev = useCallback(() => {
    ta.tick(-1);
    go((indexRef.current - 1 + total) % total, -1);
  }, [go, total]);
  const pick = useCallback((i) => {
    if (i === indexRef.current) return;
    ta.select(i);
    go(i, i > indexRef.current ? 1 : -1);
  }, [go]);

  // đổi sang công đoạn khác trong dây chuyền → âm "chuông" đi lên
  const prevGroup = useRef(activeIdx);
  useEffect(() => {
    if (prevGroup.current !== activeIdx) {
      ta.group(activeIdx);
      prevGroup.current = activeIdx;
    }
  }, [activeIdx]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const TILT = (rx, ry) => `perspective(1600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  const apply = () => {
    raf.current = 0;
    const el = cardRef.current, g = glareRef.current, p = pt.current;
    if (!el || !p) return;
    const r = el.getBoundingClientRect();
    const x = (p.x - r.left) / r.width, y = (p.y - r.top) / r.height;
    el.style.transform = TILT(((0.5 - y) * 4).toFixed(2), ((x - 0.5) * 6).toFixed(2));
    // thị sai: ảnh chân dung trôi ngược chiều chuột
    el.style.setProperty('--px', ((0.5 - x) * 16).toFixed(1));
    el.style.setProperty('--py', ((0.5 - y) * 10).toFixed(1));
    if (g) { g.style.opacity = 1; g.style.transform = `translate3d(${x * r.width - 260}px, ${y * r.height - 260}px, 0)`; }
  };
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    pt.current = { x: e.clientX, y: e.clientY };
    if (!raf.current) raf.current = requestAnimationFrame(apply);
  };
  const onEnter = (e) => { if (e.pointerType === 'mouse') setHold(true); };
  const onLeave = () => {
    pt.current = null;
    setHold(false);
    const el = cardRef.current;
    if (el) {
      el.style.transform = TILT(0, 0);
      el.style.setProperty('--px', 0);
      el.style.setProperty('--py', 0);
    }
    if (glareRef.current) glareRef.current.style.opacity = 0;
  };

  // điều hướng bàn phím trên rail (chuẩn ARIA tablist)
  const onRailKey = (e) => {
    const k = e.key;
    let ni = null;
    if (k === 'ArrowDown' || k === 'ArrowRight') ni = (index + 1) % total;
    else if (k === 'ArrowUp' || k === 'ArrowLeft') ni = (index - 1 + total) % total;
    else if (k === 'Home') ni = 0;
    else if (k === 'End') ni = total - 1;
    if (ni == null) return;
    e.preventDefault();
    e.stopPropagation();
    pick(ni);
    requestAnimationFrame(() => tabRefs.current[ni]?.focus());
  };

  const toggleAuto = () => {
    ta.toggle(!auto);
    setAuto((a) => !a);
  };
  const toggleSound = () => {
    const m = !muted;
    ta.setMuted(m);
    setMuted(m);
    if (!m) ta.toggle(true);
  };
  const onAutoEnd = (e) => { if (e.animationName === 's3x-fill') next(); };

  const meta = [teamInfo.groupName, teamInfo.subject, teamInfo.className && `Lớp ${teamInfo.className}`].filter(Boolean).join(' · ');
  const nameWords = member.name.trim().split(/\s+/);
  const ctrlBtn = 's3-focus h-9 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.13] border border-white/10 text-[#DCE6F0] text-xs font-semibold flex items-center gap-1.5 transition-colors';

  return (
    <div className={`s3-root w-full min-h-full flex flex-col justify-center max-w-7xl mx-auto select-none relative gap-4 ${SAFE_PAD}`}>
      <style>{STYLE}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="s3-grid absolute inset-0" />
        <div className="s3-float absolute -top-40 -right-32 w-[540px] h-[540px] rounded-full will-change-transform"
          style={{ background: `radial-gradient(circle, ${c}38, transparent 68%)`, transition: 'background 1s' }} />
        <div className="s3-float absolute -bottom-52 -left-32 w-[540px] h-[540px] rounded-full will-change-transform"
          style={{ background: `radial-gradient(circle, ${c}20, transparent 68%)`, animationDelay: '-7s', transition: 'background 1s' }} />
        {PARTICLES.map((p, i) => (
          <span key={i} className="s3x-particle"
            style={{ left: `${p.left}%`, width: p.size, height: p.size, background: c, boxShadow: `0 0 10px ${c}`, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`, '--dx': `${p.dx}px` }} />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-end justify-between gap-3 px-1">
        <div>
          <h2 className="s3-display text-3xl sm:text-4xl font-extrabold text-white leading-none">9 người, một dây chuyền làm việc</h2>
          <span className="block h-[3px] w-16 rounded-full mt-2.5 transition-colors duration-700" style={{ background: c, boxShadow: `0 0 12px ${c}` }} />
          <p className="text-xs sm:text-sm text-[#A8BBC8] mt-2">Từ tìm tài liệu, viết nội dung, biên tập, thiết kế đến phản biện trước khi nộp.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {meta && <span className="hidden lg:inline-block px-3 py-1 rounded-full bg-white/[0.06] border border-white/15 text-[#DCE6F0] text-xs font-semibold">{meta}</span>}
          <span className="s3-display flex items-baseline gap-1 pr-1" aria-live="polite">
            <span key={index} className="s3x-pop inline-block text-2xl font-extrabold" style={{ color: c }}>{pad(member.stt)}</span>
            <span className="text-xs text-[#A8BBC8]">/ {pad(total)}</span>
          </span>
          <button onClick={toggleAuto} aria-pressed={auto} className={ctrlBtn}
            style={auto ? { color: c, borderColor: `${c}66`, background: `${c}18` } : undefined}>
            {auto ? <Pause size={14} /> : <Play size={14} />}
            <span className="hidden sm:inline">{auto ? 'Tạm dừng' : 'Tự chạy'}</span>
          </button>
          <button onClick={toggleSound} aria-label={muted ? 'Bật âm thanh' : 'Tắt âm thanh'} className={`${ctrlBtn} !px-2.5`}>
            {muted ? <VolumeX size={15} className="text-[#F06B70]" /> : <Volume2 size={15} style={{ color: c }} />}
          </button>
        </div>
      </div>

      {/* Thanh tiến trình theo thành viên (tự chạy sẽ lấp đầy đoạn hiện tại) */}
      <div className="relative z-10 flex gap-1 px-1">
        {teamMembers.map((m, i) => {
          const mc = groupOf(m).color;
          const done = i < index;
          const cur = i === index;
          return (
            <button key={m.id} onClick={() => pick(i)} aria-label={`Chuyển tới ${m.name}`} className="s3-focus group flex-1 py-1.5 rounded-full">
              <span className="relative block h-1.5 rounded-full overflow-hidden bg-white/10 group-hover:bg-white/20 transition-colors">
                <span className="absolute inset-0 origin-left rounded-full"
                  style={{ background: mc, opacity: done ? 0.8 : 1, transform: done || (cur && !auto) ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform .5s ease' }} />
                {cur && auto && (
                  <span key={`${index}-${auto}`} className="absolute inset-0 origin-left rounded-full" onAnimationEnd={onAutoEnd}
                    style={{ background: mc, animation: `s3x-fill ${AUTO_MS}ms linear forwards`, animationPlayState: hold ? 'paused' : 'running' }} />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[46px_1fr] gap-4">
        {/* Rail */}
        <div className="s3-scroll flex lg:flex-col lg:justify-between gap-2 overflow-x-auto lg:overflow-visible py-1 px-1 lg:px-0"
          role="tablist" aria-label="Chọn thành viên" onKeyDown={onRailKey}>
          {teamMembers.map((m, i) => {
            const mc = groupOf(m).color;
            const sel = i === index;
            return (
              <button key={m.id} ref={(el) => { tabRefs.current[i] = el; }} role="tab" aria-selected={sel} tabIndex={sel ? 0 : -1}
                aria-label={m.name} onClick={() => pick(i)} onPointerEnter={(e) => { if (e.pointerType === 'mouse') ta.hover(); }}
                className="s3-focus group relative shrink-0 w-[44px] h-[44px] lg:w-[46px] lg:h-[46px] rounded-full transition-all duration-300"
                style={{ padding: 2, background: sel ? mc : 'rgba(255,255,255,.1)', boxShadow: sel ? `0 0 24px ${mc}80` : 'none', opacity: sel ? 1 : 0.6, transform: sel ? 'scale(1.1)' : 'scale(1)' }}>
                <div className="w-full h-full rounded-full overflow-hidden bg-[#06141F]"><Face member={m} color={mc} /></div>
                <span className="s3-tip hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 z-30 whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#06141F] border border-white/15 text-xs font-semibold text-white pointer-events-none">{m.name}</span>
              </button>
            );
          })}
        </div>

        {/* Card */}
        <div ref={cardRef} onPointerMove={onMove} onPointerEnter={onEnter} onPointerLeave={onLeave}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const d = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(d) > 55) (d < 0 ? next : prev)();
            touchX.current = null;
          }}
          style={{ transition: 'transform .18s ease-out', willChange: 'transform' }}>
          {/* viền sáng chạy quanh thẻ */}
          <div className="relative p-px rounded-[30px] overflow-hidden transition-all duration-700"
            style={{ background: `linear-gradient(140deg, ${c}55, rgba(255,255,255,.08) 35%, rgba(255,255,255,.04) 65%, ${c}33)`, boxShadow: `0 30px 90px -40px ${c}88` }}>
            <div className="absolute inset-0" aria-hidden="true">
              <div className="s3x-conic" style={{ background: `conic-gradient(from 0deg, transparent 0 58%, ${c} 78%, transparent 92% 100%)`, opacity: 0.9, transition: 'background 1s' }} />
            </div>

            <div key={member.id} className={`${dir > 0 ? 's3x-enter-r' : 's3x-enter-l'} s3-glass rounded-[29px] overflow-hidden grid grid-cols-1 md:grid-cols-12 relative md:min-h-[450px]`}>
              <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden hidden md:block">
                <div ref={glareRef} className="absolute left-0 top-0 w-[520px] h-[520px] will-change-transform"
                  style={{ opacity: 0, transition: 'opacity .3s', background: 'radial-gradient(circle, rgba(255,255,255,.1), transparent 60%)' }} />
              </div>

              {/* Portrait */}
              <div className="md:col-span-5 relative min-h-[300px] overflow-hidden s3-sheen">
                <div className="absolute inset-0" style={{ transform: 'translate3d(calc(var(--px, 0) * 1px), calc(var(--py, 0) * 1px), 0)', transition: 'transform .25s ease-out' }}>
                  <div className="absolute inset-0 s3x-kb"><Face member={member} color={c} big /></div>
                </div>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,12,20,.97) 6%, rgba(4,12,20,.5) 36%, transparent 62%)' }} />
                <div aria-hidden="true" className="s3x-rise absolute right-3 top-2 s3-display font-extrabold leading-none"
                  style={{ fontSize: 128, color: 'transparent', WebkitTextStroke: `2px ${c}`, opacity: 0.5, '--d': '120ms' }}>{pad(member.stt)}</div>
                <span className="s3x-rise absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
                  style={{ color: c, borderColor: `${c}66`, background: 'rgba(5,14,23,.82)', '--d': '60ms' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />{group.name}
                </span>
                <div className="absolute left-0 right-0 bottom-0 p-5 sm:p-6">
                  <span className="s3x-pop inline-block px-2.5 py-0.5 rounded-md text-xs font-bold text-[#050E17]" style={{ background: c, '--d': '180ms' }}>{member.role}</span>
                  <h3 className="s3-display text-3xl sm:text-[38px] font-extrabold text-white leading-[1.05] mt-2 break-words" aria-label={member.name}>
                    {nameWords.map((w, i) => (
                      <span key={i} className="s3x-word-wrap" aria-hidden="true"><span className="s3x-word" style={{ '--d': `${200 + i * 80}ms` }}>{w}</span></span>
                    ))}
                  </h3>
                  <div className="s3x-rise text-sm text-[#DCE6F0]/80 mt-1" style={{ '--d': '420ms' }}>{member.titleRole}</div>
                </div>
              </div>

              {/* Right */}
              <div className="md:col-span-7 p-5 sm:p-7 flex flex-col gap-5 md:border-l border-white/10 bg-[#050E17]/35">
                {/* Vị trí trong luồng */}
                <div>
                  <div className="text-xs font-semibold text-[#A8BBC8] mb-3">Vị trí trong luồng làm việc</div>
                  <div className="flex items-start">
                    {groupList.map((g, gi) => {
                      const done = gi < activeIdx, cur = gi === activeIdx;
                      return (
                        <React.Fragment key={g.name}>
                          {gi > 0 && (
                            <div className="relative flex-1 h-px mt-[15px] mx-1.5 overflow-hidden" style={{ background: 'rgba(255,255,255,.14)' }}>
                              <span className="absolute inset-0 origin-left" style={{ background: c, transform: gi <= activeIdx ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform .7s cubic-bezier(.2,.8,.2,1)' }} />
                            </div>
                          )}
                          <button onClick={() => pick(teamMembers.indexOf(teamMembers.find((m) => groupOf(m) === g)))}
                            className="s3-focus flex flex-col items-center gap-1.5 w-[84px] text-center rounded-lg">
                            <span className="relative w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs font-black transition-all duration-500"
                              style={cur ? { background: c, color: '#050E17', boxShadow: `0 0 20px ${c}99` }
                                : { border: `1.5px solid ${done ? c : 'rgba(255,255,255,.22)'}`, color: done ? c : 'rgba(255,255,255,.5)', background: '#06141F' }}>
                              {cur && <span className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ background: c }} />}
                              <span className="relative">{done ? <Check size={15} strokeWidth={3} /> : gi + 1}</span>
                            </span>
                            <span className="text-xs leading-tight font-semibold" style={{ color: cur ? '#fff' : 'rgba(255,255,255,.5)' }}>{g.short}</span>
                          </button>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Nhiệm vụ */}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3 mb-3 pt-4 border-t border-white/10">
                    <h4 className="s3-display text-lg font-bold text-white flex items-center gap-2"><ListChecks size={18} style={{ color: c }} /> Nhiệm vụ phụ trách</h4>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border" style={{ color: c, borderColor: `${c}55`, background: `${c}14` }}>{member.keyDeliverables.length} đầu việc</span>
                  </div>
                  <ol className="space-y-2">
                    {member.keyDeliverables.map((item, i) => (
                      <li key={i} className="s3x-rise s3x-item flex items-start gap-3.5 px-3.5 py-3 rounded-2xl border border-white/10 bg-white/[0.04]"
                        style={{ '--d': `${260 + i * 90}ms`, borderLeft: `3px solid ${c}` }}>
                        <span className="s3-display font-extrabold text-2xl leading-none w-8 shrink-0 pt-0.5" style={{ color: 'transparent', WebkitTextStroke: `1.4px ${c}` }}>{pad(i + 1)}</span>
                        <span className="text-sm sm:text-[15px] text-[#F4F7FA] leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Đồng đội + điều hướng */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {mates.length > 1 && (
                      <>
                        <span className="text-xs text-[#A8BBC8] shrink-0">Cùng nhóm</span>
                        <div className="flex -space-x-2">
                          {mates.map((m) => (
                            <button key={m.id} onClick={() => pick(teamMembers.indexOf(m))} title={m.name} aria-label={m.name}
                              className="s3-focus w-8 h-8 rounded-full overflow-hidden transition-transform hover:-translate-y-0.5 hover:z-10"
                              style={{ border: `2px solid ${m.id === member.id ? c : '#0B2233'}`, boxShadow: m.id === member.id ? `0 0 14px ${c}88` : 'none' }}>
                              <Face member={m} color={c} />
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={prev} aria-label="Trước" className="s3-focus w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.13] border border-white/10 text-white flex items-center justify-center transition-colors"><ChevronLeft size={18} /></button>
                    <button onClick={next} className="s3-focus h-10 px-5 rounded-xl text-xs font-extrabold text-[#050E17] flex items-center gap-1.5 transition-transform hover:scale-[1.04] active:scale-95"
                      style={{ background: c, boxShadow: `0 8px 26px ${c}55` }}>Kế tiếp <ChevronRight size={15} /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}