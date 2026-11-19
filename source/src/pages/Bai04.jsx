/*
 * ============================================================================
 * BÀI 4: XÂY DỰNG WEB THÊM MỚI NHÂN VIÊN
 * Đề bài: document/BAITAP_THUCHANHFOR(REACT).pdf — Dữ liệu mẫu: src/data/Bai04.json
 * ============================================================================
 *
 * CÁC NHÓM THÔNG TIN THEO ĐỀ (tìm "===== Thông tin" trong phần JSX bên dưới)
 *   - Thông tin cá nhân  : Mã nhân viên, Họ tên, Ngày sinh, Giới tính, Email,
 *                          Số điện thoại, Địa chỉ
 *   - Thông tin công việc: Phòng ban, Chức vụ, Ngày bắt đầu làm việc, Loại hợp đồng,
 *                          Mức lương, Trạng thái làm việc
 *   - Thông tin bổ sung  : Kỹ năng chuyên môn, Ngoại ngữ, Chứng chỉ, Ảnh nhân viên
 *
 * CÁC CHỨC NĂNG THEO ĐỀ — mỗi yêu cầu được gắn nhãn [YCx] tại đúng chỗ xử lý,
 * tìm (Ctrl/Cmd + F) theo nhãn để xem code tương ứng:
 *   [YC1]  Kiểm tra mã nhân viên không được để trống ...... validate()
 *   [YC2]  Kiểm tra email đúng định dạng .................. EMAIL_REGEX, validate()
 *   [YC3]  Kiểm tra mức lương lớn hơn 0 ................... validate(), ô Mức lương
 *   [YC4]  Kiểm tra ngày bắt đầu làm việc ................. validate()
 *                                                          (giới hạn trong Bai04.json)
 *   [YC5]  Chọn phòng ban → hiển thị chức vụ tương ứng .... `positions`, handleChange()
 *   [YC6]  Hợp đồng thời vụ → hiện thêm ngày kết thúc HĐ .. `isSeasonal`, handleChange(),
 *                                                          validate()
 *   [YC7]  Cho phép chọn nhiều kỹ năng chuyên môn ......... toggleInList(), <ChipGroup />
 *   [YC8]  Cho phép thêm nhiều chứng chỉ .................. addCertificate(),
 *                                                          updateCertificate(),
 *                                                          removeCertificate()
 *   [YC9]  Kiểm tra trùng mã nhân viên trong dữ liệu mẫu .. findDuplicate(), state `employees`
 *                                                          (báo: "Mã NVxxx đã được sử dụng")
 *   [YC10] Hiển thị thông tin nhân viên sau khi lưu ....... handleSubmit(), <EmployeeProfile />,
 *                                                          màn hình step === 'saved'
 *
 * LUỒNG MÀN HÌNH (state `step`):
 *   'form' --Lưu nhân viên (hợp lệ)--> 'saved' --Thêm nhân viên khác--> 'form'
 *
 * Phần làm thêm ngoài đề (không gắn nhãn YC): gợi ý mã nhân viên tiếp theo, kiểm tra
 * họ tên/SĐT/tuổi, ảnh xem trước, danh sách nhân viên hiện có, focus trường lỗi đầu tiên.
 * ============================================================================
 */

import { useEffect, useRef, useState } from 'react'
import data from '../data/Bai04.json'
import '../styles/Bai04.css'

// ==================== 1. HẰNG SỐ ====================
const RULES = data.rules

const INITIAL_FORM = {
  // Thông tin cá nhân
  employeeCode: '',
  fullName: '',
  dateOfBirth: '',
  gender: '',
  email: '',
  phone: '',
  address: '',
  // Thông tin công việc
  department: '',
  position: '',
  startDate: '',
  contractType: '',
  endDate: '',
  salary: '',
  status: '',
  // Thông tin bổ sung
  skills: [],
  languages: [],
}

// [YC1] + [YC9] Định dạng mã nhân viên lấy từ JSON (VD: NV + 3 chữ số)
const EMPLOYEE_CODE_REGEX = new RegExp(RULES.employeeCodePattern)
// [YC2] Email: <tên>@<tên miền>.<đuôi>, không có khoảng trắng, chỉ một dấu @
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)\d{8}$/
const NAME_REGEX = /^[\p{L}\s]+$/u

// Ngày hôm nay (giờ địa phương)
const NOW = new Date()
const TODAY = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate())

// ==================== 2. HÀM THUẦN ====================

// "YYYY-MM-DD" -> Date (giờ địa phương, tránh lệch múi giờ của new Date(string))
function parseDate(value) {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// Date -> "YYYY-MM-DD"
function toDateStr(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

function addYears(value, years) {
  const d = parseDate(value)
  return toDateStr(new Date(d.getFullYear() + years, d.getMonth(), d.getDate()))
}

function addMonths(value, months) {
  const d = parseDate(value)
  return toDateStr(new Date(d.getFullYear(), d.getMonth() + months, d.getDate()))
}

function addDays(date, days) {
  return toDateStr(new Date(date.getFullYear(), date.getMonth(), date.getDate() + days))
}

const TODAY_STR = toDateStr(TODAY)
const MAX_START_DATE = addDays(TODAY, RULES.maxFutureStartDays)

// "2005-06-18" -> "18/06/2005"
function formatDate(value) {
  if (!value) return ''
  const [y, m, d] = value.split('-')
  return `${d}/${m}/${y}`
}

function calcAge(dateOfBirth) {
  const dob = parseDate(dateOfBirth)
  let age = TODAY.getFullYear() - dob.getFullYear()
  const hadBirthday =
    TODAY.getMonth() > dob.getMonth() ||
    (TODAY.getMonth() === dob.getMonth() && TODAY.getDate() >= dob.getDate())
  if (!hadBirthday) age -= 1
  return age
}

function formatMoney(value) {
  return `${new Intl.NumberFormat('vi-VN').format(value)} đ`
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getLabel(list, value) {
  return list.find((item) => item.value === value)?.label ?? value
}

function getInitials(fullName) {
  const words = fullName.trim().split(/\s+/)
  return (words.length > 1 ? words[0][0] + words.at(-1)[0] : words[0][0] ?? '').toUpperCase()
}

// Chuẩn hoá mã: bỏ khoảng trắng hai đầu, viết hoa
function normalizeCode(code) {
  return code.trim().toUpperCase()
}

// [YC9] Tìm nhân viên đã có cùng mã trong danh sách (không phân biệt hoa/thường)
function findDuplicate(code, employees) {
  const normalized = normalizeCode(code)
  if (!normalized) return null
  return employees.find((e) => normalizeCode(e.employeeCode) === normalized) ?? null
}

// Gợi ý mã tiếp theo = số lớn nhất hiện có + 1 (VD: NV007 -> NV008)
function suggestNextCode(employees) {
  const max = employees.reduce((acc, e) => {
    const n = Number(e.employeeCode.replace(/\D/g, ''))
    return Number.isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `NV${String(max + 1).padStart(3, '0')}`
}

// [YC6] Loại hợp đồng có cần ngày kết thúc không (cấu hình "requiresEndDate" trong JSON)
function needsEndDate(contractType) {
  return Boolean(data.contractTypes.find((c) => c.value === contractType)?.requiresEndDate)
}

function validateAvatar(file) {
  if (!file) return '' // ảnh không bắt buộc
  const rule = RULES.avatar
  if (!rule.accept.includes(file.type)) return `Ảnh nhân viên chỉ chấp nhận ${rule.acceptLabel}`
  if (file.size > rule.maxSizeMB * 1024 * 1024) {
    return `Ảnh tối đa ${rule.maxSizeMB} MB (file hiện tại: ${formatFileSize(file.size)})`
  }
  return ''
}

// Kiểm tra toàn bộ form. Trả về { tenTruong: 'thông báo lỗi' },
// thứ tự key theo thứ tự trên form (dùng để focus vào lỗi đầu tiên).
function validate(form, certificates, avatar, employees) {
  const errors = {}

  // ----- Thông tin cá nhân -----

  // [YC1] Mã nhân viên không được để trống
  // [YC9] Mã nhân viên không được trùng với danh sách dữ liệu mẫu (+ nhân viên đã lưu)
  const code = normalizeCode(form.employeeCode)
  if (!code) {
    errors.employeeCode = 'Vui lòng nhập mã nhân viên'
  } else if (!EMPLOYEE_CODE_REGEX.test(code)) {
    errors.employeeCode = `Mã nhân viên gồm "NV" và 3 chữ số (VD: ${RULES.employeeCodeExample})`
  } else {
    const duplicate = findDuplicate(code, employees)
    if (duplicate) {
      errors.employeeCode = `Mã ${code} đã được sử dụng`
    }
  }

  const fullName = form.fullName.trim()
  if (!fullName) errors.fullName = 'Vui lòng nhập họ tên'
  else if (fullName.split(/\s+/).length < 2) errors.fullName = 'Họ tên phải có ít nhất 2 từ'
  else if (!NAME_REGEX.test(fullName)) errors.fullName = 'Họ tên chỉ được chứa chữ cái và khoảng trắng'

  if (!form.dateOfBirth) errors.dateOfBirth = 'Vui lòng chọn ngày sinh'
  else if (form.dateOfBirth > TODAY_STR) errors.dateOfBirth = 'Ngày sinh không được ở tương lai'
  else {
    const age = calcAge(form.dateOfBirth)
    if (age < RULES.minAge || age > RULES.maxAge) {
      errors.dateOfBirth = `Nhân viên phải từ ${RULES.minAge} đến ${RULES.maxAge} tuổi (hiện tại: ${age} tuổi)`
    }
  }

  if (!form.gender) errors.gender = 'Vui lòng chọn giới tính'

  // [YC2] Email đúng định dạng
  const email = form.email.trim()
  if (!email) errors.email = 'Vui lòng nhập email'
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Email không đúng định dạng (VD: ten@congty.vn)'

  const phone = form.phone.replace(/\s+/g, '')
  if (!phone) errors.phone = 'Vui lòng nhập số điện thoại'
  else if (!PHONE_REGEX.test(phone)) errors.phone = 'Số điện thoại không đúng định dạng'

  if (!form.address.trim()) errors.address = 'Vui lòng nhập địa chỉ'

  // ----- Thông tin công việc -----

  if (!form.department) errors.department = 'Vui lòng chọn phòng ban'
  // [YC5] Chức vụ phải thuộc phòng ban đã chọn
  if (!form.position) errors.position = 'Vui lòng chọn chức vụ'

  // [YC4] Kiểm tra ngày bắt đầu làm việc:
  //   - bắt buộc
  //   - không sớm hơn ngày thành lập giả lập (earliestStartDate)
  //   - không quá xa trong tương lai (tối đa maxFutureStartDays ngày kể từ hôm nay)
  //   - nhân viên phải đủ minAge tuổi vào ngày bắt đầu
  if (!form.startDate) {
    errors.startDate = 'Vui lòng chọn ngày bắt đầu làm việc'
  } else if (form.startDate < RULES.earliestStartDate) {
    errors.startDate = `Ngày bắt đầu không được trước ${formatDate(RULES.earliestStartDate)}`
  } else if (form.startDate > MAX_START_DATE) {
    errors.startDate = `Ngày bắt đầu tối đa ${RULES.maxFutureStartDays} ngày kể từ hôm nay (đến ${formatDate(MAX_START_DATE)})`
  } else if (form.dateOfBirth && form.dateOfBirth <= TODAY_STR) {
    const adultDate = addYears(form.dateOfBirth, RULES.minAge)
    if (form.startDate < adultDate) {
      errors.startDate = `Ngày bắt đầu phải từ ${formatDate(adultDate)} (khi nhân viên đủ ${RULES.minAge} tuổi)`
    }
  }

  if (!form.contractType) errors.contractType = 'Vui lòng chọn loại hợp đồng'

  // [YC6] Hợp đồng thời vụ: bắt buộc ngày kết thúc, sau ngày bắt đầu, tối đa maxSeasonalMonths tháng
  if (needsEndDate(form.contractType)) {
    if (!form.endDate) {
      errors.endDate = 'Vui lòng chọn ngày kết thúc'
    } else if (form.startDate && form.endDate <= form.startDate) {
      errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu làm việc'
    } else if (form.startDate && form.endDate > addMonths(form.startDate, RULES.maxSeasonalMonths)) {
      errors.endDate = `Hợp đồng thời vụ tối đa ${RULES.maxSeasonalMonths} tháng (đến ${formatDate(addMonths(form.startDate, RULES.maxSeasonalMonths))})`
    }
  }

  // [YC3] Mức lương phải lớn hơn 0
  const salary = String(form.salary).trim()
  if (salary === '') errors.salary = 'Vui lòng nhập mức lương'
  else if (Number.isNaN(Number(salary))) errors.salary = 'Mức lương phải là số'
  else if (Number(salary) <= 0) errors.salary = 'Mức lương phải lớn hơn 0'
  else if (!Number.isInteger(Number(salary))) errors.salary = 'Mức lương phải là số nguyên (đơn vị: đồng)'
  else if (Number(salary) > RULES.maxSalary)
    errors.salary = `Mức lương tối đa ${formatMoney(RULES.maxSalary)}`

  if (!form.status) errors.status = 'Vui lòng chọn trạng thái làm việc'

  // ----- Thông tin bổ sung -----

  // [YC8] Mỗi chứng chỉ đã thêm phải có tên; năm cấp (nếu nhập) phải hợp lệ
  certificates.forEach((cert) => {
    if (!cert.name.trim()) errors[`cert-${cert.id}-name`] = 'Vui lòng nhập tên chứng chỉ hoặc xoá dòng này'
    if (cert.year !== '') {
      const year = Number(cert.year)
      if (!Number.isInteger(year) || year < RULES.minCertificateYear || year > TODAY.getFullYear()) {
        errors[`cert-${cert.id}-year`] = `Năm cấp từ ${RULES.minCertificateYear} đến ${TODAY.getFullYear()}`
      }
    }
  })

  const avatarError = validateAvatar(avatar)
  if (avatarError) errors.avatar = avatarError

  return errors
}

// ==================== 3. COMPONENT CON ====================

function Field({ label, name, required, error, hint, span = 3, className = '', children }) {
  return (
    <div id={`field-${name}`} className={`form-group span-${span} ${className}`.trim()}>
      {/* Hàng tiêu đề: tên trường bên trái, gợi ý ngắn ở góc phải phía trên ô nhập */}
      <div className="label-row">
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required"> *</span>}
        </label>
        {/* title: rê chuột xem đủ nội dung khi gợi ý bị cắt "…" ở cột hẹp */}
        {hint && (
          <span className="hint" title={typeof hint === 'string' ? hint : undefined}>
            {hint}
          </span>
        )}
      </div>
      {children}
      {/* Thông báo lỗi hiển thị ngay bên dưới trường nhập liệu */}
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}

// [YC7] Nhóm ô chọn nhiều (checkbox) — dùng cho Kỹ năng chuyên môn và Ngoại ngữ
function ChipGroup({ name, options, selected, onToggle }) {
  return (
    <div className="chip-group" role="group" aria-label={name}>
      {options.map((option, index) => (
        <label key={option} className="chip">
          <input
            id={index === 0 ? name : undefined}
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onToggle(name, option)}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  )
}

function AvatarField({ file, previewUrl, error, onChange, onRemove }) {
  const rule = RULES.avatar
  return (
    <Field
      label="Ảnh nhân viên"
      name="avatar"
      span={2}
      className="row-span-2"
      error={error}
      hint={`${rule.acceptLabel}, tối đa ${rule.maxSizeMB} MB`}
    >
      <input
        id="avatar"
        name="avatar"
        type="file"
        className="visually-hidden"
        accept={rule.accept.join(',')}
        onChange={onChange}
      />
      {file ? (
        <div className={error ? 'avatar-box has-error' : 'avatar-box'}>
          {previewUrl && !error ? (
            <img src={previewUrl} alt="Ảnh nhân viên xem trước" className="avatar-preview" />
          ) : (
            <span className="avatar-placeholder" aria-hidden="true" />
          )}
          <span className="file-name" title={file.name}>
            {file.name}
          </span>
          <span className="file-size">{formatFileSize(file.size)}</span>
          <div className="file-actions">
            <label htmlFor="avatar" className="btn btn-small btn-secondary">
              Đổi ảnh
            </label>
            <button type="button" className="btn btn-small btn-danger" onClick={onRemove}>
              Xoá
            </button>
          </div>
        </div>
      ) : (
        <label htmlFor="avatar" className={error ? 'file-drop input-error' : 'file-drop'}>
          <span className="file-drop-icon" aria-hidden="true" />
          <span>Chọn ảnh</span>
        </label>
      )}
    </Field>
  )
}

function StatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}>{getLabel(data.statuses, status)}</span>
}

// Danh sách giá trị dạng thẻ (kỹ năng, ngoại ngữ); rỗng thì ghi "Chưa khai báo"
function TagList({ items }) {
  if (!items.length) return <span className="muted">Chưa khai báo</span>
  return (
    <span className="tag-list">
      {items.map((item) => (
        <span key={item} className="tag">
          {item}
        </span>
      ))}
    </span>
  )
}

// Một nhóm thông tin dạng bảng 2 cột: Tên trường | Giá trị
function InfoSection({ title, rows, className }) {
  return (
    <section className={className}>
      <h4>{title}</h4>
      <dl className="info-list">
        {rows.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

// [YC10] Hồ sơ nhân viên vừa lưu — hiển thị ĐẦY ĐỦ mọi trường đã nhập,
// chia đúng 3 nhóm thông tin như trên form
function EmployeeProfile({ employee }) {
  // Nhóm 1 — Thông tin cá nhân
  const personal = [
    { label: 'Mã nhân viên', value: employee.employeeCode },
    { label: 'Họ tên', value: employee.fullName },
    {
      label: 'Ngày sinh',
      value: `${formatDate(employee.dateOfBirth)} (${calcAge(employee.dateOfBirth)} tuổi)`,
    },
    { label: 'Giới tính', value: getLabel(data.genders, employee.gender) },
    { label: 'Email', value: employee.email },
    { label: 'Số điện thoại', value: employee.phone },
    { label: 'Địa chỉ', value: employee.address },
  ]

  // Nhóm 2 — Thông tin công việc
  const work = [
    { label: 'Phòng ban', value: getLabel(data.departments, employee.department) },
    { label: 'Chức vụ', value: employee.position },
    { label: 'Ngày bắt đầu làm việc', value: formatDate(employee.startDate) },
    { label: 'Loại hợp đồng', value: getLabel(data.contractTypes, employee.contractType) },
    // [YC6] Chỉ có khi là hợp đồng thời vụ
    ...(employee.endDate
      ? [{ label: 'Ngày kết thúc', value: formatDate(employee.endDate) }]
      : []),
    { label: 'Mức lương', value: `${formatMoney(employee.salary)} / tháng` },
    { label: 'Trạng thái làm việc', value: <StatusBadge status={employee.status} /> },
  ]

  // Nhóm 3 — Thông tin bổ sung
  const extra = [
    // [YC7] Nhiều kỹ năng
    { label: 'Kỹ năng chuyên môn', value: <TagList items={employee.skills} /> },
    { label: 'Ngoại ngữ', value: <TagList items={employee.languages} /> },
    // [YC8] Nhiều chứng chỉ
    {
      label: 'Chứng chỉ',
      value: employee.certificates.length ? (
        <ol className="cert-summary">
          {employee.certificates.map((c) => (
            <li key={c.id}>
              <strong>{c.name}</strong>
              {(c.issuer || c.year) && (
                <span className="muted"> ({[c.issuer, c.year].filter(Boolean).join(', ')})</span>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <span className="muted">Chưa khai báo</span>
      ),
    },
    {
      label: 'Ảnh nhân viên',
      value: employee.avatarName || <span className="muted">Không có</span>,
    },
  ]

  return (
    <article className="profile">
      <header className="profile-head">
        {employee.avatarUrl ? (
          <img src={employee.avatarUrl} alt={`Ảnh ${employee.fullName}`} className="profile-avatar" />
        ) : (
          <span className="profile-avatar initials" aria-hidden="true">
            {getInitials(employee.fullName)}
          </span>
        )}
        <div className="profile-title">
          <span className="profile-code">{employee.employeeCode}</span>
          <h3>{employee.fullName}</h3>
          <p>
            {employee.position}, {getLabel(data.departments, employee.department)}
          </p>
        </div>
        <StatusBadge status={employee.status} />
      </header>

      <div className="profile-body">
        <InfoSection title="Thông tin cá nhân" rows={personal} />
        <InfoSection title="Thông tin công việc" rows={work} />
        <InfoSection title="Thông tin bổ sung" rows={extra} className="profile-extra" />
      </div>
    </article>
  )
}

// Danh sách nhân viên hiện có (dữ liệu mẫu + nhân viên đã lưu trong phiên)
function EmployeeTable({ employees, highlightCode }) {
  return (
    <div className="table-wrap">
      <table className="employee-table">
        <thead>
          <tr>
            <th scope="col">Mã NV</th>
            <th scope="col">Họ tên</th>
            <th scope="col">Phòng ban</th>
            <th scope="col">Chức vụ</th>
            <th scope="col">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.employeeCode} className={e.employeeCode === highlightCode ? 'is-new' : undefined}>
              <td className="code-cell">{e.employeeCode}</td>
              <td>{e.fullName}</td>
              <td>{getLabel(data.departments, e.department)}</td>
              <td>{e.position}</td>
              <td>
                <StatusBadge status={e.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ==================== 4. COMPONENT CHÍNH ====================

export default function Bai04() {
  const [form, setForm] = useState(INITIAL_FORM)
  // [YC8] Danh sách chứng chỉ — mỗi phần tử { id, name, issuer, year }
  const [certificates, setCertificates] = useState([])
  const [avatar, setAvatar] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState('')
  // [YC9] Danh sách nhân viên để kiểm tra trùng mã: copy từ dữ liệu mẫu JSON
  // (không sửa trực tiếp object import), nhân viên lưu xong được thêm vào đây
  const [employees, setEmployees] = useState(() => data.employees.map((e) => ({ ...e })))
  const [submitted, setSubmitted] = useState(false)
  const [step, setStep] = useState('form')
  const [savedEmployee, setSavedEmployee] = useState(null)

  // Giữ URL ảnh xem trước để giải phóng khi đổi ảnh / rời trang
  const avatarUrlRef = useRef('')
  useEffect(() => {
    return () => {
      if (avatarUrlRef.current) URL.revokeObjectURL(avatarUrlRef.current)
    }
  }, [])

  // ---- Giá trị tính ra (không lưu state) ----

  // [YC5] Danh sách chức vụ tương ứng với phòng ban đang chọn
  const positions = data.departments.find((d) => d.value === form.department)?.positions ?? []

  // [YC6] Có hiện ô "Ngày kết thúc" (hợp đồng thời vụ) hay không
  const isSeasonal = needsEndDate(form.contractType)

  const allErrors = validate(form, certificates, avatar, employees)
  const errorCount = Object.keys(allErrors).length

  // [YC9] Mã trùng được báo ngay khi gõ (không chờ bấm Lưu)
  const duplicate = findDuplicate(form.employeeCode, employees)
  const suggestedCode = suggestNextCode(employees)

  // Trước khi bấm Lưu: chỉ hiện lỗi trùng mã và lỗi ảnh (nếu đã chọn ảnh).
  // Sau khi bấm Lưu: hiện mọi lỗi và tự cập nhật khi người dùng sửa.
  const errors = submitted
    ? allErrors
    : {
        ...(duplicate && allErrors.employeeCode ? { employeeCode: allErrors.employeeCode } : {}),
        ...(avatar && allErrors.avatar ? { avatar: allErrors.avatar } : {}),
      }

  // Nút điền nhanh mã gợi ý (mã chưa dùng tiếp theo), hiện ở góc phải ô Mã nhân viên
  const suggestButton = (
    <button
      type="button"
      className="link-chip"
      title="Điền mã chưa dùng tiếp theo"
      onClick={() => setForm((prev) => ({ ...prev, employeeCode: suggestedCode }))}
    >
      {suggestedCode}
    </button>
  )

  const salaryNumber = Number(form.salary)
  const salaryPreview = form.salary !== '' && salaryNumber > 0 ? formatMoney(salaryNumber) : ''

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
      const next = { ...prev, [name]: name === 'employeeCode' ? value.toUpperCase() : value }
      // [YC5] Đổi phòng ban → xoá chức vụ cũ (chức vụ cũ có thể không thuộc phòng ban mới)
      if (name === 'department') next.position = ''
      // [YC6] Đổi sang loại hợp đồng không phải thời vụ → bỏ ngày kết thúc đã nhập
      if (name === 'contractType' && !needsEndDate(value)) next.endDate = ''
      return next
    })
  }

  // [YC7] Bật/tắt một lựa chọn trong danh sách chọn nhiều (kỹ năng, ngoại ngữ)
  const toggleInList = (name, value) => {
    setForm((prev) => {
      const list = prev[name]
      return {
        ...prev,
        [name]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      }
    })
  }

  // [YC8] Thêm một dòng chứng chỉ mới (tối đa maxCertificates dòng)
  const addCertificate = () => {
    if (certificates.length >= RULES.maxCertificates) return
    const id = crypto.randomUUID()
    setCertificates((prev) => [...prev, { id, name: '', issuer: '', year: '' }])
    // Đưa con trỏ vào ô tên của dòng vừa thêm
    requestAnimationFrame(() => document.getElementById(`cert-${id}-name`)?.focus())
  }

  // [YC8] Sửa một ô của một chứng chỉ
  const updateCertificate = (id, field, value) => {
    setCertificates((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  // [YC8] Xoá một chứng chỉ
  const removeCertificate = (id) => {
    setCertificates((prev) => prev.filter((c) => c.id !== id))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0] ?? null
    e.target.value = '' // cho phép chọn lại cùng một file
    if (!file) return
    setAvatar(file)
    replaceAvatarUrl(file)
  }

  const handleRemoveAvatar = () => {
    setAvatar(null)
    replaceAvatarUrl(null)
  }

  const focusField = (name) => {
    const input = document.getElementById(name)
    const group = document.getElementById(`field-${name}`) ?? input
    group?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    input?.focus({ preventScroll: true })
  }

  // [YC10] Nhấn Lưu: kiểm tra toàn bộ form.
  //   - Có lỗi  → hiện lỗi dưới từng trường, đưa con trỏ tới trường lỗi đầu tiên.
  //   - Hợp lệ → thêm nhân viên vào danh sách và chuyển sang màn hình hiển thị thông tin.
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    const firstError = Object.keys(validate(form, certificates, avatar, employees))[0]
    if (firstError) {
      focusField(firstError)
      return
    }

    const employee = {
      ...form,
      employeeCode: normalizeCode(form.employeeCode),
      fullName: form.fullName.trim().replace(/\s+/g, ' '),
      email: form.email.trim(),
      phone: form.phone.replace(/\s+/g, ''),
      address: form.address.trim(),
      salary: Number(form.salary),
      endDate: isSeasonal ? form.endDate : '',
      certificates: certificates.map((c) => ({
        ...c,
        name: c.name.trim(),
        issuer: c.issuer.trim(),
      })),
      avatarUrl,
      avatarName: avatar ? avatar.name : '',
    }

    // [YC9] Nhân viên vừa lưu được thêm vào danh sách → lần thêm sau sẽ bị kiểm tra trùng mã
    setEmployees((prev) => [...prev, employee])
    setSavedEmployee(employee)
    setStep('saved')
    scrollToTop()
  }

  const handleReset = () => {
    replaceAvatarUrl(null) // giải phóng ảnh xem trước (hồ sơ đã lưu không còn hiển thị)
    setForm(INITIAL_FORM)
    setCertificates([])
    setAvatar(null)
    setSubmitted(false)
  }

  const handleAddAnother = () => {
    handleReset()
    setStep('form')
    scrollToTop()
  }

  // ---- Render ----
  return (
    <div className="bai04">
      <h2>Bài 4: Thêm mới nhân viên</h2>
      <p className="subtitle">
        {step === 'form'
          ? 'Nhập hồ sơ nhân viên mới. Các trường có dấu * là bắt buộc.'
          : 'Hồ sơ đã được lưu và thêm vào danh sách nhân viên.'}
      </p>

      {step === 'form' && (
        <form onSubmit={handleSubmit} noValidate>
          {/* ===== Thông tin cá nhân (đề: Mã NV, Họ tên, Ngày sinh, Giới tính, Email, SĐT, Địa chỉ) ===== */}
          <section className="card">
            <h3 className="card-title">Thông tin cá nhân</h3>
            <div className="form-grid">
              {/* [YC1] Mã nhân viên bắt buộc — [YC9] báo trùng ngay khi gõ */}
              <Field
                label="Mã nhân viên"
                name="employeeCode"
                span={2}
                required
                error={errors.employeeCode}
                hint={<>Gợi ý: {suggestButton}</>}
              >
                <input
                  id="employeeCode"
                  name="employeeCode"
                  type="text"
                  autoComplete="off"
                  placeholder={`VD: ${RULES.employeeCodeExample}`}
                  maxLength={10}
                  value={form.employeeCode}
                  onChange={handleChange}
                  className={errors.employeeCode ? 'input-error code-input' : 'code-input'}
                />
              </Field>

              <Field label="Họ tên" name="fullName" span={4} required error={errors.fullName}>
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

              <Field label="Ngày sinh" name="dateOfBirth" span={2} required error={errors.dateOfBirth}>
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

              {/* [YC2] Email đúng định dạng */}
              <Field label="Email" name="email" span={3} required error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="VD: ten@congty.vn"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                />
              </Field>

              <Field label="Địa chỉ" name="address" span={3} required error={errors.address}>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố"
                  maxLength={RULES.addressMaxLength}
                  value={form.address}
                  onChange={handleChange}
                  className={errors.address ? 'input-error' : ''}
                />
              </Field>
            </div>
          </section>

          {/* ===== Thông tin công việc (đề: Phòng ban, Chức vụ, Ngày bắt đầu, Loại HĐ, Mức lương, Trạng thái) ===== */}
          <section className="card">
            <h3 className="card-title">Thông tin công việc</h3>
            <div className="form-grid">
              <Field label="Phòng ban" name="department" span={3} required error={errors.department}>
                <select
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className={errors.department ? 'input-error' : ''}
                >
                  <option value="">-- Chọn phòng ban --</option>
                  {data.departments.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </Field>

              {/* [YC5] Danh sách chức vụ thay đổi theo phòng ban đã chọn */}
              <Field
                label="Chức vụ"
                name="position"
                span={3}
                required
                error={errors.position}
                hint={form.department ? `${positions.length} chức vụ` : 'Chọn phòng ban trước'}
              >
                <select
                  id="position"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  disabled={!form.department}
                  className={errors.position ? 'input-error' : ''}
                >
                  <option value="">-- Chọn chức vụ --</option>
                  {positions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>

              {/* [YC4] Ngày bắt đầu làm việc — giới hạn chọn trên lịch khớp với validate() */}
              <Field
                label="Ngày bắt đầu làm việc"
                name="startDate"
                span={isSeasonal ? 2 : 3}
                required
                error={errors.startDate}
                hint={`${formatDate(RULES.earliestStartDate)} – ${formatDate(MAX_START_DATE)}`}
              >
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  min={RULES.earliestStartDate}
                  max={MAX_START_DATE}
                  value={form.startDate}
                  onChange={handleChange}
                  className={errors.startDate ? 'input-error' : ''}
                />
              </Field>

              <Field
                label="Loại hợp đồng"
                name="contractType"
                span={isSeasonal ? 2 : 3}
                required
                error={errors.contractType}
              >
                <select
                  id="contractType"
                  name="contractType"
                  value={form.contractType}
                  onChange={handleChange}
                  className={errors.contractType ? 'input-error' : ''}
                >
                  <option value="">-- Chọn loại hợp đồng --</option>
                  {data.contractTypes.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>

              {/* [YC6] Chỉ hiện khi chọn hợp đồng thời vụ */}
              {isSeasonal && (
                <Field
                  label="Ngày kết thúc"
                  name="endDate"
                  span={2}
                  className="reveal"
                  required
                  error={errors.endDate}
                  hint={`Tối đa ${RULES.maxSeasonalMonths} tháng`}
                >
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    min={form.startDate || undefined}
                    max={form.startDate ? addMonths(form.startDate, RULES.maxSeasonalMonths) : undefined}
                    value={form.endDate}
                    onChange={handleChange}
                    className={errors.endDate ? 'input-error' : ''}
                  />
                </Field>
              )}

              {/* [YC3] Mức lương > 0, hiển thị số tiền đã định dạng bên dưới */}
              <Field
                label="Mức lương (đồng/tháng)"
                name="salary"
                span={3}
                required
                error={errors.salary}
                hint={salaryPreview ? `= ${salaryPreview}` : 'Số nguyên'}
              >
                <input
                  id="salary"
                  name="salary"
                  type="number"
                  inputMode="numeric"
                  min={RULES.minSalary}
                  step={100000}
                  placeholder="VD: 15000000"
                  value={form.salary}
                  onChange={handleChange}
                  className={errors.salary ? 'input-error' : ''}
                />
              </Field>

              <Field label="Trạng thái làm việc" name="status" span={3} required error={errors.status}>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={errors.status ? 'input-error' : ''}
                >
                  <option value="">-- Chọn trạng thái --</option>
                  {data.statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          {/* ===== Thông tin bổ sung (đề: Kỹ năng chuyên môn, Ngoại ngữ, Chứng chỉ, Ảnh nhân viên) ===== */}
          <section className="card">
            <h3 className="card-title">Thông tin bổ sung</h3>
            <div className="form-grid">
              <AvatarField
                file={avatar}
                previewUrl={avatarUrl}
                error={errors.avatar}
                onChange={handleAvatarChange}
                onRemove={handleRemoveAvatar}
              />

              {/* [YC7] Chọn nhiều kỹ năng chuyên môn */}
              <Field
                label="Kỹ năng chuyên môn"
                name="skills"
                span={4}
                hint={form.skills.length ? `Đã chọn ${form.skills.length}` : 'Chọn được nhiều'}
              >
                <ChipGroup name="skills" options={data.skills} selected={form.skills} onToggle={toggleInList} />
              </Field>

              <Field
                label="Ngoại ngữ"
                name="languages"
                span={4}
                hint={form.languages.length ? `Đã chọn ${form.languages.length}` : 'Chọn được nhiều'}
              >
                <ChipGroup
                  name="languages"
                  options={data.languages}
                  selected={form.languages}
                  onToggle={toggleInList}
                />
              </Field>

              {/* [YC8] Danh sách chứng chỉ: thêm / sửa / xoá nhiều dòng */}
              <div id="field-certificates" className="form-group span-6">
                <div className="cert-head">
                  <span className="form-label">Chứng chỉ</span>
                  <span className="hint">
                    {certificates.length}/{RULES.maxCertificates} chứng chỉ
                  </span>
                </div>

                {certificates.length === 0 ? (
                  <p className="cert-empty">Chưa có chứng chỉ nào. Bấm "Thêm chứng chỉ" để khai báo.</p>
                ) : (
                  <ol className="cert-list">
                    {certificates.map((cert, index) => {
                      const nameError = errors[`cert-${cert.id}-name`]
                      const yearError = errors[`cert-${cert.id}-year`]
                      return (
                        <li key={cert.id} className="cert-row">
                          <span className="cert-index">{index + 1}</span>
                          <div className="cert-fields">
                            <div className="cert-field cert-name">
                              <label htmlFor={`cert-${cert.id}-name`} className="cert-label">
                                Tên chứng chỉ <span className="required">*</span>
                              </label>
                              <input
                                id={`cert-${cert.id}-name`}
                                type="text"
                                placeholder="VD: TOEIC 750"
                                value={cert.name}
                                onChange={(e) => updateCertificate(cert.id, 'name', e.target.value)}
                                className={nameError ? 'input-error' : ''}
                              />
                              {nameError && <p className="error-text">{nameError}</p>}
                            </div>
                            <div className="cert-field cert-issuer">
                              <label htmlFor={`cert-${cert.id}-issuer`} className="cert-label">
                                Nơi cấp
                              </label>
                              <input
                                id={`cert-${cert.id}-issuer`}
                                type="text"
                                placeholder="VD: IIG Việt Nam"
                                value={cert.issuer}
                                onChange={(e) => updateCertificate(cert.id, 'issuer', e.target.value)}
                              />
                            </div>
                            <div className="cert-field cert-year">
                              <label htmlFor={`cert-${cert.id}-year`} className="cert-label">
                                Năm cấp
                              </label>
                              <input
                                id={`cert-${cert.id}-year`}
                                type="number"
                                inputMode="numeric"
                                placeholder={String(TODAY.getFullYear())}
                                value={cert.year}
                                onChange={(e) => updateCertificate(cert.id, 'year', e.target.value)}
                                className={yearError ? 'input-error' : ''}
                              />
                              {yearError && <p className="error-text">{yearError}</p>}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn btn-small btn-danger cert-remove"
                            aria-label={`Xoá chứng chỉ ${index + 1}`}
                            onClick={() => removeCertificate(cert.id)}
                          >
                            Xoá
                          </button>
                        </li>
                      )
                    })}
                  </ol>
                )}

                <button
                  type="button"
                  className="btn btn-small btn-secondary cert-add"
                  onClick={addCertificate}
                  disabled={certificates.length >= RULES.maxCertificates}
                >
                  + Thêm chứng chỉ
                </button>
              </div>
            </div>
          </section>

          {submitted && errorCount > 0 && (
            <div className="error-summary" role="alert">
              Vui lòng kiểm tra lại <strong>{errorCount}</strong> mục chưa hợp lệ.
            </div>
          )}

          <div className="actions">
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Làm lại
            </button>
            <button type="submit" className="btn btn-primary">
              Lưu nhân viên
            </button>
          </div>

          {/* [YC9] Dữ liệu mẫu dùng để kiểm tra trùng mã — xem nhanh tại đây */}
          <details className="employee-list">
            <summary>Danh sách nhân viên hiện có ({employees.length})</summary>
            <EmployeeTable employees={employees} />
          </details>
        </form>
      )}

      {/* [YC10] Hiển thị thông tin nhân viên sau khi lưu:
          1) thông báo đã lưu  2) hồ sơ đầy đủ 3 nhóm thông tin  3) nút thao tác
          4) bên dưới cùng là danh sách nhân viên (dòng vừa thêm được tô sáng) */}
      {step === 'saved' && savedEmployee && (
        <>
          <div className="saved-banner" role="status">
            Đã lưu nhân viên <strong>{savedEmployee.employeeCode}</strong> – {savedEmployee.fullName}.
          </div>

          <EmployeeProfile employee={savedEmployee} />

          <div className="actions">
            <button type="button" className="btn btn-primary" onClick={handleAddAnother}>
              Thêm nhân viên khác
            </button>
          </div>

          <section className="employee-list open">
            <h3>Danh sách nhân viên ({employees.length})</h3>
            <EmployeeTable employees={employees} highlightCode={savedEmployee.employeeCode} />
          </section>
        </>
      )}
    </div>
  )
}
