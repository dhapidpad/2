import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import FitStage from './components/FitStage';
import SlideTransitioner from './components/SlideTransitioner';
import SlideShell from './components/SlideShell';
import SidePanel from './components/SidePanel';
import Dock from './components/Dock';
import MiniRail from './components/MiniRail';
import SvgDefs from './svg/SvgDefs';
import { useLayoutMode } from './hooks/useLayoutMode';
import { SLIDES_REGISTRY, TOTAL_SLIDES, getSlideById } from './config/slides';
import { sfx } from './audio/sfx';
import { cin } from './audio/cinematicAudio';

export default function App() {
  // Read initial slide from URL hash (#5) or localStorage
  const [currentSlide, setCurrentSlide] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      const parsed = parseInt(hash, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= TOTAL_SLIDES) {
        return parsed;
      }
      try {
        const saved = localStorage.getItem('acid_current_slide');
        const s = parseInt(saved, 10);
        // Avoid auto-resuming on slide 2 (intro audio gesture constraint §12.9)
        if (!isNaN(s) && s >= 1 && s <= TOTAL_SLIDES && s !== 2) {
          return s;
        }
      } catch {}
    }
    return 1;
  });

  const [slideDirection, setSlideDirection] = useState('next');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isPanelCompact, setIsPanelCompact] = useState(() => {
    try {
      return localStorage.getItem('acid_panel_compact') === '1';
    } catch {
      return false;
    }
  });
  // Giữ panel "đang hiển thị" thêm một nhịp sau khi đóng để chạy animation trượt ra
  const [panelRendered, setPanelRendered] = useState(false);
  const [panelTab, setPanelTab] = useState('notes'); // 'notes' | 'settings'
  const [panelWidth, setPanelWidth] = useState(() => {
    try {
      const savedW = localStorage.getItem('acid_panel_width');
      return savedW ? parseInt(savedW, 10) : 280;
    } catch {
      return 280;
    }
  });
  const [panelPos, setPanelPos] = useState(() => {
    try {
      return localStorage.getItem('acid_panel_pos') || 'right';
    } catch {
      return 'right';
    }
  });

  const [isPresentMode, setIsPresentMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHoverBottom, setIsHoverBottom] = useState(false);
  const [blackoutScreen, setBlackoutScreen] = useState(null); // null | 'black' | 'white'
  const [laserMode, setLaserMode] = useState(null); // null | 'laser' | 'spotlight'
  const [replayKey, setReplayKey] = useState(0);

  // Stopwatch state (§12.3)
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const [motionMode, setMotionMode] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return 'reduced';
      }
    }
    return 'cinematic'; // 'cinematic' | 'balanced' | 'reduced'
  });

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [sheetLevel, setSheetLevel] = useState('peek'); // 'peek' | 'half' | 'full'
  const [railOpen, setRailOpen] = useState(() => {
    try {
      return localStorage.getItem('acid_rail_open') !== '0';
    } catch {
      return true;
    }
  });
  const [fitMode, setFitMode] = useState(() => {
    try {
      return localStorage.getItem('acid_fit_mode') || 'readable';
    } catch {
      return 'readable';
    }
  }); // 'readable' | 'fit' (chỉ áp dụng trên điện thoại)

  useEffect(() => {
    if (isPanelOpen) {
      setPanelRendered(true);
      return undefined;
    }
    const t = setTimeout(() => setPanelRendered(false), 300);
    return () => clearTimeout(t);
  }, [isPanelOpen]);

  useEffect(() => {
    try {
      localStorage.setItem('acid_panel_compact', isPanelCompact ? '1' : '0');
    } catch {}
  }, [isPanelCompact]);

  const appRootRef = useRef(null);
  const { stageRef, layoutMode, isPhone, device, orientation, isTouch, viewportWidth, stageWidth, stageHeight } =
    useLayoutMode();

  // CSS cần biết chế độ ở cấp <html> (cỡ chữ lưu động của reflow dùng rem nên phải đặt trên html)
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.layout = layoutMode;
    root.dataset.device = device;
    return () => {
      delete root.dataset.layout;
      delete root.dataset.device;
    };
  }, [layoutMode, device]);

  // Chiều cao dock: cộng thêm vùng an toàn (thanh home iPhone/iPad) để nút không bị ép lại
  const dockBase = layoutMode === 'reflow' ? (viewportWidth >= 700 ? 64 : 56) : 48;
  // Điện thoại ngang: bỏ dock dưới, dùng thanh MiniRail; sidebar kịch bản nổi lên trên slide
  const phoneCanvas = isPhone && layoutMode === 'canvas';
  const panelCompact = isPanelCompact && !phoneCanvas;

  useEffect(() => {
    try {
      localStorage.setItem('acid_rail_open', railOpen ? '1' : '0');
    } catch {}
  }, [railOpen]);

  const handleChangeFitMode = (m) => {
    setFitMode(m);
    try {
      localStorage.setItem('acid_fit_mode', m);
    } catch {}
  };


  // Unlock audio on first user gesture & synchronize mute/volume state
  useEffect(() => {
    const handleFirstGesture = () => {
      sfx.unlock();
      cin.unlock();
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
    window.addEventListener('pointerdown', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);
    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  useEffect(() => {
    sfx.setMuted(isMuted);
    cin.setMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    sfx.setVolume(volume);
    cin.setVolume(volume);
  }, [volume]);

  // Navigation handlers with spatial directional sound
  const goToSlide = useCallback((num, direction = 'direct') => {
    const valid = Math.max(1, Math.min(TOTAL_SLIDES, num));
    setSlideDirection(direction);
    setCurrentSlide((prev) => {
      if (prev !== valid) {
        sfx.slideSwitch(direction === 'prev' ? 'prev' : 'next');
      }
      return valid;
    });
  }, []);

  const goToPrev = useCallback(() => {
    if (currentSlide > 1) {
      goToSlide(currentSlide - 1, 'prev');
    }
  }, [currentSlide, goToSlide]);

  const goToNext = useCallback(() => {
    if (currentSlide < TOTAL_SLIDES) {
      goToSlide(currentSlide + 1, 'next');
    }
  }, [currentSlide, goToSlide]);

  const goToFirst = useCallback(() => goToSlide(1, 'direct'), [goToSlide]);
  const goToLast = useCallback(() => goToSlide(TOTAL_SLIDES, 'direct'), [goToSlide]);

  // Stopwatch interval
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setElapsedTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Pointer tracking for Laser / Spotlight (§12.6)
  useEffect(() => {
    if (!laserMode) return;
    let animFrame = null;
    const handlePointerMove = (e) => {
      if (animFrame) cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(() => {
        if (appRootRef.current) {
          appRootRef.current.style.setProperty('--lx', `${e.clientX}px`);
          appRootRef.current.style.setProperty('--ly', `${e.clientY}px`);
        }
      });
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [laserMode]);

  // Screen Wake Lock API in Presenter Mode (§12.7)
  useEffect(() => {
    let wakeLock = null;
    if (isPresentMode && typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then((wl) => {
        wakeLock = wl;
      }).catch(() => {});
    }
    return () => {
      if (wakeLock) {
        wakeLock.release().catch(() => {});
      }
    };
  }, [isPresentMode]);

  // Dual-screen BroadcastChannel synchronizer (§12.5)
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel('acid-presenter');
    try {
      channel.postMessage({
        type: 'STATE_UPDATE',
        currentSlide,
        isPresentMode,
        blackoutScreen,
        elapsedTime,
      });
    } catch {}

    const handleMessage = (e) => {
      const data = e.data;
      if (!data) return;
      if (data.type === 'CMD_GOTO' && data.slide) goToSlide(data.slide);
      if (data.type === 'CMD_NEXT') goToNext();
      if (data.type === 'CMD_PREV') goToPrev();
      if (data.type === 'CMD_BLANK') setBlackoutScreen((s) => (s ? null : 'black'));
      if (data.type === 'CMD_LASER') setLaserMode((m) => (m === 'laser' ? null : 'laser'));
    };
    channel.addEventListener('message', handleMessage);
    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, [currentSlide, isPresentMode, blackoutScreen, elapsedTime, goToSlide, goToNext, goToPrev]);

  // Save panel width
  const handleResizeWidth = (w) => {
    setPanelWidth(w);
    try {
      localStorage.setItem('acid_panel_width', String(w));
    } catch {}
  };

  // Toggle panel position
  const handleTogglePanelPos = (pos) => {
    setPanelPos(pos);
    try {
      localStorage.setItem('acid_panel_pos', pos);
    } catch {}
  };

  // Sync current slide to URL hash (#13) and localStorage (§12.9)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${currentSlide}`);
      try {
        localStorage.setItem('acid_current_slide', String(currentSlide));
      } catch {}
    }
  }, [currentSlide]);

  // Handle browser back/forward and hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const parsed = parseInt(hash, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= TOTAL_SLIDES) {
        setSlideDirection((prevDir) => {
          if (parsed > currentSlide) return 'next';
          if (parsed < currentSlide) return 'prev';
          return prevDir;
        });
        setCurrentSlide(parsed);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentSlide]);

  // Toggle SidePanel tabs
  const toggleNotes = useCallback(() => {
    setIsPanelOpen((open) => {
      if (open && panelTab === 'notes' && !isPanelCompact) return false;
      setPanelTab('notes');
      setIsPanelCompact(false);
      return true;
    });
  }, [panelTab, isPanelCompact]);

  const toggleSettings = useCallback(() => {
    setIsPanelOpen((open) => {
      if (open && panelTab === 'settings' && !isPanelCompact) return false;
      setPanelTab('settings');
      setIsPanelCompact(false);
      return true;
    });
  }, [panelTab, isPanelCompact]);

  // Fullscreen & Presenter Mode (§9.5)
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {}
  }, []);

  const togglePresentMode = useCallback(() => {
    setIsPresentMode((prev) => !prev);
  }, []);

  // Sync fullscreen state from browser event
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      if (isFs) setIsPresentMode(true);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Present Mode bottom hover detector
  useEffect(() => {
    if (!isPresentMode) return;
    let timer = null;

    const handleMouseMove = (e) => {
      const threshold = window.innerHeight - 80;
      if (e.clientY >= threshold) {
        setIsHoverBottom(true);
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          setIsHoverBottom(false);
        }, 3000);
      } else {
        setIsHoverBottom(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timer) clearTimeout(timer);
    };
  }, [isPresentMode]);

  // Global Keyboard shortcuts (§1.2 & §9)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in form inputs
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return;
      }

      // Space key guard: don't navigate if focus is on a button
      if (e.code === 'Space') {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
          return;
        }
        e.preventDefault();
        goToNext();
        return;
      }

      // Navigation keys
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        goToNext();
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrev();
        return;
      }

      if (e.key === 'Home') {
        e.preventDefault();
        goToFirst();
        return;
      }

      if (e.key === 'End') {
        e.preventDefault();
        goToLast();
        return;
      }

      // Tab shortcuts
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        toggleNotes();
        return;
      }

      if (e.key === '\\') {
        e.preventDefault();
        if (!isPanelOpen) {
          setIsPanelCompact(false);
          setIsPanelOpen(true);
        } else {
          setIsPanelCompact((c) => !c);
        }
        return;
      }

      if (e.key === ',') {
        e.preventDefault();
        toggleSettings();
        return;
      }

      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        togglePresentMode();
        return;
      }

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      // Blackout screens (§12.7)
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        setBlackoutScreen((s) => (s === 'black' ? null : 'black'));
        return;
      }

      if (e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        setBlackoutScreen((s) => (s === 'white' ? null : 'white'));
        return;
      }

      // Laser / Spotlight (§12.6)
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        if (e.shiftKey) {
          setLaserMode((m) => (m === 'spotlight' ? null : 'spotlight'));
        } else {
          setLaserMode((m) => (m === 'laser' ? null : 'laser'));
        }
        return;
      }

      // Replay slide animation (§3.2 & §12.2)
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setReplayKey((k) => k + 1);
        return;
      }

      // Stopwatch toggle (§12.3)
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setIsTimerRunning((r) => !r);
        return;
      }

      // Mute toggle
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMuted((m) => !m);
        return;
      }

      // Clicker period '.' key for next
      if (e.key === '.') {
        e.preventDefault();
        goToNext();
        return;
      }

      // Escape key closes modals, panel, laser, or exits blackout/present mode
      if (e.key === 'Escape') {
        if (laserMode) {
          setLaserMode(null);
          return;
        }
        if (blackoutScreen) {
          setBlackoutScreen(null);
          return;
        }
        if (isPanelOpen) {
          setIsPanelOpen(false);
          return;
        }
        if (isPresentMode) {
          setIsPresentMode(false);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    goToNext,
    goToPrev,
    goToFirst,
    goToLast,
    toggleNotes,
    toggleSettings,
    togglePresentMode,
    toggleFullscreen,
    isPanelOpen,
    isPresentMode,
    blackoutScreen,
    laserMode,
  ]);

  // Compute sheet height for mobile reflow (§9.6)
  const mobileSheetHeight =
    sheetLevel === 'peek' ? '112px' : sheetLevel === 'half' ? '45dvh' : '80dvh';

  const CurrentSlideMeta = getSlideById(currentSlide);
  const CurrentSlideComponent = CurrentSlideMeta.component;
  const isReducedMotion = motionMode === 'reduced';

  // Dựng element slide theo id. Giữ nguyên tham chiếu => đồng hồ mỗi giây / kéo sidebar KHÔNG làm slide render lại.
  const buildSlideNode = useCallback(
    (id) => {
      const Comp = getSlideById(id).component;
      return (
        <SlideShell
          currentSlide={id}
          totalSlides={TOTAL_SLIDES}
          reducedMotion={isReducedMotion}
          slideDirection={slideDirection}
          onPrev={goToPrev}
          onNext={goToNext}
        >
          <Comp onNext={goToNext} onPrev={goToPrev} goToSlide={goToSlide} />
        </SlideShell>
      );
    },
    [isReducedMotion, slideDirection, goToPrev, goToNext, goToSlide]
  );

  const slideNode = useMemo(() => buildSlideNode(currentSlide), [buildSlideNode, currentSlide]);

  // Slide kề bên được dựng sẵn ở nền (bỏ qua trailer vì có âm thanh/timer tự chạy)
  const warmTargets = useMemo(
    () =>
      [currentSlide + 1, currentSlide - 1]
        .filter((id) => id >= 1 && id <= TOTAL_SLIDES && !getSlideById(id).isVideoSlide)
        .map((id) => ({ id, node: buildSlideNode(id) })),
    [buildSlideNode, currentSlide]
  );

  return (
    <div
      id="app-root"
      ref={appRootRef}
      data-layout={layoutMode}
      data-present={isPresentMode ? 'true' : 'false'}
      data-panel-pos={panelPos}
      data-phone={phoneCanvas ? 'true' : 'false'}
      data-device={device}
      data-orient={orientation}
      data-rail={phoneCanvas && railOpen ? panelPos : 'off'}
      style={{
        '--dock-h': isPresentMode || phoneCanvas ? '0px' : `calc(${dockBase}px + env(safe-area-inset-bottom, 0px))`,
        '--panel-w': panelRendered && layoutMode === 'canvas' && !phoneCanvas ? (panelCompact ? '56px' : `${panelWidth}px`) : '0px',
        '--sheet-h': panelRendered && layoutMode === 'reflow' ? mobileSheetHeight : '0px',
      }}
      className="bg-[#050E17] text-[#F8FAFC] select-none font-sans relative"
    >
      {/* MAIN STAGE (Contract: [data-stage]) */}
      <main
        data-stage
        ref={stageRef}
        role="region"
        aria-label="Sân khấu trình chiếu slide"
        className="relative w-full h-full overflow-hidden bg-atmospheric"
      >
        {/* Background Volumetric Glows — Pure hardware accelerated */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
          <div
            className="absolute -top-24 -left-24 w-[600px] h-[600px] rounded-full opacity-70"
            style={{
              background:
                'radial-gradient(circle, rgba(84, 215, 232, 0.12) 0%, rgba(84, 215, 232, 0.03) 45%, transparent 70%)',
            }}
          />
          <div
            className="absolute -bottom-24 -right-24 w-[600px] h-[600px] rounded-full opacity-60"
            style={{
              background:
                'radial-gradient(circle, rgba(216, 243, 106, 0.08) 0%, rgba(255, 135, 95, 0.03) 45%, transparent 70%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'radial-gradient(circle, #54D7E8 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />
        </div>

        {/* Global SVG definitions (gradients, filters, markers) */}
        <SvgDefs />

        {/* 16:9 Canvas FitStage */}
        <FitStage
          layoutMode={layoutMode}
          stageWidth={stageWidth}
          stageHeight={stageHeight}
          currentSlide={currentSlide}
          isPhone={phoneCanvas}
          readable={fitMode === 'readable'}
          device={device}
          isTouch={isTouch}
        >
          <SlideTransitioner
            key={replayKey}
            currentSlide={currentSlide}
            slideDirection={slideDirection}
            reducedMotion={motionMode === 'reduced'}
            isHero={CurrentSlideMeta.transitionType === 'hero'}
            isDirect={slideDirection === 'direct'}
            layoutMode={layoutMode}
            warmTargets={warmTargets}
          >
            {slideNode}
          </SlideTransitioner>
        </FitStage>

        {/* Blackout / Whiteout Presentation Overlay (§12.7) */}
        {blackoutScreen && (
          <div
            onClick={() => setBlackoutScreen(null)}
            title="Nhấp để quay lại bài thuyết trình"
            className={`absolute inset-0 z-50 transition-opacity duration-150 cursor-pointer flex items-center justify-center ${
              blackoutScreen === 'black' ? 'bg-black text-white/50' : 'bg-white text-black/50'
            }`}
          >
            <span className="text-xs font-mono uppercase tracking-widest opacity-40">
              Nhấn phím bất kỳ hoặc chạm để tiếp tục
            </span>
          </div>
        )}
      </main>

      {/* SIDE PANEL (Contract: [data-panel]) */}
      <SidePanel
        isOpen={panelRendered}
        isClosing={!isPanelOpen}
        activeTab={panelTab}
        onSelectTab={(tab) => {
          setPanelTab(tab);
          setIsPanelCompact(false);
        }}
        onClose={() => setIsPanelOpen(false)}
        isCompact={panelCompact}
        isPhone={phoneCanvas}
        fitMode={fitMode}
        onChangeFitMode={handleChangeFitMode}
        onToggleCompact={() => setIsPanelCompact((c) => !c)}
        currentSlide={currentSlide}
        goToSlide={(s) => {
          goToSlide(s);
          if (layoutMode === 'reflow') setIsPanelOpen(false);
        }}
        panelWidth={panelWidth}
        onResizeWidth={handleResizeWidth}
        panelPos={panelPos}
        onTogglePanelPos={handleTogglePanelPos}
        layoutMode={layoutMode}
        sheetLevel={sheetLevel}
        onChangeSheetLevel={setSheetLevel}
        motionMode={motionMode}
        onChangeMotionMode={setMotionMode}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        volume={volume}
        onChangeVolume={setVolume}
        onTogglePresent={togglePresentMode}
        elapsedTime={elapsedTime}
        isTimerRunning={isTimerRunning}
        onToggleTimer={() => setIsTimerRunning((r) => !r)}
        onResetTimer={() => setElapsedTime(0)}
        laserMode={laserMode}
        toggleLaser={() => setLaserMode((m) => (m === 'laser' ? null : 'laser'))}
        onReplay={() => setReplayKey((k) => k + 1)}
      />

      {/* IN-FLOW DOCK (Contract: [data-dock]) */}
      {!isPresentMode && !phoneCanvas && (
        <Dock
          currentSlide={currentSlide}
          totalSlides={TOTAL_SLIDES}
          goToPrev={goToPrev}
          goToNext={goToNext}
          goToSlide={goToSlide}
          isNotesOpen={isPanelOpen && panelTab === 'notes'}
          onToggleNotes={toggleNotes}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          isPresentMode={isPresentMode}
          togglePresentMode={togglePresentMode}
          isMuted={isMuted}
          toggleMute={() => setIsMuted(!isMuted)}
          motionMode={motionMode}
          onChangeMotionMode={setMotionMode}
          layoutMode={layoutMode}
          laserMode={laserMode}
          toggleLaser={() => setLaserMode((m) => (m === 'laser' ? null : 'laser'))}
          onReplay={() => setReplayKey((k) => k + 1)}
          elapsedTime={elapsedTime}
          isTimerRunning={isTimerRunning}
          onToggleTimer={() => setIsTimerRunning((r) => !r)}
          onResetTimer={() => setElapsedTime(0)}
          onOpenMobileMenu={() => {
            setPanelTab('settings');
            setIsPanelOpen(true);
          }}
        />
      )}

      {/* OVERLAY OK (Contract: [data-overlay-ok] for laser, toasts, floating dock in present mode) */}
      <div data-overlay-ok>
        {/* Laser pointer dot (§12.6) */}
        {laserMode === 'laser' && (
          <div
            className="pointer-events-none fixed z-50 w-3.5 h-3.5 rounded-full bg-[#FF3333] shadow-[0_0_12px_#FF3333,0_0_24px_#FF875F] -translate-x-1/2 -translate-y-1/2"
            style={{ left: 'var(--lx, -100px)', top: 'var(--ly, -100px)' }}
            aria-hidden="true"
          />
        )}

        {/* Spotlight overlay (§12.6) */}
        {laserMode === 'spotlight' && (
          <div
            className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-150"
            style={{
              background:
                'radial-gradient(circle 130px at var(--lx, 50%) var(--ly, 50%), transparent 0%, rgba(5,14,23,0.82) 100%)',
            }}
            aria-hidden="true"
          />
        )}

        {/* Present mode floating dock capsule */}
        {isPresentMode && !phoneCanvas && (
          <div
            onMouseEnter={() => setIsHoverBottom(true)}
            onMouseLeave={() => setIsHoverBottom(false)}
            className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
              isHoverBottom
                ? 'translate-y-0 opacity-100'
                : 'translate-y-12 opacity-0 pointer-events-none'
            }`}
            style={{ height: 'min(56px, 6dvh)' }}
          >
            <Dock
              currentSlide={currentSlide}
              totalSlides={TOTAL_SLIDES}
              goToPrev={goToPrev}
              goToNext={goToNext}
              goToSlide={goToSlide}
              isNotesOpen={isPanelOpen && panelTab === 'notes'}
              onToggleNotes={toggleNotes}
              isFullscreen={isFullscreen}
              toggleFullscreen={toggleFullscreen}
              isPresentMode={isPresentMode}
              togglePresentMode={togglePresentMode}
              isMuted={isMuted}
              toggleMute={() => setIsMuted(!isMuted)}
              motionMode={motionMode}
              onChangeMotionMode={setMotionMode}
              layoutMode={layoutMode}
              laserMode={laserMode}
              toggleLaser={() => setLaserMode((m) => (m === 'laser' ? null : 'laser'))}
              onReplay={() => setReplayKey((k) => k + 1)}
              elapsedTime={elapsedTime}
              isTimerRunning={isTimerRunning}
              onToggleTimer={() => setIsTimerRunning((r) => !r)}
              onResetTimer={() => setElapsedTime(0)}
            />
          </div>
        )}

        {/* Điện thoại ngang: thanh điều khiển nhỏ gọn + nền mờ khi mở kịch bản */}
        {phoneCanvas && (
          <>
            {isPanelOpen && (
              <div
                className="fixed inset-0 z-[55] bg-black/35"
                onClick={() => setIsPanelOpen(false)}
                aria-hidden="true"
              />
            )}
            <MiniRail
              currentSlide={currentSlide}
              totalSlides={TOTAL_SLIDES}
              onPrev={goToPrev}
              onNext={goToNext}
              isOpen={railOpen}
              onToggleOpen={() => setRailOpen((o) => !o)}
              pos={panelPos}
              isNotesOpen={isPanelOpen}
              onToggleNotes={toggleNotes}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          </>
        )}
      </div>
    </div>
  );
}
