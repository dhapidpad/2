import React, { useState } from 'react';
import { ShieldAlert, Flame, ThermometerSnowflake } from 'lucide-react';
import EquationCard from '../components/EquationCard';
import { sfx } from '../audio/sfx';

export default function Slide08Step1Combustion() {
  const [highTemp, setHighTemp] = useState(true);

  return (
    <div className="w-full min-h-full flex flex-col justify-between py-1 gap-3 relative">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#54D7E8]/15 border border-[#54D7E8]/35 text-[#54D7E8] text-xs font-bold tracking-wider uppercase">
              Cơ chế Bước 1 / 3 • Hình thành NO do nhiệt (Thermal NOₓ)
            </span>
            <span className="text-xs text-[#A8BBC8]">Phá vỡ liên kết ba N≡N bền vững</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            BƯỚC 1 — NHIỆT ĐỘ CAO CÓ THỂ TẠO NO
          </h2>
        </div>

        {/* Interactive Temperature Regime Toggle */}
        <div className="flex items-center gap-1.5 bg-[#071521] p-1 rounded-xl border border-[#29485A]">
          <button
            onClick={() => {
              setHighTemp(false);
              sfx.pop();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              !highTemp
                ? 'bg-[#54D7E8] text-[#050E17] shadow-md'
                : 'text-[#A8BBC8] hover:text-white'
            }`}
          >
            <ThermometerSnowflake size={14} />
            <span>Nhiệt độ thường (25°C)</span>
          </button>
          <button
            onClick={() => {
              setHighTemp(true);
              sfx.spark();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              highTemp
                ? 'bg-[#FF875F] text-[#050E17] shadow-md'
                : 'text-[#A8BBC8] hover:text-white'
            }`}
          >
            <Flame size={14} />
            <span>Vùng cháy (&gt;1200°C)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left (5 cols) Detailed Cutaway Engine SVG | Right (7 cols) Equation & Mechanism */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-auto items-center">
        {/* Left Column (5 cols): Detailed Cutaway Combustion Chamber SVG */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[420px] glass-panel p-4 rounded-3xl border border-[#29485A] flex flex-col items-center justify-center relative">
            <svg
              viewBox="0 0 360 330"
              className="w-full h-auto select-none"
              role="img"
              aria-labelledby="s8EngineTitle s8EngineDesc"
            >
              <title id="s8EngineTitle">Sơ đồ cắt lớp buồng đốt nhiệt độ cao tạo khí NO từ N2 và O2</title>
              <desc id="s8EngineDesc">
                Không khí chứa N2 và O2 đi qua van nạp vào buồng đốt; ở nhiệt độ trên 1200 độ C, liên kết N≡N bị bẻ gãy kết hợp với O2 tạo thành 2NO thoát ra van xả.
              </desc>
              <defs>
                {/* Plasma Flame Radial Multi-Stop Core */}
                <radialGradient id="s8FlamePlasma" cx="50%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="20%" stopColor="#FEF08A" />
                  <stop offset="45%" stopColor="#FF875F" />
                  <stop offset="78%" stopColor="#DC2626" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#7F1D1D" stopOpacity="0.05" />
                </radialGradient>

                {/* Metallic Alloy Gradients for Piston & Cylinder */}
                <linearGradient id="s8CylinderWall" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="15%" stopColor="#334155" />
                  <stop offset="50%" stopColor="#0F172A" />
                  <stop offset="85%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>

                <linearGradient id="s8PistonCrown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94A3B8" />
                  <stop offset="25%" stopColor="#475569" />
                  <stop offset="75%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>

                <linearGradient id="s8ConnectingRod" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="50%" stopColor="#94A3B8" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>
              </defs>

              {/* Cooling Fins on Cylinder Exterior */}
              <g stroke="#334155" strokeWidth="2.5" opacity="0.6">
                {[65, 85, 105, 125, 145, 165].map((y) => (
                  <React.Fragment key={y}>
                    <line x1="56" y1={y} x2="75" y2={y} />
                    <line x1="285" y1={y} x2="304" y2={y} />
                  </React.Fragment>
                ))}
              </g>

              {/* Intake Manifold & Valve (Left) */}
              <g>
                <path d="M 12 56 H 92 V 88 H 12 Z" fill="#0B2234" stroke="#54D7E8" strokeWidth="1.8" />
                {/* Airflow arrows */}
                <path d="M 18 72 H 78" stroke="#54D7E8" strokeWidth="2" strokeDasharray="5 3" className="animate-dash-flow" />
                <text x="52" y="46" fill="#54D7E8" fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                  KHÍ NẠP (N₂ + O₂)
                </text>
                {/* Molecules entering */}
                <circle cx="34" cy="72" r="6" fill="#54D7E8" />
                <circle cx="44" cy="72" r="6" fill="#54D7E8" />
                <circle cx="64" cy="72" r="5" fill="#FF875F" />
                <circle cx="73" cy="72" r="5" fill="#FF875F" />
              </g>

              {/* Exhaust Manifold & Valve (Right) */}
              <g>
                <path
                  d="M 268 56 H 348 V 88 H 268 Z"
                  fill={highTemp ? '#221415' : '#0B2234'}
                  stroke={highTemp ? '#FF875F' : '#54D7E8'}
                  strokeWidth="1.8"
                />
                {highTemp && (
                  <path d="M 276 72 H 340" stroke="#FF875F" strokeWidth="2" strokeDasharray="5 3" className="animate-dash-flow" />
                )}
                <text x="308" y="46" fill={highTemp ? '#FF875F' : '#54D7E8'} fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                  {highTemp ? 'KHÍ THẢI (•NO ↑)' : 'KHÔNG TẠO NO'}
                </text>
                {/* Exhaust molecules */}
                <circle cx="292" cy="72" r="6" fill="#54D7E8" />
                <circle cx="303" cy="72" r="5.5" fill={highTemp ? '#FF875F' : '#54D7E8'} />
                <circle cx="322" cy="72" r="6" fill={highTemp ? '#54D7E8' : '#FF875F'} />
                <circle cx="333" cy="72" r="5.5" fill="#FF875F" />
              </g>

              {/* Cylinder Engine Block Housing */}
              <rect x="74" y="44" width="212" height="208" rx="14" fill="#06131E" stroke="url(#s8CylinderWall)" strokeWidth="6" />
              <rect x="75" y="45" width="210" height="206" rx="12" fill="none" stroke="#29485A" strokeWidth="1.5" />

              {/* Spark Plug at Top Center */}
              <g transform="translate(162, 10)">
                {/* Insulator ceramic ribs */}
                <rect x="4" y="0" width="28" height="34" rx="4" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
                <line x1="4" y1="8" x2="32" y2="8" stroke="#94A3B8" strokeWidth="1.5" />
                <line x1="4" y1="16" x2="32" y2="16" stroke="#94A3B8" strokeWidth="1.5" />
                <line x1="4" y1="24" x2="32" y2="24" stroke="#94A3B8" strokeWidth="1.5" />
                {/* Metallic threaded hex collar */}
                <rect x="0" y="34" width="36" height="12" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
                {/* Ground & center electrode gap */}
                <line x1="18" y1="46" x2="18" y2="60" stroke="#FFFFFF" strokeWidth="3" />
                <path d="M 12 56 H 18" stroke="#94A3B8" strokeWidth="2.5" fill="none" />
              </g>

              {/* Combustion Spark & Flame Plasma */}
              {highTemp ? (
                <g>
                  {/* Electric Arc Spark */}
                  <g style={{ transformOrigin: '180px 72px' }}>
                    <circle cx="180" cy="72" r="26" fill="#D8F36A" opacity="0.3" className="animate-spark" />
                    <path d="M 174 66 L 180 76 L 186 66" stroke="#FFFFFF" strokeWidth="3" fill="none" className="animate-spark" />
                  </g>
                  {/* Multi-layered Plasma Fireball */}
                  <ellipse cx="180" cy="110" rx="90" ry="46" fill="url(#s8FlamePlasma)" />
                  <ellipse cx="180" cy="104" rx="55" ry="24" fill="#FFFFFF" opacity="0.35" />
                  <text x="180" y="104" textAnchor="middle" fill="#050E17" fontSize="13.5" fontWeight="900" fontFamily="monospace">
                    VÙNG CHÁY NHIỆT ĐỘ CAO
                  </text>
                  <text x="180" y="124" textAnchor="middle" fill="#FFFFFF" fontSize="12.5" fontWeight="900" fontFamily="monospace">
                    T &gt; 1200°C – 1500°C
                  </text>
                </g>
              ) : (
                <g>
                  <rect x="92" y="76" width="176" height="72" rx="14" fill="#081A28" stroke="#54D7E8" strokeDasharray="5 5" />
                  <text x="180" y="104" textAnchor="middle" fill="#54D7E8" fontSize="12.5" fontWeight="900">
                    NHIỆT ĐỘ THƯỜNG (~25°C)
                  </text>
                  <text x="180" y="122" textAnchor="middle" fill="#DCE6F0" fontSize="11">
                    N₂ và O₂ va chạm đàn hồi
                  </text>
                  <text x="180" y="137" textAnchor="middle" fill="#A8BBC8" fontSize="10.5">
                    KHÔNG đủ năng lượng bẻ gãy N≡N
                  </text>
                </g>
              )}

              {/* Animated Reciprocating Piston with Metallic Shading */}
              <g className={highTemp ? 'animate-piston' : ''}>
                <rect x="84" y="160" width="192" height="60" rx="8" fill="url(#s8PistonCrown)" stroke="#54D7E8" strokeWidth="1.8" />
                {/* Compression Rings */}
                <line x1="84" y1="170" x2="276" y2="170" stroke="#38BDF8" strokeWidth="2" />
                <line x1="84" y1="178" x2="276" y2="178" stroke="#38BDF8" strokeWidth="1.5" />
                <line x1="84" y1="186" x2="276" y2="186" stroke="#94A3B8" strokeWidth="1.5" />
                {/* Wrist Pin */}
                <circle cx="180" cy="195" r="11" fill="#0F172A" stroke="#94A3B8" strokeWidth="2.5" />
                {/* Connecting Rod */}
                <path d="M 172 205 L 165 248 H 195 L 188 205 Z" fill="url(#s8ConnectingRod)" stroke="#334155" strokeWidth="1" />
              </g>

              {/* Bottom Molecular Bond-Breaking Inset */}
              <rect x="12" y="260" width="336" height="60" rx="14" fill="#071521" stroke={highTemp ? '#D8F36A' : '#29485A'} strokeWidth="1.8" />
              <text x="180" y="280" textAnchor="middle" fill={highTemp ? '#D8F36A' : '#A8BBC8'} fontSize="11" fontWeight="900">
                {highTemp
                  ? 'ĐỦ NĂNG LƯỢNG BẺ GÃY LIÊN KẾT BA N≡N (945 kJ/mol)'
                  : 'LIÊN KẾT BA N≡N (945 kJ/mol) RẤT BỀN Ở NHIỆT ĐỘ PHÒNG'}
              </text>
              <text x="180" y="303" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="monospace">
                {highTemp ? 'N≡N + O=O —(t° > 1200°C)→ 2 •NO' : 'N≡N + O=O —(25°C)→ Không phản ứng'}
              </text>
            </svg>
          </div>
        </div>

        {/* Right Column (7 cols): Equation, 3-Step Flow & Scientific Context */}
        <div className="lg:col-span-7 space-y-3.5">
          <EquationCard
            title="Phương trình hình thành nitric oxide ở vùng cháy nhiệt độ cao"
            badge="Cơ chế nhiệt (Thermal NOₓ)"
            badgeColor="cyan"
            highlight={true}
            thermodynamics="ΔH°₂₉₈ = +180,6 kJ/mol (Thu nhiệt)"
            atomBalance="Vế trái: 2 N, 2 O  =  Vế phải: 2 N, 2 O"
            equationHtml="N<sub>2</sub>(g) + O<sub>2</sub>(g) <span style='color:#54D7E8;font-size:0.75em'>&mdash;(t° &gt; 1200°C / tia lửa)&rarr;</span> 2NO(g)"
            note="N₂ tương đối bền; nhiệt độ cao trong vùng cháy tạo điều kiện để phản ứng xảy ra. Không phải toàn bộ nitrogen đi vào động cơ đều chuyển thành NO."
          />

          {/* 3-Step Process Strip per acid.md Slide 08 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#102838]/90 p-3.5 rounded-2xl border border-[#29485A]">
              <span className="text-xs text-[#54D7E8] font-mono font-bold block mb-1">1. Không khí chứa N₂ và O₂</span>
              <h4 className="font-bold text-sm text-white">Nạp vào buồng đốt</h4>
              <p className="text-xs text-[#A8BBC8] mt-1 leading-relaxed">
                Không khí tự nhiên (~78% N₂, ~21% O₂) đi vào xi-lanh động cơ hoặc buồng lửa lò hơi.
              </p>
            </div>

            <div className="bg-[#102838]/90 p-3.5 rounded-2xl border border-[#29485A]">
              <span className="text-xs text-[#FF875F] font-mono font-bold block mb-1">2. Vùng cháy nóng</span>
              <h4 className="font-bold text-sm text-white">Phá vỡ liên kết ba N≡N</h4>
              <p className="text-xs text-[#A8BBC8] mt-1 leading-relaxed">
                Nhiệt độ cực cao cung cấp năng lượng hoạt hóa lớn để một phần N₂ phản ứng với O₂.
              </p>
            </div>

            <div className="bg-[#102838]/90 p-3.5 rounded-2xl border border-[#29485A]">
              <span className="text-xs text-[#D8F36A] font-mono font-bold block mb-1">3. NO trong khí thải</span>
              <h4 className="font-bold text-sm text-white">Thoát ra môi trường</h4>
              <p className="text-xs text-[#A8BBC8] mt-1 leading-relaxed">
                Khí NO không màu theo luồng khí xả đi vào bầu khí quyển, mở đầu chuỗi tạo mưa axit.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#071521]/90 border border-[#29485A] flex items-start gap-3 text-xs text-[#DCE6F0]">
            <ShieldAlert size={18} className="text-[#FF875F] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#FF875F] block mb-0.5">Điểm cốt lõi cần nắm vững:</strong>
              Ở điều kiện thường, N₂ và O₂ trong khí quyển chung sống hòa bình. Chỉ khi gặp nhiệt độ cực cao (động cơ đốt trong, lò công nghiệp hoặc tia sét), phản ứng thu nhiệt tạo <strong>NO</strong> mới diễn ra đáng kể.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
