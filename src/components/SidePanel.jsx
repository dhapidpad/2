import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  BookOpen,
  List,
  Settings,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
  Search,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Crosshair,
  Play,
  Pause,
} from 'lucide-react';
import { slideNotes } from '../data/slideNotes';
import { SLIDES_REGISTRY, TOTAL_SLIDES } from '../config/slides';

// Remove Vietnamese accents for fast fuzzy search
function normalizeVN(str = '') {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

/**
 * SidePanel Component
 * Clean, modern presenter panel with collapsible mini mode and streamlined notes
 */
export default function SidePanel({
  isOpen = false,
  isClosing = false,
  activeTab = 'notes', // 'notes' | 'toc' | 'settings'
  onSelectTab,
  onClose,
  isCompact = false,
  onToggleCompact,
  currentSlide = 1,
  goToSlide,
  panelWidth = 350,
  onResizeWidth,
  panelPos = 'right',
  onTogglePanelPos,
  layoutMode = 'canvas',
  sheetLevel = 'closed', // 'peek' | 'half' | 'full'
  onChangeSheetLevel,
  motionMode = 'cinematic',
  onChangeMotionMode,
  isMuted = false,
  onToggleMute,
  volume = 0.8,
  onChangeVolume,
  onTogglePresent,
  elapsedTime = 0,
  isTimerRunning = true,
  onToggleTimer,
  onResetTimer,
  laserMode = null,
  toggleLaser,
  onReplay,
}) {
  const [copiedTransition, setCopiedTransition] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scriptFontSize, setScriptFontSize] = useState(13.5);
  const [isScriptExpanded, setIsScriptExpanded] = useState(true);
  const tocListRef = useRef(null);

  const currentNote = slideNotes[currentSlide] || {};
  const currentMeta = SLIDES_REGISTRY[currentSlide - 1] || {};
  const nextSlideMeta = currentSlide < TOTAL_SLIDES ? SLIDES_REGISTRY[currentSlide] : null;

  // Copy transition quote
  const handleCopyTransition = () => {
    if (!currentNote.transition) return;
    navigator.clipboard?.writeText(currentNote.transition);
    setCopiedTransition(true);
    setTimeout(() => setCopiedTransition(false), 1800);
  };

  // Copy script
  const handleCopyScript = () => {
    if (!currentNote.script) return;
    navigator.clipboard?.writeText(currentNote.script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 1800);
  };

  // Scroll current slide into view in TOC
  useEffect(() => {
    if (activeTab === 'toc' && tocListRef.current) {
      const activeEl = tocListRef.current.querySelector(`[data-toc-id="${currentSlide}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeTab, currentSlide]);

  // Filter TOC by query
  const filteredSlides = useMemo(() => {
    if (!searchQuery.trim()) return SLIDES_REGISTRY;
    const q = normalizeVN(searchQuery);
    return SLIDES_REGISTRY.filter((s) => {
      const titleMatch = normalizeVN(s.title).includes(q);
      const sectionMatch = normalizeVN(s.section).includes(q);
      const speakerMatch = normalizeVN(s.speaker).includes(q);
      return titleMatch || sectionMatch || speakerMatch;
    });
  }, [searchQuery]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Lần đầu mở: trượt vào. Đổi giữa thu gọn <-> mở rộng: chỉ fade nhanh.
  const wasShownRef = useRef(false);
  const animKind = wasShownRef.current ? 'swap' : 'open';
  useEffect(() => {
    wasShownRef.current = isOpen && !isClosing;
  }, [isOpen, isClosing]);

  const PANEL_MIN = 260;
  const PANEL_DEFAULT = 350;
  const panelMax = () => Math.max(PANEL_MIN + 40, Math.min(680, Math.round(window.innerWidth * 0.6)));

  // Kéo để chỉnh độ rộng (chuột + cảm ứng). Kéo hẹp quá ngưỡng => tự thu gọn thành thanh mini.
  const handlePointerDownResize = (e) => {
    if (isCompact) return;
    e.preventDefault();
    const target = e.currentTarget;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {}
    const startX = e.clientX;
    const startW = panelWidth;
    document.documentElement.dataset.dragging = '1';

    const onMove = (ev) => {
      const delta = panelPos === 'right' ? startX - ev.clientX : ev.clientX - startX;
      const raw = startW + delta;
      if (raw < PANEL_MIN - 70) {
        end();
        if (onToggleCompact) onToggleCompact();
        return;
      }
      if (onResizeWidth) onResizeWidth(Math.max(PANEL_MIN, Math.min(panelMax(), raw)));
    };
    const end = () => {
      delete document.documentElement.dataset.dragging;
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerup', end);
      target.removeEventListener('pointercancel', end);
    };
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', end);
    target.addEventListener('pointercancel', end);
  };

  const handleResizeKey = (e) => {
    const step = e.shiftKey ? 48 : 16;
    const grow = panelPos === 'right' ? 'ArrowLeft' : 'ArrowRight';
    const shrink = panelPos === 'right' ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === grow) {
      e.preventDefault();
      e.stopPropagation();
      onResizeWidth && onResizeWidth(Math.min(panelMax(), panelWidth + step));
    } else if (e.key === shrink) {
      e.preventDefault();
      e.stopPropagation();
      onResizeWidth && onResizeWidth(Math.max(PANEL_MIN, panelWidth - step));
    } else if (e.key === 'Home') {
      e.preventDefault();
      onResizeWidth && onResizeWidth(PANEL_DEFAULT);
    }
  };

  if (!isOpen) return null;

  // COMPACT MINI RAIL MODE
  if (isCompact && layoutMode === 'canvas') {
    return (
      <aside
        key="compact"
        data-panel
        data-state={isClosing ? 'closing' : 'open'}
        data-anim={animKind}
        role="complementary"
        aria-label="Thanh điều khiển thu gọn"
        className="h-full bg-[#081724]/95 border-l border-[#1E3A4D] flex flex-col items-center py-3 text-[#F8FAFC] select-none relative backdrop-blur-md z-30"
        style={{ width: '60px' }}
      >
        {/* Expand button */}
        <button
          onClick={onToggleCompact}
          title="Mở rộng bảng điều khiển"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0D2234] hover:bg-[#143245] text-[#54D7E8] border border-[#1E3A4D] mb-4 transition-all active:scale-95"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Tab icons */}
        <div className="flex flex-col gap-3 items-center flex-1">
          <button
            onClick={() => {
              onSelectTab('notes');
              onToggleCompact && onToggleCompact();
            }}
            title="Kịch bản thuyết trình (N)"
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all active:scale-95 ${
              activeTab === 'notes'
                ? 'bg-[#54D7E8]/20 border-[#54D7E8] text-[#54D7E8]'
                : 'bg-[#0D2234] border-[#1E3A4D] text-[#94A3B8] hover:text-white'
            }`}
          >
            <BookOpen size={18} />
          </button>

          <button
            onClick={() => {
              onSelectTab('toc');
              onToggleCompact && onToggleCompact();
            }}
            title="Mục lục bài giảng (G)"
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all active:scale-95 ${
              activeTab === 'toc'
                ? 'bg-[#54D7E8]/20 border-[#54D7E8] text-[#54D7E8]'
                : 'bg-[#0D2234] border-[#1E3A4D] text-[#94A3B8] hover:text-white'
            }`}
          >
            <List size={18} />
          </button>

          <button
            onClick={() => {
              onSelectTab('settings');
              onToggleCompact && onToggleCompact();
            }}
            title="Cài đặt & Công cụ"
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all active:scale-95 ${
              activeTab === 'settings'
                ? 'bg-[#54D7E8]/20 border-[#54D7E8] text-[#54D7E8]'
                : 'bg-[#0D2234] border-[#1E3A4D] text-[#94A3B8] hover:text-white'
            }`}
          >
            <Settings size={18} />
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          title="Đóng bảng (Esc)"
          className="w-10 h-10 flex items-center justify-center rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#0D2234] transition-all"
        >
          <X size={18} />
        </button>
      </aside>
    );
  }

  // EXPANDED / NORMAL MODE
  return (
    <aside
      key="full"
      data-panel
      data-state={isClosing ? 'closing' : 'open'}
      data-anim={animKind}
      role="complementary"
      aria-label="Kịch bản và mục lục"
      className="h-full bg-[#081724]/95 border-l border-[#1E3A4D] flex flex-col text-[#F8FAFC] select-none relative backdrop-blur-md z-30"
      style={{
        width: layoutMode === 'canvas' ? `${panelWidth}px` : '100%',
      }}
    >
      {/* Mobile / Tablet Sheet Drag Handle and Level Chips */}
      {layoutMode === 'reflow' && (
        <div className="pt-2 pb-1.5 px-3 bg-[#050E17]/95 border-b border-[#1E3A4D] flex flex-col items-center gap-1 shrink-0">
          <div
            onClick={() => {
              if (onChangeSheetLevel) {
                onChangeSheetLevel(
                  sheetLevel === 'peek' ? 'half' : sheetLevel === 'half' ? 'full' : 'peek'
                );
              }
            }}
            className="w-12 h-1 rounded-full bg-[#54D7E8]/40 hover:bg-[#54D7E8] transition-colors cursor-pointer"
            title="Chạm để chuyển độ cao sheet"
          />
          <div className="flex items-center justify-between w-full text-xs">
            <span className="text-[#94A3B8] font-medium text-[11px]">Độ cao kịch bản:</span>
            <div className="flex items-center gap-1">
              {[
                { id: 'peek', label: 'Thu nhỏ' },
                { id: 'half', label: 'Nửa' },
                { id: 'full', label: 'Đầy' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => onChangeSheetLevel && onChangeSheetLevel(lvl.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    sheetLevel === lvl.id
                      ? 'bg-[#54D7E8]/20 text-[#54D7E8] border border-[#54D7E8]/50'
                      : 'text-[#94A3B8] hover:text-white bg-[#0D2234]'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Resize Drag Bar: kéo, nhấp đúp để về mặc định, phím mũi tên để tinh chỉnh */}
      {layoutMode === 'canvas' && (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Độ rộng bảng điều khiển"
          aria-valuemin={PANEL_MIN}
          aria-valuemax={panelMax()}
          aria-valuenow={panelWidth}
          tabIndex={0}
          onPointerDown={handlePointerDownResize}
          onDoubleClick={() => onResizeWidth && onResizeWidth(PANEL_DEFAULT)}
          onKeyDown={handleResizeKey}
          title="Kéo để chỉnh độ rộng · Nhấp đúp để đặt lại · Kéo hẹp hết cỡ để thu gọn"
          className={`group absolute top-0 bottom-0 w-3 z-40 cursor-col-resize touch-none flex items-center justify-center ${
            panelPos === 'right' ? 'left-0' : 'right-0'
          }`}
        >
          <span className="h-10 w-[3px] rounded-full bg-[#54D7E8]/25 group-hover:bg-[#54D7E8] group-focus-visible:bg-[#54D7E8] group-active:bg-[#D8F36A] transition-colors" />
        </div>
      )}

      {/* Panel Header & Tabs */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1E3A4D] bg-[#050E17]/85 shrink-0">
        <div role="tablist" className="flex items-center gap-1">
          <button
            role="tab"
            aria-selected={activeTab === 'notes'}
            onClick={() => onSelectTab('notes')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'notes'
                ? 'bg-[#54D7E8]/15 text-[#54D7E8] border border-[#54D7E8]/40 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0D2234]'
            }`}
          >
            <BookOpen size={14} />
            <span>Kịch bản</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'toc'}
            onClick={() => onSelectTab('toc')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'toc'
                ? 'bg-[#54D7E8]/15 text-[#54D7E8] border border-[#54D7E8]/40 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0D2234]'
            }`}
          >
            <List size={14} />
            <span>Mục lục</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'settings'}
            onClick={() => onSelectTab('settings')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-[#54D7E8]/15 text-[#54D7E8] border border-[#54D7E8]/40 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0D2234]'
            }`}
          >
            <Settings size={14} />
            <span>Cài đặt</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {layoutMode === 'canvas' && onToggleCompact && (
            <button
              onClick={onToggleCompact}
              aria-label="Thu gọn sidebar thành thanh mini"
              title="Thu gọn sidebar"
              className="h-7 px-2 flex items-center gap-1 rounded-lg text-xs text-[#94A3B8] hover:text-[#54D7E8] hover:bg-[#0D2234] border border-transparent hover:border-[#1E3A4D] transition-colors"
            >
              <ChevronRight size={14} />
              <span className="hidden sm:inline text-[11px]">Thu gọn</span>
            </button>
          )}

          <button
            onClick={onClose}
            aria-label="Đóng panel (Esc)"
            title="Đóng panel (Esc)"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0D2234] transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: KỊCH BẢN (NOTES) - STREAMLINED & CLEAN */}
      {activeTab === 'notes' && (
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 text-xs custom-scrollbar">
          {/* Header Card */}
          <div className="p-3 rounded-xl bg-[#091B2A] border border-[#1E3A4D] space-y-1.5">
            <div className="flex items-center justify-between">
              <span
                className="font-mono font-bold px-2 py-0.5 rounded text-[11px]"
                style={{
                  color: currentMeta.sectionColor || '#54D7E8',
                  backgroundColor: `${currentMeta.sectionColor || '#54D7E8'}18`,
                }}
              >
                Slide {currentMeta.num || currentSlide} / {TOTAL_SLIDES}
              </span>
              <div className="flex items-center gap-1 text-[#94A3B8] font-mono text-[11px]">
                <Clock size={11} className="text-[#54D7E8]" />
                <span>{currentNote.duration || '40–60s'}</span>
              </div>
            </div>

            <div className="text-sm font-bold text-white leading-snug">
              {currentNote.title || currentMeta.title}
            </div>

            <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#94A3B8] border-t border-[#1E3A4D]/60">
              <User size={12} className="text-[#D8F36A]" />
              <span className="text-[#D8F36A] font-semibold">{currentNote.speaker || 'Thành viên'}</span>
              <span className="text-[#6E8A9E]">•</span>
              <span className="truncate">{currentNote.section || currentMeta.section}</span>
            </div>
          </div>

          {/* Key points */}
          {currentNote.keyPoints && currentNote.keyPoints.length > 0 && (
            <div className="p-3 rounded-xl bg-[#0D2234]/70 border border-[#1E3A4D] space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#54D7E8] flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#54D7E8]" />
                Ý chính cần nêu ({currentNote.keyPoints.length})
              </div>
              <ul className="space-y-1">
                {currentNote.keyPoints.map((kp, idx) => (
                  <li key={idx} className="text-[12px] text-[#DCE6F0] flex items-start gap-2 leading-relaxed">
                    <span className="text-[#54D7E8] font-mono shrink-0 mt-0.5">•</span>
                    <span>{kp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Safety: Do NOT say (Hộp đỏ tinh giản) */}
          {currentNote.safetyDoNotSay && (
            <div className="p-2.5 rounded-xl bg-[#F06B70]/10 border border-[#F06B70]/30 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F06B70]">
                <AlertTriangle size={13} />
                <span>LƯU Ý: KHÔNG NÓI SAI KIẾN THỨC</span>
              </div>
              <div className="text-[11.5px] text-[#F8C4C6] leading-relaxed">
                {currentNote.safetyDoNotSay}
              </div>
            </div>
          )}

          {/* Script (Lời nói mẫu) with Font Sizing & Quick Copy */}
          {currentNote.script && (
            <div className="p-3 rounded-xl bg-[#071624] border border-[#1E3A4D] space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsScriptExpanded(!isScriptExpanded)}
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#D8F36A]"
                >
                  {isScriptExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  <span>Lời nói mẫu</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setScriptFontSize((s) => Math.max(12, s - 1))}
                    title="Giảm cỡ chữ"
                    className="w-5 h-5 flex items-center justify-center rounded bg-[#0D2234] text-[10px] text-[#94A3B8] hover:text-white"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setScriptFontSize((s) => Math.min(18, s + 1))}
                    title="Tăng cỡ chữ"
                    className="w-5 h-5 flex items-center justify-center rounded bg-[#0D2234] text-[10px] text-[#94A3B8] hover:text-white"
                  >
                    A+
                  </button>
                  <button
                    onClick={handleCopyScript}
                    title="Sao chép lời nói mẫu"
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0D2234] text-[10px] text-[#54D7E8] hover:bg-[#143245]"
                  >
                    {copiedScript ? <Check size={11} /> : <Copy size={11} />}
                    <span>{copiedScript ? 'Đã copy' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {isScriptExpanded && (
                <div
                  className="text-[#DCE6F0] leading-relaxed select-text italic border-l-2 border-[#D8F36A]/50 pl-2.5 py-0.5"
                  style={{ fontSize: `${scriptFontSize}px` }}
                >
                  "{currentNote.script}"
                </div>
              )}
            </div>
          )}

          {/* Transition (Câu chuyển tiếp sang slide sau) */}
          {currentNote.transition && (
            <div
              onClick={handleCopyTransition}
              className="p-2.5 rounded-xl bg-[#54D7E8]/10 border border-[#54D7E8]/30 space-y-1 cursor-pointer hover:border-[#54D7E8]/60 transition-colors group"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-[#54D7E8]">
                <span>CÂU CHUYỂN TIẾP (BẤM ĐỂ SAO CHÉP)</span>
                <span className="flex items-center gap-1 text-[10px]">
                  {copiedTransition ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copiedTransition ? 'Đã chép' : 'Chép'}</span>
                </span>
              </div>
              <div className="text-[11.5px] font-medium text-[#F4F7FA] leading-relaxed group-hover:text-[#54D7E8]">
                "{currentNote.transition}"
              </div>
            </div>
          )}

          {/* Next Slide Preview */}
          {nextSlideMeta && (
            <button
              onClick={() => goToSlide(nextSlideMeta.id)}
              className="w-full p-2.5 rounded-xl bg-[#0D2234]/60 border border-[#1E3A4D] hover:border-[#54D7E8]/50 transition-all flex items-center justify-between group text-left"
            >
              <div className="space-y-0.5 min-w-0 pr-2">
                <div className="text-[10px] uppercase font-mono text-[#94A3B8]">
                  Tiếp theo: Slide {nextSlideMeta.num}
                </div>
                <div className="text-xs font-semibold text-white truncate group-hover:text-[#54D7E8]">
                  {nextSlideMeta.title}
                </div>
              </div>
              <ArrowRight size={13} className="text-[#94A3B8] group-hover:text-[#54D7E8] shrink-0" />
            </button>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: MỤC LỤC (TOC) */}
      {activeTab === 'toc' && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Search box */}
          <div className="px-3 py-2 border-b border-[#1E3A4D] bg-[#050E17]/60 shrink-0">
            <div className="relative flex items-center">
              <Search size={13} className="absolute left-2.5 text-[#94A3B8] pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm slide, người nói, chương..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-6 py-1.5 bg-[#0D2234] border border-[#1E3A4D] rounded-lg text-xs text-[#F8FAFC] placeholder-[#6E8A9E] focus:outline-none focus:border-[#54D7E8]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-xs text-[#94A3B8] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Slide items list */}
          <div ref={tocListRef} className="flex-1 overflow-y-auto px-2.5 py-2 space-y-1 custom-scrollbar">
            {filteredSlides.map((s) => {
              const isActive = s.id === currentSlide;
              return (
                <button
                  key={s.id}
                  data-toc-id={s.id}
                  onClick={() => goToSlide(s.id)}
                  className={`w-full text-left p-2 rounded-xl transition-all flex items-start gap-2 border ${
                    isActive
                      ? 'bg-[#54D7E8]/15 border-[#54D7E8]/60 shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-[#0D2234]/70 hover:border-[#1E3A4D]'
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      isActive ? 'bg-[#54D7E8] text-[#050E17]' : 'bg-[#0D2234] text-[#94A3B8]'
                    }`}
                  >
                    {s.num}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-xs font-semibold truncate ${
                        isActive ? 'text-[#54D7E8]' : 'text-white'
                      }`}
                    >
                      {s.title}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] mt-0.5">
                      <span className="truncate">{s.speaker?.split('(')[0] || 'Nhóm'}</span>
                      <span className="text-[#6E8A9E]">•</span>
                      <span className="font-mono">{s.duration}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: CÀI ĐẶT & CÔNG CỤ (SETTINGS & TOOLS) */}
      {activeTab === 'settings' && (
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4 text-xs custom-scrollbar">
          {/* Quick Presenter Tools (Moved from bottom dock) */}
          <div className="space-y-2">
            <div className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#54D7E8]" />
              <span>Công cụ trình chiếu</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0D2234]/60 border border-[#1E3A4D] space-y-3">
              {/* Presentation Timer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={15} className={isTimerRunning ? 'text-[#54D7E8] animate-pulse' : 'text-[#94A3B8]'} />
                  <div>
                    <div className="font-bold text-white">Đồng hồ bài giảng</div>
                    <div className="font-mono text-xs text-[#54D7E8]">{formatTime(elapsedTime)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onToggleTimer}
                    className="px-2.5 py-1 rounded-lg bg-[#091B2A] border border-[#1E3A4D] hover:border-[#54D7E8]/40 text-xs text-[#DCE6F0] flex items-center gap-1"
                  >
                    {isTimerRunning ? <Pause size={12} /> : <Play size={12} />}
                    <span>{isTimerRunning ? 'Tạm dừng' : 'Chạy'}</span>
                  </button>
                  <button
                    onClick={onResetTimer}
                    title="Đặt lại đồng hồ"
                    className="p-1 rounded-lg bg-[#091B2A] border border-[#1E3A4D] text-[#94A3B8] hover:text-white"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>

              {/* Laser Pointer / Spotlight */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1E3A4D]">
                <div className="flex items-center gap-2">
                  <Crosshair size={15} className={laserMode ? 'text-[#FF4D4D]' : 'text-[#94A3B8]'} />
                  <div>
                    <div className="font-bold text-white">Con trỏ Laser (Phím L)</div>
                    <div className="text-[11px] text-[#94A3B8]">Chấm laser ảo hỗ trợ chỉ dẫn</div>
                  </div>
                </div>
                <button
                  onClick={toggleLaser}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    laserMode === 'laser'
                      ? 'bg-[#FF3333]/20 border-[#FF3333] text-[#FF4D4D]'
                      : 'bg-[#091B2A] border-[#1E3A4D] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {laserMode === 'laser' ? 'Đang bật' : 'Bật laser'}
                </button>
              </div>

              {/* Replay Scene */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1E3A4D]">
                <div className="flex items-center gap-2">
                  <RotateCcw size={15} className="text-[#D8F36A]" />
                  <div>
                    <div className="font-bold text-white">Phát lại hoạt cảnh (Phím R)</div>
                    <div className="text-[11px] text-[#94A3B8]">Khởi động lại hiệu ứng slide</div>
                  </div>
                </div>
                <button
                  onClick={onReplay}
                  className="px-2.5 py-1 rounded-lg bg-[#091B2A] border border-[#1E3A4D] hover:border-[#D8F36A]/40 text-xs text-[#D8F36A]"
                >
                  Phát lại
                </button>
              </div>
            </div>
          </div>

          {/* Motion Mode */}
          <div className="space-y-2 pt-1 border-t border-[#1E3A4D]">
            <div className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#D8F36A]" />
              <span>Chế độ chuyển động</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'cinematic', label: 'Điện ảnh', desc: 'Đầy đủ hiệu ứng' },
                { id: 'balanced', label: 'Cân bằng', desc: 'Tiết kiệm CPU' },
                { id: 'reduced', label: 'Tối giản', desc: 'Chỉ mờ dần' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => onChangeMotionMode && onChangeMotionMode(m.id)}
                  className={`p-2 rounded-xl border text-left flex flex-col gap-0.5 transition-all ${
                    motionMode === m.id
                      ? 'bg-[#54D7E8]/15 border-[#54D7E8] text-[#54D7E8]'
                      : 'bg-[#0D2234]/60 border-[#1E3A4D] text-[#94A3B8] hover:border-[#54D7E8]/40'
                  }`}
                >
                  <span className="font-bold text-xs">{m.label}</span>
                  <span className="text-[10px] opacity-80 leading-tight">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Audio Controls */}
          <div className="space-y-2 pt-1 border-t border-[#1E3A4D]">
            <div className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Volume2 size={13} className="text-[#54D7E8]" />
              <span>Âm thanh & SFX</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0D2234]/60 border border-[#1E3A4D] space-y-2.5">
              <div className="flex items-center justify-between">
                <span>Âm thanh bài giảng</span>
                <button
                  onClick={onToggleMute}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    isMuted
                      ? 'bg-[#F06B70]/20 text-[#F06B70] border border-[#F06B70]/40'
                      : 'bg-[#54D7E8]/20 text-[#54D7E8] border border-[#54D7E8]/40'
                  }`}
                >
                  {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  <span>{isMuted ? 'Đang tắt' : 'Đang bật'}</span>
                </button>
              </div>

              {!isMuted && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#94A3B8]">
                    <span>Âm lượng</span>
                    <span className="font-mono">{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => onChangeVolume && onChangeVolume(parseFloat(e.target.value))}
                    className="w-full accent-[#54D7E8] h-1.5 bg-[#050E17] rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Panel Position Toggle (Desktop) */}
          {layoutMode === 'canvas' && (
            <div className="space-y-2 pt-1 border-t border-[#1E3A4D]">
              <div className="font-bold text-white uppercase tracking-wider text-[11px]">
                Vị trí Side Panel
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onTogglePanelPos && onTogglePanelPos('left')}
                  className={`flex-1 py-1.5 rounded-lg border font-medium ${
                    panelPos === 'left'
                      ? 'bg-[#54D7E8]/15 border-[#54D7E8] text-[#54D7E8]'
                      : 'bg-[#0D2234]/60 border-[#1E3A4D] text-[#94A3B8]'
                  }`}
                >
                  Ghim bên Trái
                </button>
                <button
                  onClick={() => onTogglePanelPos && onTogglePanelPos('right')}
                  className={`flex-1 py-1.5 rounded-lg border font-medium ${
                    panelPos === 'right'
                      ? 'bg-[#54D7E8]/15 border-[#54D7E8] text-[#54D7E8]'
                      : 'bg-[#0D2234]/60 border-[#1E3A4D] text-[#94A3B8]'
                  }`}
                >
                  Ghim bên Phải
                </button>
              </div>
            </div>
          )}

          {/* Quick Presenter Mode */}
          <div className="pt-2 border-t border-[#1E3A4D]">
            <button
              onClick={onTogglePresent}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#54D7E8] to-[#38BDF8] text-[#050E17] font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
            >
              <Maximize2 size={14} />
              <span>Chế độ Trình chiếu toàn màn hình (P / F)</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
