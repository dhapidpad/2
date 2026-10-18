import React, { useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { slideNotes } from '../data/slideNotes';
import { SLIDES_REGISTRY } from '../config/slides';

export default function SlideGridModal({ isOpen, onClose, currentSlide, totalSlides, onSelectSlide }) {
  const currentCardRef = useRef(null);

  // Close on Escape & focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Focus current slide card
    if (currentCardRef.current) {
      currentCardRef.current.focus();
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Lưới chọn slide thuyết trình"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[90dvh] flex flex-col bg-[#091B2A] border border-[#29485A] rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-[#102838] border-b border-[#29485A] flex items-center justify-between gap-3 flex-shrink-0">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white">Tổng quan {totalSlides} Slide Thuyết trình</h3>
            <p className="text-xs text-[#A8BBC8] mt-0.5">Nhấp hoặc dùng phím Enter để chuyển tới slide (Phím tắt: Shift+G)</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#1B3D54]/50 hover:bg-[#1B3D54] text-[#A8BBC8] hover:text-white flex items-center justify-center transition-colors"
            aria-label="Đóng lưới slide"
          >
            <X size={20} />
          </button>
        </div>

        {/* 21 Slide Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: totalSlides }, (_, i) => i + 1).map((slideNum) => {
            const note = slideNotes[slideNum];
            const meta = SLIDES_REGISTRY?.[slideNum - 1];
            const isCurrent = slideNum === currentSlide;
            const title = meta?.title || (note?.title ? note.title.split(':')[1]?.trim() || note.title : `Slide ${slideNum}`);

            return (
              <div
                key={slideNum}
                ref={isCurrent ? currentCardRef : null}
                tabIndex={0}
                role="button"
                aria-label={`Slide ${slideNum}: ${title}${isCurrent ? ' (đang xem)' : ''}`}
                onClick={() => {
                  onSelectSlide(slideNum);
                  onClose();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectSlide(slideNum);
                    onClose();
                  }
                }}
                className={`group p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#54D7E8] ${
                  isCurrent
                    ? 'bg-[#143245] border-[#54D7E8] ring-2 ring-[#54D7E8]/40 shadow-lg shadow-[#071521]'
                    : 'bg-[#102838]/80 hover:bg-[#122D3E] border-[#29485A]/70 hover:border-[#54D7E8]/40 hover:-translate-y-0.5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded-lg border ${
                        isCurrent
                          ? 'bg-[#54D7E8] text-[#071521] border-[#54D7E8]'
                          : 'bg-[#071521] text-[#54D7E8] border-[#29485A]'
                      }`}
                    >
                      #{String(slideNum).padStart(2, '0')}
                    </span>
                    {isCurrent && <Check size={14} className="text-[#54D7E8]" />}
                  </div>

                  <h5 className="font-semibold text-xs sm:text-sm text-white line-clamp-2 leading-snug group-hover:text-[#54D7E8] transition-colors">
                    {title}
                  </h5>
                </div>

                <div className="mt-3 pt-2 border-t border-[#29485A]/40 flex items-center justify-between text-xs text-[#A8BBC8]">
                  <span className="truncate max-w-[90px]">{note?.speaker?.split('(')[0] || `TV ${slideNum}`}</span>
                  <span className="text-[#54D7E8] font-mono">{note?.duration || ''}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
