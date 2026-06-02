import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../utils/api"

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
    <div className="min-h-screen bg-[#0F0F14] text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Analysis History</h1>

      <input
        type="text"
        placeholder="Search by video, topic, notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-8 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 outline-none focus:border-[#B388FF]"
      />

      {error && <p className="mb-4 text-red-400">{error}</p>}

      {filteredAnalyses.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-gray-400">
          No matching analyses found.
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAnalyses.map((analysis) => (
            <div
              key={analysis._id}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:border-[#B388FF]"
            >
              <p className="text-sm text-gray-400">
                {new Date(analysis.createdAt).toLocaleDateString()}
              </p>

              <p className="mt-2 font-semibold break-all">
                {analysis.videoUrl}
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => navigate(`/analysis/${analysis._id}`)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-[#B388FF] hover:border-[#B388FF]"
                >
                  Open Analysis
                </button>

                <button
                  onClick={() => handleDelete(analysis._id)}
                  className="rounded-xl border border-red-400/30 px-4 py-2 text-sm text-red-400 hover:border-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default History