/**
 * Hình học canvas 16:9 — hàm thuần (không đụng DOM) để FitStage dùng và để test được.
 *
 * Ý tưởng "tự sắp xếp lại":
 *  - Chiều NGANG: màn rộng hơn 16:9 -> canvas logic rộng ra (tối đa MAX_FILL_W) cho đỡ trống 2 bên.
 *  - Chiều DỌC : màn "vuông" hơn 16:9 (laptop 16:10, iPad 4:3, cửa sổ trình duyệt cao) -> canvas logic
 *    cao ra (tối đa MAX_FILL_H) để các khối `justify-between` giãn đều, thay vì chừa dải đen trên/dưới.
 *  - Slide dài hơn khung: thu nhỏ tới ngưỡng đọc được rồi mới cho cuộn.
 */
export const BASE_W = 1280;
export const BASE_H = 720;
export const MAX_SCALE = 3;
export const MAX_FILL_W = 1920;
export const MAX_FILL_H = 900; // 1280x900 ≈ 10:7 — lấp gần hết màn 4:3 (cần 960) mà không làm bố cục bị kéo giãn quá
export const MIN_READABLE_SCALE = 0.58;
export const PHONE_MIN_SCALE = 0.5;

export function computeCanvasWidth(stageWidth, stageHeight, phoneReadable = false) {
  const heightScale = stageHeight / BASE_H;
  const baseScale = Math.min(MAX_SCALE, phoneReadable ? Math.max(heightScale, PHONE_MIN_SCALE) : heightScale);
  const w = Math.min(MAX_FILL_W, Math.max(BASE_W, stageWidth / Math.max(baseScale, 0.2)));
  return Math.round(w / 8) * 8;
}

export function computeCanvasGeometry({
  stageWidth,
  stageHeight,
  canvasW,
  naturalHeight = BASE_H,
  phoneReadable = false,
}) {
  const effectiveH = Math.max(BASE_H, naturalHeight);
  const widthScale = stageWidth / canvasW;
  const fitScale = Math.min(widthScale, stageHeight / effectiveH);
  // Sàn: slide chuẩn 16:9 luôn vừa khung; slide dài hơn thì co tối đa tới ngưỡng đọc được rồi mới cuộn.
  const floorScale = phoneReadable
    ? Math.min(widthScale, PHONE_MIN_SCALE)
    : Math.min(widthScale, stageHeight / BASE_H, MIN_READABLE_SCALE);
  const rawScale = Math.min(MAX_SCALE, Math.max(fitScale, floorScale));
  // Làm tròn bội 0.005 để giảm mờ chữ ở tỉ lệ lẻ
  const scale = Math.max(0.2, Math.floor(rawScale / 0.005) * 0.005);

  const needsScroll = effectiveH * scale > stageHeight + 1;
  // Còn dư chiều cao -> nới canvas logic theo chiều dọc (không đổi scale)
  const fillH = Math.min(MAX_FILL_H, Math.floor(stageHeight / scale));
  const canvasH = needsScroll ? effectiveH : Math.max(effectiveH, fillH);
  const scaledH = canvasH * scale;

  const x = Math.round((stageWidth - canvasW * scale) / 2);
  const y = needsScroll ? 0 : Math.max(0, Math.round((stageHeight - scaledH) / 2));
  return { scale, canvasH, scaledH, needsScroll, x, y };
}
