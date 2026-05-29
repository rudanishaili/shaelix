import { useState } from "react"

function Analyzer() {
  const [videoUrl, setVideoUrl] = useState("")

  const handleAnalyze = (e) => {
    e.preventDefault()
    console.log("Video URL:", videoUrl)
  }

  return (
    <div className="min-h-screen bg-[#0F0F14] text-white px-8 py-6">
      <nav className="flex items-center justify-between border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
          Shaelix Analyzer
        </h1>
      </nav>

      <section className="mx-auto mt-16 max-w-3xl text-center">
        <h2 className="text-5xl font-bold">
          Paste a YouTube video link
        </h2>

        <p className="mt-4 text-gray-400">
          Shaelix will turn it into timestamped notes, flashcards, and revision-ready knowledge.
        </p>

        <form onSubmit={handleAnalyze} className="mt-10 flex flex-col gap-4">
          <input
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 outline-none focus:border-[#B388FF]"
          />

          <button className="rounded-2xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] px-8 py-4 font-bold text-black hover:scale-105 transition-all duration-300">
            Analyze Video
          </button>
        </form>
      </section>
    </div>
  )
}

export default Analyzer