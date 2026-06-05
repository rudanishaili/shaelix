import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../utils/api"
import dashboardBg from "../assets/6.jpg"

function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [stats, setStats] = useState({
    savedVideos: 0,
    totalFlashcards: 0,
    totalQuizzes: 0,
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
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div
        className="fixed inset-0 scale-110 bg-cover bg-center animate-[dashboardDrift_34s_ease-in-out_infinite_alternate]"
        style={{ backgroundImage: `url(${dashboardBg})` }}
      />

      <div className="fixed inset-0 bg-black/55" />
      <div className="fixed inset-0 bg-gradient-to-br from-black/80 via-[#03110D]/50 to-black/80" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:76px_76px] opacity-25" />

      <div className="pointer-events-none fixed left-[12%] top-[20%] h-48 w-48 rounded-full bg-[#B388FF]/20 blur-3xl animate-[floatGlow_9s_ease-in-out_infinite]" />
      <div className="pointer-events-none fixed right-[14%] top-[30%] h-56 w-56 rounded-full bg-[#FF5DA2]/15 blur-3xl animate-[floatGlow_11s_ease-in-out_infinite]" />
      <div className="pointer-events-none fixed bottom-[12%] left-[45%] h-56 w-56 rounded-full bg-[#FFD95A]/10 blur-3xl animate-[floatGlow_13s_ease-in-out_infinite]" />

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-black/35 p-6 backdrop-blur-2xl lg:block">
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
            Shaelix
          </h1>

          <p className="mt-2 text-sm text-white/50">
            AI Learning Command Center
          </p>

          <div className="mt-10 space-y-3">
            <button className="w-full rounded-2xl border border-[#B388FF]/40 bg-white/[0.08] px-5 py-4 text-left font-semibold text-white">
              ✦ Dashboard
            </button>

            <button
              onClick={() => navigate("/analyzer")}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-left text-white/70 transition-all hover:border-[#B388FF] hover:text-white"
            >
              🎥 Analyzer
            </button>

            <button
              onClick={() => navigate("/history")}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-left text-white/70 transition-all hover:border-[#FF5DA2] hover:text-white"
            >
              📚 History
            </button>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.05] p-5">
            <p className="text-sm text-white/50">Today’s focus</p>
            <p className="mt-3 font-bold leading-6">
              Analyze one video and revise with quiz mode.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 w-full rounded-2xl border border-red-400/30 px-5 py-3 text-red-300 transition-all hover:border-red-400"
          >
            Logout
          </button>
        </aside>

        <main className="flex-1 px-6 py-6 lg:px-10">
          <nav className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/30 px-6 py-4 backdrop-blur-2xl">
            <div>
              <p className="text-sm text-white/50">Workspace</p>
              <h2 className="text-xl font-black">Learning Overview</h2>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchStats}
                className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm text-white/80 transition-all hover:border-[#B388FF]"
              >
                Refresh
              </button>

              <button
                onClick={handleLogout}
                className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm text-white/80 transition-all hover:border-[#FF5DA2] lg:hidden"
              >
                Logout
              </button>
            </div>
          </nav>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2.5rem] border border-white/10 bg-black/35 p-8 shadow-2xl shadow-black/50 backdrop-blur-2xl animate-[fadeSlideUp_850ms_ease-out]">
              <p className="inline-flex rounded-full border border-[#FFD95A]/30 bg-[#FFD95A]/10 px-4 py-2 text-sm font-semibold text-[#FFD95A]">
                Welcome back
              </p>

              <h1 className="mt-6 text-5xl font-black leading-tight md:text-6xl">
                {user?.name || "Learner"}, your learning system is{" "}
                <span className="bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
                  ready.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
                Continue analyzing videos, revising with flashcards, and
                building your personal AI study library.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/analyzer")}
                  className="rounded-2xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] px-6 py-4 font-black text-black transition-all hover:scale-105"
                >
                  Analyze New Video →
                </button>

                <button
                  onClick={() => navigate("/history")}
                  className="rounded-2xl border border-white/15 bg-white/[0.05] px-6 py-4 font-bold text-white backdrop-blur-xl transition-all hover:border-[#B388FF]"
                >
                  Open History
                </button>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/10 bg-black/35 p-8 shadow-2xl shadow-black/50 backdrop-blur-2xl animate-[fadeSlideUp_1000ms_ease-out]">
              <p className="text-sm uppercase tracking-[0.35em] text-[#FFD95A]">
                Live Status
              </p>

              <h2 className="mt-4 text-3xl font-black">Study Pulse</h2>

              <div className="mt-8 space-y-5">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Focus Flow</span>
                    <span className="text-[#B388FF]">82%</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-white/10">
                    <div className="h-3 w-[82%] rounded-full bg-gradient-to-r from-[#B388FF] to-[#FF5DA2]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Revision Energy</span>
                    <span className="text-[#FFD95A]">68%</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-white/10">
                    <div className="h-3 w-[68%] rounded-full bg-gradient-to-r from-[#FF5DA2] to-[#FFD95A]" />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <p className="text-sm text-white/50">Next best action</p>
                  <p className="mt-2 font-bold">
                    Analyze a video and complete one quiz round.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["Saved Videos", stats.savedVideos, "#B388FF", "📚"],
              ["Flashcards", stats.totalFlashcards, "#FF5DA2", "🧠"],
              ["Quiz Questions", stats.totalQuizzes, "#FFD95A", "🎯"],
            ].map((item) => (
              <div
                key={item[0]}
                className="rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-xl shadow-black/30 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-white/30"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{item[0]}</h3>
                  <span className="text-3xl">{item[3]}</span>
                </div>

                <p
                  className="mt-4 text-5xl font-black"
                  style={{ color: item[2] }}
                >
                  {item[1]}
                </p>

                <p className="mt-3 text-sm text-white/50">
                  Generated from your learning videos
                </p>
              </div>
            ))}
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2.5rem] border border-white/10 bg-black/35 p-8 backdrop-blur-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-[#FFD95A]">
                Quick Launch
              </p>

              <div className="mt-6 grid gap-4">
                <button
                  onClick={() => navigate("/analyzer")}
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-left transition-all hover:translate-x-2 hover:border-[#B388FF]"
                >
                  <h3 className="text-xl font-black">🎥 Analyze Video</h3>
                  <p className="mt-2 text-sm text-white/60">
                    Generate notes, quiz, flashcards and mind map.
                  </p>
                </button>

                <button
                  onClick={() => navigate("/history")}
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-left transition-all hover:translate-x-2 hover:border-[#FF5DA2]"
                >
                  <h3 className="text-xl font-black">📚 View History</h3>
                  <p className="mt-2 text-sm text-white/60">
                    Reopen saved analyses and continue revision.
                  </p>
                </button>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/10 bg-black/35 p-8 backdrop-blur-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-[#FFD95A]">
                    Recent
                  </p>
                  <h2 className="mt-2 text-3xl font-black">Recent Analyses</h2>
                </div>

                <button
                  onClick={() => navigate("/history")}
                  className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-[#B388FF] hover:border-[#B388FF]"
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
                      className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition-all duration-300 hover:translate-x-2 hover:border-[#B388FF]"
                    >
                      <p className="text-sm text-white/45">
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
                  <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-white/50">
                    No recent analyses yet.
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Dashboard