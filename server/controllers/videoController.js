import { YoutubeTranscript } from "youtube-transcript"
import { generateNotes } from "../utils/openrouter.js"

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

    const notes = await generateNotes(cleanTranscript)

    res.status(200).json({
      message: "Analysis completed",
      notes,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to analyze video",
      error: error.message,
    })
  }
}