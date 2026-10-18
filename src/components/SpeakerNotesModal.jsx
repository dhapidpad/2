import React, { useState, useEffect } from 'react';
import { X, Clock, User, AlertTriangle, ArrowRight, CheckCircle2, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { slideNotes } from '../data/slideNotes';
import { SLIDE_META } from '../App';

export default function SpeakerNotesModal({ isOpen, onClose, currentSlide, totalSlides = 21 }) {
  const [viewSlide, setViewSlide] = useState(currentSlide);

  // Sync with currentSlide when opened
  useEffect(() => {
    if (isOpen) {
      setViewSlide(currentSlide);
    }
  }, [isOpen, currentSlide]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.stopPropagation();
        setViewSlide((prev) => Math.max(1, prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.stopPropagation();
        setViewSlide((prev) => Math.min(totalSlides, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, totalSlides]);

  if (!isOpen) return null;

  const note = slideNotes[viewSlide] || {
    title: `Slide ${viewSlide}`,
    speaker: "Người thuyết trình",
    duration: "45–60 giây",
    keyPoints: [],
    script: "Đang cập nhật ghi chú...",
    safetyDoNotSay: "Tuân thủ tính chính xác khoa học.",
    transition: "Chuyển tiếp tự nhiên sang slide tiếp theo."
  };

  const meta = SLIDE_META?.[viewSlide - 1];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Kịch bản và ghi chú người thuyết trình"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-2xl max-h-[90dvh] flex flex-col bg-[#091B2A] border border-[#29485A] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#102838] border-b border-[#29485A] flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-[#54D7E8]/15 text-[#54D7E8] border border-[#54D7E8]/30 flex items-center justify-center font-bold text-xs font-mono shrink-0">
              {String(viewSlide).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-white truncate">
                {meta?.title ? `${meta.title}: ${note.title}` : note.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-[#A8BBC8] mt-0.5">
                <span className="flex items-center gap-1 truncate">
                  <User size={13} className="text-[#D8F36A] shrink-0" /> {note.speaker}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 shrink-0">
                  <Clock size={13} className="text-[#54D7E8]" /> {note.duration}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick slide switcher inside notes */}
            <button
              onClick={() => setViewSlide((p) => Math.max(1, p - 1))}
              disabled={viewSlide <= 1}
              aria-label="Ghi chú slide trước"
              className="w-8 h-8 rounded-lg bg-[#1B3D54]/50 hover:bg-[#1B3D54] disabled:opacity-30 text-[#A8BBC8] hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-mono text-[#94A3B8] px-1">
              {viewSlide}/{totalSlides}
            </span>
            <button
              onClick={() => setViewSlide((p) => Math.min(totalSlides, p + 1))}
              disabled={viewSlide >= totalSlides}
              aria-label="Ghi chú slide sau"
              className="w-8 h-8 rounded-lg bg-[#1B3D54]/50 hover:bg-[#1B3D54] disabled:opacity-30 text-[#A8BBC8] hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#1B3D54]/50 hover:bg-[#1B3D54] text-[#A8BBC8] hover:text-white flex items-center justify-center transition-colors ml-1"
              aria-label="Đóng ghi chú"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed">
          {/* Key points */}
          {note.keyPoints && note.keyPoints.length > 0 && (
            <div className="bg-[#102838]/80 p-3.5 rounded-2xl border border-[#29485A]/70">
              <div className="flex items-center gap-1.5 font-bold text-[#54D7E8] uppercase tracking-wider text-xs mb-2">
                <CheckCircle2 size={15} /> Ý chính cần nhấn mạnh
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-[#F4F7FA]">
                {note.keyPoints.map((point, idx) => (
                  <li key={idx} className="leading-snug">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Script / Sample speech */}
          {note.script && (
            <div className="bg-[#102838]/80 p-3.5 rounded-2xl border border-[#29485A]/70">
              <div className="flex items-center gap-1.5 font-bold text-[#D8F36A] uppercase tracking-wider text-xs mb-2">
                <MessageSquare size={15} /> Lời nói mẫu gợi ý
              </div>
              <p className="text-[#F4F7FA] italic bg-[#071521]/60 p-3 rounded-xl border border-[#29485A]/40">
                "{note.script}"
              </p>
            </div>
          )}

          {/* Warning / Don't say */}
          {note.safetyDoNotSay && (
            <div className="bg-[#2A1D1D]/90 p-3.5 rounded-2xl border border-[#FF875F]/40">
              <div className="flex items-center gap-1.5 font-bold text-[#FF875F] uppercase tracking-wider text-xs mb-1.5">
                <AlertTriangle size={15} /> Điều tuyệt đối không được nói sai
              </div>
              <p className="text-[#FFD3C4]">{note.safetyDoNotSay}</p>
            </div>
          )}

          {/* Transition */}
          {note.transition && (
            <div className="bg-[#102838]/60 p-3 rounded-xl border border-[#29485A]/50 flex items-start gap-2 text-[#A8BBC8]">
              <ArrowRight size={15} className="text-[#54D7E8] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Chuyển tiếp sang slide kế: </span>
                {note.transition}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#102838] border-t border-[#29485A] flex items-center justify-between text-xs text-[#A8BBC8] flex-shrink-0">
          <span>Phím tắt: <kbd className="font-mono bg-[#071521] px-1.5 py-0.5 rounded border border-[#29485A] text-white">N</kbd> (Bật/tắt) • <kbd className="font-mono bg-[#071521] px-1.5 py-0.5 rounded border border-[#29485A] text-white">←/→</kbd> (Chuyển slide)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#54D7E8] text-[#071521] font-bold hover:bg-[#72e0ef] transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
