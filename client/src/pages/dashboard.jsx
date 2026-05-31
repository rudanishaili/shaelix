import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../utils/api"

function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [savedVideos, setSavedVideos] = useState(0)

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await API.get("/videos/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setSavedVideos(res.data.length)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-[#0F0F14] text-white px-8 py-6">
      <nav className="flex items-center justify-between border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
          Shaelix
        </h1>

        <button
          onClick={handleLogout}
          className="rounded-xl border border-white/10 px-5 py-2 hover:border-[#FF5DA2]"
        >
          Logout
        </button>
      </nav>

      <section className="mt-12">
        <p className="text-gray-400">Welcome back,</p>

        <h2 className="mt-2 text-5xl font-bold">
          {user?.name || "Learner"} 👋
        </h2>

        <p className="mt-4 max-w-2xl text-gray-400">
          Ready to turn videos into structured learning notes?
        </p>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div
          onClick={() => navigate("/analyzer")}
          className="cursor-pointer rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition-all duration-300 hover:border-[#B388FF]"
        >
          <h3 className="text-2xl font-bold">🎥 Analyze Video</h3>

          <p className="mt-3 text-gray-400">
            Paste a YouTube video and generate AI learning notes.
          </p>
        </div>

        <div
          onClick={() => navigate("/history")}
          className="cursor-pointer rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition-all duration-300 hover:border-[#FF5DA2]"
        >
          <h3 className="text-2xl font-bold">📚 View History</h3>

          <p className="mt-3 text-gray-400">
            Open all your previous analyses and saved notes.
          </p>
        </div>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-xl font-bold">Saved Videos</h3>
          <p className="mt-3 text-4xl font-bold text-[#B388FF]">
            {savedVideos}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-xl font-bold">Flashcards</h3>
          <p className="mt-3 text-4xl font-bold text-[#FF5DA2]">0</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-xl font-bold">Quizzes</h3>
          <p className="mt-3 text-4xl font-bold text-[#FFD95A]">0</p>
        </div>
      </section>
    </div>
  )
}

export default Dashboard