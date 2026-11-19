# Bai01.md — Đặc tả triển khai Bài 1: Web đăng ký tuyển sinh

> Tài liệu này chi tiết hoá Bài 1 trong `BAITAP_THUCHANHFOR(REACT).pdf`.
> Mọi quy định chung (cấu trúc thư mục, quy ước code, CSS, điều hướng) xem `claude.md`. Khi có chỗ khác nhau, **file này ưu tiên cho Bài 1**.

---

## 1. Mục tiêu & phạm vi

Xây dựng một form đăng ký tuyển sinh gồm 3 nhóm thông tin, có kiểm tra dữ liệu đầy đủ, màn hình xác nhận và thông báo thành công. Không có backend: dữ liệu lựa chọn và quy định kiểm tra lấy từ `Bai01.json`, kết quả chỉ hiển thị trên giao diện.

| File | Vai trò |
|---|---|
| `src/data/Bai01.json` | Danh mục lựa chọn + quy định kiểm tra (giả lập) |
| `src/pages/Bai01.jsx` | Toàn bộ logic + giao diện Bài 1 |
| `src/styles/Bai01.css` | CSS riêng, mọi selector bắt đầu bằng `.bai01` |
| `src/App.jsx` | Đã có route `#/bai01` — không cần sửa |

---

## 2. Danh sách trường dữ liệu

### 2.1 Thông tin cá nhân

| Trường | `name` | Kiểu input | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Họ và tên | `fullName` | `text` | ✔ | Tối đa 50 ký tự |
| Ngày sinh | `dateOfBirth` | `date` | ✔ | `max` = hôm nay |
| Giới tính | `gender` | `radio` (từ JSON) | ✔ | Nam / Nữ / Khác |
| Số điện thoại | `phone` | `tel` | ✔ | |
| Email | `email` | `email` | ✔ | |
| Địa chỉ thường trú | `address` | `textarea` (2 dòng) | ✔ | Chiếm cả hàng, tối đa 200 ký tự |

### 2.2 Thông tin đăng ký

| Trường | `name` | Kiểu input | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Trường đăng ký | `school` | `select` (từ JSON) | ✔ | |
| Ngành học | `major` | `select` phụ thuộc `school` | ✔ | `disabled` khi chưa chọn trường; **reset về rỗng khi đổi trường** |
| Hệ đào tạo | `trainingSystem` | `select` (từ JSON) | ✔ | |
| Năm tuyển sinh | `admissionYear` | `select` (từ JSON) | ✔ | Lưu dạng số |
| Điểm trung bình học tập | `gpa` | `number`, `step="0.01"` | ✔ | 0 – 10, tối đa 2 chữ số thập phân |

### 2.3 Thông tin bổ sung

| Trường | `name` | Kiểu input | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Ảnh đại diện | `avatar` | `file`, `accept="image/jpeg,image/png"` | ✔ | Có ảnh xem trước |
| File học bạ | `transcript` | `file`, `accept=".pdf,image/jpeg,image/png"` | ✔ | Hiện tên + dung lượng file |
| Ghi chú | `note` | `textarea` (3 dòng) | ✘ | Tối đa 500 ký tự, có bộ đếm `x/500` |

---

## 3. Dữ liệu `Bai01.json`

Dùng đúng cấu trúc dưới đây. Tên trường/ngành là dữ liệu giả lập, có thể thay đổi tuỳ ý mà không phải sửa JSX.

```json
{
  "genders": [
    {
      "value": "nam",
      "label": "Nam"
    },
    {
      "value": "nu",
      "label": "Nữ"
    },
    {
      "value": "khac",
      "label": "Khác"
    }
  ],
  "schools": [
    {
      "value": "dh-cntt",
      "label": "Trường Đại học Công nghệ Thông tin",
      "majors": [
        {
          "value": "ktpm",
          "label": "Kỹ thuật phần mềm"
        },
        {
          "value": "httt",
          "label": "Hệ thống thông tin"
        },
        {
          "value": "khmt",
          "label": "Khoa học máy tính"
        },
        {
          "value": "attt",
          "label": "An toàn thông tin"
        }
      ]
    },
    {
      "value": "dh-kinh-te",
      "label": "Trường Đại học Kinh tế",
      "majors": [
        {
          "value": "qtkd",
          "label": "Quản trị kinh doanh"
        },
        {
          "value": "ke-toan",
          "label": "Kế toán"
        },
        {
          "value": "tai-chinh",
          "label": "Tài chính – Ngân hàng"
        }
      ]
    },
    {
      "value": "dh-su-pham",
      "label": "Trường Đại học Sư phạm",
      "majors": [
        {
          "value": "sp-toan",
          "label": "Sư phạm Toán học"
        },
        {
          "value": "sp-tin",
          "label": "Sư phạm Tin học"
        },
        {
          "value": "sp-anh",
          "label": "Sư phạm Tiếng Anh"
        }
      ]
    },
    {
      "value": "dh-cnkt-tphcm",
      "label": "Trường Đại học Công nghệ Kỹ thuật TP.HCM",
      "majors": [
        {
          "value": "cntt",
          "label": "Công nghệ Thông tin"
        },
        {
          "value": "ktdl",
          "label": "Kỹ thuật Dữ liệu"
        },
        {
          "value": "attt",
          "label": "An toàn Thông tin"
        }
      ]
    }
  ],
  "trainingSystems": [
    {
      "value": "chinh-quy",
      "label": "Chính quy"
    },
    {
      "value": "chat-luong-cao",
      "label": "Chất lượng cao"
    },
    {
      "value": "lien-thong",
      "label": "Liên thông"
    },
    {
      "value": "tu-xa",
      "label": "Đào tạo từ xa"
    }
  ],
  "admissionYears": [
    2026,
    2027
  ],
  "rules": {
    "fullNameMaxLength": 50,
    "addressMaxLength": 200,
    "noteMaxLength": 500,
    "minAge": 17,
    "maxAge": 30,
    "gpaMin": 0,
    "gpaMax": 10,
    "avatar": {
      "maxSizeMB": 2,
      "accept": [
        "image/jpeg",
        "image/png"
      ],
      "acceptLabel": "JPG, PNG"
    },
    "transcript": {
      "maxSizeMB": 5,
      "accept": [
        "application/pdf",
        "image/jpeg",
        "image/png"
      ],
      "acceptLabel": "PDF, JPG, PNG"
    }
  }
}
```

**Quy định tuổi giả lập:** tuổi được tính **đến ngày 31/12 của năm tuyển sinh đã chọn**, phải nằm trong `[minAge, maxAge]`. Hiển thị gợi ý dưới ô ngày sinh: *"Thí sinh từ 17 đến 30 tuổi tính đến 31/12 năm tuyển sinh"* (số lấy từ JSON).

---

## 4. Thiết kế state

```js
const INITIAL_FORM = {
  fullName: '', dateOfBirth: '', gender: '', phone: '', email: '', address: '',
  school: '', major: '', trainingSystem: '', admissionYear: '', gpa: '',
  note: '',
}
const INITIAL_FILES = { avatar: null, transcript: null }
```

| State | Kiểu | Ý nghĩa |
|---|---|---|
| `form` | object | Giá trị các trường văn bản/lựa chọn (controlled) |
| `files` | `{ avatar: File \| null, transcript: File \| null }` | File đã chọn (input file không controlled được nên tách riêng) |
| `errors` | object | `{ tenTruong: 'thông báo lỗi' }` |
| `submitted` | boolean | Đã bấm *Đăng ký* ít nhất 1 lần chưa → nếu rồi thì kiểm tra lại mỗi khi sửa |
| `step` | `'form' \| 'review' \| 'success'` | Màn hình hiện tại |
| `result` | object \| null | Mã hồ sơ + thời điểm nộp (tạo khi Xác nhận) |

Giá trị **tính ra, không lưu state**:
- `majors` = danh sách ngành của trường đang chọn.
- `avatarUrl` — xem mục 6.3.
- Tuổi thí sinh, số ký tự ghi chú.

---

## 5. Quy tắc kiểm tra & thông báo lỗi

Hàm thuần `validate(form, files)` trả về object `errors`. Mọi con số lấy từ `data.rules`.

| Trường | Điều kiện lỗi | Thông báo |
|---|---|---|
| `fullName` | rỗng (sau `trim`) | Vui lòng nhập họ và tên |
| | < 2 từ | Họ và tên phải có ít nhất 2 từ |
| | chứa số / ký tự đặc biệt (regex `/^[\p{L}\s]+$/u`) | Họ và tên chỉ được chứa chữ cái và khoảng trắng |
| | > 50 ký tự | Họ và tên tối đa 50 ký tự |
| `dateOfBirth` | rỗng | Vui lòng chọn ngày sinh |
| | sau hôm nay | Ngày sinh không được lớn hơn ngày hiện tại |
| | tuổi ngoài khoảng | Thí sinh phải từ 17 đến 30 tuổi (tính đến 31/12/{năm tuyển sinh}) |
| `gender` | rỗng | Vui lòng chọn giới tính |
| `phone` | rỗng | Vui lòng nhập số điện thoại |
| | không khớp `/^(0\|\+84)(3\|5\|7\|8\|9)\d{8}$/` (sau khi bỏ khoảng trắng) | Số điện thoại không đúng định dạng (VD: 0912345678) |
| `email` | rỗng | Vui lòng nhập email |
| | không khớp `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | Email không đúng định dạng (VD: ten@gmail.com) |
| `address` | rỗng | Vui lòng nhập địa chỉ thường trú |
| | > 200 ký tự | Địa chỉ tối đa 200 ký tự |
| `school` | rỗng | Vui lòng chọn trường đăng ký |
| `major` | rỗng | Vui lòng chọn ngành học |
| `trainingSystem` | rỗng | Vui lòng chọn hệ đào tạo |
| `admissionYear` | rỗng | Vui lòng chọn năm tuyển sinh |
| `gpa` | rỗng | Vui lòng nhập điểm trung bình |
| | không phải số | Điểm trung bình phải là số |
| | < 0 hoặc > 10 | Điểm trung bình phải nằm trong khoảng 0 – 10 |
| | > 2 chữ số thập phân | Điểm trung bình tối đa 2 chữ số thập phân |
| `avatar` | chưa chọn | Vui lòng chọn ảnh đại diện |
| | sai định dạng | Ảnh đại diện chỉ chấp nhận JPG, PNG |
| | quá dung lượng | Ảnh đại diện tối đa 2 MB (file hiện tại: 3.4 MB) |
| `transcript` | chưa chọn | Vui lòng tải lên file học bạ |
| | sai định dạng | File học bạ chỉ chấp nhận PDF, JPG, PNG |
| | quá dung lượng | File học bạ tối đa 5 MB (file hiện tại: 7.1 MB) |
| `note` | > 500 ký tự | Ghi chú tối đa 500 ký tự |

Ghi chú:
- Kiểm tra tuổi chỉ chạy khi đã có cả ngày sinh **và** năm tuyển sinh; nếu chưa chọn năm thì tính đến 31/12 năm hiện tại.
- Mỗi trường chỉ hiển thị **1 lỗi đầu tiên** gặp phải (kiểm tra theo thứ tự trong bảng).
- Đổi năm tuyển sinh phải kiểm tra lại tuổi (do validate chạy lại trên toàn bộ form).

### Thời điểm kiểm tra
1. Bấm **Đăng ký** → `setSubmitted(true)`, chạy `validate` toàn bộ.
   - Có lỗi: hiển thị lỗi dưới từng trường, hiển thị hộp tóm tắt phía trên nút *"Vui lòng kiểm tra lại N trường thông tin"*, **cuộn và focus vào trường lỗi đầu tiên** (`document.getElementById(firstKey)?.focus()`).
   - Không lỗi: chuyển `step = 'review'`, cuộn lên đầu trang.
2. Sau lần bấm đầu tiên (`submitted === true`): mỗi lần `form`/`files` thay đổi → chạy lại `validate` để lỗi tự mất khi đã sửa đúng.
3. Kiểm tra file **ngay khi chọn file** (không đợi bấm Đăng ký), để người dùng biết file sai ngay.

---

## 6. Xử lý file tải lên

### 6.1 Chọn file
```jsx
const handleFileChange = (e) => {
  const { name, files: list } = e.target
  setFiles((prev) => ({ ...prev, [name]: list[0] ?? null }))
}
```
Kiểm tra: `rules[name].accept.includes(file.type)` và `file.size <= rules[name].maxSizeMB * 1024 * 1024`.

### 6.2 Hiển thị file đã chọn
Vì `<input type="file">` bị xoá trắng mỗi khi render lại từ màn hình *review* về *form*, **không dựa vào input** để biết đã chọn file chưa — dựa vào `files` trong state:
- Đã có file: hiện khối `.file-info` gồm tên file, dung lượng (`formatFileSize`: `xxx KB` / `x.x MB`), nút **Đổi file** (kích hoạt input ẩn qua `ref`/`label`) và nút **Xoá**.
- Chưa có file: hiện ô chọn file + dòng gợi ý *"JPG, PNG – tối đa 2 MB"* (lấy từ JSON).

### 6.3 Ảnh xem trước
```jsx
const [avatarUrl, setAvatarUrl] = useState('')
useEffect(() => {
  if (!files.avatar || !files.avatar.type.startsWith('image/')) { setAvatarUrl(''); return }
  const url = URL.createObjectURL(files.avatar)
  setAvatarUrl(url)
  return () => URL.revokeObjectURL(url)   // giải phóng bộ nhớ
}, [files.avatar])
```
Ảnh xem trước hình vuông 120×120, `object-fit: cover`, bo góc. Chỉ hiện ảnh khi file hợp lệ.

---

## 7. Luồng màn hình

```
┌────────┐  Đăng ký (hợp lệ)  ┌──────────┐   Xác nhận   ┌───────────┐
│  form  │ ─────────────────▶ │  review  │ ───────────▶ │  success  │
└────────┘                    └──────────┘              └───────────┘
     ▲   Quay lại chỉnh sửa        │                          │
     └─────────────────────────────┘                          │
     ▲              Đăng ký hồ sơ mới (reset toàn bộ)          │
     └────────────────────────────────────────────────────────┘
```

| Bước | Nút | Hành động |
|---|---|---|
| form | **Làm lại** (phụ) | Reset `form`, `files`, `errors`, `submitted` về ban đầu |
| form | **Đăng ký** (chính, submit) | Validate → sang `review` nếu hợp lệ |
| review | **Quay lại chỉnh sửa** (phụ) | Về `form`, **giữ nguyên** dữ liệu & file |
| review | **Xác nhận** (chính) | Tạo `result`, sang `success` |
| success | **Đăng ký hồ sơ mới** (chính) | Reset toàn bộ, về `form` |

Mỗi lần đổi bước: `window.scrollTo({ top: 0, behavior: 'smooth' })`.

**Mã hồ sơ** khi xác nhận: `TS{năm tuyển sinh}-{6 chữ số ngẫu nhiên}`, ví dụ `TS2026-048215`; kèm thời điểm nộp định dạng `HH:mm dd/MM/yyyy` (`toLocaleString('vi-VN')`).

---

## 8. Giao diện chi tiết

Thẻ gốc: `<div className="bai01">`. Bề rộng theo `.app-main` (tối đa 960px).

### 8.1 Thanh tiến trình bước (hiện ở cả 3 màn hình)
```
 ① Nhập thông tin ──── ② Xác nhận ──── ③ Hoàn tất
```
Bước hiện tại tô `--color-primary`, bước đã qua tô `--color-success` kèm dấu ✓, bước chưa tới màu muted.

### 8.2 Màn hình `form`
```
Bài 1: Đăng ký tuyển sinh
Điền đầy đủ thông tin bên dưới. Các trường có dấu * là bắt buộc.
[ thanh tiến trình ]

┌─ Thông tin cá nhân ─────────────────────────────┐
│ Họ và tên *            │ Ngày sinh *            │
│ Giới tính * (○Nam ○Nữ ○Khác) │ Số điện thoại * │
│ Email *                │                        │
│ Địa chỉ thường trú * (cả hàng)                  │
└─────────────────────────────────────────────────┘
┌─ Thông tin đăng ký ─────────────────────────────┐
│ Trường đăng ký *       │ Ngành học *            │
│ Hệ đào tạo *           │ Năm tuyển sinh *       │
│ Điểm trung bình *      │                        │
└─────────────────────────────────────────────────┘
┌─ Thông tin bổ sung ─────────────────────────────┐
│ Ảnh đại diện * [preview]│ File học bạ *         │
│ Ghi chú (cả hàng)                      120/500  │
└─────────────────────────────────────────────────┘
[ hộp tóm tắt lỗi – nếu có ]
                               [Làm lại] [Đăng ký]
```

### 8.3 Màn hình `review`
- Tiêu đề *"Xác nhận thông tin đăng ký"*, dòng phụ *"Vui lòng kiểm tra kỹ trước khi xác nhận."*
- 3 khối tương ứng 3 nhóm, mỗi khối là bảng 2 cột **Thông tin | Giá trị**.
- Hiển thị **label** chứ không hiển thị `value` (VD: "Kỹ thuật phần mềm", không phải `ktpm`) — dùng hàm `getLabel(list, value)`.
- Ngày sinh `dd/MM/yyyy` kèm tuổi: `15/03/2008 (18 tuổi)`.
- Điểm trung bình hiển thị 2 chữ số thập phân: `8.50`.
- Ảnh đại diện hiển thị ảnh thật 120×120; học bạ hiển thị tên file + dung lượng.
- Ghi chú trống → hiển thị *"(Không có)"* màu muted; giữ xuống dòng bằng `white-space: pre-line`.
- Nút: **Quay lại chỉnh sửa** · **Xác nhận**.

### 8.4 Màn hình `success`
- Hộp thông báo nền xanh nhạt, viền `--color-success`, biểu tượng ✓ lớn.
- Nội dung: *"Đăng ký tuyển sinh thành công!"*, *"Cảm ơn {Họ tên}. Hồ sơ của bạn đã được ghi nhận."*
- Thông tin tóm tắt: Mã hồ sơ (in đậm, chữ lớn), Trường – Ngành, Hệ đào tạo, Thời điểm nộp, Email nhận thông báo.
- Nút: **Đăng ký hồ sơ mới**.

### 8.5 Quy ước CSS (`Bai01.css`)
| Class | Dùng cho |
|---|---|
| `.bai01 .stepper`, `.step`, `.step.active`, `.step.done` | Thanh tiến trình |
| `.bai01 .card`, `.card-title` | Khối nhóm thông tin |
| `.bai01 .form-grid` | Lưới 2 cột (1 cột khi ≤ 768px) |
| `.bai01 .form-group`, `.form-group.full` | 1 trường; `.full` chiếm cả hàng |
| `.bai01 .required` | Dấu `*` đỏ |
| `.bai01 .hint` | Dòng gợi ý màu muted, chữ nhỏ |
| `.bai01 .input-error` | Viền đỏ cho input lỗi |
| `.bai01 .error-text` | Chữ lỗi đỏ, nhỏ, ngay dưới input |
| `.bai01 .radio-group` | Nhóm radio nằm ngang |
| `.bai01 .file-info`, `.avatar-preview` | Khối file đã chọn, ảnh xem trước |
| `.bai01 .char-count` | Bộ đếm ký tự, căn phải |
| `.bai01 .error-summary` | Hộp tóm tắt lỗi |
| `.bai01 .actions` | Hàng nút, căn phải |
| `.bai01 .btn`, `.btn-primary`, `.btn-secondary` | Nút |
| `.bai01 .review-table` | Bảng xác nhận |
| `.bai01 .success-box`, `.record-code` | Hộp thành công, mã hồ sơ |

Trạng thái `:focus` của input có viền `--color-primary`; nút `:disabled` mờ 50% và `cursor: not-allowed`.

---

## 9. Tổ chức code trong `Bai01.jsx`

Theo thứ tự (khung file như `claude.md` mục 5.1):

1. **Import**: `useState`, `useEffect`, `data`, CSS.
2. **Hằng số**: `RULES = data.rules`, `INITIAL_FORM`, `INITIAL_FILES`, `STEPS`, các regex `EMAIL_REGEX`, `PHONE_REGEX`, `NAME_REGEX`.
3. **Hàm thuần**:
   - `calcAge(dateOfBirth, admissionYear)`
   - `validateFile(file, rule, fieldLabel)` → chuỗi lỗi hoặc `''`
   - `validate(form, files)` → `errors`
   - `formatFileSize(bytes)`, `formatDate(yyyyMmDd)`
   - `getLabel(list, value)`
   - `generateRecordCode(year)`
4. **Component con** (cùng file):
   - `Field({ label, name, required, error, hint, full, children })` — bọc label + input + hint + lỗi
   - `Stepper({ step })`
   - `FileField({ name, label, file, rule, error, previewUrl, onChange, onRemove })`
   - `ReviewSection({ title, rows })` — bảng 2 cột
   - `SuccessBox({ form, result, onReset })`
5. **Component chính** `export default function Bai01()` — state, handler, render theo `step`.

Không viết logic tính toán trong JSX; JSX chỉ gọi hàm/biến đã tính sẵn.

---

## 10. Kịch bản kiểm thử (tự test trước khi nộp)

| # | Thao tác | Kết quả mong đợi |
|---|---|---|
| 1 | Bấm Đăng ký khi form trống | Tất cả trường bắt buộc báo lỗi, focus vào *Họ và tên*, hộp tóm tắt hiện số lỗi |
| 2 | Nhập đúng *Họ và tên* sau bước 1 | Lỗi của trường này tự biến mất |
| 3 | Họ tên `Nguyen123` | "chỉ được chứa chữ cái và khoảng trắng" |
| 4 | Email `abc@gmail` | "Email không đúng định dạng" |
| 5 | SĐT `0123456789` / `091234567` | Báo sai định dạng; `0912345678` và `+84912345678` hợp lệ |
| 6 | Ngày sinh khiến tuổi = 15, năm tuyển sinh 2026 | Báo lỗi tuổi |
| 7 | Đổi năm tuyển sinh làm tuổi vượt `maxAge` | Lỗi tuổi xuất hiện ở ô ngày sinh |
| 8 | Điểm `-1`, `10.5`, `8.555` | Lần lượt báo ngoài khoảng / ngoài khoảng / quá 2 chữ số thập phân; `0`, `10`, `8.25` hợp lệ |
| 9 | Chọn trường A + ngành, rồi đổi sang trường B | Ngành reset về rỗng, danh sách ngành đổi theo trường B |
| 10 | Ảnh đại diện là file `.gif` hoặc > 2 MB | Báo lỗi ngay khi chọn, không hiện ảnh xem trước |
| 11 | Học bạ PDF 1 MB | Hiện tên file + "1.0 MB", không lỗi |
| 12 | Nhập hợp lệ → Đăng ký | Sang màn hình xác nhận, hiển thị đúng label, ảnh, ngày `dd/MM/yyyy` |
| 13 | Quay lại chỉnh sửa | Toàn bộ dữ liệu và file vẫn còn, ảnh xem trước vẫn hiện |
| 14 | Xác nhận | Hiện thông báo thành công với mã `TS2026-xxxxxx` |
| 15 | Đăng ký hồ sơ mới | Form trống hoàn toàn, không còn lỗi, về bước ① |
| 16 | Ghi chú 501 ký tự | Bộ đếm chuyển đỏ, báo lỗi; có `maxLength` để không gõ quá |
| 17 | Thu nhỏ trình duyệt ≤ 768px | Lưới còn 1 cột, nút vẫn bấm được |
| 18 | Chuyển sang Bài 2 rồi quay lại Bài 1 | Bài 1 về trạng thái ban đầu (do `key`) |

---

## 11. Checklist hoàn thành

**Theo đề bài**
- [ ] 1. Kiểm tra các trường bắt buộc
- [ ] 2. Kiểm tra định dạng email
- [ ] 3. Kiểm tra số điện thoại đúng định dạng
- [ ] 4. Kiểm tra tuổi theo quy định giả lập (từ JSON)
- [ ] 5. Kiểm tra điểm trung bình 0 – 10
- [ ] 6. Kiểm tra dung lượng và định dạng file tải lên
- [ ] 7. Thông báo lỗi ngay dưới trường nhập liệu
- [ ] 8. Nhấn Đăng ký → hiển thị toàn bộ thông tin để xác nhận
- [ ] 9. Cho phép quay lại chỉnh sửa
- [ ] 10. Nhấn Xác nhận → thông báo đăng ký thành công

**Bổ sung để hoàn thiện**
- [ ] Ngành học phụ thuộc trường đăng ký
- [ ] Ảnh đại diện có xem trước, giải phóng URL khi đổi/xoá ảnh
- [ ] File vẫn được giữ khi quay lại chỉnh sửa
- [ ] Focus vào trường lỗi đầu tiên, có hộp tóm tắt lỗi
- [ ] Thanh tiến trình 3 bước, mã hồ sơ ở màn hình thành công
- [ ] Mọi danh mục & con số giới hạn lấy từ `Bai01.json`
- [ ] Mọi selector CSS bắt đầu bằng `.bai01`, dùng biến màu chung
- [ ] Không `alert`, không `console.log` thừa; `npm run lint` không lỗi
