import axios from "axios"
import { generateNotes } from "../utils/openrouter.js"
import { askVideoQuestion } from "../utils/chatWithVideo.js"
import Analysis from "../models/Analysis.js"

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

const countSectionItems = (text, start, end) => {
  const section = text.split(start)[1]?.split(end)[0] || ""
  return section.split("Q:").filter((item) => item.trim() !== "").length
}

export const getTranscript = async (req, res) => {
  try {
    const { videoUrl } = req.body

    if (!videoUrl) {
      return res.status(400).json({ message: "Video URL is required" })
    }

    console.log("Incoming URL:", videoUrl)

    const axios = (await import("axios")).default

const response = await axios.get(
  "https://api.supadata.ai/v1/transcript",
  {
    params: {
      url: videoUrl,
      mode: "auto",
    },
    headers: {
      "x-api-key": process.env.SUPADATA_API_KEY,
    },
  }
)

const transcriptArray = response.data.content

const cleanTranscript = transcriptArray
  .map((item) => item.text)
  .join(" ")
  .replace(/\s+/g, " ")
  .trim()

const timestamps = transcriptArray
  .filter((item, index) => index % 12 === 0)
  .map((item) => ({
    time: Math.floor(item.offset / 1000),
    displayTime: formatTime(item.offset / 1000),
    text: item.text,
  }))
  .slice(0, 12)
  
    const notes = await generateNotes(cleanTranscript)

    const savedAnalysis = await Analysis.create({
      userId: req.user._id,
      videoUrl,
      transcript: cleanTranscript,
      notes,
      timestamps,
    })

    res.status(200).json({
      message: "Analysis completed and saved",
      analysis: savedAnalysis,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to analyze video",
      error: error.message,
    })
  }
}

export const getUserAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id }).sort({
      createdAt: -1,
    })

    res.status(200).json(analyses)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch analyses",
      error: error.message,
    })
  }
}

export const getSingleAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" })
    }

    res.status(200).json(analysis)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch analysis",
      error: error.message,
    })
  }
}

export const chatWithVideo = async (req, res) => {
  try {
    const { question } = req.body

    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" })
    }

    if (!analysis.transcript) {
      return res.status(400).json({
        message:
          "Transcript not available for this old analysis. Please analyze the video again.",
      })
    }

    const answer = await askVideoQuestion(analysis.transcript, question)

    res.status(200).json({ answer })
  } catch (error) {
    res.status(500).json({
      message: "Failed to chat with video",
      error: error.message,
    })
  }
}

export const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" })
    }

    res.status(200).json({ message: "Analysis deleted successfully" })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete analysis",
      error: error.message,
    })
  }
}

export const getDashboardStats = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id }).sort({
      createdAt: -1,
    })

    const totalFlashcards = analyses.reduce((total, item) => {
      return total + countSectionItems(item.notes, "## Flashcards", "## Quiz")
    }, 0)

    const totalQuizzes = analyses.reduce((total, item) => {
      return total + countSectionItems(item.notes, "## Quiz", "## Mind Map")
    }, 0)

    const scoredAnalyses = analyses.filter(
  (item) => item.quizTotal && item.quizTotal > 0
)

const averageQuizScore =
  scoredAnalyses.length > 0
    ? Math.round(
        scoredAnalyses.reduce(
          (sum, item) => sum + (item.quizPercentage || 0),
          0
        ) / scoredAnalyses.length
      )
    : 0

    res.status(200).json({
  savedVideos: analyses.length,
  totalFlashcards,
  totalQuizzes,
  averageQuizScore,
  recentAnalyses: analyses.slice(0, 3),
})
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard stats",
      error: error.message,
    })
  }
}

export const saveQuizScore = async (req, res) => {
  try {
    const { score, total } = req.body

    const percentage = total > 0 ? Math.round((score / total) * 100) : 0

    const analysis = await Analysis.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      {
        quizScore: score,
        quizTotal: total,
        quizPercentage: percentage,
      },
      {
        new: true,
      }
    )

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found",
      })
    }

    res.status(200).json({
      message: "Quiz score saved",
      analysis,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to save quiz score",
      error: error.message,
    })
  }
}