import React from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Maximize, Minimize } from 'lucide-react';
import { sfx } from '../audio/sfx';

export const RAIL_W = 44;

/**
 * MiniRail — thanh điều khiển nhỏ gọn cho điện thoại (ngang).
 * Mở: thanh dọc 44px (trước / tiến độ / tiếp / kịch bản / toàn màn hình).
 * Đóng: chỉ còn một tab nhỏ ở mép màn hình để mở lại. Vị trí trái/phải theo panelPos.
 */
export default function MiniRail({
  currentSlide = 1,
  totalSlides = 21,
  onPrev,
  onNext,
  isOpen = true,
  onToggleOpen,
  pos = 'right',
  isNotesOpen = false,
  onToggleNotes,
  isFullscreen = false,
  onToggleFullscreen,
}) {
  const isRight = pos === 'right';
  const pct = Math.round((currentSlide / totalSlides) * 100);
  const edge = isRight
    ? { right: 'env(safe-area-inset-right, 0px)' }
    : { left: 'env(safe-area-inset-left, 0px)' };

  const tap = (fn) => () => {
    sfx.tick();
    fn && fn();
  };

  if (!isOpen) {
    return (
      <button
        onClick={tap(onToggleOpen)}
        aria-label="Mở thanh điều khiển"
        style={edge}
        className={`fixed top-1/2 -translate-y-1/2 z-40 w-[22px] h-16 flex items-center justify-center text-[#54D7E8] bg-[#081724]/80 backdrop-blur-md border border-[#54D7E8]/30 shadow-[0_0_18px_rgba(84,215,232,0.18)] active:scale-95 transition-transform ${
          isRight ? 'rounded-l-2xl border-r-0' : 'rounded-r-2xl border-l-0'
        }`}
      >
        {isRight ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    );
  }

  const base =
    'w-8 h-8 shrink-0 flex items-center justify-center rounded-xl border transition-all active:scale-90 disabled:opacity-30 disabled:pointer-events-none';
  const idle = 'bg-[#0D2234]/80 border-[#1E3A4D] text-[#94A3B8]';

  return (
    <aside
      data-rail
      aria-label="Thanh điều khiển"
      style={{
        ...edge,
        width: `${RAIL_W}px`,
        background: 'linear-gradient(180deg, rgba(10,30,46,0.97) 0%, rgba(5,14,23,0.99) 100%)',
      }}
      className={`fixed top-0 bottom-0 z-40 flex flex-col items-center justify-center gap-1.5 py-1.5 select-none overflow-y-auto no-scrollbar ${
        isRight ? 'border-l border-[#54D7E8]/20' : 'border-r border-[#54D7E8]/20'
      }`}
    >
      <button
        onClick={tap(onToggleOpen)}
        aria-label="Thu gọn thanh điều khiển"
        className="w-8 h-5 shrink-0 flex items-center justify-center rounded-lg text-[#6E8A9E] hover:text-[#54D7E8]"
      >
        {isRight ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <button onClick={onPrev} disabled={currentSlide <= 1} aria-label="Slide trước" className={`${base} ${idle}`}>
        <ChevronLeft size={18} className="text-[#54D7E8]" />
      </button>

      {/* Vòng tiến độ + số slide */}
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSlides}
        aria-valuenow={currentSlide}
        className="w-9 h-9 shrink-0 rounded-full p-[2.5px]"
        style={{ background: `conic-gradient(#54D7E8 ${pct}%, #1E3A4D 0)` }}
      >
        <div className="w-full h-full rounded-full bg-[#06121C] flex flex-col items-center justify-center leading-none font-mono">
          <span className="text-[11px] font-bold text-white">{currentSlide}</span>
          <span className="text-[8px] text-[#6E8A9E] mt-px">{totalSlides}</span>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={currentSlide >= totalSlides}
        aria-label="Slide tiếp theo"
        className="w-8 h-8 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#54D7E8] to-[#38BDF8] text-[#050E17] shadow-[0_0_14px_rgba(84,215,232,0.35)] active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronRight size={18} />
      </button>

      <button
        onClick={tap(onToggleNotes)}
        aria-label="Kịch bản và cài đặt"
        className={`${base} ${isNotesOpen ? 'bg-[#54D7E8]/20 border-[#54D7E8] text-[#54D7E8]' : idle}`}
      >
        <BookOpen size={15} />
      </button>

      <button
        onClick={tap(onToggleFullscreen)}
        aria-label={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
        className={`${base} ${idle} text-[#D8F36A]`}
      >
        {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
      </button>
    </aside>
  );
}
