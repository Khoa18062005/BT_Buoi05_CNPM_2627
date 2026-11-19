import { useEffect, useRef, useState } from 'react'
import Home from './pages/Home'
import Bai01 from './pages/Bai01'
import Bai02 from './pages/Bai02'
import Bai03 from './pages/Bai03'
import Bai04 from './pages/Bai04'
import './App.css'

// Cấu hình điều hướng: mỗi bài có đường dẫn riêng (#/bai01, #/bai02, ...)
const ROUTES = [
  {
    path: '/bai01',
    label: 'Bài 1',
    title: 'Đăng ký tuyển sinh',
    description: 'Form đăng ký, kiểm tra dữ liệu, xác nhận thông tin trước khi gửi.',
    component: Bai01,
  },
  {
    path: '/bai02',
    label: 'Bài 2',
    title: 'Đặt phòng khách sạn',
    description: 'Chọn ngày, loại phòng, dịch vụ và tự động tính tổng chi phí.',
    component: Bai02,
  },
  {
    path: '/bai03',
    label: 'Bài 3',
    title: 'Tạo đề thi trắc nghiệm',
    description: 'Thêm/sửa/xoá câu hỏi, đáp án, tính tổng điểm và xuất JSON.',
    component: Bai03,
  },
  {
    path: '/bai04',
    label: 'Bài 4',
    title: 'Thêm mới nhân viên',
    description: 'Thông tin cá nhân, công việc, kỹ năng, chứng chỉ và kiểm tra trùng mã.',
    component: Bai04,
  },
]

const HOME_PATH = '/'

// Nút "ngôi nhà" nổi ở góc dưới bên phải: hover (hoặc bấm) để hiện các bài tập
function HouseNav({ routes, currentPath, onNavigate }) {
  const [open, setOpen] = useState(false)
  const navRef = useRef(null)

  // Đóng menu khi bấm ra ngoài hoặc nhấn Esc
  useEffect(() => {
    if (!open) return undefined
    const handlePointerDown = (e) => {
      if (!navRef.current?.contains(e.target)) setOpen(false)
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <nav
      ref={navRef}
      className={open ? 'house-nav open' : 'house-nav'}
      aria-label="Danh sách bài tập"
      onMouseLeave={() => setOpen(false)}
    >
      <ul id="house-menu" className="house-menu">
        {routes.map((r, index) => (
          // --i: thứ tự xuất hiện, nút gần ngôi nhà nhất hiện trước
          <li key={r.path} style={{ '--i': routes.length - 1 - index }}>
            <a
              href={`#${r.path}`}
              className={r.path === currentPath ? 'house-link active' : 'house-link'}
              aria-current={r.path === currentPath ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault()
                setOpen(false)
                onNavigate(r.path)
              }}
            >
              <span className="house-link-label">{r.label}</span>
              <span className="house-link-title">{r.title}</span>
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="house-btn"
        aria-expanded={open}
        aria-controls="house-menu"
        aria-label="Chọn bài tập"
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path className="house-roof" d="M2.5 11 12 3l9.5 8" />
          <path className="house-walls" d="M5 9.5V20.5h14V9.5" />
          <path className="house-door" d="M10 20.5v-5.5a2 2 0 0 1 4 0v5.5z" />
        </svg>
      </button>
    </nav>
  )
}

// Đọc đường dẫn hiện tại từ hash: "#/bai01" -> "/bai01"
function getPathFromHash() {
  const path = window.location.hash.replace(/^#/, '')
  return path || HOME_PATH
}

function App() {
  const [path, setPath] = useState(getPathFromHash)

  // Đồng bộ khi người dùng bấm Back/Forward hoặc sửa URL trực tiếp
  useEffect(() => {
    const handleHashChange = () => {
      setPath(getPathFromHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (to) => {
    window.location.hash = to
  }

  const currentIndex = ROUTES.findIndex((r) => r.path === path)
  const current = ROUTES[currentIndex]
  const isHome = path === HOME_PATH
  const Page = current?.component
  const prev = ROUTES[currentIndex - 1]
  const next = ROUTES[currentIndex + 1]

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <a
            href="#/"
            className="app-title"
            onClick={(e) => {
              e.preventDefault()
              navigate(HOME_PATH)
            }}
          >
            <span className="app-logo" aria-hidden="true" />
            Bài tập Buổi 05 — React
          </a>
        </h1>
      </header>

      <main className="app-main">
        {isHome && <Home routes={ROUTES} onNavigate={navigate} />}

        {Page && (
          <>
            <div className="breadcrumb">
              <button type="button" className="link-btn" onClick={() => navigate(HOME_PATH)}>
                Trang chủ
              </button>
              <span>/</span>
              <span>
                {current.label}: {current.title}
              </span>
            </div>

            <Page key={current.path} />

            <div className="page-pager">
              {prev ? (
                <button type="button" className="pager-btn" onClick={() => navigate(prev.path)}>
                  ← {prev.label}: {prev.title}
                </button>
              ) : (
                <span />
              )}
              {next && (
                <button type="button" className="pager-btn" onClick={() => navigate(next.path)}>
                  {next.label}: {next.title} →
                </button>
              )}
            </div>
          </>
        )}

        {!isHome && !Page && (
          <div className="not-found">
            <h2>Không tìm thấy trang</h2>
            <p className="subtitle">Đường dẫn "{path}" không tồn tại.</p>
            <button type="button" className="pager-btn" onClick={() => navigate(HOME_PATH)}>
              Về trang chủ
            </button>
          </div>
        )}
      </main>

      <HouseNav routes={ROUTES} currentPath={path} onNavigate={navigate} />
    </div>
  )
}

export default App
