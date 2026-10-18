import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { BASE_W, BASE_H, computeCanvasWidth, computeCanvasGeometry } from '../utils/stageGeometry';

const HINT_KEY = 'acid_rotate_hint_dismissed';

/**
 * FitStage Component (GEMINI_FULL_SPEC_ACID_V4 §10)
 * Dual presentation mode:
 * - 'canvas' (desktop/projector): canvas rộng 1280px, cao = max(720, chiều cao THẬT của slide).
 *   Scale = min(rộng/1280, cao/chiềuCaoThật) => slide dài hơn 16:9 vẫn thu nhỏ vừa khung, không bị cắt chữ.
 *   Nếu phải thu nhỏ dưới MIN_READABLE_SCALE thì giữ cỡ chữ đọc được và cho cuộn dọc.
 * - 'reflow' (mobile/narrow): Full width vertical scrollable flow
 * Includes [data-canvas] attribute for Section 15.6 verification script contract.
 */
export default function FitStage({
  children,
  layoutMode = 'canvas',
  stageWidth = BASE_W,
  stageHeight = BASE_H,
  currentSlide = 1,
  isPhone = false,
  readable = false,
  device = 'desktop',
  isTouch = false,
  className = '',
}) {
  const contentRef = useRef(null);
  const scrollRef = useRef(null);
  const [naturalHeight, setNaturalHeight] = useState(BASE_H);
  const phoneReadable = isPhone && readable;

  // Chiều rộng canvas logic: lấp đầy khung theo tỉ lệ scale theo chiều cao (không phụ thuộc chiều cao đo được => không dao động)
  const canvasW = computeCanvasWidth(stageWidth, stageHeight, phoneReadable);

  /**
   * Đo chiều cao tự nhiên của slide: tạm thu container về 0px để mọi `min-h-full`
   * co lại, đọc scrollHeight của SlideShell rồi trả lại ngay trong cùng một frame
   * (không có paint ở giữa nên không nhấp nháy).
   */
  const measure = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;

    // Đang chuyển slide (có lớp exit): bỏ qua để tránh layout thrashing / giật khung hình
    if (el.querySelector('[data-layer="exit"]')) return;

    const prevH = el.style.height;
    const prevMin = el.style.minHeight;
    el.style.minHeight = '0px';
    el.style.height = '0px';
    // Chỉ đo lớp đang hiển thị/đang vào, bỏ qua slide dựng sẵn (data-layer="warm")
    const shell =
      el.querySelector('[data-layer="current"] [data-slide-shell]') ||
      el.querySelector('[data-slide-shell]');
    const h = Math.ceil(shell ? shell.scrollHeight : el.scrollHeight);
    el.style.height = prevH;
    el.style.minHeight = prevMin;
    const next = Math.max(BASE_H, h);
    setNaturalHeight((prev) => (Math.abs(prev - next) > 2 ? next : prev));
  }, []);

  useLayoutEffect(() => {
    if (layoutMode !== 'canvas') return undefined;
    measure();

    const el = contentRef.current;
    if (!el) return undefined;

    // Nội dung đổi (React render, đổi class) hoặc ảnh/font tải xong -> gom bằng rAF để không ép reflow nhiều lần một frame.
    let moTimer = null;
    const debouncedMeasure = () => {
      cancelAnimationFrame(moTimer);
      moTimer = requestAnimationFrame(measure);
    };

    const mo = new MutationObserver(debouncedMeasure);
    mo.observe(el, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'data-layer'] });
    const onLoad = () => measure();
    el.addEventListener('load', onLoad, true);
    // Đổi cỡ cửa sổ có thể đổi breakpoint Tailwind (sm/md/lg) -> chiều cao tự nhiên đổi theo.
    let resizeTimer = null;
    const onWinResize = () => {
      document.documentElement.dataset.resizing = '1'; // tắt transition trong lúc kéo cửa sổ
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => delete document.documentElement.dataset.resizing, 180);
      measure();
    };
    window.addEventListener('resize', onWinResize);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(onLoad).catch(() => {});

    return () => {
      cancelAnimationFrame(moTimer);
      mo.disconnect();
      el.removeEventListener('load', onLoad, true);
      window.removeEventListener('resize', onWinResize);
      clearTimeout(resizeTimer);
    };
  }, [layoutMode, currentSlide, measure, canvasW]);

  // Slide mới luôn bắt đầu từ đầu trang
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [currentSlide]);

  if (layoutMode === 'reflow') {
    return (
      <ReflowStage
        currentSlide={currentSlide}
        stageWidth={stageWidth}
        stageHeight={stageHeight}
        device={device}
        isTouch={isTouch}
        className={className}
      >
        {children}
      </ReflowStage>
    );
  }

  // Canvas Mode calculation (§10.3) — hình học nằm ở utils/stageGeometry.js
  const { scale, canvasH, scaledH, needsScroll, x, y } = computeCanvasGeometry({
    stageWidth,
    stageHeight,
    canvasW,
    naturalHeight,
    phoneReadable,
  });

  return (
    <div
      ref={scrollRef}
      data-fit-scroll={needsScroll ? 'true' : 'false'}
      className={`absolute inset-0 select-none ${
        needsScroll ? 'overflow-y-auto overflow-x-hidden overscroll-contain' : 'overflow-hidden pointer-events-none'
      }`}
    >
      <div className="relative" style={{ width: `${stageWidth}px`, height: needsScroll ? `${Math.ceil(scaledH)}px` : '100%' }}>
        <div
          ref={contentRef}
          data-canvas="true"
          className={`pointer-events-auto absolute top-0 left-0 origin-top-left flex flex-col justify-between ${className}`}
          style={{
            width: `${canvasW}px`,
            minHeight: `${BASE_H}px`,
            height: `${canvasH}px`,
            overflow: 'clip',
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * ReflowStage — chế độ cột đơn cho điện thoại/tablet dọc và cửa sổ hẹp.
 *  - Slide mới luôn cuộn về đầu (bản cũ quên làm ở reflow).
 *  - Vạch tiến độ cuộn ở mép trên + vệt mờ ở mép dưới báo "còn nội dung phía dưới".
 *  - Gợi ý xoay ngang: chỉ hiện trên thiết bị cảm ứng đang dựng dọc, đóng được và nhớ trong phiên.
 *    Android Chrome có nút "Xoay ngang" (toàn màn hình + khóa hướng); iOS chỉ hiện lời nhắc.
 *  - Màn dọc rất rộng (iPad Pro, màn xoay dọc): giới hạn bề rộng nội dung để dòng chữ không quá dài.
 */
function ReflowStage({ children, className = '', currentSlide, stageWidth, stageHeight, device, isTouch }) {
  const scrollRef = useRef(null);
  const innerRef = useRef(null);
  const barRef = useRef(null);
  const fadeRef = useRef(null);
  const rafRef = useRef(0);
  const [hintDismissed, setHintDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(HINT_KEY) === '1';
    } catch {
      return false;
    }
  });

  const portrait = stageHeight >= stageWidth;
  const showHint = !hintDismissed && portrait && isTouch && device !== 'desktop';
  const canLock =
    typeof screen !== 'undefined' &&
    !!(screen.orientation && screen.orientation.lock) &&
    typeof document !== 'undefined' &&
    document.fullscreenEnabled !== false;

  const updateIndicators = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    const hasScroll = max > 1;
    const p = hasScroll ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${p})`;
      barRef.current.style.opacity = hasScroll ? '1' : '0';
    }
    if (fadeRef.current) fadeRef.current.style.opacity = hasScroll && max - el.scrollTop > 24 ? '1' : '0';
  }, []);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateIndicators);
  }, [updateIndicators]);

  // Slide mới luôn bắt đầu từ đầu trang
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    updateIndicators();
  }, [currentSlide, updateIndicators]);

  // Nội dung đổi chiều cao (ảnh/font tải xong, xoay màn hình) -> cập nhật chỉ báo
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(onScroll);
    ro.observe(inner);
    if (scrollRef.current) ro.observe(scrollRef.current);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll]);

  const dismissHint = () => {
    setHintDismissed(true);
    try {
      sessionStorage.setItem(HINT_KEY, '1');
    } catch {}
  };

  const tryLandscape = async () => {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      await screen.orientation.lock('landscape');
    } catch {}
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        data-reflow-scroll
        className="absolute inset-0 overflow-y-auto overflow-x-hidden touch-pan-y overscroll-contain z-10"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div ref={innerRef} className="w-full min-h-full flex flex-col mx-auto" style={{ maxWidth: '1100px' }}>
          {showHint && (
            <div className="w-full max-w-md mx-auto px-3 pt-2 shrink-0">
              <div
                role="note"
                className="py-1.5 pl-3 pr-1.5 rounded-full bg-[#54D7E8]/10 border border-[#54D7E8]/30 text-[#54D7E8] text-[11px] font-semibold flex items-center justify-between gap-2 shadow-sm"
              >
                <span className="flex items-center gap-1.5 min-w-0">
                  <span aria-hidden="true">📱</span>
                  <span className="truncate">Xoay ngang để xem chuẩn như máy tính</span>
                </span>
                <span className="flex items-center gap-1 shrink-0">
                  {canLock && (
                    <button
                      type="button"
                      onClick={tryLandscape}
                      className="px-2.5 h-7 rounded-full bg-[#54D7E8] text-[#050E17] font-bold active:scale-95 transition-transform"
                    >
                      Xoay ngang
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={dismissHint}
                    aria-label="Đóng gợi ý"
                    className="w-7 h-7 flex items-center justify-center rounded-full text-[#94A3B8] active:scale-90 transition-transform"
                  >
                    ✕
                  </button>
                </span>
              </div>
            </div>
          )}

          <div
            data-canvas="reflow"
            className={`w-full flex-1 px-2 sm:px-4 py-2 flex flex-col justify-start gap-3 ${className}`}
          >
            {children}
          </div>
        </div>
      </div>

      {/* Vạch tiến độ cuộn trong slide */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-20 pointer-events-none" aria-hidden="true">
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-gradient-to-r from-[#54D7E8] to-[#D8F36A]"
          style={{ transform: 'scaleX(0)', opacity: 0 }}
        />
      </div>
      {/* Vệt mờ báo còn nội dung bên dưới */}
      <div
        ref={fadeRef}
        className="absolute bottom-0 left-0 right-0 h-10 z-20 pointer-events-none transition-opacity duration-200"
        style={{ opacity: 0, background: 'linear-gradient(to top, rgba(5,14,23,0.92), rgba(5,14,23,0))' }}
        aria-hidden="true"
      />
    </div>
  );
}
