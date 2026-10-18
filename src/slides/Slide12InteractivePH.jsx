import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { phSamples, phActivityInsights } from '../data/phScenarios';
import { sfx } from '../audio/sfx';

function BeakerSVG({ sampleId, color, ph }) {
  // Deterministic H+ ion dots inside beaker liquid to show 10x log scale visually
  const dots =
    sampleId === 'A'
      ? [
          { x: 44, y: 92 },
          { x: 68, y: 98 }
        ]
      : sampleId === 'B'
      ? [
          { x: 36, y: 78 }, { x: 55, y: 84 }, { x: 74, y: 77 },
          { x: 42, y: 96 }, { x: 64, y: 102 }, { x: 76, y: 93 },
          { x: 48, y: 108 }, { x: 68, y: 88 }
        ]
      : [
          { x: 33, y: 72 }, { x: 45, y: 70 }, { x: 58, y: 74 }, { x: 70, y: 69 }, { x: 79, y: 75 },
          { x: 36, y: 83 }, { x: 49, y: 81 }, { x: 63, y: 85 }, { x: 76, y: 82 }, { x: 32, y: 92 },
          { x: 43, y: 94 }, { x: 54, y: 91 }, { x: 67, y: 95 }, { x: 78, y: 93 }, { x: 35, y: 104 },
          { x: 47, y: 106 }, { x: 60, y: 103 }, { x: 73, y: 107 }, { x: 41, y: 112 }, { x: 65, y: 113 }
        ];

  const uid = `bkr-${sampleId}`;

  return (
    <svg viewBox="0 0 110 135" className="w-24 sm:w-28 h-28 sm:h-32 mx-auto select-none" role="img" aria-label={`Lọ mẫu ${sampleId} có pH ${ph}`}>
      <defs>
        {/* Liquid vertical gradient */}
        <linearGradient id={`${uid}-liq`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="60%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0.15" />
        </linearGradient>
        {/* Glass reflection highlight */}
        <linearGradient id={`${uid}-glass`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="15%" stopColor="#FFFFFF" stopOpacity="0.08" />
          <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
        </linearGradient>
        {/* Meniscus surface highlight */}
        <linearGradient id={`${uid}-surf`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Glass Beaker Body (Pyrex profile with pouring lip at top-left) */}
      <path
        d="M 18 24 L 23 26 V 108 A 14 14 0 0 0 37 122 H 73 A 14 14 0 0 0 87 108 V 26 H 90"
        fill="rgba(255,255,255,0.03)"
        stroke="#DCE6F0"
        strokeOpacity="0.75"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Liquid inside with curved meniscus */}
      <path
        d="M 24 64 Q 55 60 86 64 V 107 A 13 13 0 0 1 73 120 H 37 A 13 13 0 0 1 24 107 Z"
        fill={`url(#${uid}-liq)`}
      />
      {/* Curved Meniscus surface line with gloss */}
      <ellipse cx="55" cy="63" rx="31" ry="3.5" fill="none" stroke={`url(#${uid}-surf)`} strokeWidth="1.8" />

      {/* Glass Wall Specular Vertical Shine */}
      <path
        d="M 26 28 V 106 A 11 11 0 0 0 34 117"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />

      {/* Laboratory Graduation Markings with Numeric Scale */}
      <g stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1">
        <line x1="24" y1="42" x2="33" y2="42" strokeWidth="1.5" />
        <line x1="24" y1="56" x2="30" y2="56" />
        <line x1="24" y1="70" x2="33" y2="70" strokeWidth="1.5" />
        <line x1="24" y1="84" x2="30" y2="84" />
        <line x1="24" y1="98" x2="33" y2="98" strokeWidth="1.5" />
        <line x1="24" y1="112" x2="30" y2="112" />
      </g>
      <g fill="#A8BBC8" fontSize="5.5" fontWeight="700" fontFamily="monospace">
        <text x="35" y="44">200</text>
        <text x="35" y="72">150</text>
        <text x="35" y="100">100</text>
        <text x="35" y="114">ml</text>
      </g>

      {/* Digital pH Probe Sensor */}
      <g>
        {/* OLED display box */}
        <rect x="42" y="3" width="26" height="15" rx="3.5" fill="#071521" stroke={color} strokeWidth="1.5" />
        {/* Screen inset */}
        <rect x="44.5" y="5.5" width="21" height="10" rx="2" fill="#030A10" />
        <text x="55" y="13.5" textAnchor="middle" fill={color} fontSize="8.5" fontWeight="900" fontFamily="monospace">
          {String(ph).replace('.', ',')}
        </text>
        {/* Stainless Steel Probe Rod */}
        <rect x="53.5" y="18" width="3" height="66" fill="#94A3B8" stroke="#050E17" strokeWidth="0.5" />
        <rect x="54" y="18" width="1" height="66" fill="#FFFFFF" opacity="0.6" />
        {/* Glass Sensing Bulb immersed in liquid */}
        <circle cx="55" cy="85" r="4.2" fill={color} stroke="#FFFFFF" strokeWidth="1" />
        <circle cx="55" cy="85" r="7" fill={color} opacity="0.25">
          <animate attributeName="r" values="4;8;4" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* H+ Ion density visualization with miniature charge halos */}
      {dots.map((d, i) => (
        <g key={i}>
          <circle cx={d.x} cy={d.y} r="3.2" fill={color} fillOpacity="0.25" />
          <circle cx={d.x} cy={d.y} r="1.8" fill={color} stroke="#050E17" strokeWidth="0.5" />
          <text x={d.x} y={d.y + 1.2} textAnchor="middle" fill="#FFFFFF" fontSize="3.5" fontWeight="900" fontFamily="sans-serif">+</text>
        </g>
      ))}
    </svg>
  );
}

export default function Slide12InteractivePH() {
  const [selectedSample, setSelectedSample] = useState('C');
  const [revealed, setRevealed] = useState(false);
  const [bedrockType, setBedrockType] = useState('limestone'); // 'granite' | 'limestone'

  return (
    <div className="w-full min-h-full flex flex-col justify-between py-1 gap-3 relative">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D8F36A]/15 border border-[#D8F36A]/35 text-[#D8F36A] text-xs font-bold tracking-wider uppercase flex items-center gap-1">
              <Sparkles size={12} /> Hoạt động tương tác 30 giây • Tư duy phản biện
            </span>
            <span className="text-xs font-mono text-[#FF875F] bg-[#071521] px-2.5 py-0.5 rounded-full border border-[#FF875F]/40">
              Dữ liệu giả định học tập (Không phải số đo địa phương)
            </span>
          </div>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          THỬ THÁCH 30 GIÂY: ĐỌC pH &amp; SUY LUẬN TÁC ĐỘNG
        </h2>
      </div>

      {/* Main Interactive Stage */}
      <div className="my-auto space-y-3">
        {/* Question Banner */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#143245] to-[#102838] border border-[#54D7E8]/45 shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#54D7E8]/20 text-[#54D7E8] shrink-0 mt-0.5 sm:mt-0">
              <HelpCircle size={22} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Câu hỏi thảo luận: Mẫu nào có tính axit mạnh hơn? Điều đó có tự động chứng minh mẫu đó gây hại nhất trong mọi hồ không?
              </h3>
              <p className="text-xs text-[#DCE6F0] mt-0.5">
                Nhấp chọn một mẫu bên dưới và bấm <strong>“Hiện đáp án khoa học”</strong> để kiểm tra lập luận!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setRevealed((prev) => {
                if (!prev) sfx.chime();
                return !prev;
              });
            }}
            className="px-4 py-2.5 rounded-xl bg-[#D8F36A] hover:bg-[#e3f983] text-[#050E17] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 transition-all shadow-lg active:scale-95"
          >
            <RefreshCw size={15} className={revealed ? "rotate-180 transition-transform duration-300" : ""} />
            <span>{revealed ? "Ẩn đáp án thảo luận" : "Hiện đáp án khoa học"}</span>
          </button>
        </div>

        {/* 3 Laboratory Beaker Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {phSamples.map((sample) => {
            const isChosen = selectedSample === sample.id;

            return (
              <div
                key={sample.id}
                onClick={() => {
                  setSelectedSample(sample.id);
                  sfx.pop(0.8 + (sample.ph / 14) * 0.8, (sample.ph / 7) - 1);
                }}
                className={`p-4 rounded-3xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isChosen
                    ? 'bg-[#143245] border-[#54D7E8] ring-2 ring-[#54D7E8]/50 shadow-xl -translate-y-0.5'
                    : 'glass-panel hover:bg-[#102838] border-[#29485A]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-[#050E17] text-white border border-[#29485A]">
                      MẪU {sample.id} (Giả định)
                    </span>
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${sample.color}20`,
                        color: sample.color,
                        border: `1px solid ${sample.color}50`
                      }}
                    >
                      {sample.badge}
                    </span>
                  </div>

                  {/* Detailed SVG Beaker with H+ density */}
                  <BeakerSVG sampleId={sample.id} color={sample.color} ph={sample.ph} />

                  <div className="text-center mt-1">
                    <div className="text-2xl sm:text-3xl font-black font-mono" style={{ color: sample.color }}>
                      pH = {String(sample.ph).replace('.', ',')}
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5">{sample.status}</div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#29485A]/50 text-xs text-[#DCE6F0] leading-snug">
                  {sample.observation}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Answer Reveal + Geological Buffering Simulator */}
        {revealed && (
          <div className="p-4 rounded-3xl bg-[#081A28] border-2 border-[#D8F36A]/60 shadow-2xl animate-fade-in space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center">
              {/* Left 7 cols: 2 Core Answers */}
              <div className="lg:col-span-7 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-extrabold text-sm text-[#D8F36A] uppercase tracking-wider">
                  <CheckCircle2 size={18} /> Đáp án &amp; Lập luận Khoa học Chuẩn xác
                </div>

                <div className="bg-[#102838] p-3 rounded-2xl border border-[#29485A]">
                  <strong className="text-[#54D7E8] block mb-0.5">1. Mẫu C (pH = 4,4) có tính axit mạnh nhất về mặt hóa học:</strong>
                  <p className="text-[#F4F7FA] leading-relaxed text-xs">
                    Do thang pH là logarit nghịch đảo (<code className="text-[#D8F36A]">[H⁺] = 10⁻ᵖᴴ</code>), Mẫu C (pH 4,4) có nồng độ ion H⁺ cao gấp <strong>~6,3 lần</strong> Mẫu B (pH 5,2) và gấp <strong>~63 lần</strong> Mẫu A (pH 6,2).
                  </p>
                </div>

                <div className="bg-[#102838] p-3 rounded-2xl border border-[#29485A]">
                  <strong className="text-[#FF875F] block mb-0.5">2. Nhưng KHÔNG tự động gây hại như nhau ở mọi hồ:</strong>
                  <p className="text-[#F4F7FA] leading-relaxed text-xs">
                    Mức độ tổn hại thực tế phụ thuộc vào <strong>khả năng đệm (buffering capacity)</strong> của đất đá đáy hồ, thành phần ion và ngưỡng chịu đựng của hệ sinh vật tại hồ đó.
                  </p>
                </div>
              </div>

              {/* Right 5 cols: Mini Interactive Bedrock Buffering Simulator */}
              <div className="lg:col-span-5 bg-[#050E17] p-3.5 rounded-2xl border border-[#29485A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#54D7E8] flex items-center gap-1.5">
                    <Layers size={14} /> Mô phỏng khả năng đệm khi nhận Mẫu C (pH 4,4):
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      sfx.tick();
                      setBedrockType('limestone');
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                      bedrockType === 'limestone'
                        ? 'bg-[#8FCB89]/20 border-[#8FCB89] text-[#8FCB89]'
                        : 'bg-[#102838] border-[#29485A] text-[#A8BBC8]'
                    }`}
                  >
                    Hồ nền Đá vôi (CaCO₃)
                  </button>
                  <button
                    onClick={() => {
                      sfx.tick();
                      setBedrockType('granite');
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                      bedrockType === 'granite'
                        ? 'bg-[#F06B70]/20 border-[#F06B70] text-[#F06B70]'
                        : 'bg-[#102838] border-[#29485A] text-[#A8BBC8]'
                    }`}
                  >
                    Hồ nền Đá Granite (SiO₂)
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-[#102838]/90 border border-[#29485A] text-xs">
                  {bedrockType === 'limestone' ? (
                    <p className="text-[#DCE6F0] leading-snug">
                      <strong className="text-[#8FCB89]">Đệm kiềm tốt:</strong> Đá vôi đáy hồ phản ứng trung hòa ion H⁺ (<code className="text-[#D8F36A]">CaCO₃ + H⁺ &rarr; Ca²⁺ + HCO₃⁻</code>), giúp pH nước hồ ít bị sụt giảm đột ngột.
                    </p>
                  ) : (
                    <p className="text-[#DCE6F0] leading-snug">
                      <strong className="text-[#F06B70]">Đệm kiềm rất yếu:</strong> Đá granite/thạch anh không trung hòa được H⁺; pH hồ tụt nhanh và giải phóng ion <code className="text-[#FF875F]">Al³⁺</code> gây độc thủy sinh.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="text-xs text-[#A8BBC8] italic border-t border-[#29485A]/50 pt-1.5 flex items-center gap-1.5">
              <AlertTriangle size={13} className="text-[#D8F36A] shrink-0" />
              <span>{phActivityInsights.disclaimer}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
