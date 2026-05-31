import { YoutubeTranscript } from "youtube-transcript"
import { generateNotes } from "../utils/openrouter.js"
import Analysis from "../models/Analysis.js"
import { askVideoQuestion } from "../utils/chatWithVideo.js"

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export const getTranscript = async (req, res) => {
  try {
    const { videoUrl } = req.body

    if (!videoUrl) {
      return res.status(400).json({
        message: "Video URL is required",
      })
    }

    const transcriptArray = await YoutubeTranscript.fetchTranscript(videoUrl)

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
    const analyses = await Analysis.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 })

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
      return res.status(404).json({
        message: "Analysis not found",
      })
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
      return res.status(404).json({
        message: "Analysis not found",
      })
    }

    const answer = await askVideoQuestion(
      analysis.transcript,
      question
    )

    res.status(200).json({
      answer,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to chat with video",
      error: error.message,
    })
  }
}