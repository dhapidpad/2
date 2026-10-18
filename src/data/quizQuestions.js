/**
 * 5 câu hỏi checkpoint cho Slide 19
 */
export const quizQuestions = [
  {
    id: 1,
    question: "Chất nào được tạo ra chủ yếu khi NO trong khí thải bị oxi hóa trong không khí?",
    options: [
      { id: "A", text: "N₂O (Dinitrogen monoxide)" },
      { id: "B", text: "NO₂ (Nitrogen dioxide)", correct: true },
      { id: "C", text: "NH₃ (Ammonia)" },
      { id: "D", text: "N₂ (Khí nitrogen)" }
    ],
    answer: "NO₂ (Nitrogen dioxide)",
    explanation: "Khi tiếp xúc với oxygen trong khí quyển, NO bị oxi hóa dần thành nitrogen dioxide (NO₂), mở đường cho các phản ứng tạo axit."
  },
  {
    id: 2,
    question: "Phương trình hóa học nào biểu diễn đúng quá trình oxi hóa NO trong không khí?",
    options: [
      { id: "A", text: "NO + O₂ → NO₂ (Chưa cân bằng)" },
      { id: "B", text: "2NO + O₂ → 2NO₂", correct: true },
      { id: "C", text: "N₂ + 2O₂ → 2NO₂" },
      { id: "D", text: "4NO + 3O₂ → 2N₂O₅" }
    ],
    answer: "2NO + O₂ → 2NO₂",
    explanation: "Hệ số cân bằng là 2 trước NO và NO₂: 2 nguyên tử N và 4 nguyên tử O ở cả hai vế."
  },
  {
    id: 3,
    question: "Axit nitric - sản phẩm chuyển hóa chính trong chuỗi phản ứng của NOx - có công thức hóa học là gì?",
    options: [
      { id: "A", text: "HNO₂ (Axit nitrous)" },
      { id: "B", text: "HNO₃ (Axit nitric)", correct: true },
      { id: "C", text: "H₂SO₄ (Axit sulfuric)" },
      { id: "D", text: "H₂CO₃ (Axit carbonic)" }
    ],
    answer: "HNO₃",
    explanation: "HNO₃ là axit nitric, một axit mạnh phân ly hoàn toàn trong nước thành H⁺ và NO₃⁻ làm giảm mạnh pH giọt mưa."
  },
  {
    id: 4,
    question: "Quan niệm: 'Mưa axit chỉ gây hại cho ao hồ và các loài cá, không ảnh hưởng đến trên cạn' là Đúng hay Sai?",
    options: [
      { id: "A", text: "Đúng, vì axit chỉ tích tụ trong môi trường nước" },
      { id: "B", text: "Sai; mưa axit còn gây rửa trôi dinh dưỡng đất, hại rễ cây, mòn đá vôi và công trình kim loại", correct: true }
    ],
    answer: "Sai",
    explanation: "Lắng đọng axit tác động toàn diện: làm rửa trôi ion kiềm Ca²⁺/Mg²⁺, giải phóng Al³⁺ độc hại cho rễ cây, hòa tan đá vôi CaCO₃ và thúc đẩy ăn mòn kim loại."
  },
  {
    id: 5,
    question: "Biện pháp nào sau đây là giải pháp giải quyết tận gốc rễ vấn đề mưa axit?",
    options: [
      { id: "A", text: "Bón vôi CaCO₃ xuống tất cả các hồ và cánh rừng" },
      { id: "B", text: "Sơn chống thấm dày cho mọi công trình di tích" },
      { id: "C", text: "Giảm phát thải NOx và SO₂ ngay từ nguồn (giao thông, lò đốt, nhà máy)", correct: true },
      { id: "D", text: "Chỉ đo đạc và chờ môi trường tự phục hồi" },
    ],
    answer: "Giảm phát thải chất gây axit ngay từ nguồn",
    explanation: "Bón vôi hay sơn phủ chỉ là xử lý triệu chứng tại chỗ. Cắt giảm phát thải từ nguồn (chuyển đổi năng lượng sạch, dùng bộ xúc tác SCR, giao thông xanh) mới là giải pháp gốc rễ bền vững."
  }
];
