import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import SlideActiveContext from './SlideActiveContext';

const EASING_ENTER = 'cubic-bezier(.16, 1, .3, 1)'; // expo-out: lướt êm, hãm phanh mượt
const EASING_EXIT = 'cubic-bezier(.35, 0, .25, 1)'; // thoát tự nhiên, nhường chỗ lập tức

const pauseSvgs = (el) => {
  if (!el || el.dataset.paused === '1') return;
  el.dataset.paused = '1';
  el.setAttribute('inert', ''); // slide ẩn: không nhận focus/click
  el.querySelectorAll('svg').forEach((svg) => {
    try {
      svg.pauseAnimations();
    } catch {}
  });
};
const resumeSvgs = (el) => {
  if (!el) return;
  delete el.dataset.paused;
  el.removeAttribute('inert');
  el.querySelectorAll('svg').forEach((svg) => {
    try {
      svg.unpauseAnimations();
    } catch {}
  });
};

export default function SlideTransitioner({
  currentSlide,
  slideDirection = 'next',
  reducedMotion = false,
  isHero = false,
  isDirect = false,
  layoutMode = 'canvas',
  warmTargets = [], // [{ id, node }] slide kề bên để dựng sẵn
  children,
}) {
  const [layers, setLayers] = useState([
    {
      id: currentSlide,
      key: `slide-${currentSlide}`,
      children,
    },
  ]);

  const currentLayerRef = useRef(null);
  const prevLayerRef = useRef(null);
  const sweepRef = useRef(null);
  const activeAnimsRef = useRef([]);
  const startedKeyRef = useRef('');
  const lastSlideRef = useRef(currentSlide);

  // Slide kề bên đã dựng sẵn (ẩn). Dùng chung key với layer thật => khi chuyển, React tái sử dụng đúng DOM đó.
  const [warm, setWarm] = useState([]);
  const warmRef = useRef(warmTargets);
  warmRef.current = warmTargets;
  const warmKey = warmTargets.map((t) => t.id).join(',');

  // Chỉ dựng sẵn khi đã đứng yên (không đang chuyển cảnh) và máy rảnh, để không tranh CPU với animation.
  useEffect(() => {
    if (layoutMode !== 'canvas') {
      setWarm((w) => (w.length ? [] : w));
      return undefined;
    }
    if (layers.length !== 1) return undefined;
    let idleHandle = null;
    const run = () => setWarm(warmRef.current);
    const t = setTimeout(() => {
      if (typeof window.requestIdleCallback === 'function') {
        idleHandle = window.requestIdleCallback(run, { timeout: 1500 });
      } else {
        run();
      }
    }, 450);
    return () => {
      clearTimeout(t);
      if (idleHandle && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleHandle);
    };
  }, [layers.length, currentSlide, layoutMode, warmKey]);

  const getPreset = useCallback(() => {
    if (reducedMotion) return 'reduced';
    if (isHero) return 'hero';
    if (isDirect) return 'fade-through';
    return 'slide';
  }, [reducedMotion, isHero, isDirect]);

  const finishActive = () => {
    activeAnimsRef.current.forEach((a) => {
      try {
        a.onfinish = null;
        a.finish();
      } catch {}
    });
    activeAnimsRef.current = [];
    startedKeyRef.current = '';
  };

  useLayoutEffect(() => {
    if (lastSlideRef.current === currentSlide) {
      // Cùng slide: chỉ cập nhật children cho layer duy nhất
      setLayers((prev) => {
        if (prev.length === 1 && prev[0].id === currentSlide) {
          if (prev[0].children === children) return prev;
          return [{ id: currentSlide, key: `slide-${currentSlide}`, children }];
        }
        return prev;
      });
      return;
    }

    // Chốt trạng thái cuối của animation đang chạy (bấm liên tục vẫn không rớt frame)
    finishActive();

    const prevSlide = lastSlideRef.current;
    lastSlideRef.current = currentSlide;

    setLayers((prevLayers) => {
      const prevChild = prevLayers[prevLayers.length - 1]?.children || children;
      return [
        { id: prevSlide, key: `slide-${prevSlide}`, children: prevChild, isExiting: true },
        { id: currentSlide, key: `slide-${currentSlide}`, children, isEntering: true },
      ];
    });
  }, [currentSlide, children]);

  // QUAN TRỌNG: useLayoutEffect để animation bắt đầu trước khi trình duyệt paint
  useLayoutEffect(() => {
    if (layers.length < 2) {
      startedKeyRef.current = '';
      return;
    }

    const pairKey = `${layers[0].key}>${layers[1].key}`;
    if (startedKeyRef.current === pairKey) return; // đã chạy rồi, đừng khởi động lại

    const prevEl = prevLayerRef.current;
    const currEl = currentLayerRef.current;

    if (!prevEl || !currEl) {
      setLayers([{ id: currentSlide, key: `slide-${currentSlide}`, children }]);
      return;
    }
    startedKeyRef.current = pairKey;

    const preset = getPreset();
    const fwd = slideDirection !== 'prev';
    const dir = fwd ? 1 : -1;

    let exitKf;
    let enterKf;
    let exitOpt;
    let enterOpt;

    switch (preset) {
      case 'hero':
        exitKf = [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(1.035)' },
        ];
        enterKf = [
          { opacity: 0, transform: 'scale(0.965)' },
          { opacity: 1, transform: 'scale(1)' },
        ];
        exitOpt = { duration: 320, easing: EASING_EXIT };
        enterOpt = { duration: 440, delay: 30, easing: EASING_ENTER };
        break;

      case 'fade-through': // nhảy cóc tới slide bất kỳ qua mục lục / phím tắt
        exitKf = [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.985)' },
        ];
        enterKf = [
          { opacity: 0, transform: 'scale(1.015)' },
          { opacity: 1, transform: 'scale(1)' },
        ];
        exitOpt = { duration: 220, easing: EASING_EXIT };
        enterOpt = { duration: 280, delay: 20, easing: EASING_ENTER };
        break;

      case 'reduced':
        exitKf = [{ opacity: 1 }, { opacity: 0 }];
        enterKf = [{ opacity: 0 }, { opacity: 1 }];
        exitOpt = { duration: 90, easing: 'linear' };
        enterOpt = { duration: 130, easing: 'linear' };
        break;

      case 'slide':
      default:
        exitKf = [
          { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
          { opacity: 0, transform: `translate3d(${-40 * dir}px, 0, 0) scale(0.988)` },
        ];
        enterKf = [
          { opacity: 0, transform: `translate3d(${48 * dir}px, 0, 0) scale(0.994)` },
          { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
        ];
        exitOpt = { duration: 280, easing: EASING_EXIT };
        enterOpt = { duration: 350, delay: 20, easing: EASING_ENTER };
        break;
    }

    try {
      currEl.style.willChange = 'transform, opacity';
      prevEl.style.willChange = 'transform, opacity';
      prevEl.classList.add('pause-animations'); // nhường GPU cho lớp mới
      currEl.classList.remove('pause-animations');
      currEl.removeAttribute('inert');
      resumeSvgs(currEl); // slide dựng sẵn: bật lại animation SVG đúng lúc vào

      const animExit = prevEl.animate(exitKf, { ...exitOpt, fill: 'both' });
      const animEnter = currEl.animate(enterKf, { ...enterOpt, fill: 'both' });
      const anims = [animExit, animEnter];

      // Vệt sáng nối hai cảnh (bỏ khi reduced motion)
      if (sweepRef.current && preset !== 'reduced') {
        const sweepDuration = preset === 'hero' ? 480 : 360;
        const sweep = sweepRef.current.animate(
          [
            { transform: `translate3d(${-120 * dir}%, 0, 0)`, opacity: 0 },
            { opacity: 0.85, offset: 0.35 },
            { opacity: 0.45, offset: 0.7 },
            { transform: `translate3d(${220 * dir}%, 0, 0)`, opacity: 0 },
          ],
          { duration: sweepDuration, easing: EASING_ENTER, fill: 'both' }
        );
        anims.push(sweep);
      }
      activeAnimsRef.current = anims;

      let finished = 0;
      const needed = 2; // chỉ đợi exit + enter
      const onDone = () => {
        finished += 1;
        if (finished < needed) return;
        currEl.style.willChange = '';
        prevEl.style.willChange = '';
        prevEl.classList.remove('pause-animations');
        activeAnimsRef.current = [];
        startedKeyRef.current = '';
        // Unmount layer cũ an toàn mà không đảo ngược trạng thái animation
        setLayers([{ id: currentSlide, key: `slide-${currentSlide}`, children }]);
      };
      animExit.onfinish = onDone;
      animEnter.onfinish = onDone;
    } catch {
      startedKeyRef.current = '';
      setLayers([{ id: currentSlide, key: `slide-${currentSlide}`, children }]);
    }
  }, [layers, currentSlide, children, slideDirection, getPreset]);

  // Reflow (điện thoại dọc): không xếp lớp tuyệt đối (lớp absolute không có chiều cao nên nội dung bị cắt).
  // Dùng CSS animation theo chiều chuyển, rẻ và mượt.
  if (layoutMode === 'reflow') {
    const cls = reducedMotion
      ? ''
      : slideDirection === 'next'
      ? 'animate-slide-enter-next'
      : slideDirection === 'prev'
      ? 'animate-slide-enter-prev'
      : 'animate-slide-enter-fade';
    return (
      <div key={currentSlide} className={`relative w-full min-h-full flex-1 flex flex-col ${cls}`}>
        {children}
      </div>
    );
  }

  // Canvas: KHÔNG overflow-hidden ở đây. FitStage tự cắt theo khung canvas và cần
  // thấy phần nội dung dài hơn 720px để thu nhỏ vừa khung.
  const layerKeys = new Set(layers.map((l) => l.key));
  const layerEls = layers.map((layer, index) => {
    const isCurrent = index === layers.length - 1;
    const ref = isCurrent ? currentLayerRef : prevLayerRef;
    return (
      <div
        key={layer.key}
        ref={ref}
        data-layer={isCurrent ? 'current' : 'exit'}
        className="w-full h-full absolute inset-0"
        style={{
          zIndex: isCurrent ? 2 : 1,
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          contain: 'layout style',
        }}
      >
        <SlideActiveContext.Provider value={true}>{layer.children}</SlideActiveContext.Provider>
      </div>
    );
  });
  const warmEls = warm
    .filter((w) => !layerKeys.has(`slide-${w.id}`))
    .map((w) => (
      <div
        key={`slide-${w.id}`}
        ref={pauseSvgs}
        data-layer="warm"
        aria-hidden="true"
        className="w-full h-full absolute inset-0 pause-animations"
        style={{ zIndex: 0, opacity: 0.001, pointerEvents: 'none', backfaceVisibility: 'hidden' }}
      >
        <SlideActiveContext.Provider value={false}>{w.node}</SlideActiveContext.Provider>
      </div>
    ));

  // MỘT mảng phẳng có key: layer warm -> layer thật được React di chuyển chứ không dựng lại
  return (
    <div className="relative w-full h-full">
      {[...layerEls, ...warmEls]}

      {/* Vệt sáng chuyển cảnh */}
      <div
        ref={sweepRef}
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-0 pointer-events-none"
        style={{
          width: '38%',
          zIndex: 5,
          opacity: 0,
          background:
            'linear-gradient(100deg, transparent 0%, rgba(84,215,232,0.10) 38%, rgba(216,243,106,0.10) 58%, transparent 100%)',
          willChange: 'transform, opacity',
        }}
      />
    </div>
  );
}
