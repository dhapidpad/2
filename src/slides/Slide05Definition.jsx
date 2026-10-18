import React from 'react';
import { CloudRain, AlertCircle, Droplet } from 'lucide-react';
import PHScaleBar from '../components/PHScaleBar';



function trackMouse(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}

/* Lớp ánh sáng theo con trỏ + sheen + vạch màu đầu thẻ */
function CardFx({ color }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(320px circle at var(--mx, 50%) var(--my, 0%), ${color}22, transparent 62%)` }}
      />
      <div className="s5-sheen" aria-hidden="true" />
      <div
        className="absolute top-0 left-6 right-6 h-[2px] rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
    </>
  );
}

function NaturalIcon() {
  return (
    <svg viewBox="0 0 56 56" className="w-14 h-14 shrink-0" aria-hidden="true">
      <circle cx="28" cy="28" r="26" fill="#54D7E815" stroke="#54D7E8" strokeOpacity="0.5" />
      <g className="s5-bob">
        <path d="M28 10 C22 21 17 28 17 34 A11 11 0 0 0 39 34 C39 28 34 21 28 10 Z" fill="#54D7E8" fillOpacity="0.25" stroke="#54D7E8" strokeWidth="2" />
        <text x="28" y="37" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff">5,6</text>
      </g>
    </svg>
  );
}

function WetIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12 shrink-0" aria-hidden="true">
      <rect x="1" y="1" width="46" height="46" rx="14" fill="#54D7E815" stroke="#54D7E8" strokeOpacity="0.5" />
      <path d="M14 24 a6 6 0 0 1 4 -10.5 a8 8 0 0 1 15 2 a5.5 5.5 0 0 1 1 8.5 Z" fill="#54D7E8" fillOpacity="0.25" stroke="#54D7E8" strokeWidth="1.8" strokeLinejoin="round" />
      {[19, 26, 33].map((x, i) => (
        <line key={x} x1={x} y1="30" x2={x - 2} y2="38" stroke="#D8F36A" strokeWidth="2" strokeLinecap="round" className="s5-fall" style={{ '--sd': `${i * 0.55}s` }} />
      ))}
    </svg>
  );
}

function DryIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12 shrink-0" aria-hidden="true">
      <rect x="1" y="1" width="46" height="46" rx="14" fill="#FF875F15" stroke="#FF875F" strokeOpacity="0.5" />
      <path d="M10 38 Q24 33 38 38" fill="none" stroke="#FF875F" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 37 C22 31 24 25 30 22 C31 28 29 33 24 37 Z" fill="#D8F36A" fillOpacity="0.35" stroke="#D8F36A" strokeWidth="1.5" />
      {[[15, 9], [24, 7], [33, 10], [20, 12], [29, 6]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="#FF875F" className="s5-fall" style={{ '--sd': `${i * 0.45}s` }} />
      ))}
    </svg>
  );
}

export default function Slide05Definition() {
  return (
    <div className="w-full min-h-full flex flex-col justify-between py-1 gap-4 relative">

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="s5-blob absolute -top-24 right-[-60px] w-[400px] h-[400px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #54D7E8, transparent 65%)' }} />
        <div className="s5-blob absolute -bottom-28 -left-16 w-[420px] h-[420px] rounded-full opacity-[0.16]" style={{ background: 'radial-gradient(circle, #FF875F, transparent 65%)', animationDelay: '-7s' }} />
      </div>

      {/* Header */}
      <div className="relative s5-rise" style={{ '--d': '0ms' }}>
        <div className="flex flex-wrap items-center gap-2.5 mb-2">
          <span className="px-3 py-1 rounded-full bg-[#54D7E8]/12 border border-[#54D7E8]/35 text-[#54D7E8] text-xs font-bold tracking-wide">
            Kiến thức nền tảng · Định nghĩa chuẩn U.S. EPA
          </span>
          <span className="text-xs text-[#A8BBC8]">Vì sao nước mưa tự nhiên không có pH = 7,0?</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.08]">
          Mưa axit = lắng đọng có thành phần axit
        </h2>
        <div className="mt-3 h-[3px] w-40 rounded-full" style={{ background: 'linear-gradient(90deg,#54D7E8,#D8F36A,#FF875F)' }} />
      </div>

      {/* Main grid */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto items-stretch">
        {/* Left */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          {/* Definition */}
          <div
            onMouseMove={trackMouse}
            className="s5-rise s5-card group rounded-3xl p-4 sm:p-5"
            style={{ '--c': '#54D7E8', '--glow': '#54D7E855', '--d': '140ms' }}
          >
            <CardFx color="#54D7E8" />
            <h3 className="relative text-sm font-bold text-[#54D7E8] mb-2 flex items-center gap-2">
              <CloudRain size={17} /> Bản chất hóa học của lắng đọng axit
            </h3>
            <p className="relative text-xs sm:text-sm text-[#F4F7FA] leading-relaxed">
              Mưa axit (hay rộng hơn là <strong className="text-[#D8F36A]">lắng đọng axit — acid deposition</strong>) là hiện tượng giáng thủy có độ axit cao hơn mức tự nhiên (<strong className="text-[#D8F36A]">pH &lt; 5,6</strong>) do các khí ô nhiễm — chủ yếu là <strong className="text-[#FF875F]">SO₂</strong> và <strong className="text-[#54D7E8]">NO<sub>x</sub></strong> — bị oxi hóa trong khí quyển tạo thành hai axit mạnh là <strong className="text-[#FF875F]">H₂SO₄</strong> và <strong className="text-[#54D7E8]">HNO₃</strong>.
            </p>
          </div>

          {/* Natural vs acid */}
          <div className="grid grid-cols-1 gap-3.5">
            <div
              onMouseMove={trackMouse}
              className="s5-rise s5-card group rounded-3xl p-4 flex items-center gap-4"
              style={{ '--c': '#54D7E8', '--glow': '#54D7E855', '--d': '260ms' }}
            >
              <CardFx color="#54D7E8" />
              <div className="relative"><NaturalIcon /></div>
              <div className="relative min-w-0">
                <span className="text-xs font-semibold text-[#54D7E8]">Nước mưa tự nhiên sạch · pH ≈ 5,6</span>
                <div className="mt-1.5 font-mono text-xs font-bold text-[#D8F36A]">CO₂ + H₂O ⇌ H₂CO₃</div>
                <div className="font-mono text-xs text-[#B4C6D3]">H₂CO₃ ⇌ H⁺ + HCO₃⁻ <span className="text-[#7F93A8]">(axit yếu)</span></div>
                <div className="text-xs text-[#7F93A8] mt-0.5">Chỉ phân ly thuận nghịch một phần nhỏ</div>
              </div>
            </div>

            <div
              onMouseMove={trackMouse}
              className="s5-rise s5-card group rounded-3xl p-4"
              style={{ '--c': '#FF875F', '--glow': '#FF875F55', '--d': '380ms' }}
            >
              <CardFx color="#FF875F" />
              <span className="relative block text-xs font-semibold text-[#FF875F] mb-3">Lắng đọng axit · pH &lt; 5,6</span>
              <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 rounded-2xl bg-[#071521]/80 border border-[#54D7E8]/30 p-3">
                  <WetIcon />
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold text-white leading-tight">Lắng đọng ướt <span className="text-[#54D7E8] font-semibold">(Wet)</span></div>
                    <div className="text-xs text-[#DCE6F0] mt-1 leading-snug">Mưa, tuyết, sương mù hòa tan</div>
                    <div className="font-mono text-xs font-bold text-[#D8F36A] mt-1">HNO₃, H₂SO₄ → H⁺ cao</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-[#071521]/80 border border-[#FF875F]/30 p-3">
                  <DryIcon />
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold text-white leading-tight">Lắng đọng khô <span className="text-[#FF875F] font-semibold">(Dry)</span></div>
                    <div className="text-xs text-[#DCE6F0] mt-1 leading-snug">Khí NO₂, SO₂ &amp; bụi mịn nitrate/sulfate</div>
                    <div className="text-xs font-bold text-[#FF875F] mt-1">Bám lá cây, công trình</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <div
            className="s5-rise p-3.5 rounded-2xl bg-[#071521]/90 border border-[#29485A] flex items-start gap-3 text-xs sm:text-[13px] text-[#DCE6F0] leading-relaxed"
            style={{ '--d': '500ms', borderLeft: '4px solid #D8F36A' }}
          >
            <AlertCircle size={17} className="text-[#D8F36A] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#D8F36A]">Lưu ý khoa học quan trọng:</strong> Cả <strong>SO₂</strong> (tạo H₂SO₄) và <strong>NO<sub>x</sub></strong> (tạo HNO₃) đều là hai tác nhân chính gây mưa axit. Chuyên đề này đi sâu vào nhánh <strong>NO<sub>x</sub> → HNO₃</strong> theo yêu cầu đề bài.
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-7 flex flex-col gap-2.5 s5-rise" style={{ '--d': '220ms' }}>
          <div className="flex items-center justify-between gap-3 px-1">
            <span className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
              <Droplet size={16} className="text-[#54D7E8]" /> Thang pH tương tác
            </span>
            <span className="flex items-center gap-2 text-xs text-[#A8BBC8]">
              <span className="s5-dot w-2 h-2 rounded-full bg-[#54D7E8]" aria-hidden="true" />
              Mưa tự nhiên đang đặt tại pH 5,6
            </span>
          </div>
          <div className="relative flex-1 flex items-center">
            <div
              className="absolute -inset-3 rounded-[2rem] pointer-events-none opacity-60"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(84,215,232,.16), transparent 70%)' }}
              aria-hidden="true"
            />
            <div className="relative w-full">
              <PHScaleBar currentPh={5.6} showDetails={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}