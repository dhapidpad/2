import React, { useState } from 'react';
import { Flame, Wind, CloudRain, Mountain, Info, Play } from 'lucide-react';
import { sfx } from '../audio/sfx';

const STATIONS = [
  {
    id: 1,
    svgId: 'combustion',
    num: "Trạm 01",
    title: "Vùng cháy nhiệt độ cao",
    location: "Động cơ đốt trong & Lò hơi nhà máy",
    oxState: "N⁰ → N⁺²",
    formula: "N₂(g) + O₂(g) → 2NO(g)",
    chemDetails: "Ở nhiệt độ >1200°C – 1500°C, năng lượng nhiệt đủ lớn để phá vỡ liên kết ba bền vững N≡N (945 kJ/mol) của khí nitrogen trong không khí, kết hợp với oxygen tạo nitric oxide (NO) không màu.",
    color: "#54D7E8",
    icon: Flame
  },
  {
    id: 2,
    svgId: 'oxidation',
    num: "Trạm 02",
    title: "Oxi hóa trong không khí",
    location: "Tầng đối lưu • Gió phát tán xa",
    oxState: "N⁺² → N⁺⁴",
    formula: "2NO(g) + O₂(g) → 2NO₂(g)",
    chemDetails: "Khi thoát khỏi ống xả ra ngoài không khí giàu oxygen, gốc tự do •NO bị oxi hóa tự diễn biến (tỏa nhiệt) tạo thành khí nitrogen dioxide (NO₂) màu nâu đỏ có tính oxi hóa mạnh.",
    color: "#FF875F",
    icon: Wind
  },
  {
    id: 3,
    svgId: 'cloud-chemistry',
    num: "Trạm 03",
    title: "Chuyển hóa trong giọt mây",
    location: "Pha nước trong mây & sương mù",
    oxState: "N⁺⁴ → N⁺⁵",
    formula: "4NO₂ + O₂ + 2H₂O → 4HNO₃ (tổng quát)",
    chemDetails: "NO₂ khuếch tán vào giọt nước mây tạo HNO₂ và HNO₃; sau đó HNO₂ tiếp tục bị O₂ oxi hóa thành HNO₃ (ngoài ra ban ngày NO₂ còn phản ứng với gốc tự do •OH tạo HNO₃).",
    color: "#D8F36A",
    icon: CloudRain
  },
  {
    id: 4,
    svgId: 'deposition',
    num: "Trạm 04",
    title: "Lắng đọng xuống bề mặt",
    location: "Ao hồ, đất rừng & di tích đá vôi",
    oxState: "Điện ly hoàn toàn H⁺",
    formula: "HNO₃(aq) → H⁺(aq) + NO₃⁻(aq)",
    chemDetails: "HNO₃ là axit mạnh, phân ly hoàn toàn tạo ion H⁺ làm giảm pH giọt mưa (< 5,6). Lắng đọng ướt và khô đưa axit xuống hồ, đất, rừng và công trình kiến trúc.",
    color: "#F06B70",
    icon: Mountain
  }
];

export default function Slide07MechanismMap() {
  const [activeStation, setActiveStation] = useState(1);
  const current = STATIONS.find((s) => s.id === activeStation) || STATIONS[0];
  const IconFocus = current.icon;

  const handleSelectStation = (id) => {
    setActiveStation(id);
    if (id === 1) {
      sfx.spark();
    } else if (id === 2) {
      sfx.whoosh();
    } else if (id === 3) {
      sfx.chemicalFizz(0.65);
    } else if (id === 4) {
      sfx.sonarPing();
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col justify-between py-1 gap-3 relative">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#54D7E8]/15 border border-[#54D7E8]/35 text-[#54D7E8] text-xs font-bold tracking-wider uppercase">
              Bản đồ toàn bộ cơ chế • Chuỗi tăng số oxi hóa N⁰ &rarr; N⁺² &rarr; N⁺⁴ &rarr; N⁺⁵
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            THEO DẤU MỘT PHÂN TỬ NITROGEN
          </h2>
        </div>

        <button
          onClick={() => handleSelectStation((activeStation % 4) + 1)}
          className="px-3.5 py-1.5 rounded-xl bg-[#54D7E8]/15 hover:bg-[#54D7E8]/25 border border-[#54D7E8]/45 text-[#54D7E8] text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <Play size={13} />
          <span>Chuyển tiếp trạm ({activeStation}/4)</span>
        </button>
      </div>

      {/* Interactive SVG A + 4-Station Map with <animateMotion> Nitrogen Tracer Particle */}
      <div className="glass-panel rounded-3xl p-3 sm:p-4 border border-[#29485A] overflow-x-auto shadow-2xl relative">
        <svg
          viewBox="0 0 1200 305"
          className="w-full h-auto select-none"
          role="img"
          aria-labelledby="s7MapTitle s7MapDesc"
        >
          <title id="s7MapTitle">Sơ đồ 4 trạm chuyển hóa từ N2 thành NO, NO2, HNO3 và lắng đọng axit</title>
          <desc id="s7MapDesc">
            Trạm 1 vùng cháy tạo NO; Trạm 2 không khí oxi hóa thành NO2; Trạm 3 giọt mây tạo HNO3; Trạm 4 lắng đọng axit xuống bề mặt Trái Đất.
          </desc>
          <defs>
            <linearGradient id="s7PanelGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#081A28" />
              <stop offset="50%" stopColor="#05121C" />
              <stop offset="100%" stopColor="#02080E" />
            </linearGradient>

            {/* Glowing 3D Atom Gradients */}
            <radialGradient id="s7SphereN" cx="32%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#C4FAFF" />
              <stop offset="35%" stopColor="#54D7E8" />
              <stop offset="75%" stopColor="#1B4965" />
              <stop offset="100%" stopColor="#07192A" />
            </radialGradient>
            <radialGradient id="s7SphereO" cx="32%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#FFD3C4" />
              <stop offset="35%" stopColor="#FF875F" />
              <stop offset="75%" stopColor="#C0392B" />
              <stop offset="100%" stopColor="#54160E" />
            </radialGradient>
            <radialGradient id="s7SphereH" cx="32%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#E2E8F0" />
              <stop offset="85%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </radialGradient>

            {/* Droplet gradient for station 3 */}
            <radialGradient id="s7DropletPod" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#E0F9FF" stopOpacity="0.75" />
              <stop offset="40%" stopColor="#D8F36A" stopOpacity="0.5" />
              <stop offset="80%" stopColor="#1B4965" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#061A28" stopOpacity="0.95" />
            </radialGradient>

            {/* Pod background gradients */}
            <linearGradient id="s7PodActiveCyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14364D" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#081A26" stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="s7PodActiveCoral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E1C1B" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#140C0B" stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="s7PodActiveLime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#222E15" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0E170A" stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="s7PodActiveRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E161C" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#14070B" stopOpacity="0.98" />
            </linearGradient>

            <marker id="s7ArrowCyan" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
              <path d="M0,0 L0,7 L9,3.5 z" fill="#54D7E8" />
            </marker>
            <marker id="s7ArrowCoral" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
              <path d="M0,0 L0,7 L9,3.5 z" fill="#FF875F" />
            </marker>
            <marker id="s7ArrowLime" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
              <path d="M0,0 L0,7 L9,3.5 z" fill="#D8F36A" />
            </marker>
          </defs>

          {/* Background Canvas Frame with Grid Accents */}
          <rect x="4" y="4" width="1192" height="297" rx="22" fill="url(#s7PanelGrad)" stroke="#1E3A4D" strokeWidth="1.5" />
          
          {/* Subtle Grid Lines in Background */}
          <g stroke="#54D7E8" strokeOpacity="0.05" strokeWidth="1">
            <line x1="22" y1="80" x2="1178" y2="80" />
            <line x1="22" y1="160" x2="1178" y2="160" />
            <line x1="22" y1="240" x2="1178" y2="240" />
            <line x1="295" y1="10" x2="295" y2="290" />
            <line x1="595" y1="10" x2="595" y2="290" />
            <line x1="895" y1="10" x2="895" y2="290" />
          </g>

          {/* Continuous Trajectory Path for Nitrogen Tracer Particle (Glowing Conduit Tube) */}
          <path
            id="s7NitrogenPathGlow"
            d="M 146 142 C 240 68, 350 68, 448 142 C 545 215, 650 68, 748 142 C 845 215, 955 88, 1052 142"
            fill="none"
            stroke="#54D7E8"
            strokeOpacity="0.09"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            id="s7NitrogenPath"
            d="M 146 142 C 240 68, 350 68, 448 142 C 545 215, 650 68, 748 142 C 845 215, 955 88, 1052 142"
            fill="none"
            stroke="#54D7E8"
            strokeOpacity="0.28"
            strokeWidth="3.5"
            strokeDasharray="6 6"
            className="animate-dash-flow"
          />

          {/* Connecting Flow Conduits between Pods */}
          <g fill="none" strokeWidth="3.5">
            {/* 1 -> 2 */}
            <path d="M 272 152 H 322" stroke="#54D7E8" strokeDasharray="6 4" markerEnd="url(#s7ArrowCyan)" className="animate-dash-flow" />
            <rect x="274" y="116" width="46" height="22" rx="6" fill="#071521" stroke="#54D7E8" strokeOpacity="0.4" />
            <text x="297" y="131" fill="#54D7E8" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="monospace">+ O₂</text>

            {/* 2 -> 3 */}
            <path d="M 572 152 H 622" stroke="#FF875F" strokeDasharray="6 4" markerEnd="url(#s7ArrowCoral)" className="animate-dash-flow" />
            <rect x="568" y="104" width="58" height="34" rx="7" fill="#071521" stroke="#FF875F" strokeOpacity="0.4" />
            <text x="597" y="118" fill="#D8F36A" fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">+ H₂O</text>
            <text x="597" y="132" fill="#FF875F" fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">+ O₂</text>

            {/* 3 -> 4 */}
            <path d="M 872 152 H 922" stroke="#D8F36A" strokeWidth="3.5" strokeDasharray="6 4" markerEnd="url(#s7ArrowLime)" className="animate-dash-flow" />
            <rect x="872" y="116" width="50" height="22" rx="6" fill="#071521" stroke="#D8F36A" strokeOpacity="0.4" />
            <text x="897" y="131" fill="#D8F36A" fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">Điện ly</text>
          </g>

          {/* ================= STATION 1: COMBUSTION ================= */}
          <g id="combustion" className="cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => handleSelectStation(1)}>
            <rect
              x="22"
              y="22"
              width="250"
              height="260"
              rx="20"
              fill={activeStation === 1 ? 'url(#s7PodActiveCyan)' : '#091B28'}
              stroke="#54D7E8"
              strokeWidth={activeStation === 1 ? '3' : '1.5'}
              strokeOpacity={activeStation === 1 ? '1' : '0.6'}
              style={{ filter: activeStation === 1 ? 'drop-shadow(0 0 16px rgba(84,215,232,0.35))' : 'none' }}
            />
            {/* Header Badge */}
            <rect x="36" y="34" width="135" height="22" rx="6" fill="#050E17" stroke="#54D7E8" strokeOpacity="0.5" />
            <text x="44" y="49" fill="#54D7E8" fontSize="11" fontWeight="900" fontFamily="monospace">TRẠM 01 • N⁰ → N⁺²</text>
            <text x="36" y="76" fill="#FFFFFF" fontSize="16.5" fontWeight="900">Vùng cháy t° cao</text>

            {/* 3D Molecular Graphic of NO */}
            <g transform="translate(86, 92)">
              {/* Cylindrical Bonds */}
              <line x1="24" y1="20" x2="80" y2="20" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="24" y1="27" x2="80" y2="27" stroke="#54D7E8" strokeWidth="4" strokeLinecap="round" />
              <line x1="24" y1="34" x2="80" y2="34" stroke="#FF875F" strokeWidth="2.5" strokeDasharray="4 3" />
              {/* N atom */}
              <circle cx="24" cy="27" r="23" fill="url(#s7SphereN)" stroke="#54D7E8" strokeWidth="1.5" />
              <ellipse cx="17" cy="19" rx="8" ry="5" transform="rotate(-30 17 19)" fill="#FFFFFF" opacity="0.6" />
              <text x="24" y="33" fill="#FFFFFF" fontSize="13.5" fontWeight="900" textAnchor="middle">N</text>
              {/* Unpaired radical dot */}
              <circle cx="24" cy="-2" r="3.5" fill="#D8F36A" stroke="#050E17" strokeWidth="1" />
              {/* O atom */}
              <circle cx="80" cy="27" r="21" fill="url(#s7SphereO)" stroke="#FF875F" strokeWidth="1.5" />
              <ellipse cx="73" cy="20" rx="7" ry="4.5" transform="rotate(-30 73 20)" fill="#FFFFFF" opacity="0.6" />
              <text x="80" y="33" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle">O</text>
            </g>

            <text x="146" y="176" fill="#54D7E8" fontSize="23" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              •NO
            </text>
            <rect x="34" y="196" width="226" height="68" rx="14" fill="#050E17" stroke="#29485A" />
            <text x="147" y="222" fill="#54D7E8" fontSize="13.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              N₂ + O₂ → 2NO
            </text>
            <text x="147" y="244" fill="#DCE6F0" fontSize="11" textAnchor="middle">
              Nhiệt độ vùng cháy &gt;1200°C
            </text>
          </g>

          {/* ================= STATION 2: OXIDATION ================= */}
          <g id="oxidation" className="cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => handleSelectStation(2)}>
            <rect
              x="322"
              y="22"
              width="250"
              height="260"
              rx="20"
              fill={activeStation === 2 ? 'url(#s7PodActiveCoral)' : '#091B28'}
              stroke="#FF875F"
              strokeWidth={activeStation === 2 ? '3' : '1.5'}
              strokeOpacity={activeStation === 2 ? '1' : '0.6'}
              style={{ filter: activeStation === 2 ? 'drop-shadow(0 0 16px rgba(255,135,95,0.35))' : 'none' }}
            />
            {/* Header Badge */}
            <rect x="336" y="34" width="138" height="22" rx="6" fill="#050E17" stroke="#FF875F" strokeOpacity="0.5" />
            <text x="344" y="49" fill="#FF875F" fontSize="11" fontWeight="900" fontFamily="monospace">TRẠM 02 • N⁺² → N⁺⁴</text>
            <text x="336" y="76" fill="#FFFFFF" fontSize="16.5" fontWeight="900">Không khí ngoài trời</text>

            {/* 3D Molecular Graphic of NO2 (Bent 134 deg) */}
            <g transform="translate(390, 86)">
              {/* Resonant bonds */}
              <line x1="58" y1="14" x2="22" y2="44" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="58" y1="14" x2="22" y2="44" stroke="#FF875F" strokeWidth="2" strokeDasharray="4 3" />
              <line x1="58" y1="14" x2="94" y2="44" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="58" y1="14" x2="94" y2="44" stroke="#FF875F" strokeWidth="2" strokeDasharray="4 3" />
              {/* Angle arc */}
              <path d="M 42 27 Q 58 37 74 27" fill="none" stroke="#D8F36A" strokeWidth="1.5" strokeDasharray="3 2" />
              {/* O atoms */}
              <circle cx="22" cy="44" r="19" fill="url(#s7SphereO)" stroke="#FF875F" strokeWidth="1.5" />
              <ellipse cx="16" cy="38" rx="6" ry="4" transform="rotate(-30 16 38)" fill="#FFFFFF" opacity="0.6" />
              <text x="22" y="49" fill="#FFFFFF" fontSize="12" fontWeight="900" textAnchor="middle">O</text>
              <circle cx="94" cy="44" r="19" fill="url(#s7SphereO)" stroke="#FF875F" strokeWidth="1.5" />
              <ellipse cx="88" cy="38" rx="6" ry="4" transform="rotate(-30 88 38)" fill="#FFFFFF" opacity="0.6" />
              <text x="94" y="49" fill="#FFFFFF" fontSize="12" fontWeight="900" textAnchor="middle">O</text>
              {/* Center N atom */}
              <circle cx="58" cy="14" r="22" fill="url(#s7SphereN)" stroke="#54D7E8" strokeWidth="1.5" />
              <ellipse cx="51" cy="7" rx="7" ry="4.5" transform="rotate(-30 51 7)" fill="#FFFFFF" opacity="0.6" />
              <text x="58" y="20" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle">N</text>
              {/* Radical electron dot */}
              <circle cx="58" cy="-11" r="3" fill="#D8F36A" />
            </g>

            <text x="447" y="176" fill="#FF875F" fontSize="23" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              NO₂ (134°)
            </text>
            <rect x="334" y="196" width="226" height="68" rx="14" fill="#050E17" stroke="#29485A" />
            <text x="447" y="222" fill="#FF875F" fontSize="13.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              2NO + O₂ → 2NO₂
            </text>
            <text x="447" y="244" fill="#DCE6F0" fontSize="11" textAnchor="middle">
              Khí nâu đỏ • Tự oxi hóa
            </text>
          </g>

          {/* ================= STATION 3: CLOUD CHEMISTRY ================= */}
          <g id="cloud-chemistry" className="cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => handleSelectStation(3)}>
            <rect
              x="622"
              y="22"
              width="250"
              height="260"
              rx="20"
              fill={activeStation === 3 ? 'url(#s7PodActiveLime)' : '#091B28'}
              stroke="#D8F36A"
              strokeWidth={activeStation === 3 ? '3' : '1.5'}
              strokeOpacity={activeStation === 3 ? '1' : '0.6'}
              style={{ filter: activeStation === 3 ? 'drop-shadow(0 0 16px rgba(216,243,106,0.35))' : 'none' }}
            />
            {/* Header Badge */}
            <rect x="636" y="34" width="138" height="22" rx="6" fill="#050E17" stroke="#D8F36A" strokeOpacity="0.5" />
            <text x="644" y="49" fill="#D8F36A" fontSize="11" fontWeight="900" fontFamily="monospace">TRẠM 03 • N⁺⁴ → N⁺⁵</text>
            <text x="636" y="76" fill="#FFFFFF" fontSize="16.5" fontWeight="900">Trong giọt mây</text>

            {/* Glowing 3D Water Droplet with Planar HNO3 inside */}
            <g transform="translate(747, 122)">
              {/* Droplet Outline */}
              <path
                d="M 0 -42 C -32 4 -42 22 -42 42 A 42 42 0 0 0 42 42 C 42 22 32 4 0 -42 Z"
                fill="url(#s7DropletPod)"
                stroke="#D8F36A"
                strokeWidth="2.5"
              />
              {/* Specular highlight rim on droplet */}
              <path
                d="M -8 -28 C -24 6 -28 18 -28 32"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.65"
              />
              <text x="0" y="24" fill="#FFFFFF" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                HNO₃
              </text>
              <text x="0" y="44" fill="#D8F36A" fontSize="11" fontWeight="800" textAnchor="middle">
                Pha nước giọt mây
              </text>
            </g>

            <rect x="634" y="196" width="226" height="68" rx="14" fill="#050E17" stroke="#D8F36A" strokeOpacity="0.5" />
            <text x="747" y="222" fill="#D8F36A" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              4NO₂ + O₂ + 2H₂O → 4HNO₃
            </text>
            <text x="747" y="244" fill="#DCE6F0" fontSize="11" textAnchor="middle">
              Phương trình tổng quát (ròng)
            </text>
          </g>

          {/* ================= STATION 4: DEPOSITION ================= */}
          <g id="deposition" className="cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => handleSelectStation(4)}>
            <rect
              x="924"
              y="22"
              width="254"
              height="260"
              rx="20"
              fill={activeStation === 4 ? 'url(#s7PodActiveRed)' : '#091B28'}
              stroke="#F06B70"
              strokeWidth={activeStation === 4 ? '3' : '1.5'}
              strokeOpacity={activeStation === 4 ? '1' : '0.6'}
              style={{ filter: activeStation === 4 ? 'drop-shadow(0 0 16px rgba(240,107,112,0.35))' : 'none' }}
            />
            {/* Header Badge */}
            <rect x="938" y="34" width="138" height="22" rx="6" fill="#050E17" stroke="#F06B70" strokeOpacity="0.5" />
            <text x="946" y="49" fill="#F06B70" fontSize="11" fontWeight="900" fontFamily="monospace">TRẠM 04 • LẮNG ĐỌNG</text>
            <text x="938" y="76" fill="#FFFFFF" fontSize="16.5" fontWeight="900">Bề mặt Trái Đất</text>

            {/* Dissociated Ions H+ & NO3- with Rain Streaks */}
            <g transform="translate(1051, 126)">
              {/* Rain lines */}
              <line x1="-35" y1="-38" x2="-45" y2="-12" stroke="#D8F36A" strokeWidth="2" strokeDasharray="4 4" opacity="0.75" />
              <line x1="35" y1="-38" x2="25" y2="-12" stroke="#54D7E8" strokeWidth="2" strokeDasharray="4 4" opacity="0.75" />
              
              {/* H+ Ion Sphere */}
              <circle cx="-32" cy="0" r="20" fill="#D8F36A" stroke="#FFFFFF" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 8px rgba(216,243,106,0.6))' }} />
              <text x="-32" y="6" fill="#050E17" fontSize="15" fontWeight="900" textAnchor="middle" fontFamily="monospace">H⁺</text>

              {/* NO3- Ion Sphere */}
              <circle cx="32" cy="0" r="23" fill="#082234" stroke="#54D7E8" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 8px rgba(84,215,232,0.6))' }} />
              <text x="32" y="6" fill="#54D7E8" fontSize="13.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">NO₃⁻</text>
            </g>

            <text x="1051" y="176" fill="#F06B70" fontSize="16" fontWeight="900" textAnchor="middle">
              pH giáng thủy &lt; 5,6
            </text>
            <rect x="938" y="196" width="226" height="68" rx="14" fill="#050E17" stroke="#29485A" />
            <text x="1051" y="222" fill="#F4F7FA" fontSize="13.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              HNO₃ → H⁺ + NO₃⁻
            </text>
            <text x="1051" y="244" fill="#DCE6F0" fontSize="11" textAnchor="middle">
              Ao hồ • Đất rừng • Đá vôi
            </text>
          </g>

          {/* ================= Animated Multi-Tier Nitrogen Tracer Particle ================= */}
          <g pointerEvents="none">
            {/* Outer Corona Pulse */}
            <circle r="18" fill="#54D7E8" fillOpacity="0.18">
              <animateMotion
                dur="7.5s"
                repeatCount="indefinite"
                path="M 146 142 C 240 68, 350 68, 448 142 C 545 215, 650 68, 748 142 C 845 215, 955 88, 1052 142"
              />
            </circle>
            {/* Mid Halo */}
            <circle r="11" fill="#D8F36A" fillOpacity="0.45">
              <animateMotion
                dur="7.5s"
                repeatCount="indefinite"
                path="M 146 142 C 240 68, 350 68, 448 142 C 545 215, 650 68, 748 142 C 845 215, 955 88, 1052 142"
              />
            </circle>
            {/* High-intensity Core */}
            <circle r="6" fill="#FFFFFF" stroke="#54D7E8" strokeWidth="2">
              <animateMotion
                dur="7.5s"
                repeatCount="indefinite"
                path="M 146 142 C 240 68, 350 68, 448 142 C 545 215, 650 68, 748 142 C 845 215, 955 88, 1052 142"
              />
            </circle>
          </g>
        </svg>
      </div>

      {/* Station Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {STATIONS.map((st) => {
          const active = activeStation === st.id;
          return (
            <button
              key={st.id}
              onClick={() => handleSelectStation(st.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                active
                  ? 'bg-[#143245] border-[#54D7E8] shadow-md'
                  : 'bg-[#091B2A]/80 border-[#29485A] hover:bg-[#102838]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold" style={{ color: st.color }}>
                <span>{st.num}</span>
                <span>{st.oxState}</span>
              </div>
              <div className="text-xs font-bold text-white truncate mt-0.5">{st.title}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Station Deep Dive Focus Panel with Smooth Transition */}
      <div
        key={activeStation}
        className="animate-fadeIn p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#102838] via-[#0D2234] to-[#122D3E] border border-[#29485A] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
      >
        <div className="flex items-start gap-3.5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0"
            style={{
              backgroundColor: `${current.color}18`,
              borderColor: `${current.color}50`,
              color: current.color
            }}
          >
            <IconFocus size={24} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#050E17]" style={{ color: current.color }}>
                {current.num} • {current.oxState}
              </span>
              <span className="text-xs text-[#A8BBC8]">• {current.location}</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white mt-1">{current.title}</h3>
            <p className="text-xs sm:text-sm text-[#DCE6F0] mt-1 max-w-3xl leading-relaxed">
              {current.chemDetails}
            </p>
          </div>
        </div>

        <div className="bg-[#050E17] px-4 py-3 rounded-xl border border-[#29485A] shrink-0 w-full md:w-auto text-center md:text-right">
          <span className="text-xs text-[#A8BBC8] uppercase font-bold block mb-0.5">Phương trình tại trạm</span>
          <span className="font-mono text-sm sm:text-base font-extrabold text-[#D8F36A] block">
            {current.formula}
          </span>
        </div>
      </div>

      {/* Scientific Note */}
      <div className="p-2.5 rounded-xl bg-[#071521]/80 border border-[#29485A]/60 text-xs text-[#A8BBC8] flex items-center gap-2">
        <Info size={14} className="text-[#54D7E8] shrink-0" />
        <span>
          <strong className="text-white">Lưu ý:</strong> Đây là sơ đồ tóm tắt; phản ứng khí quyển thực tế có nhiều bước trung gian.
        </span>
      </div>
    </div>
  );
}
