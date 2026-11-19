# 📋 Kế Hoạch Triển Khai Bài 3: Web Tạo Đề Thi Trắc Nghiệm (React Thuần)

> **Tuân thủ:** `document/claude.md`, `RECOMMENDED_SKILLS.md` & `orchestrator`  
> **Quy tắc cốt lõi:** Chỉ dùng React 19 thuần, không cài thêm package, tối giản mã nguồn (Ponytail), giao diện diệt AI-slop (Hallmark + Taste + Impeccable + Emil Craft), kiểm tra nghiêm ngặt (TDD & Verification).

---

## 📊 Bảng Tiến Độ (Progress Tracker)

| Task ID | Nội dung công việc | File liên quan | Trạng thái | Commit chuẩn Conventional |
|---|---|---|:---:|---|
| **TASK-1** | Thiết kế cấu trúc JSON cấu hình & Mock Data chuẩn | `src/data/Bai03.json` | ✅ Hoàn thành | `feat(bai03): create mock data and schema for exam maker` |
| **TASK-2** | Xây dựng logic nghiệp vụ thuần (Validate, tính tổng điểm, LocalStorage) | `src/pages/Bai03.jsx` | ✅ Hoàn thành | `feat(bai03): implement exam state management and validation logic` |
| **TASK-3** | Xây dựng giao diện Form thông tin đề thi & Dashboard thống kê | `src/pages/Bai03.jsx`, `src/styles/Bai03.css` | ✅ Hoàn thành | `feat(bai03): add exam info form and live stat dashboard` |
| **TASK-4** | Xây dựng trình soạn thảo câu hỏi & quản lý danh sách đáp án | `src/pages/Bai03.jsx`, `src/styles/Bai03.css` | ✅ Hoàn thành | `feat(bai03): add question builder with dynamic answer options` |
| **TASK-5** | Xây dựng chế độ Xem Trước Đề Thi (Preview Mode) chuẩn sư phạm | `src/pages/Bai03.jsx`, `src/styles/Bai03.css` | ✅ Hoàn thành | `feat(bai03): add student-view exam preview mode` |
| **TASK-6** | Xây dựng chức năng Lưu đề thi & Modal xuất JSON (Copy & Download) | `src/pages/Bai03.jsx`, `src/styles/Bai03.css` | ✅ Hoàn thành | `feat(bai03): add save exam modal with JSON export and download` |
| **TASK-7** | Đánh bóng UI/UX diệt AI-slop (Hallmark, Taste, Impeccable, Emil Craft) | `src/styles/Bai03.css` | ✅ Hoàn thành | `style(bai03): refine UI/UX styling, typography and animations` |
| **TASK-8** | Code Review 5 trục, Lint & Build Verification nghiệm thu | Toàn dự án | ✅ Hoàn thành | `chore(bai03): verify lint, build and finalize documentation` |

---

## 📝 Chi Tiết 12 Chức Năng Yêu Cầu

- [x] 1. Thêm câu hỏi mới.
- [x] 2. Xóa câu hỏi (kèm kiểm tra số lượng câu tối thiểu).
- [x] 3. Chỉnh sửa nội dung câu hỏi.
- [x] 4. Thêm đáp án cho từng câu hỏi (sinh ký tự A, B, C... tự động).
- [x] 5. Xóa đáp án (chặn khi còn tối thiểu 2 đáp án).
- [x] 6. Chọn đáp án đúng (Radio cho 1 đáp án, Checkbox cho nhiều đáp án).
- [x] 7. Thiết lập điểm cho từng câu hỏi.
- [x] 8. Tự động tính tổng điểm của đề thi (cập nhật tức thì trong lúc render).
- [x] 9. Kiểm tra mỗi câu hỏi phải có ít nhất 2 đáp án (validation chi tiết).
- [x] 10. Kiểm tra mỗi câu hỏi phải có đáp án đúng (validation chi tiết).
- [x] 11. Hiển thị bản xem trước đề thi (Exam paper preview mode chuẩn sư phạm).
- [x] 12. Nhấn Lưu đề thi để hiển thị dữ liệu dưới dạng JSON (kèm copy clipboard, download file và lưu local storage draft).
