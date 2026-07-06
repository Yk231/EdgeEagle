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

export async function getAllScores(sports: string[], events: OddsEvent[]): Promise<ScoreMap> {
  const now = new Date()
  
  // Only fetch scores if any game is potentially live
  const hasLiveGames = events.some(e => {
    const start = new Date(e.commence_time)
    const hoursAgo = (now.getTime() - start.getTime()) / (1000 * 60 * 60)
    return hoursAgo >= 0 && hoursAgo < 4 // started within last 4 hours
  })

  if (!hasLiveGames) return {}

  // Only fetch scores for sports that have live games
  const sportsWithLiveGames = sports.filter(sport =>
    events.some(e => {
      const start = new Date(e.commence_time)
      const hoursAgo = (now.getTime() - start.getTime()) / (1000 * 60 * 60)
      return e.sport_key === sport && hoursAgo >= 0 && hoursAgo < 4
    })
  )

  const results = await Promise.allSettled(sportsWithLiveGames.map(s => getScores(s)))

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