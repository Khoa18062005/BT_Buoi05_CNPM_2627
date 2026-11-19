import { useState } from 'react'
import data from '../data/Bai02.json'
import '../styles/Bai02.css'

// 1. Hằng số & giá trị khởi tạo
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)\d{8}$/

const STEPS = [
  { key: 'form', number: 1, label: 'Nhập thông tin' },
  { key: 'review', number: 2, label: 'Tổng kết & Xác nhận' },
  { key: 'success', number: 3, label: 'Hoàn tất' },
]

function getDateString(offsetDays = 0) {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function createInitialForm() {
  return {
    fullName: '',
    phone: '',
    email: '',
    checkIn: getDateString(0),
    checkOut: getDateString(1),
    roomType: data.roomTypes[0].value,
    roomCount: 1,
    adults: 1,
    children: 0,
    services: [],
    airportTrips: 1,
  }
}

// 2. Các hàm thuần (tính toán, định dạng, kiểm tra dữ liệu)
function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0
  const diff = (new Date(checkOut) - new Date(checkIn)) / 86400000
  return Number.isNaN(diff) ? 0 : Math.round(diff)
}

function formatMoney(amount) {
  return `${new Intl.NumberFormat('vi-VN').format(amount)} đ`
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

function calculatePricing(form) {
  const nights = calcNights(form.checkIn, form.checkOut)
  const validNights = nights > 0 ? nights : 0
  const roomCount = Math.max(0, Number(form.roomCount) || 0)
  const adults = Math.max(0, Number(form.adults) || 0)
  const children = Math.max(0, Number(form.children) || 0)
  const totalGuests = adults + children
  const airportTrips = Math.max(1, Number(form.airportTrips) || 1)

  const selectedRoom = data.roomTypes.find((r) => r.value === form.roomType)
  const roomCost = selectedRoom ? selectedRoom.price * roomCount * validNights : 0

  const serviceItems = data.services
    .filter((s) => form.services.includes(s.value))
    .map((s) => {
      if (s.unit === 'person_night') {
        const cost = s.price * totalGuests * validNights
        return {
          ...s,
          detail: `${formatMoney(s.price)} × ${totalGuests} người × ${validNights} đêm`,
          cost,
        }
      }
      if (s.unit === 'trip') {
        const cost = s.price * airportTrips
        return {
          ...s,
          detail: `${formatMoney(s.price)} × ${airportTrips} lần`,
          cost,
        }
      }
      const cost = s.price * totalGuests
      return {
        ...s,
        detail: `${formatMoney(s.price)} × ${totalGuests} người`,
        cost,
      }
    })

  const servicesCost = serviceItems.reduce((sum, item) => sum + item.cost, 0)
  const totalCost = roomCost + servicesCost

  return {
    nights,
    validNights,
    roomCount,
    adults,
    children,
    totalGuests,
    airportTrips,
    selectedRoom,
    roomCost,
    serviceItems,
    servicesCost,
    totalCost,
  }
}

function validate(form) {
  const errors = {}
  const { limits } = data
  const today = getDateString(0)

  if (!form.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ tên khách hàng'
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = 'Họ tên phải có ít nhất 2 ký tự'
  }

  if (!form.phone.trim()) {
    errors.phone = 'Vui lòng nhập số điện thoại'
  } else if (!PHONE_REGEX.test(form.phone.trim())) {
    errors.phone = 'Số điện thoại Việt Nam không đúng định dạng (VD: 0912345678)'
  }

  if (!form.email.trim()) {
    errors.email = 'Vui lòng nhập email'
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = 'Email không đúng định dạng'
  }

  if (!form.checkIn) {
    errors.checkIn = 'Vui lòng chọn ngày nhận phòng'
  } else if (form.checkIn < today) {
    errors.checkIn = 'Ngày nhận phòng không được trước ngày hôm nay'
  }

  if (!form.checkOut) {
    errors.checkOut = 'Vui lòng chọn ngày trả phòng'
  } else if (form.checkIn && calcNights(form.checkIn, form.checkOut) <= 0) {
    errors.checkOut = 'Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 đêm'
  }

  if (!form.roomType) {
    errors.roomType = 'Vui lòng chọn loại phòng'
  }

  const roomCount = Number(form.roomCount)
  if (!Number.isInteger(roomCount) || roomCount < limits.minRooms || roomCount > limits.maxRooms) {
    errors.roomCount = `Số lượng phòng phải từ ${limits.minRooms} đến ${limits.maxRooms}`
  }

  const adults = Number(form.adults)
  if (!Number.isInteger(adults) || adults < limits.minAdults || adults > limits.maxAdults) {
    errors.adults = `Số người lớn phải từ ${limits.minAdults} đến ${limits.maxAdults}`
  }

  const children = Number(form.children)
  if (!Number.isInteger(children) || children < limits.minChildren || children > limits.maxChildren) {
    errors.children = `Số trẻ em phải từ ${limits.minChildren} đến ${limits.maxChildren}`
  }

  if (form.services.includes('airport')) {
    const trips = Number(form.airportTrips)
    if (
      !Number.isInteger(trips) ||
      trips < limits.minAirportTrips ||
      trips > limits.maxAirportTrips
    ) {
      errors.airportTrips = `Số lần đưa đón phải từ ${limits.minAirportTrips} đến ${limits.maxAirportTrips}`
    }
  }

  return errors
}

// 3. Các component con
function StepBar({ currentStep }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep)

  return (
    <ol className="step-bar" aria-label="Tiến trình đặt phòng">
      {STEPS.map((item, idx) => {
        const status = idx < currentIndex ? 'done' : idx === currentIndex ? 'active' : ''
        return (
          <li key={item.key} className={`step-item ${status}`}>
            <span className="step-number">{idx < currentIndex ? '✓' : item.number}</span>
            <span className="step-label">{item.label}</span>
          </li>
        )
      })}
    </ol>
  )
}

function CostBreakdownTable({ pricing }) {
  const { selectedRoom, roomCount, validNights, roomCost, serviceItems, totalCost } = pricing

  return (
    <table className="summary-table">
      <thead>
        <tr>
          <th>Khoản mục</th>
          <th>Chi tiết tính</th>
          <th className="col-money">Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{selectedRoom ? selectedRoom.label : 'Tiền phòng'}</td>
          <td>
            {selectedRoom
              ? `${formatMoney(selectedRoom.price)} × ${roomCount} phòng × ${validNights} đêm`
              : '—'}
          </td>
          <td className="col-money">{formatMoney(roomCost)}</td>
        </tr>
        {serviceItems.length === 0 ? (
          <tr className="muted-row">
            <td>Dịch vụ bổ sung</td>
            <td>Không chọn dịch vụ bổ sung</td>
            <td className="col-money">0 đ</td>
          </tr>
        ) : (
          serviceItems.map((item) => (
            <tr key={item.value}>
              <td>{item.label}</td>
              <td>{item.detail}</td>
              <td className="col-money">{formatMoney(item.cost)}</td>
            </tr>
          ))
        )}
      </tbody>
      <tfoot>
        <tr className="total-row">
          <td colSpan={2}>Tổng chi phí dự kiến</td>
          <td className="col-money">{formatMoney(totalCost)}</td>
        </tr>
      </tfoot>
    </table>
  )
}

// 4. Component chính
export default function Bai02() {
  const [form, setForm] = useState(createInitialForm)
  const [step, setStep] = useState('form')
  const [submitted, setSubmitted] = useState(false)
  const [bookingCode, setBookingCode] = useState('')

  const pricing = calculatePricing(form)
  const errors = submitted ? validate(form) : {}
  const hasInvalidDateRange = Boolean(form.checkIn && form.checkOut && pricing.nights <= 0)
  const checkOutError =
    errors.checkOut ||
    (hasInvalidDateRange ? 'Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 đêm' : '')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleServiceToggle = (serviceValue) => {
    setForm((prev) => {
      const exists = prev.services.includes(serviceValue)
      const nextServices = exists
        ? prev.services.filter((v) => v !== serviceValue)
        : [...prev.services, serviceValue]
      return { ...prev, services: nextServices }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length === 0) {
      setStep('review')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleConfirm = () => {
    const code = `DP-${String(Date.now()).slice(-6)}`
    setBookingCode(code)
    setStep('success')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setForm(createInitialForm())
    setSubmitted(false)
    setBookingCode('')
    setStep('form')
  }

  return (
    <div className="bai02">
      <h2>Bài 2: Đặt phòng khách sạn</h2>
      <p className="subtitle">
        Điền thông tin đặt phòng, chọn loại phòng và dịch vụ bổ sung để xem tổng chi phí tự động.
      </p>

      <StepBar currentStep={step} />

      {step === 'form' && (
        <form onSubmit={handleSubmit} noValidate>
          {/* Nhóm 1: Thông tin khách hàng */}
          <section className="card">
            <h3 className="card-title">Thông tin khách hàng</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="bai02-fullName">
                  Họ tên khách hàng <span className="required">*</span>
                </label>
                <input
                  id="bai02-fullName"
                  name="fullName"
                  type="text"
                  placeholder="VD: Nguyễn Văn An"
                  value={form.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'input-error' : ''}
                />
                {errors.fullName && <p className="error-text">{errors.fullName}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="bai02-phone">
                  Số điện thoại <span className="required">*</span>
                </label>
                <input
                  id="bai02-phone"
                  name="phone"
                  type="tel"
                  placeholder="VD: 0912345678"
                  value={form.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'input-error' : ''}
                />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="bai02-email">
                  Email <span className="required">*</span>
                </label>
                <input
                  id="bai02-email"
                  name="email"
                  type="email"
                  placeholder="VD: khachhang@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>
            </div>
          </section>

          {/* Nhóm 2: Thông tin đặt phòng */}
          <section className="card">
            <h3 className="card-title">Thông tin đặt phòng</h3>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="bai02-checkIn">
                  Ngày nhận phòng <span className="required">*</span>
                </label>
                <input
                  id="bai02-checkIn"
                  name="checkIn"
                  type="date"
                  min={getDateString(0)}
                  value={form.checkIn}
                  onChange={handleChange}
                  className={errors.checkIn ? 'input-error' : ''}
                />
                {errors.checkIn && <p className="error-text">{errors.checkIn}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="bai02-checkOut">
                  Ngày trả phòng <span className="required">*</span>
                </label>
                <input
                  id="bai02-checkOut"
                  name="checkOut"
                  type="date"
                  min={form.checkIn || getDateString(0)}
                  value={form.checkOut}
                  onChange={handleChange}
                  className={checkOutError ? 'input-error' : ''}
                />
                {checkOutError && <p className="error-text">{checkOutError}</p>}
              </div>
            </div>

            <div className={`nights-banner ${pricing.validNights > 0 ? 'valid' : 'invalid'}`}>
              <span>Số đêm lưu trú:</span>
              <strong>
                {pricing.validNights > 0
                  ? `${pricing.validNights} đêm (${formatDate(form.checkIn)} → ${formatDate(form.checkOut)})`
                  : '0 đêm — Vui lòng chọn ngày trả phòng sau ngày nhận phòng'}
              </strong>
            </div>

            <div className="form-group">
              <span className="group-label">
                Loại phòng <span className="required">*</span>
              </span>
              <div className="room-grid">
                {data.roomTypes.map((room) => {
                  const isSelected = form.roomType === room.value
                  return (
                    <label
                      key={room.value}
                      htmlFor={`bai02-room-${room.value}`}
                      className={`room-card ${isSelected ? 'selected' : ''}`}
                    >
                      <input
                        id={`bai02-room-${room.value}`}
                        type="radio"
                        name="roomType"
                        value={room.value}
                        checked={isSelected}
                        onChange={handleChange}
                      />
                      <div className="room-card-body">
                        <span className="room-name">{room.label}</span>
                        <span className="room-price">{formatMoney(room.price)} / đêm</span>
                        <span className="room-desc">{room.description}</span>
                      </div>
                    </label>
                  )
                })}
              </div>
              {errors.roomType && <p className="error-text">{errors.roomType}</p>}
            </div>

            <div className="form-grid count-grid">
              <div className="form-group">
                <label htmlFor="bai02-roomCount">
                  Số lượng phòng <span className="required">*</span>
                </label>
                <input
                  id="bai02-roomCount"
                  name="roomCount"
                  type="number"
                  min={data.limits.minRooms}
                  max={data.limits.maxRooms}
                  value={form.roomCount}
                  onChange={handleChange}
                  className={errors.roomCount ? 'input-error' : ''}
                />
                {errors.roomCount && <p className="error-text">{errors.roomCount}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="bai02-adults">
                  Số người lớn <span className="required">*</span>
                </label>
                <input
                  id="bai02-adults"
                  name="adults"
                  type="number"
                  min={data.limits.minAdults}
                  max={data.limits.maxAdults}
                  value={form.adults}
                  onChange={handleChange}
                  className={errors.adults ? 'input-error' : ''}
                />
                {errors.adults && <p className="error-text">{errors.adults}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="bai02-children">Số trẻ em</label>
                <input
                  id="bai02-children"
                  name="children"
                  type="number"
                  min={data.limits.minChildren}
                  max={data.limits.maxChildren}
                  value={form.children}
                  onChange={handleChange}
                  className={errors.children ? 'input-error' : ''}
                />
                {errors.children && <p className="error-text">{errors.children}</p>}
              </div>
            </div>
          </section>

          {/* Nhóm 3: Dịch vụ bổ sung */}
          <section className="card">
            <h3 className="card-title">Dịch vụ bổ sung</h3>
            <p className="helper-note">
              Quy ước tính phí: số người = người lớn + trẻ em ({pricing.totalGuests} người). Đưa đón
              sân bay tính theo số lần sử dụng.
            </p>

            <div className="service-list">
              {data.services.map((service) => {
                const isChecked = form.services.includes(service.value)
                const isAirport = service.value === 'airport'

                return (
                  <div
                    key={service.value}
                    className={`service-item ${isChecked ? 'selected' : ''}`}
                  >
                    <label htmlFor={`bai02-service-${service.value}`} className="service-label">
                      <input
                        id={`bai02-service-${service.value}`}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleServiceToggle(service.value)}
                      />
                      <span className="service-info">
                        <span className="service-name">{service.label}</span>
                        <span className="service-price">
                          {formatMoney(service.price)} / {service.unitLabel}
                        </span>
                      </span>
                    </label>

                    {isAirport && isChecked && (
                      <div className="trip-control">
                        <label htmlFor="bai02-airportTrips">Số lần:</label>
                        <input
                          id="bai02-airportTrips"
                          name="airportTrips"
                          type="number"
                          min={data.limits.minAirportTrips}
                          max={data.limits.maxAirportTrips}
                          value={form.airportTrips}
                          onChange={handleChange}
                          className={errors.airportTrips ? 'input-error' : ''}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {errors.airportTrips && <p className="error-text">{errors.airportTrips}</p>}
          </section>

          {/* Nhóm 4: Tổng chi phí */}
          <section className="card">
            <h3 className="card-title">Tổng chi phí</h3>
            <CostBreakdownTable pricing={pricing} />
          </section>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Làm mới
            </button>
            <button type="submit" className="btn btn-primary">
              Tiếp tục xem tổng kết →
            </button>
          </div>
        </form>
      )}

      {step === 'review' && (
        <div className="review-view">
          <section className="card">
            <h3 className="card-title">Bảng tổng kết thông tin đặt phòng</h3>
            <p className="helper-note">
              Vui lòng kiểm tra kỹ thông tin trước khi xác nhận. Bạn có thể quay lại để thay đổi bất
              kỳ mục nào.
            </p>

            <table className="info-table">
              <tbody>
                <tr>
                  <th>Họ tên khách hàng</th>
                  <td>{form.fullName}</td>
                </tr>
                <tr>
                  <th>Số điện thoại</th>
                  <td>{form.phone}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{form.email}</td>
                </tr>
                <tr>
                  <th>Ngày nhận phòng</th>
                  <td>{formatDate(form.checkIn)}</td>
                </tr>
                <tr>
                  <th>Ngày trả phòng</th>
                  <td>{formatDate(form.checkOut)}</td>
                </tr>
                <tr>
                  <th>Số đêm lưu trú</th>
                  <td>{pricing.validNights} đêm</td>
                </tr>
                <tr>
                  <th>Loại phòng</th>
                  <td>
                    {pricing.selectedRoom?.label} ({formatMoney(pricing.selectedRoom?.price || 0)}
                    /đêm)
                  </td>
                </tr>
                <tr>
                  <th>Số lượng phòng</th>
                  <td>{pricing.roomCount} phòng</td>
                </tr>
                <tr>
                  <th>Số lượng khách</th>
                  <td>
                    {pricing.adults} người lớn, {pricing.children} trẻ em (Tổng:{' '}
                    {pricing.totalGuests} người)
                  </td>
                </tr>
                <tr>
                  <th>Dịch vụ bổ sung</th>
                  <td>
                    {pricing.serviceItems.length > 0
                      ? pricing.serviceItems
                          .map((s) =>
                            s.unit === 'trip'
                              ? `${s.label} (${pricing.airportTrips} lần)`
                              : s.label,
                          )
                          .join(', ')
                      : 'Không có'}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="card">
            <h3 className="card-title">Chi tiết thanh toán</h3>
            <CostBreakdownTable pricing={pricing} />
          </section>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStep('form')}
            >
              ← Quay lại chỉnh sửa
            </button>
            <button type="button" className="btn btn-primary" onClick={handleConfirm}>
              Xác nhận đặt phòng
            </button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <section className="success-box">
          <div className="success-badge">✓ Đặt phòng thành công</div>
          <h3>Cảm ơn {form.fullName} đã đặt phòng!</h3>
          <p className="success-desc">
            Mã đặt phòng của bạn là <strong>{bookingCode}</strong>. Thông tin xác nhận đã được ghi
            nhận cho email <strong>{form.email}</strong>.
          </p>

          <div className="success-summary">
            <div>
              <span>Loại phòng:</span>
              <strong>
                {pricing.selectedRoom?.label} × {pricing.roomCount} phòng
              </strong>
            </div>
            <div>
              <span>Thời gian lưu trú:</span>
              <strong>
                {formatDate(form.checkIn)} → {formatDate(form.checkOut)} ({pricing.validNights}{' '}
                đêm)
              </strong>
            </div>
            <div>
              <span>Số lượng khách:</span>
              <strong>
                {pricing.adults} người lớn, {pricing.children} trẻ em
              </strong>
            </div>
            <div>
              <span>Tổng chi phí:</span>
              <strong className="success-total">{formatMoney(pricing.totalCost)}</strong>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-primary" onClick={handleReset}>
              Đặt phòng mới
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
