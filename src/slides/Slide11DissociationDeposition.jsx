import React from 'react';
import { CloudRain, Wind } from 'lucide-react';
import EquationCard from '../components/EquationCard';

export default function Slide11DissociationDeposition() {
  return (
    <div className="w-full min-h-full flex flex-col justify-between py-1 gap-3 relative">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#D8F36A]/15 border border-[#D8F36A]/35 text-[#D8F36A] text-xs font-bold tracking-wider uppercase">
            Sự điện ly &amp; Lắng đọng • Kết nối hóa học với môi trường
          </span>
          <span className="text-xs text-[#A8BBC8]">Lắng đọng axit gồm cả dạng ướt và dạng khô</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          AXIT HÒA TAN — pH GIẢM — GIÁNG THỦY LẮNG ĐỌNG
        </h2>
      </div>

      {/* Main Content */}
      <div className="my-auto space-y-3.5">
        {/* Strong Acid Dissociation Equation */}
        <EquationCard
          title="Phương trình điện ly hoàn toàn của axit nitric trong giọt nước mưa"
          badge="Chất điện ly mạnh (Strong Electrolyte)"
          badgeColor="lime"
          highlight={true}
          atomBalance="1 H, 1 N, 3 O  •  Bảo toàn điện tích: (+1) + (−1) = 0"
          equationHtml="HNO<sub>3</sub>(aq) &rarr; H<sup>+</sup>(aq) + NO<sub>3</sub><sup>&minus;</sup>(aq)"
          note="HNO₃ là một axit mạnh nên phân ly gần như hoàn toàn trong nước, giải phóng lượng lớn ion H⁺ (hay H₃O⁺) làm giảm mạnh chỉ số pH của nước mưa xuống dưới mốc 5,6."
        />

        {/* Grid: Left (7 cols) Cutaway Raindrop & Dual Deposition SVG | Right (5 cols) Wet vs Dry Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Left Column (7 cols): SVG Diagram per acid.md Slide 11 */}
          <div className="lg:col-span-7 glass-panel p-4 rounded-3xl border border-[#29485A] flex items-center justify-center shadow-2xl">
            <svg
              viewBox="0 0 680 290"
              className="w-full h-auto select-none"
              role="img"
              aria-labelledby="s11DepTitle s11DepDesc"
            >
              <title id="s11DepTitle">Sơ đồ giọt mưa phân ly HNO3 thành H+ và NO3- cùng hai nhánh lắng đọng ướt và khô</title>
              <desc id="s11DepDesc">
                Bên trái là giọt mưa cắt lớp hiển thị sự phân ly HNO3 thành H+ và NO3- làm giảm pH; bên phải là hai con đường lắng đọng ướt và lắng đọng khô xuống hồ, đất và công trình.
              </desc>
              <defs>
                <radialGradient id="s11DropLens" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#C4FAFF" stopOpacity="0.75" />
                  <stop offset="40%" stopColor="#38BED4" stopOpacity="0.5" />
                  <stop offset="75%" stopColor="#155E75" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#082233" stopOpacity="0.95" />
                </radialGradient>
                <linearGradient id="s11LandscapeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#122B27" />
                  <stop offset="100%" stopColor="#091614" />
                </linearGradient>
                <marker id="s11ArrCyan" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#54D7E8" />
                </marker>
                <marker id="s11ArrCoral" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#FF875F" />
                </marker>
              </defs>

              {/* Left Section: Cutaway Raindrop & Ion Dissociation */}
              <rect x="8" y="8" width="280" height="274" rx="20" fill="#081A28" stroke="#54D7E8" strokeWidth="1.5" />
              <rect x="22" y="18" width="252" height="26" rx="8" fill="#050E17" stroke="#54D7E8" strokeOpacity="0.4" />
              <text x="148" y="35" textAnchor="middle" fill="#54D7E8" fontSize="12" fontWeight="900" fontFamily="monospace">
                1. GIỌT MƯA CẮT LỚP • ĐIỆN LY HOÀN TOÀN
              </text>

              {/* 3D Glass Droplet Body */}
              <path
                d="M 148 52 C 112 102 82 142 82 180 A 66 66 0 0 0 214 180 C 214 142 184 102 148 52 Z"
                fill="url(#s11DropLens)"
                stroke="#D8F36A"
                strokeWidth="2.5"
                style={{ filter: 'drop-shadow(0 6px 20px rgba(216,243,106,0.25))' }}
              />

              {/* Droplet Highlight Arc */}
              <path
                d="M 136 68 C 112 108 96 142 96 178"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.65"
              />

              {/* Dissociation arrow & ions inside Raindrop */}
              <rect x="108" y="98" width="80" height="24" rx="6" fill="#050E17" stroke="#D8F36A" strokeOpacity="0.6" />
              <text x="148" y="114" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="monospace">
                HNO₃(aq)
              </text>
              <path d="M 136 124 L 118 146 M 160 124 L 178 146" stroke="#D8F36A" strokeWidth="2.5" markerEnd="url(#s11ArrCyan)" />

              {/* Hydrated H+ ion */}
              <circle cx="114" cy="176" r="21" fill="#D8F36A" stroke="#FFFFFF" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 8px rgba(216,243,106,0.6))' }} />
              <text x="114" y="182" textAnchor="middle" fill="#050E17" fontSize="16" fontWeight="900" fontFamily="monospace">H⁺</text>

              {/* Nitrate NO3- ion */}
              <circle cx="182" cy="176" r="23" fill="#061B29" stroke="#54D7E8" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 8px rgba(84,215,232,0.6))' }} />
              <text x="182" y="182" textAnchor="middle" fill="#54D7E8" fontSize="13.5" fontWeight="900" fontFamily="monospace">NO₃⁻</text>

              {/* Mini Reference pH Bar (0-14) at bottom of left panel */}
              <rect x="20" y="226" width="256" height="46" rx="10" fill="#050E17" stroke="#29485A" />
              <text x="148" y="240" textAnchor="middle" fill="#DCE6F0" fontSize="10.5" fontWeight="800">
                Thang pH: [H⁺] tăng mạnh ⇒ pH &lt; 5,6
              </text>
              <rect x="30" y="246" width="236" height="12" rx="6" fill="#1E293B" />
              <rect x="30" y="246" width="94" height="12" rx="6" fill="#F06B70" />
              <rect x="124" y="246" width="142" height="12" rx="6" fill="#54D7E8" fillOpacity="0.35" />
              {/* Tick marker at 5.6 */}
              <line x1="124" y1="242" x2="124" y2="262" stroke="#D8F36A" strokeWidth="3" />
              <circle cx="124" cy="252" r="3" fill="#D8F36A" />
              <text x="34" y="243" fill="#A8BBC8" fontSize="8.5" fontFamily="monospace">0</text>
              <text x="124" y="241" fill="#D8F36A" fontSize="9.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">5,6</text>
              <text x="154" y="243" fill="#8FCB89" fontSize="8.5" fontFamily="monospace">7</text>
              <text x="262" y="243" fill="#A8BBC8" fontSize="8.5" textAnchor="end" fontFamily="monospace">14</text>

              {/* Right Section: Two Deposition Branches */}
              <rect x="298" y="8" width="374" height="274" rx="20" fill="#081A28" stroke="#29485A" strokeWidth="1.5" />
              <rect x="312" y="18" width="346" height="26" rx="8" fill="#050E17" stroke="#D8F36A" strokeOpacity="0.4" />
              <text x="485" y="35" textAnchor="middle" fill="#D8F36A" fontSize="12" fontWeight="900" fontFamily="monospace">
                2. HAI CON ĐƯỜNG LẮNG ĐỌNG AXIT XUỐNG MẶT ĐẤT
              </text>

              {/* Wet Branch */}
              <g transform="translate(312, 52)">
                <rect x="0" y="0" width="166" height="142" rx="14" fill="#0A2234" stroke="#54D7E8" strokeWidth="1.8" />
                <rect x="10" y="8" width="146" height="22" rx="6" fill="#050E17" />
                <text x="83" y="23" textAnchor="middle" fill="#54D7E8" fontSize="11" fontWeight="900">
                  LẮNG ĐỌNG ƯỚT (WET)
                </text>
                <text x="83" y="44" textAnchor="middle" fill="#DCE6F0" fontSize="10.5">
                  Mưa, tuyết, sương mù
                </text>
                {/* Cloud & Shimmering Rain */}
                <ellipse cx="83" cy="64" rx="36" ry="14" fill="#1C4660" stroke="#54D7E8" strokeWidth="1.2" />
                <g stroke="#54D7E8" strokeWidth="2" strokeDasharray="5 4" className="animate-dash-flow">
                  <line x1="62" y1="82" x2="52" y2="132" markerEnd="url(#s11ArrCyan)" />
                  <line x1="83" y1="82" x2="73" y2="132" markerEnd="url(#s11ArrCyan)" />
                  <line x1="104" y1="82" x2="94" y2="132" markerEnd="url(#s11ArrCyan)" />
                </g>
              </g>

              {/* Dry Branch */}
              <g transform="translate(492, 52)">
                <rect x="0" y="0" width="166" height="142" rx="14" fill="#241416" stroke="#FF875F" strokeWidth="1.8" />
                <rect x="10" y="8" width="146" height="22" rx="6" fill="#050E17" />
                <text x="83" y="23" textAnchor="middle" fill="#FF875F" fontSize="11" fontWeight="900">
                  LẮNG ĐỌNG KHÔ (DRY)
                </text>
                <text x="83" y="44" textAnchor="middle" fill="#DCE6F0" fontSize="10.5">
                  Khí NO₂, HNO₃ &amp; bụi PM2.5
                </text>
                {/* Dry aerosol particle flows */}
                <g stroke="#FF875F" strokeWidth="2" strokeDasharray="4 4" className="animate-dash-flow">
                  <line x1="48" y1="64" x2="48" y2="132" markerEnd="url(#s11ArrCoral)" />
                  <line x1="83" y1="64" x2="83" y2="132" markerEnd="url(#s11ArrCoral)" />
                  <line x1="118" y1="64" x2="118" y2="132" markerEnd="url(#s11ArrCoral)" />
                </g>
                <circle cx="48" cy="85" r="4.5" fill="#FF875F" />
                <circle cx="83" cy="98" r="4.5" fill="#D8F36A" />
                <circle cx="118" cy="78" r="4.5" fill="#FF875F" />
              </g>

              {/* Receptor Landscape Surface at Bottom */}
              <g transform="translate(312, 204)">
                <rect x="0" y="0" width="346" height="68" rx="14" fill="url(#s11LandscapeGrad)" stroke="#8FCB89" strokeWidth="1.5" />
                <text x="173" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="900">
                  BỀ MẶT TIẾP NHẬN: AO HỒ • ĐẤT RỪNG • CÔNG TRÌNH ĐÁ
                </text>
                <text x="173" y="44" textAnchor="middle" fill="#D8F36A" fontSize="10.5" fontWeight="700">
                  Hạt bám khô gặp sương/ẩm hòa tan tạo dung dịch H⁺ cục bộ
                </text>
                <text x="173" y="58" textAnchor="middle" fill="#A8BBC8" fontSize="9.5">
                  Cả 2 dạng đều đưa chất gây axit vào chu trình sinh địa hóa
                </text>
              </g>
            </svg>
          </div>

          {/* Right Column (5 cols): 3-Step Summary & Comparison */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3">
            <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-[#54D7E8]">
              <div className="flex items-center gap-2 mb-1">
                <CloudRain size={18} className="text-[#54D7E8]" />
                <h3 className="text-sm sm:text-base font-bold text-white">1. Lắng đọng ướt (Wet Deposition)</h3>
              </div>
              <p className="text-xs text-[#DCE6F0] leading-relaxed">
                Axit nitric (HNO₃) và axit sulfuric (H₂SO₄) hòa tan sẵn trong giọt mây, theo <strong>mưa, tuyết, sương mù hoặc mưa đá</strong> rơi trực tiếp xuống lưu vực hồ, tán rừng và đô thị.
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-[#FF875F]">
              <div className="flex items-center gap-2 mb-1">
                <Wind size={18} className="text-[#FF875F]" />
                <h3 className="text-sm sm:text-base font-bold text-white">2. Lắng đọng khô (Dry Deposition)</h3>
              </div>
              <p className="text-xs text-[#DCE6F0] leading-relaxed">
                Ngay cả những ngày <strong>không mưa</strong>, các phân tử khí axit và hạt bụi mịn chứa muối nitrate (<code className="text-[#FF875F]">NO₃⁻</code>) / sulfate vẫn sa lắng và bám lên lá cây, mặt đất, tượng đá; khi gặp sương đêm hoặc cơn mưa đầu mùa sẽ tạo dung dịch axit đậm đặc cục bộ.
              </p>
            </div>

            {/* 3-Step Takeaway Strip */}
            <div className="p-3.5 rounded-2xl bg-[#071521]/90 border border-[#29485A] space-y-2 text-xs">
              <div className="font-bold text-[#D8F36A] uppercase tracking-wider text-xs">
                Tóm tắt 3 bước chuyển tiếp:
              </div>
              <div className="flex items-center gap-2 text-[#F4F7FA]">
                <span className="w-5 h-5 rounded-full bg-[#54D7E8]/20 text-[#54D7E8] flex items-center justify-center font-mono font-bold text-xs">1</span>
                <span>HNO₃ đi vào giọt mây và phân ly hoàn toàn tạo ion H⁺</span>
              </div>
              <div className="flex items-center gap-2 text-[#D8F36A]">
                <span className="w-5 h-5 rounded-full bg-[#D8F36A]/20 text-[#D8F36A] flex items-center justify-center font-mono font-bold text-xs">2</span>
                <span>Nồng độ H⁺ tăng làm dung dịch trở nên axit hơn (pH giảm)</span>
              </div>
              <div className="flex items-center gap-2 text-[#FF875F]">
                <span className="w-5 h-5 rounded-full bg-[#FF875F]/20 text-[#FF875F] flex items-center justify-center font-mono font-bold text-xs">3</span>
                <span>Cả lắng đọng ướt và khô đưa chất gây axit xuống bề mặt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
