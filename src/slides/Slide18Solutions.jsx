import React, { useState } from 'react';
import { Bike, Factory, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import EquationCard from '../components/EquationCard';
import { sfx } from '../audio/sfx';

export default function Slide18Solutions() {
  const [scrActive, setScrActive] = useState(true);

  return (
    <div className="w-full min-h-full flex flex-col justify-between py-1 gap-3 relative">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#D8F36A]/15 border border-[#D8F36A]/35 text-[#D8F36A] text-xs font-bold tracking-wider uppercase">
            Giải pháp thiết thực • Trả lời câu hỏi 3 của đề bài
          </span>
          <span className="text-xs text-[#A8BBC8]">Xử lý nguyên nhân gốc rễ thay vì chỉ khắc phục hậu quả</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          GIẢM NGAY TỪ NGUỒN PHÁT THẢI
        </h2>
      </div>

      {/* Main Content Area */}
      <div className="my-auto space-y-3">
        {/* 3 Tiered Action Cards per acid.md Slide 18 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Tier 1: Cá nhân / Cộng đồng */}
          <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-[#54D7E8] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#54D7E8]/15 text-[#54D7E8] border border-[#54D7E8]/30 flex items-center justify-center">
                  <Bike size={18} />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-[#54D7E8] font-bold block">Cấp độ 01</span>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">Cá nhân &amp; Cộng đồng</h3>
                </div>
              </div>

              <ul className="space-y-1.5 text-xs text-[#DCE6F0] mt-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#54D7E8] mt-1.5 shrink-0" />
                  <span>Bảo dưỡng xe đúng định kỳ, tắt máy khi dừng đỗ lâu để giảm tạo NO do nhiệt.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#54D7E8] mt-1.5 shrink-0" />
                  <span>Ưu tiên đi bộ, xe đạp, phương tiện công cộng hoặc xe điện khi phù hợp.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#54D7E8] mt-1.5 shrink-0" />
                  <span>Tiết kiệm điện năng sinh hoạt, góp phần giảm tải cho các nhà máy nhiệt điện.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tier 2: Doanh nghiệp / Nhà máy */}
          <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-[#FF875F] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#FF875F]/15 text-[#FF875F] border border-[#FF875F]/30 flex items-center justify-center">
                  <Factory size={18} />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-[#FF875F] font-bold block">Cấp độ 02</span>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">Doanh nghiệp &amp; Nhà máy</h3>
                </div>
              </div>

              <ul className="space-y-1.5 text-xs text-[#DCE6F0] mt-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF875F] mt-1.5 shrink-0" />
                  <span>Tối ưu hóa nhiệt độ buồng đốt (vòi đốt Low-NOₓ) và nâng cao hiệu suất năng lượng.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF875F] mt-1.5 shrink-0" />
                  <span>Trang bị bộ xúc tác 3 thành phần trên ô tô và hệ thống khử xúc tác chọn lọc (SCR) ở nhà máy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF875F] mt-1.5 shrink-0" />
                  <span>Chuyển dịch sang năng lượng tái tạo, nhiên liệu sạch và công khai số liệu quan trắc.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tier 3: Quản lý / Nhà trường */}
          <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-[#D8F36A] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#D8F36A]/15 text-[#D8F36A] border border-[#D8F36A]/30 flex items-center justify-center">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-[#D8F36A] font-bold block">Cấp độ 03</span>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">Quản lý &amp; Nhà trường</h3>
                </div>
              </div>

              <ul className="space-y-1.5 text-xs text-[#DCE6F0] mt-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D8F36A] mt-1.5 shrink-0" />
                  <span>Kiểm soát tiêu chuẩn khí thải phương tiện/nguồn đốt và kiểm định định kỳ.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D8F36A] mt-1.5 shrink-0" />
                  <span>Mở rộng mạng lưới quan trắc chất lượng không khí, nước mưa và nước mặt.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D8F36A] mt-1.5 shrink-0" />
                  <span>Giáo dục môi trường học đường và bảo tồn các hồ, rừng, di tích nhạy cảm.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Left (6 cols) Interactive SCR Cutaway SVG | Right (6 cols) SCR Equation & Remediation Note */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Left 6 cols: Cutaway SVG of SCR Catalytic Reactor */}
          <div className="lg:col-span-6 glass-panel p-3.5 rounded-3xl border border-[#29485A]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#54D7E8] uppercase tracking-wider">
                Sơ đồ cắt lớp Buồng xử lý khí thải SCR (NO → N₂)
              </span>
              <button
                onClick={() => {
                  setScrActive((prev) => {
                    const next = !prev;
                    if (next) {
                      sfx.chime();
                    } else {
                      sfx.pop();
                    }
                    return next;
                  });
                }}
                className="px-2.5 py-1 rounded-lg bg-[#D8F36A]/15 hover:bg-[#D8F36A]/25 border border-[#D8F36A]/40 text-[#D8F36A] text-xs font-bold flex items-center gap-1"
              >
                <Sparkles size={12} />
                <span>{scrActive ? 'Đang bật xúc tác SCR' : 'Khi tắt xử lý SCR'}</span>
              </button>
            </div>

            <svg
              viewBox="0 0 540 170"
              className="w-full h-auto rounded-2xl bg-[#06131E] border border-[#29485A] select-none shadow-2xl"
              role="img"
              aria-labelledby="s18ScrTitle s18ScrDesc"
            >
              <title id="s18ScrTitle">Sơ đồ cắt lớp buồng xúc tác chọn lọc SCR chuyển hóa NO và NH3 thành N2 và H2O</title>
              <desc id="s18ScrDesc">
                Khí thải chứa NO đi vào đường ống, được phun bổ sung NH3 rồi đi qua lớp xúc tác tổ ong để chuyển hóa thành khí N2 và hơi nước H2O thân thiện với môi trường.
              </desc>
              <defs>
                {/* Duct Interior Depth Gradient */}
                <linearGradient id="s18DuctFlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2E1C1B" stopOpacity="0.8" />
                  <stop offset="35%" stopColor="#1E293B" stopOpacity="0.9" />
                  <stop offset="65%" stopColor={scrActive ? '#13352E' : '#2A181A'} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={scrActive ? '#0D382B' : '#261517'} stopOpacity="0.8" />
                </linearGradient>

                <linearGradient id="s18HoneycombBed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={scrActive ? '#1E3A4D' : '#1E293B'} />
                  <stop offset="50%" stopColor={scrActive ? '#164E63' : '#0F172A'} />
                  <stop offset="100%" stopColor={scrActive ? '#0E3B43' : '#1E293B'} />
                </linearGradient>

                <marker id="s18ArrCyan" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#54D7E8" />
                </marker>
                <marker id="s18ArrCoral" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#FF875F" />
                </marker>
              </defs>

              {/* Heavy Industrial Duct Body Flanges */}
              <rect x="12" y="38" width="516" height="96" rx="10" fill="url(#s18DuctFlow)" stroke="#334155" strokeWidth="3" />
              {/* Aerodynamic Guide Vanes at Inlet */}
              <path d="M 12 50 Q 24 55 36 60 M 12 70 Q 24 75 36 80 M 12 90 Q 24 95 36 100 M 12 110 Q 24 115 36 120" stroke="#475569" strokeWidth="2" />

              {/* Left Input: Dirty Untreated Flue Gas (4 NO + O2) */}
              <g transform="translate(24, 46)">
                <rect x="0" y="0" width="112" height="78" rx="10" fill="#241416" stroke="#FF875F" strokeWidth="1.8" />
                <rect x="8" y="6" width="96" height="18" rx="4" fill="#050E17" />
                <text x="56" y="19" textAnchor="middle" fill="#FF875F" fontSize="9.5" fontWeight="900" fontFamily="monospace">
                  KHÍ THẢI ĐẦU VÀO
                </text>
                <text x="56" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="13.5" fontWeight="900" fontFamily="monospace">
                  4 NO + O₂
                </text>
                <text x="56" y="64" textAnchor="middle" fill="#FF875F" fontSize="9.5" fontWeight="800">
                  (Độc hại, gây mưa axit)
                </text>
              </g>

              {/* Ammonia Injection Grid (AIG) with Multiple Atomizing Spray Nozzles */}
              <g transform="translate(165, 8)">
                <rect x="0" y="0" width="30" height="20" rx="5" fill="#071521" stroke="#D8F36A" strokeWidth="1.5" />
                <text x="15" y="14" textAnchor="middle" fill="#D8F36A" fontSize="9" fontWeight="900">NH₃</text>
                {/* Main vertical manifold feed tube */}
                <path d="M 15 20 V 130" stroke="#D8F36A" strokeWidth="3.5" strokeLinecap="round" />
                {/* Multiple atomization nozzles spraying NH3 mist plumes */}
                {[48, 72, 96, 118].map((ny) => (
                  <g key={ny}>
                    <line x1="15" y1={ny} x2="28" y2={ny} stroke="#D8F36A" strokeWidth="2.5" />
                    {/* Atomized spray plume */}
                    <path
                      d={`M 28 ${ny} L 44 ${ny - 8} L 44 ${ny + 8} Z`}
                      fill="#D8F36A"
                      fillOpacity="0.4"
                    />
                  </g>
                ))}
              </g>

              {/* Mixing Flow Arrows */}
              <path d="M 138 86 H 202" stroke="#FF875F" strokeWidth="2.5" strokeDasharray="5 3" className="animate-dash-flow" />

              {/* Center: Honeycomb Catalyst Monolith Bed (V2O5-WO3/TiO2) */}
              <g transform="translate(215, 42)">
                <rect
                  x="0"
                  y="0"
                  width="142"
                  height="88"
                  rx="8"
                  fill="url(#s18HoneycombBed)"
                  stroke={scrActive ? '#D8F36A' : '#64748B'}
                  strokeWidth="2.2"
                  style={{ filter: scrActive ? 'drop-shadow(0 0 12px rgba(216,243,106,0.3))' : 'none' }}
                />
                
                {/* Honeycomb Monolith Ceramic Channels */}
                <g stroke={scrActive ? '#54D7E8' : '#475569'} strokeOpacity={scrActive ? '0.4' : '0.15'} strokeWidth="1">
                  {[20, 40, 60, 80, 100, 120].map((hx) => (
                    <line key={hx} x1={hx} y1="0" x2={hx} y2="88" />
                  ))}
                  {[18, 36, 54, 72].map((hy) => (
                    <line key={hy} x1="0" y1={hy} x2="142" y2={hy} />
                  ))}
                </g>

                {/* Badge Overlay */}
                <rect x="8" y="24" width="126" height="40" rx="8" fill="#050E17" fillOpacity="0.9" stroke={scrActive ? '#D8F36A' : '#64748B'} strokeWidth="1.2" />
                <text x="71" y="42" textAnchor="middle" fill={scrActive ? '#D8F36A' : '#94A3B8'} fontSize="11" fontWeight="900">
                  LỚP XÚC TÁC SCR TỔ ONG
                </text>
                <text x="71" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="700" fontFamily="monospace">
                  (V₂O₅ / TiO₂, 300°C–400°C)
                </text>
              </g>

              {/* Outlet Flow Arrows */}
              <path
                d="M 360 86 H 396"
                stroke={scrActive ? '#54D7E8' : '#FF875F'}
                strokeWidth="3.5"
                strokeDasharray="6 4"
                markerEnd={scrActive ? 'url(#s18ArrCyan)' : 'url(#s18ArrCoral)'}
                className="animate-dash-flow"
              />

              {/* Right Output: Clean Gas Stream vs Unprocessed Flue Gas */}
              <g transform="translate(402, 46)">
                <rect
                  x="0"
                  y="0"
                  width="122"
                  height="78"
                  rx="10"
                  fill={scrActive ? '#0D2B24' : '#2A1416'}
                  stroke={scrActive ? '#8FCB89' : '#FF875F'}
                  strokeWidth="1.8"
                  style={{ filter: scrActive ? 'drop-shadow(0 0 10px rgba(143,203,137,0.35))' : 'none' }}
                />
                <rect x="8" y="6" width="106" height="18" rx="4" fill="#050E17" />
                <text x="61" y="19" textAnchor="middle" fill={scrActive ? '#8FCB89' : '#FF875F'} fontSize="9.5" fontWeight="900">
                  {scrActive ? 'KHÍ THẢI ĐÃ XỬ LÝ SẠCH' : 'CHƯA ĐƯỢC XỬ LÝ'}
                </text>
                <text x="61" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="13.5" fontWeight="900" fontFamily="monospace">
                  {scrActive ? '4 N₂ + 6 H₂O' : 'NOₓ thoát ra'}
                </text>
                <text x="61" y="64" textAnchor="middle" fill={scrActive ? '#8FCB89' : '#FF875F'} fontSize="9.5" fontWeight="800">
                  {scrActive ? '(An toàn khí quyển)' : '(Gây mưa axit)'}
                </text>
              </g>
            </svg>
          </div>

          {/* Right 6 cols: Equation Card & Remediation Note */}
          <div className="lg:col-span-6 space-y-3">
            <EquationCard
              title="Phản ứng minh họa khử NO bằng NH₃ có mặt xúc tác (Công nghệ SCR)"
              badge="Chuyển hóa NOₓ thành N₂ vô hại"
              badgeColor="lime"
              highlight={true}
              atomBalance="Vế trái: 8 N, 12 H, 6 O  =  Vế phải: 8 N (trong 4N₂), 12 H, 6 O (trong 6H₂O)"
              equationHtml="4NO(g) + 4NH<sub>3</sub>(g) + O<sub>2</sub>(g) <span style='color:#54D7E8;font-size:0.8em'>&mdash;(xt, t°)&rarr;</span> 4N<sub>2</sub>(g) + 6H<sub>2</sub>O(g)"
              note="Phương trình minh họa một phản ứng trong công nghệ xử lý khí thải; việc triển khai thực tế cần thiết kế và vận hành kỹ thuật phù hợp."
            />

            <div className="p-3 rounded-2xl bg-[#071521]/90 border border-[#29485A] flex items-start gap-2.5 text-xs text-[#DCE6F0]">
              <ShieldCheck size={17} className="text-[#54D7E8] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#54D7E8]">Phân biệt giải pháp gốc và khắc phục hậu quả:</strong> Các biện pháp như rải bột đá vôi (CaCO₃) xuống hồ/đất bị chua chỉ hỗ trợ trung hòa cục bộ tại nơi bị ảnh hưởng, <strong>không thể thay thế việc cắt giảm phát thải từ nguồn</strong>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
