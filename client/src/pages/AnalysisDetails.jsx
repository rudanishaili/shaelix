import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import jsPDF from "jspdf"
import API from "../utils/api"
import detailsBg from "../assets/10.jpg"

function AnalysisDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [analysis, setAnalysis] = useState(null)
  const [activeTab, setActiveTab] = useState("notes")
  const [openCard, setOpenCard] = useState(null)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState("")
  const [scoreSaved, setScoreSaved] = useState(false)

  const fetchAnalysis = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await API.get(`/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setAnalysis(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAnalysis()
  }, [])

  if (!analysis) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading analysis...
      </div>
    )
  }

  const getYouTubeId = (url) => {
    if (!url) return ""
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1]?.split("?")[0]
    return url.split("v=")[1]?.split("&")[0] || ""
  }

  const videoId = getYouTubeId(analysis.videoUrl)

  const cleanNotes = analysis.notes.split("## Flashcards")[0].trim()

  const flashcardSection =
    analysis.notes.split("## Flashcards")[1]?.split("## Quiz")[0] || ""

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

  const quizSection =
    analysis.notes.split("## Quiz")[1]?.split("## Mind Map")[0] || ""

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

  const mindMapSection = analysis.notes.split("## Mind Map")[1] || ""

  const getOptionLetter = (text) => {
    return text?.trim()?.charAt(0)?.toUpperCase()
  }

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

  const handleAskQuestion = async (e) => {
    e.preventDefault()

    setAnswer("")
    setChatError("")

    if (!question.trim()) {
      setChatError("Please enter a question")
      return
    }

    try {
      setChatLoading(true)

      const token = localStorage.getItem("token")

      const res = await API.post(
        `/videos/${id}/chat`,
        { question },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setAnswer(res.data.answer)
    } catch (error) {
      console.log(error)
      setChatError(error.response?.data?.message || "Failed to chat with video")
    } finally {
      setChatLoading(false)
    }
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    const margin = 15
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const maxWidth = pageWidth - margin * 2
    let y = 20

    doc.setFontSize(20)
    doc.text("Shaelix Learning Notes", margin, y)

    y += 10
    doc.setFontSize(10)

    const videoLines = doc.splitTextToSize(`Video: ${analysis.videoUrl}`, maxWidth)
    doc.text(videoLines, margin, y)

    y += videoLines.length * 6 + 8
    doc.setFontSize(12)

    const content = `
${analysis.notes}

Timestamps:
${analysis.timestamps
  ?.map((item) => `${item.displayTime} - ${item.text}`)
  .join("\n")}
`

    const lines = doc.splitTextToSize(content, maxWidth)

    lines.forEach((line) => {
      if (y > pageHeight - 15) {
        doc.addPage()
        y = 20
      }

      doc.text(line, margin, y)
      y += 7
    })

    doc.save("shaelix-notes.pdf")
  }

  const saveScore = async () => {
    try {
      const token = localStorage.getItem("token")

      await API.post(
        `/videos/${id}/quiz-score`,
        {
          score,
          total: quizQuestions.length,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setScoreSaved(true)
      alert("Quiz score saved ✅")
    } catch (error) {
      console.log(error)
      alert("Failed to save quiz score")
    }
  }

  const renderFormattedNotes = () => {
    return cleanNotes
      .split("\n")
      .filter((line) => line.trim())
      .map((line, index) => {
        const cleanLine = line
          .replaceAll("##", "")
          .replaceAll("**", "")
          .replace(/^- /, "")
          .trim()

        const lower = cleanLine.toLowerCase()

        const isHeading =
          line.includes("##") ||
          lower.includes("key concepts") ||
          lower.includes("important points") ||
          lower.includes("revision notes") ||
          lower.includes("interview questions")

        const isQuestion = cleanLine.startsWith("Q:")
        const isAnswer = cleanLine.startsWith("A:")

        if (isHeading) {
          return (
            <div key={index} className="pt-4">
              <h3 className="rounded-2xl border border-[#FFD95A]/30 bg-[#FFD95A]/10 px-5 py-4 text-xl font-black text-[#FFD95A]">
                {cleanLine}
              </h3>
            </div>
          )
        }

        if (isQuestion) {
          return (
            <div
              key={index}
              className="rounded-2xl border border-[#B388FF]/30 bg-[#B388FF]/10 p-5"
            >
              <p className="font-bold leading-8 text-white">{cleanLine}</p>
            </div>
          )
        }

        if (isAnswer) {
          return (
            <div
              key={index}
              className="ml-6 rounded-2xl border border-[#FF5DA2]/25 bg-[#FF5DA2]/10 p-5"
            >
              <p className="leading-8 text-white/85">{cleanLine}</p>
            </div>
          )
        }

        return (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 transition-all duration-300 hover:border-[#B388FF]/50"
          >
            <p className="leading-8 text-white/85">
              <span className="mr-3 text-[#FFD95A]">•</span>
              {cleanLine}
            </p>
          </div>
        )
      })
  }

  const renderMindMap = (mindMapText) => {
    const lines = mindMapText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")

    if (lines.length === 0) {
      return <p className="text-white/50">Mind map not available.</p>
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
              className={`relative rounded-3xl border p-5 backdrop-blur-xl ${
                isMain
                  ? "border-[#FFD95A]/50 bg-[#FFD95A]/10 text-[#FFD95A]"
                  : isBranch
                  ? "ml-12 border-[#FF5DA2]/40 bg-[#FF5DA2]/10 text-[#FF9AC7]"
                  : isDetail
                  ? "ml-24 border-[#B388FF]/40 bg-[#B388FF]/10 text-white/80"
                  : "border-white/10 bg-black/30 text-white/70"
              }`}
            >
              {line.replace("-", "").replace("Main Topic:", "").replace("Branch:", "").replace("Detail:", "").trim()}
            </div>
          )
        })}
      </div>
    )
  }

  const tabs = [
    { id: "notes", label: "Notes", icon: "📝" },
    { id: "timestamps", label: "Timestamps", icon: "⏱" },
    { id: "flashcards", label: "Flashcards", icon: "🧠" },
    { id: "quiz", label: "Quiz", icon: "🎯" },
    { id: "mindmap", label: "Mind Map", icon: "🗺" },
    { id: "chat", label: "Chat", icon: "💬" },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div
        className="fixed inset-0 scale-110 bg-cover bg-center animate-[detailsDrift_34s_ease-in-out_infinite_alternate]"
        style={{ backgroundImage: `url(${detailsBg})` }}
      />

      <div className="fixed inset-0 bg-black/65" />
      <div className="fixed inset-0 bg-gradient-to-br from-black/85 via-[#04110D]/55 to-black/85" />

      <main className="relative z-10 px-6 py-8 lg:px-12">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/history")}
            className="group flex items-center gap-3 rounded-2xl border border-[#B388FF]/40 bg-black/55 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/50 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#FFD95A]"
          >
            <span className="text-[#FFD95A] group-hover:-translate-x-1 transition-all">
              ←
            </span>
            Back to History
          </button>

          <button
            onClick={handleDownloadPDF}
            className="rounded-2xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] px-6 py-3 font-black text-black shadow-lg shadow-pink-500/30 transition-all hover:scale-105"
          >
            Download PDF
          </button>
        </div>

        <section className="rounded-[2.5rem] border border-white/15 bg-black/50 p-8 shadow-2xl shadow-black/60 backdrop-blur-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-[#FFD95A]">
            Saved Analysis
          </p>

          <h1 className="mt-4 text-5xl font-black md:text-6xl">
            Your AI-generated{" "}
            <span className="bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
              study workspace.
            </span>
          </h1>

          <p className="mt-5 break-all rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white/60">
            {analysis.videoUrl}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
              <p className="text-sm text-white/50">Flashcards</p>
              <h3 className="mt-2 text-3xl font-black text-[#FF5DA2]">
                {flashcards.length}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
              <p className="text-sm text-white/50">Quiz Questions</p>
              <h3 className="mt-2 text-3xl font-black text-[#FFD95A]">
                {quizQuestions.length}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
              <p className="text-sm text-white/50">Timestamps</p>
              <h3 className="mt-2 text-3xl font-black text-[#B388FF]">
                {analysis.timestamps?.length || 0}
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
              <p className="text-sm text-white/50">Current Score</p>
              <h3 className="mt-2 text-3xl font-black text-green-300">
                {score}/{quizQuestions.length}
              </h3>
            </div>
          </div>
        </section>

        <div className="sticky top-4 z-20 mt-8 flex flex-wrap gap-3 rounded-full border border-white/10 bg-black/60 p-3 shadow-2xl shadow-black/50 backdrop-blur-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-5 py-3 text-sm font-black transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] text-black"
                  : "border border-white/10 text-white/70 hover:border-[#B388FF] hover:text-white"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "notes" && (
          <div className="mt-8 rounded-[2rem] border border-white/15 bg-black/65 p-8 shadow-2xl shadow-black/60 backdrop-blur-2xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#FFD95A]">
                  Study Notes
                </p>
                <h2 className="mt-2 text-3xl font-black text-white">
                  Generated Learning Notes
                </h2>
              </div>
            </div>

            <div className="space-y-5">{renderFormattedNotes()}</div>
          </div>
        )}

        {activeTab === "timestamps" && (
          <div className="mt-8 rounded-[2rem] border border-white/15 bg-black/65 p-8 shadow-2xl shadow-black/60 backdrop-blur-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-[#FFD95A]">
              Video Timeline
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">
              Clickable Timestamps
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {analysis.timestamps?.length > 0 ? (
                analysis.timestamps.map((item) => (
                  <a
                    key={item._id}
                    href={
                      videoId
                        ? `https://www.youtube.com/watch?v=${videoId}&t=${item.time}s`
                        : `${analysis.videoUrl}&t=${item.time}s`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="group relative min-h-[150px] overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#FFD95A]/70"
                  >
                    <div className="absolute left-4 top-4 h-8 w-8 rounded-tl-2xl border-l-[3px] border-t-[3px] border-[#FFD95A]" />
                    <div className="absolute bottom-4 right-4 h-8 w-8 rounded-br-2xl border-b-[3px] border-r-[3px] border-[#FFD95A]" />

                    <div className="mb-4 inline-flex rounded-full border border-[#FFD95A]/30 bg-[#FFD95A]/10 px-4 py-2 text-sm font-black text-[#FFD95A]">
                      {item.displayTime}
                    </div>

                    <p className="line-clamp-3 leading-7 text-white/80">
                      {item.text}
                    </p>

                    <p className="mt-5 text-sm font-bold text-[#B388FF] opacity-0 transition-all duration-300 group-hover:opacity-100">
                      Open at this moment →
                    </p>
                  </a>
                ))
              ) : (
                <p className="text-white/50">No timestamps available.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "flashcards" && (
          <div className="mt-8 rounded-[2rem] border border-white/15 bg-black/65 p-8 shadow-2xl shadow-black/60 backdrop-blur-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-[#FFD95A]">
              Active Recall
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">Flashcards</h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {flashcards.length > 0 ? (
                flashcards.map((card, index) => (
                  <div
                    key={index}
                    onClick={() => setOpenCard(openCard === index ? null : index)}
                    className="group flex min-h-[260px] cursor-pointer flex-col justify-between rounded-[2rem] border border-[#FF5DA2]/25 bg-gradient-to-br from-[#FF5DA2]/15 via-black/50 to-[#B388FF]/10 p-7 shadow-xl shadow-black/30 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:rotate-[1deg] hover:border-[#FF5DA2]"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#FFD95A]">
                        CARD {index + 1}
                      </p>

                      <p className="mt-5 text-lg font-black leading-8 text-white">
                        {openCard === index ? card.answer : card.question}
                      </p>
                    </div>

                    <p className="mt-6 text-sm text-white/50">
                      {openCard === index
                        ? "Click to hide answer"
                        : "Click to reveal answer"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-white/50">No flashcards available.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="mt-8 rounded-[2rem] border border-white/15 bg-black/65 p-8 shadow-2xl shadow-black/60 backdrop-blur-2xl">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#FFD95A]">
                  Practice Mode
                </p>
                <h2 className="mt-2 text-3xl font-black text-white">Quiz Mode</h2>
              </div>

              <div className="flex items-center gap-3">
                <p className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm">
                  Score:{" "}
                  <span className="text-[#FFD95A] font-black">{score}</span> /{" "}
                  {quizQuestions.length}
                </p>

                <button
                  onClick={saveScore}
                  disabled={
                    quizQuestions.length === 0 ||
                    Object.keys(selectedAnswers).length === 0 ||
                    scoreSaved
                  }
                  className="rounded-2xl border border-[#FFD95A]/30 bg-[#FFD95A]/10 px-5 py-3 text-sm font-bold text-[#FFD95A] hover:border-[#FFD95A] disabled:opacity-50"
                >
                  {scoreSaved ? "Saved" : "Save Score"}
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              {quizQuestions.length > 0 ? (
                quizQuestions.map((quiz, quizIndex) => {
                  const selected = selectedAnswers[quizIndex]
                  const correctLetter = getOptionLetter(quiz.correctAnswer)

                  return (
                    <div
                      key={quizIndex}
                      className="rounded-[2rem] border border-white/10 bg-black/45 p-7 backdrop-blur-xl"
                    >
                      <p className="text-lg font-black leading-8 text-white">
                        Q{quizIndex + 1}. {quiz.question}
                      </p>

                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {quiz.options.map((option, optionIndex) => {
                          const optionLetter = getOptionLetter(option)
                          const isSelected = selected === option
                          const isCorrect = optionLetter === correctLetter
                          const showResult = Boolean(selected)

                          let optionStyle =
                            "border-white/10 bg-white/[0.05] hover:border-[#B388FF]"

                          if (showResult && isCorrect) {
                            optionStyle = "border-green-400 bg-green-400/10"
                          }

                          if (showResult && isSelected && !isCorrect) {
                            optionStyle = "border-red-400 bg-red-400/10"
                          }

                          return (
                            <button
                              key={optionIndex}
                              onClick={() => handleSelectAnswer(quizIndex, option)}
                              disabled={Boolean(selected)}
                              className={`rounded-2xl border px-5 py-4 text-left transition-all duration-300 ${optionStyle}`}
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
                <p className="text-white/50">No quiz available.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "mindmap" && (
          <div className="mt-8 rounded-[2rem] border border-white/15 bg-black/65 p-8 shadow-2xl shadow-black/60 backdrop-blur-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-[#FFD95A]">
              Visual Thinking
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">AI Mind Map</h2>

            <div className="mt-8">{renderMindMap(mindMapSection)}</div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="mt-8 rounded-[2rem] border border-white/15 bg-black/65 p-8 shadow-2xl shadow-black/60 backdrop-blur-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-[#FFD95A]">
              Ask From Video
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">
              Chat With This Video
            </h2>

            <form onSubmit={handleAskQuestion} className="mt-8 flex flex-col gap-4">
              <input
                type="text"
                placeholder="Ask anything from this video..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="rounded-2xl border border-white/15 bg-black/45 px-6 py-5 text-white outline-none focus:border-[#B388FF]"
              />

              <button
                disabled={chatLoading}
                className="rounded-2xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] px-6 py-5 font-black text-black disabled:opacity-50"
              >
                {chatLoading ? "Thinking..." : "Ask Shaelix"}
              </button>
            </form>

            {chatError && <p className="mt-4 text-red-400">{chatError}</p>}

            {answer && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-6">
                <p className="text-sm text-[#FFD95A]">Shaelix Answer</p>
                <p className="mt-3 leading-8 text-white/85">{answer}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default AnalysisDetails