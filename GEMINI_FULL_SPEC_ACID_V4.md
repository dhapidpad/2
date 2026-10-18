# GEMINI FULL SPEC v4 — ACID RAIN: TRÌNH CHIẾU DỄ NHẤT, SIDEBAR KHÔNG CHE NỘI DUNG, CHUYỂN CẢNH MƯỢT, RESPONSIVE, SVG ANIMATION TỰ CHẠY, INTRO CÓ TIẾNG

> Tài liệu này là **bản giao việc cho Gemini (Antigravity)**. Nó dựa trên việc đọc trực tiếp source trong `acid__2_.zip` (53 file), không phải suy đoán.
> Tài liệu viết độc lập với tên model; mọi yêu cầu đều kiểm chứng được bằng lệnh/hành vi trình duyệt.
> **Lưu ý trung thực:** môi trường phân tích không có mạng nên chưa chạy `npm install` / `npm run build`. Mọi nhận định bên dưới là từ đọc code, ffprobe/ffmpeg trên `intro.mp4` và xem khung hình thật. Gemini phải tự chạy build và test trình duyệt rồi mới được báo "đã xong".

---

## 0. CÁCH DÙNG NHANH

1. Giải nén dự án, mở bằng Antigravity.
2. Đặt file này ở thư mục gốc (cạnh `package.json`) với tên `GEMINI_FULL_SPEC_ACID_V4.md`.
3. Dán **PROMPT MỞ ĐẦU** ở mục 17.1. Muốn an toàn và đúng trọng tâm, **dán trước PROMPT RIÊNG ở mục 17.2** (Layout + Sidebar + Chuyển cảnh + Responsive). Nếu agent quá tải, chạy lần lượt các prompt phase ở mục 17.4.

**Thứ tự ưu tiên của bản v4 (vì sao làm theo thứ tự này):**

| Ưu tiên | Việc | Lý do |
|---|---|---|
| 1 | Khung hiển thị: Stage + Side Panel + Dock, canvas 16:9, responsive (mục 9, 10, 13) | Ảnh hưởng mọi slide; làm sau sẽ phải sửa lại hết animation |
| 2 | Chuyển cảnh mượt (mục 11) | Cảm nhận chất lượng ngay từ lần chuyển slide đầu tiên |
| 3 | Công cụ thuyết trình (mục 12) | Làm cho người nói thật sự dễ trình bày |
| 4 | Intro có tiếng (mục 4) | Cần cổng thao tác người dùng ở bìa |
| 5 | SVG animation tự chạy 20 slide + âm thanh (mục 3, 5, 6) | Khối lượng lớn nhất, đặt sau khi khung ổn định |

**Kết quả mong muốn:** mở web → bấm một nút "Bắt đầu" ở bìa → intro chạy **có tiếng** → tự sang slide 3 → mọi slide có SVG tự chạy ngay khi vào, chuyển cảnh mượt có hiệu ứng thoát/vào. Bấm `N` mở Kịch bản ở sidebar: **slide co lại vừa khung chứ không bị che**. Đồng hồ, laser, màn hình đen/trắng, Từng bước hoạt động. Điện thoại: vuốt đi theo ngón tay, bottom sheet kịch bản đẩy nội dung lên. Tải lại trang vẫn đúng slide.

---

## 1. KẾT QUẢ PHÂN TÍCH SOURCE HIỆN TẠI

### 1.1 Nền tảng

- React 18.3 + Vite 6 + Tailwind 3.4 + `lucide-react`. Không có thư viện animation nào. **Giữ nguyên nền tảng, không thêm dependency nặng.**
- 21 màn hình điều hướng trong `src/App.jsx` (mảng `SLIDES` + `SLIDE_META`). Slide 1 = bìa, slide 2 = intro video.
- Màu/tokens đã chuẩn: cyan `#54D7E8`, lime `#D8F36A`, coral `#FF875F`, nền `#050E17`.

### 1.2 Những gì đã được sửa so với `ANTIGRAVITY_MASTER_PROMPT_...md` cũ (không làm lại)

Master prompt cũ mô tả một trạng thái đã lỗi thời. Source hiện tại đã:

- `SlideIntroVideo.jsx` đã là **state machine** (`loading / playing / muted-playing / paused / needs-gesture / ended / error`), có `hasAdvancedRef` chống nhảy slide đôi, có nút Bật/Tắt tiếng, Play/Pause, Bỏ qua, overlay cần-tương-tác, fallback SVG khi lỗi.
- `src/utils/audioUnlock.js` **không còn** trong zip.
- `BottomControls` **đã được gắn** vào `App.jsx` (notes, grid, fullscreen, font scale, reduced motion).
- Fullscreen đã lấy trạng thái từ sự kiện `fullscreenchange`.
- Phím tắt đã bỏ qua `input/textarea/select/button` và `[role="dialog"]`.
- Swipe đã bỏ qua `button/input/select/slider`.

→ **Không viết lại các phần này.** Chỉ chỉnh sửa có chủ đích ở mục 4.

### 1.3 PHÁT HIỆN P0 — `public/intro.mp4` KHÔNG phải video khoa học của bài

Kiểm tra bằng `ffprobe` và trích khung hình:

| Thuộc tính | Giá trị |
|---|---|
| Codec | H.264 High, 1280×720, 30 fps, yuv420p |
| Âm thanh | AAC stereo 44,1 kHz, **có tiếng** (mean −20,1 dB, max −4,2 dB) |
| Thời lượng | 7,22 giây, ~703 KB |
| Nội dung thật | Intro quảng cáo của một trang web ngoài: logo **"HentaiZ.Net"** ở góc, nhân vật anime, bong bóng chữ "Tích cực quay tay vận may sẽ tới". Không liên quan mưa axit/NOₓ. |

Hệ quả:

- Đưa vào bài thuyết trình hóa học ở lớp/hội đồng là **rủi ro nghiêm trọng** (thương hiệu trang người lớn, nội dung không phù hợp, bản quyền không rõ).
- Yêu cầu "bật tiếng intro mp4" sẽ phát đúng clip này nếu giữ nguyên.

**Quyết định kỹ thuật bắt buộc:**

1. Gemini **không dùng** clip này làm intro mặc định.
2. Xây **intro điện ảnh bằng SVG + CSS + Web Audio** ngay trong app (mục 4.3), không phụ thuộc file ngoài, không vướng bản quyền.
3. Giữ cơ chế phát `mp4` làm **tùy chọn**: nếu người dùng tự đặt video của mình vào `public/intro.mp4` rồi bật `INTRO_MODE = 'video'` trong `src/config/media.js` thì chạy bằng pipeline có tiếng ở mục 4.2.
4. Di chuyển clip hiện tại sang `docs/_removed/intro-original.mp4` (hoặc xóa nếu người dùng đồng ý) và **ghi cảnh báo trong README**.

### 1.4 Mật độ animation hiện tại theo slide (đếm từ source)

| Vị trí | File | Dòng | `<svg>` | SMIL (`animateMotion`+`animate`) | Class animate | State tương tác |
|---|---|---|---|---|---|---|
| 1 | Slide01Cover | 498 | 1 | 0 | 3 | 1 |
| 2 | SlideIntroVideo | 326 | 1 (fallback) | 0 | 4 | 3 |
| 3 | Slide03Team | 276 | 0 | 0 | 0 | 3 |
| 4 | Slide02Problem | 427 | 1 | 4 | 0 | 2 |
| 5 | Slide04Roadmap | 348 | 3 | 0 | 0 | 0 |
| 6 | Slide05Definition | 235 | 3 | 0 | 0 | 0 |
| 7 | Slide06Sources | 211 | 2 | 0 | 0 | 0 |
| 8 | Slide07MechanismMap | 370 | 1 | 2 | 4 | 1 |
| 9 | Slide08Step1Combustion | 213 | 1 | 0 | 2 | 1 |
| 10 | Slide09Step2Oxidation | 170 | 1 | 0 | 1 | 0 |
| 11 | Slide10Step3NitricAcid | 201 | 1 | 0 | 0 | 1 |
| 12 | Slide11DissociationDeposition | 192 | 1 | 0 | 2 | 0 |
| 13 | Slide12InteractivePH | 250 | 1 | 0 | 1 | 3 |
| 14 | Slide13ImpactLakes | 214 | 1 | 0 | 0 | 1 |
| 15 | Slide14ImpactSoilForest | 203 | 1 | 0 | 0 | 0 |
| 16 | Slide15ImpactLimestone | 222 | 1 | 0 | 2 | 1 |
| 17 | Slide16ImpactMetalsHealth | 184 | 2 | 0 | 0 | 0 |
| 18 | Slide17CaseStudy | 271 | 1 | 0 | 3 | 2 |
| 19 | Slide18Solutions | 253 | 1 | 0 | 2 | 1 |
| 20 | Slide19MiniQuiz | 277 | 0 | 0 | 1 | 3 |
| 21 | Slide20Conclusion | 248 | 1 | 0 | 1 | 0 |

**Kết luận:** chỉ slide 4 và slide 8 có chuyển động SVG thật (SMIL). Các slide 5, 6, 7, 11, 14, 15, 17 gần như **tĩnh hoàn toàn**; các slide cơ chế 9–12 chỉ có 0–2 hiệu ứng lặp đơn giản. Đây là khoảng trống lớn nhất so với yêu cầu "animation SVG xịn, auto-play".

### 1.5 Vấn đề kỹ thuật còn lại (có bằng chứng trong source)

| # | Mức | Vấn đề | Vị trí |
|---|---|---|---|
| T1 | P0 | Intro mp4 không phù hợp nội dung (mục 1.3) | `public/intro.mp4` |
| T2 | P1 | Âm thanh chỉ nằm ở video; không có hệ âm thanh toàn app. Không có SFX cho tương tác | toàn app |
| T3 | P1 | Hard-code chỉ số slide: `currentSlide === 2`, `=== 21`, `totalSlides = 21`, chuỗi "Bỏ qua sang Slide 03" | `SlideShell.jsx`, `SpeakerNotesModal.jsx`, `SlideIntroVideo.jsx` |
| T4 | P1 | Tên file `Slide03Team` đứng **trước** `Slide02Problem` trong `SLIDES`; số trong tên file ≠ vị trí hiển thị → dễ nhầm khi sửa | `App.jsx` |
| T5 | P1 | `prefers-reduced-motion` của hệ điều hành mặc định bật `reducedMotion` → trên laptop có tắt hiệu ứng, **toàn bộ presentation đứng yên mà người trình bày không biết**. Cần chỉ báo rõ + chế độ trung gian | `App.jsx`, `index.css` |
| T6 | P1 | Animation chỉ chạy khi mount; không dừng khi tab ẩn / mở modal → tốn pin; không có nút "Phát lại" cảnh | slides |
| T7 | P2 | `index.html` không tải font `JetBrains Mono` dù Tailwind khai báo `font-mono` → số liệu/phương trình rơi về font hệ thống | `index.html`, `tailwind.config.js` |
| T8 | P2 | `will-change` + `backdrop-filter` + gradient 600–800 px trên mọi slide; khi thêm animation dày sẽ giật trên máy yếu | `SlideShell.jsx`, `index.css` |
| T9 | P2 | Intro: lần phát đầu cố `muted=false` rồi mới fallback. Nếu vào slide 2 không qua thao tác người dùng → luôn rơi vào nhánh muted/needs-gesture. Chưa có CTA ở bìa để tạo thao tác hợp lệ | `Slide01Cover.jsx`, `SlideIntroVideo.jsx` |
| T10 | P2 | `README.md` nói video "tự động phát kèm âm thanh" — hứa vượt khả năng trình duyệt | `README.md` |
| T11 | P2 | `ANTIGRAVITY_MASTER_PROMPT_*.md` (95 KB) và `acid.md` (137 KB) nằm trong gói nhưng đã lỗi thời so với source → agent đọc sẽ sửa sai | gốc dự án |
| T12 | P0 | **Không có sidebar thật.** "Dock" `BottomControls` là viên nang nổi `fixed bottom-2.5 z-50` + thanh tiến độ cố định 2,5 px; chỉ tránh che bằng đệm cứng `pb-28 sm:pb-32` (112–128 px chết ở đáy mọi slide, ~15–17% chiều cao màn 768 px) | `BottomControls.jsx`, `SlideShell.jsx` |
| T13 | P0 | Kịch bản và Lưới là **modal toàn màn hình** (`fixed inset-0`, nền đen 75–80% + blur) → bấm `N` là **che toàn bộ slide**; người nói không vừa nhìn slide vừa đọc kịch bản; chiếu mirror thì khán giả cũng thấy kịch bản | `SpeakerNotesModal.jsx`, `SlideGridModal.jsx` |
| T14 | P0 | Slide là dòng cuộn dọc (`overflow-y-auto`, `min-h-full`) với cỡ chữ theo breakpoint của viewport → laptop 1366×768 hay máy chiếu 1024×768 phải cuộn giữa lúc nói; mỗi màn hình thấy một bố cục khác nhau | `SlideShell.jsx`, slides |
| T15 | P1 | Chuyển slide chỉ có hiệu ứng vào (260 ms), không có hiệu ứng thoát: slide cũ biến mất tức thì; vuốt không đi theo ngón tay; giữ phím mũi tên làm animation vào chạy lại liên tục | `SlideShell.jsx`, `App.jsx` |
| T16 | P1 | Không có "build" (lộ từng phần), đồng hồ/ước lượng thời gian, xem trước slide kế, con trỏ laser, màn hình đen/trắng, cửa sổ người trình bày | toàn app |
| T17 | P1 | Không lưu trạng thái: trong `src/` không có hash, `localStorage`, `history` → tải lại luôn về slide 1; không có liên kết sâu `#13`; nút Back thoát khỏi bài | `App.jsx` |
| T18 | P1 | Meta viewport thiếu `viewport-fit=cover` → `env(safe-area-inset-*)` luôn bằng 0 trên iPhone tai thỏ/đảo động (dock chạm thanh home); thiếu `theme-color`, `manifest` | `index.html` |
| T19 | P1 | iPhone Safari không hỗ trợ Fullscreen API cho trang → nút `F` vô dụng; cần hướng dẫn "Thêm vào Màn hình chính" + manifest `display: standalone` | `BottomControls.jsx`, `index.html` |
| T20 | P1 | Chữ quá nhỏ để thuyết trình: **207** `text-xs` (12 px), **52** `text-[11px]`, **19** `text-[10px]` | slides |
| T21 | P2 | Nút "Cỡ chữ" đặt `font-size: %` lên container nhưng Tailwind dùng `rem` (theo `html`) → nhiều khả năng gần như **không có tác dụng** (suy luận từ code, cần chạy thử để xác nhận) | `App.jsx`, `SlideShell.jsx` |
| T22 | P2 | `TopNavBar.jsx` mồ côi: không file nào import | `src/components/` |
| T23 | P2 | `slideNotes` slide 2 vẫn ghi "45–60 giây" và mô tả trailer cũ; `duration` là chuỗi ("40–60 giây") khó cộng tổng | `slideNotes.js` |
| T24 | thuận lợi | `xl:` chỉ dùng 3 lần, `2xl:` 0 lần (`lg:` 64, `md:` 47, `sm:` 210) → chuyển sang canvas cố định rất khả thi | slides |

---

## 2. MỤC TIÊU, PHẠM VI, KHÔNG LÀM

### Phải làm

1. **Intro có tiếng, đáng tin cậy**, vào bằng thao tác người dùng hợp lệ (mục 4).
2. **Intro mới bằng SVG + Web Audio** (không phụ thuộc mp4), tùy chọn mp4 của người dùng.
3. **Mọi slide có SVG chuyển động tự chạy khi vào** (auto-play), có thể phát lại, tạm dừng khi không hiển thị (mục 5).
4. **Hệ SVG thống nhất**: phân tử 3D giả lập, glow có kiểm soát, hạt, dòng chảy, đường dẫn (mục 6).
5. **Hệ âm thanh nhẹ** cho tương tác: tắt/bật, âm lượng, nhớ lựa chọn (mục 4.5).
6. **Giữ nguyên nội dung khoa học** (phương trình, số liệu, notes). Chỉ nâng cấp trình bày và chuyển động.
7. **Hiệu năng và truy cập**: 60 fps trên laptop phổ thông, dùng được trên điện thoại, tôn trọng reduced-motion nhưng có chỉ báo.
8. **Không có gì che nội dung**: Side Panel/Dock chiếm chỗ và đẩy layout; Kịch bản không còn là modal đè slide (mục 9).
9. **Canvas 16:9 WYSIWYG + reflow cho điện thoại**: không cuộn khi trình chiếu, cùng bố cục ở mọi màn hình (mục 10, 13).
10. **Chuyển cảnh mượt** có thoát/vào, chống vỡ khi bấm liên tục, vuốt đi theo ngón tay (mục 11).
11. **Công cụ thuyết trình**: đồng hồ, Từng bước, cửa sổ người trình bày, laser, đen/trắng, ghi nhớ vị trí (mục 12).

### Không làm

- Không thêm thư viện animation (GSAP, framer-motion, lottie…). Dùng **CSS keyframes + SMIL + Web Animations API + rAF** có sẵn trên trình duyệt.
- Không dùng file âm thanh tải từ internet. Âm thanh **tổng hợp bằng Web Audio**. Nếu người dùng muốn nhạc nền riêng thì để ở `public/audio/` kèm ghi chú bản quyền.
- Không viết lại logic điều hướng đã chạy tốt (mục 1.2).
- Không đổi tên hàng loạt file slide trong đợt này; chỉ tạo bảng ánh xạ (T4) và đọc số slide từ một nguồn.
- Không thay đổi nội dung hóa học khi chưa đối chiếu notes.

---

## 3. KIẾN TRÚC CHUYỂN ĐỘNG ĐỀ XUẤT

### 3.1 Cấu trúc thư mục thêm mới

```text
src/
  config/
    media.js            # INTRO_MODE: 'cinematic' | 'video', đường dẫn video, mặc định âm lượng
    slides.js           # NGUỒN DUY NHẤT: [{ id, key, title, component, kind }] — thay SLIDES + SLIDE_META
  audio/
    AudioEngine.js      # singleton, tạo AudioContext lười trong thao tác người dùng
    sfx.js              # tick, whoosh, pop, chime, error, riser, rainLoop(start/stop)
    AudioProvider.jsx   # context: { enabled, volume, setVolume, toggle, unlocked, unlock() }
  motion/
    MotionProvider.jsx  # mode: 'cinematic' | 'balanced' | 'reduced'; tab hidden; paused
    useSlideActive.js   # slide có đang hiển thị không (ẩn tab/modal -> false)
    useTimeline.js      # chuỗi bước theo thời gian: [{ at, fn }], replay(), pause()
    Reveal.jsx          # lộ nội dung theo stagger (opacity+translate)
    CountUp.jsx         # số chạy (pH, nhiệt độ, nồng độ)
  svg/
    SvgDefs.jsx         # gradient, filter, marker DÙNG CHUNG (id có tiền tố 'sx-')
    Atom.jsx            # nguyên tử 3D giả lập (CPK)
    Molecule.jsx        # NO, NO2, N2, O2, HNO3, H2O dựng từ Atom
    Particles.jsx       # hạt bay theo path (SMIL) hoặc rAF
    FlowPath.jsx        # đường dẫn chảy (stroke-dashoffset) + chấm di chuyển
  slides/
    SlideIntroCinematic.jsx   # intro mới (mục 4.3)
```

### 3.2 Quy tắc auto-play

- **Vào slide = chạy ngay.** Container slide trong `SlideShell` đã `key={currentSlide}` nên remount mỗi lần chuyển; tận dụng điều đó, không cần nút Play.
- Mỗi slide có **"kịch bản cảnh" 4–8 giây** (`useTimeline`), sau đó chuyển sang **vòng lặp nền nhẹ** (dòng chảy, hạt, thở). Không lặp lại cảnh nặng vô hạn.
- Mỗi slide có nút nhỏ **"↻ Phát lại cảnh"** (góc khung SVG, ≥44 px chạm) và phím `R`.
- **Dừng khi không cần:** tab ẩn (`visibilitychange`), modal Notes/Grid mở, hoặc slide không active → thêm class `motion-paused` (`animation-play-state: paused`) và `svg.pauseAnimations()` cho SMIL.
- **Không hứng sự kiện:** animation chỉ dùng `pointer-events: none`, không chặn nút/slider.

### 3.3 Ba chế độ chuyển động (thay cho bật/tắt nhị phân)

| Chế độ | Hành vi | Mặc định khi |
|---|---|---|
| `cinematic` | Toàn bộ cảnh + hạt + glow + âm thanh | Hệ điều hành **không** yêu cầu giảm chuyển động |
| `balanced` | Cảnh chính chạy, bỏ hạt phụ/blur động | Thiết bị yếu (`hardwareConcurrency <= 4` hoặc `deviceMemory <= 4`) hoặc màn hình < 768 px |
| `reduced` | Trạng thái cuối tĩnh, chỉ chuyển cross-fade | OS bật `prefers-reduced-motion` |

- **Dock mới (mục 9.4)** hiển thị **chip chế độ hiện tại** và cho đổi. Khi chế độ là `reduced` do hệ điều hành, hiện thông báo một lần: "Hệ điều hành đang yêu cầu giảm chuyển động. Bấm để bật hiệu ứng cho buổi thuyết trình." (giải quyết T5).
- CSS hiện tại `.reduced-motion *{animation-duration:.01ms !important}` giữ lại cho chế độ `reduced`; SMIL phải tự kiểm tra chế độ để đặt `repeatCount="1"` hoặc không render hạt.

### 3.4 Ngân sách hiệu năng (bắt buộc)

- Chỉ animate `transform` và `opacity` cho phần tử HTML; với SVG ưu tiên `transform` trên `<g>`, `stroke-dashoffset`, `offset-distance`/`animateMotion`.
- **Cấm** animate `filter: blur()`, `box-shadow` lớn, `width/height/top/left`.
- Glow dùng `<feGaussianBlur>` **tĩnh** trong `<defs>` rồi áp lên nhóm không đổi kích thước; hoặc dùng `radialGradient` thay blur.
- Mỗi slide: **≤ 60 phần tử SVG đang chuyển động đồng thời** ở `cinematic`, **≤ 24** ở `balanced`.
- Hạt: dùng một `<g>` và `<use>` lặp lại từ `<symbol>`; mỗi hạt có `begin` lệch để tránh đồng bộ cơ học.
- Đo bằng DevTools Performance: chuyển slide không có frame > 50 ms; animation nền giữ ≥ 55 fps ở 1080p trên laptop phổ thông.

---

## 4. INTRO, AUTOPLAY VÀ ÂM THANH

### 4.1 Sự thật về chính sách autoplay (đừng hứa quá)

- Trình duyệt chỉ cho phát có tiếng khi trang đã có **thao tác người dùng hợp lệ** (click, chạm, phím; không tính phím Esc). Không có cách hợp pháp nào bỏ qua điều này, kể cả "unlock" bằng `AudioContext` im lặng.
- Vì vậy yêu cầu "tự phát có tiếng" được thực hiện bằng cách **biến thao tác đầu tiên của người dùng thành cánh cổng vào intro**: một nút/phím ở slide bìa.
- Safari/iOS khắt khe hơn: `play()` phải được gọi **đồng bộ trong handler** của thao tác. Thiết kế dưới đây thỏa điều đó.
- Nếu trang bị nhúng trong `iframe`, cần thuộc tính `allow="autoplay; fullscreen"` ở trang chủ nhúng. Ghi vào README.

### 4.2 Luồng "Bắt đầu" — gesture-first

1. **Slide bìa** thêm CTA nổi bật: **"▶ Bắt đầu trình chiếu (có âm thanh)"**, đồng thời nhận phím `Enter`/`Space`.
2. Handler CTA, **trong cùng call stack của sự kiện**, thực hiện:
   - `AudioProvider.unlock()` → tạo/resume `AudioContext`.
   - Nếu `INTRO_MODE === 'video'`: gọi `introVideoEl.muted = false; introVideoEl.currentTime = 0; introVideoEl.play()` trên **phần tử `<video>` đã mount sẵn** (xem 4.2.1).
   - Sau đó `goToSlide(2)`.
3. Nếu người dùng vào slide 2 bằng cách khác (mũi tên, grid, vuốt): các thao tác này cũng là thao tác hợp lệ; vẫn thử phát có tiếng. Nếu bị chặn → hiện overlay "Chạm để phát có tiếng" (đã có, giữ và chỉnh câu chữ).

#### 4.2.1 Phần tử media bền vững

- Đặt `<IntroMediaLayer>` ở cấp `App` (luôn mount, `preload="auto"`, ẩn bằng `visibility`/`opacity`, **không** `display:none` vì Safari có thể không giải mã).
- `SlideIntroVideo` chỉ là lớp hiển thị/điều khiển: nhận ref qua context, không tự tạo `<video>` mới. Điều này loại bỏ T9 và tránh trễ nạp.
- Chỉ preload ở chế độ `video`; chế độ `cinematic` không cần.

#### 4.2.2 State machine (giữ tên trạng thái hiện có, bổ sung)

`idle → loading → playing | muted-playing | needs-gesture → paused ⇄ playing → ended | error`

- Bổ sung `idle` (chưa vào slide 2) và sự kiện `stalled/waiting` → hiển thị spinner nhỏ.
- `play()` luôn `await` và `catch`; **chỉ đặt trạng thái theo kết quả thật** của promise.
- Hủy đăng ký mọi listener ở cleanup; `hasAdvancedRef` giữ nguyên để chống nhảy đôi.
- Tab bị ẩn khi đang phát → `pause()`; quay lại → `play()` nếu trước đó đang phát.

### 4.3 INTRO MỚI — `SlideIntroCinematic` (SVG + Web Audio, ~14 giây)

Mục tiêu: một "trailer khoa học" tự dựng, đẹp, có tiếng, tự chuyển slide khi kết thúc.

**Nền tảng kỹ thuật**

- Một `<svg viewBox="0 0 1920 1080">` phủ toàn khung, `preserveAspectRatio="xMidYMid slice"` cho nền và `meet` cho nhân vật chính.
- **Đồng hồ cảnh duy nhất** (`useTimeline` dựa `performance.now()` + rAF) điều khiển mọi thứ; âm thanh lập lịch bằng `audioCtx.currentTime` cùng gốc thời gian để đồng bộ.
- Hiển thị thanh tiến độ mảnh phía dưới, chữ phụ đề (caption) theo cảnh, nút **Tắt tiếng / Âm lượng / Phát lại / Bỏ qua** (≥44 px).

**Kịch bản (mốc thời gian, giây)**

| Thời gian | Cảnh hình | Âm thanh tổng hợp | Caption |
|---|---|---|---|
| 0,0–1,2 | Màn tối, lưới chấm mờ hiện; vòng tròn khí quyển vẽ dần bằng `stroke-dashoffset` | Drone thấp (2 sóng sine 55 Hz + 82,4 Hz, fade-in 1 s) | — |
| 1,2–3,5 | Phân tử **N₂** và **O₂** trôi vào (3D giả lập), tia lửa động cơ lóe ở giữa; N≡N rung rồi **đứt** | Whoosh (noise qua bandpass quét 400→2400 Hz), "crack" ngắn khi đứt liên kết | "Nhiệt độ > 1200 °C: N₂ + O₂ → 2NO" |
| 3,5–6,0 | NO đổi màu sang nâu đỏ khi nhận O₂ → **NO₂**; mũi tên số oxi hóa N: 0 → +2 → +4 chạy chữ số | Riser tăng dần (sawtooth lọc low-pass, 200→900 Hz) | "2NO + O₂ → 2NO₂" |
| 6,0–9,0 | Mây hình thành (3 lớp radial gradient trôi), **giọt nước** hấp thụ NO₂, đổi màu cyan→lime; xuất hiện **HNO₃** | Mưa nhẹ (noise trắng qua highpass 3 kHz, gain 0,06), bong bóng "pop" | "4NO₂ + O₂ + 2H₂O → 4HNO₃" |
| 9,0–12,0 | Mưa rơi xuống hồ, rừng, tượng đá vôi; thang pH ở góc tụt từ 5,6 xuống 4,4 bằng `CountUp` | Sấm xa (noise lowpass 120 Hz, envelope 1,2 s) rồi mưa mạnh dần | "Mưa axit: pH < 5,6" |
| 12,0–14,0 | Logo bài, tiêu đề **"Mưa axit & oxide của nitrogen"** hiện theo từng chữ; tên nhóm | Chime hợp âm (C5–E5–G5, sine, decay 1,8 s) | Tên bài |
| 14,0 | Cross-fade 500 ms rồi `advanceOnce()` sang slide 3 | Fade-out âm thanh 500 ms | — |

**Yêu cầu chất lượng**

- Phân tử dùng `Atom` 3D giả lập (mục 6.2), không dùng hình tròn phẳng.
- Có `Skip` hiện sau 1,5 s và luôn có phím `Esc` hoặc `S` để bỏ qua.
- Ở `reduced`: bỏ chuyển động, hiện từng "poster" 2 giây (5 khung) và vẫn tự chuyển; âm thanh chỉ bật nếu người dùng đã mở.
- Nếu `AudioContext` bị chặn: chạy hình không tiếng và hiện nút "Bật tiếng" nổi bật (đã có mẫu UI trong `SlideIntroVideo`).

### 4.4 Chế độ video tùy chọn (`INTRO_MODE = 'video'`)

- Giữ `SlideIntroVideo` hiện tại làm lớp UI, nhưng:
  - Đổi mọi chuỗi "Slide 03" thành giá trị lấy từ `config/slides.js` (sửa T3).
  - Thêm thanh tiến độ, `Replay`, thanh âm lượng 0–100 (lưu `sessionStorage`).
  - Hỗ trợ `public/intro.vtt` (phụ đề) nếu tồn tại.
  - Fade-in âm thanh 300 ms bằng `GainNode` qua `createMediaElementSource` **chỉ khi** nguồn cùng origin (tránh lỗi CORS).
- Nếu `INTRO_MODE === 'video'` và file không tồn tại → tự rơi về `cinematic` thay vì hiện lỗi.

### 4.5 Hệ âm thanh toàn app (`AudioEngine`)

- **Tạo `AudioContext` lười** trong thao tác người dùng đầu tiên; `resume()` khi `visibilitychange` quay lại.
- `masterGain` mặc định 0,35; `sfxEnabled` mặc định **bật sau khi người dùng bấm Bắt đầu**, lưu `localStorage` an toàn (try/catch).
- Bộ SFX tổng hợp (mỗi cái ≤ 400 ms, ≤ −12 dBFS):

| Tên | Dùng cho | Công thức gợi ý |
|---|---|---|
| `tick` | Chuyển slide, chọn tab | square 1,2 kHz, 25 ms, envelope nhanh |
| `whoosh` | Hạt/đường dẫn chạy, đổi cảnh | noise + bandpass quét 300→2500 Hz, 280 ms |
| `pop` | Bong bóng, giọt hình thành | sine 520→220 Hz, 90 ms |
| `spark` | Tia lửa động cơ (slide 9) | noise burst highpass 4 kHz, 60 ms |
| `chime(ok)` | Quiz đúng, hoàn thành bước | sine C5+G5, decay 600 ms |
| `buzz(err)` | Quiz sai | triangle 160 Hz, 220 ms |
| `rainLoop` | Nền mưa nhẹ ở các slide mưa | noise highpass 3 kHz, gain 0,03; **dừng khi rời slide** |
| `riser` | Cao trào (intro, SCR bật) | sawtooth lowpass quét lên, 1,2 s |

- **Dock mới (mục 9.4)** thêm nút loa: bấm bật/tắt SFX, nhấn giữ hoặc menu nhỏ để chỉnh âm lượng. Hiển thị trạng thái rõ (icon + `aria-pressed`).
- Mọi SFX bị bỏ qua khi `sfxEnabled=false` hoặc `AudioContext.state !== 'running'`; không ném lỗi.
- **Không bao giờ** phát âm thanh tự động mà chưa có thao tác bật.

---

## 5. NÂNG CẤP TỪNG SLIDE (số = vị trí hiển thị; ngoặc = tên file)

Quy ước: **Auto** = chạy khi vào slide; **Loop** = lặp nền nhẹ; **Int** = phản hồi tương tác; **SFX** = âm thanh nhẹ.

**1 — Bìa (`Slide01Cover`)** — Hiện: 1 SVG, 3 class animate, chọn phân tử.
- Auto: giọt mưa khúc xạ rơi vào mặt hồ, tạo sóng tròn lan (3 vòng, `scale`+`opacity`); đường chân trời công nghiệp có khói bay lên (`smokeRise` lệch pha); chữ tiêu đề lộ từng dòng.
- Loop: mưa xiên 3 lớp tốc độ khác nhau (parallax), ánh chớp xa mỗi 9–12 s (opacity nền).
- Int: bộ chọn phân tử `NO / NO₂ / HNO₃` đổi mô hình 3D với chuyển hình (morph vị trí nguyên tử 400 ms).
- **CTA "Bắt đầu" (mục 4.2).** SFX: `tick` khi chọn; `riser` khi bấm Bắt đầu.

**2 — Intro** — mục 4.

**3 — Đội ngũ (`Slide03Team`)** — Hiện: 0 SVG, 3 state.
- Auto: 9 thẻ vào theo lưới với stagger 60 ms; vòng quỹ đạo quanh avatar xoay chậm; viền gradient chạy quanh thẻ đang chọn (conic-gradient xoay, chỉ `transform`).
- Int: chuyển Lưới ⇄ Hồ sơ bằng chuyển cảnh chia sẻ phần tử (FLIP với WAAPI). SFX: `tick`.

**4 — Đặt vấn đề (`Slide02Problem`)** — Hiện: SMIL 4 hạt.
- Auto: bản đồ phát tán Đô thị/Nhà máy → khí quyển → Hồ/Đất rừng/Di sản; đường dẫn vẽ dần, hạt chảy theo (giữ SMIL, thêm `begin` lệch, 3 màu theo loại khí).
- Loop: gió làm khói nghiêng; mây trôi. Điểm tác động **nhấp nháy tuần tự** theo thứ tự nguyên nhân → hệ quả. SFX: `whoosh` nhẹ khi hạt xuất phát (một lần).

**5 — Lộ trình (`Slide04Roadmap`)** — Hiện: 3 SVG tĩnh.
- Auto: 3 trụ cột nối bằng đường dẫn vẽ dần; biểu tượng phân tử mỗi trụ xuất hiện theo thứ tự; số "1, 2, 3" đếm lên.
- Loop: chấm sáng chạy dọc đường nối. SFX: `tick` mỗi trụ hiện.

**6 — Định nghĩa & thang pH (`Slide05Definition`)** — Hiện: 3 SVG tĩnh, dùng `PHScaleBar`.
- Auto: thanh pH 0–14 vẽ gradient từ trái sang phải; **kim chỉ** trượt đến 5,6 rồi dừng; nhãn "mưa tự nhiên" bật lên; sau đó kim trượt xuống 4,x ghi "mưa axit".
- Loop: giọt rơi vào hai cốc so sánh, màu chỉ thị đổi nhẹ. SFX: `pop` khi giọt chạm.

**7 — Nguồn NOₓ (`Slide06Sources`)** — Hiện: 2 SVG tĩnh.
- Auto: **mô hình 3D NO và NO₂** quay chậm (rotateY giả lập bằng dịch chuyển nguyên tử + thứ tự chồng lớp); bậc liên kết 2,5; góc 134° hiện bằng cung vẽ dần; 4 nhóm nguồn phát (giao thông, công nghiệp, nhiệt điện, tự nhiên như sét/đất) bật theo thứ tự với ống khói/ống xả phát hạt.
- Loop: hạt khí thoát ra theo gió. SFX: `tick`.

**8 — Bản đồ cơ chế (`Slide07MechanismMap`)** — Hiện: 2 `animateMotion`, 4 class.
- Auto: **hạt đánh dấu N** chạy qua 4 trạm; tại mỗi trạm: số oxi hóa đổi (0 → +2 → +4 → +5) bằng `CountUp`, phân tử đổi, vòng xung `pulseRing`; đường dẫn đã đi sáng dần và để lại vệt.
- Int: bấm một trạm → dừng hạt, phóng to chi tiết.
- Loop: hạt chạy lại sau 2 s. SFX: `pop` mỗi trạm, `chime` khi tới HNO₃.

**9 — Bước 1: NO (`Slide08Step1Combustion`)** — Hiện: xi-lanh, piston, nút nhiệt độ 25 °C / >1200 °C.
- Auto: chu trình 4 kỳ rút gọn (nạp → nén → nổ → xả) lặp 5 s; hạt N₂/O₂ vào qua van nạp; **tia lửa** `spark`; ở >1200 °C vùng cháy phát sáng và liên kết N≡N **rung rồi đứt**, ra 2NO rồi thoát van xả; nhiệt kế SVG tăng bằng `CountUp`.
- Int: nút nhiệt độ thường → hạt không phản ứng (đối chứng). SFX: `spark`, `whoosh`, `pop` khi tạo NO.
- Giữ nguyên phương trình và chú thích N≡N.

**10 — Bước 2: NO₂ (`Slide09Step2Oxidation`)** — Hiện: 1 SVG, 1 class.
- Auto: hai NO gặp O₂ (3D), **bảo toàn nguyên tử** bằng bảng đếm N/O hai bên bằng nhau; electron là hạt nhỏ chuyển từ N sang O dọc cung; màu khí đổi từ không màu → nâu đỏ (gradient mờ dần lan).
- Loop: khói nâu đỏ lơ lửng. SFX: `riser` ngắn rồi `pop`.

**11 — Bước 3: HNO₃ (`Slide10Step3NitricAcid`)** — Hiện: 1 SVG, 0 hiệu ứng.
- Auto: **giọt mây** phóng to ở giữa; NO₂ chui vào giọt; giai đoạn 1 `2NO₂ + H₂O → HNO₂ + HNO₃` và giai đoạn 2 `2HNO₂ + O₂ → 2HNO₃` hiện tuần tự bằng hai thanh tiến trình; tổng `4NO₂ + O₂ + 2H₂O → 4HNO₃` bật cuối cùng với viền lime.
- Int: nút "Giai đoạn 1 / 2 / Tổng" lọc hiển thị. SFX: `pop` mỗi giai đoạn, `chime` ở tổng.

**12 — Phân ly & lắng đọng (`Slide11DissociationDeposition`)** — Hiện: 1 SVG, 2 class.
- Auto: giọt mưa cắt lớp; HNO₃ **tách** thành H⁺ và NO₃⁻ (hai hạt rời hai hướng, điện tích hiển thị); rồi hai nhánh: **lắng đọng ướt** (mưa/sương/tuyết rơi xuống) và **lắng đọng khô** (hạt/khí bám lên bề mặt) chạy song song.
- Loop: ion trôi nhẹ. SFX: `pop`, `rainLoop` rất khẽ.

**13 — Tương tác pH (`Slide12InteractivePH`)** — Hiện: 3 cốc, mô phỏng đệm.
- Auto: ba cốc A/B/C rót vào lần lượt; mật độ H⁺ là số hạt **tỉ lệ theo hàm mũ** (pH 6,2 / 5,2 / 4,4) và hạt nhấp nháy; chỉ thị đổi màu.
- Int: hồ nền đá vôi `CaCO₃` vs granite `SiO₂` — nhỏ axit vào, đá vôi **sủi bọt CO₂** và pH hồi về, granite không đổi; đồ thị pH theo thời gian vẽ trực tiếp. SFX: `pop` mỗi giọt, `chime` khi đệm hiệu quả, `buzz` khi mất đệm.
- Giữ nguyên số liệu hiện có.

**14 — Tác động: Hồ (`Slide13ImpactLakes`)** — Hiện: 1 SVG tĩnh.
- Auto: mặt cắt hồ; mưa axit đổ xuống, **Al³⁺** giải phóng từ trầm tích (`Al(OH)₃ + 3H⁺ → Al³⁺ + 3H₂O`) bốc lên như bóng; cá/sinh vật nhỏ mờ dần theo chuỗi thức ăn (plankton → côn trùng → cá), mỗi mắt xích tắt có thứ tự.
- Loop: bọt khí nhẹ, nước dao động. SFX: `rainLoop` khẽ, `buzz` rất ngắn khi mắt xích mất.

**15 — Tác động: Đất & Rừng (`Slide14ImpactSoilForest`)** — Hiện: 1 SVG tĩnh.
- Auto: mặt cắt 3 tầng đất; H⁺ thấm xuống, **trao đổi cation** trên hạt keo âm: H⁺ gắn vào, **Ca²⁺, Mg²⁺, K⁺** bật ra và trôi xuống; lá cây ngả vàng dần.
- Loop: ion trôi theo nước ngầm. SFX: `tick` mỗi ion bật ra.

**16 — Tác động: Đá vôi (`Slide15ImpactLimestone`)** — Hiện: 1 SVG, 2 class.
- Auto: cột đá cổ điển **trước/sau** bằng thanh kéo tự chạy 0→100%; bề mặt mòn (mask động), bong bóng `CO₂↑` bay ra; mạng tinh thể `CaCO₃` hòa tan tạo `Ca(NO₃)₂`.
- Int: kéo thanh trước/sau. SFX: `pop` mỗi bọt, `whoosh` khi kéo.

**17 — Kim loại & Sức khỏe (`Slide16ImpactMetalsHealth`)** — Hiện: 2 SVG tĩnh.
- Auto: **ăn mòn điện hóa** thép: vùng anot (Fe → Fe²⁺ + 2e⁻) electron chạy dọc kim loại sang catot; gỉ lan dần. Bên phải hệ hô hấp: hạt PM₂.₅ **đi sâu** đến phế nang, khác với nước mưa loãng chạm da.
- Giữ cảnh báo đúng khoa học: nước mưa axit loãng không gây hại trực tiếp như tiền chất khí/bụi mịn. SFX: `tick`.

**18 — Case study (`Slide17CaseStudy`)** — Hiện: 1 SVG, 3 class, checklist.
- Auto: bản đồ lưu vực; điểm lấy mẫu **hiện ra theo thứ tự**, đường dẫn dòng chảy từ đầu nguồn xuống hồ; khi tick mỗi câu checklist thì điểm tương ứng sáng.
- SFX: `chime` khi tick xong một câu.

**19 — Giải pháp SCR (`Slide18Solutions`)** — Hiện: buồng SCR, nút bật/tắt.
- Auto (khi bật): khí thải NO + NH₃ vào buồng xúc tác, **tổ ong** sáng dần; sản phẩm N₂ + H₂O thoát sạch (hạt trong suốt), so sánh khói đục khi tắt; số ppm NOₓ giảm bằng `CountUp`.
- Phương trình `4NO + 4NH₃ + O₂ → 4N₂ + 6H₂O` hiện cùng lúc.
- SFX: `riser` khi bật, `chime` khi sạch.

**20 — Mini Quiz (`Slide19MiniQuiz`)** — Hiện: 0 SVG, 3 state.
- Auto: thanh tiến độ 5 câu; câu mới lộ bằng stagger; đúng → hạt xanh bắn nhẹ + `chime`; sai → rung ngang 200 ms + `buzz` và giải thích hiện ra.
- Kết quả: huy hiệu SVG vẽ dần theo điểm. Bảo đảm bàn phím (1–4 chọn đáp án) không đụng phím điều hướng toàn cục.

**21 — Kết luận (`Slide20Conclusion`)** — Hiện: 1 SVG, 1 class.
- Auto: **vòng tuần hoàn** N₂ → NO → NO₂ → HNO₃ → mưa → đất/nước, vẽ khép kín, hạt đi theo vòng liên tục; liên kết nguồn (U.S. EPA, USGS, Chemistry LibreTexts) hiện cuối.
- SFX: `chime` hợp âm khi vòng khép kín.

---

## 6. HỆ SVG THỐNG NHẤT

### 6.1 Dùng chung `SvgDefs`

Một `<svg width="0" height="0">` đặt ở `App` chứa `<defs>` dùng chung (id tiền tố `sx-`, tránh trùng id giữa các slide):

- `sx-atom-N`, `sx-atom-O`, `sx-atom-H`, `sx-atom-C`, `sx-atom-Ca`: `radialGradient` có điểm sáng lệch (`fx=35% fy=30%`) để tạo cảm giác khối.
- `sx-glow-cyan`, `sx-glow-lime`, `sx-glow-coral`: `filter` blur tĩnh.
- `sx-rain-drop`: `linearGradient` giọt mưa có độ trong suốt.
- `sx-noise`: `feTurbulence` nhỏ làm nền sương (render một lần, `opacity` 0,05).
- `sx-arrow`: `marker` mũi tên phản ứng.

### 6.2 Nguyên tử/Phân tử 3D giả lập

- Màu CPK để nhất quán khoa học: **N xanh dương (`#5B8CFF`)**, **O đỏ (`#FF5A5F`)**, **H trắng (`#F4F7FA`)**, **C xám đậm**, **Ca xanh lục**. Giữ viền cyan/lime/coral của app cho nhãn và glow, không dùng làm màu nguyên tử.
- Mỗi nguyên tử: một `<circle>` với gradient `sx-atom-*`, một bóng đổ elip mờ bên dưới, một điểm sáng nhỏ (specular).
- Liên kết: `<line>`/`<path>` bo tròn, độ dày theo bậc liên kết (ba/đôi/đơn); NO bậc 2,5 vẽ **hai nét + một nét đứt**.
- Quay giả lập 3D: dịch chuyển (x, y) và `scale` từng nguyên tử theo `cos/sin` của góc, **sắp lại thứ tự z** mỗi 6° — chỉ chạy ở `cinematic`; `balanced` dùng lắc nhẹ.
- Kích thước tham chiếu: NO d(N–O)=115 pm, NO₂ góc 134° d=119,7 pm (giữ đúng như notes).

### 6.3 Mẫu chuyển động tái sử dụng

| Mẫu | Cách làm | Thời lượng | Easing |
|---|---|---|---|
| Vẽ đường | `stroke-dasharray` + `stroke-dashoffset` về 0 | 600–1200 ms | `cubic-bezier(.16,1,.3,1)` |
| Hạt theo đường | SMIL `animateMotion` + `animate opacity` | 3–7 s, `begin` lệch | linear |
| Thở | `scale` 1→1,03→1 | 4–6 s | `ease-in-out` |
| Xung | vòng `scale` 0,85→1,4, `opacity` 0,75→0 | 2,6 s | `cubic-bezier(.22,1,.36,1)` |
| Lộ phần tử | `opacity` 0→1 + `translateY` 8→0 | 280 ms, stagger 40–60 ms | `cubic-bezier(.2,.8,.2,1)` |
| Chuyển số | `CountUp` rAF | 800–1500 ms | easeOutCubic |
| Rung lỗi | `translateX` ±6 px | 200 ms | steps |

### 6.4 Cổng chất lượng SVG (mọi SVG phải qua)

- Có `viewBox`, `role="img"`, `<title>` + `<desc>` (đã làm tốt ở slide 9, áp dụng cho tất cả).
- Không phụ thuộc kích thước pixel cố định; co giãn từ 360 px đến 1920 px không méo.
- Chữ trong SVG ≥ 11 px hiệu dụng trên điện thoại; chữ nhỏ hơn chuyển ra HTML.
- Tương phản chữ/nền ≥ 4,5:1.
- Không dùng màu làm kênh thông tin duy nhất (thêm nhãn/biểu tượng).
- Id duy nhất toàn app.

---

## 7. SỬA TECHNICAL DEBT ĐI KÈM (nhỏ, có kiểm chứng)

1. **T3/T4:** tạo `src/config/slides.js` là nguồn duy nhất `{ id, key, title, component, kind: 'cover'|'video'|'content'|'final' }`. `App.jsx`, `SlideShell`, `SpeakerNotesModal`, `SlideGridModal`, chuỗi "sang Slide NN" đều đọc từ đây. Xóa `currentSlide === 2/21` cứng.
2. **T7:** thêm `JetBrains Mono` vào `index.html` (weights 400;600) hoặc đổi `font-mono` sang font đã tải.
3. **T8:** bỏ `will-change` vĩnh viễn trên khung slide; chỉ đặt trong lúc chuyển cảnh (≤ 400 ms) rồi gỡ.
4. **T10/T11:** cập nhật `README.md` cho đúng thực tế (intro cần thao tác người dùng để có tiếng; mô tả intro mới; cách đổi `INTRO_MODE`). Chuyển `ANTIGRAVITY_MASTER_PROMPT_*.md` và `acid.md` vào `docs/archive/` kèm dòng "đã lỗi thời so với source".
5. Bảng phím đầy đủ nằm ở mục 12.2 (thêm `R`, `M`, `T`, `L`, `B/W`, `P`, `,`…); cập nhật README và tab Cài đặt cho khớp.
6. **T21/T22/T23/T24:** kiểm chứng và sửa nút Cỡ chữ (mục 10.4), xóa `TopNavBar.jsx` mồ côi, cập nhật `duration` và nội dung notes slide 2 (mục 12.3), đổi `xl:` → `lg:` (mục 10.4).

---

## 8. TRUY CẬP, MOBILE, HIỆU NĂNG

- Mọi nút ≥ 44×44 px; `aria-label`, `aria-pressed` đúng trạng thái.
- Phụ đề (caption) intro cho người không bật tiếng; thông tin âm thanh luôn có bản chữ.
- Không có hiệu ứng nhấp nháy > 3 lần/giây trong vùng lớn (an toàn động kinh quang nhạy). Ánh chớp chỉ là thay đổi `opacity` nền ≤ 12% với tần suất thấp.
- Mobile < 768 px: tự vào `balanced`, bỏ hạt phụ và xoay 3D, giữ cảnh chính; SVG co theo chiều rộng, nội dung cuộn dọc như hiện tại.
- Swipe không chuyển slide khi thao tác trong khung SVG có tương tác (đã có kiểm tra nút; bổ sung `data-no-swipe` cho vùng kéo thanh/slider).
- iOS: `playsInline`, không dựa `autoplay` thuộc tính; mọi `play()` gọi trong handler.
- Ma trận thiết bị, safe-area, fullscreen trên iPhone, chống kéo-để-làm-mới: xem mục 13.

---

## 9. LAYOUT SHELL MỚI — STAGE + SIDE PANEL + DOCK (KHÔNG CHE NỘI DUNG)

> Nguyên tắc vàng: **UI cố định chiếm chỗ (đẩy layout), không đè lên slide.** Chỉ những thứ tạm thời (toast, con trỏ laser, dock khi đang ở chế độ Trình chiếu) mới được phủ lên slide.
> Ghi chú về "sidebar": zip hiện **không có sidebar thật**. Thứ gần nhất là dock nổi `BottomControls` và hai modal Notes/Grid (xem T12–T13). Mục này tạo sidebar thật (Side Panel) và biến dock thành thanh chiếm chỗ. Nếu bạn có sidebar riêng chưa nằm trong zip, quy tắc ở đây vẫn áp dụng.

### 9.1 Cây DOM và hợp đồng thuộc tính

```text
<div id="app-root" data-layout="canvas|reflow" data-present="true|false"
     style="--dock-h:48px; --panel-w:0px; --sheet-h:0px">
  <main  data-stage>          ← FitStage + SlideTransitioner (mục 10, 11)
  <aside data-panel>          ← Side Panel: Kịch bản | Mục lục | Cài đặt
  <nav   data-dock>           ← Dock điều khiển (chiếm hàng riêng)
  <div   data-overlay-ok>     ← laser, toast, nút điều khiển intro (được phép phủ)
</div>
```

- Mọi lớp phủ cố định **không** nằm trong `data-overlay-ok` bị coi là lỗi bố cục (script kiểm ở mục 15.6).
- `TopNavBar.jsx` mồ côi: xóa sau khi `grep` xác nhận không có tham chiếu (T22).

### 9.2 Lưới CSS (desktop/tablet ngang)

```css
#app-root {
  display: grid;
  width: 100vw; height: 100dvh; overflow: hidden;
  grid-template-columns: minmax(0, 1fr) var(--panel-w);
  grid-template-rows:    minmax(0, 1fr) var(--dock-h);
  grid-template-areas: "stage panel" "dock dock";
  transition: grid-template-columns 280ms var(--ease-emphasized);
}
[data-stage] { grid-area: stage; position: relative; overflow: hidden; contain: layout paint; }
[data-panel] { grid-area: panel; overflow: hidden; min-width: 0; }
[data-dock]  { grid-area: dock; }
```

- Khi mở Side Panel, `--panel-w` đổi từ `0px` lên 340/400/460 px; **Stage tự co lại và canvas tự thu nhỏ theo** (mục 10) nên không phần nào của slide bị che.
- Chiều rộng panel: 340 px (≥1024), 400 px (≥1440), 460 px (≥1800); kéo thanh chia để đổi trong 300–560 px, lưu `localStorage`.
- Mặc định panel nằm bên **phải**; có tùy chọn ghim bên trái.
- Bao quanh `transition` bằng điều kiện `prefers-reduced-motion`/chế độ `reduced` (đổi tức thì).

### 9.3 Side Panel (sidebar thật) — 3 tab

| Tab | Phím | Nội dung |
|---|---|---|
| **Kịch bản** | `N` | Chương (section), người nói, thời lượng; ý chính; lời nói mẫu (thu gọn được, nút A−/A+); **hộp "Không được nói sai" nền đỏ nhạt**; **Câu chuyển tiếp** cỡ lớn, bấm để sao chép; ô "Slide kế tiếp" (tiêu đề + chip chương) |
| **Mục lục** | `G` | Danh sách dọc 21 slide nhóm theo chương, ô tìm theo tên, slide hiện tại được tô và tự cuộn vào giữa; bấm để nhảy; hiện người nói và thời lượng ước tính |
| **Cài đặt** | `,` | Chế độ chuyển động (3 mức), âm thanh (bật/tắt, âm lượng), chế độ Từng bước/Tự động, vị trí panel, cỡ chữ kịch bản, hẹn giờ mục tiêu |

- Dữ liệu Kịch bản lấy từ `slideNotes.js` hiện có (đã đủ `speaker, duration, section, keyPoints, script, safetyDoNotSay, transition`). Không viết lại nội dung.
- `Esc` đóng panel; `N`/`G` lần hai cũng đóng. Mở/đóng panel **không** làm slide chạy lại animation vào.
- Panel là `<aside role="complementary" aria-label="Kịch bản và mục lục">`, các tab dùng `role="tablist"`; focus không bị bẫy (đây là panel, không phải dialog).
- Desktop: lưới tổng quan `SlideGridModal` đổi thành `Shift+G` (giữ cho ai thích xem lưới lớn). Notes không còn là modal toàn màn hình trên desktop.

### 9.4 Dock mới — thanh chiếm hàng riêng, không còn viên nang nổi

Chiều cao: 48 px (desktop), 56 px (điện thoại dọc, đủ vùng chạm), 40 px (điện thoại ngang); cộng `env(safe-area-inset-bottom)`.

**Desktop:**

```text
[‹] [›]  ▕▔▔▔▔▔▔ thanh tiến độ 21 vạch theo màu chương ▔▔▔▔▔▏  09/21 · Bước 1: NO
                         ⏱ 02:41 / ~18:00   [Kịch bản][Mục lục][Laser][Loa][Chuyển động][Toàn màn hình][⋯]
```

**Điện thoại dọc:** `[‹]  [09/21 · tên slide ▾ (mở Mục lục)]  [›]  [Kịch bản]  [⋯]`. Các nút phụ (loa, chuyển động, toàn màn hình, cài đặt) nằm trong menu `⋯` dạng bottom sheet, mục ≥ 48 px.

- Thanh tiến độ: 21 vạch, màu theo chương; bấm hoặc kéo để nhảy; hover/giữ hiện tên slide. Thay thanh 2,5 px cố định hiện tại (khó bấm trên cảm ứng).
- Bỏ đệm cứng `pb-28 sm:pb-32` ở `SlideShell` (trả lại 112–128 px chiều cao hữu ích, T12). Khoảng đệm do `--dock-h`/`--sheet-h` quyết định.
- Mọi nút có `aria-label`, tooltip có phím tắt, trạng thái bật/tắt có `aria-pressed`.

### 9.5 Chế độ Trình chiếu (Present) — ẩn dock mà vẫn an toàn

- Vào Present khi: bấm nút **▶ Trình chiếu**, vào toàn màn hình (`F`), hoặc nhấn `P`. `data-present="true"`.
- Ở Present: `--dock-h: 0`, Side Panel đóng (người nói có thể mở lại). Dock trở thành lớp **phủ tạm thời** cao tối đa `min(56px, 6dvh)`, hiện khi **di chuột xuống 80 px cuối** hoặc chạm vào mép đáy (vùng chạm 24 px), tự ẩn sau 2,5 giây không thao tác; con trỏ chuột cũng ẩn sau 2,5 giây.
- Dock phủ tạm thời không được làm Stage đổi kích thước (tránh canvas giật khi di chuột). Bù lại: **Quy tắc vùng an toàn** — trong canvas 1280×720 (mục 10) mọi nội dung quan trọng nằm trong `y ∈ [24, 676]`; đáy 44 px là lề thiết kế để dock phủ lên không che chữ/SVG quan trọng.
- Thoát Present: `Esc` hoặc `F`; dock trở lại chiếm chỗ, Stage co lại mượt 280 ms.

### 9.6 Điện thoại: Side Panel thành Bottom Sheet **đẩy** nội dung

Lưới đổi thành 3 hàng: `stage | sheet | dock`, trong đó hàng `sheet` có chiều cao `--sheet-h` và nằm trong luồng nên **đẩy Stage lên**, không đè:

| Mức | `--sheet-h` | Dùng khi |
|---|---|---|
| Đóng | 0 | mặc định |
| Peek | 112 px | mở Kịch bản: thấy chương, người nói, thời lượng, 1 dòng ý chính + **câu chuyển tiếp** |
| Nửa | 45dvh | đọc ý chính và lời nói mẫu; Stage còn ~55% |
| Đầy | 80dvh | đọc toàn bộ; người dùng chủ động, có chip "Thu nhỏ"; đây là trường hợp **duy nhất** được che slide |

- Kéo tay nắm để đổi mức (snap có gia tốc), vuốt xuống để đóng; `Esc` hoặc nút Back của Android đóng sheet trước khi lùi slide (xem 12.9).
- Điện thoại ngang (chiều cao < 500 px): panel là cột bên phải rộng `min(40vw, 320px)`, dock 40 px.
- Menu `⋯` và Mục lục cũng là bottom sheet; đóng khi bấm nền.

---

## 10. CANVAS 16:9 VÀ CÁC CHẾ ĐỘ HIỂN THỊ (FITSTAGE)

### 10.1 Vấn đề cần giải (T14)

Slide hiện là dòng cuộn dọc với cỡ chữ theo breakpoint của **viewport**. Hậu quả: laptop 1366×768 hay máy chiếu 1024×768 phải cuộn giữa lúc nói, và cùng một slide trông khác nhau trên mỗi màn hình. Người thuyết trình cần **"thấy gì trên laptop thì khán giả thấy y như vậy"** (WYSIWYG).

### 10.2 Hai chế độ, tự chọn bằng `useLayoutMode()`

| Chế độ | Điều kiện | Cách hiển thị |
|---|---|---|
| **canvas** | `stageW ≥ 900` **và** tỉ lệ `stageW/stageH ≥ 1.2` **và** `scale ≥ 0.62` | Slide dựng trên canvas cố định **1280 px rộng**, thu/phóng bằng `transform: scale()`; không cuộn; letterbox giữa Stage |
| **reflow** | còn lại (điện thoại dọc, tablet dọc, cửa sổ hẹp, điện thoại ngang quá nhỏ) | Cột đơn, rộng 100%, cuộn dọc trong Stage như hiện tại; chiều cao bù bằng `--dock-h`/`--sheet-h` |

- Quyết định lại khi `resize`, `orientationchange`, và khi panel đổi `--panel-w` (dựa vào `ResizeObserver` của chính Stage, không dựa vào `window`).
- Chuyển giữa hai chế độ không remount slide đang chạy animation (chỉ đổi lớp bao).

### 10.3 `FitStage` — cách tính

```text
BASE_W = 1280;  BASE_H = 720
natural = chiều cao tự nhiên của slide đo ở bề rộng BASE_W (ResizeObserver trên nội dung)
H       = max(BASE_H, natural)
scale   = min(stageW / BASE_W, stageH / H, MAX_SCALE=3)
scale   = làm tròn bội 0.005
x       = (stageW - BASE_W*scale) / 2   (làm tròn px nguyên)
y       = (stageH - H*scale) / 2        (làm tròn px nguyên, ≥ 0)
canvas style: width: 1280px; min-height: 720px;
              transform: translate3d(x px, y px, 0) scale(scale); transform-origin: 0 0;
```

- Làm tròn để giảm mờ chữ ở tỉ lệ lẻ. Chỉ bật `will-change: transform` trong lúc đang resize/chuyển cảnh, rồi gỡ.
- Phần nền khí quyển (gradient, lưới chấm) vẽ **ngoài** canvas, phủ kín Stage nên letterbox không có dải đen.
- Slide có `natural > 1.35 × 720` → `console.warn` ở dev: "Slide N vượt khung 16:9, hãy rút gọn hoặc tách bước". Không cắt nội dung; vẫn thu nhỏ vừa khung.
- Chỉ **một** `FitStage` cho cả app; `SlideTransitioner` đặt hai lớp (slide cũ/mới) bên trong cùng hệ tọa độ canvas.

### 10.4 Ràng buộc trên slide hiện có

- `xl:` chỉ có 3 chỗ, `2xl:` không có (T24) → chuyển canvas rất khả thi. Gemini đổi 3 chỗ `xl:` thành `lg:` hoặc giá trị cố định để bố cục canvas giống nhau ở mọi màn hình.
- Trong canvas, các lớp `sm:/md:/lg:` đều đã kích hoạt (stage ≥ 900 px) nên slide luôn ở bố cục rộng; **cấm** thêm `max-w-*` ngoài `1280px` cho khung gốc slide.
- Slide có `min-h-full` + `justify-between` tiếp tục dùng: canvas có `min-height: 720px` nên nội dung giãn đúng khung.
- **Cỡ chữ tối thiểu (T20):** trong canvas, thân bài ≥ 16 px (`text-base`), chú thích ≥ 13 px. Thay toàn bộ `text-[10px]` (19) và `text-[11px]` (52) bằng `text-xs` hoặc lớn hơn; rà 207 chỗ `text-xs` và nâng lên `text-sm` nếu là nội dung chính (không chỉ nhãn).
- Chữ trong SVG: cỡ hiệu dụng ≥ 12 px ở scale 1.
- Phương trình hóa học và số liệu then chốt ≥ 20 px.
- **Cỡ chữ (T21):** nút "Cỡ chữ" hiện tại có khả năng không tác dụng (Tailwind dùng `rem`, theo `html`, trong khi `fontSize` đặt trên container). Gemini phải **kiểm chứng**, rồi: ở `reflow` điều khiển `html { font-size: calc(16px * var(--fs)) }`; ở `canvas` thay bằng nút **"Phóng Stage"** (tăng `MAX_SCALE`/zoom vào vùng nội dung) hoặc ẩn nút nếu không có nghĩa.

### 10.5 Chế độ reflow trên điện thoại

- Cột đơn, chữ tiêu đề `text-2xl`, lưới 2 cột đổi 1 cột; SVG rộng 100% (`h-auto`), chữ trong SVG ≥ 11 px hiệu dụng (nếu nhỏ hơn, chuyển ra HTML).
- Mỗi slide có **thanh tiêu đề dính** (sticky, 40 px): số slide + tên + chấm tiến độ; không đè nội dung (chiếm chỗ trong luồng).
- Vùng cuộn có `overscroll-behavior: contain` và `touch-action: pan-y` để cuộn dọc không bị vuốt ngang cướp (xem 11.5).
- Xoay màn hình: giữ vị trí cuộn tương đối, slide hiện tại không đổi.

---

## 11. CHUYỂN CẢNH MƯỢT (SLIDE TRANSITIONER)

### 11.1 Hiện trạng và mục tiêu (T15)

Hiện tại `key={currentSlide}` làm slide cũ biến mất ngay, slide mới chạy `translate 16px + fade 260 ms`. Không có hiệu ứng thoát, vuốt không đi theo ngón tay, giữ phím mũi tên thì animation vào chạy lại liên tục.

Mục tiêu: **không chớp, không nhảy**, hướng theo chiều điều hướng, 60 fps, không vỡ khi bấm liên tục, giữ nguyên âm thanh đang phát.

### 11.2 Kiến trúc

- Thay `key` bằng `SlideTransitioner`: trong cửa sổ chuyển cảnh, **hai lớp** `prev` và `current` cùng mount, xếp chồng `position:absolute; inset:0` bên trong canvas/khung reflow.
- Dùng **Web Animations API** (`element.animate`) để hủy/hoàn tất xác định. Không dùng `setTimeout` đoán thời gian.
- Sau khi kết thúc, unmount `prev` và gỡ `will-change`.
- Slide `current` chỉ **bắt đầu kịch bản cảnh** (mục 3.2) khi bước vào ~35% tiến trình enter (đủ thấy khung rồi mới chạy), SFX chuyển cảnh `tick` phát đồng thời.
- Slide `prev` bị `animation-play-state: paused` ngay khi bắt đầu thoát (tiết kiệm CPU, không "chạy sau lưng").
- **Tùy chọn nâng cao:** nếu `document.startViewTransition` tồn tại, có thể dùng riêng cho chuyển phần tử dùng chung (thẻ thành viên → hồ sơ ở slide 3). Không bắt buộc; WAAPI là đường chính vì hỗ trợ trình duyệt chưa đồng đều.

### 11.3 Bộ preset

| Preset | Dùng cho | Slide cũ (thoát) | Slide mới (vào) | Thời lượng |
|---|---|---|---|---|
| `slide` | Tiến/lùi liền kề | `translateX(0 → ∓5%)`, `opacity 1 → 0`, `scale 1 → .985` | `translateX(±5% → 0)`, `opacity 0 → 1`, `scale .985 → 1` | thoát 260 ms, vào 420 ms, chồng lấp 140 ms |
| `fade-through` | Nhảy xa (Mục lục/thanh tiến độ/Home/End) | `opacity 1 → 0` | `opacity 0 → 1` | 300 ms |
| `hero` | 1→2 và 20→21 | thoát mờ + `scale 1 → 1.03` | vào `scale .98 → 1` + mở `clip-path: inset(0 round 24px)` | 520 ms |
| `reduced` | Chế độ reduced | cross-fade | cross-fade | 160 ms |

- Easing: vào `cubic-bezier(.16,1,.3,1)`, thoát `cubic-bezier(.4,0,1,1)`.
- **Chỉ** animate `transform`, `opacity` (và `clip-path` cho preset hero). **Cấm** animate `filter: blur` toàn Stage.
- Nội dung bên trong slide mới lộ theo stagger 50 ms (`Reveal`), bắt đầu khi slide đạt ~60% enter.

### 11.4 An toàn khi bấm liên tục

- Có điều hướng mới khi đang chuyển cảnh → gọi `finish()` hai animation đang chạy (nhảy tới trạng thái cuối) rồi bắt đầu chuyển cảnh kế tiếp; **không** bỏ qua phím, **không** xếp hàng.
- Phím đang giữ (`event.repeat`) hoặc nhảy > 1 slide trong 200 ms → bỏ hiệu ứng (đổi tức thì) và chỉ chạy hiệu ứng vào cho slide cuối cùng.
- Không bao giờ để hai slide cùng phát SFX/âm thanh nền (`rainLoop` dừng khi slide thoát, phát lại ở slide mới nếu cần).

### 11.5 Vuốt đi theo ngón tay (điện thoại/tablet)

- Dùng Pointer Events trên Stage; `touch-action: pan-y` để cuộn dọc nguyên bản, vuốt ngang do app xử lý.
- **Khóa ý định:** chỉ khi di chuyển ≥ 10 px và `|dx| > |dy| × 1.4` mới coi là vuốt ngang; từ lúc đó slide hiện tại **đi theo ngón tay** (`translateX = dx`, mờ dần, có lực cản ở slide đầu/cuối), slide kế hiện ra phía sau.
- Thả tay: chuyển nếu `|dx| > 25%` bề rộng **hoặc** vận tốc > 0,5 px/ms; ngược lại bật về (spring 240 ms).
- Không bắt đầu vuốt khi chạm vào `button, input, select, [role=slider], [data-no-swipe], svg [data-draggable]`, trong modal/sheet, hay vùng cuộn ngang.
- Chế độ `reduced`: bỏ đi theo ngón tay, vuốt đủ ngưỡng thì cross-fade.

### 11.6 Khởi động nguội không chớp

- Dùng chung `SvgDefs` ở `App` (mục 6.1) để gradient/filter đã có sẵn trước khi slide mới vẽ.
- Nếu Gemini chuyển slide sang `React.lazy`, **phải** prefetch slide kế và slide trước lúc rảnh (`requestIdleCallback`), không hiện skeleton trong lúc trình chiếu. Với bundle hiện tại (chỉ react + lucide) nên **giữ import tĩnh** nếu tổng JS gzip < 600 KB.
- Phông chữ: thêm `font-display: swap` hoặc preload `Be Vietnam Pro` 500/700 để tránh nhảy chữ ở slide đầu.

---

## 12. TRẢI NGHIỆM THUYẾT TRÌNH (DỄ THUYẾT TRÌNH NHẤT)

### 12.1 Thứ tự ưu tiên

1) Thấy slide + đọc kịch bản **cùng lúc** (Side Panel/Bottom Sheet, mục 9).
2) Điều khiển không cần nhìn bàn phím: bút trình chiếu (clicker), phím bấm, chạm.
3) Biết mình đang ở đâu về thời gian.
4) Chỉ vào chỗ cần chỉ (laser), che màn hình khi cần (đen/trắng).
5) Không mất vị trí khi tải lại; vào thẳng slide cần.

### 12.2 Bảng phím đầy đủ (thay `App.jsx` hiện tại và README)

| Phím | Chức năng |
|---|---|
| `→` `PageDown` `Space` `Enter` `.` | Tiếp (build kế hoặc slide kế) |
| `←` `PageUp` `Backspace` | Lùi (build trước hoặc slide trước) |
| `Home` / `End` | Slide đầu / cuối |
| `1`–`9` rồi `Enter` | Nhập số slide để nhảy (bộ đệm 1,2 s, hiện chip số ở giữa đáy) |
| `N` | Mở/đóng tab Kịch bản |
| `G` / `Shift+G` | Tab Mục lục / lưới tổng quan |
| `,` | Tab Cài đặt |
| `P` | Vào/thoát chế độ Trình chiếu |
| `F` | Toàn màn hình |
| `H` | Ẩn/hiện dock |
| `T` | Bắt đầu/tạm dừng/đặt lại đồng hồ (nhấn giữ 1 s = đặt lại) |
| `L` / `Shift+L` | Laser / Spotlight (đèn rọi) |
| `B` / `W` | Màn hình đen / trắng; phím bất kỳ để quay lại |
| `M` | Tắt/bật tiếng |
| `R` | Phát lại cảnh của slide |
| `S` | Bỏ qua intro (chỉ ở slide 2) |
| `Esc` | Đóng panel/sheet/menu; thoát Present; tắt laser |

- Bút trình chiếu thường gửi `PageDown/PageUp`, `ArrowRight/Left`, `.` hoặc `b` (đen) — đều được hỗ trợ.
- Không bắt phím khi focus ở `input/textarea/select/button/[contenteditable]` hoặc khi có `role="dialog"` đang mở (giữ hành vi đã đúng hiện tại); **`Space/Enter` trên nút đang focus phải kích hoạt nút chứ không chuyển slide**.
- Phím số trong Mini Quiz (1–4 chọn đáp án) chỉ hoạt động khi focus nằm trong quiz; ở ngoài quiz là bộ nhập số slide.

### 12.3 Đồng hồ thuyết trình (T16, T23)

- Hiển thị trong dock: `đã trôi / tổng ước tính` (ví dụ `02:41 / ~18:00`) và ở tab Kịch bản: thời gian đã dùng cho slide hiện tại so với khung thời lượng.
- Ước tính lấy từ `duration` trong `slideNotes.js` (chuỗi như "40–60 giây"): parse hai số, lấy khoảng `[min, max]`; thiếu dữ liệu → 60 giây. Đổi `duration` sang trường số `{ minSec, maxSec }` trong `slideNotes.js` nếu tiện, **giữ** chuỗi hiển thị.
- Màu: xanh (< min), vàng (min–max), đỏ (> max). Tổng thể: so với mục tiêu người dùng đặt trong Cài đặt (mặc định = tổng ước tính).
- **Cập nhật nội dung slide 2:** sau khi có intro mới, đổi `duration` thành "15–20 giây" và sửa `keyPoints/script` cho khớp trailer SVG (hành trình khí thải → phản ứng → mây → mưa), không nhắc video cũ.
- Đồng hồ **không** tự chạy khi vào slide; chạy khi người dùng bấm `T` hoặc khi bấm "Bắt đầu" ở bìa (tùy chọn trong Cài đặt, mặc định bật).

### 12.4 Từng bước (builds) — cho người muốn tự điều nhịp

- Hai chế độ (nút trong Cài đặt, phím `Shift+P`): **Tự động** (mặc định theo yêu cầu: vào slide là cảnh tự chạy trọn vẹn) và **Từng bước** (mỗi lần `Space/→` lộ bước kế trong slide, hết bước mới sang slide).
- `useTimeline` nhận danh sách giai đoạn có nhãn: `[{ label, at, run }]`. Tự động: chạy lần lượt theo `at`. Từng bước: dừng ở ranh giới nhãn, chờ lệnh Tiếp.
- Số bước đề xuất (giai đoạn do kịch bản mục 5 đã chia sẵn): slide 5 (3: ba trụ), 9 (3: nạp–nén / nhiệt cao tạo NO / thoát NO), 10 (2), 11 (3: giai đoạn 1 / giai đoạn 2 / tổng), 12 (3), 13 (3), 14 (3: mưa / Al³⁺ / chuỗi thức ăn), 15 (3), 17 (2), 19 (3). Slide khác 0 bước.
- Dock hiện chấm bước `● ○ ○` bên cạnh số slide khi slide có bước. Lùi (`←`) lùi bước trước rồi mới lùi slide, và hiển thị **trạng thái cuối** của bước (không phát lại cảnh từ đầu).

### 12.5 Cửa sổ người trình bày (2 màn hình) — desktop

- Nút "Mở cửa sổ người trình bày" mở `window.open(location.pathname + '?presenter=1')`. Đồng bộ bằng `BroadcastChannel('acid-presenter')`: tin `state {slide, step, clock}` và lệnh `cmd {next|prev|goto|blank|laser}`.
- Cửa sổ khán giả = giao diện sạch, **Present + toàn màn hình**; cửa sổ người trình bày hiển thị: slide hiện tại (nhỏ), **xem trước slide kế** (kết xuất ở trạng thái tĩnh/`reduced`, `pointer-events: none`), Kịch bản đầy đủ, đồng hồ, nút điều khiển lớn.
- **Âm thanh chỉ phát ở cửa sổ khán giả**; cửa sổ người trình bày luôn tắt tiếng (`?presenter=1` ⇒ `AudioEngine` vô hiệu).
- Giới hạn trung thực: `BroadcastChannel` chỉ đồng bộ **cùng trình duyệt, cùng thiết bị**. Điều khiển từ điện thoại thật cần máy chủ/WebRTC → **ngoài phạm vi**; ghi rõ trong README.

### 12.6 Con trỏ laser và đèn rọi

- `L`: chấm đỏ (đường kính 14 px, đuôi mờ 160 ms) bám con trỏ, cập nhật bằng CSS custom properties (`--lx/--ly`) qua `requestAnimationFrame`, **không** re-render React. `Shift+L`: đèn rọi — làm tối 70% phần còn lại, chừa hình tròn ~180 px quanh con trỏ.
- Cảm ứng: bật bằng nút trên dock rồi **chạm/kéo** để chỉ; `pointer-events: none` để không chặn thao tác ở dưới; `Esc` tắt.
- Nằm trong `data-overlay-ok`.

### 12.7 Màn hình đen/trắng, ẩn con trỏ, giữ màn hình sáng

- `B`/`W`: phủ toàn Stage đen/trắng (fade 120 ms), tạm dừng animation và âm thanh nền; phím bất kỳ hoặc chạm để quay lại đúng trạng thái.
- Present: con trỏ chuột tự ẩn sau 2,5 s, hiện lại khi di chuột.
- **Wake Lock:** ở Present gọi `navigator.wakeLock.request('screen')` (kiểm tra hỗ trợ), nhả khi thoát Present hoặc tab ẩn, xin lại khi tab hiện. Hỏng thì bỏ qua êm, không báo lỗi.

### 12.8 Nhảy nhanh và định hướng

- Mục lục có ô tìm (gõ không dấu cũng khớp: "ket luan" ↔ "Kết luận", chuẩn hóa NFD bỏ dấu).
- Thanh tiến độ có **vạch chương** (từ trường `section`): "Mở đầu", "Cơ chế", "Tác động", "Giải pháp"…; tên chương hiện cạnh số slide.
- Nhập số + `Enter` nhảy tức thì (preset `fade-through`).

### 12.9 Ghi nhớ trạng thái và liên kết sâu (T17)

- Slide hiện tại đồng bộ **URL hash** `#13` bằng `history.replaceState`; mở `index.html#13` vào đúng slide; sự kiện `hashchange` điều hướng.
- Nút **Back** trình duyệt/Android: đóng sheet/panel/menu trước; nếu không còn gì mở, lùi một slide (dùng `pushState` có kiểm soát, ví dụ chỉ đẩy khi người dùng điều hướng chủ động, tối đa 50 mục). Không tự thoát khỏi bài.
- `localStorage` (bọc `try/catch`) lưu: slide cuối, trạng thái/độ rộng panel, tab đang mở, chế độ chuyển động, âm lượng, chế độ Từng bước, mục tiêu thời gian. **Không** tự khôi phục slide 2 (intro) nếu chưa có thao tác người dùng — vào slide 3 hoặc bìa để bảo đảm có thao tác hợp lệ cho âm thanh.
- Tham số: `?start=13`, `?present=1`, `?mute=1`, `?mode=steps`.

### 12.10 Dùng trên điện thoại như một "remote"/người xem

- Điện thoại cầm tay xem bài: vuốt đi theo ngón tay (11.5), thanh tiến độ cảm ứng, bottom sheet Kịch bản kiểu Peek (có câu chuyển tiếp để đọc nhanh).
- Điện thoại là **thiết bị phát duy nhất** (cắm cáp ra máy chiếu): bật Present, cho phép xoay ngang; dock phủ tạm thời, vùng chạm mép đáy.
- Điều khiển slide của máy khác bằng điện thoại: ngoài phạm vi (xem 12.5).

---

## 13. RESPONSIVE ĐA THIẾT BỊ — MA TRẬN QUY TẮC

### 13.1 Ma trận

| Thiết bị / khung | Chế độ | Dock | Kịch bản | Ghi chú |
|---|---|---|---|---|
| ≥1440×800, desktop | canvas | 48 px chiếm chỗ | Side Panel phải 400 px | scale thường ≥ 1 |
| 1366×768, 1280×720 laptop | canvas | 48 px | panel 340 px; Stage co, canvas thu theo | không cuộn |
| 1024×768 (máy chiếu 4:3) | canvas | 48 px | panel 340 px khi mở; letterbox trên/dưới | scale ≈ 0,8 |
| 820×1180 tablet dọc | reflow | 56 px | bottom sheet | cột đơn, 2 cột nếu ≥ 768 |
| 1180×820 tablet ngang | canvas | 48 px | panel 340 px | như laptop |
| 844×390 điện thoại ngang | reflow (scale canvas < 0,62) | 40 px | panel 40vw | bố cục md |
| 390×844, 360×640, 320×568 | reflow | 56 px | bottom sheet | vùng chạm ≥ 48 px |
| Windows scale 125%/150% | theo viewport CSS | — | — | kiểm tra không tràn |

### 13.2 Kỹ thuật bắt buộc

- `index.html` (T18): `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` (giữ phóng to cho trợ năng), thêm `theme-color` `#050E17`, `apple-mobile-web-app-capable`, và `manifest.webmanifest` (`display: standalone`, `background_color: #050E17`, biểu tượng giọt nước).
- Dùng `100dvh`/`dvh`; đệm an toàn `env(safe-area-inset-*)` đưa vào `--dock-h` và `--sheet-h`; **không** dùng `100vh`.
- iPhone Safari không có Fullscreen API cho trang (T19): ẩn/vô hiệu nút Toàn màn hình khi `document.fullscreenEnabled === false`, hiện gợi ý "Chia sẻ → Thêm vào Màn hình chính để chạy toàn màn hình".
- Chặn kéo-để-làm-mới và cuộn nền: `overscroll-behavior: none` ở `body`, `contain` ở vùng cuộn của reflow.
- `@media (hover: none)`: không dựa vào hover (tooltip → bấm giữ hoặc nhãn hiện sẵn); mọi nút ≥ 44×44 px.
- Xoay màn hình: debounce 120 ms; giữ slide/bước; không phát lại cảnh.
- Bàn phím ảo (chưa có ô nhập nhưng nếu thêm sau): dùng `visualViewport` để co Stage.
- Chế độ chuyển động: điện thoại ≤ 768 px mặc định `balanced` (đã có ở mục 3.3), cho phép nâng lên `cinematic` thủ công.

### 13.3 Các lỗi bố cục phải bắt được

- Tràn ngang (`document.documentElement.scrollWidth > innerWidth`) ở bất kỳ viewport nào trong 13.1.
- Dock/Panel/Sheet chồng lên Stage (script mục 15.6).
- Chữ cắt/tràn ở tiêu đề dài tiếng Việt (có dấu) khi `fontScale`/zoom 150%.
- Phần tử tương tác < 44 px ở chế độ cảm ứng.

---

## 14. KẾ HOẠCH THỰC HIỆN THEO PHASE (mỗi phase phải qua cổng kiểm)

Thứ tự được chọn có chủ đích: **khung hiển thị trước, hiệu ứng sau.** Layout và canvas ảnh hưởng mọi slide, nên làm trước khi thêm animation để khỏi làm lại.

**Phase 0 — Baseline.** `npm install`, `npm run build`, `npm run dev`. Chụp ảnh 21 slide ở 1920×1080, 1366×768, 390×844; ghi lại slide nào đang tràn khung, slide nào có chữ nhỏ. *Cổng:* build xanh, console sạch, có bảng "slide tràn khung".

**Phase 1 — Layout shell.** Mục 9–10 và 13.2: lưới `#app-root`, `FitStage` + `useLayoutMode`, Side Panel (3 tab), Dock mới, Present mode, Bottom Sheet điện thoại, hash/localStorage (12.9), sửa `index.html` (T18), xóa đệm `pb-28`, xóa `TopNavBar`, đổi `xl:` → `lg:`. *Cổng:* mục 15.6 và 15.9 đạt; mở Kịch bản không che bất kỳ phần nào của slide.

**Phase 2 — Chuyển cảnh.** Mục 11: `SlideTransitioner` (WAAPI), preset, an toàn bấm liên tục, vuốt đi theo ngón tay. *Cổng:* mục 15.7 đạt.

**Phase 3 — Nền tảng chuyển động, âm thanh, intro.** Mục 3, 4, 6: `config/slides.js` (T3/T4), `MotionProvider`, `useTimeline` (có nhãn giai đoạn), `AudioEngine`, `SvgDefs/Atom/Molecule`; CTA ở bìa, `IntroMediaLayer`, `SlideIntroCinematic`, chuyển clip gốc ra `docs/_removed`. *Cổng:* mục 15.1 đạt.

**Phase 4 — Slide 1–8.** Mục 5. *Cổng:* mỗi slide tự chạy khi vào, có "Phát lại", dừng khi tab ẩn/mở panel.

**Phase 5 — Slide 9–21.** Mục 5, ưu tiên 9–13 rồi 14–17 rồi 18–21; khai báo giai đoạn cho chế độ Từng bước. *Cổng:* mục 15.2, 15.3.

**Phase 6 — Công cụ thuyết trình.** Mục 12: đồng hồ, Từng bước, cửa sổ người trình bày, laser/spotlight, đen/trắng, Wake Lock, bảng phím mới, sửa `slideNotes` slide 2. *Cổng:* mục 15.8 đạt.

**Phase 7 — Hiệu năng, truy cập, tài liệu.** Đo hiệu năng, sửa T7/T8/T10/T11/T21, cập nhật README + bảng phím, dọn file cũ vào `docs/archive/`. *Cổng:* mục 15.3, 15.4, 15.5, 15.9.

---

## 15. QA CHECKLIST — TICK THEO KẾT QUẢ THẬT

### 15.1 Intro / âm thanh
- [ ] Tải trang mới, bấm CTA "Bắt đầu" → intro chạy **có tiếng** ngay (Chrome, Edge, Firefox).
- [ ] Safari/iOS: có tiếng sau khi chạm CTA (nếu không có thiết bị, ghi rõ "chưa kiểm thử").
- [ ] Vào slide 2 bằng mũi tên/Mục lục/vuốt: có tiếng hoặc hiện overlay "chạm để bật tiếng", không im lặng bí ẩn.
- [ ] Kết thúc → tự sang slide 3 **đúng một lần**; bỏ qua cũng đúng một lần.
- [ ] Tắt tiếng/âm lượng/phát lại/bỏ qua hoạt động; lựa chọn được nhớ.
- [ ] Tab ẩn → âm thanh dừng; quay lại → tiếp tục hợp lý.
- [ ] Cửa sổ `?presenter=1` không phát âm thanh.
- [ ] Không còn clip "HentaiZ.Net" trong build mặc định.

### 15.2 Animation
- [ ] 20/20 slide nội dung (trừ intro) có chuyển động khi vào.
- [ ] Mỗi slide có "Phát lại cảnh" (nút + phím `R`).
- [ ] Mở/đóng Side Panel, Sheet **không** làm cảnh chạy lại; tab ẩn thì tạm dừng.
- [ ] Chế độ `reduced`: không chuyển động quá mức, nội dung vẫn đọc đủ.

### 15.3 Hiệu năng
- [ ] Chuyển slide không có frame > 50 ms (Performance panel), cả khi panel đang mở.
- [ ] Animation nền ≥ 55 fps ở 1080p laptop phổ thông; `balanced` ≥ 50 fps trên máy yếu.
- [ ] Mở/đóng panel (animation lưới 280 ms) không giật: canvas chỉ đổi `scale`, không reflow nội dung.
- [ ] Rò rỉ: chuyển qua lại 30 lần, số node DOM và listener không tăng.

### 15.4 Mobile
- [ ] 360×640, 390×844, 768×1024, 844×390: không tràn ngang, không che nút.
- [ ] Vuốt đi theo ngón tay đúng; kéo slider/thanh trước–sau/vuốt cuộn dọc **không** chuyển slide.

### 15.5 Mã nguồn và nội dung khoa học
- [ ] `npm run build` xanh; không cảnh báo mới; console sạch.
- [ ] Phương trình/số liệu giữ nguyên so với `slideNotes.js` và slide gốc.
- [ ] Id SVG duy nhất; mọi SVG có `title/desc`.

### 15.6 Không có gì che nội dung (kiểm bằng script)

Dán vào console ở từng viewport trong 13.1, cả khi panel mở và đóng, ở slide 1, 9, 13, 21:

```js
(() => {
  const stageEl = document.querySelector('[data-stage]');
  const stage = stageEl.getBoundingClientRect();
  const hits = [];
  document.querySelectorAll('body *').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' || cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return;
    if (cs.pointerEvents === 'none' || el.closest('[data-overlay-ok]')) return;
    const r = el.getBoundingClientRect();
    const w = Math.min(r.right, stage.right) - Math.max(r.left, stage.left);
    const h = Math.min(r.bottom, stage.bottom) - Math.max(r.top, stage.top);
    if (w > 1 && h > 1) hits.push({ tag: el.tagName, cls: String(el.className).slice(0, 60), w: Math.round(w), h: Math.round(h) });
  });
  // Nội dung slide (canvas) phải nằm trọn trong Stage ở chế độ canvas
  const canvas = document.querySelector('[data-canvas]');
  let canvasOk = true;
  if (canvas && document.getElementById('app-root').dataset.layout === 'canvas') {
    const c = canvas.getBoundingClientRect();
    canvasOk = c.left >= stage.left - 1 && c.right <= stage.right + 1 && c.top >= stage.top - 1 && c.bottom <= stage.bottom + 1;
  }
  const noHScroll = document.documentElement.scrollWidth <= window.innerWidth;
  console.table(hits);
  return { overlays: hits.length, canvasInsideStage: canvasOk, noHorizontalScroll: noHScroll,
           verdict: hits.length === 0 && canvasOk && noHScroll ? 'PASS' : 'FAIL' };
})();
```

Ngoại lệ hợp lệ: ở Present, dock tạm thời được phủ lên (nằm trong `data-overlay-ok`); Bottom Sheet mức Đầy (người dùng chủ động).

- [ ] PASS ở mọi viewport 13.1, panel đóng và mở.
- [ ] Ở Peek/Nửa trên điện thoại, nút cuối của slide vẫn bấm được (cuộn tới được, không bị sheet che).

### 15.7 Chuyển cảnh
- [ ] Không có khung hình trống/chớp giữa hai slide (ghi hình 60 fps hoặc Performance panel).
- [ ] Giữ phím `→` chạy 10 slide liền: không giật, không phát animation vào lặp, dừng đúng slide cuối.
- [ ] Bấm `→` rồi `←` ngay lập tức: kết thúc ở đúng slide, không kẹt hai lớp.
- [ ] Nhảy bằng Mục lục dùng `fade-through`; tiến/lùi liền kề dùng `slide` đúng chiều.
- [ ] Vuốt trên điện thoại: slide đi theo ngón tay, thả sớm thì bật về, thả đủ ngưỡng thì chuyển.
- [ ] `reduced`: chỉ cross-fade 160 ms.

### 15.8 Công cụ thuyết trình
- [ ] `N` mở Kịch bản bằng panel; slide **không bị che**, co lại mượt; chữ trong canvas vẫn đọc được ở 1366×768.
- [ ] Đồng hồ: `T` chạy/dừng/đặt lại; màu xanh/vàng/đỏ đúng theo `duration`.
- [ ] Chế độ Từng bước: `→` lộ từng bước, hết bước mới sang slide; `←` lùi bước nhưng hiện trạng thái cuối.
- [ ] Cửa sổ người trình bày: đồng bộ slide/bước/đồng hồ hai chiều; xem trước slide kế hiển thị.
- [ ] Laser/Spotlight không chặn bấm nút phía dưới; `Esc` tắt.
- [ ] `B`/`W` che và hoàn tác đúng; Wake Lock không làm hỏng khi không được hỗ trợ.
- [ ] Tải lại trang giữ đúng slide; `#13` vào slide 13; Back đóng sheet trước khi lùi slide.
- [ ] Bút trình chiếu (PageDown/PageUp/`.`/`b`) điều khiển đúng.

### 15.9 Responsive và khả năng đọc
- [ ] Mọi slide ở canvas 1366×768 **không cuộn**; slide vượt khung đã được rút gọn/tách bước.
- [ ] Không còn `text-[10px]`/`text-[11px]`; nội dung chính không dùng `text-xs`.
- [ ] iPhone: có `viewport-fit=cover`, dock không chạm thanh home; nút Toàn màn hình xử lý đúng (ẩn + gợi ý).
- [ ] Nút "Cỡ chữ/Phóng Stage" có tác dụng thật (đã kiểm chứng T21) hoặc đã gỡ.
- [ ] Zoom trình duyệt 150%: không tràn ngang, nút vẫn bấm được.

---

## 16. FORMAT BÁO CÁO CUỐI CỦA AGENT

Agent phải báo cáo theo mẫu, **không đánh dấu hoàn thành những gì chưa chạy thật**:

```text
## Đã làm
- (liệt kê theo phase)

## Files changed
- (đường dẫn + mục đích)

## Verification (kết quả thật)
- npm run build: PASS/FAIL (dán dòng cuối)
- Script mục 15.6: PASS/FAIL ở từng viewport (liệt kê)
- Trình duyệt đã test: ...
- Viewport đã test: ...
- Intro có tiếng: PASS/FAIL (trình duyệt nào)
- Chuyển cảnh: kết quả 15.7
- Hiệu năng: số liệu fps/frame dài nhất đo được

## Chưa kiểm thử / Hạn chế
- (ví dụ: Safari iOS thật chưa có thiết bị; điều khiển bằng điện thoại ngoài phạm vi)

## Việc người dùng cần làm
- (ví dụ: nếu muốn INTRO_MODE='video' thì đặt video của mình vào public/intro.mp4)
```

---

## 17. PROMPT DÁN VÀO GEMINI

> Tên file spec dùng trong các prompt: `GEMINI_FULL_SPEC_ACID_V4.md` (đặt ở thư mục gốc dự án).

### 17.1 PROMPT MỞ ĐẦU — làm trọn gói (dán một lần)

```text
Bạn là kỹ sư front-end + motion designer + chuyên gia trải nghiệm trình chiếu. Hãy đọc kỹ file GEMINI_FULL_SPEC_ACID_V4.md ở thư mục gốc dự án rồi thực thi đầy đủ, theo đúng thứ tự phase ở mục 14.

Bối cảnh: React 18 + Vite 6 + Tailwind 3 (bài thuyết trình 21 slide về mưa axit và oxide của nitrogen). Giữ nguyên nền tảng, KHÔNG thêm thư viện animation; dùng CSS, SMIL, Web Animations API, rAF và Web Audio.

Mục tiêu theo thứ tự ưu tiên:
1) KHÔNG CÓ GÌ CHE NỘI DUNG: dựng lưới #app-root (Stage + Side Panel + Dock) theo mục 9; Kịch bản/Mục lục là sidebar đẩy layout (desktop) và bottom sheet đẩy nội dung (điện thoại), không phải modal đè. Bỏ đệm cứng pb-28.
2) Canvas 16:9 (FitStage, 1280 px, scale tự động) cho desktop/máy chiếu và chế độ reflow cho điện thoại dọc, theo mục 10 và 13. Slide không cuộn ở canvas.
3) Chuyển cảnh mượt bằng SlideTransitioner (WAAPI) có hiệu ứng thoát + vào, an toàn khi bấm liên tục, vuốt đi theo ngón tay, theo mục 11.
4) Công cụ thuyết trình: đồng hồ, Từng bước, cửa sổ người trình bày, laser/spotlight, màn hình đen/trắng, Wake Lock, hash URL + lưu trạng thái, bảng phím mới, theo mục 12.
5) Intro có tiếng: nút "Bắt đầu" ở bìa (gesture-first), intro mới bằng SVG + Web Audio theo mục 4.3. public/intro.mp4 hiện là clip quảng cáo của trang ngoài (logo HentaiZ.Net) nên KHÔNG dùng làm intro mặc định; giữ mp4 là tùy chọn qua src/config/media.js.
6) Animation SVG tự chạy khi vào cho cả slide nội dung theo mục 5 + hệ SvgDefs/Atom/Molecule/Particles/FlowPath mục 6; hệ âm thanh nhẹ mục 4.5; ba chế độ chuyển động mục 3.3.
7) Sửa technical debt T1–T24 ở mục 1.5 và 7.

Quy tắc bắt buộc:
- Giữ nội dung khoa học (phương trình, số liệu, notes). Không đổi khi chưa đối chiếu slideNotes.js.
- Không viết lại phần điều hướng/phím đã đúng (mục 1.2); mọi thay đổi phải truy được về yêu cầu.
- Chỉ animate transform/opacity/stroke-dashoffset (và clip-path cho preset hero). Không animate blur/box-shadow/width/height. Tuân ngân sách mục 3.4.
- Hợp đồng DOM: data-stage, data-panel, data-dock, data-canvas, data-overlay-ok (mục 9.1). UI cố định không nằm trong data-overlay-ok mà đè lên Stage là LỖI.
- Mọi SVG có viewBox, title, desc; id duy nhất; nút >= 44px; aria đầy đủ; chữ nội dung >= 16px ở canvas.
- Làm lần lượt từng phase, qua cổng kiểm của phase đó rồi mới sang phase sau.
- Phải chạy npm install, npm run build và test thật trong trình duyệt (desktop + viewport điện thoại), chạy script ở mục 15.6 ở từng viewport. Không được báo "xong" cho thứ chưa chạy; ghi rõ cái gì chưa kiểm thử.
- Cuối cùng báo cáo theo mẫu mục 16.

Bắt đầu bằng Phase 0 và đưa ra kế hoạch ngắn trước khi sửa code.
```

### 17.2 PROMPT RIÊNG — chỉ Layout + Sidebar + Chuyển cảnh + Responsive (khuyến nghị làm đầu tiên)

```text
Đọc mục 1.5 (T12–T24), 9, 10, 11, 13 và 15.6–15.9 trong GEMINI_FULL_SPEC_ACID_V4.md. Chỉ làm: (a) lưới #app-root với Stage + Side Panel (tab Kịch bản/Mục lục/Cài đặt) + Dock chiếm hàng riêng, Present mode ẩn dock tự động; (b) Bottom Sheet đẩy nội dung trên điện thoại (Peek/Nửa/Đầy); (c) FitStage canvas 1280px + reflow cho điện thoại, bỏ pb-28, sửa viewport-fit=cover, đổi xl: thành lg:, nâng chữ nhỏ; (d) SlideTransitioner WAAPI (slide/fade-through/hero/reduced), bấm liên tục an toàn, vuốt đi theo ngón tay; (e) hash URL + lưu trạng thái. Không động vào nội dung khoa học. Chạy npm run build, chạy script 15.6 ở các viewport 1920x1080, 1366x768, 1024x768, 820x1180, 844x390, 390x844, 360x640 với panel đóng/mở và báo kết quả thật.
```

### 17.3 PROMPT NGẮN — chỉ intro có tiếng

```text
Đọc mục 1.3, 4 và 15.1 trong GEMINI_FULL_SPEC_ACID_V4.md. Chỉ làm phần intro: CTA "Bắt đầu (có âm thanh)" ở Slide01Cover gọi unlock audio + goToSlide(2) trong cùng handler; IntroMediaLayer bền vững ở App; SlideIntroCinematic (SVG + Web Audio, ~14 s, tự sang slide 3, có Tắt tiếng/Âm lượng/Phát lại/Bỏ qua, caption); src/config/media.js với INTRO_MODE; chuyển public/intro.mp4 hiện tại ra docs/_removed. Chạy npm run build và test trình duyệt thật rồi báo cáo theo mục 16.
```

### 17.4 PROMPT THEO PHASE (khi agent quá tải)

**Phase 0 — Baseline**
```text
Làm Phase 0 trong GEMINI_FULL_SPEC_ACID_V4.md: npm install, npm run build, npm run dev; chụp 21 slide ở 1920x1080, 1366x768, 390x844; lập bảng slide nào tràn khung 16:9 và slide nào có chữ nhỏ (<14px). Chưa sửa code. Báo kết quả thật.
```

**Phase 1 — Layout shell**
```text
Làm Phase 1 (mục 9, 10, 13.2): lưới #app-root, FitStage + useLayoutMode, Side Panel 3 tab, Dock mới, Present mode, Bottom Sheet điện thoại, hash/localStorage, sửa index.html, xóa pb-28 và TopNavBar, đổi xl: thành lg:. Chạy script mục 15.6 ở mọi viewport 13.1; phải PASS trước khi sang phase sau.
```

**Phase 2 — Chuyển cảnh**
```text
Làm Phase 2 (mục 11): SlideTransitioner bằng WAAPI, preset slide/fade-through/hero/reduced, finish() khi bấm liên tục, bỏ hiệu ứng khi giữ phím, vuốt đi theo ngón tay với khóa ý định. Kiểm theo mục 15.7 và đo frame dài nhất.
```

**Phase 3 — Nền tảng + Intro**
```text
Làm Phase 3: config/slides.js (nguồn duy nhất, bỏ hard-code 2/21/"Slide 03"), MotionProvider ba chế độ, useTimeline có nhãn giai đoạn, AudioEngine/sfx, SvgDefs/Atom/Molecule; CTA ở bìa, IntroMediaLayer, SlideIntroCinematic theo mục 4.3, chuyển clip gốc ra docs/_removed. Kiểm theo mục 15.1.
```

**Phase 4 — Slide 1–8**
```text
Làm Phase 4: nâng cấp animation SVG tự chạy cho slide 1–8 theo mục 5, dùng SvgDefs/Atom/Molecule chung, thêm "Phát lại cảnh" + phím R, tạm dừng khi tab ẩn/panel mở. Giữ nội dung khoa học. Build và test từng slide ở 1366x768 và 390x844; chạy lại script 15.6.
```

**Phase 5 — Slide 9–21**
```text
Làm Phase 5: nâng cấp slide 9–21 theo mục 5 (ưu tiên 9–13, rồi 14–17, rồi 18–21), khai báo các giai đoạn có nhãn để chế độ Từng bước dùng được, SFX theo mục 4.5. Không đổi phương trình/số liệu. Build, đo hiệu năng mục 3.4, test mobile.
```

**Phase 6 — Công cụ thuyết trình**
```text
Làm Phase 6 (mục 12): đồng hồ + ước tính từ duration, chế độ Từng bước, cửa sổ người trình bày (BroadcastChannel, xem trước slide kế, âm thanh chỉ ở cửa sổ khán giả), laser/spotlight, B/W, Wake Lock, bảng phím mới, sửa slideNotes slide 2 (15–20 giây, mô tả trailer SVG). Kiểm theo mục 15.8.
```

**Phase 7 — Hoàn thiện**
```text
Làm Phase 7: đo hiệu năng (không frame >50 ms, nền >=55 fps), sửa T7/T8/T10/T11/T21, kiểm accessibility (aria, tương phản, reduced-motion, zoom 150%), chạy toàn bộ QA mục 15, cập nhật README + bảng phím, chuyển ANTIGRAVITY_MASTER_PROMPT_*.md và acid.md vào docs/archive/, báo cáo cuối theo mục 16 và liệt kê rõ phần chưa kiểm thử.
```

---

## 18. GHI CHÚ CUỐI

- **Về `intro.mp4`:** nếu muốn dùng video riêng, đặt vào `public/intro.mp4` và đặt `INTRO_MODE = 'video'`. Nên dùng H.264 + AAC, 1280×720 hoặc 1920×1080, ≤ 15 giây, âm lượng khoảng −16 LUFS, và **chỉ dùng hình/nhạc bạn có quyền sử dụng**.
- **Về "tự bật tiếng":** không trình duyệt nào cho bật tiếng khi chưa có thao tác người dùng. Cách tốt nhất là nút "Bắt đầu" ở bìa (mục 4.2).
- **Về điều khiển từ điện thoại sang máy tính:** cần máy chủ hoặc WebRTC, ngoài phạm vi bản này. Đồng bộ hai cửa sổ cùng máy (mục 12.5) đã có.
- **Về thư viện:** nếu Gemini đề xuất GSAP/framer-motion, yêu cầu nêu lý do, chi phí bundle và chứng minh CSS/SMIL/WAAPI không làm được; mặc định từ chối.
- **Điều chưa được kiểm chứng:** việc nút "Cỡ chữ" hiện không tác dụng (T21) là suy luận từ cách Tailwind dùng `rem`; Gemini cần chạy thử để xác nhận trước khi sửa.
