import { useState, useEffect, useRef, useCallback } from 'react';

const BASE_W = 1280;
const BASE_H = 720;

/**
 * Chọn chế độ hiển thị từ kích thước CỬA SỔ (không phải Stage) để mở/đóng sidebar
 * không làm chế độ nhảy qua lại.
 *  - canvas: ngang/vuông  -> canvas 16:9 thu phóng (WYSIWYG như máy tính)
 *  - reflow: dọc/hẹp      -> cột đơn cuộn dọc
 * Có "vùng đệm" 0.95–1.05 (hysteresis): ở vùng này giữ nguyên chế độ cũ để không chớp khi kéo cửa sổ.
 */
export function decideLayoutMode(winW, winH, prevMode = 'canvas') {
  if (!winW || !winH) return prevMode;
  if (winW < 480) return 'reflow'; // quá hẹp để dựng canvas mà vẫn đọc được
  const ratio = winW / winH;
  if (ratio >= 1.05) return 'canvas';
  if (ratio <= 0.95) return 'reflow';
  return prevMode;
}

/** phone: cạnh ngắn < 600 · tablet: cảm ứng, cạnh ngắn < 1100 · còn lại desktop */
export function classifyDevice(winW, winH, isCoarse = false) {
  const short = Math.min(winW, winH);
  if (short < 600) return 'phone';
  if (isCoarse && short < 1100) return 'tablet';
  return 'desktop';
}

const readViewport = () => {
  if (typeof window === 'undefined') return { w: BASE_W, h: BASE_H, coarse: false };
  let coarse = false;
  try {
    coarse = window.matchMedia('(pointer: coarse)').matches;
  } catch {}
  return { w: window.innerWidth, h: window.innerHeight, coarse };
};

const buildInfo = (stageW, stageH, prevMode) => {
  const vp = readViewport();
  const mode = decideLayoutMode(vp.w, vp.h, prevMode);
  const device = classifyDevice(vp.w, vp.h, vp.coarse);
  return {
    layoutMode: mode,
    device,
    orientation: vp.h > vp.w ? 'portrait' : 'landscape',
    isTouch: vp.coarse,
    isPhone: Math.min(vp.w, vp.h) < 600,
    viewportWidth: vp.w,
    viewportHeight: vp.h,
    stageWidth: stageW,
    stageHeight: stageH,
    scale: Math.max(0.2, Math.min(stageW / BASE_W, stageH / BASE_H, 3)),
  };
};

const sameInfo = (a, b) =>
  a.layoutMode === b.layoutMode &&
  a.device === b.device &&
  a.orientation === b.orientation &&
  a.isTouch === b.isTouch &&
  a.viewportWidth === b.viewportWidth &&
  a.viewportHeight === b.viewportHeight &&
  Math.abs(a.stageWidth - b.stageWidth) < 0.5 &&
  Math.abs(a.stageHeight - b.stageHeight) < 0.5;

/**
 * useLayoutMode (GEMINI_FULL_SPEC_ACID_V4 §10.2, bản 2)
 * - Đo Stage bằng ResizeObserver (kích thước dùng để scale), nhưng QUYẾT ĐỊNH chế độ theo cửa sổ + hysteresis.
 * - Gom mọi sự kiện (resize / orientationchange / visualViewport) vào một lần đo mỗi frame.
 * - Xoay màn hình: iOS/Android báo kích thước cũ ngay lúc `orientationchange`, nên đo lại sau 120ms và 360ms.
 * - Trả thêm device / orientation / isTouch để CSS và component chọn bố cục phù hợp.
 */
export function useLayoutMode() {
  const stageRef = useRef(null);
  const modeRef = useRef('canvas');
  const [info, setInfo] = useState(() => {
    const vp = readViewport();
    const init = buildInfo(vp.w, vp.h, decideLayoutMode(vp.w, vp.h, 'canvas'));
    modeRef.current = init.layoutMode;
    return init;
  });

  const measure = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const next = buildInfo(rect.width, rect.height, modeRef.current);
    modeRef.current = next.layoutMode;
    setInfo((prev) => (sameInfo(prev, next) ? prev : next));
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;

    let raf = 0;
    const timers = new Set();
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    const scheduleSettled = () => {
      schedule();
      [120, 360].forEach((ms) => {
        const t = setTimeout(() => {
          timers.delete(t);
          measure();
        }, ms);
        timers.add(t);
      });
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(el);
    measure();

    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', scheduleSettled);
    const vv = window.visualViewport;
    if (vv) vv.addEventListener('resize', schedule);
    let mq = null;
    try {
      mq = window.matchMedia('(pointer: coarse)');
      mq.addEventListener('change', schedule);
    } catch {}

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', scheduleSettled);
      if (vv) vv.removeEventListener('resize', schedule);
      if (mq) mq.removeEventListener('change', schedule);
    };
  }, [measure]);

  return {
    stageRef,
    layoutMode: info.layoutMode,
    device: info.device,
    orientation: info.orientation,
    isTouch: info.isTouch,
    isPhone: info.isPhone,
    viewportWidth: info.viewportWidth,
    viewportHeight: info.viewportHeight,
    stageWidth: info.stageWidth,
    stageHeight: info.stageHeight,
    scale: info.scale,
  };
}
