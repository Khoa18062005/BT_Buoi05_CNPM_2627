import { useEffect, useState } from 'react'
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
            Bài tập Buổi 05 — React
          </a>
        </h1>
        <nav className="app-nav">
          <button
            type="button"
            className={isHome ? 'nav-btn active' : 'nav-btn'}
            onClick={() => navigate(HOME_PATH)}
          >
            <span className="nav-label">Trang chủ</span>
            <span className="nav-title">Danh sách bài</span>
          </button>
          {ROUTES.map((r) => (
            <button
              key={r.path}
              type="button"
              className={r.path === path ? 'nav-btn active' : 'nav-btn'}
              onClick={() => navigate(r.path)}
            >
              <span className="nav-label">{r.label}</span>
              <span className="nav-title">{r.title}</span>
            </button>
          ))}
        </nav>
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
    </div>
  )
}

export default App
