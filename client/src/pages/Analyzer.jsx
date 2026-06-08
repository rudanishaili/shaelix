import { useState } from "react"
import API from "../utils/api"
import { useNavigate } from "react-router-dom"
import analyzerBg from "../assets/9.jpg"

function Analyzer() {
  const navigate = useNavigate()
  const [videoUrl, setVideoUrl] = useState("")
  const [analysisId, setAnalysisId] = useState("")
  const [notes, setNotes] = useState("")
  const [timestamps, setTimestamps] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("video")
  const [openCard, setOpenCard] = useState(null)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState("")

  const getYouTubeId = (url) => {
    if (!url) return ""
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1]?.split("?")[0]
    return url.split("v=")[1]?.split("&")[0] || ""
  }

  const videoId = getYouTubeId(videoUrl)

  const handleAnalyze = async (e) => {
    e.preventDefault()
    setError("")
    setNotes("")
    setTimestamps([])
    setSelectedAnswers({})
    setOpenCard(null)
    setAnalysisId("")
    setQuestion("")
    setAnswer("")
    setChatError("")
    setActiveTab("video")

    if (!videoUrl.trim()) {
      setError("Please enter a YouTube URL")
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const res = await API.post(
        "/videos/transcript",
        { videoUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setAnalysisId(res.data.analysis._id)
      setNotes(res.data.analysis.notes)
      setTimestamps(res.data.analysis.timestamps || [])
    } catch (error) {
      console.log(error)
      setError("Failed to analyze video. Please try another video.")
    } finally {
      setLoading(false)
    }
  }

  const handleAskQuestion = async (e) => {
    e.preventDefault()
    setAnswer("")
    setChatError("")

    if (!analysisId) {
      setChatError("Please analyze a video first")
      return
    }

    if (!question.trim()) {
      setChatError("Please enter a question")
      return
    }

    try {
      setChatLoading(true)
      const token = localStorage.getItem("token")

      const res = await API.post(
        `/videos/${analysisId}/chat`,
        { question },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setAnswer(res.data.answer)
    } catch (error) {
      console.log(error)
      setChatError(error.response?.data?.message || "Failed to chat with video")
    } finally {
      setChatLoading(false)
    }
  }

  const flashcardSection =
    notes.split("## Flashcards")[1]?.split("## Quiz")[0] || ""

  const flashcards = flashcardSection
    .split("Q:")
    .filter((item) => item.trim() !== "")
    .map((item) => {
      const parts = item.split("A:")
      return {
        question: parts[0]?.trim(),
        answer: parts[1]?.trim(),
      }
    })
    .filter((card) => card.question && card.answer)

  const quizSection = notes.split("## Quiz")[1]?.split("## Mind Map")[0] || ""

  const quizQuestions = quizSection
    .split("Q:")
    .filter((item) => item.trim() !== "")
    .map((item) => {
      const [questionAndOptions, answerPart] = item.split("Correct Answer:")

      const questionOnly = questionAndOptions
        .split("Options:")[0]
        ?.trim()
        .replace(/^Q:\s*/i, "")

      const optionsText = questionAndOptions.split("Options:")[1] || ""

      const options = optionsText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => /^[A-D]\)/.test(line))

      return {
        question: questionOnly,
        options,
        correctAnswer: answerPart?.trim(),
      }
    })
    .filter((quiz) => quiz.question && quiz.options.length > 0)

  const mindMapSection = notes.split("## Mind Map")[1] || ""
  const cleanNotes = notes.split("## Flashcards")[0].trim()

  const getOptionLetter = (text) => text?.trim()?.charAt(0)?.toUpperCase()

  const handleSelectAnswer = (quizIndex, option) => {
    if (selectedAnswers[quizIndex]) return

    setSelectedAnswers({
      ...selectedAnswers,
      [quizIndex]: option,
    })
  }

  const score = quizQuestions.reduce((total, quiz, index) => {
    const selected = selectedAnswers[index]
    if (!selected) return total

    return getOptionLetter(selected) === getOptionLetter(quiz.correctAnswer)
      ? total + 1
      : total
  }, 0)

  const copyNotes = async () => {
    await navigator.clipboard.writeText(notes)
    alert("Notes copied ✅")
  }

  const renderMindMap = (mindMapText) => {
    const lines = mindMapText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")

    if (lines.length === 0) {
      return <p className="text-gray-400">Mind map not available.</p>
    }

    return (
      <div className="flex flex-col gap-5">
        {lines.map((line, index) => {
          const isMain = line.toLowerCase().includes("main topic")
          const isBranch = line.toLowerCase().includes("branch")
          const isDetail = line.toLowerCase().includes("detail")

          return (
            <div
              key={index}
              className={`rounded-2xl border p-4 ${
                isMain
                  ? "border-[#FFD95A] bg-[#FFD95A]/10 text-[#FFD95A]"
                  : isBranch
                  ? "ml-16 border-[#FF5DA2] bg-[#FF5DA2]/10 text-[#FF9AC7]"
                  : isDetail
                  ? "ml-32 border-[#B388FF] bg-[#B388FF]/10 text-gray-300"
                  : "border-white/10 bg-black/20 text-gray-300"
              }`}
            >
              {line.replace("-", "").trim()}
            </div>
          )
        })}
      </div>
    )
  }

  const tabs = [
    { id: "video", label: "Video" },
    { id: "notes", label: "Notes" },
    { id: "timestamps", label: "Timestamps" },
    { id: "flashcards", label: "Flashcards" },
    { id: "quiz", label: "Quiz" },
    { id: "mindmap", label: "Mind Map" },
    { id: "chat", label: "Chat" },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
  <div
    className="fixed inset-0 scale-110 bg-cover bg-center animate-[analyzerDrift_35s_ease-in-out_infinite_alternate]"
    style={{ backgroundImage: `url(${analyzerBg})` }}
  />

  <div className="absolute left-8 top-8 z-30">
  <button
    onClick={() => navigate("/dashboard")}
    className="group flex items-center gap-3 rounded-2xl border border-[#B388FF]/40 bg-black/55 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/50 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#FFD95A] hover:bg-black/75"
  >
    <span className="text-[#FFD95A] transition-transform duration-300 group-hover:-translate-x-1">
      ←
    </span>
    <span className="bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
      Return to Dashboard
    </span>
  </button>
</div>

  <div className="fixed inset-0 bg-black/70" />
  <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-[#04110D]/50 to-black/80" />

  <div className="relative z-10 px-8 py-6">
      <section className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center text-center">
  <p className="mb-5 rounded-full border border-white/15 bg-black/35 px-5 py-2 text-sm text-white/70 backdrop-blur-xl">
    🎥 AI Video Learning Engine
  </p>

  <h1 className="text-6xl font-black leading-tight md:text-8xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
    Analyze any video.
  </h1>

  <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
    Paste a YouTube link and Shaelix will build notes, timestamps,
    flashcards, quizzes, mind maps, and chat from the video.
  </p>

  <form onSubmit={handleAnalyze} className="mt-10 flex w-full max-w-3xl flex-col gap-4">
        <input
          type="text"
          placeholder="Paste YouTube URL..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 outline-none focus:border-[#B388FF]"
        />

        <button
          disabled={loading}
          type="submit"
          className="rounded-xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] px-6 py-4 font-bold text-black disabled:opacity-50"
        >
          {loading ? "Analyzing Video..." : "Analyze Video"}
        </button>
      </form>
      </section>

      {loading && (
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-gray-300">
          Shaelix is reading the transcript and building your learning system...
        </div>
      )}

      {error && <p className="mt-4 text-red-400">{error}</p>}

      {notes && (
        <>
          <div className="mt-10 flex flex-wrap gap-3 rounded-full border border-white/10 bg-black/35 p-3 backdrop-blur-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] text-black"
                    : "border border-white/10 text-gray-300 hover:border-[#B388FF]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "video" && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="mb-5 text-2xl font-bold text-[#FF5DA2]">
                Video Preview
              </h2>

              {videoId ? (
                <div className="aspect-video overflow-hidden rounded-2xl">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allowFullScreen
                    className="rounded-2xl"
                  ></iframe>
                </div>
              ) : (
                <p className="text-gray-400">Invalid YouTube URL.</p>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#B388FF]">
                  Generated Notes
                </h2>

                <button
                  onClick={copyNotes}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-[#B388FF] hover:border-[#B388FF]"
                >
                  Copy Notes
                </button>
              </div>

              <div className="space-y-6">
  {cleanNotes
    .split("\n")
    .filter((line) => line.trim())
    .map((line, index) => (
      <div
        key={index}
        className="rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-xl"
      >
        <p className="leading-8 text-gray-200">
          {line}
        </p>
      </div>
    ))}
</div>
            </div>
          )}

          {activeTab === "timestamps" && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="mb-5 text-2xl font-bold text-[#B388FF]">
                Timestamps
              </h2>

              <div className="grid gap-3">
                {timestamps.length > 0 ? (
                  timestamps.map((item) => (
                    <a
                      key={item._id}
                      href={`https://www.youtube.com/watch?v=${videoId}&t=${item.time}s`}
                      target="_blank"
                      rel="noreferrer"
                      className="
group
block
rounded-2xl
border-l-4
border-[#FFD95A]
bg-black/25
p-5
backdrop-blur-xl
transition-all
hover:translate-x-2
hover:border-[#FFD95A]
"
                    >
                      <span className="font-bold text-[#FFD95A]">
                        {item.displayTime}
                      </span>

                      <p className="mt-2 text-gray-300">{item.text}</p>
                    </a>
                  ))
                ) : (
                  <p className="text-gray-400">No timestamps available.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "flashcards" && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="mb-6 text-2xl font-bold text-[#FF5DA2]">
                Flashcards
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                {flashcards.length > 0 ? (
                  flashcards.map((card, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        setOpenCard(openCard === index ? null : index)
                      }
                      className="
cursor-pointer
h-64
rounded-3xl
border border-[#FF5DA2]/20
bg-gradient-to-br
from-[#FF5DA2]/10
to-black/40
p-6
backdrop-blur-xl
transition-all
duration-500
hover:scale-105
hover:border-[#FF5DA2]
"
                    >
                      <p className="font-bold text-[#FFD95A]">
                        Q: {card.question}
                      </p>

                      {openCard === index && (
                        <div className="mt-4 border-t border-white/10 pt-4">
                          <p className="text-gray-300">A: {card.answer}</p>
                        </div>
                      )}

                      <p className="mt-4 text-sm text-gray-500">
                        {openCard === index
                          ? "Click to hide answer"
                          : "Click to reveal answer"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No flashcards available.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#FFD95A]">
                  Quiz Mode
                </h2>

                <p className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm">
                  Score:{" "}
                  <span className="text-[#FFD95A] font-bold">{score}</span> /{" "}
                  {quizQuestions.length}
                </p>
              </div>

              <div className="grid gap-6">
                {quizQuestions.length > 0 ? (
                  quizQuestions.map((quiz, quizIndex) => {
                    const selected = selectedAnswers[quizIndex]
                    const correctLetter = getOptionLetter(quiz.correctAnswer)

                    return (
                      <div
                        key={quizIndex}
                        className="
rounded-3xl
border border-white/10
bg-black/35
p-8
backdrop-blur-xl
shadow-xl
shadow-black/30
"
                      >
                        <p className="font-bold text-white">
                          Q{quizIndex + 1}. {quiz.question}
                        </p>

                        <div className="mt-5 grid gap-3">
                          {quiz.options.map((option, optionIndex) => {
                            const optionLetter = getOptionLetter(option)
                            const isSelected = selected === option
                            const isCorrect = optionLetter === correctLetter
                            const showResult = Boolean(selected)

                            let optionStyle =
                              "border-white/10 bg-white/[0.04] hover:border-[#B388FF]"

                            if (showResult && isCorrect) {
                              optionStyle = "border-green-400 bg-green-400/10"
                            }

                            if (showResult && isSelected && !isCorrect) {
                              optionStyle = "border-red-400 bg-red-400/10"
                            }

                            return (
                              <button
                                key={optionIndex}
                                onClick={() =>
                                  handleSelectAnswer(quizIndex, option)
                                }
                                disabled={Boolean(selected)}
                                className={`rounded-xl border px-4 py-3 text-left ${optionStyle}`}
                              >
                                {option}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-gray-400">No quiz available.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "mindmap" && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="mb-6 text-2xl font-bold text-[#B388FF]">
                AI Mind Map
              </h2>

              {renderMindMap(mindMapSection)}
            </div>
          )}

          {activeTab === "chat" && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="mb-5 text-2xl font-bold text-[#B388FF]">
                Chat With This Video
              </h2>

              <form onSubmit={handleAskQuestion} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Ask anything from this video..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/20 px-5 py-4 outline-none focus:border-[#B388FF]"
                />

                <button
                  disabled={chatLoading}
                  className="rounded-xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] px-6 py-4 font-bold text-black disabled:opacity-50"
                >
                  {chatLoading ? "Thinking..." : "Ask Shaelix"}
                </button>
              </form>

              {chatError && <p className="mt-4 text-red-400">{chatError}</p>}

              {answer && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-gray-400">Shaelix Answer</p>
                  <p className="mt-3 text-gray-200 leading-relaxed">
                    {answer}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
    </div>
  )
}

export default Analyzer