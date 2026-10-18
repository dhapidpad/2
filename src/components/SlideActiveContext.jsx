import { createContext, useContext } from 'react';

/**
 * true  = slide đang hiển thị (hoặc đang trượt ra)
 * false = slide được dựng sẵn ở nền để chuyển cảnh mượt (ẩn, đã tạm dừng animation)
 * Slide có timer/âm thanh tự chạy nên đọc cờ này và chỉ chạy khi active.
 */
const SlideActiveContext = createContext(true);
export const useSlideActive = () => useContext(SlideActiveContext);
export default SlideActiveContext;
