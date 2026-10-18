// Dán link avatar (catbox: https://files.catbox.moe/xxx.jpg | pinterest: link ảnh trực tiếp i.pinimg.com/...) vào trường `avatar`.
// Để '' thì slide tự dùng icon + chữ cái đầu.
// gif: link GIF/ảnh động hiện trong vòng tròn ở GIỮA (khi chưa có avatar). VD: 'https://files.catbox.moe/xxxx.gif'
// avatar cũng nhận được link .gif (sẽ phủ kín nửa trái của thẻ).

export const teamInfo = {
  groupName: 'Nhóm 2',
  subject: '', // điền tên môn / đề tài nếu muốn hiện lên đầu slide
  className: '11A5', // điền lớp nếu muốn
};

// Nhóm chức năng, xếp theo thứ tự luồng làm việc
export const groups = {
  content: { color: '#D8F36A', name: 'Nội dung & Tài liệu', short: 'Nội dung & Tài liệu' },
  editor: { color: '#54D7E8', name: 'Điều phối & Biên tập', short: 'Điều phối & Biên tập' },
  design: { color: '#FF875F', name: 'Thiết kế & Trực quan', short: 'Thiết kế & Trực quan' },
  review: { color: '#C79BFF', name: 'Phản biện nội bộ', short: 'Phản biện nội bộ' },
};

export const teamMembers = [
  {
    id: 1, stt: 1, group: 'editor', icon: 'Compass', avatar: '', gif: 'https://i.pinimg.com/originals/fa/2b/66/fa2b66b79cf7b02756161a0125c0c537.gif',
    name: 'Đinh Trần Ngọc Trâm',
    role: 'Trưởng nhóm',
    titleRole: 'Trưởng nhóm / Biên tập viên',
    keyDeliverables: [
      'Điều phối chung, phân chia công việc cho từng thành viên.',
      'Tổng hợp lại nội dung và thuyết trình.',
      'Thống nhất văn phong của cả bài trước khi chuyển qua bộ phận thiết kế.',
    ],
  },
  {
    id: 2, stt: 2, group: 'editor', icon: 'NotebookPen', avatar: '', gif: 'https://i.pinimg.com/originals/6e/20/b4/6e20b494351426fe94a519c3b8aaa7c5.gif',
    name: 'Cao Diệu Thảo',
    role: 'Thư ký',
    titleRole: 'Thư ký / Biên tập viên',
    keyDeliverables: [
      'Ghi chép lại nội dung, ý tưởng trong các buổi họp nhóm.',
      'Đọc rà soát (Proofreader) toàn bộ nội dung, chỉnh sửa câu từ, lỗi chính tả.',
    ],
  },
  {
    id: 3, stt: 3, group: 'content', icon: 'FileText', avatar: '', gif: 'https://i.pinimg.com/736x/b4/cc/de/b4ccde0ff3944b86a833f3c290d3c8b2.jpg',
    name: 'Lê Thị Ngọc Ánh',
    role: 'Viết văn bản',
    titleRole: 'Bộ phận Nội dung & Tài liệu',
    keyDeliverables: [
      'Nhận thông tin từ người tìm tài liệu để viết thành văn bản hoàn chỉnh.',
    ],
  },
  {
    id: 4, stt: 4, group: 'content', icon: 'Mic', avatar: '', gif: 'https://i.pinimg.com/736x/47/0a/91/470a916e43c1c0aa75fbbf110b1538aa.jpg',
    name: 'Phạm Vũ Thanh Phúc',
    role: 'Viết lời thoại',
    titleRole: 'Bộ phận Nội dung & Tài liệu',
    keyDeliverables: [
      'Tóm tắt các ý chính.',
      'Viết lời thoại (script) chi tiết cho từng phần thuyết trình.',
      'Đảm bảo logic và đúng trọng tâm yêu cầu.',
    ],
  },
  {
    id: 5, stt: 5, group: 'content', icon: 'PenLine', avatar: '', gif: 'https://i.pinimg.com/1200x/b1/4b/51/b14b514326b42d38029aa9adcfcc04b3.jpg',
    name: 'Nguyễn Mạnh Trường',
    role: 'Viết báo cáo',
    titleRole: 'Bộ phận Nội dung & Tài liệu',
    keyDeliverables: [
      'Tiếp nhận dữ liệu thô từ nhóm tìm kiếm, phân tích, chắt lọc.',
      'Viết thành bài báo cáo (bản Word) chi tiết, logic, bám sát yêu cầu của đề tài.',
    ],
  },
  {
    id: 6, stt: 6, group: 'content', icon: 'Search', avatar: '', gif: 'https://i.pinimg.com/736x/86/92/82/869282be90c1236fba02871e3d9f46dc.jpg',
    name: 'Nguyễn Quốc Việt',
    role: 'Tra cứu tài liệu',
    titleRole: 'Bộ phận Nội dung & Tài liệu',
    keyDeliverables: [
      'Tra cứu sách, báo, bài viết, số liệu thống kê hoặc các nguồn thông tin uy tín liên quan đến đề tài.',
    ],
  },
  {
    id: 7, stt: 7, group: 'design', icon: 'Palette', avatar: '', gif: 'https://i.pinimg.com/originals/99/56/9c/99569cfdb06e4027403c308cd4b5f103.gif',
    name: 'Vũ Anh Tài',
    role: 'Thiết kế',
    titleRole: 'Bộ phận thiết kế',
    keyDeliverables: [
      'Phụ trách bố cục, chọn màu sắc (palette), font chữ.',
      'Dàn trang nội dung lên Slide sao cho tối giản, chuyên nghiệp và dễ đọc.',
    ],
  },
  {
    id: 8, stt: 8, group: 'design', icon: 'Shapes', avatar: '', gif: 'https://i.pinimg.com/1200x/69/fe/05/69fe0591541980014abb887208560eec.jpg',
    name: 'Lương Việt Anh',
    role: 'Trực quan hóa',
    titleRole: 'Trực quan hóa',
    keyDeliverables: [
      'Tìm kiếm hoặc tự thiết kế các icon, vẽ biểu đồ (chart), sơ đồ tư duy (mindmap).',
      'Làm hiệu ứng chuyển động (animation) hoặc edit video ngắn chèn vào slide để tăng tính sinh động.',
    ],
  },
  {
    id: 9, stt: 9, group: 'review', icon: 'ShieldCheck', avatar: '', gif: 'https://i.pinimg.com/1200x/b7/4b/4b/b74b4b29baa42befb2ba08943e8287ce.jpg',
    name: 'Nguyễn Hữu Khánh',
    role: 'Phản biện',
    titleRole: 'Phản biện nội bộ',
    keyDeliverables: [
      'Đọc lại toàn bộ Slide và bài báo cáo để tìm ra các điểm mâu thuẫn, luận điểm chưa chặt chẽ, số liệu lỗi thời.',
      'Yêu cầu các bộ phận khác sửa chữa trước khi nộp bài.',
    ],
  },
];