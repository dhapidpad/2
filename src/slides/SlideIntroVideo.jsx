import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Volume2, VolumeX, SkipForward, Play, Pause, RefreshCw, Film } from 'lucide-react';

/**
 * SlideIntroVideo — Cinematic Science Trailer
 * - State machine: loading | playing | muted-playing | paused | needs-gesture | ended | error
 * - Safe browser autoplay flow: tries unmuted -> fallback muted -> fallback user gesture CTA
 * - Explicit accessible controls with >=44px touch targets
 * - Guaranteed single-advance on ended/skip via hasAdvancedRef
 * - Proper cleanup on unmount
 */
export const VIDEO_STATUS = {
  LOADING: 'loading',
  PLAYING: 'playing',
  MUTED_PLAYING: 'muted-playing',
  PAUSED: 'paused',
  NEEDS_GESTURE: 'needs-gesture',
  ENDED: 'ended',
  ERROR: 'error'
};

export default function SlideIntroVideo({ onNext }) {
  const videoRef = useRef(null);
  const hasAdvancedRef = useRef(false);
  const [status, setStatus] = useState(VIDEO_STATUS.PAUSED);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const advanceOnce = useCallback(() => {
    if (hasAdvancedRef.current) return;
    hasAdvancedRef.current = true;
    if (onNext) onNext();
  }, [onNext]);

  // Handle Play Attempt
  const attemptPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = false;
      await video.play();
      setIsMuted(false);
      setStatus(VIDEO_STATUS.PLAYING);
    } catch {
      // Autoplay with sound blocked: try muted autoplay
      try {
        video.muted = true;
        await video.play();
        setIsMuted(true);
        setStatus(VIDEO_STATUS.MUTED_PLAYING);
      } catch {
        // Even muted autoplay blocked: requires user gesture
        setStatus(VIDEO_STATUS.NEEDS_GESTURE);
      }
    }
  }, []);

  // Mount effect: Don't autoplay on mount, wait for user gesture
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    hasAdvancedRef.current = false;
    setStatus(VIDEO_STATUS.PAUSED);

    return () => {
      if (video) {
        video.pause();
      }
    };
  }, []);

  // User gesture button to play with sound
  const handleUserGesturePlay = async (e) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = false;
      await video.play();
      setIsMuted(false);
      setStatus(VIDEO_STATUS.PLAYING);
    } catch {
      try {
        video.muted = true;
        await video.play();
        setIsMuted(true);
        setStatus(VIDEO_STATUS.MUTED_PLAYING);
      } catch (err) {
        setErrorMessage(err.message || 'Không thể phát video');
        setStatus(VIDEO_STATUS.ERROR);
      }
    }
  };

  // Toggle Mute / Unmute
  const handleToggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      setIsMuted(false);
      if (status === VIDEO_STATUS.MUTED_PLAYING) {
        setStatus(VIDEO_STATUS.PLAYING);
      }
    } else {
      video.muted = true;
      setIsMuted(true);
      if (status === VIDEO_STATUS.PLAYING) {
        setStatus(VIDEO_STATUS.MUTED_PLAYING);
      }
    }
  };

  // Toggle Play / Pause
  const handleTogglePlayPause = (e) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        setStatus(video.muted ? VIDEO_STATUS.MUTED_PLAYING : VIDEO_STATUS.PLAYING);
      }).catch(() => {
        video.muted = true;
        video.play().then(() => {
          setIsMuted(true);
          setStatus(VIDEO_STATUS.MUTED_PLAYING);
        }).catch(() => {
          setStatus(VIDEO_STATUS.NEEDS_GESTURE);
        });
      });
    } else {
      video.pause();
      setStatus(VIDEO_STATUS.PAUSED);
    }
  };

  const handleEnded = () => {
    setStatus(VIDEO_STATUS.ENDED);
    // Bỏ tự động chuyển sang slide 3 - để người thuyết trình chủ động
  };

  const handleError = () => {
    setStatus(VIDEO_STATUS.ERROR);
    setErrorMessage('Không thể tải tệp /intro.mp4');
  };

  const handleRetry = (e) => {
    e.stopPropagation();
    setStatus(VIDEO_STATUS.LOADING);
    setErrorMessage('');
    const video = videoRef.current;
    if (video) {
      video.load();
      attemptPlay();
    }
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center bg-[#02070C] overflow-hidden relative select-none"
      role="region"
      aria-label="Video mở đầu bài thuyết trình"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src="/intro.mp4"
        className={`w-full h-full object-contain ${status === VIDEO_STATUS.ERROR ? 'hidden' : 'block'}`}
        playsInline
        preload="auto"
        onEnded={handleEnded}
        onError={handleError}
        onPause={() => {
          if (status === VIDEO_STATUS.PLAYING || status === VIDEO_STATUS.MUTED_PLAYING) {
            setStatus(VIDEO_STATUS.PAUSED);
          }
        }}
        onPlay={() => {
          const video = videoRef.current;
          if (video) {
            setStatus(video.muted ? VIDEO_STATUS.MUTED_PLAYING : VIDEO_STATUS.PLAYING);
          }
        }}
      />

      {/* NEEDS GESTURE OVERLAY */}
      {status === VIDEO_STATUS.NEEDS_GESTURE && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md p-6 text-center animate-fadeIn">
          <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-[#54D7E8]/40 space-y-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#54D7E8]/15 border border-[#54D7E8]/40 flex items-center justify-center text-[#54D7E8]">
              <Film size={32} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Video Trailer Khoa Học</h3>
              <p className="text-sm text-[#A8BBC8] mt-2">
                Trình duyệt yêu cầu một tương tác trực tiếp để bắt đầu phát video kèm âm thanh.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleUserGesturePlay}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-gradient-to-r from-[#54D7E8] to-[#38BDF8] hover:from-[#72E1EF] hover:to-[#54D7E8] text-[#050E17] font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(84,215,232,0.45)] transition-all active:scale-95"
              >
                <Play size={18} className="fill-current" />
                <span>Bắt đầu phát có tiếng</span>
              </button>
              <button
                onClick={advanceOnce}
                className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-2xl bg-[#0D263B]/80 hover:bg-[#163B59] border border-white/15 text-xs font-bold text-[#A8BBC8] hover:text-white transition-all"
              >
                Bỏ qua sang Slide 03
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ERROR FALLBACK OVERLAY */}
      {status === VIDEO_STATUS.ERROR && (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-atmospheric z-30">
          <div className="max-w-3xl w-full glass-panel rounded-3xl p-6 sm:p-8 border border-[#54D7E8]/40 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#54D7E8]/15 text-[#54D7E8] text-xs font-bold uppercase tracking-wider">
              <Film size={14} /> Sơ đồ dự phòng Trailer
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              HÀNH TRÌNH PHÂN TỬ: N₂ + O₂ &rarr; NO &rarr; NO₂ &rarr; HNO₃
            </h3>
            <svg viewBox="0 0 800 200" className="w-full h-auto rounded-2xl bg-[#050E17] border border-[#29485A]" role="img" aria-label="Trailer tóm tắt hành trình mưa axit">
              <path d="M 80 100 H 720" stroke="#29485A" strokeWidth="4" strokeDasharray="8 6" className="animate-dash-flow" />
              <g transform="translate(110, 100)">
                <circle r="42" fill="#102838" stroke="#54D7E8" strokeWidth="2.5" />
                <text y="-4" textAnchor="middle" fill="#54D7E8" fontSize="16" fontWeight="900">N₂ + O₂</text>
                <text y="16" textAnchor="middle" fill="#A8BBC8" fontSize="11">&gt;1200°C</text>
              </g>
              <g transform="translate(300, 100)">
                <circle r="42" fill="#102838" stroke="#FF875F" strokeWidth="2.5" />
                <text y="-4" textAnchor="middle" fill="#FF875F" fontSize="18" fontWeight="900">2 NO</text>
                <text y="16" textAnchor="middle" fill="#A8BBC8" fontSize="11">Khí thải</text>
              </g>
              <g transform="translate(490, 100)">
                <circle r="42" fill="#102838" stroke="#D8F36A" strokeWidth="2.5" />
                <text y="-4" textAnchor="middle" fill="#D8F36A" fontSize="18" fontWeight="900">2 NO₂</text>
                <text y="16" textAnchor="middle" fill="#A8BBC8" fontSize="11">Khí quyển</text>
              </g>
              <g transform="translate(680, 100)">
                <circle r="45" fill="#143245" stroke="#54D7E8" strokeWidth="3" />
                <text y="-4" textAnchor="middle" fill="#FFFFFF" fontSize="17" fontWeight="900">4 HNO₃</text>
                <text y="16" textAnchor="middle" fill="#D8F36A" fontSize="11">Mưa axit</text>
              </g>
            </svg>
            <p className="text-xs sm:text-sm text-[#FF875F]">
              {errorMessage || 'Không thể tải video từ đường dẫn /intro.mp4.'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRetry}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0D263B] hover:bg-[#163B59] border border-white/20 text-xs font-bold text-white flex items-center gap-2 transition-all"
              >
                <RefreshCw size={14} />
                <span>Thử tải lại</span>
              </button>
              <button
                onClick={advanceOnce}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#54D7E8]/20 hover:bg-[#54D7E8]/35 border border-[#54D7E8]/50 text-xs font-bold text-[#54D7E8] flex items-center gap-2 transition-all"
              >
                <span>Bỏ qua sang Slide 03</span>
                <SkipForward size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP-RIGHT CINEMA CONTROLS OVERLAY */}
      {status !== VIDEO_STATUS.ERROR && status !== VIDEO_STATUS.NEEDS_GESTURE && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2 sm:gap-2.5">
          {/* Mute/Unmute CTA */}
          <button
            onClick={handleToggleMute}
            aria-label={isMuted ? 'Bật âm thanh video' : 'Tắt âm thanh video'}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 backdrop-blur-md shadow-lg transition-all active:scale-95 ${
              isMuted
                ? 'bg-[#FF875F]/20 hover:bg-[#FF875F]/30 border-[#FF875F]/60 text-[#FF875F] animate-pulse-subtle'
                : 'bg-[#081827]/85 hover:bg-[#122D42] border-white/20 text-[#54D7E8]'
            }`}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span>{isMuted ? 'Bật tiếng' : 'Tắt tiếng'}</span>
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={handleTogglePlayPause}
            aria-label={status === VIDEO_STATUS.PAUSED ? 'Tiếp tục phát video' : 'Tạm dừng video'}
            className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl bg-[#081827]/85 hover:bg-[#122D42] border border-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-all active:scale-95"
          >
            {status === VIDEO_STATUS.PAUSED ? <Play size={16} className="text-[#54D7E8]" /> : <Pause size={16} />}
          </button>

          {/* Skip Button */}
          <button
            onClick={advanceOnce}
            aria-label="Bỏ qua video và sang Slide 03"
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#54D7E8]/20 hover:bg-[#54D7E8]/35 border border-[#54D7E8]/50 text-xs font-bold text-[#54D7E8] flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-all active:scale-95"
          >
            <span>Bỏ qua</span>
            <SkipForward size={14} />
          </button>
        </div>
      )}

    </div>
  );
}
