import React from 'react';
import { Factory, Car, Zap, CloudLightning, EyeOff } from 'lucide-react';

export default function Slide06Sources() {
  return (
    <div className="w-full min-h-full flex flex-col justify-between py-1 gap-3 relative">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#54D7E8]/15 border border-[#54D7E8]/35 text-[#54D7E8] text-xs font-bold tracking-wider uppercase">
            Tiền chất ô nhiễm • Cấu trúc phân tử &amp; Nguồn phát sinh
          </span>
          <span className="text-xs text-[#A8BBC8]">Phân biệt NO và NO₂ trong nhóm NOₓ</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          NO<sub>x</sub>: NHỮNG CHẤT KHỞI ĐẦU CHO NHÁNH HNO₃
        </h2>
      </div>

      {/* Main Content */}
      <div className="my-auto space-y-3.5">
        {/* Top: 2 Detailed 3D-Style Molecular Geometry Cards (NO vs NO2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Card NO */}
          <div className="glass-panel p-4 sm:p-5 rounded-3xl border-l-4 border-l-[#54D7E8] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#54D7E8]/15 text-[#54D7E8] border border-[#54D7E8]/35">
                1. Tiền chất sơ cấp (Primary Precursor)
              </span>
              <span className="text-xs font-mono text-[#D8F36A] bg-[#071521] px-2.5 py-0.5 rounded-lg border border-[#29485A]">
                Số oxi hóa: N⁺²
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-1">
              {/* Detailed SVG Molecular Diagram of NO */}
              <div className="sm:col-span-5 bg-[#071521]/90 p-2 rounded-2xl border border-[#29485A] flex items-center justify-center">
                <svg viewBox="0 0 220 120" className="w-full h-auto max-w-[200px]" role="img" aria-label="Cấu trúc phân tử NO bậc liên kết 2,5">
                  <defs>
                    <radialGradient id="s6AtomN" cx="32%" cy="28%" r="68%">
                      <stop offset="0%" stopColor="#C8F8FF" />
                      <stop offset="25%" stopColor="#54D7E8" />
                      <stop offset="65%" stopColor="#1B7A94" />
                      <stop offset="100%" stopColor="#06323F" />
                    </radialGradient>
                    <radialGradient id="s6AtomO" cx="32%" cy="28%" r="68%">
                      <stop offset="0%" stopColor="#FFE0D6" />
                      <stop offset="25%" stopColor="#FF875F" />
                      <stop offset="65%" stopColor="#B33E1A" />
                      <stop offset="100%" stopColor="#4A1405" />
                    </radialGradient>
                    <linearGradient id="s6BondCyl" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8AB7D4" />
                      <stop offset="40%" stopColor="#FFFFFF" />
                      <stop offset="70%" stopColor="#A8CDE4" />
                      <stop offset="100%" stopColor="#406B85" />
                    </linearGradient>
                    <filter id="s6RadGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* 3D Cylindrical Bonds: Bond order 2.5 (2 solid cylinder bars + 1 dashed pi-resonance strip) */}
                  {/* First cylinder bond */}
                  <rect x="65" y="47" width="90" height="6.5" rx="3.2" fill="url(#s6BondCyl)" stroke="#050E17" strokeWidth="0.8" />
                  <line x1="68" y1="49" x2="152" y2="49" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.9" />

                  {/* Second cylinder bond */}
                  <rect x="65" y="58.5" width="90" height="6.5" rx="3.2" fill="url(#s6BondCyl)" stroke="#050E17" strokeWidth="0.8" />
                  <line x1="68" y1="60.5" x2="152" y2="60.5" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.9" />

                  {/* Half bond (dashed 0.5 bond strip) */}
                  <line x1="68" y1="38" x2="152" y2="38" stroke="#54D7E8" strokeWidth="2.5" strokeDasharray="5 4" strokeLinecap="round" />

                  {/* N atom with 3D CPK sphere */}
                  <g>
                    <circle cx="65" cy="54" r="28" fill="url(#s6AtomN)" stroke="#041F2B" strokeWidth="1.8" />
                    {/* Specular highlight */}
                    <ellipse cx="57" cy="45" rx="8" ry="4.5" transform="rotate(-30 57 45)" fill="#FFFFFF" opacity="0.65" />
                    {/* Fresnel rim lighting */}
                    <circle cx="65" cy="54" r="27" fill="none" stroke="#C8F8FF" strokeWidth="0.8" opacity="0.5" />
                    {/* Unpaired radical electron (e⁻) with pulsing lime glow */}
                    <circle cx="40" cy="30" r="7" fill="#D8F36A" opacity="0.3" filter="url(#s6RadGlow)" />
                    <circle cx="40" cy="30" r="4.2" fill="#D8F36A" stroke="#050E17" strokeWidth="1" />
                    <text x="32" y="22" fill="#D8F36A" fontSize="9.5" fontWeight="900" fontFamily="monospace">e⁻ (•)</text>
                    {/* N Symbol */}
                    <text x="65" y="61" fill="#FFFFFF" fontSize="18" fontWeight="900" textAnchor="middle" paintOrder="stroke" stroke="#050E17" strokeWidth="3">N</text>
                  </g>

                  {/* O atom with 3D CPK sphere */}
                  <g>
                    <circle cx="155" cy="54" r="25" fill="url(#s6AtomO)" stroke="#380C03" strokeWidth="1.8" />
                    {/* Specular highlight */}
                    <ellipse cx="148" cy="46" rx="7" ry="4" transform="rotate(-30 148 46)" fill="#FFFFFF" opacity="0.65" />
                    {/* Fresnel rim lighting */}
                    <circle cx="155" cy="54" r="24" fill="none" stroke="#FFE0D6" strokeWidth="0.8" opacity="0.5" />
                    {/* O Symbol */}
                    <text x="155" y="61" fill="#FFFFFF" fontSize="17" fontWeight="900" textAnchor="middle" paintOrder="stroke" stroke="#050E17" strokeWidth="3">O</text>
                  </g>

                  {/* Bond length dimension annotation */}
                  <path d="M 65 92 H 155" stroke="#54D7E8" strokeWidth="1.2" strokeDasharray="3 2" />
                  <path d="M 65 89 V 95 M 155 89 V 95" stroke="#54D7E8" strokeWidth="1.2" />
                  <rect x="80" y="98" width="60" height="16" rx="4" fill="#071521" stroke="#29485A" strokeWidth="1" />
                  <text x="110" y="110" fill="#54D7E8" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="monospace">
                    115 pm • 2,5
                  </text>
                </svg>
              </div>

              <div className="sm:col-span-7 space-y-1.5">
                <div className="flex items-baseline gap-2.5">
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-mono">NO</h3>
                  <span className="text-xs sm:text-sm text-[#54D7E8] font-bold">Nitrogen monoxide (Nitric oxide)</span>
                </div>
                <ul className="space-y-1 text-xs text-[#DCE6F0]">
                  <li>• <strong>Trạng thái:</strong> Chất khí <strong>không màu</strong>, không mùi, ít tan trong nước.</li>
                  <li>• <strong>Đặc điểm:</strong> Phân tử có 1 electron độc thân (gốc tự do <code className="text-[#D8F36A]">•NO</code>), rất dễ bị oxi hóa tiếp trong không khí.</li>
                  <li>• <strong>Nguồn tạo:</strong> Hình thành trực tiếp từ N₂ và O₂ ở vùng cháy nhiệt độ cao (&gt;1200°C).</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card NO2 */}
          <div className="glass-panel p-4 sm:p-5 rounded-3xl border-l-4 border-l-[#FF875F] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FF875F]/15 text-[#FF875F] border border-[#FF875F]/35">
                2. Chất trung gian bản lề (Oxidized State)
              </span>
              <span className="text-xs font-mono text-[#D8F36A] bg-[#071521] px-2.5 py-0.5 rounded-lg border border-[#29485A]">
                Số oxi hóa: N⁺⁴
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-1">
              {/* Detailed SVG Molecular Diagram of NO2 (Bent 134 deg) */}
              <div className="sm:col-span-5 bg-[#071521]/90 p-2 rounded-2xl border border-[#29485A] flex items-center justify-center">
                <svg viewBox="0 0 220 120" className="w-full h-auto max-w-[200px]" role="img" aria-label="Cấu trúc phân tử NO2 góc 134 độ">
                  <defs>
                    <radialGradient id="s6No2Glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FF875F" stopOpacity="0.25" />
                      <stop offset="60%" stopColor="#B33E1A" stopOpacity="0.10" />
                      <stop offset="100%" stopColor="#071521" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="s6BondCylLeft" x1="110" y1="36" x2="50" y2="76" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="50%" stopColor="#A8CDE4" />
                      <stop offset="100%" stopColor="#54D7E8" />
                    </linearGradient>
                    <linearGradient id="s6BondCylRight" x1="110" y1="36" x2="170" y2="76" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="50%" stopColor="#A8CDE4" />
                      <stop offset="100%" stopColor="#54D7E8" />
                    </linearGradient>
                  </defs>

                  {/* Red-brown gas aura characteristic of NO2 */}
                  <ellipse cx="110" cy="58" rx="88" ry="46" fill="url(#s6No2Glow)" />

                  {/* Resonance bonds (Solid 3D cylinder + dashed delocalized pi bond strip) */}
                  {/* Left bond (N to O left) */}
                  <line x1="110" y1="36" x2="50" y2="76" stroke="#050E17" strokeWidth="8" strokeLinecap="round" />
                  <line x1="110" y1="36" x2="50" y2="76" stroke="url(#s6BondCylLeft)" strokeWidth="6" strokeLinecap="round" />
                  <line x1="110" y1="35" x2="50" y2="75" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
                  {/* Left delocalized pi resonance */}
                  <line x1="106" y1="45" x2="54" y2="80" stroke="#FF875F" strokeWidth="2.5" strokeDasharray="4 3" strokeLinecap="round" />

                  {/* Right bond (N to O right) */}
                  <line x1="110" y1="36" x2="170" y2="76" stroke="#050E17" strokeWidth="8" strokeLinecap="round" />
                  <line x1="110" y1="36" x2="170" y2="76" stroke="url(#s6BondCylRight)" strokeWidth="6" strokeLinecap="round" />
                  <line x1="110" y1="35" x2="170" y2="75" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
                  {/* Right delocalized pi resonance */}
                  <line x1="114" y1="45" x2="166" y2="80" stroke="#FF875F" strokeWidth="2.5" strokeDasharray="4 3" strokeLinecap="round" />

                  {/* Angle arc: 134 degrees */}
                  <path d="M 80 56 Q 110 74 140 56" fill="none" stroke="#D8F36A" strokeWidth="1.6" strokeDasharray="3 2" />
                  <rect x="94" y="62" width="32" height="15" rx="3.5" fill="#071521" stroke="#29485A" strokeWidth="0.8" />
                  <text x="110" y="73" fill="#D8F36A" fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                    134°
                  </text>

                  {/* Left O atom with 3D CPK sphere */}
                  <g>
                    <circle cx="50" cy="76" r="23" fill="url(#s6AtomO)" stroke="#380C03" strokeWidth="1.6" />
                    <ellipse cx="44" cy="69" rx="6.5" ry="3.5" transform="rotate(-30 44 69)" fill="#FFFFFF" opacity="0.65" />
                    <circle cx="50" cy="76" r="22" fill="none" stroke="#FFE0D6" strokeWidth="0.8" opacity="0.45" />
                    <text x="50" y="82" fill="#FFFFFF" fontSize="15" fontWeight="900" textAnchor="middle" paintOrder="stroke" stroke="#050E17" strokeWidth="3">O</text>
                  </g>

                  {/* Right O atom with 3D CPK sphere */}
                  <g>
                    <circle cx="170" cy="76" r="23" fill="url(#s6AtomO)" stroke="#380C03" strokeWidth="1.6" />
                    <ellipse cx="164" cy="69" rx="6.5" ry="3.5" transform="rotate(-30 164 69)" fill="#FFFFFF" opacity="0.65" />
                    <circle cx="170" cy="76" r="22" fill="none" stroke="#FFE0D6" strokeWidth="0.8" opacity="0.45" />
                    <text x="170" y="82" fill="#FFFFFF" fontSize="15" fontWeight="900" textAnchor="middle" paintOrder="stroke" stroke="#050E17" strokeWidth="3">O</text>
                  </g>

                  {/* Central N atom with 3D CPK sphere */}
                  <g>
                    <circle cx="110" cy="34" r="26" fill="url(#s6AtomN)" stroke="#041F2B" strokeWidth="1.8" />
                    <ellipse cx="103" cy="26" rx="7" ry="4" transform="rotate(-30 103 26)" fill="#FFFFFF" opacity="0.65" />
                    <circle cx="110" cy="34" r="25" fill="none" stroke="#C8F8FF" strokeWidth="0.8" opacity="0.5" />
                    {/* Lone electron pair hint */}
                    <circle cx="110" cy="17" r="3" fill="#D8F36A" stroke="#050E17" strokeWidth="0.8" />
                    <text x="110" y="41" fill="#FFFFFF" fontSize="17" fontWeight="900" textAnchor="middle" paintOrder="stroke" stroke="#050E17" strokeWidth="3">N</text>
                  </g>

                  {/* Bond length dimension annotation */}
                  <rect x="52" y="100" width="116" height="16" rx="4" fill="#071521" stroke="#29485A" strokeWidth="1" />
                  <text x="110" y="112" fill="#FF875F" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="monospace">
                    Cấu trúc góc • d ≈ 119,7 pm
                  </text>
                </svg>
              </div>

              <div className="sm:col-span-7 space-y-1.5">
                <div className="flex items-baseline gap-2.5">
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-mono">NO₂</h3>
                  <span className="text-xs sm:text-sm text-[#FF875F] font-bold">Nitrogen dioxide</span>
                </div>
                <ul className="space-y-1 text-xs text-[#DCE6F0]">
                  <li>• <strong>Trạng thái:</strong> Khí <strong>màu nâu đỏ</strong> (ở nồng độ đủ lớn), mùi hắc, độc và gây kích ứng hô hấp.</li>
                  <li>• <strong>Đặc điểm:</strong> Có tính oxi hóa mạnh; phản ứng trực tiếp với H₂O và O₂ (hoặc gốc •OH) tạo <strong>HNO₃</strong>.</li>
                  <li>• <strong>Nguồn tạo:</strong> Tạo thành khi NO bị oxygen trong khí quyển oxi hóa.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: 4 Emission Source Cards (3 Anthropogenic + 1 Natural) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#102838]/85 p-3.5 rounded-2xl border border-[#29485A] flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#54D7E8]/15 text-[#54D7E8] border border-[#54D7E8]/30 shrink-0">
              <Car size={20} />
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-[#54D7E8] font-bold">Nguồn nhân tạo 1</span>
              <h4 className="font-bold text-sm text-white">Giao thông cơ giới</h4>
              <p className="text-xs text-[#A8BBC8] mt-0.5 leading-snug">
                Động cơ đốt trong của xe máy, ô tô, xe tải, tàu thủy đốt xăng và dầu diesel ở áp suất, nhiệt độ cao.
              </p>
            </div>
          </div>

          <div className="bg-[#102838]/85 p-3.5 rounded-2xl border border-[#29485A] flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#FF875F]/15 text-[#FF875F] border border-[#FF875F]/30 shrink-0">
              <Zap size={20} />
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-[#FF875F] font-bold">Nguồn nhân tạo 2</span>
              <h4 className="font-bold text-sm text-white">Nhà máy nhiệt điện</h4>
              <p className="text-xs text-[#A8BBC8] mt-0.5 leading-snug">
                Các tổ máy nhiệt điện đốt than đá, dầu FO hoặc khí tự nhiên liên tục ở quy mô công nghiệp lớn.
              </p>
            </div>
          </div>

          <div className="bg-[#102838]/85 p-3.5 rounded-2xl border border-[#29485A] flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#D8F36A]/15 text-[#D8F36A] border border-[#D8F36A]/30 shrink-0">
              <Factory size={20} />
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-[#D8F36A] font-bold">Nguồn nhân tạo 3</span>
              <h4 className="font-bold text-sm text-white">Lò hơi &amp; Luyện kim</h4>
              <p className="text-xs text-[#A8BBC8] mt-0.5 leading-snug">
                Lò nung clinker xi măng, luyện thép, sản xuất phân bón hóa học và lò hơi trong các khu công nghiệp.
              </p>
            </div>
          </div>

          <div className="bg-[#102838]/85 p-3.5 rounded-2xl border border-[#29485A] flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#8FCB89]/15 text-[#8FCB89] border border-[#8FCB89]/30 shrink-0">
              <CloudLightning size={20} />
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-[#8FCB89] font-bold">Nguồn tự nhiên</span>
              <h4 className="font-bold text-sm text-white">Tia sét &amp; Sinh quyển</h4>
              <p className="text-xs text-[#A8BBC8] mt-0.5 leading-snug">
                Hồ quang tia sét (&gt;30.000°C), cháy rừng tự nhiên và hoạt động vi sinh vật đất (chiếm tỷ lệ nhỏ ở đô thị).
              </p>
            </div>
          </div>
        </div>

        {/* Scientific Warning Banner */}
        <div className="p-3 rounded-2xl bg-[#071521]/90 border border-[#29485A] flex items-center gap-2.5 text-xs text-[#DCE6F0]">
          <EyeOff size={16} className="text-[#54D7E8] shrink-0" />
          <span>
            <strong className="text-[#54D7E8]">Nguyên tắc an toàn &amp; quan trắc:</strong> Không thể đánh giá mức độ ô nhiễm NOₓ chỉ bằng mắt thường vì khí NO hoàn toàn không màu, còn NO₂ khi khuếch tán loãng trong không khí cũng khó nhận biết bằng màu sắc.
          </span>
        </div>
      </div>
    </div>
  );
}
