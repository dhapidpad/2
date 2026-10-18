import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';

const BASE_W = 1280;
const BASE_H = 720;
// Dưới ngưỡng này chữ sẽ quá nhỏ để đọc -> giữ cỡ chữ và cho cuộn dọc thay vì thu nhỏ thêm.
const MIN_READABLE_SCALE = 0.58;
const MAX_SCALE = 3;

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
  className = '',
}) {
  const contentRef = useRef(null);
  const scrollRef = useRef(null);
  const [naturalHeight, setNaturalHeight] = useState(BASE_H);

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
  }, [layoutMode, currentSlide, measure]);

  // Slide mới luôn bắt đầu từ đầu trang
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [currentSlide]);

  if (layoutMode === 'reflow') {
    return (
      <div
        className="w-full h-full overflow-y-auto overflow-x-hidden touch-pan-y overscroll-contain relative z-10"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="w-full min-h-full flex flex-col">
          {/* Chỉ nhắc xoay ngang khi điện thoại đang dựng dọc */}
          {stageHeight >= stageWidth && (
            <div className="w-full max-w-md mx-auto px-3 pt-2 shrink-0">
              <div className="py-1.5 px-3 rounded-full bg-[#54D7E8]/10 border border-[#54D7E8]/30 text-[#54D7E8] text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-sm">
                <span>📱 Xoay ngang màn hình để xem chuẩn như máy tính</span>
                <span className="text-[#D8F36A] font-bold">↺</span>
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
    );
  }

  // Canvas Mode calculation (§10.3)
  const effectiveH = Math.max(BASE_H, naturalHeight);
  const widthScale = stageWidth / BASE_W;
  const fitScale = Math.min(widthScale, stageHeight / effectiveH);
  // Sàn: slide chuẩn 16:9 luôn vừa khung; slide dài hơn thì co tối đa tới ngưỡng đọc được rồi mới cuộn.
  const floorScale = Math.min(widthScale, stageHeight / BASE_H, MIN_READABLE_SCALE);
  const rawScale = Math.min(MAX_SCALE, Math.max(fitScale, floorScale));
  // Round scale to multiples of 0.005 to reduce subpixel blur
  const scale = Math.max(0.2, Math.floor(rawScale / 0.005) * 0.005);

  const scaledH = effectiveH * scale;
  const needsScroll = scaledH > stageHeight + 1;

  // Integer pixel offsets for centering
  const x = Math.round((stageWidth - BASE_W * scale) / 2);
  const y = needsScroll ? 0 : Math.max(0, Math.round((stageHeight - scaledH) / 2));

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
            width: `${BASE_W}px`,
            minHeight: `${BASE_H}px`,
            height: `${effectiveH}px`,
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
