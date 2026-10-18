import React from 'react';
import { TreePine, Layers } from 'lucide-react';

export default function Slide14ImpactSoilForest() {
  return (
    <div className="w-full min-h-full flex flex-col justify-between py-1 gap-3 relative">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#F06B70]/15 border border-[#F06B70]/35 text-[#F06B70] text-xs font-bold tracking-wider uppercase">
            Hậu quả sinh thái 2 / 4 • Hóa học thổ nhưỡng &amp; Cây rừng
          </span>
          <span className="text-xs text-[#A8BBC8]">Cơ chế trao đổi cation trên keo đất và rửa trôi khoáng chất</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          ĐẤT MẤT KHẢ NĂNG GIỮ DINH DƯỠNG — RỄ CÂY CHỊU ÁP LỰC
        </h2>
      </div>

      {/* Main Grid: Left (7 cols) Detailed Soil & Root Cutaway SVG | Right (5 cols) 4-Step Cause-Effect Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto items-center">
        {/* Left Column (7 cols): Detailed 3-Horizon Soil & Cation Exchange SVG */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-4 rounded-3xl border border-[#29485A]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#D8F36A] uppercase tracking-wider flex items-center gap-1.5">
                <TreePine size={16} /> Sơ đồ cắt lớp 3 tầng đất, bộ rễ &amp; rửa trôi ion dinh dưỡng
              </span>
              <span className="text-xs font-mono text-[#A8BBC8]">Keo đất tích điện âm (Micelle⁻)</span>
            </div>

            <svg
              viewBox="0 0 680 340"
              className="w-full h-auto rounded-2xl select-none shadow-2xl"
              role="img"
              aria-labelledby="s14SoilTitle s14SoilDesc"
            >
              <title id="s14SoilTitle">Sơ đồ mặt cắt 3 tầng đất, bộ rễ cây và quá trình H+ rửa trôi Ca2+, Mg2+ cùng giải phóng Al3+</title>
              <desc id="s14SoilDesc">
                Lát cắt đất gồm 3 tầng: H+ đi vào đất đẩy Ca2+, Mg2+ khỏi hạt keo đất trôi xuống tầng sâu, đồng thời giải phóng Al3+ gây hại chóp rễ làm tán cây suy yếu.
              </desc>
              <defs>
                <linearGradient id="s14HorizonO" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A3525" />
                  <stop offset="100%" stopColor="#352418" />
                </linearGradient>
                <linearGradient id="s14HorizonB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#352418" />
                  <stop offset="100%" stopColor="#25170F" />
                </linearGradient>
                <linearGradient id="s14HorizonC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#20150F" />
                  <stop offset="100%" stopColor="#10141A" />
                </linearGradient>
                <marker id="s14ArrDown" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#54D7E8" />
                </marker>
              </defs>

              {/* Sky Atmosphere Background */}
              <rect width="680" height="142" fill="#061522" />

              {/* Acid Rain Streaks Falling from Sky */}
              <g stroke="#D8F36A" strokeWidth="1.8" strokeDasharray="5 4" className="animate-dash-flow" opacity="0.8">
                <line x1="65" y1="8" x2="52" y2="62" />
                <line x1="245" y1="8" x2="232" y2="80" />
                <line x1="395" y1="8" x2="382" y2="80" />
                <line x1="550" y1="8" x2="537" y2="80" />
              </g>

              {/* Tree Above Ground (Left Healthy Pine vs Right Waldsterben Chlorosis) */}
              <g transform="translate(110, 12)">
                {/* Trunk with bark texture */}
                <path d="M 36 94 L 32 130 H 58 L 54 94 Z" fill="#5D4037" stroke="#3E2723" strokeWidth="1.5" />
                
                {/* Left Side: Healthy Vibrant Evergreen Pine Canopy */}
                <path d="M 45 4 L 4 58 H 45 Z" fill="#2E7D32" stroke="#1B5E20" strokeWidth="1.2" />
                <path d="M 45 28 L -6 96 H 45 Z" fill="#388E3C" stroke="#2E7D32" strokeWidth="1.2" />
                <circle cx="20" cy="52" r="3" fill="#81C784" opacity="0.6" />
                <circle cx="15" cy="82" r="3.5" fill="#81C784" opacity="0.6" />

                {/* Right Side: Chlorotic & Damaged Crown (Waldsterben Dieback) */}
                <path d="M 45 4 L 86 58 H 45 Z" fill="#827717" stroke="#558B2F" strokeWidth="1.2" />
                <path d="M 45 28 L 96 96 H 45 Z" fill="#9E9D24" stroke="#827717" strokeWidth="1.2" />
                {/* Defoliated / bare branch twigs */}
                <line x1="68" y1="46" x2="98" y2="38" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
                <line x1="78" y1="76" x2="110" y2="68" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />

                {/* Annotation pill */}
                <rect x="98" y="42" width="168" height="26" rx="8" fill="#071521" fillOpacity="0.9" stroke="#D8F36A" strokeWidth="1.2" />
                <text x="182" y="59" textAnchor="middle" fill="#D8F36A" fontSize="10.5" fontWeight="800">
                  Vàng lá (Thiếu Mg²⁺ tạo diệp lục)
                </text>
              </g>

              {/* Soil Profile Horizons */}
              {/* Horizon 1: O/A Topsoil with organic leaf litter */}
              <rect x="0" y="142" width="680" height="60" fill="url(#s14HorizonO)" stroke="#8D6E63" strokeWidth="1.5" />
              {/* Surface organic mulch layer */}
              <line x1="0" y1="142" x2="680" y2="142" stroke="#8BC34A" strokeWidth="3" opacity="0.75" />
              <text x="665" y="164" textAnchor="end" fill="#F5F5F5" fontSize="12" fontWeight="900" fontFamily="monospace">
                Tầng O/A: Đất mặt &amp; Thảm mục mùn
              </text>

              {/* Horizon 2: B Subsoil (Clay Mineral Exchange & Leaching Zone) */}
              <rect x="0" y="202" width="680" height="70" fill="url(#s14HorizonB)" stroke="#5D4037" strokeWidth="1.5" />
              <text x="665" y="224" textAnchor="end" fill="#D7CCC8" fontSize="12" fontWeight="900" fontFamily="monospace">
                Tầng B: Tích tụ &amp; Keo đất sét (Trao đổi ion)
              </text>

              {/* Horizon 3: C Bedrock & Deep Groundwater */}
              <rect x="0" y="272" width="680" height="68" fill="url(#s14HorizonC)" />
              <text x="665" y="296" textAnchor="end" fill="#90A4AE" fontSize="12" fontWeight="900" fontFamily="monospace">
                Tầng C: Khoáng nền &amp; Nước ngầm (Rửa trôi)
              </text>

              {/* Deep Branching Root System */}
              <g stroke="#D7CCC8" fill="none" strokeLinecap="round">
                <path d="M 155 142 Q 135 188 90 244" strokeWidth="5" />
                <path d="M 155 142 Q 160 205 190 265" strokeWidth="5" />
                <path d="M 155 162 Q 210 195 250 236" strokeWidth="3.5" />
                <path d="M 138 180 Q 102 204 65 220" strokeWidth="3" />
                {/* Damaged Necrotic Root Tip Choked by Al3+ */}
                <path d="M 168 214 Q 200 230 224 256" strokeWidth="3" stroke="#F06B70" />
              </g>

              {/* Al3+ Root Tip Necrosis Callout */}
              <g transform="translate(210, 242)">
                <circle cx="22" cy="18" r="16" fill="#F06B70" stroke="#FFFFFF" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 8px rgba(240,107,112,0.6))' }} />
                <text x="22" y="23" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900" fontFamily="monospace">
                  Al³⁺
                </text>
                <rect x="44" y="6" width="138" height="24" rx="6" fill="#241416" stroke="#F06B70" />
                <text x="113" y="22" textAnchor="middle" fill="#FF875F" fontSize="10.5" fontWeight="800">
                  Độc chóp rễ &amp; lông hút
                </text>
              </g>

              {/* Clay Colloid (Keo Đất) Cation Exchange Model Pod (Center-Right in Soil) */}
              <g transform="translate(325, 150)">
                <rect x="0" y="0" width="235" height="96" rx="14" fill="#071521" fillOpacity="0.95" stroke="#D8F36A" strokeWidth="1.8" />
                <rect x="12" y="6" width="211" height="20" rx="5" fill="#0A2234" />
                <text x="117" y="20" textAnchor="middle" fill="#D8F36A" fontSize="10.5" fontWeight="900" fontFamily="monospace">
                  CƠ CHẾ TRAO ĐỔI CATION TRÊN KEO ĐẤT
                </text>
                
                {/* Clay Micelle Platelet with Negative Charges */}
                <ellipse cx="68" cy="58" rx="46" ry="24" fill="#3E2723" stroke="#A1887F" strokeWidth="2" />
                <text x="68" y="56" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="900">
                  Hạt Keo Đất
                </text>
                <text x="68" y="70" textAnchor="middle" fill="#D8F36A" fontSize="11" fontWeight="900" fontFamily="monospace">
                  (Micelle⁻)
                </text>

                {/* Incoming H+ Cations Displacing Base Nutrients */}
                <circle cx="16" cy="38" r="11" fill="#D8F36A" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="16" y="42" textAnchor="middle" fill="#050E17" fontSize="10" fontWeight="900">H⁺</text>
                <circle cx="120" cy="38" r="11" fill="#D8F36A" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="120" y="42" textAnchor="middle" fill="#050E17" fontSize="10" fontWeight="900">H⁺</text>

                {/* Displaced Ca2+, Mg2+, K+ Nutrients Being Washed Down */}
                <text x="178" y="46" textAnchor="middle" fill="#54D7E8" fontSize="10.5" fontWeight="900">
                  Bị đẩy trôi ↓
                </text>
                {/* Ca2+ */}
                <circle cx="152" cy="70" r="13" fill="#F4D03F" stroke="#050E17" strokeWidth="1" />
                <text x="152" y="74" textAnchor="middle" fill="#050E17" fontSize="9" fontWeight="900">Ca²⁺</text>
                {/* Mg2+ */}
                <circle cx="182" cy="70" r="13" fill="#8FCB89" stroke="#050E17" strokeWidth="1" />
                <text x="182" y="74" textAnchor="middle" fill="#050E17" fontSize="9" fontWeight="900">Mg²⁺</text>
                {/* K+ */}
                <circle cx="210" cy="70" r="11" fill="#FF875F" stroke="#050E17" strokeWidth="1" />
                <text x="210" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="900">K⁺</text>
              </g>

              {/* Downward Leaching Flow Trails into Horizon C */}
              <g stroke="#54D7E8" strokeWidth="2.5" strokeDasharray="5 4" className="animate-dash-flow">
                <line x1="480" y1="248" x2="480" y2="310" markerEnd="url(#s14ArrDown)" />
                <line x1="515" y1="248" x2="515" y2="310" markerEnd="url(#s14ArrDown)" />
              </g>
              <rect x="250" y="306" width="380" height="24" rx="6" fill="#071521" stroke="#54D7E8" strokeOpacity="0.4" />
              <text x="440" y="322" textAnchor="middle" fill="#54D7E8" fontSize="11" fontWeight="800">
                Khoáng Ca²⁺, Mg²⁺, K⁺ bị cuốn sâu xuống nước ngầm, cây kiệt dinh dưỡng
              </text>
            </svg>
          </div>
        </div>

        {/* Right Column (5 cols): 4-Step Cause-Effect Sequence per acid.md Slide 14 */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="glass-panel p-3.5 rounded-2xl border-l-4 border-l-[#D8F36A]">
            <span className="text-xs font-mono font-bold text-[#D8F36A] uppercase block">Bước 1 • Xâm nhập</span>
            <h3 className="font-bold text-sm sm:text-base text-white">Ion H⁺ đi vào dung dịch đất</h3>
            <p className="text-xs text-[#DCE6F0] mt-0.5 leading-relaxed">
              Lắng đọng axit đưa lượng lớn ion <strong>H⁺</strong> thấm qua tầng thảm mục xuống vùng rễ cây.
            </p>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl border-l-4 border-l-[#54D7E8]">
            <span className="text-xs font-mono font-bold text-[#54D7E8] uppercase block">Bước 2 • Rửa trôi dinh dưỡng (Leaching)</span>
            <h3 className="font-bold text-sm sm:text-base text-white">Đẩy trôi Ca²⁺, Mg²⁺, K⁺ khỏi keo đất</h3>
            <p className="text-xs text-[#DCE6F0] mt-0.5 leading-relaxed">
              Ion H⁺ có ái lực mạnh chiếm chỗ trên bề mặt hạt keo đất tích điện âm, đẩy các khoáng chất thiết yếu (<strong className="text-[#54D7E8]">Ca²⁺</strong>, <strong className="text-[#8FCB89]">Mg²⁺</strong>, <strong className="text-[#FF875F]">K⁺</strong>) vào nước ngầm trôi mất.
            </p>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl border-l-4 border-l-[#F06B70]">
            <span className="text-xs font-mono font-bold text-[#F06B70] uppercase block">Bước 3 • Độc tính nhôm</span>
            <h3 className="font-bold text-sm sm:text-base text-white">Al³⁺ trở nên linh động, gây hại rễ</h3>
            <p className="text-xs text-[#DCE6F0] mt-0.5 leading-relaxed">
              Trong một số loại đất chua, ion <strong className="text-[#F06B70]">Al³⁺</strong> được giải phóng làm tổn thương tế bào chóp rễ và cản trở cây hấp thụ nước, khoáng chất.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#071521]/90 border border-[#29485A] flex items-start gap-2.5 text-xs text-[#DCE6F0]">
            <Layers size={17} className="text-[#D8F36A] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Bước 4 • Hệ quả sinh thái (Tùy loại đất &amp; khả năng đệm):</strong>
              Cây rừng không bị “đốt cháy tức thì”, mà suy yếu dần (vàng lá do thiếu Mg tạo diệp lục), giảm sinh trưởng và dễ gục ngã trước sâu bệnh, băng giá hoặc hạn hán.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
