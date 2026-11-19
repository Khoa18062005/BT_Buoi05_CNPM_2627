/*
 * ============================================================================
 * BÀI 1: XÂY DỰNG WEB ĐĂNG KÝ TUYỂN SINH
 * Đề bài: document/BAITAP_THUCHANHFOR(REACT).pdf — Đặc tả chi tiết: document/Bai01.md
 * ============================================================================
 *
 * CÁC NHÓM THÔNG TIN THEO ĐỀ (tìm "===== Thông tin" trong phần JSX bên dưới)
 *   - Thông tin cá nhân : Họ và tên, Ngày sinh, Giới tính, Số điện thoại, Email,
 *                         Địa chỉ thường trú
 *   - Thông tin đăng ký : Trường đăng ký, Ngành học, Hệ đào tạo, Năm tuyển sinh,
 *                         Điểm trung bình học tập
 *   - Thông tin bổ sung : Ảnh đại diện, File học bạ, Ghi chú
 *
 * CÁC CHỨC NĂNG THEO ĐỀ — mỗi yêu cầu được gắn nhãn [YCx] tại đúng chỗ xử lý,
 * tìm (Ctrl/Cmd + F) theo nhãn để xem code tương ứng:
 *   [YC1]  Kiểm tra các trường bắt buộc ............ validate(), handleSubmit()
 *   [YC2]  Kiểm tra định dạng email ................. EMAIL_REGEX, validate()
 *   [YC3]  Kiểm tra số điện thoại đúng định dạng .... PHONE_REGEX, validate()
 *   [YC4]  Kiểm tra tuổi theo quy định giả lập ...... calcAge(), validate()
 *                                                     (minAge/maxAge trong Bai01.json)
 *   [YC5]  Kiểm tra điểm trung bình trong 0–10 ...... validate()
 *   [YC6]  Kiểm tra dung lượng & định dạng file ..... validateFile(), handleFileChange()
 *                                                     (maxSizeMB/accept trong Bai01.json)
 *   [YC7]  Hiển thị lỗi ngay dưới trường nhập ....... <Field />, biến `errors`
 *   [YC8]  Nhấn Đăng ký → hiển thị toàn bộ thông tin
 *          để xác nhận ............................. handleSubmit(), reviewSections,
 *                                                     màn hình step === 'review'
 *   [YC9]  Cho phép quay lại chỉnh sửa ............... handleBackToEdit()
 *   [YC10] Nhấn Xác nhận → thông báo đăng ký
 *          thành công .............................. handleConfirm(), <SuccessBox />
 *
 * LUỒNG MÀN HÌNH (state `step`):
 *   'form' --Đăng ký (hợp lệ)--> 'review' --Xác nhận--> 'success'
 *     ^                             |                        |
 *     +------Quay lại chỉnh sửa-----+                        |
 *     +-------------------Đăng ký hồ sơ mới-------------------+
 *
 * Phần làm thêm ngoài đề (không gắn nhãn YC): ngành học phụ thuộc trường, ảnh
 * xem trước, thanh tiến trình 3 bước, focus vào trường lỗi đầu tiên, mã hồ sơ.
 * ============================================================================
 */

import { useEffect, useRef, useState } from 'react'
import data from '../data/Bai01.json'
import '../styles/Bai01.css'

// ==================== 1. HẰNG SỐ ====================
const RULES = data.rules

const INITIAL_FORM = {
  fullName: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  school: '',
  major: '',
  trainingSystem: '',
  admissionYear: '',
  gpa: '',
  note: '',
}

const INITIAL_FILES = { avatar: null, transcript: null }

const STEPS = [
  { key: 'form', label: 'Nhập thông tin' },
  { key: 'review', label: 'Xác nhận' },
  { key: 'success', label: 'Hoàn tất' },
]

// [YC2] Email: <tên>@<tên miền>.<đuôi>, không có khoảng trắng, chỉ một dấu @
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// [YC3] SĐT Việt Nam: bắt đầu 0 hoặc +84, đầu số di động 3/5/7/8/9, theo sau 8 chữ số
const PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)\d{8}$/
const NAME_REGEX = /^[\p{L}\s]+$/u
const GPA_DECIMAL_REGEX = /^\d+(\.\d{1,2})?$/

const FILE_LABELS = { avatar: 'Ảnh đại diện', transcript: 'File học bạ' }

// Ngày hôm nay dạng YYYY-MM-DD (giờ địa phương)
const NOW = new Date()
const TODAY_STR = [
  NOW.getFullYear(),
  String(NOW.getMonth() + 1).padStart(2, '0'),
  String(NOW.getDate()).padStart(2, '0'),
].join('-')

// ==================== 2. HÀM THUẦN ====================

// Tuổi tính đến 31/12 của năm tuyển sinh (chưa chọn năm thì lấy năm hiện tại).
// Đến 31/12 thì sinh nhật trong năm luôn đã qua → tuổi = năm tham chiếu - năm sinh.
// [YC4] Hàm tính tuổi phục vụ kiểm tra tuổi theo quy định giả lập
function calcAge(dateOfBirth, admissionYear) {
  if (!dateOfBirth) return null
  const birthYear = Number(dateOfBirth.slice(0, 4))
  const refYear = Number(admissionYear) || NOW.getFullYear()
  return refYear - birthYear
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// "2008-03-15" -> "15/03/2008"
function formatDate(value) {
  if (!value) return ''
  const [y, m, d] = value.split('-')
  return `${d}/${m}/${y}`
}

function getLabel(list, value) {
  return list.find((item) => String(item.value) === String(value))?.label ?? value
}

function generateRecordCode(year) {
  const random = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
  return `TS${year}-${random}`
}

// [YC6] Kiểm tra file tải lên: bắt buộc chọn → đúng định dạng (rule.accept)
//       → không vượt dung lượng (rule.maxSizeMB). Trả về chuỗi lỗi hoặc ''.
function validateFile(file, rule, label) {
  if (!file) {
    return label === FILE_LABELS.avatar
      ? 'Vui lòng chọn ảnh đại diện'
      : 'Vui lòng tải lên file học bạ'
  }
  if (!rule.accept.includes(file.type)) {
    return `${label} chỉ chấp nhận ${rule.acceptLabel}`
  }
  if (file.size > rule.maxSizeMB * 1024 * 1024) {
    return `${label} tối đa ${rule.maxSizeMB} MB (file hiện tại: ${formatFileSize(file.size)})`
  }
  return ''
}

// [YC1]–[YC6] Hàm kiểm tra toàn bộ form.
// Trả về { tenTruong: 'thông báo lỗi' } — mỗi trường chỉ 1 lỗi đầu tiên,
// thứ tự key theo thứ tự trường trên form (dùng để focus lỗi đầu tiên).
function validate(form, files) {
  const errors = {}

  // --- Thông tin cá nhân ---
  // [YC1] Mọi trường có dấu * đều kiểm tra rỗng trước (các dòng "Vui lòng ...")
  const fullName = form.fullName.trim()
  if (!fullName) errors.fullName = 'Vui lòng nhập họ và tên'
  else if (fullName.split(/\s+/).length < 2) errors.fullName = 'Họ và tên phải có ít nhất 2 từ'
  else if (!NAME_REGEX.test(fullName))
    errors.fullName = 'Họ và tên chỉ được chứa chữ cái và khoảng trắng'
  else if (fullName.length > RULES.fullNameMaxLength)
    errors.fullName = `Họ và tên tối đa ${RULES.fullNameMaxLength} ký tự`

  // [YC4] Ngày sinh: bắt buộc, không ở tương lai, tuổi trong [minAge, maxAge]
  if (!form.dateOfBirth) errors.dateOfBirth = 'Vui lòng chọn ngày sinh'
  else if (form.dateOfBirth > TODAY_STR)
    errors.dateOfBirth = 'Ngày sinh không được lớn hơn ngày hiện tại'
  else {
    const age = calcAge(form.dateOfBirth, form.admissionYear)
    if (age < RULES.minAge || age > RULES.maxAge) {
      const refYear = form.admissionYear || NOW.getFullYear()
      errors.dateOfBirth = `Thí sinh phải từ ${RULES.minAge} đến ${RULES.maxAge} tuổi (tính đến 31/12/${refYear}), hiện tại: ${age} tuổi`
    }
  }

  if (!form.gender) errors.gender = 'Vui lòng chọn giới tính'

  // [YC3] Số điện thoại (bỏ khoảng trắng trước khi so với PHONE_REGEX)
  const phone = form.phone.replace(/\s+/g, '')
  if (!phone) errors.phone = 'Vui lòng nhập số điện thoại'
  else if (!PHONE_REGEX.test(phone))
    errors.phone = 'Số điện thoại không đúng định dạng (VD: 0912345678)'

  // [YC2] Email
  const email = form.email.trim()
  if (!email) errors.email = 'Vui lòng nhập email'
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Email không đúng định dạng (VD: ten@gmail.com)'

  const address = form.address.trim()
  if (!address) errors.address = 'Vui lòng nhập địa chỉ thường trú'
  else if (address.length > RULES.addressMaxLength)
    errors.address = `Địa chỉ tối đa ${RULES.addressMaxLength} ký tự`

  // --- Thông tin đăng ký ---
  if (!form.school) errors.school = 'Vui lòng chọn trường đăng ký'
  if (!form.major) errors.major = 'Vui lòng chọn ngành học'
  if (!form.trainingSystem) errors.trainingSystem = 'Vui lòng chọn hệ đào tạo'
  if (!form.admissionYear) errors.admissionYear = 'Vui lòng chọn năm tuyển sinh'

  // [YC5] Điểm trung bình: bắt buộc, là số, nằm trong 0–10, tối đa 2 chữ số thập phân
  const gpa = String(form.gpa).trim()
  if (gpa === '') errors.gpa = 'Vui lòng nhập điểm trung bình'
  else if (Number.isNaN(Number(gpa))) errors.gpa = 'Điểm trung bình phải là số'
  else if (Number(gpa) < RULES.gpaMin || Number(gpa) > RULES.gpaMax)
    errors.gpa = `Điểm trung bình phải nằm trong khoảng ${RULES.gpaMin} – ${RULES.gpaMax}`
  else if (!GPA_DECIMAL_REGEX.test(gpa))
    errors.gpa = 'Điểm trung bình tối đa 2 chữ số thập phân'

  // --- Thông tin bổ sung ---
  // [YC6] Ảnh đại diện & file học bạ
  const avatarError = validateFile(files.avatar, RULES.avatar, FILE_LABELS.avatar)
  if (avatarError) errors.avatar = avatarError

  const transcriptError = validateFile(files.transcript, RULES.transcript, FILE_LABELS.transcript)
  if (transcriptError) errors.transcript = transcriptError

  if (form.note.length > RULES.noteMaxLength)
    errors.note = `Ghi chú tối đa ${RULES.noteMaxLength} ký tự`

  return errors
}

// ==================== 3. COMPONENT CON ====================

function Stepper({ step }) {
  const currentIndex = STEPS.findIndex((s) => s.key === step)
  const allDone = step === 'success'

  return (
    <ol className="stepper">
      {STEPS.map((s, index) => {
        const done = index < currentIndex || allDone
        const active = index === currentIndex && !allDone
        const className = ['step', done && 'done', active && 'active'].filter(Boolean).join(' ')
        return (
          <li key={s.key} className={className}>
            <span className="step-number">{done ? '✓' : index + 1}</span>
            <span className="step-label">{s.label}</span>
          </li>
        )
      })}
    </ol>
  )
}

function Field({ label, name, required, error, hint, span = 3, children }) {
  return (
    <div id={`field-${name}`} className={`form-group span-${span}`}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="hint">{hint}</p>}
      {/* [YC7] Thông báo lỗi hiển thị ngay bên dưới trường nhập liệu */}
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}

function FileField({ name, label, file, rule, error, previewUrl, onChange, onRemove }) {
  return (
    <Field
      label={label}
      name={name}
      span={3}
      required
      error={error}
      hint={`Định dạng ${rule.acceptLabel} – tối đa ${rule.maxSizeMB} MB`}
    >
      <input
        id={name}
        name={name}
        type="file"
        className="visually-hidden"
        accept={rule.accept.join(',')}
        onChange={onChange}
      />
      {file ? (
        <div className={error ? 'file-info has-error' : 'file-info'}>
          {previewUrl && !error && (
            <img src={previewUrl} alt="Ảnh đại diện xem trước" className="avatar-preview" />
          )}
          <div className="file-meta">
            <span className="file-name" title={file.name}>
              {file.name}
            </span>
            <span className="file-size">{formatFileSize(file.size)}</span>
          </div>
          <div className="file-actions">
            <label htmlFor={name} className="btn btn-small btn-secondary">
              Đổi file
            </label>
            <button type="button" className="btn btn-small btn-danger" onClick={() => onRemove(name)}>
              Xoá
            </button>
          </div>
        </div>
      ) : (
        <label htmlFor={name} className={error ? 'file-drop input-error' : 'file-drop'}>
          <span className="file-drop-icon">📎</span>
          <span>Bấm để chọn file</span>
        </label>
      )}
    </Field>
  )
}

function ReviewSection({ title, rows }) {
  return (
    <section className="card">
      <h3 className="card-title">{title}</h3>
      <table className="review-table">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

// [YC10] Hộp thông báo đăng ký thành công
function SuccessBox({ form, result, onReset }) {
  return (
    <div className="success-box">
      <div className="success-icon">✓</div>
      <h3>Đăng ký tuyển sinh thành công!</h3>
      <p>
        Cảm ơn <strong>{form.fullName.trim()}</strong>. Hồ sơ của bạn đã được ghi nhận.
      </p>

      <div className="record-code">
        <span>Mã hồ sơ</span>
        <strong>{result.code}</strong>
      </div>

      <dl className="success-info">
        <dt>Trường – Ngành</dt>
        <dd>
          {getLabel(data.schools, form.school)} –{' '}
          {getLabel(data.schools.find((s) => s.value === form.school)?.majors ?? [], form.major)}
        </dd>
        <dt>Hệ đào tạo</dt>
        <dd>{getLabel(data.trainingSystems, form.trainingSystem)}</dd>
        <dt>Năm tuyển sinh</dt>
        <dd>{form.admissionYear}</dd>
        <dt>Thời điểm nộp</dt>
        <dd>{result.submittedAt}</dd>
        <dt>Email nhận thông báo</dt>
        <dd>{form.email.trim()}</dd>
      </dl>

      <div className="actions center">
        <button type="button" className="btn btn-primary" onClick={onReset}>
          Đăng ký hồ sơ mới
        </button>
      </div>
    </div>
  )
}

// ==================== 4. COMPONENT CHÍNH ====================

export default function Bai01() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [files, setFiles] = useState(INITIAL_FILES)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [step, setStep] = useState('form')
  const [result, setResult] = useState(null)

  // Giữ URL ảnh xem trước hiện tại để giải phóng khi đổi ảnh / rời trang
  const avatarUrlRef = useRef('')

  useEffect(() => {
    return () => {
      if (avatarUrlRef.current) URL.revokeObjectURL(avatarUrlRef.current)
    }
  }, [])

  // ---- Giá trị tính ra (không lưu state) ----
  const majors = data.schools.find((s) => s.value === form.school)?.majors ?? []
  const allErrors = validate(form, files)
  const errorCount = Object.keys(allErrors).length

  // [YC7] Quyết định lỗi nào được hiện dưới từng trường:
  // Trước khi bấm Đăng ký: chỉ báo lỗi file ngay khi đã chọn file.
  // Sau khi bấm Đăng ký: hiển thị mọi lỗi và tự cập nhật khi người dùng sửa.
  const errors = submitted
    ? allErrors
    : Object.fromEntries(
        Object.entries(allErrors).filter(([key]) => key in files && files[key]),
      )

  const age = calcAge(form.dateOfBirth, form.admissionYear)

  // ---- Handlers ----
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const replaceAvatarUrl = (file) => {
    if (avatarUrlRef.current) URL.revokeObjectURL(avatarUrlRef.current)
    const url = file && file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
    avatarUrlRef.current = url
    setAvatarUrl(url)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => {
      const next = { ...prev, [name]: value }
      if (name === 'school') next.major = '' // đổi trường → reset ngành
      return next
    })
  }

  // [YC6] Chọn file xong là kiểm tra ngay (lỗi file hiện liền, không chờ bấm Đăng ký)
  const handleFileChange = (e) => {
    const { name } = e.target
    const file = e.target.files[0] ?? null
    e.target.value = '' // cho phép chọn lại cùng một file
    if (!file) return
    setFiles((prev) => ({ ...prev, [name]: file }))
    if (name === 'avatar') replaceAvatarUrl(file)
  }

  const handleRemoveFile = (name) => {
    setFiles((prev) => ({ ...prev, [name]: null }))
    if (name === 'avatar') replaceAvatarUrl(null)
  }

  const focusField = (name) => {
    document
      .getElementById(`field-${name}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    document.getElementById(name)?.focus({ preventScroll: true })
  }

  // [YC1] + [YC8] Nhấn Đăng ký: kiểm tra toàn bộ form.
  //   - Có lỗi  → hiện lỗi dưới từng trường, đưa con trỏ tới trường lỗi đầu tiên.
  //   - Hợp lệ → chuyển sang màn hình xác nhận thông tin.
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    const firstError = Object.keys(validate(form, files))[0]
    if (firstError) {
      focusField(firstError)
      return
    }
    setStep('review')
    scrollToTop()
  }

  const handleReset = () => {
    replaceAvatarUrl(null)
    setForm(INITIAL_FORM)
    setFiles(INITIAL_FILES)
    setSubmitted(false)
    setResult(null)
    setStep('form')
    scrollToTop()
  }

  // [YC9] Quay lại chỉnh sửa: chỉ đổi màn hình, giữ nguyên dữ liệu & file đã nhập
  const handleBackToEdit = () => {
    setStep('form')
    scrollToTop()
  }

  // [YC10] Nhấn Xác nhận: tạo mã hồ sơ + thời điểm nộp, chuyển sang màn hình thành công
  const handleConfirm = () => {
    setResult({
      code: generateRecordCode(form.admissionYear),
      submittedAt: new Date().toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    })
    setStep('success')
    scrollToTop()
  }

  // ---- [YC8] Dữ liệu cho màn hình xác nhận: đủ 3 nhóm, hiển thị nhãn (không phải mã) ----
  const reviewSections = [
    {
      title: 'Thông tin cá nhân',
      rows: [
        { label: 'Họ và tên', value: form.fullName.trim() },
        { label: 'Ngày sinh', value: `${formatDate(form.dateOfBirth)} (${age} tuổi)` },
        { label: 'Giới tính', value: getLabel(data.genders, form.gender) },
        { label: 'Số điện thoại', value: form.phone.replace(/\s+/g, '') },
        { label: 'Email', value: form.email.trim() },
        { label: 'Địa chỉ thường trú', value: form.address.trim() },
      ],
    },
    {
      title: 'Thông tin đăng ký',
      rows: [
        { label: 'Trường đăng ký', value: getLabel(data.schools, form.school) },
        { label: 'Ngành học', value: getLabel(majors, form.major) },
        { label: 'Hệ đào tạo', value: getLabel(data.trainingSystems, form.trainingSystem) },
        { label: 'Năm tuyển sinh', value: form.admissionYear },
        {
          label: 'Điểm trung bình',
          value: form.gpa === '' ? '' : Number(form.gpa).toFixed(2),
        },
      ],
    },
    {
      title: 'Thông tin bổ sung',
      rows: [
        {
          label: 'Ảnh đại diện',
          value: avatarUrl ? (
            <img src={avatarUrl} alt="Ảnh đại diện" className="avatar-preview" />
          ) : (
            ''
          ),
        },
        {
          label: 'File học bạ',
          value: files.transcript
            ? `${files.transcript.name} (${formatFileSize(files.transcript.size)})`
            : '',
        },
        {
          label: 'Ghi chú',
          value: form.note.trim() ? (
            <span className="pre-line">{form.note.trim()}</span>
          ) : (
            <span className="muted">(Không có)</span>
          ),
        },
      ],
    },
  ]

  // ---- Render ----
  return (
    <div className="bai01">
      <h2>Bài 1: Đăng ký tuyển sinh</h2>
      <p className="subtitle">
        {step === 'form' && 'Điền đầy đủ thông tin bên dưới. Các trường có dấu * là bắt buộc.'}
        {step === 'review' && 'Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.'}
        {step === 'success' && 'Hồ sơ đăng ký đã được gửi thành công.'}
      </p>

      <Stepper step={step} />

      {step === 'form' && (
        <form onSubmit={handleSubmit} noValidate>
          {/* ===== Thông tin cá nhân (đề: Họ tên, Ngày sinh, Giới tính, SĐT, Email, Địa chỉ) ===== */}
          <section className="card">
            <h3 className="card-title">Thông tin cá nhân</h3>
            <div className="form-grid">
              <Field label="Họ và tên" name="fullName" span={4} required error={errors.fullName}>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="VD: Nguyễn Văn An"
                  maxLength={RULES.fullNameMaxLength}
                  value={form.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'input-error' : ''}
                />
              </Field>

              <Field label="Giới tính" name="gender" span={2} required error={errors.gender}>
                <div className={errors.gender ? 'radio-group input-error' : 'radio-group'}>
                  {data.genders.map((g, index) => (
                    <label key={g.value} className="radio-item">
                      <input
                        id={index === 0 ? 'gender' : undefined}
                        type="radio"
                        name="gender"
                        value={g.value}
                        checked={form.gender === g.value}
                        onChange={handleChange}
                      />
                      {g.label}
                    </label>
                  ))}
                </div>
              </Field>

              <Field
                label="Ngày sinh"
                name="dateOfBirth"
                span={2}
                required
                error={errors.dateOfBirth}
                hint={`Thí sinh từ ${RULES.minAge} đến ${RULES.maxAge} tuổi tính đến 31/12 năm tuyển sinh`}
              >
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  max={TODAY_STR}
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className={errors.dateOfBirth ? 'input-error' : ''}
                />
              </Field>

              <Field label="Số điện thoại" name="phone" span={2} required error={errors.phone}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="VD: 0912345678"
                  maxLength={15}
                  value={form.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'input-error' : ''}
                />
              </Field>

              <Field label="Email" name="email" span={2} required error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="VD: ten@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                />
              </Field>

              <Field label="Địa chỉ thường trú" name="address" span={6} required error={errors.address}>
                <textarea
                  id="address"
                  name="address"
                  rows={2}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  maxLength={RULES.addressMaxLength}
                  value={form.address}
                  onChange={handleChange}
                  className={errors.address ? 'input-error' : ''}
                />
              </Field>
            </div>
          </section>

          {/* ===== Thông tin đăng ký (đề: Trường, Ngành, Hệ đào tạo, Năm tuyển sinh, Điểm TB) ===== */}
          <section className="card">
            <h3 className="card-title">Thông tin đăng ký</h3>
            <div className="form-grid">
              <Field label="Trường đăng ký" name="school" span={3} required error={errors.school}>
                <select
                  id="school"
                  name="school"
                  value={form.school}
                  onChange={handleChange}
                  className={errors.school ? 'input-error' : ''}
                >
                  <option value="">-- Chọn trường --</option>
                  {data.schools.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Ngành học"
                name="major"
                span={3}
                required
                error={errors.major}
                hint={!form.school ? 'Vui lòng chọn trường trước' : ''}
              >
                <select
                  id="major"
                  name="major"
                  value={form.major}
                  onChange={handleChange}
                  disabled={!form.school}
                  className={errors.major ? 'input-error' : ''}
                >
                  <option value="">-- Chọn ngành --</option>
                  {majors.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Hệ đào tạo" name="trainingSystem" span={2} required error={errors.trainingSystem}>
                <select
                  id="trainingSystem"
                  name="trainingSystem"
                  value={form.trainingSystem}
                  onChange={handleChange}
                  className={errors.trainingSystem ? 'input-error' : ''}
                >
                  <option value="">-- Chọn hệ đào tạo --</option>
                  {data.trainingSystems.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Năm tuyển sinh" name="admissionYear" span={2} required error={errors.admissionYear}>
                <select
                  id="admissionYear"
                  name="admissionYear"
                  value={form.admissionYear}
                  onChange={handleChange}
                  className={errors.admissionYear ? 'input-error' : ''}
                >
                  <option value="">-- Chọn năm --</option>
                  {data.admissionYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Điểm trung bình học tập"
                name="gpa"
                span={2}
                required
                error={errors.gpa}
                hint={`Thang điểm ${RULES.gpaMin} – ${RULES.gpaMax}, tối đa 2 chữ số thập phân`}
              >
                <input
                  id="gpa"
                  name="gpa"
                  type="number"
                  step="0.01"
                  min={RULES.gpaMin}
                  max={RULES.gpaMax}
                  placeholder="VD: 8.25"
                  value={form.gpa}
                  onChange={handleChange}
                  className={errors.gpa ? 'input-error' : ''}
                />
              </Field>
            </div>
          </section>

          {/* ===== Thông tin bổ sung (đề: Ảnh đại diện, File học bạ, Ghi chú) ===== */}
          <section className="card">
            <h3 className="card-title">Thông tin bổ sung</h3>
            <div className="form-grid">
              <FileField
                name="avatar"
                label={FILE_LABELS.avatar}
                file={files.avatar}
                rule={RULES.avatar}
                error={errors.avatar}
                previewUrl={avatarUrl}
                onChange={handleFileChange}
                onRemove={handleRemoveFile}
              />

              <FileField
                name="transcript"
                label={FILE_LABELS.transcript}
                file={files.transcript}
                rule={RULES.transcript}
                error={errors.transcript}
                onChange={handleFileChange}
                onRemove={handleRemoveFile}
              />

              <Field label="Ghi chú" name="note" span={6} error={errors.note}>
                <textarea
                  id="note"
                  name="note"
                  rows={3}
                  placeholder="Thông tin thêm (nếu có)"
                  maxLength={RULES.noteMaxLength}
                  value={form.note}
                  onChange={handleChange}
                  className={errors.note ? 'input-error' : ''}
                />
                <span
                  className={
                    form.note.length >= RULES.noteMaxLength ? 'char-count over' : 'char-count'
                  }
                >
                  {form.note.length}/{RULES.noteMaxLength}
                </span>
              </Field>
            </div>
          </section>

          {submitted && errorCount > 0 && (
            <div className="error-summary" role="alert">
              Vui lòng kiểm tra lại <strong>{errorCount}</strong> trường thông tin chưa hợp lệ.
            </div>
          )}

          <div className="actions">
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Làm lại
            </button>
            <button type="submit" className="btn btn-primary">
              Đăng ký
            </button>
          </div>
        </form>
      )}

      {/* [YC8] Màn hình xác nhận toàn bộ thông tin — [YC9] nút Quay lại chỉnh sửa */}
      {step === 'review' && (
        <>
          {reviewSections.map((section) => (
            <ReviewSection key={section.title} title={section.title} rows={section.rows} />
          ))}
          <div className="actions">
            <button type="button" className="btn btn-secondary" onClick={handleBackToEdit}>
              ← Quay lại chỉnh sửa
            </button>
            <button type="button" className="btn btn-primary" onClick={handleConfirm}>
              Xác nhận
            </button>
          </div>
        </>
      )}

      {/* [YC10] Thông báo đăng ký thành công */}
      {step === 'success' && result && (
        <SuccessBox form={form} result={result} onReset={handleReset} />
      )}
    </div>
  )
}
