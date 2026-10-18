import { useState, useEffect, useRef, useCallback } from 'react';

const BASE_W = 1280;
const BASE_H = 720;

/**
 * useLayoutMode hook (GEMINI_FULL_SPEC_ACID_V4 §10.2)
 * Automatically detects 'canvas' (16:9 WYSIWYG) vs 'reflow' (mobile/narrow)
 * based on ResizeObserver on the Stage DOM node rather than window.
 * Listens to transitionend and window resize events to guarantee terminal sync.
 */
export function useLayoutMode() {
  const stageRef = useRef(null);
  const [layoutMode, setLayoutMode] = useState('canvas');
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : BASE_W,
    height: typeof window !== 'undefined' ? window.innerHeight : BASE_H,
    scale: 1,
  });

  const checkLayout = useCallback((width, height) => {
    if (!width || !height) return;
    const ratio = width / height;
    const computedScale = Math.min(width / BASE_W, height / BASE_H, 3);
    
    // Canvas condition:
    // Landscape orientation (including mobile rotated horizontally, tablet landscape, desktop/projector):
    // Whenever ratio >= 1.15 or (width > height), it scales the 16:9 canvas cleanly just like a PC.
    // Portrait mobile / narrow view (ratio < 1.15) uses reflow mode.
    const winW = typeof window !== 'undefined' ? window.innerWidth : width;
    const winH = typeof window !== 'undefined' ? window.innerHeight : height;
    const isLandscape = ratio >= 1.15 || (winW > winH && winW >= 480);
    const isDesktopViewport = winW >= 960 && winH >= 560;

    const isCanvas = isLandscape || (isDesktopViewport && computedScale >= 0.45);
    const mode = isCanvas ? 'canvas' : 'reflow';

    setLayoutMode((prev) => (prev !== mode ? mode : prev));
    setDimensions({
      width,
      height,
      scale: Math.max(0.2, computedScale),
    });
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateFromRect = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width && rect.height) {
        checkLayout(rect.width, rect.height);
      }
    };

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        checkLayout(cr.width, cr.height);
      }
    });

    observer.observe(el);
    updateFromRect();

    // Listen to window and transition events to ensure settled state is recorded
    window.addEventListener('resize', updateFromRect);
    window.addEventListener('orientationchange', updateFromRect);
    window.addEventListener('transitionend', updateFromRect);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateFromRect);
      window.removeEventListener('orientationchange', updateFromRect);
      window.removeEventListener('transitionend', updateFromRect);
    };
  }, [checkLayout]);

  return {
    stageRef,
    layoutMode,
    stageWidth: dimensions.width,
    stageHeight: dimensions.height,
    scale: dimensions.scale,
  };
}
