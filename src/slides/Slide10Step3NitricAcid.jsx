import React, { useState } from 'react';
import { Info, CheckCircle2 } from 'lucide-react';
import EquationCard from '../components/EquationCard';
import { sfx } from '../audio/sfx';

export default function Slide10Step3NitricAcid() {
  const [activeTier, setActiveTier] = useState(3);

  const selectTier = (t) => {
    setActiveTier(t);
    sfx.pop(0.85 + t * 0.2, (t - 2) * 0.4);
  };

  return (
    <div className="w-full min-h-full flex flex-col justify-between py-1 gap-3 relative">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#D8F36A]/15 border border-[#D8F36A]/35 text-[#D8F36A] text-xs font-bold tracking-wider uppercase">
            Cơ chế Bước 3 / 3 • Trọng tâm câu hỏi 1 của đề bài
          </span>
          <span className="text-xs text-[#A8BBC8]">Mô hình phản ứng đơn giản hóa trong pha nước &amp; phương trình tổng quát</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          BƯỚC 3 — NO₂ CHUYỂN HÓA THÀNH AXIT NITRIC (HNO₃)
        </h2>
      </div>

      {/* Main Grid: Left (7 cols) 3-Tier Reaction Cascade | Right (5 cols) Cloud Droplet Reactor SVG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto items-center">
        {/* Left Column (7 cols): 3 Vertical Reaction Tiers per acid.md Slide 10 */}
        <div className="lg:col-span-7 space-y-3">
          {/* Tier 1: Disproportionation */}
          <div
            onClick={() => selectTier(1)}
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTier === 1
                ? 'bg-[#143245] border-[#54D7E8] shadow-lg'
                : 'glass-panel border-[#29485A] hover:border-[#54D7E8]/40'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-[#54D7E8] uppercase">
                Giai đoạn 3.1 • Hòa tan &amp; tự oxi hóa – tự khử trong nước
              </span>
              <span className="text-xs font-mono text-[#A8BBC8] bg-[#050E17] px-2 py-0.5 rounded border border-[#29485A]">
                Cân bằng: 2N, 2H, 5O
              </span>
            </div>
            <div
              className="font-mono text-base sm:text-xl font-extrabold text-white py-1"
              dangerouslySetInnerHTML={{
                __html: "2NO<sub>2</sub>(g) + H<sub>2</sub>O(l) &rarr; HNO<sub>2</sub>(aq) + HNO<sub>3</sub>(aq)"
              }}
            />
            <p className="text-xs text-[#DCE6F0]">
              Hai phân tử NO₂ (N⁺⁴) tác dụng với nước tạo hỗn hợp <strong>axit nitrous (HNO₂, N⁺³)</strong> và <strong>axit nitric (HNO₃, N⁺⁵)</strong>.
            </p>
          </div>

          {/* Tier 2: Oxidation of HNO2 */}
          <div
            onClick={() => selectTier(2)}
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTier === 2
                ? 'bg-[#281E1C] border-[#FF875F] shadow-lg'
                : 'glass-panel border-[#29485A] hover:border-[#FF875F]/40'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-[#FF875F] uppercase">
                Giai đoạn 3.2 • Oxi hóa tiếp tục axit nitrous (HNO₂)
              </span>
              <span className="text-xs font-mono text-[#A8BBC8] bg-[#050E17] px-2 py-0.5 rounded border border-[#29485A]">
                Cân bằng: 2N, 2H, 6O
              </span>
            </div>
            <div
              className="font-mono text-base sm:text-xl font-extrabold text-white py-1"
              dangerouslySetInnerHTML={{
                __html: "2HNO<sub>2</sub>(aq) + O<sub>2</sub>(g) &rarr; 2HNO<sub>3</sub>(aq)"
              }}
            />
            <p className="text-xs text-[#DCE6F0]">
              Axit yếu HNO₂ kém bền, tiếp tục bị oxygen hòa tan oxi hóa thành <strong>axit nitric (HNO₃)</strong>.
            </p>
          </div>

          {/* Tier 3: Net Overall Balanced Equation */}
          <div onClick={() => selectTier(3)} className="cursor-pointer">
            <EquationCard
              title="Phương trình tổng quát (Cộng Giai đoạn 3.1 × 2 + Giai đoạn 3.2)"
              badge="Phương trình tổng quát biểu diễn kết quả ròng"
              badgeColor="lime"
              highlight={true}
              atomBalance="Mỗi vế có đúng 4 N, 4 H và 12 O (8 từ 4NO₂ + 2 từ O₂ + 2 từ 2H₂O)"
              equationHtml="4NO<sub>2</sub>(g) + O<sub>2</sub>(g) + 2H<sub>2</sub>O(l) &rarr; 4HNO<sub>3</sub>(aq)"
              note="Lưu ý bắt buộc: Đây là phương trình tổng quát biểu diễn kết quả vật chất ròng của quá trình, không phải một va chạm sơ cấp đơn lẻ gồm 7 phân tử cùng lúc."
            />
          </div>

          <div className="p-2.5 rounded-xl bg-[#071521]/85 border border-[#29485A] flex items-center gap-2 text-xs text-[#DCE6F0]">
            <Info size={15} className="text-[#D8F36A] shrink-0" />
            <span>
              <strong className="text-[#D8F36A]">Mở rộng khí quyển thực:</strong> Ban ngày dưới ánh nắng mặt trời, một con đường quan trọng khác là NO₂ phản ứng với gốc tự do hydroxyl: <code className="text-[#54D7E8] font-mono">NO₂ + •OH &rarr; HNO₃</code>.
            </span>
          </div>
        </div>

        {/* Right Column (5 cols): Multi-Layered Cloud Droplet Micro-Reactor SVG */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[440px] glass-panel p-4 rounded-3xl border border-[#29485A] flex flex-col items-center shadow-2xl relative">
            <svg
              viewBox="0 0 380 355"
              className="w-full h-auto select-none"
              role="img"
              aria-labelledby="s10DropTitle s10DropDesc"
            >
              <title id="s10DropTitle">Sơ đồ phản ứng bên trong giọt mây tạo axit nitric HNO3</title>
              <desc id="s10DropDesc">
                Khí NO2 và O2 hòa tan vào giọt nước H2O trong mây, trải qua phản ứng tạo HNO2 trung gian rồi chuyển hóa hoàn toàn thành 4 phân tử HNO3.
              </desc>
              <defs>
                {/* 3D Liquid Lens Droplet Gradient */}
                <radialGradient id="s10DropletLens" cx="35%" cy="28%" r="72%">
                  <stop offset="0%" stopColor="#C4FAFF" stopOpacity="0.75" />
                  <stop offset="35%" stopColor="#38BED4" stopOpacity="0.55" />
                  <stop offset="70%" stopColor="#155E75" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#082436" stopOpacity="0.95" />
                </radialGradient>

                {/* Cloud Fluff Gradients */}
                <linearGradient id="s10CloudGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>

                <marker id="s10Arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#D8F36A" />
                </marker>
                <marker id="s10ArrCoral" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#FF875F" />
                </marker>
              </defs>

              {/* Upper Cloud Silhouettes & Silver Lining */}
              <g>
                <ellipse cx="110" cy="46" rx="65" ry="26" fill="url(#s10CloudGrad)" stroke="#54D7E8" strokeOpacity="0.4" />
                <ellipse cx="190" cy="38" rx="84" ry="32" fill="url(#s10CloudGrad)" stroke="#54D7E8" strokeOpacity="0.6" />
                <ellipse cx="270" cy="48" rx="62" ry="24" fill="url(#s10CloudGrad)" stroke="#54D7E8" strokeOpacity="0.4" />
                {/* Silver lining highlight on cloud top */}
                <path d="M 125 22 Q 190 10 255 24" fill="none" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="2.5" strokeLinecap="round" />
                <text x="190" y="44" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="800" letterSpacing="0.05em">
                  ĐÁM MÂY TẦNG ĐỐI LƯU (PHA NƯỚC)
                </text>
              </g>

              {/* Giant 3D Liquid Droplet Body */}
              <path
                d="M 190 64 C 130 140 92 198 92 254 A 98 98 0 0 0 288 254 C 288 198 250 140 190 64 Z"
                fill="url(#s10DropletLens)"
                stroke="#54D7E8"
                strokeWidth="2.5"
                style={{ filter: 'drop-shadow(0 12px 30px rgba(84,215,232,0.3))' }}
              />

              {/* Specular Rim Light on Left Surface */}
              <path
                d="M 172 88 C 132 142 108 192 108 248"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.65"
              />
              {/* Secondary internal caustic glint */}
              <ellipse cx="225" cy="275" rx="36" ry="12" fill="#FFFFFF" opacity="0.15" />

              {/* Reactant Gas Inflow Conduits (Left outside droplet -> entering) */}
              <g>
                {/* 4 NO2 */}
                <rect x="6" y="116" width="80" height="30" rx="8" fill="#2E1C1B" stroke="#FF875F" strokeWidth="1.5" />
                <text x="46" y="136" textAnchor="middle" fill="#FF875F" fontSize="12" fontWeight="900" fontFamily="monospace">
                  4 NO₂(g)
                </text>
                <path d="M 86 131 L 132 155" stroke="#FF875F" strokeWidth="2.5" strokeDasharray="4 3" markerEnd="url(#s10ArrCoral)" className="animate-dash-flow" />

                {/* 2 H2O */}
                <rect x="6" y="162" width="80" height="30" rx="8" fill="#0B2234" stroke="#54D7E8" strokeWidth="1.5" />
                <text x="46" y="182" textAnchor="middle" fill="#54D7E8" fontSize="12" fontWeight="900" fontFamily="monospace">
                  2 H₂O(l)
                </text>
                <path d="M 86 177 L 124 186" stroke="#54D7E8" strokeWidth="2.5" strokeDasharray="4 3" markerEnd="url(#s10Arr)" className="animate-dash-flow" />

                {/* + O2 */}
                <rect x="6" y="208" width="80" height="30" rx="8" fill="#0B2234" stroke="#D8F36A" strokeWidth="1.5" />
                <text x="46" y="228" textAnchor="middle" fill="#D8F36A" fontSize="12" fontWeight="900" fontFamily="monospace">
                  + O₂(g)
                </text>
                <path d="M 86 223 L 124 225" stroke="#D8F36A" strokeWidth="2.5" strokeDasharray="4 3" markerEnd="url(#s10Arr)" className="animate-dash-flow" />
              </g>

              {/* Inside Droplet Chamber: Giai đoạn 3.1 Trung gian */}
              <rect x="132" y="146" width="124" height="34" rx="10" fill="#071521" stroke="#54D7E8" strokeWidth="1.5" />
              <text x="194" y="168" textAnchor="middle" fill="#FFFFFF" fontSize="12.5" fontWeight="900" fontFamily="monospace">
                HNO₂ + HNO₃
              </text>

              {/* Cascade Arrow to Final Tier */}
              <path d="M 194 180 V 210" stroke="#D8F36A" strokeWidth="2.5" strokeDasharray="4 3" markerEnd="url(#s10Arr)" className="animate-dash-flow" />
              <text x="236" y="198" fill="#FF875F" fontSize="10" fontWeight="900" fontFamily="monospace">+ O₂ oxi hóa</text>

              {/* Final Product Pod inside Droplet */}
              <rect x="120" y="212" width="148" height="52" rx="14" fill="#142616" stroke="#D8F36A" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 10px rgba(216,243,106,0.35))' }} />
              <text x="194" y="236" textAnchor="middle" fill="#D8F36A" fontSize="17.5" fontWeight="900" fontFamily="monospace">
                4 HNO₃(aq)
              </text>
              <text x="194" y="254" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">
                Axit Nitric trong pha nước
              </text>

              {/* Dissociation Preview at Droplet Bottom Tip */}
              <g transform="translate(194, 298)">
                {/* H+ Cation */}
                <circle cx="-35" cy="0" r="16" fill="#D8F36A" stroke="#FFFFFF" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 6px rgba(216,243,106,0.6))' }} />
                <text x="-35" y="5" textAnchor="middle" fill="#050E17" fontSize="12.5" fontWeight="900" fontFamily="monospace">H⁺</text>

                {/* NO3- Anion */}
                <circle cx="35" cy="0" r="19" fill="#071E2D" stroke="#54D7E8" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 6px rgba(84,215,232,0.6))' }} />
                <text x="35" y="5" textAnchor="middle" fill="#54D7E8" fontSize="11.5" fontWeight="900" fontFamily="monospace">NO₃⁻</text>
              </g>

              {/* Falling Acid Drop Silhouette */}
              <path d="M 194 330 C 188 338 184 344 184 348 A 10 10 0 0 0 204 348 C 204 344 200 338 194 330 Z" fill="#D8F36A" opacity="0.8" />
            </svg>

            {/* Legend for state symbols */}
            <div className="w-full mt-1 pt-2 border-t border-[#29485A]/60 flex items-center justify-around text-xs font-mono text-[#A8BBC8]">
              <span><strong className="text-white">(g)</strong>: chất khí</span>
              <span><strong className="text-white">(l)</strong>: chất lỏng</span>
              <span><strong className="text-white">(aq)</strong>: tan trong nước</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
