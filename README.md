# BÀI THUYẾT TRÌNH KHOA HỌC: MƯA AXIT VÀ SỰ HÌNH THÀNH DO OXIDE CỦA NITROGEN (NOₓ)
### Phiên bản Nâng cấp v4.0 — Zero-Overlap Grid Architecture & Vector Cinematic Edition

Một ứng dụng trình chiếu web tương tác cao cấp gồm **21 slide** (20 slide nội dung theo chuẩn Storyboard Khoa học + 1 slide Intro Trailer Vector Điện Ảnh), được thiết kế theo phong cách **Atmosphere Lab / Science in Motion (Ultra 3D Vector Edition)**, tương thích mượt mà trên cả **máy tính/máy chiếu (16:9 WYSIWYG)** và **điện thoại di động (Touch Swipe & Responsive Reflow)**.

---

## 🌟 ĐIỂM NỔI BẬT TRONG PHIÊN BẢN v4.0

1. **Khung giao diện Không che nội dung (Zero-Overlap Shell):**
   * Lưới `#app-root` (CSS Grid) chia thành các khoang riêng biệt: `[data-stage]`, `[data-panel]`, và `[data-dock]`.
   * **Side Panel thật** với 3 tab: **Kịch bản (`N`)**, **Mục lục (`G`)**, **Cài đặt (`,`)** nằm trong luồng bố cục. Khi mở panel, Stage tự động co lại và canvas 16:9 thu nhỏ theo mà **không đè lên slide**.
   * **Dock điều khiển** chiếm hàng riêng ở đáy, loại bỏ hoàn toàn đệm cứng thừa thãi (`pb-28`), trả lại tối đa không gian hiển thị cho bài giảng.

2. **Khung chiếu 16:9 WYSIWYG (`FitStage`):**
   * Cố định hệ tọa độ chuẩn 1280×720px tự động co giãn theo tỷ lệ màn hình (laptop, máy chiếu, desktop), đảm bảo người thuyết trình thấy gì thì khán giả thấy y như vậy.
   * Tự động phát hiện và chuyển sang chế độ `reflow` cho điện thoại di động dọc hoặc màn hình hẹp.

3. **Chuyển cảnh mượt mà bằng Web Animations API (`SlideTransitioner`):**
   * Chuyển cảnh hai lớp đồng thời bằng WAAPI với hiệu ứng vào (enter) và thoát (exit).
   * Khử giật, chống vỡ animation khi bấm phím liên tục nhờ cơ chế `finish()` tức thì.
   * Vuốt cảm ứng bám theo ngón tay trên điện thoại di động với bộ lọc khóa ý định vuốt.

4. **Âm thanh & Intro Khoa học Đích thực (Cinematic Science Intro):**
   * **Slide 02:** Mặc định sử dụng **Intro Điện ảnh Vector SVG + Web Audio (~14s)** tự động diễn giải chuỗi phản ứng từ nhiệt độ động cơ phá vỡ $N_2$ đến giọt mưa axit $HNO_3$ rơi xuống bề mặt Trái Đất.
   * **Tùy chọn Video MP4:** Cấu hình dễ dàng qua `src/config/media.js` (`INTRO_MODE = 'video'`).
   * **Gesture-First Audio Unlock:** Nút "▶ Bắt đầu trình chiếu (có âm thanh)" tại Slide 01 giúp mở khóa âm thanh trình duyệt an toàn và hợp chuẩn.
   * Bộ tổng hợp hiệu ứng âm thanh nhẹ (`AudioEngine`) bằng Web Audio API thuần (tick, pop, whoosh, spark, chime, buzz, rainLoop).

5. **Bộ công cụ Thuyết trình Toàn diện (Presenter Toolkit):**
   * Đồng hồ bấm giờ thông minh đối soát với thời lượng dự kiến.
   * Màn hình Đen (`B`) / Màn hình Trắng (`W`) để tập trung sự chú ý.
   * Cửa sổ tổng quan lưới 21 slide (`Shift+G`).
   * Lưu trạng thái điều hướng qua URL hash (`#13`) và `localStorage`.

---

## ⌨️ BẢNG PHÍM TẮT ĐIỀU KHIỂN

| Phím tắt | Chức năng |
|---|---|
| `→` / `Space` / `PageDown` | Chuyển sang slide tiếp theo |
| `←` / `PageUp` | Quay lại slide trước đó |
| `Home` / `End` | Nhảy về Slide đầu tiên (Bìa) / Slide cuối cùng (Tổng kết) |
| `N` | Mở / Đóng tab **Kịch bản thuyết trình** |
| `G` | Mở / Đóng tab **Mục lục bài giảng** |
| `Shift + G` | Mở **Lưới tổng quan 21 Slide** toàn màn hình |
| `,` (Dấu phẩy) | Mở tab **Cài đặt** (Chế độ chuyển động, Âm lượng) |
| `P` / `F` | Bật / Tắt chế độ **Trình chiếu** (Present Mode / Fullscreen) |
| `B` / `W` | Màn hình **Đen** (Blackout) / Màn hình **Trắng** (Whiteout) |
| `Esc` | Đóng Side Panel, thoát Trình chiếu hoặc tắt màn hình đen |

---

## 🛠 HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

```bash
# 1. Cài đặt thư viện
npm install

# 2. Chạy máy chủ phát triển (Development Server)
npm run dev

# 3. Chạy mở cổng mạng LAN để xem trên điện thoại
npm run dev -- --host

# 4. Đóng gói bản chính thức (Production Build)
npm run build
```

---

## 👥 CÁCH ĐỔI TÊN 9 THÀNH VIÊN NHÓM

Mở file [`src/data/teamMembers.js`](src/data/teamMembers.js) và chỉnh sửa thông tin lớp, ngày thuyết trình cùng họ tên 9 thành viên trong mảng `teamMembers`. Toàn bộ Slide 01, Slide 03, Slide 21 và hộp kịch bản thuyết trình sẽ tự động cập nhật đồng bộ.

## Hệ bố cục tự động (v2)

| Thành phần | Việc làm |
|---|---|
| `src/hooks/useLayoutMode.js` | Chọn `canvas` (ngang/vuông) hoặc `reflow` (dọc/hẹp) theo kích thước **cửa sổ**, có vùng đệm 0.95–1.05 chống chớp; trả thêm `device` (phone/tablet/desktop), `orientation`, `isTouch`. Đo lại sau khi xoay màn hình (120ms, 360ms). |
| `src/utils/stageGeometry.js` | Hình học canvas (hàm thuần, test được): nới canvas theo chiều ngang (≤1920) **và chiều dọc (≤900)** để màn 16:10 / 4:3 không còn dải đen; slide dài thì co tới ngưỡng đọc được rồi mới cuộn. |
| `src/components/FitStage.jsx` | `ReflowStage`: cuộn về đầu khi đổi slide, vạch tiến độ cuộn, vệt mờ báo còn nội dung, gợi ý xoay ngang (nhớ trong phiên; Android có nút khóa ngang). |
| `src/styles/index.css` | Cỡ chữ lưu động của reflow (rem theo bề rộng), vùng an toàn `env(safe-area-inset-*)`, chống iOS tự phóng chữ khi xoay, bỏ hover dính trên cảm ứng. |
| `src/App.jsx` | Gắn `data-layout`/`data-device` lên `<html>`, `data-device`/`data-orient` lên `#app-root`; `--dock-h` đã cộng vùng an toàn đáy. |
