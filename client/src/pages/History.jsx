import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../utils/api"

function History() {
  const [analyses, setAnalyses] = useState([])
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
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
    <div className="min-h-screen bg-[#0F0F14] text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Analysis History</h1>

      <div className="grid gap-4">
        {analyses.map((analysis) => (
          <div
            key={analysis._id}
            onClick={() => navigate(`/analysis/${analysis._id}`)}
            className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:border-[#B388FF] hover:bg-white/[0.07]"
          >
            <p className="text-sm text-gray-400">
              {new Date(analysis.createdAt).toLocaleDateString()}
            </p>

            <p className="mt-2 font-semibold break-all">
              {analysis.videoUrl}
            </p>

            <p className="mt-3 text-sm text-[#B388FF]">
              Open full analysis →
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default History