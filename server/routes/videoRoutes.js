import express from "express"
import {
  getTranscript,
  getUserAnalyses,
  getSingleAnalysis,
  chatWithVideo,
  deleteAnalysis,
  getDashboardStats,
  saveQuizScore,
} from "../controllers/videoController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/transcript", protect, getTranscript)
router.get("/history", protect, getUserAnalyses)
router.get("/stats", protect, getDashboardStats)
router.post("/:id/chat", protect, chatWithVideo)
router.post("/:id/quiz-score", protect, saveQuizScore)
router.delete("/:id", protect, deleteAnalysis)
router.get("/:id", protect, getSingleAnalysis)

export default router