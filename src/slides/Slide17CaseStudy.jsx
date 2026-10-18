import React, { useState } from 'react';
import { Search, MapPin, CheckCircle, HelpCircle, Wind, Layers } from 'lucide-react';
import { sfx } from '../audio/sfx';

const STEPS = [
  {
    id: 1,
    question: "1. Cần đo đạc & thu thập những thông tin nào?",
    shortHint: "Đo pH lặp lại nhiều vị trí, phân tích mưa & khí quyển",
    icon: Search,
    color: "#54D7E8",
    answerSummary: "Đo pH nhiều thời điểm; kiểm tra mưa/giáng thủy; quan trắc khí và ion liên quan; đối chiếu đất đá và nguồn thải.",
    content: [
      "Đo pH nước hồ lặp lại theo thời gian tại nhiều điểm (thượng nguồn, giữa hồ, hạ lưu, tầng đáy).",
      "Thu mẫu nước mưa/giáng thủy phân tích nồng độ anion Nitrate (NO₃⁻), Sulfate (SO₄²⁻) và cation H⁺, NH₄⁺, Ca²⁺.",
      "Quan trắc nồng độ khí NO, NO₂, SO₂ và hướng gió chủ đạo từ tuyến đường/khu công nghiệp tới hồ."
    ]
  },
  {
    id: 2,
    question: "2. NOₓ có thể đi theo chuỗi phản ứng nào để tới hồ?",
    shortHint: "Chuỗi N₂ + O₂ → NO → NO₂ → HNO₃ → H⁺ + NO₃⁻",
    icon: Wind,
    color: "#D8F36A",
    answerSummary: "NO → NO₂ → các phản ứng tạo HNO₃ → lắng đọng ướt và khô xuống lưu vực hồ.",
    content: [
      "Vùng cháy nhiệt độ cao (động cơ xe, lò đốt): N₂(g) + O₂(g) → 2NO(g).",
      "Gió phát tán trong không khí và oxi hóa tiếp: 2NO(g) + O₂(g) → 2NO₂(g).",
      "Trong giọt mây/mưa: 4NO₂(g) + O₂(g) + 2H₂O(l) → 4HNO₃(aq), sau đó điện ly HNO₃ → H⁺ + NO₃⁻."
    ]
  },
  {
    id: 3,
    question: "3. Làm sao phân biệt lắng đọng axit với các nguyên nhân khác?",
    shortHint: "Đối chiếu đa nguồn: đất phèn, nước thải trực tiếp, địa chất",
    icon: Layers,
    color: "#FF875F",
    answerSummary: "Cần dữ liệu nhiều nguồn; chỉ một chỉ số pH thấp không đủ chứng minh một nguồn duy nhất gây ra.",
    content: [
      "Kiểm tra nền đất đá tự nhiên quanh hồ (ví dụ: đất phèn chứa quặng pyrite FeS₂ tự oxi hóa cũng làm giảm pH).",
      "Kiểm tra cống xả thải trực tiếp: Nước thải công nghiệp/sinh hoạt thường kèm COD, kim loại nặng hoặc PO₄³⁻ cao.",
      "So sánh tỉ lệ mol NO₃⁻ / SO₄²⁻ trong nước mưa và nước hồ để xác định mức đóng góp thực tế của khí quyển."
    ]
  }
];

export default function Slide17CaseStudy() {
  const [activeStep, setActiveStep] = useState(1);
  const [revealedSteps, setRevealedSteps] = useState({ 1: true, 2: false, 3: false });

  const toggleStep = (id) => {
    setActiveStep(id);
    sfx.sonarPing((id - 2) * 0.4);
    setRevealedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const revealAll = () => {
    sfx.chime();
    setRevealedSteps({ 1: true, 2: true, 3: true });
  };

  return (
    <div className="w-full min-h-full flex flex-col justify-between py-1 gap-3 relative">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#54D7E8]/15 border border-[#54D7E8]/35 text-[#54D7E8] text-xs font-bold tracking-wider uppercase flex items-center gap-1">
              <Search size={12} /> Tình huống vận dụng • Phương pháp điều tra khoa học
            </span>
            <span className="text-xs font-mono font-bold text-[#FF875F] bg-[#071521] px-2.5 py-0.5 rounded-full border border-[#FF875F]/40">
              TÌNH HUỐNG MÔ PHỎNG — KHÔNG PHẢI KẾT QUẢ ĐO THỰC TẾ
            </span>
          </div>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          TÌNH HUỐNG GIẢ ĐỊNH — EM SẼ ĐIỀU TRA THẾ NÀO?
        </h2>
      </div>

      {/* Main Grid: Left (5 cols) Simulated Watershed Map SVG | Right (7 cols) Interactive Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto items-stretch">
        {/* Left Column (5 cols): 2D/Isometric Simulated Map SVG per acid.md Slide 17 */}
        <div className="lg:col-span-5 glass-panel p-4 rounded-3xl border border-[#29485A] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#54D7E8] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={15} /> Sơ đồ hiện trường giả định
              </span>
              <span className="text-xs font-mono text-[#A8BBC8]">Lưu vực hồ &amp; Nguồn phát thải</span>
            </div>

            <svg
              viewBox="0 0 460 280"
              className="w-full h-auto rounded-2xl bg-[#05111B] border border-[#29485A] select-none shadow-inner"
              role="img"
              aria-labelledby="s17MapTitle s17MapDesc"
            >
              <title id="s17MapTitle">Bản đồ mô phỏng khu vực điều tra hồ bị giảm pH gần đường giao thông và nhà máy</title>
              <desc id="s17MapDesc">
                Sơ đồ mặt bằng mô phỏng gồm khu công nghiệp và đường cao tốc ở phía đón gió, luồng gió đưa khí thải về phía hồ nước ở tiền cảnh và các trạm lấy mẫu kiểm chứng.
              </desc>
              <defs>
                <linearGradient id="s17SkyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#081A28" />
                  <stop offset="100%" stopColor="#040D15" />
                </linearGradient>
                <linearGradient id="s17LakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1B6F8E" />
                  <stop offset="60%" stopColor="#0E3D52" />
                  <stop offset="100%" stopColor="#072230" />
                </linearGradient>
                <linearGradient id="s17PlumeGrad" x1="0%" y1="0%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#FF875F" stopOpacity="0.75" />
                  <stop offset="45%" stopColor="#E2A055" stopOpacity="0.45" />
                  <stop offset="85%" stopColor="#54D7E8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#54D7E8" stopOpacity="0" />
                </linearGradient>
                <marker id="s17WindArr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#54D7E8" />
                </marker>
                <filter id="s17Glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Sky / Atmospheric backdrop */}
              <rect width="460" height="280" fill="url(#s17SkyGrad)" />

              {/* Topographical Relief Contours (Mountain Ridgelines) */}
              {/* Distant mountain ridge */}
              <path d="M 0 145 Q 80 120 160 135 T 320 115 T 460 130 V 280 H 0 Z" fill="#0C2322" opacity="0.6" />
              {/* Mid-elevation forested hills */}
              <path d="M 0 170 Q 110 145 220 165 T 360 150 T 460 165 V 280 H 0 Z" fill="#11332A" opacity="0.75" />
              {/* Foreground valley slope */}
              <path d="M 0 205 Q 130 185 270 200 T 460 190 V 280 H 0 Z" fill="#163F32" />

              {/* Contour Elevation Lines */}
              <path d="M 0 158 Q 120 138 250 152 T 460 140" fill="none" stroke="#2D604E" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.5" />
              <path d="M 0 192 Q 140 172 290 185 T 460 175" fill="none" stroke="#2D604E" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.5" />

              {/* Pine tree silhouettes on slopes */}
              {[[165, 150, 0.55], [185, 153, 0.45], [215, 158, 0.5], [290, 142, 0.5], [315, 146, 0.42], [425, 155, 0.5]].map(([tx, ty, ts], idx) => (
                <polygon
                  key={idx}
                  points={`${tx},${ty - 16 * ts} ${tx - 7 * ts},${ty} ${tx + 7 * ts},${ty}`}
                  fill="#0B231D"
                />
              ))}

              {/* Highway Corridor (Left flank to center) */}
              <g opacity={activeStep === 2 ? 1 : 0.9}>
                {/* Road surface */}
                <path d="M 0 108 L 195 182" stroke="#182E3E" strokeWidth="13" strokeLinecap="round" />
                <path d="M 0 108 L 195 182" stroke="#29485A" strokeWidth="11" strokeLinecap="round" />
                {/* Road center dash */}
                <path d="M 0 108 L 195 182" stroke="#D8F36A" strokeWidth="1.2" strokeDasharray="6 6" />
                {/* Vehicles on highway */}
                <circle cx="65" cy="133" r="3.2" fill="#54D7E8" />
                <line x1="68" y1="134" x2="80" y2="139" stroke="#54D7E8" strokeWidth="1.2" opacity="0.7" />
                <circle cx="120" cy="154" r="3.5" fill="#FF875F" />
                <line x1="123" y1="155" x2="136" y2="160" stroke="#FF875F" strokeWidth="1.2" opacity="0.7" />
                {/* Highway label */}
                <rect x="18" y="126" width="92" height="15" rx="3.5" fill="#071521" stroke="#29485A" strokeWidth="0.8" />
                <text x="64" y="137" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="800">
                  Cao tốc (Khí thải NO)
                </text>
              </g>

              {/* Industrial Complex (Top-Left upwind source) */}
              <g>
                {/* Factory plant building */}
                <rect x="24" y="38" width="56" height="36" rx="4" fill="#142B3A" stroke="#FF875F" strokeWidth="1.5" />
                {/* Sawtooth roofs */}
                <polygon points="24,38 38,28 38,38" fill="#1E3E54" stroke="#FF875F" strokeWidth="1" />
                <polygon points="38,38 52,28 52,38" fill="#1E3E54" stroke="#FF875F" strokeWidth="1" />
                <polygon points="52,38 66,28 66,38" fill="#1E3E54" stroke="#FF875F" strokeWidth="1" />
                {/* Tall Exhaust Chimney Stack 1 */}
                <rect x="66" y="14" width="7.5" height="24" fill="#24455C" stroke="#050E17" strokeWidth="0.8" />
                <line x1="66" y1="19" x2="73.5" y2="19" stroke="#FF875F" strokeWidth="2" />
                <line x1="66" y1="26" x2="73.5" y2="26" stroke="#FFFFFF" strokeWidth="2" />
                {/* Chimney Stack 2 */}
                <rect x="76" y="18" width="6.5" height="20" fill="#24455C" stroke="#050E17" strokeWidth="0.8" />
                <line x1="76" y1="23" x2="82.5" y2="23" stroke="#FF875F" strokeWidth="1.8" />
                {/* Industrial label */}
                <rect x="27" y="58" width="50" height="13" rx="3" fill="#071521" />
                <text x="52" y="67.5" textAnchor="middle" fill="#FF875F" fontSize="8.5" fontWeight="900">
                  KHU CÔNG NGHIỆP
                </text>
              </g>

              {/* Atmospheric Plume Corridor (Chemical transformation cone) */}
              {/* Translucent pollutant smoke cone drifting downwind */}
              <path
                d="M 74 16 Q 160 30 250 65 Q 330 90 355 120 Q 240 70 74 24 Z"
                fill="url(#s17PlumeGrad)"
              />
              {/* Wind Direction Streamlines with animated dashes */}
              <g className="animate-dash-flow" stroke="#54D7E8" strokeWidth="2" strokeDasharray="6 4" fill="none">
                <path d="M 88 22 Q 185 36 270 70 Q 320 90 350 115" markerEnd="url(#s17WindArr)" />
                <path d="M 96 52 Q 190 64 275 100 Q 315 118 340 135" markerEnd="url(#s17WindArr)" />
              </g>
              {/* Atmospheric chemical evolution banner */}
              <rect x="140" y="14" width="180" height="20" rx="5" fill="#071521" stroke="#54D7E8" strokeWidth="1.2" />
              <text x="230" y="27.5" textAnchor="middle" fill="#54D7E8" fontSize="9.5" fontWeight="800">
                Gió đưa: NO → NO₂ → HNO₃
              </text>

              {/* Cloud & Acid Rain Precipitation Cell */}
              <g transform="translate(305, 50)">
                {/* Cloud shadow & body */}
                <ellipse cx="48" cy="24" rx="46" ry="18" fill="#143247" />
                <ellipse cx="32" cy="18" rx="28" ry="17" fill="#1C4560" stroke="#54D7E8" strokeWidth="1.2" />
                <ellipse cx="62" cy="16" rx="24" ry="15" fill="#245576" stroke="#D8F36A" strokeWidth="1.2" />
                <text x="46" y="22" textAnchor="middle" fill="#D8F36A" fontSize="9.5" fontWeight="900">
                  Mây mưa axit
                </text>
                {/* Acid Rain falling streaks */}
                <g stroke="#D8F36A" strokeWidth="1.5" strokeDasharray="4 4" className="animate-dash-flow">
                  <line x1="20" y1="36" x2="10" y2="82" />
                  <line x1="36" y1="38" x2="26" y2="84" />
                  <line x1="52" y1="38" x2="42" y2="84" />
                  <line x1="68" y1="36" x2="58" y2="82" />
                </g>
                <rect x="12" y="86" width="62" height="14" rx="3.5" fill="#071521" stroke="#D8F36A" strokeWidth="0.8" />
                <text x="43" y="96.5" textAnchor="middle" fill="#D8F36A" fontSize="8" fontWeight="800">
                  HNO₃ (aq) rơi xuống
                </text>
              </g>

              {/* Mountain Tributary Stream flowing into the lake */}
              <path
                d="M 175 190 Q 200 205 210 216 Q 225 220 238 222"
                fill="none"
                stroke="#54D7E8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Lake Basin (Surveyed Aquatic Target) */}
              <g>
                {/* Outer wetland shoreline */}
                <path
                  d="M 180 206 Q 260 178 355 188 T 445 220 Q 380 270 248 262 T 180 206 Z"
                  fill="#0E3228"
                  stroke="#2D725C"
                  strokeWidth="1.5"
                />
                {/* Main water body */}
                <path
                  d="M 188 210 Q 262 184 352 192 T 438 222 Q 375 264 252 256 T 188 210 Z"
                  fill="url(#s17LakeGrad)"
                  stroke="#54D7E8"
                  strokeWidth="2"
                />
                {/* Water surface ripples */}
                <ellipse cx="310" cy="226" rx="60" ry="12" fill="none" stroke="#54D7E8" strokeWidth="0.8" strokeDasharray="8 6" opacity="0.6" />
                <ellipse cx="270" cy="235" rx="35" ry="7" fill="none" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.4" />
                {/* Lake Title Badge */}
                <text x="315" y="222" textAnchor="middle" fill="#FFFFFF" fontSize="11.5" fontWeight="900" paintOrder="stroke" stroke="#050E17" strokeWidth="3">
                  HỒ KHẢO SÁT
                </text>
                <text x="315" y="235" textAnchor="middle" fill="#FF875F" fontSize="9" fontWeight="800" fontFamily="monospace">
                  pH giảm 6,2 → 4,5
                </text>
              </g>

              {/* GIS Sampling Stations & Environmental Buoys */}
              {/* Station M1: Inlet tributary */}
              <g>
                <circle cx="230" cy="216" r="10" fill="#D8F36A" fillOpacity="0.25">
                  <animate attributeName="r" values="7;13;7" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7;0.1;0.7" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="230" cy="216" r="6.5" fill="#D8F36A" stroke="#050E17" strokeWidth="2" />
                <text x="230" y="219.5" textAnchor="middle" fill="#050E17" fontSize="8" fontWeight="900">M1</text>
                {/* Label box */}
                <rect x="180" y="228" width="60" height="15" rx="3.5" fill="#071521" stroke="#D8F36A" strokeWidth="1" />
                <text x="210" y="239" textAnchor="middle" fill="#D8F36A" fontSize="7.5" fontWeight="800">
                  M1: Thượng lưu
                </text>
              </g>

              {/* Station M2: Lake Center Buoy */}
              <g>
                <circle cx="370" cy="215" r="10" fill="#54D7E8" fillOpacity="0.25">
                  <animate attributeName="r" values="7;13;7" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7;0.1;0.7" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="370" cy="215" r="6.5" fill="#54D7E8" stroke="#050E17" strokeWidth="2" />
                <text x="370" y="218.5" textAnchor="middle" fill="#050E17" fontSize="8" fontWeight="900">M2</text>
                {/* Label box */}
                <rect x="360" y="232" width="55" height="15" rx="3.5" fill="#071521" stroke="#54D7E8" strokeWidth="1" />
                <text x="387.5" y="243" textAnchor="middle" fill="#54D7E8" fontSize="7.5" fontWeight="800">
                  M2: Giữa hồ
                </text>
              </g>

              {/* Bedrock Core Geological Tag */}
              <g transform="translate(108, 192)">
                <rect x="0" y="0" width="82" height="24" rx="6" fill="#071521" stroke="#FF875F" strokeWidth="1.2" />
                <text x="41" y="11" textAnchor="middle" fill="#FF875F" fontSize="8" fontWeight="800">
                  Địa chất đáy hồ?
                </text>
                <text x="41" y="20.5" textAnchor="middle" fill="#DCE6F0" fontSize="7" fontFamily="monospace">
                  Granite vs Đá vôi
                </text>
              </g>
            </svg>
          </div>

          <div className="mt-3 p-3 rounded-2xl bg-[#071521]/90 border border-[#29485A] text-xs text-[#DCE6F0]">
            <strong className="text-[#D8F36A] block mb-0.5">Bối cảnh giả định:</strong>
            Một hồ có pH giảm qua nhiều lần đo. Khu vực xung quanh có giao thông và hoạt động công nghiệp, nhưng <strong>chưa có đủ dữ liệu để kết luận ngay nguyên nhân</strong>.
          </div>
        </div>

        {/* Right Column (7 cols): Interactive 3-Question Investigation Checklist */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A8BBC8]">
              Nhấp vào từng câu hỏi để mở gợi ý phương pháp điều tra:
            </span>
            <button
              onClick={revealAll}
              className="text-xs font-bold text-[#54D7E8] hover:underline"
            >
              Mở tất cả gợi ý
            </button>
          </div>

          <div className="space-y-2.5 my-auto">
            {STEPS.map((step) => {
              const IconC = step.icon;
              const isOpen = revealedSteps[step.id];

              return (
                <div
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isOpen
                      ? 'bg-[#122D3E] border-[#54D7E8] shadow-lg'
                      : 'glass-panel hover:bg-[#102838] border-[#29485A]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0"
                        style={{
                          backgroundColor: `${step.color}18`,
                          borderColor: `${step.color}50`,
                          color: step.color
                        }}
                      >
                        <IconC size={18} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base text-white">{step.question}</h3>
                        {!isOpen && (
                          <span className="text-xs text-[#A8BBC8]">Nhấn để xem gợi ý khoa học ({step.shortHint})</span>
                        )}
                      </div>
                    </div>

                    <span
                      className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg border shrink-0"
                      style={{
                        color: step.color,
                        borderColor: `${step.color}50`,
                        backgroundColor: '#050E17'
                      }}
                    >
                      {isOpen ? 'Đang mở' : 'Xem đáp án'}
                    </span>
                  </div>

                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-[#29485A]/70 space-y-2 animate-fade-in">
                      <div className="text-xs font-bold text-[#D8F36A]">
                        Gợi ý cốt lõi: {step.answerSummary}
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#DCE6F0]">
                        {step.content.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <CheckCircle size={14} className="text-[#54D7E8] shrink-0 mt-0.5" />
                            <span className="leading-snug">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-[#071521]/90 border border-[#29485A] flex items-start gap-2.5 text-xs text-[#DCE6F0]">
            <HelpCircle size={16} className="text-[#D8F36A] shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">Nguyên tắc thực nghiệm:</strong> Khoa học môi trường đòi hỏi thu thập bằng chứng từ nhiều nguồn (nước mưa, không khí, địa chất đáy hồ, nguồn xả thải) trước khi đưa ra kết luận nguyên nhân.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
