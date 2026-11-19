# claude.md — Quy định chung cho Bài tập Buổi 05 (React thuần + mock JSON)

Tài liệu này là "luật chơi" chung cho cả 4 bài trong `document/BAITAP_THUCHANHFOR(REACT).pdf`.
Mọi code sinh ra (bởi người hoặc AI) phải tuân theo các quy định dưới đây để 4 bài có cùng cách làm, cùng cách trình bày.

---

## 1. Tổng quan dự án

| Mục | Giá trị |
|---|---|
| Công cụ build | Vite (`source/`) |
| Thư viện UI | React 19, **chỉ React thuần** |
| Dữ liệu | Mock data từ file JSON tĩnh, **không gọi API, không backend** |
| Ngôn ngữ giao diện | Tiếng Việt (có dấu) |
| Chạy dự án | `cd source && npm install && npm run dev` |
| Kiểm tra lint | `npm run lint` — phải không còn lỗi trước khi nộp |

**Không cài thêm thư viện.** Không dùng react-router, Redux, axios, Formik, Yup, Bootstrap, Tailwind, MUI, dayjs/moment, uuid… Mọi thứ (điều hướng, validate, định dạng tiền/ngày, tạo id) đều viết bằng React + JavaScript thuần.

Dự án đã bật **React Compiler** (`babel-plugin-react-compiler`) → không cần tự viết `useMemo` / `useCallback` / `React.memo` để tối ưu.

---

## 2. Cấu trúc thư mục

```
Buổi 05/
├── document/
│   ├── BAITAP_THUCHANHFOR(REACT).pdf   # Đề bài
│   └── claude.md                       # File này
└── source/
    └── src/
        ├── main.jsx          # Không sửa (chỉ import index.css + App)
        ├── App.jsx           # Thanh điều hướng 4 bài
        ├── App.css           # CSS cho khung chung + thanh điều hướng
        ├── index.css         # Reset + biến CSS dùng chung (màu, font, khoảng cách)
        ├── data/
        │   ├── Bai01.json    # Đăng ký tuyển sinh
        │   ├── Bai02.json    # Đặt phòng khách sạn
        │   ├── Bai03.json    # Tạo đề thi trắc nghiệm
        │   └── Bai04.json    # Thêm mới nhân viên
        ├── pages/
        │   ├── Bai01.jsx
        │   ├── Bai02.jsx
        │   ├── Bai03.jsx
        │   └── Bai04.jsx
        └── styles/
            ├── Bai01.css
            ├── Bai02.css
            ├── Bai03.css
            └── Bai04.css
```

Quy tắc đặt tên:
- Tên file của một bài **luôn là `BaiXX`** (2 chữ số) và giống nhau ở cả 3 thư mục: `data/Bai01.json` ↔ `pages/Bai01.jsx` ↔ `styles/Bai01.css`.
- Mỗi bài **gói gọn trong đúng 3 file** đó. Không tạo thêm thư mục `components/`, `utils/`, `hooks/`. Component con / hàm phụ trợ của bài nào thì khai báo ngay trong file `.jsx` của bài đó (phía trên component chính).
- Không import chéo giữa các bài (Bai02 không được import gì từ Bai01).
- Xoá các asset mẫu của Vite không dùng tới (`hero.png`, `react.svg`, `vite.svg`) khỏi `App.jsx`.

---

## 3. App.jsx — điều hướng giữa 4 bài

Không dùng router. Điều hướng bằng `useState` + mảng cấu hình:

```jsx
import { useState } from 'react'
import Bai01 from './pages/Bai01'
import Bai02 from './pages/Bai02'
import Bai03 from './pages/Bai03'
import Bai04 from './pages/Bai04'
import './App.css'

const BAI_TAP = [
  { id: 1, label: 'Bài 1', title: 'Đăng ký tuyển sinh', component: Bai01 },
  { id: 2, label: 'Bài 2', title: 'Đặt phòng khách sạn', component: Bai02 },
  { id: 3, label: 'Bài 3', title: 'Tạo đề thi trắc nghiệm', component: Bai03 },
  { id: 4, label: 'Bài 4', title: 'Thêm mới nhân viên', component: Bai04 },
]

function App() {
  const [activeId, setActiveId] = useState(1)
  const current = BAI_TAP.find((b) => b.id === activeId)
  const Page = current.component

  return (
    <div className="app">
      <header className="app-header">
        <h1>Bài tập Buổi 05 — React</h1>
        <nav className="app-nav">
          {BAI_TAP.map((b) => (
            <button
              key={b.id}
              type="button"
              className={b.id === activeId ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setActiveId(b.id)}
            >
              {b.label}: {b.title}
            </button>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Page key={current.id} />
      </main>
    </div>
  )
}

export default App
```

- `key={current.id}` để khi chuyển bài, state của bài cũ được reset sạch.
- App.jsx **chỉ** lo điều hướng và khung trang; không chứa logic của bài nào.

---

## 4. Quy định cho file JSON (`src/data/BaiXX.json`)

JSON chứa **dữ liệu cấu hình và dữ liệu mẫu**, không chứa logic. Những gì "có thể thay đổi" thì đặt trong JSON, không hard-code trong JSX:
danh sách lựa chọn (select/radio/checkbox), bảng giá, giới hạn validate (tuổi, dung lượng file, định dạng file), dữ liệu mẫu có sẵn.

Quy ước:
- Key viết `camelCase` tiếng Anh; giá trị hiển thị (label) viết tiếng Việt.
- Mỗi lựa chọn có dạng `{ "value": "...", "label": "..." }` (thêm field khác nếu cần, ví dụ `price`).
- Tiền tệ lưu dạng **số nguyên VNĐ** (`500000`), không lưu chuỗi `"500.000đ"`.
- Ngày lưu dạng chuỗi `"YYYY-MM-DD"` (khớp với `<input type="date">`).
- Dung lượng file lưu theo **MB** (`"maxSizeMB": 2`), định dạng file lưu dạng mảng đuôi/mime.
- Import trực tiếp: `import data from '../data/Bai01.json'`. Không dùng `fetch`.
- **Không sửa trực tiếp object import từ JSON** (nó dùng chung toàn app). Nếu cần danh sách thay đổi được (vd. danh sách nhân viên ở Bài 4), copy vào state: `useState(() => [...data.employees])`.

### Khung dữ liệu gợi ý cho từng bài

**Bai01.json** — Đăng ký tuyển sinh
```json
{
  "genders": [{ "value": "nam", "label": "Nam" }],
  "schools": [
    { "value": "uit", "label": "...", "majors": [{ "value": "cntt", "label": "Công nghệ thông tin" }] }
  ],
  "trainingSystems": [{ "value": "chinh-quy", "label": "Chính quy" }],
  "admissionYears": [2026, 2027],
  "rules": {
    "minAge": 17, "maxAge": 25,
    "gpaMin": 0, "gpaMax": 10,
    "avatar":     { "maxSizeMB": 2, "accept": ["image/jpeg", "image/png"] },
    "transcript": { "maxSizeMB": 5, "accept": ["application/pdf"] }
  }
}
```

**Bai02.json** — Đặt phòng khách sạn (giá đúng theo đề)
```json
{
  "roomTypes": [
    { "value": "standard", "label": "Phòng Standard", "price": 500000 },
    { "value": "deluxe",   "label": "Phòng Deluxe",   "price": 800000 },
    { "value": "vip",      "label": "Phòng VIP",      "price": 1500000 }
  ],
  "services": [
    { "value": "breakfast", "label": "Ăn sáng",         "price": 100000, "unit": "person_night" },
    { "value": "airport",   "label": "Đưa đón sân bay", "price": 300000, "unit": "trip" },
    { "value": "laundry",   "label": "Giặt ủi",         "price": 50000,  "unit": "person" }
  ],
  "limits": { "maxRooms": 10, "maxAdults": 20, "maxChildren": 10 }
}
```
Quy ước tính: "người" = người lớn + trẻ em; Đưa đón sân bay tính 1 lần (hoặc có ô nhập số lần nếu muốn) — chọn một cách và ghi rõ trên giao diện.

**Bai03.json** — Tạo đề thi trắc nghiệm
```json
{
  "subjects": [{ "value": "cnpm", "label": "Công nghệ phần mềm" }],
  "levels": [{ "value": "de", "label": "Dễ" }, { "value": "tb", "label": "Trung bình" }, { "value": "kho", "label": "Khó" }],
  "questionTypes": [
    { "value": "single",   "label": "Một đáp án đúng" },
    { "value": "multiple", "label": "Nhiều đáp án đúng" }
  ],
  "rules": { "minAnswers": 2, "defaultScore": 1 },
  "sampleExam": { "title": "", "subject": "", "duration": 45, "level": "tb", "questions": [] }
}
```

**Bai04.json** — Thêm mới nhân viên
```json
{
  "departments": [
    { "value": "it", "label": "Phòng CNTT", "positions": ["Trưởng phòng", "Lập trình viên", "Tester"] }
  ],
  "contractTypes": [
    { "value": "chinh-thuc", "label": "Chính thức" },
    { "value": "thoi-vu",    "label": "Thời vụ", "requiresEndDate": true }
  ],
  "statuses": [{ "value": "dang-lam", "label": "Đang làm việc" }],
  "skills": ["ReactJS", "NodeJS", "SQL"],
  "languages": ["Tiếng Anh", "Tiếng Nhật"],
  "rules": { "avatar": { "maxSizeMB": 2, "accept": ["image/jpeg", "image/png"] } },
  "employees": [
    { "employeeCode": "NV001", "fullName": "Nguyễn Văn A", "email": "a@company.vn" }
  ]
}
```
`employees` là danh sách mẫu dùng để **kiểm tra trùng mã nhân viên** (so sánh không phân biệt hoa/thường, đã `trim()`).

---

## 5. Quy định cho file React (`src/pages/BaiXX.jsx`)

### 5.1 Khung file chuẩn (theo thứ tự)
```jsx
import { useState } from 'react'
import data from '../data/Bai01.json'
import '../styles/Bai01.css'

// 1. Hằng số & giá trị khởi tạo
const INITIAL_FORM = { fullName: '', email: '' /* ... */ }

// 2. Hàm thuần (validate, tính toán, format) — không dùng hook
function validate(form) { /* trả về object errors */ }

// 3. Component con nhỏ (nếu cần), ví dụ <Field />, <SummaryTable />

// 4. Component chính — export default, tên trùng tên file
export default function Bai01() { /* ... */ }
```

### 5.2 Quy ước code
- Chỉ dùng **function component + hooks**; không dùng class component.
- Format giống template Vite hiện có: thụt lề 2 dấu cách, nháy đơn `'`, **không** dấu chấm phẩy cuối dòng.
- Tên biến/hàm tiếng Anh `camelCase`; component `PascalCase`; hằng số `UPPER_SNAKE_CASE`.
- Form dùng **controlled input**: một object state `form` + một hàm `handleChange` chung dựa trên `name`:
  ```jsx
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }
  ```
- Giá trị **tính được thì không lưu vào state** (số đêm, tổng tiền, tổng điểm, danh sách chức vụ theo phòng ban…) — tính trực tiếp trong lúc render.
- Cập nhật state luôn bất biến (spread / `map` / `filter`), không `push`/`splice` trên state.
- Id cho phần tử động (câu hỏi, đáp án, chứng chỉ): dùng `crypto.randomUUID()` hoặc `Date.now()`; **không dùng index làm `key`** cho danh sách có thêm/xoá.
- `<form onSubmit={handleSubmit}>` với `e.preventDefault()`; thêm `noValidate` để dùng validate tự viết thay vì bóng thông báo của trình duyệt.
- Mỗi `<input>` có `<label htmlFor>` tương ứng với `id`.
- Không dùng `alert()` / `confirm()`; thông báo hiển thị ngay trên giao diện.
- Không `console.log` thừa khi nộp bài.

### 5.3 Validate
- Viết hàm `validate(form)` trả về object `errors` dạng `{ tenTruong: 'Thông báo lỗi' }`. Form hợp lệ khi `Object.keys(errors).length === 0`.
- Validate khi bấm nút submit; sau lần submit đầu, validate lại mỗi khi người dùng sửa trường (để lỗi tự biến mất khi đã sửa đúng).
- **Lỗi hiển thị ngay bên dưới trường nhập**, input lỗi có viền đỏ:
  ```jsx
  <input className={errors.email ? 'input-error' : ''} ... />
  {errors.email && <p className="error-text">{errors.email}</p>}
  ```
- Thông báo lỗi tiếng Việt, cụ thể, có dấu: "Vui lòng nhập email", "Email không đúng định dạng", "Điểm trung bình phải nằm trong khoảng 0 – 10".
- Regex dùng chung (copy vào bài nào cần):
  - Email: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - SĐT Việt Nam: `/^(0|\+84)(3|5|7|8|9)\d{8}$/`
- Mọi giới hạn số (tuổi, điểm, dung lượng file, số phòng…) lấy từ JSON, không hard-code.
- File upload: kiểm tra `file.type` nằm trong `accept` và `file.size <= maxSizeMB * 1024 * 1024`. Ảnh xem trước bằng `URL.createObjectURL(file)`. Lưu tên file để hiển thị ở bước xác nhận.

### 5.4 Luồng màn hình (áp dụng cho bài có bước xác nhận)
Dùng một state `step` thay cho nhiều boolean:
```
'form'  →  (bấm Đăng ký / Tiếp tục, hợp lệ)  →  'review'
'review' → (bấm Quay lại chỉnh sửa) → 'form'  (giữ nguyên dữ liệu đã nhập)
'review' → (bấm Xác nhận)             → 'success'
'success' → (bấm Làm mới)             → 'form' với INITIAL_FORM
```
- Bài 1, Bài 2: bắt buộc có đủ 3 bước trên.
- Bài 3: form soạn đề + khu vực **xem trước đề thi**; bấm **Lưu đề thi** → hiển thị JSON bằng `<pre>{JSON.stringify(exam, null, 2)}</pre>`.
- Bài 4: bấm **Lưu** → thêm nhân viên vào danh sách (state) và hiển thị thẻ/bảng thông tin nhân viên vừa lưu.

### 5.5 Định dạng hiển thị
- Tiền: `new Intl.NumberFormat('vi-VN').format(n) + ' đ'` → `1.500.000 đ`.
- Ngày: hiển thị `DD/MM/YYYY` (`new Date(s).toLocaleDateString('vi-VN')`).
- Số đêm: `(new Date(checkOut) - new Date(checkIn)) / 86400000`.
- Tuổi: tính theo ngày sinh so với ngày hiện tại (trừ thêm 1 nếu chưa tới sinh nhật trong năm).

---

## 6. Quy định CSS

### 6.1 Phân chia
- `index.css`: reset (`box-sizing: border-box`, margin 0), font chung, và **biến CSS dùng chung** trong `:root`. Thay toàn bộ nội dung mẫu của Vite.
- `App.css`: chỉ CSS cho khung `.app`, `.app-header`, `.app-nav`, `.nav-btn`, `.app-main`.
- `styles/BaiXX.css`: CSS riêng của từng bài.

### 6.2 Tránh đè CSS giữa các bài (quan trọng)
Vite gộp mọi file CSS đã import thành CSS toàn cục, nên class trùng tên giữa các bài sẽ đè nhau. Quy định:
- Thẻ ngoài cùng của mỗi bài có class gốc: `<div className="bai01">`, `<div className="bai02">`…
- **Mọi selector trong `BaiXX.css` phải bắt đầu bằng class gốc đó**: `.bai01 .form-group { }`, `.bai01 .error-text { }`.
- Không viết selector thẻ trần (`input { }`, `button { }`) trong file CSS của bài.
- Không dùng inline style, trừ giá trị động (ví dụ độ rộng thanh tiến trình).

### 6.3 Biến dùng chung (khai báo trong `index.css`, dùng ở mọi bài)
```css
:root {
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-danger: #dc2626;
  --color-success: #16a34a;
  --color-text: #1f2937;
  --color-muted: #6b7280;
  --color-border: #d1d5db;
  --color-bg: #f3f4f6;
  --color-surface: #ffffff;
  --radius: 8px;
  --gap: 16px;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
  color: var(--color-text);
  background: var(--color-bg);
}
```
Màu sắc, bo góc, khoảng cách trong `BaiXX.css` phải dùng các biến này để 4 bài đồng bộ.

---

## 7. Quy định trình bày giao diện (giống nhau ở cả 4 bài)

Bố cục mỗi bài từ trên xuống:
1. **Tiêu đề bài** (`<h2>`) + 1 dòng mô tả ngắn (`.subtitle`, chữ màu muted).
2. **Các nhóm thông tin** — mỗi nhóm là một "card" (`<fieldset>` hoặc `<section className="card">`) có tiêu đề nhóm, đúng tên nhóm trong đề:
   - Bài 1: *Thông tin cá nhân* / *Thông tin đăng ký* / *Thông tin bổ sung*
   - Bài 2: *Thông tin khách hàng* / *Thông tin đặt phòng* / *Dịch vụ bổ sung* / *Tổng chi phí*
   - Bài 3: *Thông tin đề thi* / *Danh sách câu hỏi* / *Xem trước đề thi*
   - Bài 4: *Thông tin cá nhân* / *Thông tin công việc* / *Thông tin bổ sung*
3. **Hàng nút hành động** ở cuối, căn phải.

Quy ước chi tiết:
- Mỗi trường: label ở trên, input bên dưới, lỗi dưới cùng. Trường bắt buộc có dấu `*` màu đỏ sau label.
- Lưới 2 cột trên màn hình rộng (`grid-template-columns: repeat(2, 1fr)`), 1 cột khi `max-width: 768px`. Trường dài (địa chỉ, ghi chú, nội dung câu hỏi) chiếm cả hàng.
- Nội dung bài rộng tối đa `960px`, căn giữa.
- Nút:
  - Chính (Đăng ký, Xác nhận, Lưu): nền `--color-primary`, chữ trắng.
  - Phụ (Quay lại chỉnh sửa, Làm mới, Thêm đáp án): viền, nền trắng.
  - Nguy hiểm (Xoá câu hỏi/đáp án/chứng chỉ): màu `--color-danger`.
  - Mọi `<button>` không phải submit phải có `type="button"`.
- Bảng tổng kết / xác nhận: dạng bảng 2 cột *Thông tin | Giá trị*, dòng tổng tiền/tổng điểm in đậm.
- Thông báo thành công: hộp nền xanh nhạt, viền `--color-success`, có nút quay lại / làm mới.
- Tiền tệ, tổng điểm, số đêm cập nhật **ngay lập tức** khi người dùng thay đổi dữ liệu.

---

## 8. Checklist chức năng theo đề (phải đủ trước khi nộp)

**Bài 1 — Đăng ký tuyển sinh**
- [ ] Kiểm tra trường bắt buộc · email · SĐT · tuổi (min/max trong JSON) · điểm 0–10 · dung lượng & định dạng file (ảnh đại diện, học bạ)
- [ ] Lỗi hiện ngay dưới trường
- [ ] Đăng ký → màn hình xác nhận toàn bộ thông tin → Quay lại chỉnh sửa / Xác nhận → thông báo thành công
- [ ] Chọn trường thì danh sách ngành thay đổi theo trường (lấy từ JSON)

**Bài 2 — Đặt phòng khách sạn**
- [ ] Ngày trả phòng phải sau ngày nhận phòng (và ngày nhận không trước hôm nay)
- [ ] Tự tính số đêm
- [ ] Loại phòng & dịch vụ với giá đúng đề (lấy từ JSON)
- [ ] Tự tính tổng = tiền phòng (giá × số phòng × số đêm) + từng dịch vụ theo đơn vị tính
- [ ] Bảng tổng kết chi tiết từng khoản; cho sửa lại trước khi xác nhận

**Bài 3 — Tạo đề thi trắc nghiệm**
- [ ] Thêm / xoá / sửa câu hỏi; thêm / xoá đáp án; chọn đáp án đúng (radio nếu một đáp án, checkbox nếu nhiều đáp án)
- [ ] Đặt điểm từng câu; tự tính tổng điểm
- [ ] Kiểm tra: mỗi câu ≥ 2 đáp án, có ít nhất 1 đáp án đúng; số câu hỏi khớp "Số lượng câu hỏi" đã khai báo
- [ ] Xem trước đề thi; Lưu đề thi → hiện JSON

**Bài 4 — Thêm mới nhân viên**
- [ ] Mã NV không trống & không trùng với `employees` trong JSON + nhân viên đã thêm trong phiên
- [ ] Email đúng định dạng; lương > 0; ngày bắt đầu hợp lệ (sau ngày sinh, đủ tuổi lao động, không quá xa tương lai)
- [ ] Chọn phòng ban → danh sách chức vụ tương ứng (reset chức vụ khi đổi phòng ban)
- [ ] Hợp đồng thời vụ → hiện thêm ngày kết thúc (phải sau ngày bắt đầu)
- [ ] Chọn nhiều kỹ năng (checkbox); thêm/xoá nhiều chứng chỉ
- [ ] Lưu → hiển thị thông tin nhân viên vừa lưu

---

## 9. Khi làm việc với AI (Claude)
- Đọc file này và đề bài PDF trước khi viết code.
- Làm từng bài một, mỗi bài đủ 3 file `data/BaiXX.json`, `pages/BaiXX.jsx`, `styles/BaiXX.css`, sau đó mới cập nhật `App.jsx`.
- Không tự ý thêm thư viện, thêm thư mục, hay đổi cấu trúc đã quy định ở mục 2.
- Sau khi viết xong mỗi bài: chạy `npm run lint` và `npm run build` để chắc chắn không lỗi.
