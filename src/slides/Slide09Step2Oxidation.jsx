import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import EquationCard from '../components/EquationCard';

export default function Slide09Step2Oxidation() {
  return (
    <div className="w-full min-h-full flex flex-col justify-between py-1 gap-3 relative">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#FF875F]/15 border border-[#FF875F]/35 text-[#FF875F] text-xs font-bold tracking-wider uppercase">
            Cơ chế Bước 2 / 3 • Phản ứng oxi hóa trong khí quyển
          </span>
          <span className="text-xs text-[#A8BBC8]">Chuyển hóa từ khí không màu (NO) sang khí nâu đỏ (NO₂)</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          BƯỚC 2 — OXYGEN TIẾP TỤC PHẢN ỨNG TẠO NO₂
        </h2>
      </div>

      {/* Main Content Area */}
      <div className="my-auto space-y-3.5">
        {/* Boxed Primary Equation */}
        <EquationCard
          title="Phương trình cân bằng oxi hóa nitric oxide trong không khí"
          badge="Mắt xích trung gian bản lề"
          badgeColor="coral"
          highlight={true}
          thermodynamics="ΔH°₂₉₈ = −114,1 kJ/mol (Tỏa nhiệt)"
          atomBalance="Vế trái: 2 nguyên tử N + 4 nguyên tử O  =  Vế phải: 2 nguyên tử N + 4 nguyên tử O"
          equationHtml="<span style='color:#D8F36A'>2</span>NO(g) + O<sub>2</sub>(g) &rarr; <span style='color:#D8F36A'>2</span>NO<sub>2</sub>(g)"
          note="Khi NO tiếp xúc với oxygen trong không khí, phản ứng oxi hóa xảy ra tự nhiên ở nhiệt độ thường, nâng số oxi hóa của nitrogen từ +2 lên +4."
        />

        {/* High-Detail SVG Molecular Conservation & Electron Transfer Diagram */}
        <div className="glass-panel p-4 rounded-3xl border border-[#29485A] overflow-x-auto shadow-2xl">
          <svg
            viewBox="0 0 1050 225"
            className="w-full h-auto select-none"
            role="img"
            aria-labelledby="s9MolTitle s9MolDesc"
          >
            <title id="s9MolTitle">Mô hình phân tử phản ứng 2NO cộng O2 tạo thành 2NO2</title>
            <desc id="s9MolDesc">
              Hai phân tử NO tác dụng với một phân tử O2 tạo thành hai phân tử NO2 cấu trúc góc 134 độ.
            </desc>
            <defs>
              <radialGradient id="s9SphereN" cx="32%" cy="28%" r="72%">
                <stop offset="0%" stopColor="#C4FAFF" />
                <stop offset="35%" stopColor="#54D7E8" />
                <stop offset="75%" stopColor="#1B4965" />
                <stop offset="100%" stopColor="#07192A" />
              </radialGradient>
              <radialGradient id="s9SphereO" cx="32%" cy="28%" r="72%">
                <stop offset="0%" stopColor="#FFD3C4" />
                <stop offset="35%" stopColor="#FF875F" />
                <stop offset="75%" stopColor="#C0392B" />
                <stop offset="100%" stopColor="#54160E" />
              </radialGradient>
              <radialGradient id="s9AuraNO2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FF875F" stopOpacity="0.3" />
                <stop offset="65%" stopColor="#C0392B" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#05121C" stopOpacity="0" />
              </radialGradient>
              <marker id="s9Arrow" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L9,3.5 z" fill="#D8F36A" />
              </marker>
            </defs>

            {/* Background Panel Accents */}
            <rect x="6" y="6" width="1038" height="213" rx="20" fill="#05121C" stroke="#1E3A4D" strokeWidth="1.2" />

            {/* Left Box: 2 NO */}
            <rect x="20" y="16" width="280" height="192" rx="18" fill="#081A28" stroke="#54D7E8" strokeWidth="1.8" />
            <rect x="36" y="26" width="165" height="24" rx="6" fill="#050E17" stroke="#54D7E8" strokeOpacity="0.4" />
            <text x="118" y="42" fill="#54D7E8" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              2 phân tử •NO (2N + 2O)
            </text>

            {/* NO molecule #1 */}
            <g transform="translate(90, 62)">
              <line x1="28" y1="18" x2="98" y2="18" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="28" y1="25" x2="98" y2="25" stroke="#54D7E8" strokeWidth="4" strokeLinecap="round" />
              <line x1="28" y1="32" x2="98" y2="32" stroke="#FF875F" strokeWidth="2.5" strokeDasharray="4 3" />
              {/* N atom */}
              <circle cx="28" cy="22" r="22" fill="url(#s9SphereN)" stroke="#54D7E8" strokeWidth="1.5" />
              <ellipse cx="21" cy="15" rx="7" ry="4.5" transform="rotate(-30 21 15)" fill="#FFFFFF" opacity="0.6" />
              <text x="28" y="27" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle">N⁺²</text>
              <circle cx="28" cy="-5" r="3" fill="#D8F36A" />
              {/* O atom */}
              <circle cx="98" cy="22" r="20" fill="url(#s9SphereO)" stroke="#FF875F" strokeWidth="1.5" />
              <ellipse cx="91" cy="15" rx="6.5" ry="4" transform="rotate(-30 91 15)" fill="#FFFFFF" opacity="0.6" />
              <text x="98" y="27" fill="#FFFFFF" fontSize="12" fontWeight="900" textAnchor="middle">O⁻²</text>
            </g>

            {/* NO molecule #2 */}
            <g transform="translate(90, 118)">
              <line x1="28" y1="18" x2="98" y2="18" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="28" y1="25" x2="98" y2="25" stroke="#54D7E8" strokeWidth="4" strokeLinecap="round" />
              <line x1="28" y1="32" x2="98" y2="32" stroke="#FF875F" strokeWidth="2.5" strokeDasharray="4 3" />
              {/* N atom */}
              <circle cx="28" cy="22" r="22" fill="url(#s9SphereN)" stroke="#54D7E8" strokeWidth="1.5" />
              <ellipse cx="21" cy="15" rx="7" ry="4.5" transform="rotate(-30 21 15)" fill="#FFFFFF" opacity="0.6" />
              <text x="28" y="27" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle">N⁺²</text>
              <circle cx="28" cy="-5" r="3" fill="#D8F36A" />
              {/* O atom */}
              <circle cx="98" cy="22" r="20" fill="url(#s9SphereO)" stroke="#FF875F" strokeWidth="1.5" />
              <ellipse cx="91" cy="15" rx="6.5" ry="4" transform="rotate(-30 91 15)" fill="#FFFFFF" opacity="0.6" />
              <text x="98" y="27" fill="#FFFFFF" fontSize="12" fontWeight="900" textAnchor="middle">O⁻²</text>
            </g>
            <text x="160" y="195" fill="#A8BBC8" fontSize="12" fontWeight="700" textAnchor="middle">
              Khí không màu • Gốc tự do •NO
            </text>

            {/* Plus Operator Badge */}
            <circle cx="330" cy="112" r="18" fill="#102838" stroke="#54D7E8" strokeWidth="1.5" />
            <text x="330" y="120" fill="#FFFFFF" fontSize="26" fontWeight="900" textAnchor="middle">+</text>

            {/* Middle Box: 1 O2 */}
            <rect x="362" y="16" width="220" height="192" rx="18" fill="#081A28" stroke="#FF875F" strokeWidth="1.8" />
            <rect x="378" y="26" width="140" height="24" rx="6" fill="#050E17" stroke="#FF875F" strokeOpacity="0.4" />
            <text x="448" y="42" fill="#FF875F" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              1 phân tử O₂ (2O)
            </text>
            <g transform="translate(406, 92)">
              <line x1="28" y1="16" x2="98" y2="16" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
              <line x1="28" y1="24" x2="98" y2="24" stroke="#FF875F" strokeWidth="4" strokeLinecap="round" />
              {/* O1 */}
              <circle cx="28" cy="20" r="21" fill="url(#s9SphereO)" stroke="#FF875F" strokeWidth="1.5" />
              <ellipse cx="21" cy="13" rx="7" ry="4.5" transform="rotate(-30 21 13)" fill="#FFFFFF" opacity="0.6" />
              <text x="28" y="26" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle">O⁰</text>
              {/* O2 */}
              <circle cx="98" cy="20" r="21" fill="url(#s9SphereO)" stroke="#FF875F" strokeWidth="1.5" />
              <ellipse cx="91" cy="13" rx="7" ry="4.5" transform="rotate(-30 91 13)" fill="#FFFFFF" opacity="0.6" />
              <text x="98" y="26" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle">O⁰</text>
            </g>
            <text x="472" y="195" fill="#A8BBC8" fontSize="12" fontWeight="700" textAnchor="middle">
              Oxygen không khí • Bậc 2
            </text>

            {/* Reaction Collision Corridor Arrow */}
            <g>
              <path d="M 598 112 H 692" stroke="#D8F36A" strokeWidth="4.5" strokeDasharray="7 5" markerEnd="url(#s9Arrow)" className="animate-dash-flow" />
              <rect x="612" y="76" width="68" height="22" rx="6" fill="#050E17" stroke="#D8F36A" strokeOpacity="0.6" />
              <text x="646" y="91" fill="#D8F36A" fontSize="11" fontWeight="900" textAnchor="middle">Oxi hóa</text>
              <text x="646" y="142" fill="#54D7E8" fontSize="11" fontFamily="monospace" fontWeight="800" textAnchor="middle">Nhường 4e⁻</text>
            </g>

            {/* Right Box: 2 NO2 */}
            <rect x="708" y="16" width="322" height="192" rx="18" fill="#081A28" stroke="#D8F36A" strokeWidth="2.2" />
            <rect x="724" y="26" width="185" height="24" rx="6" fill="#050E17" stroke="#D8F36A" strokeOpacity="0.5" />
            <text x="816" y="42" fill="#D8F36A" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              2 phân tử NO₂ (2N + 4O)
            </text>

            {/* Aura surrounding NO2 molecules */}
            <ellipse cx="869" cy="112" rx="145" ry="75" fill="url(#s9AuraNO2)" />

            {/* Bent NO2 #1 */}
            <g transform="translate(738, 64)">
              <line x1="56" y1="16" x2="22" y2="44" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="56" y1="16" x2="22" y2="44" stroke="#FF875F" strokeWidth="2" strokeDasharray="4 3" />
              <line x1="56" y1="16" x2="90" y2="44" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="56" y1="16" x2="90" y2="44" stroke="#FF875F" strokeWidth="2" strokeDasharray="4 3" />
              <path d="M 40 28 Q 56 38 72 28" fill="none" stroke="#D8F36A" strokeWidth="1.5" strokeDasharray="3 2" />
              {/* O atoms */}
              <circle cx="22" cy="44" r="18" fill="url(#s9SphereO)" stroke="#FF875F" strokeWidth="1.5" />
              <text x="22" y="49" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle">O⁻²</text>
              <circle cx="90" cy="44" r="18" fill="url(#s9SphereO)" stroke="#FF875F" strokeWidth="1.5" />
              <text x="90" y="49" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle">O⁻²</text>
              {/* N atom */}
              <circle cx="56" cy="16" r="21" fill="url(#s9SphereN)" stroke="#54D7E8" strokeWidth="1.5" />
              <text x="56" y="22" fill="#FFFFFF" fontSize="12.5" fontWeight="900" textAnchor="middle">N⁺⁴</text>
              <circle cx="56" cy="-8" r="3" fill="#D8F36A" />
            </g>

            {/* Bent NO2 #2 */}
            <g transform="translate(886, 64)">
              <line x1="56" y1="16" x2="22" y2="44" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="56" y1="16" x2="22" y2="44" stroke="#FF875F" strokeWidth="2" strokeDasharray="4 3" />
              <line x1="56" y1="16" x2="90" y2="44" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="56" y1="16" x2="90" y2="44" stroke="#FF875F" strokeWidth="2" strokeDasharray="4 3" />
              <path d="M 40 28 Q 56 38 72 28" fill="none" stroke="#D8F36A" strokeWidth="1.5" strokeDasharray="3 2" />
              {/* O atoms */}
              <circle cx="22" cy="44" r="18" fill="url(#s9SphereO)" stroke="#FF875F" strokeWidth="1.5" />
              <text x="22" y="49" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle">O⁻²</text>
              <circle cx="90" cy="44" r="18" fill="url(#s9SphereO)" stroke="#FF875F" strokeWidth="1.5" />
              <text x="90" y="49" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle">O⁻²</text>
              {/* N atom */}
              <circle cx="56" cy="16" r="21" fill="url(#s9SphereN)" stroke="#54D7E8" strokeWidth="1.5" />
              <text x="56" y="22" fill="#FFFFFF" fontSize="12.5" fontWeight="900" textAnchor="middle">N⁺⁴</text>
              <circle cx="56" cy="-8" r="3" fill="#D8F36A" />
            </g>

            <text x="869" y="195" fill="#FF875F" fontSize="12.5" fontWeight="900" textAnchor="middle">
              Khí màu nâu đỏ • Góc liên kết ≈ 134°
            </text>
          </svg>
        </div>

        {/* 2 Key Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="bg-[#102838]/90 p-3.5 rounded-2xl border border-[#29485A] flex items-start gap-2.5 text-xs text-[#DCE6F0]">
            <CheckCircle2 size={17} className="text-[#D8F36A] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Điểm cần nhớ khi viết phương trình:</strong>
              Luôn đặt hệ số <strong className="text-[#D8F36A]">2</strong> trước cả <strong>NO</strong> và <strong>NO₂</strong> để bảo toàn 2 nguyên tử N và 4 nguyên tử O ở hai vế.
            </div>
          </div>

          <div className="bg-[#102838]/90 p-3.5 rounded-2xl border border-[#29485A] flex items-start gap-2.5 text-xs text-[#DCE6F0]">
            <AlertCircle size={17} className="text-[#FF875F] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Vì sao NO₂ là mắt xích quyết định?</strong>
              Khác với NO hầu như không phản ứng với nước, <strong>NO₂</strong> tan và phản ứng mạnh trong các giọt nước mây để tạo ra axit nitric (HNO₃) ở Bước 3.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
