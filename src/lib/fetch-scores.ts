import { OddsEvent } from '@/types/bets'

const API_KEY = process.env.ODDS_API_KEY
const BASE_URL = 'https://api.the-odds-api.com/v4'

// ─── Types ────────────────────────────────────────────────────────────────────

export type GameScore = {
  id: string
  completed: boolean
  isLive: boolean
  scores: { name: string; score: string }[] | null
  last_update: string
}

export type ScoreMap = Record<string, GameScore>

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function getScores(sport: string): Promise<GameScore[]> {
  const res = await fetch(
    `${BASE_URL}/sports/${sport}/scores?apiKey=${API_KEY}&daysFrom=1`,
  )

  if (!res.ok) {
    console.warn(`Scores fetch failed for ${sport}: ${res.status}`)
    return []
  }

  const data = await res.json()

  return data.map((game: any) => ({
    id: game.id,
    completed: game.completed ?? false,
    isLive: !game.completed && game.scores !== null,
    scores: game.scores ?? null,
    last_update: game.last_update ?? null
  }))
}

export async function getAllScores(sports: string[]): Promise<ScoreMap> {
  const results = await Promise.allSettled(sports.map(s => getScores(s)))

  const scoreMap: ScoreMap = {}

  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      for (const game of result.value) {
        scoreMap[game.id] = game
      }
    } else {
      console.error(`Failed to fetch scores for ${sports[i]}:`, result.reason)
    }
  })

  return scoreMap
}