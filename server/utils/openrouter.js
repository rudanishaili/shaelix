import axios from "axios"

export const generateNotes = async (transcript) => {
  const prompt = `
You are Shaelix, an intelligent AI learning assistant.

Analyze the following video transcript and generate structured learning content.

Return the response ONLY in this format:

## Key Concepts
- important concepts with short explanations

## Important Points
- important learning points

## Revision Notes
- quick revision bullets

## Interview Questions
Q: question
A: answer

## Flashcards
Q: question
A: answer

## Quiz
Q: question
Options:
A)
B)
C)
D)

Correct Answer:

Transcript:
${transcript}
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