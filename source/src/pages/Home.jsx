import '../styles/Home.css'

// Trang chủ: lời chào + hướng dẫn mở danh sách bài ở nút "ngôi nhà" góc dưới bên phải
export default function Home({ routes }) {
  return (
    <div className="home">
      <section className="home-hero">
        <span className="home-sun" aria-hidden="true" />
        <span className="home-cloud home-cloud-a" aria-hidden="true" />
        <span className="home-cloud home-cloud-b" aria-hidden="true" />

        <h2>
          Chọn một bài <mark>để bắt đầu</mark>
        </h2>
        <p className="subtitle">
          {routes.length} bài thực hành React thuần: form, kiểm tra dữ liệu và tính toán tự động, dữ liệu
          mẫu lấy từ file JSON.
        </p>
      </section>

      <div className="home-hint">
        <p>
          <strong>Danh sách bài nằm trong ngôi nhà</strong>
          <span>Rê chuột (hoặc bấm) vào nút ở góc dưới bên phải để chọn bài.</span>
        </p>
        <svg className="home-arrow" viewBox="0 0 120 90" aria-hidden="true">
          <path d="M6 8c40 0 78 14 96 62" />
          <path d="M88 62l15 12 6-18" />
        </svg>
      </div>
    </div>
  )
}
