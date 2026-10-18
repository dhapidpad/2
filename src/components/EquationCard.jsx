import React from 'react';
import { Atom, CheckCircle2 } from 'lucide-react';

/**
 * Hiển thị phương trình hóa học chuẩn hóa với kiểu chữ sắc nét,
 * thẻ công thức có chỉ số trên/dưới rõ ràng, chú giải trạng thái vật chất,
 * và khả năng co giãn tốt trên cả máy tính lẫn điện thoại.
 */
export default function EquationCard({
  title,
  equationHtml,
  note,
  highlight = false,
  badge = "Phương trình hóa học",
  badgeColor = "lime",
  atomBalance = null,
  thermodynamics = null
}) {
  const badgeClasses = {
    lime: "bg-[#D8F36A]/15 text-[#D8F36A] border-[#D8F36A]/35",
    cyan: "bg-[#54D7E8]/15 text-[#54D7E8] border-[#54D7E8]/35",
    coral: "bg-[#FF875F]/15 text-[#FF875F] border-[#FF875F]/35"
  };

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 transition-all relative overflow-hidden ${
        highlight
          ? 'equation-highlight'
          : 'glass-panel'
      }`}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            badgeColor === 'cyan'
              ? 'linear-gradient(90deg, transparent, #54D7E8, transparent)'
              : badgeColor === 'coral'
              ? 'linear-gradient(90deg, transparent, #FF875F, transparent)'
              : 'linear-gradient(90deg, transparent, #D8F36A, transparent)'
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {badge && (
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                badgeClasses[badgeColor] || badgeClasses.lime
              }`}
            >
              <Atom size={12} className="animate-spin-slow" />
              {badge}
            </span>
          )}
          {title && <h4 className="text-xs sm:text-sm md:text-base font-bold text-[#F4F7FA]">{title}</h4>}
        </div>

        {thermodynamics && (
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-lg bg-[#050E17]/80 border border-[#29485A] text-[#54D7E8]">
            {thermodynamics}
          </span>
        )}
      </div>

      {/* Equation Box */}
      <div className="overflow-x-auto py-2 px-3 rounded-xl bg-[#050E17]/65 border border-[#29485A]/60 my-1">
        <div
          className={`font-mono text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wide select-all text-center whitespace-nowrap ${
            highlight ? 'text-[#D8F36A] text-glow-lime' : 'text-[#F4F7FA]'
          }`}
          dangerouslySetInnerHTML={{ __html: equationHtml }}
        />
      </div>

      {/* Atom Balance & State Legend Row */}
      {atomBalance && (
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs bg-[#071521]/80 px-3 py-1.5 rounded-lg border border-[#29485A]/50">
          <span className="flex items-center gap-1.5 text-[#D8F36A] font-semibold">
            <CheckCircle2 size={13} /> Bảo toàn nguyên tử: <span className="font-mono text-white">{atomBalance}</span>
          </span>
          <span className="text-[#A8BBC8] font-mono text-xs">
            (g): khí • (l): lỏng • (aq): dung dịch • (s): rắn
          </span>
        </div>
      )}

      {note && (
        <p className="mt-2.5 text-xs sm:text-sm text-[#DCE6F0] leading-relaxed border-t border-[#29485A]/50 pt-2.5">
          {note}
        </p>
      )}
    </div>
  );
}
