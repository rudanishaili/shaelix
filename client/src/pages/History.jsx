import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../utils/api"
import historyBg from "../assets/2.jpg"

function History() {
  const [analyses, setAnalyses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await API.get("/videos/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setAnalyses(res.data)
    } catch (error) {
      console.log(error)
      setError("Failed to fetch history")
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this analysis?"
    )

    if (!confirmDelete) return

    try {
      const token = localStorage.getItem("token")

      await API.delete(`/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setAnalyses(analyses.filter((analysis) => analysis._id !== id))
    } catch (error) {
      console.log(error)
      setError("Failed to delete analysis")
    }
  }

  const filteredAnalyses = analyses.filter((analysis) => {
    const search = searchTerm.toLowerCase()

    return (
      analysis.videoUrl?.toLowerCase().includes(search) ||
      analysis.notes?.toLowerCase().includes(search) ||
      new Date(analysis.createdAt)
        .toLocaleDateString()
        .toLowerCase()
        .includes(search)
    )
  })

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div
        className="fixed inset-0 scale-110 bg-cover bg-center animate-[historyDrift_34s_ease-in-out_infinite_alternate]"
        style={{ backgroundImage: `url(${historyBg})` }}
      />

      <div className="fixed inset-0 bg-black/60" />
      <div className="fixed inset-0 bg-gradient-to-br from-black/85 via-[#06110F]/55 to-black/85" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:76px_76px] opacity-20" />

      <main className="relative z-10 px-6 py-8 lg:px-16">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-2xl border border-white/15 bg-black/30 px-5 py-3 text-sm text-white/80 backdrop-blur-xl hover:border-[#B388FF]"
          >
            ← Dashboard
          </button>

          <button
            onClick={() => navigate("/analyzer")}
            className="rounded-2xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] px-5 py-3 font-black text-black hover:scale-105 transition-all"
          >
            Analyze New
          </button>
        </div>

        <section className="rounded-[2.5rem] border border-white/10 bg-black/35 p-8 shadow-2xl shadow-black/60 backdrop-blur-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-[#FFD95A]">
            Learning Archive
          </p>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-5xl font-black md:text-7xl">
                Your saved{" "}
                <span className="bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
                  knowledge vault.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-white/65">
                Revisit every analyzed video, reopen notes, continue revision,
                and delete anything you no longer need.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-center backdrop-blur-xl">
              <p className="text-4xl font-black text-[#B388FF]">
                {analyses.length}
              </p>
              <p className="mt-1 text-sm text-white/50">Saved analyses</p>
            </div>
          </div>

          <div className="mt-8">
            <input
              type="text"
              placeholder="Search by video, topic, notes, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-3xl border border-white/15 bg-black/45 px-6 py-5 text-white placeholder:text-white/45 outline-none backdrop-blur-xl transition-all focus:border-[#B388FF] focus:shadow-[0_0_30px_rgba(179,136,255,0.25)]"
            />
          </div>
        </section>

        {error && <p className="mt-6 text-red-400">{error}</p>}

        <section className="mt-8">
          {filteredAnalyses.length === 0 ? (
            <div className="rounded-[2.5rem] border border-white/10 bg-black/35 p-10 text-white/55 backdrop-blur-2xl">
              No matching analyses found.
            </div>
          ) : (
            <div className="grid gap-5">
              {filteredAnalyses.map((analysis, index) => (
                <div
                  key={analysis._id}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-xl shadow-black/30 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-[#B388FF]/60"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#B388FF] via-[#FF5DA2] to-[#FFD95A]" />

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs text-white/60">
                          #{index + 1}
                        </span>

                        <span className="rounded-full border border-[#FFD95A]/20 bg-[#FFD95A]/10 px-4 py-2 text-xs text-[#FFD95A]">
                          {new Date(analysis.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="mt-4 break-all text-lg font-bold text-white">
                        {analysis.videoUrl}
                      </p>

                      <p className="mt-3 max-w-3xl text-sm text-white/50">
                        Saved video analysis with notes, quiz, flashcards,
                        timestamps, mind map, and video chat.
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-3">
                      <button
                        onClick={() => navigate(`/analysis/${analysis._id}`)}
                        className="rounded-2xl border border-[#B388FF]/30 bg-[#B388FF]/10 px-5 py-3 text-sm font-bold text-[#B388FF] transition-all hover:scale-105 hover:border-[#B388FF]"
                      >
                        Open →
                      </button>

                      <button
                        onClick={() => handleDelete(analysis._id)}
                        className="rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-3 text-sm font-bold text-red-300 transition-all hover:scale-105 hover:border-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default History