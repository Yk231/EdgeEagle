import { OddsEvent } from '@/types/bets'

const API_KEY = process.env.ODDS_API_KEY
const BASE_URL = 'https://api.the-odds-api.com/v4'

// ─── Types ────────────────────────────────────────────────────────────────────

export type GameScore = {
  id: string
  completed: boolean
  isLive: boolean
  scores: { name: string; score: string }[] | null
  last_update: string | null
}

export type ScoreMap = Record<string, GameScore>

// ─── Fetch ────────────────────────────────────────────────────────────────────

/**
 * A function that calls the API fetches a GameScore array for every live game
 * E.g. All live MLB games  
 * @param sportkey - a given sport key
 * @returns GameScore[] for all ongoing games under the sportkey paramenter
 */
async function getScores(sportkey: string): Promise<GameScore[]> {
  const res = await fetch(
    `${BASE_URL}/sports/${sportkey}/scores?apiKey=${API_KEY}&daysFrom=1`,
  )

  if (!res.ok) {
    console.warn(`Scores fetch failed for ${sportkey}: ${res.status}`)
    return []
  }


  type ScoresApiGame = {
    id: string
    completed?: boolean
    isLive: boolean
    scores: { name: string; score: string }[] | null
    last_update?: string | null
  }

  const data: ScoresApiGame[] = await res.json()

  return data.map(game => ({
    id: game.id,
    completed: game.completed ?? false,
    isLive: !game.completed && game.scores !== null,
    scores: game.scores ?? null,
    last_update: game.last_update ?? null
  }))
}


/**
 * Function that calls getScores for all sports
 * @param sports - an array of sport keys
 * @param events - an OddsEvent array of all ongoing events
 * @returns ScoreMap (Record<string, GameScore>) denoting all games and their scores
 */
export async function getAllScores(sports: string[], events: OddsEvent[]): Promise<ScoreMap> {
  const now = new Date()

  // Function that returns true if a certain commenceTime is within 4 hours from now
  function isPotentiallyLive(commenceTime: string): boolean {
    const start = new Date(commenceTime)
    const hoursAgo = (now.getTime() - start.getTime()) / (1000 * 60 * 60)
    return hoursAgo >= 0 && hoursAgo < 4
  }

  if (!events.some(e => isPotentiallyLive(e.commence_time))) return {}

  // Filter out sports that are out of season
  const sportsWithLiveGames = sports.filter(sport =>
    events.some(e => e.sport_key === sport && isPotentiallyLive(e.commence_time))
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