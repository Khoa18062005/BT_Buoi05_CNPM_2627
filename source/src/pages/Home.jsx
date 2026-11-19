import '../styles/Home.css'

export default function Home({ routes, onNavigate }) {
  return (
    <div className="home">
      <h2>Danh sách bài tập</h2>
      <p className="subtitle">Chọn một bài để bắt đầu</p>

      <div className="home-grid">
        {routes.map((r) => (
          <a
            key={r.path}
            href={`#${r.path}`}
            className="home-card"
            onClick={(e) => {
              e.preventDefault()
              onNavigate(r.path)
            }}
          >
            <span className="home-card-label">{r.label}</span>
            <h3>{r.title}</h3>
            <p>{r.description}</p>
            <span className="home-card-link">Mở bài →</span>
          </a>
        ))}
      </div>
    </div>
  )
}
