import express from "express"
import { getTranscript } from "../controllers/videoController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/transcript", protect, getTranscript)

export default router