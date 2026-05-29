import axios from "axios"

export const generateNotes = async (transcript) => {
  const prompt = `
You are Shaelix, an intelligent learning assistant.

Analyze this video transcript and create structured learning notes.

Return the answer in this format:

## Key Concepts
- concept with short explanation

## Important Points
- only important points, ignore filler

## Revision Notes
- quick revision bullets

## Interview Questions
- question with short answer

Transcript:
${transcript}
`

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "google/gemini-2.0-flash-001",
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