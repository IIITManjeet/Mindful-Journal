import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import { JournalEntry } from '@prisma/client'

// Free + easily accessible: get a key at https://aistudio.google.com/app/apikey
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string)

// Models (free tier). Override via env if you like.
// flash-lite has the most generous free-tier daily quota — ideal for a free
// showcase project. Override with GEMINI_CHAT_MODEL if you ever go paid.
const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-2.5-flash-lite'
const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL || 'gemini-embedding-001'

export interface AnalysisResult {
  mood: string
  subject: string
  negative: boolean
  summary: string
  color: string
  sentimentScore: number
}

// Native structured output — Gemini returns valid JSON matching this schema,
// so we no longer need LangChain's output parser / fixing parser dance.
const analysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    mood: {
      type: SchemaType.STRING,
      description: 'the mood of the person who wrote the journal entry.',
    },
    subject: {
      type: SchemaType.STRING,
      description: 'the subject of the journal entry.',
    },
    negative: {
      type: SchemaType.BOOLEAN,
      description:
        'is the journal entry negative? (i.e. does it contain negative emotions?).',
    },
    summary: {
      type: SchemaType.STRING,
      description: 'quick summary of the entire entry.',
    },
    color: {
      type: SchemaType.STRING,
      description:
        'a hexadecimal color code (and nothing else) that represents the mood of the entry. It MUST start with "#" and be 6 hex digits, e.g. "#facc15" for a warm happy yellow. Never return a color name.',
    },
    sentimentScore: {
      type: SchemaType.INTEGER,
      description:
        'the sentiment of the text rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.',
    },
  },
  required: [
    'mood',
    'subject',
    'negative',
    'summary',
    'color',
    'sentimentScore',
  ],
}

// A small palette to fall back to so a stray color name never breaks the UI.
const NAMED_COLOR_HEX: Record<string, string> = {
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#facc15',
  gold: '#eab308',
  green: '#22c55e',
  teal: '#14b8a6',
  blue: '#3b82f6',
  lightblue: '#7dd3fc',
  indigo: '#6366f1',
  purple: '#a855f7',
  pink: '#ec4899',
  brown: '#a16207',
  grey: '#9ca3af',
  gray: '#9ca3af',
  black: '#374151',
  white: '#e5e7eb',
}

// Guarantee a valid CSS color. Prefer the model's hex; otherwise map a color
// name (e.g. "Light blue") to hex; otherwise use a calm sage default.
const normalizeColor = (raw: string): string => {
  const value = (raw || '').trim()
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) return value
  const key = value.toLowerCase().replace(/[\s-]/g, '')
  return NAMED_COLOR_HEX[key] || '#7C9885'
}

export const analyze = async (content: string): Promise<AnalysisResult> => {
  const model = genAI.getGenerativeModel({
    model: CHAT_MODEL,
    generationConfig: {
      temperature: 0,
      responseMimeType: 'application/json',
      responseSchema: analysisSchema as any,
    },
  })

  const prompt = `Analyze the following journal entry and capture the writer's emotional state. Be honest and specific.\n\nJournal entry:\n${content}`

  const result = await model.generateContent(prompt)
  const parsed = JSON.parse(result.response.text()) as AnalysisResult
  // Hard guarantees so the UI never sees bad data, even if the model strays.
  const score = Math.round(Number(parsed.sentimentScore) || 0)
  return {
    ...parsed,
    color: normalizeColor(parsed.color),
    sentimentScore: Math.max(-10, Math.min(10, score)),
  }
}

// --- Lightweight RAG for "Ask Your Journal" ----------------------------------

const cosineSimilarity = (a: number[], b: number[]): number => {
  let dot = 0
  let magA = 0
  let magB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB)
  return denom === 0 ? 0 : dot / denom
}

const embed = async (text: string): Promise<number[]> => {
  const model = genAI.getGenerativeModel({ model: EMBED_MODEL })
  const res = await model.embedContent(text)
  return res.embedding.values
}

export const qa = async (
  question: string,
  entries: JournalEntry[]
): Promise<string> => {
  if (!entries.length) {
    return "You don't have any journal entries yet, so there's nothing for me to look through. Write a few and ask me again!"
  }

  // Embed every entry + the question, then rank entries by semantic relevance.
  const [questionVector, ...entryVectors] = await Promise.all([
    embed(question),
    ...entries.map((entry) => embed(entry.content)),
  ])

  const ranked = entries
    .map((entry, i) => ({
      entry,
      score: cosineSimilarity(questionVector, entryVectors[i]),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(4, entries.length))

  const context = ranked
    .map(({ entry }) => {
      const date = new Date(entry.createdAt).toDateString()
      return `Entry from ${date}:\n${entry.content}`
    })
    .join('\n\n---\n\n')

  const model = genAI.getGenerativeModel({ model: CHAT_MODEL })
  const prompt = `You are a warm, insightful journaling companion. Using ONLY the journal entries below, answer the user's question. Reference dates or specifics when helpful. If the entries don't contain the answer, say so gently and honestly — never invent details.\n\nJournal entries:\n${context}\n\nQuestion: ${question}\n\nAnswer:`

  const result = await model.generateContent(prompt)
  return result.response.text()
}
