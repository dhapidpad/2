import React, { useState } from 'react';
import { Landmark, ShieldAlert, Sparkles } from 'lucide-react';
import EquationCard from '../components/EquationCard';
import { sfx } from '../audio/sfx';

export default function Slide15ImpactLimestone() {
  const [showErosion, setShowErosion] = useState(true);

  return (
    <div className="w-full min-h-full flex flex-col justify-between py-1 gap-3 relative">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#F06B70]/15 border border-[#F06B70]/35 text-[#F06B70] text-xs font-bold tracking-wider uppercase">
            Hậu quả vật liệu 3 / 4 • Đá vôi, Marble &amp; Di sản văn hóa
          </span>
          <span className="text-xs text-[#A8BBC8]">Phản ứng hòa tan mạng tinh thể Calcium Carbonate (CaCO₃)</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          AXIT CÓ THỂ LÀM MÒN CHI TIẾT ĐÁ CARBONATE
        </h2>
      </div>

      {/* Main Grid: Left (6 cols) Dual Architectural & Crystal Lattice SVG | Right (6 cols) Equation & Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto items-center">
        {/* Left Column (6 cols): Interactive Classical Monument + Calcite Lattice SVG */}
        <div className="lg:col-span-6 space-y-2.5">
          <div className="glass-panel p-4 rounded-3xl border border-[#29485A]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#54D7E8] flex items-center gap-1.5">
                <Landmark size={16} /> Mô phỏng bề mặt đá vôi &amp; mạng tinh thể CaCO₃
              </span>
              <button
                onClick={() => {
                  setShowErosion((prev) => {
                    const next = !prev;
                    if (next) {
                      sfx.chemicalFizz(0.75);
                    } else {
                      sfx.pop();
                    }
                    return next;
                  });
                }}
                className="px-3 py-1 rounded-xl bg-[#D8F36A]/15 hover:bg-[#D8F36A]/25 text-[#D8F36A] text-xs font-bold border border-[#D8F36A]/40 transition-all flex items-center gap-1.5"
              >
                <Sparkles size={13} />
                <span>{showErosion ? "Chuyển về bề mặt nguyên bản" : "Bật mô phỏng phong hóa axit"}</span>
              </button>
            </div>

            <svg
              viewBox="0 0 560 290"
              className="w-full h-auto rounded-2xl bg-[#06131E] border border-[#29485A] select-none shadow-2xl"
              role="img"
              aria-labelledby="s15StoneTitle s15StoneDesc"
            >
              <title id="s15StoneTitle">Mô phỏng ăn mòn cột đá vôi cổ điển và phản ứng hòa tan CaCO3 ở cấp độ vi mô</title>
              <desc id="s15StoneDesc">
                Bên trái là đầu cột đá chạm khắc bị mờ nét và rỗ bề mặt khi tiếp xúc mưa axit; bên phải là sơ đồ vi mô CaCO3 rắn chuyển thành ion Ca2+ hòa tan và khí CO2 thoát ra.
              </desc>
              <defs>
                {/* Stone Textures */}
                <linearGradient id="s15StoneIntact" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ECEFF1" />
                  <stop offset="30%" stopColor="#CFD8DC" />
                  <stop offset="70%" stopColor="#B0BEC5" />
                  <stop offset="100%" stopColor="#90A4AE" />
                </linearGradient>

                <linearGradient id="s15StoneEroded" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#78909C" />
                  <stop offset="30%" stopColor="#546E7A" />
                  <stop offset="70%" stopColor="#455A64" />
                  <stop offset="100%" stopColor="#37474F" />
                </linearGradient>

                <radialGradient id="s15SphereCa" cx="32%" cy="28%" r="72%">
                  <stop offset="0%" stopColor="#FEF9E7" />
                  <stop offset="30%" stopColor="#F9E79F" />
                  <stop offset="70%" stopColor="#B7950B" />
                  <stop offset="100%" stopColor="#5B4502" />
                </radialGradient>
              </defs>

              {/* Left Panel: Architectural Column Capital & Fluted Shaft */}
              <rect x="12" y="10" width="258" height="270" rx="16" fill="#081A28" stroke="#29485A" strokeWidth="1.5" />
              <rect x="22" y="18" width="238" height="24" rx="6" fill="#050E17" stroke={showErosion ? '#FF875F' : '#8FCB89'} strokeOpacity="0.5" />
              <text x="141" y="34" textAnchor="middle" fill={showErosion ? '#FF875F' : '#8FCB89'} fontSize="11" fontWeight="900" fontFamily="monospace">
                {showErosion ? 'BỀ MẶT PHONG HÓA AXIT • RỖ MÒN' : 'BỀ MẶT ĐIÊU KHẮC NGUYÊN BẢN'}
              </text>

              {/* Acid Rain Precipitation Streaks when erosion is active */}
              {showErosion && (
                <g stroke="#D8F36A" strokeWidth="1.8" strokeDasharray="5 4" className="animate-dash-flow" opacity="0.8">
                  <line x1="42" y1="46" x2="30" y2="105" />
                  <line x1="240" y1="46" x2="228" y2="105" />
                  <line x1="141" y1="44" x2="133" y2="82" />
                </g>
              )}

              {/* Ionic Column Structure */}
              <g transform="translate(45, 52)">
                {/* Entablature / Top Abacus */}
                <rect x="12" y="0" width="168" height="14" rx="3" fill={showErosion ? 'url(#s15StoneEroded)' : 'url(#s15StoneIntact)'} stroke="#37474F" strokeWidth="1" />
                
                {/* Left & Right Volute Scrolls */}
                <g>
                  {/* Left scroll */}
                  <circle cx="26" cy="28" r="18" fill={showErosion ? '#546E7A' : '#CFD8DC'} stroke="#37474F" strokeWidth="2" />
                  <circle cx="26" cy="28" r="9" fill="none" stroke="#263238" strokeWidth="2" strokeDasharray={showErosion ? '4 3' : 'none'} />
                  {/* Right scroll */}
                  <circle cx="166" cy="28" r="18" fill={showErosion ? '#546E7A' : '#CFD8DC'} stroke="#37474F" strokeWidth="2" />
                  <circle cx="166" cy="28" r="9" fill="none" stroke="#263238" strokeWidth="2" strokeDasharray={showErosion ? '4 3' : 'none'} />
                </g>

                {/* Carved Egg-and-Dart Moulding Strip */}
                <rect x="36" y="16" width="120" height="22" rx="4" fill={showErosion ? '#455A64' : '#B0BEC5'} stroke="#37474F" strokeWidth="1" />
                {!showErosion ? (
                  <g fill="#546E7A">
                    <ellipse cx="56" cy="27" rx="6" ry="8" />
                    <ellipse cx="76" cy="27" rx="6" ry="8" />
                    <ellipse cx="96" cy="27" rx="6" ry="8" />
                    <ellipse cx="116" cy="27" rx="6" ry="8" />
                    <ellipse cx="136" cy="27" rx="6" ry="8" />
                  </g>
                ) : (
                  <g fill="#263238" opacity="0.65">
                    {/* Eroded, blurry ornamental beads */}
                    <ellipse cx="56" cy="27" rx="4.5" ry="5" />
                    <ellipse cx="76" cy="27" rx="3.5" ry="6" />
                    <ellipse cx="96" cy="27" rx="5" ry="3.5" />
                    <ellipse cx="116" cy="27" rx="3.5" ry="4.5" />
                    <ellipse cx="136" cy="27" rx="4.5" ry="3.5" />
                  </g>
                )}

                {/* Fluted Column Shaft */}
                <rect x="36" y="40" width="120" height="134" fill={showErosion ? 'url(#s15StoneEroded)' : 'url(#s15StoneIntact)'} stroke="#37474F" strokeWidth="1.2" />
                {/* Fluting Fillets & Grooves */}
                {[52, 72, 96, 120, 140].map((xPos, i) => (
                  <line
                    key={i}
                    x1={xPos}
                    y1="42"
                    x2={xPos}
                    y2="172"
                    stroke={showErosion ? '#263238' : '#78909C'}
                    strokeWidth={showErosion ? '1.5' : '3.5'}
                    strokeDasharray={showErosion ? '6 5' : 'none'}
                  />
                ))}

                {/* Micro-Pitting & Effervescent CO2 Bubbles when eroded */}
                {showErosion && (
                  <g>
                    {/* Deep weathering micro-pits */}
                    <circle cx="58" cy="74" r="6.5" fill="#263238" />
                    <circle cx="108" cy="98" r="8" fill="#263238" />
                    <circle cx="82" cy="136" r="5.5" fill="#263238" />
                    <circle cx="134" cy="84" r="7" fill="#263238" />
                    <circle cx="70" cy="116" r="4.5" fill="#263238" />
                    {/* Rising CO2 micro-bubbles */}
                    <circle cx="60" cy="58" r="4" fill="none" stroke="#54D7E8" strokeWidth="1.5" className="animate-bubble-rise" />
                    <circle cx="112" cy="78" r="4.5" fill="none" stroke="#54D7E8" strokeWidth="1.5" className="animate-bubble-rise" />
                    <circle cx="136" cy="66" r="3.5" fill="none" stroke="#54D7E8" strokeWidth="1.5" className="animate-bubble-rise" />
                  </g>
                )}

                {/* Column Base Plinth */}
                <rect x="18" y="174" width="156" height="16" rx="3" fill={showErosion ? 'url(#s15StoneEroded)' : 'url(#s15StoneIntact)'} stroke="#37474F" strokeWidth="1" />
              </g>

              <text x="141" y="266" textAnchor="middle" fill={showErosion ? '#FF875F' : '#8FCB89'} fontSize="11" fontWeight="800">
                {showErosion ? 'Mòn vi tinh thể calcite • Rỗ tổ ong' : 'Gờ chỉ & họa tiết sắc nét nguyên vẹn'}
              </text>

              {/* Right Panel: Microscopic Calcite Crystal Lattice Dissolution */}
              <rect x="282" y="10" width="266" height="270" rx="16" fill="#081A28" stroke="#29485A" strokeWidth="1.5" />
              <rect x="294" y="18" width="242" height="24" rx="6" fill="#050E17" stroke="#D8F36A" strokeOpacity="0.5" />
              <text x="415" y="34" textAnchor="middle" fill="#D8F36A" fontSize="11" fontWeight="900" fontFamily="monospace">
                CƠ CHẾ VI MÔ • MẠNG TINH THỂ CaCO₃
              </text>

              {/* Incoming H+ attacking ions */}
              <g transform="translate(300, 48)">
                <circle cx="34" cy="20" r="14" fill="#D8F36A" stroke="#FFFFFF" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 6px rgba(216,243,106,0.6))' }} />
                <text x="34" y="25" textAnchor="middle" fill="#050E17" fontSize="12" fontWeight="900">H⁺</text>
                <circle cx="74" cy="28" r="14" fill="#D8F36A" stroke="#FFFFFF" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 6px rgba(216,243,106,0.6))' }} />
                <text x="74" y="33" textAnchor="middle" fill="#050E17" fontSize="12" fontWeight="900">H⁺</text>
                <circle cx="118" cy="20" r="16" fill="#061B29" stroke="#54D7E8" strokeWidth="1.8" />
                <text x="118" y="25" textAnchor="middle" fill="#54D7E8" fontSize="10.5" fontWeight="900" fontFamily="monospace">NO₃⁻</text>
                <path d="M 54 44 L 75 74" stroke="#D8F36A" strokeWidth="2.5" strokeDasharray="4 3" className="animate-dash-flow" />
              </g>

              {/* Reaction Products Leaving Surface */}
              <g transform="translate(416, 78)">
                <rect x="0" y="0" width="122" height="64" rx="10" fill="#061622" stroke="#54D7E8" strokeWidth="1.5" />
                <text x="61" y="20" textAnchor="middle" fill="#54D7E8" fontSize="11" fontWeight="900">
                  Sản phẩm hòa tan:
                </text>
                <text x="61" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="monospace">
                  Ca²⁺(aq) + 2NO₃⁻
                </text>
                <text x="61" y="54" textAnchor="middle" fill="#D8F36A" fontSize="11.5" fontWeight="900" fontFamily="monospace">
                  + CO₂(g)↑ + H₂O
                </text>
              </g>

              {/* 3D Calcite Crystal Lattice Model at Bottom of Right Box */}
              <g transform="translate(296, 154)">
                <rect x="0" y="0" width="238" height="88" rx="12" fill="#0F1F2B" stroke="#78909C" strokeWidth="1.5" />
                <text x="119" y="22" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="900">
                  Mạng tinh thể đá rắn CaCO₃(s)
                </text>
                
                {/* Rhombohedral lattice nodes Ca2+ & CO3(2-) */}
                <g transform="translate(28, 30)">
                  {/* Grid lines connecting ions */}
                  <line x1="16" y1="14" x2="166" y2="14" stroke="#455A64" strokeWidth="1.5" />
                  <line x1="16" y1="36" x2="166" y2="36" stroke="#455A64" strokeWidth="1.5" />
                  <line x1="16" y1="14" x2="16" y2="36" stroke="#455A64" strokeWidth="1.5" />
                  <line x1="66" y1="14" x2="66" y2="36" stroke="#455A64" strokeWidth="1.5" />
                  <line x1="116" y1="14" x2="116" y2="36" stroke="#455A64" strokeWidth="1.5" />
                  <line x1="166" y1="14" x2="166" y2="36" stroke="#455A64" strokeWidth="1.5" />

                  {/* Ions */}
                  <circle cx="16" cy="14" r="10" fill="url(#s15SphereCa)" stroke="#F4D03F" strokeWidth="1" />
                  <text x="16" y="18" textAnchor="middle" fill="#050E17" fontSize="8" fontWeight="900">Ca²⁺</text>
                  <circle cx="66" cy="14" r="11" fill="#1E293B" stroke="#54D7E8" strokeWidth="1.2" />
                  <text x="66" y="18" textAnchor="middle" fill="#54D7E8" fontSize="7.5" fontWeight="900">CO₃²⁻</text>
                  <circle cx="116" cy="14" r="10" fill="url(#s15SphereCa)" stroke="#F4D03F" strokeWidth="1" />
                  <text x="116" y="18" textAnchor="middle" fill="#050E17" fontSize="8" fontWeight="900">Ca²⁺</text>
                  <circle cx="166" cy="14" r="11" fill="#1E293B" stroke="#54D7E8" strokeWidth="1.2" />
                  <text x="166" y="18" textAnchor="middle" fill="#54D7E8" fontSize="7.5" fontWeight="900">CO₃²⁻</text>

                  <circle cx="16" cy="36" r="11" fill="#1E293B" stroke="#54D7E8" strokeWidth="1.2" />
                  <text x="16" y="40" textAnchor="middle" fill="#54D7E8" fontSize="7.5" fontWeight="900">CO₃²⁻</text>
                  <circle cx="66" cy="36" r="10" fill="url(#s15SphereCa)" stroke="#F4D03F" strokeWidth="1" />
                  <text x="66" y="40" textAnchor="middle" fill="#050E17" fontSize="8" fontWeight="900">Ca²⁺</text>
                  <circle cx="116" cy="36" r="11" fill="#1E293B" stroke="#54D7E8" strokeWidth="1.2" />
                  <text x="116" y="40" textAnchor="middle" fill="#54D7E8" fontSize="7.5" fontWeight="900">CO₃²⁻</text>
                  <circle cx="166" cy="36" r="10" fill="url(#s15SphereCa)" stroke="#F4D03F" strokeWidth="1" />
                  <text x="166" y="40" textAnchor="middle" fill="#050E17" fontSize="8" fontWeight="900">Ca²⁺</text>
                </g>
                <text x="119" y="80" textAnchor="middle" fill="#FF875F" fontSize="10.5" fontWeight="800">
                  Liên kết ion bị H⁺ phá vỡ, Ca(NO₃)₂ tan rửa trôi
                </text>
              </g>

              <text x="415" y="266" textAnchor="middle" fill="#A8BBC8" fontSize="9.5" fontStyle="italic">
                *Minh họa khái niệm, không gán cho một di tích thật cụ thể.
              </text>
            </svg>
          </div>
        </div>

        {/* Right Column (6 cols): Balanced Equation & Conservation Insights */}
        <div className="lg:col-span-6 space-y-3.5">
          <EquationCard
            title="Phương trình axit nitric hòa tan đá vôi / đá marble (Calcium carbonate)"
            badge="Phản ứng trao đổi ion tạo khí & muối tan"
            badgeColor="lime"
            highlight={true}
            atomBalance="1 Ca, 1 C, 2 H, 2 N, 9 O  •  PT ion rút gọn: CaCO₃(s) + 2H⁺(aq) → Ca²⁺(aq) + CO₂(g)↑ + H₂O(l)"
            equationHtml="CaCO<sub>3</sub>(s) + 2HNO<sub>3</sub>(aq) &rarr; Ca(NO<sub>3</sub>)<sub>2</sub>(aq) + CO<sub>2</sub>(g)&uarr; + H<sub>2</sub>O(l)"
            note="Muối calcium nitrate Ca(NO₃)₂ sinh ra tan rất tốt trong nước và bị nước mưa cuốn trôi, khiến bề mặt tượng đá, phù điêu bị mòn lõm và mất nét chạm khắc."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
            <div className="bg-[#102838]/90 p-3 rounded-2xl border border-[#29485A]">
              <span className="text-[#54D7E8] font-bold text-xs sm:text-sm block mb-0.5">1. Bề mặt nhám hơn</span>
              <p className="text-xs text-[#A8BBC8]">Tinh thể calcite tan dần tạo các vi hốc li ti trên bề mặt đá.</p>
            </div>
            <div className="bg-[#102838]/90 p-3 rounded-2xl border border-[#29485A]">
              <span className="text-[#D8F36A] font-bold text-xs sm:text-sm block mb-0.5">2. Mờ nét chạm khắc</span>
              <p className="text-xs text-[#A8BBC8]">Các gờ nổi, hoa văn tinh xảo trên tượng đài cổ bị bào mòn.</p>
            </div>
            <div className="bg-[#102838]/90 p-3 rounded-2xl border border-[#29485A]">
              <span className="text-[#FF875F] font-bold text-xs sm:text-sm block mb-0.5">3. Chi phí bảo tồn tăng</span>
              <p className="text-xs text-[#A8BBC8]">Đòi hỏi trùng tu, phủ bảo vệ hoặc di dời hiện vật vào bảo tàng.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#071521]/90 border border-[#29485A] flex items-start gap-2.5 text-xs text-[#DCE6F0]">
            <ShieldAlert size={17} className="text-[#D8F36A] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#D8F36A] block mb-0.5">Góc nhìn khoa học toàn diện (USGS):</strong>
              Phương trình trên minh họa tác dụng của <strong>HNO₃</strong>. Ngoài thực tế, <strong>SO₂ / H₂SO₄</strong> cũng đóng vai trò rất lớn khi biến CaCO₃ thành lớp vỏ thạch cao gypsum (<code className="text-[#54D7E8]">CaSO₄·2H₂O</code>) dễ bong tróc.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
