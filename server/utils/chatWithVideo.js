import axios from "axios"

export const askVideoQuestion = async (transcript, question) => {
  const prompt = `
You are Shaelix AI.

Answer the user's question ONLY using the provided video transcript.

If the answer is not present in the transcript, say:
"This topic was not clearly covered in the video."

Transcript:
${transcript}

User Question:
${question}
`

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  )

  return response.data.choices[0].message.content
}