import axios from "axios"

export const generateNotes = async (transcript) => {
  const prompt = `
You are Shaelix, an intelligent AI learning assistant.

Create clean, structured learning content from this video transcript.

IMPORTANT RULES:
- Use EXACT headings only.
- Do not skip any heading.
- Keep flashcards clean.
- Quiz must have exactly 4 options.
- Mind map must use Main Topic, Branch, Detail format.

Return ONLY this format:

## Key Concepts
- concept: short explanation
- concept: short explanation

## Important Points
- point
- point

## Revision Notes
- revision point
- revision point

## Interview Questions
Q: question
A: answer

Q: question
A: answer

## Flashcards
Q: question
A: answer

Q: question
A: answer

Q: question
A: answer

## Quiz
Q: question
Options:
A) option
B) option
C) option
D) option
Correct Answer: A) option

Q: question
Options:
A) option
B) option
C) option
D) option
Correct Answer: B) option

Q: question
Options:
A) option
B) option
C) option
D) option
Correct Answer: C) option

## Mind Map
Main Topic: video topic
- Branch: topic 1
  - Detail: explanation
  - Detail: explanation
- Branch: topic 2
  - Detail: explanation
  - Detail: explanation
- Branch: topic 3
  - Detail: explanation
  - Detail: explanation

Transcript:
${transcript}
`

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
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