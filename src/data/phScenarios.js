/**
 * Dữ liệu hoạt động tương tác pH 30 giây cho Slide 12.
 * Lưu ý: Số liệu A, B, C là giả định cho hoạt động giáo dục.
 */
export const phSamples = [
  {
    id: 'A',
    name: 'Mẫu Nước A',
    ph: 6.2,
    color: '#8FCB89',
    badge: 'Gần tự nhiên',
    status: 'Độ axit nhẹ',
    observation: 'pH = 6,2: Nằm trong ngưỡng sinh thái an toàn đối với đa số sinh vật thủy sinh thông thường.'
  },
  {
    id: 'B',
    name: 'Mẫu Nước B',
    ph: 5.2,
    color: '#F1B65C',
    badge: 'Thấp hơn mốc 5,6',
    status: 'Axit hóa trung bình',
    observation: 'pH = 5,2: Thấp hơn mốc tham khảo nước mưa tự nhiên (5,6). Các loài ấu trùng và phù du nhạy cảm bắt đầu chịu áp lực.'
  },
  {
    id: 'C',
    name: 'Mẫu Nước C',
    ph: 4.4,
    color: '#EA6464',
    badge: 'Khoảng mưa axit EPA',
    status: 'Axit mạnh nhất',
    observation: 'pH = 4,4: Nằm trong khoảng tham khảo mưa axit điển hình (EPA nêu 4,2–4,4). Nồng độ H⁺ cao gấp ~63 lần so với pH 6,2!'
  }
];

export const phActivityInsights = {
  question1: "Mẫu nào có tính axit mạnh hơn?",
  answer1: "Mẫu C (pH 4,4) có tính axit mạnh nhất vì thang pH là nghịch đảo logarit: pH càng thấp thì nồng độ ion H⁺ càng cao.",
  question2: "Mẫu C có tự động gây hại nhất cho mọi hồ không?",
  answer2: "Không thể khẳng định tuyệt đối! Tác hại thực tế phụ thuộc rất lớn vào khả năng đệm (buffering capacity) của đá nền (như đá vôi có thể trung hòa axit) và loài sinh vật cụ thể sinh sống trong hồ đó.",
  disclaimer: "Dữ liệu mẫu A, B, C là tình huống giả định phục vụ phương pháp sư phạm rèn luyện tư duy phản biện khoa học, không phải số liệu đo đạc tại một địa phương cụ thể."
};
