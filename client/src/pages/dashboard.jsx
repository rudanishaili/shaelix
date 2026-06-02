import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../utils/api"

function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [stats, setStats] = useState({
    savedVideos: 0,
    totalFlashcards: 0,
    totalQuizzes: 0,
    averageQuizScore: 0,
    recentAnalyses: [],
  })

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await API.get("/videos/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setStats(res.data)
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
          Continue learning without losing focus.
        </p>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div
          onClick={() => navigate("/analyzer")}
          className="cursor-pointer rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition-all duration-300 hover:border-[#B388FF]"
        >
          <h3 className="text-2xl font-bold">🎥 Analyze Video</h3>
          <p className="mt-3 text-gray-400">
            Generate notes, flashcards, quiz, timestamps and mind map.
          </p>
        </div>

        <div
          onClick={() => navigate("/history")}
          className="cursor-pointer rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition-all duration-300 hover:border-[#FF5DA2]"
        >
          <h3 className="text-2xl font-bold">📚 View History</h3>
          <p className="mt-3 text-gray-400">
            Reopen saved analyses and continue revision.
          </p>
        </div>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-lg font-bold">Saved Videos</h3>
          <p className="mt-3 text-4xl font-bold text-[#B388FF]">
            {stats.savedVideos}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-lg font-bold">Flashcards</h3>
          <p className="mt-3 text-4xl font-bold text-[#FF5DA2]">
            {stats.totalFlashcards}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-lg font-bold">Quiz Questions</h3>
          <p className="mt-3 text-4xl font-bold text-[#FFD95A]">
            {stats.totalQuizzes}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-lg font-bold">Avg Score</h3>
          <p className="mt-3 text-4xl font-bold text-green-400">
            {stats.averageQuizScore}%
          </p>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Recent Analyses</h2>

          <button
            onClick={() => navigate("/history")}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-[#B388FF] hover:border-[#B388FF]"
          >
            View All
          </button>
        </div>

        <div className="grid gap-4">
          {stats.recentAnalyses.length > 0 ? (
            stats.recentAnalyses.map((analysis) => (
              <div
                key={analysis._id}
                onClick={() => navigate(`/analysis/${analysis._id}`)}
                className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:border-[#B388FF]"
              >
                <p className="text-sm text-gray-400">
                  {new Date(analysis.createdAt).toLocaleDateString()}
                </p>

                <p className="mt-2 break-all font-semibold">
                  {analysis.videoUrl}
                </p>

                <p className="mt-3 text-sm text-[#B388FF]">
                  Open analysis →
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-gray-400">
              No recent analyses yet.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Dashboard