import React from 'react';
import { HeartPulse, Wrench, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Slide16ImpactMetalsHealth() {
  return (
    <div className="w-full min-h-full flex flex-col justify-between py-1 gap-3 relative">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#F06B70]/15 border border-[#F06B70]/35 text-[#F06B70] text-xs font-bold tracking-wider uppercase">
            Hậu quả vật liệu &amp; con người 4 / 4 • Nhìn nhận chuẩn xác, không gây hoang mang
          </span>
          <span className="text-xs text-[#A8BBC8]">Ăn mòn kim loại &amp; Rủi ro hô hấp từ khí/hạt tiền chất</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          TÁC ĐỘNG KHÔNG CHỈ NẰM TRONG GIỌT MƯA
        </h2>
      </div>

      {/* Main 50/50 Grid per acid.md Slide 16 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-auto items-stretch">
        {/* Left Panel: Metals & Infrastructure Corrosion with Custom SVG */}
        <div className="glass-panel p-4 sm:p-5 rounded-3xl border-t-4 border-t-[#FF875F] flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FF875F]/15 text-[#FF875F] border border-[#FF875F]/30 flex items-center justify-center shrink-0">
                <Wrench size={20} />
              </div>
              <div>
                <span className="text-xs font-mono text-[#FF875F] uppercase font-bold block">1. Kim loại &amp; Kết cấu công trình</span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">Thúc đẩy ăn mòn điện hóa &amp; xuống cấp</h3>
              </div>
            </div>

            {/* Custom SVG: Steel Girder & Bolt Electrochemical Corrosion */}
            <div className="bg-[#071521]/90 p-3 rounded-2xl border border-[#29485A] mb-3 shadow-xl">
              <svg
                viewBox="0 0 460 170"
                className="w-full h-auto select-none"
                role="img"
                aria-label="Sơ đồ ăn mòn điện hóa trên bề mặt thép khi có màng ẩm chứa ion H+ và NO3-"
              >
                <defs>
                  <linearGradient id="s16SteelBeam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="25%" stopColor="#334155" />
                    <stop offset="75%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                  <radialGradient id="s16RustPustule" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#EA580C" />
                    <stop offset="50%" stopColor="#C2410C" />
                    <stop offset="85%" stopColor="#9A3412" />
                    <stop offset="100%" stopColor="#431407" />
                  </radialGradient>
                </defs>

                {/* Heavy Structural Steel I-Beam Base */}
                <rect x="18" y="106" width="424" height="46" rx="6" fill="url(#s16SteelBeam)" stroke="#64748B" strokeWidth="2" />
                {/* Structural Rivet Heads */}
                {[45, 85, 375, 415].map((rx) => (
                  <g key={rx}>
                    <circle cx={rx} cy="129" r="6" fill="#64748B" stroke="#94A3B8" strokeWidth="1.2" />
                    <circle cx={rx - 1.5} cy="127.5" r="2" fill="#FFFFFF" opacity="0.6" />
                  </g>
                ))}
                <text x="230" y="134" textAnchor="middle" fill="#F8FAFC" fontSize="12.5" fontWeight="900" fontFamily="monospace">
                  KẾT CẤU THÉP CẦU ĐƯỜNG / HỢP KIM SẮT (Fe)
                </text>

                {/* Protective Epoxy Coating (Peeling & flaking over corrosion pit) */}
                <path d="M 18 98 H 132 Q 146 92 154 80" fill="none" stroke="#54D7E8" strokeWidth="6" strokeLinecap="round" />
                <path d="M 306 80 Q 314 92 328 98 H 442" fill="none" stroke="#54D7E8" strokeWidth="6" strokeLinecap="round" />
                <text x="75" y="86" textAnchor="middle" fill="#54D7E8" fontSize="10.5" fontWeight="800">
                  Lớp sơn bảo vệ
                </text>
                <text x="385" y="86" textAnchor="middle" fill="#54D7E8" fontSize="10.5" fontWeight="800">
                  Màng sơn bong tróc
                </text>

                {/* Rust Crater Pustule (Fe2O3.nH2O) */}
                <ellipse cx="230" cy="104" rx="80" ry="16" fill="url(#s16RustPustule)" stroke="#FF875F" strokeWidth="1.5" />
                <text x="230" y="108" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900">
                  Gỉ sét xốp (Fe₂O₃·nH₂O)
                </text>

                {/* Acidic Electrolyte Droplet Meniscus Film */}
                <path
                  d="M 134 102 Q 230 14 326 102 Z"
                  fill="#54D7E8"
                  fillOpacity="0.22"
                  stroke="#D8F36A"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                />
                <text x="230" y="40" textAnchor="middle" fill="#D8F36A" fontSize="11.5" fontWeight="900">
                  Màng ẩm điện ly axit (H⁺, NO₃⁻, SO₄²⁻, O₂)
                </text>

                {/* Electrochemical half-reactions */}
                {/* Anode (Oxidation of Fe) */}
                <rect x="136" y="58" width="88" height="22" rx="6" fill="#050E17" stroke="#FF875F" strokeWidth="1.2" />
                <text x="180" y="73" textAnchor="middle" fill="#FF875F" fontSize="10.5" fontWeight="900" fontFamily="monospace">
                  Fe → Fe²⁺ + 2e⁻
                </text>

                {/* Cathode (Reduction of Oxygen) */}
                <rect x="236" y="58" width="98" height="22" rx="6" fill="#050E17" stroke="#54D7E8" strokeWidth="1.2" />
                <text x="285" y="73" textAnchor="middle" fill="#54D7E8" fontSize="9.5" fontWeight="900" fontFamily="monospace">
                  O₂ + 4H⁺ + 4e⁻ → 2H₂O
                </text>
              </svg>
            </div>

            <p className="text-xs sm:text-sm text-[#DCE6F0] leading-relaxed">
              Độ ẩm kết hợp với lắng đọng axit tạo thành <strong>dung dịch chất điện ly dẫn điện tốt</strong> trên bề mặt cầu thép, bu-lông, đường ray, mái tôn và lớp sơn xe, đẩy nhanh tốc độ ăn mòn điện hóa.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#050E17]/90 border border-[#29485A] text-xs text-[#A8BBC8]">
            <strong className="text-[#FF875F]">Lưu ý hóa học nghiêm ngặt:</strong> Không viết phương trình tùy tiện <code className="text-white">Kim loại + HNO₃ → Muối + H₂</code> vì HNO₃ có tính oxi hóa mạnh và ăn mòn ngoài khí quyển chủ yếu là ăn mòn điện hóa có mặt O₂ và độ ẩm.
          </div>
        </div>

        {/* Right Panel: Air Pollution Precursors & Human Health with Custom Lungs SVG */}
        <div className="glass-panel p-4 sm:p-5 rounded-3xl border-t-4 border-t-[#54D7E8] flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#54D7E8]/15 text-[#54D7E8] border border-[#54D7E8]/30 flex items-center justify-center shrink-0">
                <HeartPulse size={20} />
              </div>
              <div>
                <span className="text-xs font-mono text-[#54D7E8] uppercase font-bold block">2. Không khí &amp; Sức khỏe con người</span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">Rủi ro từ khí NOₓ, SO₂ và hạt mịn PM2.5</h3>
              </div>
            </div>

            {/* Custom SVG: Respiratory System & Fine Particulate Aerosols */}
            <div className="bg-[#071521]/90 p-3 rounded-2xl border border-[#29485A] mb-3 shadow-xl">
              <svg
                viewBox="0 0 460 170"
                className="w-full h-auto select-none"
                role="img"
                aria-label="Sơ đồ hệ hô hấp và sự xâm nhập của khí NO2, SO2 cùng hạt bụi mịn nitrate/sulfate PM2.5"
              >
                {/* Left: Anatomical Pulmonary Tree with Alveoli */}
                <g transform="translate(24, 10)">
                  {/* Trachea with Cartilage Rings */}
                  <path d="M 76 4 V 48" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" />
                  {[12, 22, 32, 42].map((y) => (
                    <line key={y} x1="72" y1={y} x2="80" y2={y} stroke="#050E17" strokeWidth="1.5" />
                  ))}
                  {/* Primary Bronchi Bifurcation */}
                  <path d="M 76 48 L 48 74 M 76 48 L 104 74" stroke="#38BDF8" strokeWidth="4.5" strokeLinecap="round" />
                  {/* Secondary & Tertiary Bronchioles */}
                  <path d="M 48 74 L 32 94 M 48 74 L 56 102 M 104 74 L 96 102 M 104 74 L 120 94" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Left Lung Lobe with translucent parenchymal tissue */}
                  <path
                    d="M 64 36 C 30 36, 10 68, 12 112 C 14 135, 36 142, 60 136 C 68 130, 68 68, 64 36 Z"
                    fill="#54D7E8"
                    fillOpacity="0.2"
                    stroke="#54D7E8"
                    strokeWidth="2"
                  />
                  {/* Right Lung Lobe */}
                  <path
                    d="M 88 36 C 122 36, 142 68, 140 112 C 138 135, 116 142, 92 136 C 84 130, 84 68, 88 36 Z"
                    fill="#54D7E8"
                    fillOpacity="0.2"
                    stroke="#54D7E8"
                    strokeWidth="2"
                  />

                  {/* Fine Particulate Aerosols (PM2.5) Penetrating Alveolar Sacs */}
                  <g>
                    <circle cx="34" cy="94" r="4.5" fill="#FF875F" stroke="#FFFFFF" strokeWidth="1" />
                    <circle cx="46" cy="112" r="3.5" fill="#D8F36A" />
                    <circle cx="28" cy="124" r="3" fill="#F06B70" />
                    <circle cx="118" cy="94" r="4.5" fill="#FF875F" stroke="#FFFFFF" strokeWidth="1" />
                    <circle cx="106" cy="112" r="3.5" fill="#D8F36A" />
                    <circle cx="124" cy="124" r="3" fill="#F06B70" />
                    <text x="76" y="156" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="800">
                      Bụi mịn xâm nhập phế nang
                    </text>
                  </g>
                </g>

                {/* Right: 3 Air Pollutant Threat Strategic Cards */}
                <g transform="translate(195, 14)">
                  {/* Card 1 */}
                  <rect x="0" y="0" width="250" height="42" rx="10" fill="#102838" stroke="#FF875F" strokeWidth="1.5" />
                  <text x="14" y="18" fill="#FF875F" fontSize="11.5" fontWeight="900">
                    1. Khí tiền chất NO₂ &amp; SO₂
                  </text>
                  <text x="14" y="32" fill="#DCE6F0" fontSize="10">
                    Kích thích niêm mạc phế quản, khởi phát cơn hen suyễn
                  </text>

                  {/* Card 2 */}
                  <rect x="0" y="49" width="250" height="42" rx="10" fill="#102838" stroke="#D8F36A" strokeWidth="1.5" />
                  <text x="14" y="67" fill="#D8F36A" fontSize="11.5" fontWeight="900">
                    2. Hạt bụi mịn Nitrate / Sulfate (PM2.5)
                  </text>
                  <text x="14" y="81" fill="#DCE6F0" fontSize="10">
                    Kích thước siêu nhỏ lọt vào phế nang, ảnh hưởng tim mạch
                  </text>

                  {/* Card 3 */}
                  <rect x="0" y="98" width="250" height="42" rx="10" fill="#102838" stroke="#54D7E8" strokeWidth="1.5" />
                  <text x="14" y="116" fill="#54D7E8" fontSize="11.5" fontWeight="900">
                    3. Ozone tầng mặt đất (O₃ quang hóa)
                  </text>
                  <text x="14" y="130" fill="#DCE6F0" fontSize="10">
                    NOₓ kết hợp VOC dưới nắng sinh smog quang hóa độc hại
                  </text>
                </g>
              </svg>
            </div>

            {/* "Hiểu đúng" Callout Box required by acid.md */}
            <div className="p-3.5 rounded-2xl bg-[#123146] border border-[#54D7E8]/50">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#D8F36A] uppercase tracking-wider mb-1">
                <CheckCircle2 size={15} /> Hiểu đúng khoa học (U.S. EPA):
              </div>
              <p className="text-xs text-[#F4F7FA] leading-relaxed">
                Đi dưới mưa axit thông thường ngoài trời <strong>không gây bỏng da</strong> như tiếp xúc với axit đậm đặc trong phòng thí nghiệm. Rủi ro sức khỏe lớn hơn thực chất đến từ việc hít phải <strong>khí NOₓ, SO₂ và hạt bụi mịn nitrate/sulfate</strong> trong không khí ô nhiễm.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Transition Strip */}
      <div className="p-3 rounded-2xl bg-[#071521]/90 border border-[#D8F36A]/40 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#D8F36A]">
        <ShieldCheck size={18} />
        <span>Giảm phát thải NOₓ và SO₂ từ nguồn = Bảo vệ đồng thời hệ sinh thái, di sản và lá phổi cộng đồng</span>
      </div>
    </div>
  );
}
