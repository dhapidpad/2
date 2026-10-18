import React, { useState } from 'react';
import { Waves, Fish, Layers, ArrowRight } from 'lucide-react';

export default function Slide13ImpactLakes() {
  const [acidified, setAcidified] = useState(true);

  return (
    <div className="w-full min-h-full flex flex-col justify-between py-1 gap-3 relative">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#F06B70]/15 border border-[#F06B70]/35 text-[#F06B70] text-xs font-bold tracking-wider uppercase">
            Hậu quả sinh thái 1 / 4 • Hệ sinh thái nước ngọt
          </span>
          <span className="text-xs text-[#A8BBC8]">Độc tính nhôm Al³⁺ và sự xáo trộn chuỗi thức ăn</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          KHI pH HỒ GIẢM, CẢ HỆ SINH THÁI CÓ THỂ BỊ ẢNH HƯỞNG
        </h2>
      </div>

      {/* Main Grid: Left (7 cols) Lake Cross-Section SVG + Food Web | Right (5 cols) Mechanisms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto items-center">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="glass-panel p-4 rounded-3xl border border-[#29485A]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <div className="text-xs font-bold text-[#54D7E8] uppercase tracking-wider flex items-center gap-1.5">
                <Waves size={16} /> Sơ đồ mặt cắt địa hóa &amp; sinh thái hồ nước
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setAcidified(false)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                    !acidified
                      ? 'bg-[#8FCB89]/20 border-[#8FCB89] text-[#8FCB89]'
                      : 'bg-[#071521] border-[#29485A] text-[#A8BBC8]'
                  }`}
                >
                  Hồ ổn định (pH ≈ 6,5)
                </button>
                <button
                  onClick={() => setAcidified(true)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                    acidified
                      ? 'bg-[#F06B70]/20 border-[#F06B70] text-[#F06B70]'
                      : 'bg-[#071521] border-[#29485A] text-[#A8BBC8]'
                  }`}
                >
                  Khi pH giảm thấp (Minh họa)
                </button>
              </div>
            </div>

            <svg
              viewBox="0 0 680 290"
              className="w-full h-auto rounded-2xl select-none shadow-2xl"
              role="img"
              aria-labelledby="s13LakeTitle s13LakeDesc"
            >
              <title id="s13LakeTitle">Sơ đồ mặt cắt hồ nước chịu tác động của lắng đọng axit và giải phóng nhôm Al3+</title>
              <desc id="s13LakeDesc">
                Minh họa khái niệm mặt cắt hồ nước: mưa axit đưa H+ vào hồ, hòa tan Al3+ từ bùn trầm tích, gây stress cho sinh vật phù du, ấu trùng và cá.
              </desc>
              <defs>
                {/* Stratified Water Columns */}
                <linearGradient id="s13WaterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={acidified ? '#184458' : '#1D6888'} />
                  <stop offset="45%" stopColor={acidified ? '#113346' : '#14516E'} />
                  <stop offset="80%" stopColor={acidified ? '#0C2434' : '#0E3B52'} />
                  <stop offset="100%" stopColor="#05141E" />
                </linearGradient>

                {/* Sunbeams underwater filter */}
                <linearGradient id="s13Sunbeam" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#54D7E8" stopOpacity="0" />
                </linearGradient>

                <marker id="s13ArrRed" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#FF875F" />
                </marker>
              </defs>

              {/* Sky & Riparian Forest Shoreline */}
              <rect width="680" height="290" rx="16" fill="#06141F" />
              
              {/* Shoreline Bank & Riparian Rocks */}
              <path d="M 0 54 L 115 54 L 148 98 L 0 98 Z" fill="#1C382B" stroke="#2D5A45" strokeWidth="1.5" />
              {/* Little pine on bank */}
              <polygon points="45,54 55,28 65,54" fill="#2E7D32" />
              <polygon points="48,36 55,16 62,36" fill="#388E3C" />
              <polygon points="75,54 83,32 91,54" fill="#2E7D32" />

              {/* Acid Rain Precipitation Streaks */}
              {acidified ? (
                <g stroke="#D8F36A" strokeWidth="2" strokeDasharray="5 4" className="animate-dash-flow" opacity="0.85">
                  <line x1="175" y1="8" x2="158" y2="52" />
                  <line x1="285" y1="8" x2="268" y2="52" />
                  <line x1="405" y1="8" x2="388" y2="52" />
                  <line x1="525" y1="8" x2="508" y2="52" />
                  <line x1="635" y1="8" x2="618" y2="52" />
                </g>
              ) : (
                <g stroke="#54D7E8" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.4">
                  <line x1="285" y1="8" x2="278" y2="50" />
                  <line x1="455" y1="8" x2="448" y2="50" />
                </g>
              )}

              {/* Water Body (Epilimnion & Stratification) */}
              <path
                d="M 115 56 Q 300 48 490 56 T 680 54 V 224 Q 390 246 142 216 L 115 56 Z"
                fill="url(#s13WaterGrad)"
                stroke={acidified ? '#FF875F' : '#54D7E8'}
                strokeWidth="2.2"
              />

              {/* Sunbeam Light Rays when healthy */}
              {!acidified && (
                <g fill="url(#s13Sunbeam)">
                  <polygon points="180,56 240,56 310,180 230,180" />
                  <polygon points="340,56 400,56 490,190 410,190" />
                </g>
              )}

              {/* Surface Status Banner */}
              <rect x="180" y="66" width="360" height="28" rx="8" fill="#050E17" fillOpacity="0.88" stroke={acidified ? '#FF875F' : '#54D7E8'} strokeWidth="1.2" />
              <text x="360" y="85" textAnchor="middle" fill={acidified ? '#FF875F' : '#8FCB89'} fontSize="12.5" fontWeight="900" fontFamily="monospace">
                {acidified
                  ? 'MÔI TRƯỜNG AXIT HÓA • [H⁺] TĂNG ⇒ pH < 5,6'
                  : 'MÔI TRƯỜNG CÂN BẰNG • HỆ ĐỆM ỔN ĐỊNH (pH ≈ 6,5)'}
              </text>

              {/* Plankton & Sensitive Mayfly Larvae (Left Tier) */}
              <g opacity={acidified ? 0.35 : 0.95} className="transition-opacity duration-500">
                {/* Daphnia / zooplankton */}
                <ellipse cx="195" cy="126" rx="14" ry="10" fill="#8FCB89" fillOpacity="0.25" stroke="#8FCB89" strokeWidth="1.5" />
                <circle cx="195" cy="126" r="4.5" fill="#8FCB89" />
                <path d="M 185 120 L 175 110 M 185 130 L 175 140" stroke="#8FCB89" strokeWidth="1.5" />
                
                {/* Mayfly nymph / aquatic insect */}
                <ellipse cx="235" cy="148" rx="16" ry="7" transform="rotate(-15 235 148)" fill="#54D7E8" fillOpacity="0.25" stroke="#54D7E8" strokeWidth="1.5" />
                <circle cx="225" cy="145" r="3.5" fill="#54D7E8" />
                
                <text x="212" y="176" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">
                  Phù du &amp; Ấu trùng {acidified ? '(Suy giảm mạnh)' : '(Phong phú)'}
                </text>
              </g>

              {/* Detailed Fish Illustration (Center-Right) */}
              <g transform="translate(370, 118)">
                {/* Fish Body with sleek organic contours */}
                <path
                  d="M 20 22 C 35 6, 85 8, 105 22 C 85 36, 35 38, 20 22 Z"
                  fill={acidified ? '#FF875F' : '#54D7E8'}
                  fillOpacity="0.85"
                  stroke={acidified ? '#F06B70' : '#FFFFFF'}
                  strokeWidth="1.5"
                />
                {/* Tail fin */}
                <polygon points="105,22 130,6 124,22 130,38" fill={acidified ? '#FF875F' : '#54D7E8'} />
                {/* Dorsal fin */}
                <path d="M 52 11 Q 68 -2 82 10 Z" fill={acidified ? '#F06B70' : '#82F2FF'} />
                {/* Pectoral fin */}
                <path d="M 45 25 Q 58 35 52 40 Z" fill={acidified ? '#F06B70' : '#82F2FF'} />
                {/* Fish eye */}
                <circle cx="32" cy="18" r="3.5" fill="#FFFFFF" />
                <circle cx="32" cy="18" r="2" fill="#050E17" />
                
                {/* Operculum & Gill Slit */}
                <path
                  d="M 45 12 Q 52 22 45 32"
                  fill="none"
                  stroke={acidified ? '#FF2A2A' : '#FFFFFF'}
                  strokeWidth={acidified ? '3.5' : '2'}
                  strokeLinecap="round"
                />

                {/* Gill Damage Callout when acidified */}
                {acidified && (
                  <g>
                    {/* Pulsing warning indicator at gill */}
                    <circle cx="48" cy="22" r="9" fill="none" stroke="#FF875F" strokeWidth="1.5" strokeDasharray="3 3" className="animate-spin" />
                    {/* Mucus / Al3+ precipitate particles choking gills */}
                    <circle cx="50" cy="16" r="3" fill="#FFFFFF" />
                    <circle cx="53" cy="24" r="3" fill="#FFFFFF" />
                    <circle cx="49" cy="30" r="2.5" fill="#FFFFFF" />
                  </g>
                )}

                <text x="65" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800">
                  {acidified ? 'Cá ngạt thở: Al³⁺ kích thích màng nhầy bít tắc mang' : 'Hô hấp & trao đổi ion bình thường'}
                </text>
              </g>

              {/* Aluminum (Al3+) Mobilization from Clay & Sediment */}
              {acidified && (
                <g>
                  {/* Upward Leaching Conduits */}
                  <path d="M 305 224 L 370 165" stroke="#FF875F" strokeWidth="2.5" strokeDasharray="5 3" markerEnd="url(#s13ArrRed)" className="animate-dash-flow" />
                  <circle cx="305" cy="224" r="15" fill="#F06B70" stroke="#FFFFFF" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 6px rgba(240,107,112,0.6))' }} />
                  <text x="305" y="229" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900" fontFamily="monospace">
                    Al³⁺
                  </text>
                  
                  {/* Sediment chemical formula badge */}
                  <rect x="475" y="180" width="190" height="36" rx="10" fill="#2A1416" stroke="#F06B70" strokeWidth="1.5" />
                  <text x="570" y="196" textAnchor="middle" fill="#FF875F" fontSize="11" fontWeight="900" fontFamily="monospace">
                    Al(OH)₃ + 3H⁺ → Al³⁺ + 3H₂O
                  </text>
                  <text x="570" y="210" textAnchor="middle" fill="#DCE6F0" fontSize="9.5" fontWeight="700">
                    Nhôm trơ trong bùn sét bị hòa tan
                  </text>
                </g>
              )}

              {/* Benthic Sediment & Bedrock */}
              <path d="M 0 98 L 142 216 Q 390 246 680 224 V 290 H 0 Z" fill="#141E26" stroke="#29485A" strokeWidth="2" />
              <text x="380" y="260" textAnchor="middle" fill="#A8BBC8" fontSize="12" fontWeight="800">
                Tầng trầm tích đáy hồ &amp; Đá nền (Khả năng đệm khác nhau tùy vùng địa chất)
              </text>
              <text x="380" y="278" textAnchor="middle" fill="#6E8A9E" fontSize="10" fontStyle="italic">
                *Sơ đồ minh họa khái niệm sinh thái, không phải dữ liệu thống kê quần thể.
              </text>
            </svg>
          </div>

          {/* 3-Link Trophic Cascade Strip */}
          <div className="glass-panel p-3.5 rounded-2xl border border-[#29485A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <span className="font-bold text-[#F06B70] uppercase tracking-wider shrink-0">
              Dây chuyền xáo trộn chuỗi thức ăn:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end">
              <span className={`px-2.5 py-1 rounded-xl bg-[#071521] border border-[#29485A] text-[#8FCB89] font-semibold transition-opacity ${acidified ? 'opacity-50' : 'opacity-100'}`}>
                1. Sinh vật phù du &amp; Giáp xác
              </span>
              <ArrowRight size={14} className="text-[#FF875F]" />
              <span className={`px-2.5 py-1 rounded-xl bg-[#071521] border border-[#29485A] text-[#54D7E8] font-semibold transition-opacity ${acidified ? 'opacity-65' : 'opacity-100'}`}>
                2. Trứng cá, Ấu trùng &amp; Cá nhỏ
              </span>
              <ArrowRight size={14} className="text-[#FF875F]" />
              <span className="px-2.5 py-1 rounded-xl bg-[#071521] border border-[#29485A] text-white font-semibold">
                3. Cá lớn &amp; Chim ăn cá thiếu thức ăn
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): 3 Core Scientific Mechanisms */}
        <div className="lg:col-span-5 space-y-3">
          <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-[#F06B70]">
            <h3 className="font-bold text-sm sm:text-base text-white mb-1 flex items-center gap-2">
              <Fish size={17} className="text-[#F06B70]" /> 1. Stress sinh lý &amp; Suy giảm sinh sản
            </h3>
            <p className="text-xs sm:text-sm text-[#DCE6F0] leading-relaxed">
              Các loài thủy sinh có ngưỡng chịu đựng pH khác nhau. Khi nước axit hơn, nhiều loại <strong>trứng cá, ấu trùng, động vật không xương sống và sinh vật phù du</strong> nhạy cảm bị suy giảm trước tiên, làm rối loạn cân bằng muối – nước trong cơ thể cá.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-[#FF875F]">
            <h3 className="font-bold text-sm sm:text-base text-white mb-1">
              2. Độc tính kép từ ion Nhôm linh động (Al³⁺)
            </h3>
            <p className="text-xs sm:text-sm text-[#DCE6F0] leading-relaxed">
              Môi trường axit làm nhôm nằm yên trong khoáng sét đất/bùn đáy hòa tan thành ion <strong className="text-[#FF875F]">Al³⁺</strong> tự do:
              <span className="block font-mono text-xs text-[#D8F36A] bg-[#050E17] px-2.5 py-1 rounded-lg border border-[#29485A] my-1.5">
                Al(OH)₃(s) + 3H⁺(aq) &rarr; Al³⁺(aq) + 3H₂O(l)
              </span>
              Ion Al³⁺ bám lên mang cá, kích thích tiết dịch nhầy làm bít tắc trao đổi oxygen và gây tổn thương rễ thủy sinh.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#071521]/90 border border-[#29485A] flex items-start gap-2.5 text-xs text-[#DCE6F0]">
            <Layers size={18} className="text-[#D8F36A] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#D8F36A] block mb-0.5">3. Không phải mọi hồ đều phản ứng giống nhau:</strong>
              Đất và đá nền xung quanh lưu vực có <strong>khả năng đệm (trung hòa axit)</strong> rất khác nhau. Hồ trên nền đá vôi (CaCO₃) có sức đề kháng tốt hơn nhiều so với hồ trên nền đá granite nghèo kiềm.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
