import React, { useState } from 'react';
import { Info, Droplets, AlertTriangle, Sparkles } from 'lucide-react';
import { sfx } from '../audio/sfx';

const PH_BENCHMARKS = [
  { ph: 1.0, name: 'Axit ắc quy / Dịch vị dạ dày', hRatio: '1.000.000×', color: '#E85D63', desc: 'Axit vô cơ đậm đặc (H₂SO₄, HCl dạ dày), có tính ăn mòn cực mạnh.' },
  { ph: 2.4, name: 'Nước chanh / Giấm ăn', hRatio: '~40.000×', color: '#EE745C', desc: 'Axit hữu cơ yếu (axit citric, axit acetic CH₃COOH) trong thực phẩm.' },
  { ph: 4.3, name: 'Mưa axit điển hình (U.S. EPA: 4,2–4,4)', hRatio: '~500× (gấp ~20× mưa tự nhiên)', color: '#FF875F', desc: 'Chứa HNO₃ và H₂SO₄ từ khí thải NOₓ và SO₂. Gây axit hóa hồ, rửa trôi khoáng đất và ăn mòn đá vôi.' },
  { ph: 5.6, name: 'Nước mưa tự nhiên sạch (Mốc tham khảo)', hRatio: '~25× so với pH 7', color: '#D8F36A', desc: 'Hơi axit tự nhiên do khí CO₂ trong khí quyển hòa tan tạo axit carbonic yếu: CO₂ + H₂O ⇌ H₂CO₃.' },
  { ph: 7.0, name: 'Nước tinh khiết trung tính (25°C)', hRatio: '1× ([H⁺] = 10⁻⁷ M)', color: '#8FCB89', desc: 'Cân bằng điện ly của nước: [H⁺] = [OH⁻] = 1,0 × 10⁻⁷ mol/L.' },
  { ph: 8.1, name: 'Nước biển tự nhiên / Hệ đệm Bicarbonate', hRatio: '0,08×', color: '#55B7D2', desc: 'Có tính kiềm nhẹ nhờ hệ đệm carbonate/bicarbonate tự nhiên.' },
  { ph: 12.5, name: 'Nước vôi trong Ca(OH)₂ / Chất tẩy rửa', hRatio: '0,000003×', color: '#7777DE', desc: 'Môi trường kiềm mạnh, dùng để trung hòa axit trong xử lý môi trường.' }
];

const LOG_COMPARISON = [
  { ph: 'pH 4,0', hConc: '10⁻⁴ M', rel7: '1.000×', rel56: '~40×', tone: '#F06B70' },
  { ph: 'pH 4,3 (EPA)', hConc: '5×10⁻⁵ M', rel7: '~500×', rel56: '~20×', tone: '#FF875F' },
  { ph: 'pH 5,0', hConc: '10⁻⁵ M', rel7: '100×', rel56: '~4×', tone: '#F1B65C' },
  { ph: 'pH 5,6 (Tự nhiên)', hConc: '2,5×10⁻⁶ M', rel7: '~25×', rel56: '1× (Mốc)', tone: '#D8F36A' },
  { ph: 'pH 6,0', hConc: '10⁻⁶ M', rel7: '10×', rel56: '0,4×', tone: '#A7E07A' },
  { ph: 'pH 7,0 (Trung tính)', hConc: '10⁻⁷ M', rel7: '1×', rel56: '0,04×', tone: '#8FCB89' },
];

export default function PHScaleBar({ currentPh = 5.6, showDetails = true }) {
  const [selectedBenchmark, setSelectedBenchmark] = useState(PH_BENCHMARKS[3]); // Default to pH 5.6

  const handleSelect = (b) => {
    setSelectedBenchmark(b);
    // Sonification: deeper droplet pop for acidic pH, crystal tone for alkaline pH
    sfx.pop(0.75 + (b.ph / 14) * 0.9, (b.ph / 7) - 1);
  };

  // Coordinate mapping on SVG 0 -> 14: x starts at 54, ends at 1146 (step = 78 per pH unit)
  const getX = (val) => 54 + Math.min(14, Math.max(0, val)) * 78;

  return (
    <div className="w-full glass-panel rounded-3xl p-4 sm:p-5 border border-[#29485A] space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#54D7E8]/15 text-[#54D7E8] border border-[#54D7E8]/35 flex items-center gap-1">
            <Sparkles size={12} /> Thang pH Logarit Chuẩn (0 — 14)
          </span>
        </div>
        <span className="text-xs text-[#A8BBC8] flex items-center gap-1 font-mono bg-[#050E17]/70 px-2.5 py-0.5 rounded-lg border border-[#29485A]">
          <Info size={12} className="text-[#D8F36A]" /> pH = −log₁₀[H⁺] • Giảm 1 pH ⇒ [H⁺] tăng 10×
        </span>
      </div>

      {/* High-Precision Interactive SVG pH Scale (SVG D from acid.md enhanced) */}
      <div className="w-full overflow-x-auto rounded-2xl bg-[#071521]/90 border border-[#29485A]/80 p-2">
        <svg
          viewBox="0 0 1200 320"
          className="w-full h-auto select-none"
          role="img"
          aria-labelledby="phScaleTitle phScaleDesc"
        >
          <title id="phScaleTitle">Thang pH từ 0 đến 14 và các mốc tham khảo mưa axit</title>
          <desc id="phScaleDesc">
            Thang pH từ 0 đến 14. pH 7 là trung tính, pH khoảng 5,6 là mốc tham khảo cho nước mưa tự nhiên hơi axit do CO2 hòa tan, và khoảng pH 4,2 đến 4,4 là mưa axit điển hình theo U.S. EPA.
          </desc>
          <defs>
            <linearGradient id="phSpectrumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E85D63" />
              <stop offset="18%" stopColor="#F07855" />
              <stop offset="31%" stopColor="#F5A65B" />
              <stop offset="40%" stopColor="#D8F36A" />
              <stop offset="50%" stopColor="#8FCB89" />
              <stop offset="68%" stopColor="#54D7E8" />
              <stop offset="85%" stopColor="#5B8DEF" />
              <stop offset="100%" stopColor="#8B68E8" />
            </linearGradient>
            {/* Top glass gloss sheen */}
            <linearGradient id="phGlassSheen" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            {/* Dark bottom shadow for cylindrical 3D effect */}
            <linearGradient id="phCylDepth" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="70%" stopColor="#000000" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.38" />
            </linearGradient>
            {/* Hazard stripe pattern */}
            <pattern id="phHazardPattern" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="16" stroke="#FF875F" strokeWidth="4" strokeOpacity="0.35" />
            </pattern>
            {/* Soft filter for glow */}
            <filter id="phBandGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Zone Labels with clear directional indicators */}
          <g fontFamily="Be Vietnam Pro, Inter, sans-serif" fontWeight="800" fontSize="18">
            <text x="54" y="36" fill="#F06B70" paintOrder="stroke" stroke="#050E17" strokeWidth="4">← VÙNG AXIT ([H⁺] &gt; [OH⁻])</text>
            <text x="600" y="36" fill="#8FCB89" textAnchor="middle" paintOrder="stroke" stroke="#050E17" strokeWidth="4">TRUNG TÍNH (7,0)</text>
            <text x="1146" y="36" fill="#8B68E8" textAnchor="end" paintOrder="stroke" stroke="#050E17" strokeWidth="4">VÙNG KIỀM ([OH⁻] &gt; [H⁺]) →</text>
          </g>

          {/* Acid Rain Warning Zone Bracket (0 -> 5.6) with hazard stripe overlay */}
          <rect
            x="54"
            y="48"
            width={getX(5.6) - 54}
            height="18"
            rx="9"
            fill="#F06B70"
            fillOpacity="0.18"
            stroke="#F06B70"
            strokeOpacity="0.5"
          />
          <rect
            x="54"
            y="48"
            width={getX(5.6) - 54}
            height="18"
            rx="9"
            fill="url(#phHazardPattern)"
          />
          <text x={(54 + getX(5.6)) / 2} y="61.5" fill="#FFB596" fontSize="11" fontWeight="800" textAnchor="middle" letterSpacing="0.05em" paintOrder="stroke" stroke="#050E17" strokeWidth="3">
            ⚠ MIỀN GIÁNG THỦY AXIT (pH &lt; 5,6)
          </text>

          {/* Main 3D Cylindrical Spectrum Bar */}
          <g>
            {/* Color spectrum */}
            <rect x="54" y="74" width="1092" height="44" rx="22" fill="url(#phSpectrumGrad)" />
            {/* Cylindrical bottom depth */}
            <rect x="54" y="74" width="1092" height="44" rx="22" fill="url(#phCylDepth)" />
            {/* Gloss specular reflection along top half */}
            <rect x="58" y="76" width="1084" height="20" rx="10" fill="url(#phGlassSheen)" />
            {/* Border glow ring */}
            <rect x="54" y="74" width="1092" height="44" rx="22" fill="none" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1.5" />
          </g>

          {/* Integer Ticks 0..14 */}
          {Array.from({ length: 15 }, (_, i) => {
            const x = getX(i);
            const isMajor = i === 0 || i === 4 || i === 5 || i === 7 || i === 14;
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={120}
                  x2={x}
                  y2={isMajor ? 138 : 132}
                  stroke="#F4F7FA"
                  strokeOpacity={isMajor ? 0.95 : 0.55}
                  strokeWidth={isMajor ? 2.5 : 1.5}
                />
                <text
                  x={x}
                  y={158}
                  textAnchor="middle"
                  fill={isMajor ? '#FFFFFF' : '#A8BBC8'}
                  fontSize={isMajor ? '18' : '15'}
                  fontWeight={isMajor ? '900' : '600'}
                  fontFamily="JetBrains Mono, monospace"
                  paintOrder="stroke"
                  stroke="#050E17"
                  strokeWidth="3"
                >
                  {i}
                </text>
              </g>
            );
          })}

          {/* EPA Acid Rain Band (pH 4.15 - 4.45) */}
          <rect
            x={getX(4.15)}
            y="66"
            width={getX(4.45) - getX(4.15)}
            height="60"
            rx="10"
            fill="#FF875F"
            fillOpacity="0.4"
            stroke="#FF875F"
            strokeWidth="2.5"
            filter="url(#phBandGlow)"
          />
          <path
            d={`M ${getX(4.3)} 126 V 192 H 265`}
            fill="none"
            stroke="#FF875F"
            strokeWidth="2.5"
            strokeDasharray="5 4"
          />
          <g
            className="cursor-pointer"
            onClick={() => handleSelect(PH_BENCHMARKS[2])}
          >
            <rect x="48" y="172" width="295" height="62" rx="14" fill="#18222D" stroke="#FF875F" strokeWidth="2" />
            <text x="64" y="196" fill="#FF875F" fontSize="16" fontWeight="800">
              pH 4,2 – 4,4 (Mưa axit EPA)
            </text>
            <text x="64" y="217" fill="#DCE6F0" fontSize="13">
              Axit gấp ~16–25 lần mưa tự nhiên
            </text>
          </g>

          {/* Natural Rain Reference (pH 5.6) */}
          <line
            x1={getX(5.6)}
            y1="66"
            x2={getX(5.6)}
            y2="245"
            stroke="#D8F36A"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
          <circle cx={getX(5.6)} cy="96" r="10" fill="#D8F36A" stroke="#050E17" strokeWidth="2.5" filter="url(#phBandGlow)" />
          <g
            className="cursor-pointer"
            onClick={() => handleSelect(PH_BENCHMARKS[3])}
          >
            <rect x={getX(5.6) - 125} y="242" width="250" height="62" rx="14" fill="#102838" stroke="#D8F36A" strokeWidth="2" />
            <text x={getX(5.6)} y="266" textAnchor="middle" fill="#D8F36A" fontSize="16" fontWeight="800">
              pH ≈ 5,6 (Mốc mưa tự nhiên)
            </text>
            <text x={getX(5.6)} y="287" textAnchor="middle" fill="#DCE6F0" fontSize="13">
              Do CO₂ + H₂O ⇌ H₂CO₃ (axit yếu)
            </text>
          </g>

          {/* Neutral Reference (pH 7.0) */}
          <line
            x1={getX(7.0)}
            y1="70"
            x2={getX(7.0)}
            y2="180"
            stroke="#8FCB89"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />
          <circle cx={getX(7.0)} cy="96" r="8" fill="#8FCB89" stroke="#050E17" strokeWidth="2" />
          <g
            className="cursor-pointer"
            onClick={() => handleSelect(PH_BENCHMARKS[4])}
          >
            <rect x={getX(7.0) + 18} y="172" width="220" height="58" rx="14" fill="#102838" stroke="#8FCB89" strokeWidth="1.5" />
            <text x={getX(7.0) + 128} y="196" textAnchor="middle" fill="#8FCB89" fontSize="16" fontWeight="800">
              pH = 7,0 (Trung tính)
            </text>
            <text x={getX(7.0) + 128} y="216" textAnchor="middle" fill="#A8BBC8" fontSize="13">
              Nước tinh khiết [H⁺] = 10⁻⁷ M
            </text>
          </g>

          {/* Dynamic Floating Pointer Badge above the currently selected benchmark */}
          {selectedBenchmark && (
            <g transform={`translate(${getX(selectedBenchmark.ph)}, 74)`}>
              {/* Vertical line through bar */}
              <line x1="0" y1="-26" x2="0" y2="44" stroke={selectedBenchmark.color} strokeWidth="2.5" strokeDasharray="3 2" />
              {/* Pulsing ring on the bar */}
              <circle cx="0" cy="22" r="15" fill={selectedBenchmark.color} fillOpacity="0.2">
                <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0.15;0.7" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Pointer Tag at top */}
              <g transform="translate(0, -30)">
                <path
                  d="M -28 -14 H 28 A 5 5 0 0 1 33 -9 V 1 A 5 5 0 0 1 28 6 H 5 L 0 13 L -5 6 H -28 A 5 5 0 0 1 -33 1 V -9 A 5 5 0 0 1 -28 -14 Z"
                  fill="#071521"
                  stroke={selectedBenchmark.color}
                  strokeWidth="2"
                  filter="url(#phBandGlow)"
                />
                <text x="0" y="-2" fill={selectedBenchmark.color} fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                  pH {String(selectedBenchmark.ph).replace('.', ',')}
                </text>
              </g>
            </g>
          )}

          {/* Interactive Benchmark Pins along the bar */}
          {PH_BENCHMARKS.map((b, idx) => {
            const bx = getX(b.ph);
            const isSel = selectedBenchmark?.ph === b.ph;
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onClick={() => handleSelect(b)}
              >
                <circle
                  cx={bx}
                  cy="96"
                  r={isSel ? 13 : 7}
                  fill={b.color}
                  stroke="#FFFFFF"
                  strokeWidth={isSel ? 3 : 1.5}
                  filter={isSel ? 'url(#phBandGlow)' : undefined}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Benchmark Selector Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#A8BBC8]">
          <span>Nhấn vào từng mốc pH để xem giải thích hóa học chi tiết:</span>
          <span className="text-[#54D7E8] font-mono">Nguồn tham khảo: U.S. EPA</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PH_BENCHMARKS.map((b) => {
            const active = selectedBenchmark?.ph === b.ph;
            return (
              <button
                key={b.ph}
                onClick={() => handleSelect(b)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all ${
                  active
                    ? 'bg-[#143245] text-white border-[#54D7E8] shadow-md scale-[1.03]'
                    : 'bg-[#071521]/70 text-[#A8BBC8] border-[#29485A]/70 hover:text-white'
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: b.color }} />
                pH {String(b.ph).replace('.', ',')}
              </button>
            );
          })}
        </div>

        {/* Active Benchmark Detail Box */}
        {selectedBenchmark && (
          <div className="p-3 rounded-2xl bg-[#071521]/90 border border-[#29485A] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span className="font-mono px-2 py-0.5 rounded text-[#050E17] font-black" style={{ backgroundColor: selectedBenchmark.color }}>
                  pH {String(selectedBenchmark.ph).replace('.', ',')}
                </span>
                <span>{selectedBenchmark.name}</span>
              </div>
              <p className="text-[#A8BBC8] mt-1 leading-relaxed">{selectedBenchmark.desc}</p>
            </div>
            <div className="sm:text-right shrink-0 bg-[#102838] px-3 py-1.5 rounded-xl border border-[#29485A]">
              <span className="text-xs text-[#A8BBC8] block uppercase">Nồng độ [H⁺] so với pH 7</span>
              <span className="font-mono font-bold text-[#D8F36A] text-sm">{selectedBenchmark.hRatio}</span>
            </div>
          </div>
        )}
      </div>

      {/* Logarithmic [H+] Comparison Table from acid.md Part X */}
      {showDetails && (
        <div className="pt-2 border-t border-[#29485A]/50">
          <div className="text-xs font-bold text-[#DCE6F0] mb-2 flex items-center justify-between">
            <span>Bảng quy đổi tương quan Logarit nồng độ ion H⁺ (Mô hình lý tưởng ở 25°C)</span>
            <span className="text-xs text-[#A8BBC8] font-normal italic hidden sm:inline">
              *Mốc 5,6 chỉ là giá trị tham khảo quốc tế, không phải ranh giới tuyệt đối cho mọi địa phương
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center">
            {LOG_COMPARISON.map((row, idx) => (
              <div key={idx} className="bg-[#071521]/75 p-2 rounded-xl border border-[#29485A]/60">
                <div className="font-mono font-bold text-xs" style={{ color: row.tone }}>{row.ph}</div>
                <div className="font-mono text-xs text-white mt-0.5">{row.rel7}</div>
                <div className="text-xs text-[#6E8A9E] font-mono">{row.hConc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
