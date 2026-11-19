import { useState, useEffect } from 'react'
import data from '../data/Bai03.json'
import '../styles/Bai03.css'

// 1. Hằng số & Giá trị khởi tạo
const STORAGE_KEY = 'exam_maker_bai03_draft'

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const createNewOption = (text = '', isCorrect = false) => ({
  id: createId(),
  text,
  isCorrect,
})

const createNewQuestion = () => ({
  id: createId(),
  content: '',
  type: 'single',
  score: data.rules.defaultScore,
  options: [
    createNewOption('Phương án A', true),
    createNewOption('Phương án B', false),
    createNewOption('Phương án C', false),
    createNewOption('Phương án D', false),
  ],
})

const INITIAL_EXAM = {
  title: '',
  subject: data.subjects[0]?.value || '',
  duration: data.rules.defaultDuration,
  totalQuestions: data.rules.defaultTotalQuestions,
  level: data.levels[1]?.value || 'tb',
  questions: [createNewQuestion(1)],
}

// 2. Hàm thuần túy: Validate & Tính toán
function validateExam(exam) {
  const errors = {
    general: {},
    questions: {},
  }

  // Validate thông tin đề thi chung
  if (!exam.title || !exam.title.trim()) {
    errors.general.title = 'Vui lòng nhập tên đề thi'
  } else if (exam.title.trim().length < 5) {
    errors.general.title = 'Tên đề thi phải có ít nhất 5 ký tự'
  }

  if (!exam.subject) {
    errors.general.subject = 'Vui lòng chọn môn học'
  }

  const durationNum = Number(exam.duration)
  if (!durationNum || durationNum < data.rules.minDuration || durationNum > data.rules.maxDuration) {
    errors.general.duration = `Thời gian làm bài từ ${data.rules.minDuration} đến ${data.rules.maxDuration} phút`
  }

  const totalQNum = Number(exam.totalQuestions)
  if (!totalQNum || totalQNum < 1) {
    errors.general.totalQuestions = 'Số lượng câu hỏi dự kiến phải lớn hơn 0'
  }

  // Cảnh báo nếu số câu hỏi thực tế không khớp số lượng khai báo
  if (exam.questions.length !== totalQNum) {
    errors.general.questionCountMismatch = `Đề thi đang có ${exam.questions.length} câu, chưa khớp với số lượng dự kiến là ${totalQNum} câu`
  }

  if (exam.questions.length === 0) {
    errors.general.questions = 'Đề thi phải có ít nhất 1 câu hỏi'
  }

  // Validate chi tiết từng câu hỏi
  exam.questions.forEach((q, idx) => {
    const qErr = {}
    const qNum = idx + 1

    if (!q.content || !q.content.trim()) {
      qErr.content = `Câu ${qNum}: Vui lòng nhập nội dung câu hỏi`
    }

    const scoreNum = Number(q.score)
    if (isNaN(scoreNum) || scoreNum <= 0) {
      qErr.score = `Câu ${qNum}: Điểm số phải lớn hơn 0`
    }

    // Yêu cầu 9: Mỗi câu hỏi phải có ít nhất 2 đáp án
    if (!q.options || q.options.length < data.rules.minAnswers) {
      qErr.optionsCount = `Câu ${qNum}: Phải có ít nhất ${data.rules.minAnswers} đáp án`
    }

    // Yêu cầu 10: Mỗi câu hỏi phải có đáp án đúng
    const hasCorrect = q.options && q.options.some((opt) => opt.isCorrect)
    if (!hasCorrect) {
      qErr.correctAnswer = `Câu ${qNum}: Chưa chọn đáp án đúng cho câu hỏi`
    }

    // Kiểm tra nội dung từng đáp án không để trống
    const emptyOptionIndex = q.options?.findIndex((opt) => !opt.text || !opt.text.trim())
    if (emptyOptionIndex !== -1 && emptyOptionIndex !== undefined) {
      qErr.optionContent = `Câu ${qNum}: Đáp án thứ ${emptyOptionIndex + 1} không được để trống`
    }

    if (Object.keys(qErr).length > 0) {
      errors.questions[q.id] = qErr
    }
  })

  const hasGeneralErrors = Object.keys(errors.general).filter((k) => k !== 'questionCountMismatch').length > 0
  const hasQuestionErrors = Object.keys(errors.questions).length > 0
  const isValid = !hasGeneralErrors && !hasQuestionErrors

  return { errors, isValid }
}

// 3. Component Con: Modal Xuất JSON
function JsonModal({ isOpen, onClose, dataObj }) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const jsonString = JSON.stringify(dataObj, null, 2)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback nếu trình duyệt chặn clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = jsonString
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const fileName = `de-thi-${dataObj.subject || 'trac-nghiem'}-${Date.now()}.json`
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bai03-modal-backdrop" onClick={onClose} role="presentation">
      <div className="bai03-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="bai03-modal-header">
          <div>
            <h3 className="bai03-modal-title">Dữ liệu đề thi dạng JSON</h3>
            <p className="bai03-modal-subtitle">Dữ liệu đã được định dạng chuẩn, có thể sao chép hoặc tải về file</p>
          </div>
          <button type="button" className="bai03-btn-icon" onClick={onClose} title="Đóng">
            ✕
          </button>
        </div>

        <div className="bai03-modal-body">
          <pre className="bai03-json-view">
            <code>{jsonString}</code>
          </pre>
        </div>

        <div className="bai03-modal-footer">
          <button type="button" className="bai03-btn bai03-btn-secondary" onClick={handleCopy}>
            {copied ? '✓ Đã sao chép vào bộ nhớ tạm' : '📋 Sao chép JSON'}
          </button>
          <button type="button" className="bai03-btn bai03-btn-primary" onClick={handleDownload}>
            💾 Tải file .json
          </button>
          <button type="button" className="bai03-btn bai03-btn-outline" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

// 4. Component Chính
export default function Bai03() {
  // Khởi tạo state từ localStorage (nếu có nháp) hoặc INITIAL_EXAM
  const [exam, setExam] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch {
      // Bỏ qua lỗi parse storage
    }
    return INITIAL_EXAM
  })

  const [activeTab, setActiveTab] = useState('editor') // 'editor' | 'preview'
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showJsonModal, setShowJsonModal] = useState(false)
  const [notification, setNotification] = useState(null)
  const [previewUserAnswers, setPreviewUserAnswers] = useState({})
  const [showCorrectAnswersInPreview, setShowCorrectAnswersInPreview] = useState(false)

  // Tự động lưu nháp vào LocalStorage mỗi khi state exam thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exam))
    } catch {
      // Bỏ qua lỗi lưu storage
    }
  }, [exam])

  // Giá trị tính toán trực tiếp trong lúc render (Không lưu vào state theo claude.md)
  const totalScore = exam.questions.reduce((sum, q) => sum + (Number(q.score) || 0), 0)
  const currentQuestionCount = exam.questions.length
  const { errors, isValid } = validateExam(exam)

  // Hiển thị thông báo tạm thời
  const triggerNotification = (msg, type = 'success') => {
    setNotification({ message: msg, type })
    setTimeout(() => setNotification(null), 3500)
  }

  // Xử lý thay đổi thông tin chung của đề thi
  const handleGeneralChange = (e) => {
    const { name, value } = e.target
    setExam((prev) => ({
      ...prev,
      [name]: name === 'duration' || name === 'totalQuestions' ? Number(value) : value,
    }))
  }

  // --- QUẢN LÝ CÂU HỎI ---
  // 1. Thêm câu hỏi mới
  const handleAddQuestion = () => {
    const newQ = createNewQuestion(exam.questions.length + 1)
    setExam((prev) => ({
      ...prev,
      questions: [...prev.questions, newQ],
    }))
    triggerNotification(`Đã thêm Câu ${exam.questions.length + 1}`)
  }

  // 2. Xóa câu hỏi
  const handleDeleteQuestion = (questionId, questionIndex) => {
    if (exam.questions.length <= 1) {
      triggerNotification('Đề thi phải có ít nhất 1 câu hỏi, không thể xóa tiếp!', 'warning')
      return
    }
    setExam((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }))
    triggerNotification(`Đã xóa câu hỏi số ${questionIndex + 1}`)
  }

  // 3. Sửa nội dung hoặc điểm câu hỏi
  const handleQuestionChange = (questionId, field, value) => {
    setExam((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            [field]: field === 'score' ? (value === '' ? '' : Number(value)) : value,
          }
        }
        return q
      }),
    }))
  }

  // Chuyển đổi loại câu hỏi (single <-> multiple)
  const handleQuestionTypeChange = (questionId, newType) => {
    setExam((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          let updatedOptions = [...q.options]
          // Nếu chuyển về single mà đang có nhiều đáp án đúng, chỉ giữ lại đáp án đúng đầu tiên
          if (newType === 'single') {
            let foundFirstCorrect = false
            updatedOptions = updatedOptions.map((opt) => {
              if (opt.isCorrect && !foundFirstCorrect) {
                foundFirstCorrect = true
                return opt
              }
              return { ...opt, isCorrect: false }
            })
            // Nếu chưa có đáp án đúng nào, chọn đáp án đầu tiên
            if (!foundFirstCorrect && updatedOptions.length > 0) {
              updatedOptions[0] = { ...updatedOptions[0], isCorrect: true }
            }
          }
          return {
            ...q,
            type: newType,
            options: updatedOptions,
          }
        }
        return q
      }),
    }))
  }

  // --- QUẢN LÝ ĐÁP ÁN ---
  // 4. Thêm đáp án cho câu hỏi
  const handleAddOption = (questionId) => {
    setExam((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          if (q.options.length >= data.rules.maxAnswers) {
            triggerNotification(`Mỗi câu hỏi tối đa ${data.rules.maxAnswers} đáp án`, 'warning')
            return q
          }
          const letter = String.fromCharCode(65 + q.options.length)
          const newOpt = createNewOption(`Phương án ${letter}`, false)
          return {
            ...q,
            options: [...q.options, newOpt],
          }
        }
        return q
      }),
    }))
  }

  // 5. Xóa đáp án
  const handleDeleteOption = (questionId, optionId) => {
    const targetQ = exam.questions.find((q) => q.id === questionId)
    if (targetQ && targetQ.options.length <= data.rules.minAnswers) {
      triggerNotification(`Mỗi câu hỏi phải có ít nhất ${data.rules.minAnswers} đáp án`, 'warning')
      return
    }

    setExam((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          const filteredOptions = q.options.filter((opt) => opt.id !== optionId)
          // Nếu đáp án bị xóa là đáp án đúng duy nhất, tự chọn đáp án đầu tiên làm đáp án đúng
          const stillHasCorrect = filteredOptions.some((opt) => opt.isCorrect)
          if (!stillHasCorrect && filteredOptions.length > 0) {
            filteredOptions[0] = { ...filteredOptions[0], isCorrect: true }
          }
          return {
            ...q,
            options: filteredOptions,
          }
        }
        return q
      }),
    }))
  }

  // Chỉnh sửa chữ trong đáp án
  const handleOptionTextChange = (questionId, optionId, text) => {
    setExam((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((opt) => (opt.id === optionId ? { ...opt, text } : opt)),
          }
        }
        return q
      }),
    }))
  }

  // 6. Chọn đáp án đúng (Radio cho Single, Checkbox cho Multiple)
  const handleToggleOptionCorrect = (questionId, optionId, questionType) => {
    setExam((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          let updatedOptions
          if (questionType === 'single') {
            // Chỉ 1 đáp án được đúng
            updatedOptions = q.options.map((opt) => ({
              ...opt,
              isCorrect: opt.id === optionId,
            }))
          } else {
            // Nhiều đáp án được đúng: toggle
            updatedOptions = q.options.map((opt) => {
              if (opt.id === optionId) {
                return { ...opt, isCorrect: !opt.isCorrect }
              }
              return opt
            })
          }
          return {
            ...q,
            options: updatedOptions,
          }
        }
        return q
      }),
    }))
  }

  // --- CÁC HÀNH ĐỘNG KHÁC ---
  // Nạp đề thi mẫu
  const handleLoadSample = () => {
    setExam(data.sampleExam)
    setIsSubmitted(false)
    triggerNotification('Đã nạp đề thi mẫu thành công!')
  }

  // Xóa trắng làm mới
  const handleReset = () => {
    const freshExam = {
      ...INITIAL_EXAM,
      questions: [createNewQuestion(1)],
    }
    setExam(freshExam)
    setIsSubmitted(false)
    setPreviewUserAnswers({})
    localStorage.removeItem(STORAGE_KEY)
    triggerNotification('Đã làm mới đề thi về trạng thái ban đầu')
  }

  // 12. Nhấn Lưu đề thi để hiển thị dữ liệu dưới dạng JSON
  const handleSaveExam = () => {
    setIsSubmitted(true)
    if (!isValid) {
      triggerNotification('Vui lòng kiểm tra và sửa các lỗi bên dưới trước khi lưu!', 'warning')
      // Cuộn lên phần tử lỗi đầu tiên
      const firstErrorEl = document.querySelector('.bai03-error-text, .bai03-input-error')
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    // Đề thi hoàn toàn hợp lệ -> Mở modal JSON và báo thành công
    setShowJsonModal(true)
    triggerNotification('Lưu đề thi thành công! Dữ liệu JSON đã sẵn sàng xuất.')
  }

  // Xem trước tương tác cho sinh viên
  const handlePreviewAnswerSelect = (questionId, optionId, questionType) => {
    if (questionType === 'single') {
      setPreviewUserAnswers((prev) => ({ ...prev, [questionId]: optionId }))
    } else {
      const currentSelected = Array.isArray(previewUserAnswers[questionId]) ? previewUserAnswers[questionId] : []
      const nextSelected = currentSelected.includes(optionId)
        ? currentSelected.filter((id) => id !== optionId)
        : [...currentSelected, optionId]
      setPreviewUserAnswers((prev) => ({ ...prev, [questionId]: nextSelected }))
    }
  }

  // Nhãn môn học & mức độ
  const currentSubjectLabel = data.subjects.find((s) => s.value === exam.subject)?.label || exam.subject
  const currentLevelLabel = data.levels.find((l) => l.value === exam.level)?.label || exam.level

  return (
    <div className="bai03">
      {/* 1. Header & Tiêu đề */}
      <div className="bai03-header">
        <div className="bai03-title-wrap">
          <h2>Bài 3: Tạo đề thi trắc nghiệm</h2>
          <p className="subtitle">
            Hệ thống soạn thảo đề thi trực tuyến cho giảng viên — Quản lý câu hỏi, đáp án, tính điểm tự động và xuất
            JSON.
          </p>
        </div>

        {/* Thanh chuyển đổi Tab & Chức năng */}
        <div className="bai03-tab-switch">
          <button
            type="button"
            className={`bai03-tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            ✏️ Soạn thảo đề thi
          </button>
          <button
            type="button"
            className={`bai03-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            👁️ Xem trước đề thi ({currentQuestionCount} câu)
          </button>
        </div>
      </div>

      {/* Thông báo Alert Toast */}
      {notification && (
        <div className={`bai03-toast bai03-toast-${notification.type}`} role="status">
          <span className="bai03-toast-icon">
            {notification.type === 'success' ? '✓' : notification.type === 'warning' ? '⚠️' : 'ℹ️'}
          </span>
          <span className="bai03-toast-text">{notification.message}</span>
        </div>
      )}

      {/* Thanh Dashboard thống kê thời gian thực */}
      <div className="bai03-stat-bar">
        <div className="bai03-stat-item">
          <span className="bai03-stat-label">Tổng điểm đề thi</span>
          <span className="bai03-stat-value bai03-score-highlight">{totalScore.toFixed(2).replace(/\.00$/, '')} điểm</span>
        </div>
        <div className="bai03-stat-item">
          <span className="bai03-stat-label">Số câu hỏi hiện có</span>
          <span className="bai03-stat-value">
            {currentQuestionCount} / {exam.totalQuestions || 0} câu
          </span>
        </div>
        <div className="bai03-stat-item">
          <span className="bai03-stat-label">Thời gian thi</span>
          <span className="bai03-stat-value">{exam.duration} phút</span>
        </div>
        <div className="bai03-stat-item">
          <span className="bai03-stat-label">Trạng thái kiểm tra</span>
          <span className={`bai03-stat-badge ${isValid ? 'valid' : 'invalid'}`}>
            {isValid ? '● Hợp lệ' : '● Cần bổ sung dữ liệu'}
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CHẾ ĐỘ 1: SOẠN THẢO ĐỀ THI (EDITOR TAB) */}
      {/* ======================================================== */}
      {activeTab === 'editor' && (
        <div className="bai03-editor-layout">
          {/* Nhóm 1: Thông tin đề thi */}
          <section className="bai03-card">
            <div className="bai03-card-header">
              <h3 className="bai03-card-title">1. Thông tin chung của đề thi</h3>
              <div className="bai03-quick-actions">
                <button type="button" className="bai03-btn-subtle" onClick={handleLoadSample}>
                  ✨ Nạp đề mẫu
                </button>
                <button type="button" className="bai03-btn-subtle" onClick={handleReset}>
                  🔄 Làm mới
                </button>
              </div>
            </div>

            <div className="bai03-grid-2">
              {/* Tên đề thi */}
              <div className="bai03-form-group col-span-2">
                <label htmlFor="exam-title">
                  Tên đề thi <span className="bai03-required">*</span>
                </label>
                <input
                  id="exam-title"
                  name="title"
                  type="text"
                  placeholder="Ví dụ: Kiểm tra Giữa kỳ - Kiến trúc Phần mềm"
                  value={exam.title}
                  onChange={handleGeneralChange}
                  className={isSubmitted && errors.general.title ? 'bai03-input-error' : ''}
                />
                {isSubmitted && errors.general.title && (
                  <p className="bai03-error-text">{errors.general.title}</p>
                )}
              </div>

              {/* Môn học */}
              <div className="bai03-form-group">
                <label htmlFor="exam-subject">
                  Môn học <span className="bai03-required">*</span>
                </label>
                <select
                  id="exam-subject"
                  name="subject"
                  value={exam.subject}
                  onChange={handleGeneralChange}
                  className={isSubmitted && errors.general.subject ? 'bai03-input-error' : ''}
                >
                  {data.subjects.map((sub) => (
                    <option key={sub.value} value={sub.value}>
                      {sub.label}
                    </option>
                  ))}
                </select>
                {isSubmitted && errors.general.subject && (
                  <p className="bai03-error-text">{errors.general.subject}</p>
                )}
              </div>

              {/* Mức độ đề thi */}
              <div className="bai03-form-group">
                <label htmlFor="exam-level">
                  Mức độ đề thi <span className="bai03-required">*</span>
                </label>
                <select id="exam-level" name="level" value={exam.level} onChange={handleGeneralChange}>
                  {data.levels.map((lvl) => (
                    <option key={lvl.value} value={lvl.value}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Thời gian làm bài */}
              <div className="bai03-form-group">
                <label htmlFor="exam-duration">
                  Thời gian làm bài (phút) <span className="bai03-required">*</span>
                </label>
                <input
                  id="exam-duration"
                  name="duration"
                  type="number"
                  min={data.rules.minDuration}
                  max={data.rules.maxDuration}
                  value={exam.duration}
                  onChange={handleGeneralChange}
                  className={isSubmitted && errors.general.duration ? 'bai03-input-error' : ''}
                />
                {isSubmitted && errors.general.duration && (
                  <p className="bai03-error-text">{errors.general.duration}</p>
                )}
              </div>

              {/* Số lượng câu hỏi dự kiến */}
              <div className="bai03-form-group">
                <label htmlFor="exam-totalQuestions">
                  Số lượng câu hỏi dự kiến <span className="bai03-required">*</span>
                </label>
                <input
                  id="exam-totalQuestions"
                  name="totalQuestions"
                  type="number"
                  min="1"
                  max="100"
                  value={exam.totalQuestions}
                  onChange={handleGeneralChange}
                  className={isSubmitted && errors.general.totalQuestions ? 'bai03-input-error' : ''}
                />
                {isSubmitted && errors.general.totalQuestions && (
                  <p className="bai03-error-text">{errors.general.totalQuestions}</p>
                )}
              </div>
            </div>

            {/* Cảnh báo số câu hỏi chưa khớp */}
            {errors.general.questionCountMismatch && (
              <div className="bai03-notice-inline">
                ℹ️ {errors.general.questionCountMismatch}
              </div>
            )}
          </section>

          {/* Nhóm 2: Danh sách câu hỏi */}
          <section className="bai03-card">
            <div className="bai03-card-header">
              <div>
                <h3 className="bai03-card-title">2. Danh sách câu hỏi & đáp án</h3>
                <p className="bai03-card-desc">
                  Mỗi câu hỏi phải có ít nhất 2 đáp án và tối thiểu 1 đáp án được đánh dấu là đúng.
                </p>
              </div>
              <button type="button" className="bai03-btn bai03-btn-primary" onClick={handleAddQuestion}>
                ＋ Thêm câu hỏi
              </button>
            </div>

            {/* Danh sách từng câu hỏi */}
            <div className="bai03-questions-stack">
              {exam.questions.map((question, qIdx) => {
                const qNumber = qIdx + 1
                const qErrors = errors.questions[question.id] || {}

                return (
                  <div key={question.id} className="bai03-question-item">
                    {/* Header của câu hỏi */}
                    <div className="bai03-q-item-header">
                      <div className="bai03-q-number-tag">
                        <span className="bai03-q-badge">Câu {qNumber}</span>
                        <span className="bai03-q-type-badge">
                          {question.type === 'single' ? '◉ 1 đáp án đúng' : '☑ Nhiều đáp án đúng'}
                        </span>
                      </div>

                      <div className="bai03-q-header-controls">
                        {/* Thiết lập điểm từng câu */}
                        <div className="bai03-score-control">
                          <label htmlFor={`score-${question.id}`}>Điểm:</label>
                          <input
                            id={`score-${question.id}`}
                            type="number"
                            step="0.25"
                            min="0.25"
                            max="10"
                            value={question.score}
                            onChange={(e) => handleQuestionChange(question.id, 'score', e.target.value)}
                            className={isSubmitted && qErrors.score ? 'bai03-input-error' : ''}
                          />
                        </div>

                        {/* Xóa câu hỏi */}
                        <button
                          type="button"
                          className="bai03-btn-delete"
                          onClick={() => handleDeleteQuestion(question.id, qIdx)}
                          title="Xóa câu hỏi này"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </div>

                    {/* Lỗi điểm số */}
                    {isSubmitted && qErrors.score && <p className="bai03-error-text">{qErrors.score}</p>}

                    {/* Nội dung câu hỏi */}
                    <div className="bai03-form-group">
                      <label htmlFor={`content-${question.id}`}>
                        Nội dung câu hỏi <span className="bai03-required">*</span>
                      </label>
                      <textarea
                        id={`content-${question.id}`}
                        rows="2"
                        placeholder={`Nhập nội dung câu hỏi số ${qNumber}...`}
                        value={question.content}
                        onChange={(e) => handleQuestionChange(question.id, 'content', e.target.value)}
                        className={isSubmitted && qErrors.content ? 'bai03-input-error' : ''}
                      />
                      {isSubmitted && qErrors.content && <p className="bai03-error-text">{qErrors.content}</p>}
                    </div>

                    {/* Lựa chọn loại câu hỏi */}
                    <div className="bai03-type-selector">
                      <span className="bai03-field-label">Loại câu hỏi:</span>
                      <div className="bai03-radio-group">
                        {data.questionTypes.map((t) => (
                          <label key={t.value} className="bai03-type-radio-label">
                            <input
                              type="radio"
                              name={`type-${question.id}`}
                              value={t.value}
                              checked={question.type === t.value}
                              onChange={() => handleQuestionTypeChange(question.id, t.value)}
                            />
                            <span>{t.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Danh sách các phương án đáp án */}
                    <div className="bai03-options-section">
                      <div className="bai03-options-header">
                        <span className="bai03-field-label">
                          Danh sách đáp án (Tick chọn đáp án đúng):
                        </span>
                        <span className="bai03-options-hint">
                          {question.type === 'single'
                            ? 'Chọn nút tròn (Radio) cho đáp án duy nhất đúng'
                            : 'Tick ô vuông (Checkbox) cho tất cả đáp án đúng'}
                        </span>
                      </div>

                      {/* Thông báo lỗi về số lượng đáp án hoặc chưa chọn đáp án đúng */}
                      {isSubmitted && qErrors.optionsCount && (
                        <p className="bai03-error-text">{qErrors.optionsCount}</p>
                      )}
                      {isSubmitted && qErrors.correctAnswer && (
                        <p className="bai03-error-text">{qErrors.correctAnswer}</p>
                      )}
                      {isSubmitted && qErrors.optionContent && (
                        <p className="bai03-error-text">{qErrors.optionContent}</p>
                      )}

                      <div className="bai03-options-list">
                        {question.options.map((opt, optIdx) => {
                          const letter = String.fromCharCode(65 + optIdx)
                          return (
                            <div
                              key={opt.id}
                              className={`bai03-option-row ${opt.isCorrect ? 'bai03-option-correct' : ''}`}
                            >
                              {/* Nút chọn đáp án đúng */}
                              <label
                                className="bai03-correct-picker"
                                title={opt.isCorrect ? 'Đáp án đúng' : 'Đánh dấu đáp án này là đúng'}
                              >
                                {question.type === 'single' ? (
                                  <input
                                    type="radio"
                                    name={`correct-${question.id}`}
                                    checked={opt.isCorrect}
                                    onChange={() =>
                                      handleToggleOptionCorrect(question.id, opt.id, 'single')
                                    }
                                  />
                                ) : (
                                  <input
                                    type="checkbox"
                                    checked={opt.isCorrect}
                                    onChange={() =>
                                      handleToggleOptionCorrect(question.id, opt.id, 'multiple')
                                    }
                                  />
                                )}
                                <span className="bai03-opt-letter">{letter}</span>
                              </label>

                              {/* Input nhập nội dung đáp án */}
                              <input
                                type="text"
                                placeholder={`Nội dung đáp án ${letter}...`}
                                value={opt.text}
                                onChange={(e) =>
                                  handleOptionTextChange(question.id, opt.id, e.target.value)
                                }
                                className={`bai03-opt-input ${
                                  isSubmitted && (!opt.text || !opt.text.trim()) ? 'bai03-input-error' : ''
                                }`}
                              />

                              {/* Badge nhãn Đúng */}
                              {opt.isCorrect && (
                                <span className="bai03-badge-correct">✓ Đáp án đúng</span>
                              )}

                              {/* Nút xóa đáp án */}
                              <button
                                type="button"
                                className="bai03-btn-opt-delete"
                                onClick={() => handleDeleteOption(question.id, opt.id)}
                                title="Xóa đáp án này"
                                disabled={question.options.length <= data.rules.minAnswers}
                              >
                                ✕
                              </button>
                            </div>
                          )
                        })}
                      </div>

                      {/* Nút thêm đáp án */}
                      <button
                        type="button"
                        className="bai03-btn-add-opt"
                        onClick={() => handleAddOption(question.id)}
                        disabled={question.options.length >= data.rules.maxAnswers}
                      >
                        ＋ Thêm đáp án ({question.options.length}/{data.rules.maxAnswers})
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Nút thêm câu hỏi ở cuối danh sách */}
            <div className="bai03-add-question-footer">
              <button type="button" className="bai03-btn bai03-btn-outline" onClick={handleAddQuestion}>
                ＋ Thêm câu hỏi tiếp theo (Câu {exam.questions.length + 1})
              </button>
            </div>
          </section>

          {/* Hàng nút hành động cuối trang */}
          <div className="bai03-action-bar">
            <div className="bai03-action-summary">
              <span>
                Đang có <strong>{currentQuestionCount}</strong> câu hỏi · Tổng điểm:{' '}
                <strong>{totalScore.toFixed(2).replace(/\.00$/, '')}</strong> điểm
              </span>
            </div>
            <div className="bai03-action-buttons">
              <button
                type="button"
                className="bai03-btn bai03-btn-secondary"
                onClick={() => setActiveTab('preview')}
              >
                👁️ Xem trước đề thi
              </button>
              <button type="button" className="bai03-btn bai03-btn-primary" onClick={handleSaveExam}>
                💾 Lưu đề thi & Xuất JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CHẾ ĐỘ 2: XEM TRƯỚC ĐỀ THI (PREVIEW TAB) */}
      {/* ======================================================== */}
      {activeTab === 'preview' && (
        <div className="bai03-preview-layout">
          {/* Toolbar trong chế độ xem trước */}
          <div className="bai03-preview-toolbar">
            <button
              type="button"
              className="bai03-btn bai03-btn-outline"
              onClick={() => setActiveTab('editor')}
            >
              ← Quay lại soạn thảo
            </button>
            <div className="bai03-preview-toggles">
              <label className="bai03-toggle-label">
                <input
                  type="checkbox"
                  checked={showCorrectAnswersInPreview}
                  onChange={(e) => setShowCorrectAnswersInPreview(e.target.checked)}
                />
                <span>Hiện đáp án đúng & giải thích (Dành cho Giảng viên)</span>
              </label>
              <button type="button" className="bai03-btn bai03-btn-primary" onClick={handleSaveExam}>
                💾 Lưu đề thi & Xuất JSON
              </button>
            </div>
          </div>

          {/* Khung tờ giấy đề thi chuẩn sư phạm (Exam Paper Look) */}
          <div className="bai03-exam-paper">
            {/* Header tờ đề thi */}
            <div className="bai03-paper-header">
              <div className="bai03-paper-school">
                <h4>TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN</h4>
                <p>KHOA CÔNG NGHỆ PHẦN MỀM</p>
              </div>
              <div className="bai03-paper-meta-right">
                <p>
                  <strong>Môn thi:</strong> {currentSubjectLabel}
                </p>
                <p>
                  <strong>Thời gian:</strong> {exam.duration} phút
                </p>
                <p>
                  <strong>Mức độ:</strong> {currentLevelLabel}
                </p>
              </div>
            </div>

            <div className="bai03-paper-title-box">
              <h3 className="bai03-paper-exam-name">
                {exam.title.trim() ? exam.title : 'ĐỀ THI TRẮC NGHIỆM CHƯA ĐẶT TÊN'}
              </h3>
              <p className="bai03-paper-note">
                (Đề thi gồm {currentQuestionCount} câu · Tổng điểm:{' '}
                {totalScore.toFixed(2).replace(/\.00$/, '')} điểm · Thí sinh không được sử dụng tài liệu)
              </p>
            </div>

            {/* Thí sinh điền thông tin */}
            <div className="bai03-student-info-mock">
              <span>Họ và tên thí sinh: ................................................................</span>
              <span>MSSV: ........................................ Phòng thi: ............</span>
            </div>

            <hr className="bai03-paper-divider" />

            {/* Danh sách câu hỏi trong tờ đề thi */}
            <div className="bai03-paper-questions">
              {exam.questions.map((q, idx) => {
                const qNum = idx + 1
                const selectedAnswer = previewUserAnswers[q.id]

                return (
                  <div key={q.id} className="bai03-paper-q-block">
                    <div className="bai03-paper-q-title">
                      <span className="bai03-paper-q-bold">Câu {qNum}:</span>{' '}
                      <span className="bai03-paper-q-text">
                        {q.content.trim() ? q.content : '(Chưa nhập nội dung câu hỏi)'}
                      </span>
                      <span className="bai03-paper-q-score">({q.score} điểm)</span>
                    </div>

                    {/* Danh sách các đáp án A, B, C, D */}
                    <div className="bai03-paper-options-grid">
                      {q.options.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx)
                        const isChosen =
                          q.type === 'single'
                            ? selectedAnswer === opt.id
                            : Array.isArray(selectedAnswer) && selectedAnswer.includes(opt.id)

                        const isAnswerKey = opt.isCorrect && showCorrectAnswersInPreview

                        return (
                          <div
                            key={opt.id}
                            className={`bai03-paper-opt-item ${isChosen ? 'chosen' : ''} ${
                              isAnswerKey ? 'correct-highlight' : ''
                            }`}
                            onClick={() => handlePreviewAnswerSelect(q.id, opt.id, q.type)}
                            role="presentation"
                          >
                            <span className="bai03-paper-opt-letter">{letter}.</span>
                            <span className="bai03-paper-opt-text">
                              {opt.text.trim() ? opt.text : '(Trống)'}
                            </span>
                            {isAnswerKey && (
                              <span className="bai03-paper-badge-key">✓ Đáp án đúng</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bai03-paper-footer">
              <p>─── HẾT ───</p>
              <p className="bai03-paper-sub-footer">Cán bộ coi thi không giải thích gì thêm.</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xuất dữ liệu JSON (Yêu cầu 12) */}
      <JsonModal
        isOpen={showJsonModal}
        onClose={() => setShowJsonModal(false)}
        dataObj={{
          examInfo: {
            title: exam.title,
            subject: exam.subject,
            subjectName: currentSubjectLabel,
            durationMinutes: exam.duration,
            totalDeclaredQuestions: exam.totalQuestions,
            actualQuestionsCount: currentQuestionCount,
            level: exam.level,
            levelName: currentLevelLabel,
            totalScore: Number(totalScore.toFixed(2)),
          },
          questions: exam.questions.map((q, idx) => ({
            questionNumber: idx + 1,
            id: q.id,
            content: q.content,
            type: q.type,
            typeName: q.type === 'single' ? 'Một đáp án đúng' : 'Nhiều đáp án đúng',
            score: Number(q.score),
            options: q.options.map((opt, oIdx) => ({
              order: String.fromCharCode(65 + oIdx),
              id: opt.id,
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
            correctAnswers: q.options
              .filter((opt) => opt.isCorrect)
              .map((opt, oIdx) => ({
                id: opt.id,
                order: String.fromCharCode(65 + oIdx),
                text: opt.text,
              })),
          })),
          exportedAt: new Date().toISOString(),
        }}
      />
    </div>
  )
}
