import { useState } from "react"
import API from "../utils/api"

function Analyzer() {
  const [videoUrl, setVideoUrl] = useState("")
  const [analysisId, setAnalysisId] = useState("")
  const [notes, setNotes] = useState("")
  const [timestamps, setTimestamps] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [openCard, setOpenCard] = useState(null)
  const [selectedAnswers, setSelectedAnswers] = useState({})

  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState("")

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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  const quizSection = notes.split("## Quiz")[1] || ""

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

  const cleanNotes = notes.split("## Flashcards")[0].trim()

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

  return (
    <div className="min-h-screen bg-[#0F0F14] text-white px-8 py-6">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#B388FF] via-[#FF5DA2] to-[#FFD95A] bg-clip-text text-transparent">
        Shaelix Analyzer
      </h1>

      <form onSubmit={handleAnalyze} className="flex flex-col gap-4 max-w-3xl">
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

      {loading && (
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-gray-300">
          Shaelix is reading the transcript and extracting important learning points...
        </div>
      )}

      {error && <p className="mt-4 text-red-400">{error}</p>}

      {notes && (
        <>
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="mb-5 text-2xl font-bold text-[#B388FF]">
              Generated Notes
            </h2>

            <pre className="whitespace-pre-wrap text-gray-300">
              {cleanNotes}
            </pre>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="mb-5 text-2xl font-bold text-[#B388FF]">
              Timestamps
            </h2>

            <div className="grid gap-3">
              {timestamps.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <span className="font-bold text-[#FFD95A]">
                    {item.displayTime}
                  </span>
                  <p className="mt-2 text-gray-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="mb-6 text-2xl font-bold text-[#FF5DA2]">
              Flashcards
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {flashcards.map((card, index) => (
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
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
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
              {quizQuestions.map((quiz, quizIndex) => {
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
              })}
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
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
                <p className="mt-3 text-gray-200 leading-relaxed">{answer}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Analyzer