import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sparkles,
  Clock,
  MoreHorizontal,
  Play,
  RotateCcw,
  Compass,
  Crosshair,
} from 'lucide-react';
import { SLIDES_REGISTRY, TOTAL_SLIDES, SECTIONS } from '../config/slides';
import { sfx } from '../audio/sfx';

/**
 * Dock Component (GEMINI_FULL_SPEC_ACID_V4 §9.4 & §9.5)
 * In-flow layout dock occupying [data-dock] row.
 * In Present Mode (P/F), floats temporarily when mouse nears the bottom 80px.
 */
export default function Dock({
  currentSlide = 1,
  totalSlides = TOTAL_SLIDES,
  goToPrev,
  goToNext,
  goToSlide,
  isNotesOpen,
  onToggleNotes,
  isFullscreen,
  toggleFullscreen,
  isPresentMode,
  togglePresentMode,
  isMuted,
  toggleMute,
  motionMode,
  onChangeMotionMode,
  layoutMode = 'canvas',
  onOpenMobileMenu,
  laserMode = null,
  toggleLaser,
  onReplay,
  elapsedTime: propElapsedTime,
  isTimerRunning: propIsTimerRunning,
  onToggleTimer,
  onResetTimer,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [localElapsedTime, setLocalElapsedTime] = useState(0);
  const [localIsTimerRunning, setLocalIsTimerRunning] = useState(true);
  const [hoveredSlideNum, setHoveredSlideNum] = useState(null);

  const currentMeta = SLIDES_REGISTRY[currentSlide - 1] || {};

  const activeTime = propElapsedTime !== undefined ? propElapsedTime : localElapsedTime;
  const timerRunning = propIsTimerRunning !== undefined ? propIsTimerRunning : localIsTimerRunning;

  // Fallback presentation stopwatch if not controlled by parent
  useEffect(() => {
    if (propElapsedTime !== undefined || !localIsTimerRunning) return;
    const interval = setInterval(() => {
      setLocalElapsedTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [propElapsedTime, localIsTimerRunning]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isMobile = layoutMode === 'reflow';

  return (
    <nav
      data-dock
      aria-label="Điều khiển bài thuyết trình"
      className="w-full h-full bg-[#050E17]/95 border-t border-[#1E3A4D] px-2 sm:px-4 flex items-center justify-between text-[#F8FAFC] select-none backdrop-blur-md z-20"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* MOBILE REFINE BAR (<640px / reflow) */}
      {isMobile ? (
        <div className="w-full flex items-center justify-between gap-1.5 h-12">
          {/* Prev */}
          <button
            onClick={goToPrev}
            disabled={currentSlide <= 1}
            aria-label="Slide trước (←)"
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#0D2234] border border-[#1E3A4D] disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-transform"
          >
            <ChevronLeft size={20} className="text-[#54D7E8]" />
          </button>

          {/* Current slide indicator */}
          <div className="flex-1 h-11 px-3 flex items-center justify-center gap-1.5 rounded-xl bg-[#091B2A] border border-[#1E3A4D] text-xs font-semibold truncate">
            <span className="font-mono text-[#54D7E8] font-bold shrink-0">
              {currentMeta.num || currentSlide}/{totalSlides}
            </span>
            <span className="text-[#6E8A9E]">•</span>
            <span className="truncate text-[#DCE6F0]">{currentMeta.shortTitle || currentMeta.title}</span>
          </div>

          {/* Next */}
          <button
            onClick={goToNext}
            disabled={currentSlide >= totalSlides}
            aria-label="Slide tiếp theo (→ / Space)"
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-r from-[#54D7E8] to-[#38BDF8] text-[#050E17] font-bold disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-transform"
          >
            <ChevronRight size={20} />
          </button>

          {/* Notes Toggle Button */}
          <button
            onClick={() => {
              sfx.tick();
              onToggleNotes();
            }}
            aria-label="Bật kịch bản thuyết trình"
            className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-colors ${
              isNotesOpen
                ? 'bg-[#54D7E8]/20 border-[#54D7E8] text-[#54D7E8]'
                : 'bg-[#0D2234] border-[#1E3A4D] text-[#94A3B8]'
            }`}
          >
            <BookOpen size={18} />
          </button>

          {/* More menu popup trigger */}
          <button
            onClick={onOpenMobileMenu}
            aria-label="Tùy chọn khác"
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#0D2234] border border-[#1E3A4D] text-[#94A3B8]"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      ) : (
        /* DESKTOP FULL CONTROLS DOCK */
        <div className="w-full flex items-center justify-between gap-3 h-full">
          {/* Navigation group */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={goToPrev}
              disabled={currentSlide <= 1}
              aria-label="Slide trước (Phím ← hoặc PageUp)"
              title="Slide trước (←)"
              className="h-8 px-2.5 flex items-center gap-1 rounded-lg bg-[#0D2234] hover:bg-[#143245] border border-[#1E3A4D] text-xs font-medium text-[#DCE6F0] disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
            >
              <ChevronLeft size={16} className="text-[#54D7E8]" />
              <span className="hidden lg:inline">Trước</span>
            </button>

            <button
              onClick={goToNext}
              disabled={currentSlide >= totalSlides}
              aria-label="Slide sau (Phím →, Space, hoặc PageDown)"
              title="Slide sau (→ / Space)"
              className="h-8 px-3 flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#54D7E8] to-[#38BDF8] hover:brightness-110 text-[#050E17] text-xs font-bold disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 shadow-sm"
            >
              <span>Tiếp</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* 21-Segment Progress Bar & Current Title */}
          <div className="flex-1 max-w-[620px] flex flex-col justify-center gap-1 px-2">
            <div
              role="progressbar"
              aria-valuenow={currentSlide}
              aria-valuemin={1}
              aria-valuemax={totalSlides}
              aria-label={`Tiến độ thuyết trình: slide ${currentSlide} trên ${totalSlides}`}
              className="h-2 w-full bg-[#0D2234] rounded-full p-0.5 flex gap-0.5 cursor-pointer border border-[#1E3A4D]/60 relative group"
            >
              {SLIDES_REGISTRY.map((s) => {
                const isPassed = s.id <= currentSlide;
                const isCurrent = s.id === currentSlide;
                return (
                  <div
                    key={s.id}
                    onClick={() => goToSlide(s.id)}
                    onMouseEnter={() => setHoveredSlideNum(s.id)}
                    onMouseLeave={() => setHoveredSlideNum(null)}
                    title={`Slide ${s.num}: ${s.title}`}
                    className={`flex-1 h-full rounded-sm transition-all ${
                      isCurrent
                        ? 'bg-[#54D7E8] shadow-[0_0_8px_#54D7E8]'
                        : isPassed
                        ? 'bg-[#54D7E8]/60 hover:bg-[#54D7E8]'
                        : 'bg-[#1E3A4D]/60 hover:bg-[#29485A]'
                    }`}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-[#94A3B8]">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-mono text-[#54D7E8] font-bold">
                  {currentMeta.num} / {totalSlides}
                </span>
                <span className="text-[#6E8A9E]">•</span>
                <span className="text-[#F8FAFC] font-medium truncate">
                  {hoveredSlideNum
                    ? SLIDES_REGISTRY[hoveredSlideNum - 1]?.title
                    : currentMeta.title}
                </span>
              </div>

              <span
                className="hidden md:inline px-1.5 py-0.5 rounded font-mono text-xs"
                style={{
                  color: currentMeta.sectionColor || '#54D7E8',
                  backgroundColor: `${currentMeta.sectionColor || '#54D7E8'}15`,
                }}
              >
                {currentMeta.section}
              </span>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 shrink-0">

            {/* Notes button (N) */}
            <button
              onClick={() => {
                sfx.tick();
                onToggleNotes();
              }}
              aria-label="Kịch bản thuyết trình (Phím N)"
              title="Kịch bản thuyết trình (N)"
              className={`h-8 px-2.5 flex items-center gap-1.5 rounded-lg border text-xs font-medium transition-all ${
                isNotesOpen
                  ? 'bg-[#54D7E8]/15 border-[#54D7E8] text-[#54D7E8]'
                  : 'bg-[#0D2234] border-[#1E3A4D] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#143245]'
              }`}
            >
              <BookOpen size={14} />
              <span className="hidden sm:inline">Kịch bản</span>
              <kbd className="hidden lg:inline text-xs text-[#6E8A9E] font-mono">N</kbd>
            </button>

            {/* Audio toggle */}
            <button
              onClick={() => {
                sfx.tick();
                toggleMute();
              }}
              aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              title={isMuted ? 'Bật âm thanh (Muted)' : 'Tắt âm thanh (Playing)'}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all ${
                isMuted
                  ? 'bg-[#F06B70]/15 border-[#F06B70]/40 text-[#F06B70]'
                  : 'bg-[#0D2234] border-[#1E3A4D] text-[#54D7E8] hover:bg-[#143245]'
              }`}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            {/* Presenter / Fullscreen Mode */}
            <button
              onClick={() => {
                sfx.tick();
                (togglePresentMode || toggleFullscreen)();
              }}
              aria-label="Chế độ Trình chiếu (Phím P hoặc F)"
              title="Trình chiếu (P / F)"
              className="h-8 px-2.5 flex items-center gap-1.5 rounded-lg bg-[#0D2234] hover:bg-[#143245] border border-[#1E3A4D] text-xs font-medium text-[#D8F36A] hover:border-[#D8F36A]/40 transition-all"
            >
              {isFullscreen || isPresentMode ? <Minimize size={14} /> : <Maximize size={14} />}
              <span className="hidden md:inline">Chiếu</span>
              <kbd className="hidden lg:inline text-xs text-[#6E8A9E] font-mono">P</kbd>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
