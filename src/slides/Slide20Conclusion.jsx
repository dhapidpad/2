import React from 'react';
import { CheckCircle2, Shield, ExternalLink, Heart, Sparkles, Wind, Droplets, BookOpen } from 'lucide-react';
import { teamInfo } from '../data/teamMembers';

const CONCLUSIONS = [
  {
    num: "01",
    title: "Chuỗi phản ứng hóa học liên tục",
    formula: "N₂ + O₂ → NO → NO₂ → HNO₃",
    desc: "Khí NO sinh ra ở vùng cháy nhiệt độ cao bị oxi hóa thành NO₂, rồi phản ứng với nước và oxygen trong mây tạo axit nitric (HNO₃) — nối liền khí thải với lắng đọng axit.",
    icon: Wind,
    color: "#54D7E8"
  },
  {
    num: "02",
    title: "Tác động đa diện tùy điều kiện đệm",
    formula: "HNO₃ → H⁺ + NO₃⁻ (pH < 5,6)",
    desc: "Ao hồ, đất, rừng và đá carbonate (CaCO₃) đều có thể bị ảnh hưởng qua rửa trôi ion Ca²⁺/Mg²⁺, giải phóng Al³⁺ hoặc hòa tan bề mặt; mức độ phụ thuộc khả năng đệm tự nhiên từng vùng.",
    icon: Droplets,
    color: "#D8F36A"
  },
  {
    num: "03",
    title: "Giải pháp bền vững bắt đầu từ nguồn",
    formula: "4NO + 4NH₃ + O₂ → 4N₂ + 6H₂O",
    desc: "Cắt giảm phát thải NOₓ và SO₂ từ giao thông, công nghiệp (như xúc tác SCR, năng lượng sạch) kết hợp quan trắc môi trường là hướng giải quyết tận gốc rễ.",
    icon: Shield,
    color: "#FF875F"
  }
];

const REFERENCES = [
  {
    name: "U.S. EPA — What is Acid Rain?",
    label: "Định nghĩa lắng đọng ướt/khô, mốc pH 5,6 và khoảng 4,2–4,4",
    url: "https://www.epa.gov/acidrain/what-acid-rain"
  },
  {
    name: "U.S. EPA — Effects of Acid Rain",
    label: "Tác động lên hồ, rừng, vật liệu và sức khỏe cộng đồng",
    url: "https://www.epa.gov/acidrain/effects-acid-rain"
  },
  {
    name: "USGS — Acid Rain & Limestone",
    label: "Cơ chế hòa tan đá vôi/marble CaCO₃",
    url: "https://pubs.usgs.gov/gip/acidrain/5.html"
  },
  {
    name: "Chemistry LibreTexts",
    label: "Chuỗi phản ứng NO, NO₂, HNO₂ và HNO₃ trong khí quyển",
    url: "https://chem.libretexts.org/Courses/Western_Oregon_University/Introduction_to_Chemistry_and_the_Environment/03%3A_Chapter_3_-_Ions_and_Ionic_Compounds/3.10%3A_Focus_on_the_Environment_-_Acid_Rain"
  }
];

export default function Slide20Conclusion() {
  return (
    <div className="w-full min-h-full flex flex-col justify-between py-1 gap-3 max-w-7xl mx-auto relative">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-bold bg-[#54D7E8]/15 text-[#54D7E8] border border-[#54D7E8]/35 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D8F36A]" />
          <span>Tổng kết &amp; Thông điệp hành động • Khép lại hành trình khoa học</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          MƯA AXIT KHÔNG BẮT ĐẦU Ở GIỌT MƯA —{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(90deg,#54D7E8,#D8F36A,#FF875F)' }}
          >
            MÀ TỪ KHÍ THẢI
          </span>
        </h2>
      </div>

      {/* Middle Grid: Left (7 cols) 3 Conclusions | Right (5 cols) Panoramic Synthesis SVG per acid.md Slide 20 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto items-stretch">
        {/* Left 7 cols: 3 Core Conclusions */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-3">
          {CONCLUSIONS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="glass-panel p-4 rounded-2xl border border-[#29485A] flex items-start gap-3.5"
                style={{ borderLeftWidth: '4px', borderLeftColor: item.color }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0 border"
                  style={{
                    backgroundColor: `${item.color}18`,
                    borderColor: `${item.color}45`,
                    color: item.color
                  }}
                >
                  {item.num}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                      <Icon size={16} style={{ color: item.color }} />
                      <span>{item.title}</span>
                    </h3>
                    <span
                      className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#050E17] border border-[#29485A]"
                      style={{ color: item.color }}
                    >
                      {item.formula}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#DCE6F0] leading-relaxed mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 5 cols: Synthesis SVG ("Bầu khí quyển sạch hơn & Hành trình khép kín") */}
        <div className="lg:col-span-5 glass-panel p-4 rounded-3xl border border-[#29485A] flex flex-col justify-between">
          <div className="text-xs font-bold text-[#54D7E8] uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Vòng tuần hoàn bảo vệ bầu khí quyển</span>
            <span className="font-mono text-[#8FCB89]">pH cân bằng ≈ 5,6</span>
          </div>

          <svg
            viewBox="0 0 420 250"
            className="w-full h-auto rounded-2xl bg-[#05111B] border border-[#29485A] select-none shadow-inner"
            role="img"
            aria-labelledby="s20CloseTitle s20CloseDesc"
          >
            <title id="s20CloseTitle">Sơ đồ tổng kết hành trình kiểm soát khí thải bảo vệ mây, mưa, hồ, cây rừng và di sản</title>
            <desc id="s20CloseDesc">
              Khi nguồn phát thải được xử lý bằng công nghệ SCR và giao thông xanh, bầu khí quyển sạch hơn giúp bảo vệ hệ sinh thái hồ, rừng và công trình lịch sử.
            </desc>

            <defs>
              <radialGradient id="s20CoreGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#2A738E" />
                <stop offset="50%" stopColor="#10384D" />
                <stop offset="100%" stopColor="#051522" />
              </radialGradient>
              <radialGradient id="s20GlowCyan" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#54D7E8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#54D7E8" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="s20OrbTrack" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#54D7E8" />
                <stop offset="35%" stopColor="#8FCB89" />
                <stop offset="70%" stopColor="#D8F36A" />
                <stop offset="100%" stopColor="#FF875F" />
              </linearGradient>
              <filter id="s20SoftGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ambient background glow */}
            <circle cx="210" cy="125" r="95" fill="url(#s20GlowCyan)" />

            {/* Master Orbital Path for particles & connecting energy vector */}
            <path
              id="s20OrbitPath"
              d="M 210 36 C 325 36, 385 75, 385 125 C 385 175, 325 214, 210 214 C 95 214, 35 175, 35 125 C 35 75, 95 36, 210 36 Z"
              fill="none"
              stroke="#29485A"
              strokeWidth="3"
            />
            {/* Animated neon dash vector */}
            <path
              d="M 210 36 C 325 36, 385 75, 385 125 C 385 175, 325 214, 210 214 C 95 214, 35 175, 35 125 C 35 75, 95 36, 210 36 Z"
              fill="none"
              stroke="url(#s20OrbTrack)"
              strokeWidth="2"
              strokeDasharray="6 6"
              className="animate-dash-flow"
              filter="url(#s20SoftGlow)"
            />

            {/* Flowing Energy Comets along the orbit */}
            <g pointerEvents="none">
              <circle r="4" fill="#54D7E8" filter="url(#s20SoftGlow)">
                <animateMotion dur="6s" repeatCount="indefinite">
                  <mpath href="#s20OrbitPath" />
                </animateMotion>
              </circle>
              <circle r="3.5" fill="#D8F36A" filter="url(#s20SoftGlow)">
                <animateMotion dur="6s" begin="2s" repeatCount="indefinite">
                  <mpath href="#s20OrbitPath" />
                </animateMotion>
              </circle>
              <circle r="3.5" fill="#FF875F" filter="url(#s20SoftGlow)">
                <animateMotion dur="6s" begin="4s" repeatCount="indefinite">
                  <mpath href="#s20OrbitPath" />
                </animateMotion>
              </circle>
            </g>

            {/* Center Core Reactor Emblem */}
            <g transform="translate(210, 125)">
              {/* Outer decorative dashed halo */}
              <circle cx="0" cy="0" r="44" fill="none" stroke="#54D7E8" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" />
              {/* Middle gear ring */}
              <circle cx="0" cy="0" r="38" fill="none" stroke="#D8F36A" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="6 4" />
              {/* Core sphere */}
              <circle cx="0" cy="0" r="32" fill="url(#s20CoreGrad)" stroke="#54D7E8" strokeWidth="1.8" />
              <circle cx="-10" cy="-10" r="14" fill="#FFFFFF" opacity="0.1" />
              {/* Center Emblem Text */}
              <text x="0" y="-3" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="900" letterSpacing="0.05em">
                HIỂU HÓA HỌC
              </text>
              <line x1="-20" y1="2" x2="20" y2="2" stroke="#54D7E8" strokeWidth="1" opacity="0.6" />
              <text x="0" y="13" textAnchor="middle" fill="#D8F36A" fontSize="8.5" fontWeight="900" letterSpacing="0.05em">
                HÀNH ĐỘNG XANH
              </text>
            </g>

            {/* 1. Left Node: Xử lý từ nguồn */}
            <g transform="translate(14, 98)">
              <rect x="0" y="0" width="124" height="54" rx="14" fill="#0C202E" stroke="#FF875F" strokeWidth="1.5" />
              <rect x="0" y="0" width="124" height="2" rx="1" fill="#FF875F" />
              <text x="62" y="19" textAnchor="middle" fill="#FF875F" fontSize="11" fontWeight="900">
                1. XỬ LÝ TỪ NGUỒN
              </text>
              <text x="62" y="34" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontFamily="monospace" fontWeight="800">
                NOₓ + NH₃ &rarr; N₂ + H₂O
              </text>
              <text x="62" y="46" textAnchor="middle" fill="#A8BBC8" fontSize="8">
                Xúc tác SCR &amp; Xe điện
              </text>
            </g>

            {/* 2. Top Node: Khí quyển trong lành */}
            <g transform="translate(142, 10)">
              <rect x="0" y="0" width="136" height="52" rx="14" fill="#0C202E" stroke="#54D7E8" strokeWidth="1.5" />
              <rect x="0" y="0" width="136" height="2" rx="1" fill="#54D7E8" />
              <text x="68" y="19" textAnchor="middle" fill="#54D7E8" fontSize="11" fontWeight="900">
                KHÍ QUYỂN SẠCH HƠN
              </text>
              <text x="68" y="34" textAnchor="middle" fill="#D8F36A" fontSize="9.5" fontFamily="monospace" fontWeight="800">
                Mưa tự nhiên pH ≈ 5,6
              </text>
              <text x="68" y="45" textAnchor="middle" fill="#A8BBC8" fontSize="8">
                Cắt nguồn HNO₃ / H₂SO₄
              </text>
            </g>

            {/* 3. Right Node: Hệ sinh thái bền vững */}
            <g transform="translate(282, 98)">
              <rect x="0" y="0" width="124" height="54" rx="14" fill="#0C202E" stroke="#8FCB89" strokeWidth="1.5" />
              <rect x="0" y="0" width="124" height="2" rx="1" fill="#8FCB89" />
              <text x="62" y="19" textAnchor="middle" fill="#8FCB89" fontSize="11" fontWeight="900">
                2. HỆ SINH THÁI
              </text>
              <text x="62" y="34" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="800">
                Hồ &amp; Rừng bền vững
              </text>
              <text x="62" y="46" textAnchor="middle" fill="#D8F36A" fontSize="8" fontFamily="monospace">
                Giảm Al³⁺ • Giữ Ca²⁺/Mg²⁺
              </text>
            </g>

            {/* 4. Bottom Node: Di sản & Sức khỏe */}
            <g transform="translate(135, 186)">
              <rect x="0" y="0" width="150" height="52" rx="14" fill="#0C202E" stroke="#D8F36A" strokeWidth="1.5" />
              <rect x="0" y="0" width="150" height="2" rx="1" fill="#D8F36A" />
              <text x="75" y="19" textAnchor="middle" fill="#D8F36A" fontSize="11" fontWeight="900">
                3. DI SẢN &amp; SỨC KHỎE
              </text>
              <text x="75" y="34" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="800">
                Bảo vệ đá CaCO₃ &amp; Giảm PM2.5
              </text>
              <text x="75" y="45" textAnchor="middle" fill="#A8BBC8" fontSize="8">
                Bền vững di tích &amp; đường hô hấp
              </text>
            </g>
          </svg>

          <div className="mt-2 flex items-center justify-between text-xs text-[#A8BBC8]">
            <span className="flex items-center gap-1 text-[#8FCB89] font-semibold">
              <CheckCircle2 size={13} /> Đầy đủ 3 câu hỏi nhiệm vụ
            </span>
            <span className="font-mono">{teamInfo.groupName} • Lớp {teamInfo.className}</span>
          </div>
        </div>
      </div>

      {/* Bottom Closing Section: Thank You & Official Scientific References */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-[#D8F36A]/40 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 text-[#D8F36A] font-black text-base sm:text-xl tracking-wide">
            <Heart className="w-5 h-5 fill-[#D8F36A]/30 text-[#D8F36A]" />
            <span>CẢM ƠN THẦY CÔ VÀ CÁC BẠN ĐÃ LẮNG NGHE!</span>
          </div>
          <p className="text-xs text-[#DCE6F0] mt-1">
            {teamInfo.groupName} • Lớp {teamInfo.className} • Chuyên đề: Mưa axit và sự hình thành mưa axit do oxide của nitrogen
          </p>
        </div>

        {/* Verified Reference Links */}
        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 text-xs">
          <span className="text-[#A8BBC8] font-bold flex items-center gap-1 mr-1">
            <BookOpen className="w-3.5 h-3.5 text-[#54D7E8]" />
            Nguồn tham khảo:
          </span>
          {REFERENCES.map((ref, idx) => (
            <a
              key={idx}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#071521] border border-[#29485A] text-[#DCE6F0] hover:text-[#54D7E8] hover:border-[#54D7E8]/50 transition-colors font-semibold"
              title={ref.label}
            >
              <span>{ref.name}</span>
              <ExternalLink className="w-3 h-3 text-[#54D7E8]" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
