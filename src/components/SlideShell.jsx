import React, { useRef } from 'react';

/**
 * SlideShell: Dual-Mode Presentation Canvas Frame
 * - Wraps slide content with balanced atmospheric padding and touch gesture recognition.
 * - In-flow dock architecture completely removes hardcoded pb-28/pb-32 dead padding (T12).
 */
export default function SlideShell({
  children,
  currentSlide = 1,
  totalSlides = 21,
  fontScale = 1,
  reducedMotion = false,
  slideDirection = 'next',
  onPrev,
  onNext,
  className = '',
}) {
  const shellRef = useRef(null);
  const touchStateRef = useRef({
    startX: 0,
    startY: 0,
    time: 0,
    isDragging: false,
    lockedHorizontal: false,
  });

  const handleTouchStart = (e) => {
    if (e.touches.length !== 1 || reducedMotion) return;
    if (e.target.closest('[role="dialog"]') || e.target.closest('[role="complementary"]')) return;
    if (e.target.closest('button, input, select, textarea, [role="slider"], [role="spinbutton"], [data-no-swipe]')) return;

    touchStateRef.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      time: Date.now(),
      isDragging: false,
      lockedHorizontal: false,
    };
  };

  const handleTouchMove = (e) => {
    const st = touchStateRef.current;
    if (!st.time || e.touches.length !== 1 || reducedMotion) return;

    const curX = e.touches[0].clientX;
    const curY = e.touches[0].clientY;
    const dx = curX - st.startX;
    const dy = curY - st.startY;

    // Lock intent §11.5: only if moved >= 10px and |dx| > |dy| * 1.4
    if (!st.lockedHorizontal) {
      if (Math.abs(dx) >= 10) {
        if (Math.abs(dx) > Math.abs(dy) * 1.4) {
          st.lockedHorizontal = true;
          st.isDragging = true;
        } else {
          st.time = 0;
          return;
        }
      } else {
        return;
      }
    }

    if (st.isDragging && shellRef.current) {
      let effectiveDx = dx;
      if ((currentSlide === 1 && dx > 0) || (currentSlide === totalSlides && dx < 0)) {
        effectiveDx = dx * 0.28;
      }
      shellRef.current.style.transform = `translate3d(${effectiveDx}px, 0, 0)`;
      shellRef.current.style.opacity = `${Math.max(0.4, 1 - Math.abs(effectiveDx) / (window.innerWidth * 1.2))}`;
      shellRef.current.style.transition = 'none';
    }
  };

  const handleTouchEnd = (e) => {
    const st = touchStateRef.current;
    if (!st.time) return;

    const el = shellRef.current;
    const dx = e.changedTouches[0].clientX - st.startX;
    const dt = Math.max(1, Date.now() - st.time);
    const velocity = Math.abs(dx) / dt;
    const width = el ? el.offsetWidth : window.innerWidth;

    const isSwipeRight = dx > 0;
    const isSwipeLeft = dx < 0;
    const passedThreshold = Math.abs(dx) > width * 0.22 || velocity > 0.45;

    if (st.isDragging && el) {
      el.style.transition = 'transform 240ms cubic-bezier(.16, 1, .3, 1), opacity 240ms cubic-bezier(.16, 1, .3, 1)';

      if (passedThreshold) {
        if (isSwipeLeft && currentSlide < totalSlides && onNext) {
          el.style.transform = `translate3d(-80px, 0, 0)`;
          el.style.opacity = '0';
          setTimeout(() => {
            if (el) {
              el.style.transform = '';
              el.style.opacity = '';
              el.style.transition = '';
            }
            onNext();
          }, 140);
          touchStateRef.current.time = 0;
          return;
        }
        if (isSwipeRight && currentSlide > 1 && onPrev) {
          el.style.transform = `translate3d(80px, 0, 0)`;
          el.style.opacity = '0';
          setTimeout(() => {
            if (el) {
              el.style.transform = '';
              el.style.opacity = '';
              el.style.transition = '';
            }
            onPrev();
          }, 140);
          touchStateRef.current.time = 0;
          return;
        }
      }

      // Spring back to 0
      el.style.transform = 'translate3d(0, 0, 0)';
      el.style.opacity = '1';
      setTimeout(() => {
        if (el) {
          el.style.transform = '';
          el.style.opacity = '';
          el.style.transition = '';
        }
      }, 250);
    }

    touchStateRef.current.time = 0;
  };

  const isVideoSlide = currentSlide === 2;

  return (
    <div
      ref={shellRef}
      data-slide-shell
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={`w-full min-h-full flex-1 flex flex-col justify-between relative transform-gpu touch-pan-y ${
        isVideoSlide
          ? 'overflow-hidden p-0'
          : 'px-3 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 md:py-5'
      } ${className}`}
      style={{
        fontSize: `${fontScale * 100}%`,
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </div>
  );
}
