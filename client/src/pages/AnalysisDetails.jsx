import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import jsPDF from "jspdf"
import API from "../utils/api"

function AnalysisDetails() {
  const { id } = useParams()

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
      <div className="min-h-screen bg-[#0F0F14] text-white p-8">
        Loading analysis...
      </div>
    )
  }

  const getYouTubeId = (url) => {
    if (!url) return ""

    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1]?.split("?")[0]
    }

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

    const selectedLetter = getOptionLetter(selected)
    const correctLetter = getOptionLetter(quiz.correctAnswer)

    return selectedLetter === correctLetter ? total + 1 : total
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
      setChatError(
        error.response?.data?.message || "Failed to chat with video"
      )
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

  const renderMindMap = (mindMapText) => {
    const lines = mindMapText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")

    if (lines.length === 0) {
      return <p className="text-gray-400">Mind map not available.</p>
    }

    return (
      <div className="space-y-4">
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
                  ? "ml-6 border-[#FF5DA2] bg-[#FF5DA2]/10 text-[#FF9AC7]"
                  : isDetail
                  ? "ml-12 border-[#B388FF] bg-[#B388FF]/10 text-gray-300"
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

  const tabs = [
    { id: "notes", label: "Notes" },
    { id: "timestamps", label: "Timestamps" },
    { id: "flashcards", label: "Flashcards" },
    { id: "quiz", label: "Quiz" },
    { id: "mindmap", label: "Mind Map" },
    { id: "chat", label: "Chat" },
  ]

  return (
    <div className="min-h-screen bg-[#0F0F14] text-white p-8">
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-4">Saved Analysis</h1>

          <p className="text-gray-400 break-all">
            {analysis.videoUrl}
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="rounded-xl bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] px-5 py-3 font-bold text-black hover:scale-105 transition-all duration-300"
        >
          Download PDF
        </button>
      </div>

      <div className="mb-8 flex flex-wrap gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] text-black"
                : "border border-white/10 text-gray-300 hover:border-[#B388FF]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "notes" && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="mb-5 text-2xl font-bold text-[#B388FF]">
            Generated Notes
          </h2>

          <pre className="whitespace-pre-wrap text-gray-300">
            {cleanNotes}
          </pre>
        </div>
      )}

      {activeTab === "timestamps" && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="mb-5 text-2xl font-bold text-[#B388FF]">
            Timestamps
          </h2>

          <div className="grid gap-3">
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
                  className="block rounded-xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:border-[#FFD95A]"
                >
                  <span className="text-[#FFD95A] font-bold">
                    {item.displayTime}
                  </span>

                  <p className="mt-2 text-gray-300">
                    {item.text}
                  </p>
                </a>
              ))
            ) : (
              <p className="text-gray-400">
                No timestamps available.
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === "flashcards" && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="mb-6 text-2xl font-bold text-[#FF5DA2]">
            Flashcards
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            {flashcards.length > 0 ? (
              flashcards.map((card, index) => (
                <div
                  key={index}
                  onClick={() => setOpenCard(openCard === index ? null : index)}
                  className="cursor-pointer rounded-2xl border border-white/10 bg-black/20 p-6 transition-all duration-300 hover:border-[#FF5DA2]"
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
              <p className="text-gray-400">
                No flashcards available.
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === "quiz" && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#FFD95A]">
              Quiz Mode
            </h2>

            <div className="flex items-center gap-3">
  <p className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm">
    Score:{" "}
    <span className="text-[#FFD95A] font-bold">{score}</span> /{" "}
    {quizQuestions.length}
  </p>

  <button
    onClick={saveScore}
    disabled={
      quizQuestions.length === 0 ||
      Object.keys(selectedAnswers).length === 0 ||
      scoreSaved
    }
    className="rounded-xl border border-white/10 px-4 py-2 text-sm text-[#FFD95A] hover:border-[#FFD95A] disabled:opacity-50"
  >
    {scoreSaved ? "Score Saved" : "Save Score"}
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
                    className="rounded-2xl border border-white/10 bg-black/20 p-6"
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
                            onClick={() => handleSelectAnswer(quizIndex, option)}
                            disabled={Boolean(selected)}
                            className={`rounded-xl border px-4 py-3 text-left transition-all duration-300 ${optionStyle}`}
                          >
                            {option}
                          </button>
                        )
                      })}
                    </div>

                    {selected && (
                      <p className="mt-4 text-sm text-gray-300">
                        Correct Answer:{" "}
                        <span className="font-bold text-[#FFD95A]">
                          {quiz.correctAnswer}
                        </span>
                      </p>
                    )}
                  </div>
                )
              })
            ) : (
              <p className="text-gray-400">
                No quiz available.
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === "mindmap" && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="mb-6 text-2xl font-bold text-[#B388FF]">
            AI Mind Map
          </h2>

          {renderMindMap(mindMapSection)}
        </div>
      )}

      {activeTab === "chat" && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
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
    </div>
  )
}

export default AnalysisDetails