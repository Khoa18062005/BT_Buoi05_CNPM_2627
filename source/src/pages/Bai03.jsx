import { useState, useEffect } from 'react'
import data from '../data/Bai03.json'
import '../styles/Bai03.css'

// 1. Các Component Icon SVG Tối Giản (Thay thế hoàn toàn Emojis, không cài thư viện)
function IconEdit() {
  return (
    <svg className="bai03-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}

function IconEye() {
  return (
    <svg className="bai03-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconSave() {
  return (
    <svg className="bai03-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg className="bai03-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg className="bai03-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function IconRefresh() {
  return (
    <svg className="bai03-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  )
}

function IconFileSample() {
  return (
    <svg className="bai03-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

function IconArrowLeft() {
  return (
    <svg className="bai03-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg className="bai03-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconCopy() {
  return (
    <svg className="bai03-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function IconDownload() {
  return (
    <svg className="bai03-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg className="bai03-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function IconInfo() {
  return (
    <svg className="bai03-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function IconAlertTriangle() {
  return (
    <svg className="bai03-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

// 2. Hằng số & Giá trị khởi tạo
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
  questions: [createNewQuestion()],
}

// 3. Hàm thuần túy: Validate & Tính toán
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

// 4. Component Con: Modal Xuất JSON
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
    const fileName = `de-thi-${dataObj.examInfo?.subject || 'trac-nghiem'}-${Date.now()}.json`
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
            <IconClose />
          </button>
        </div>

        <div className="bai03-modal-body">
          <pre className="bai03-json-view">
            <code>{jsonString}</code>
          </pre>
        </div>

        <div className="bai03-modal-footer">
          <button type="button" className="bai03-btn bai03-btn-secondary" onClick={handleCopy}>
            {copied ? (
              <>
                <IconCheck /> Đã sao chép
              </>
            ) : (
              <>
                <IconCopy /> Sao chép JSON
              </>
            )}
          </button>
          <button type="button" className="bai03-btn bai03-btn-primary" onClick={handleDownload}>
            <IconDownload /> Tải file .json
          </button>
          <button type="button" className="bai03-btn bai03-btn-outline" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

// 5. Component Chính
export default function Bai03() {
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

  // Giá trị tính toán trực tiếp trong lúc render
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

  // 1. Thêm câu hỏi mới
  const handleAddQuestion = () => {
    const newQ = createNewQuestion()
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
          if (newType === 'single') {
            let foundFirstCorrect = false
            updatedOptions = updatedOptions.map((opt) => {
              if (opt.isCorrect && !foundFirstCorrect) {
                foundFirstCorrect = true
                return opt
              }
              return { ...opt, isCorrect: false }
            })
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
            updatedOptions = q.options.map((opt) => ({
              ...opt,
              isCorrect: opt.id === optionId,
            }))
          } else {
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
      questions: [createNewQuestion()],
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
      const firstErrorEl = document.querySelector('.bai03-error-text, .bai03-input-error')
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setShowJsonModal(true)
    triggerNotification('Lưu đề thi thành công! Dữ liệu JSON đã sẵn sàng xuất.')
  }

  // Xem trước tương tác
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

        {/* Thanh chuyển đổi Segmented Control (Thiết kế cao cấp, diệt AI-slop) */}
        <div className="bai03-segmented-control" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'editor'}
            className={`bai03-segment-btn ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            <IconEdit />
            <span>Soạn thảo đề thi</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'preview'}
            className={`bai03-segment-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <IconEye />
            <span>Xem trước đề thi ({currentQuestionCount} câu)</span>
          </button>
        </div>
      </div>

      {/* Thông báo Alert Toast với Icon SVG */}
      {notification && (
        <div className={`bai03-toast bai03-toast-${notification.type}`} role="status">
          <span className="bai03-toast-icon">
            {notification.type === 'success' ? (
              <IconCheck />
            ) : notification.type === 'warning' ? (
              <IconAlertTriangle />
            ) : (
              <IconInfo />
            )}
          </span>
          <span className="bai03-toast-text">{notification.message}</span>
        </div>
      )}

      {/* Thanh Dashboard thống kê thời gian thực */}
      <div className="bai03-stat-bar">
        <div className="bai03-stat-item">
          <span className="bai03-stat-label">Tổng điểm đề thi</span>
          <span className="bai03-stat-value bai03-score-highlight">
            {totalScore.toFixed(2).replace(/\.00$/, '')} điểm
          </span>
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
          <div className={`bai03-stat-badge ${isValid ? 'valid' : 'invalid'}`}>
            <span className="bai03-badge-dot" />
            <span>{isValid ? 'Hợp lệ' : 'Cần bổ sung dữ liệu'}</span>
          </div>
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
                  <IconFileSample />
                  <span>Nạp đề mẫu</span>
                </button>
                <button type="button" className="bai03-btn-subtle" onClick={handleReset}>
                  <IconRefresh />
                  <span>Làm mới</span>
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
                <IconInfo />
                <span>{errors.general.questionCountMismatch}</span>
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
                <IconPlus />
                <span>Thêm câu hỏi</span>
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
                          {question.type === 'single' ? 'Một đáp án đúng' : 'Nhiều đáp án đúng'}
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
                          <IconTrash />
                          <span>Xóa</span>
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
                          Danh sách đáp án:
                        </span>
                        <span className="bai03-options-hint">
                          {question.type === 'single'
                            ? 'Chọn nút tròn cho đáp án duy nhất đúng'
                            : 'Tick ô vuông cho tất cả đáp án đúng'}
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
                                <span className="bai03-badge-correct">
                                  <IconCheck />
                                  <span>Đáp án đúng</span>
                                </span>
                              )}

                              {/* Nút xóa đáp án */}
                              <button
                                type="button"
                                className="bai03-btn-opt-delete"
                                onClick={() => handleDeleteOption(question.id, opt.id)}
                                title="Xóa đáp án này"
                                disabled={question.options.length <= data.rules.minAnswers}
                              >
                                <IconClose />
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
                        <IconPlus />
                        <span>Thêm đáp án ({question.options.length}/{data.rules.maxAnswers})</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Nút thêm câu hỏi ở cuối danh sách */}
            <div className="bai03-add-question-footer">
              <button type="button" className="bai03-btn bai03-btn-outline" onClick={handleAddQuestion}>
                <IconPlus />
                <span>Thêm câu hỏi tiếp theo (Câu {exam.questions.length + 1})</span>
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
                <IconEye />
                <span>Xem trước đề thi</span>
              </button>
              <button type="button" className="bai03-btn bai03-btn-primary" onClick={handleSaveExam}>
                <IconSave />
                <span>Lưu đề thi & Xuất JSON</span>
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
              <IconArrowLeft />
              <span>Quay lại soạn thảo</span>
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
                <IconSave />
                <span>Lưu đề thi & Xuất JSON</span>
              </button>
            </div>
          </div>

          {/* Khung tờ giấy đề thi chuẩn sư phạm (Exam Paper Look) */}
          <div className="bai03-exam-paper">
            {/* Header tờ đề thi */}
            <div className="bai03-paper-header">
              <div className="bai03-paper-school">
                <h4>TRƯỜNG ĐẠI HỌC CÔNG NGHỆ KỸ THUẬT THÀNH PHỐ HỒ CHÍ MINH</h4>
                <p>KHOA CÔNG NGHỆ THÔNG TIN</p>
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
                              <span className="bai03-paper-badge-key">
                                <IconCheck />
                                <span>Đáp án đúng</span>
                              </span>
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
