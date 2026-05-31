import express from "express"
import {
  getTranscript,
  getUserAnalyses,
  getSingleAnalysis,
  chatWithVideo,
} from "../controllers/videoController.js"

import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/transcript", protect, getTranscript)
router.post("/:id/chat", protect, chatWithVideo)

router.get("/history", protect, getUserAnalyses)
router.get("/:id", protect, getSingleAnalysis)

export default router