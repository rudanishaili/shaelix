import mongoose from "mongoose"

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    transcript: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      required: true,
    },

    timestamps: [
      {
        time: Number,
        displayTime: String,
        text: String,
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Analysis = mongoose.model("Analysis", analysisSchema)

export default Analysis