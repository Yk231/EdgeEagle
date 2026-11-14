import { OddsEvent } from '@/types/bets'
import { SPORTS, BOOKMAKERS } from './constants'

const API_KEY = process.env.ODDS_API_KEY
const BASE_URL = 'https://api.the-odds-api.com/v4'


const ACTIVE_SPORTS = SPORTS.filter(s => s.active)
export const BOOKS = BOOKMAKERS.map(b => b.key).join(',')



export async function getOdds(sport: typeof ACTIVE_SPORTS[0]): Promise<OddsEvent[]> {

    const markets = "h2h,spreads,totals"


    const res = await fetch(
    `${BASE_URL}/sports/${sport.key}/odds?apiKey=${API_KEY}&markets=${markets}&oddsFormat=american&bookmakers=${BOOKS}`,
    )



    if (!res.ok) {
        console.warn(`Fetch failed for ${sport.key}: ${res.status}`)
        return []
    }

    const events: OddsEvent[] = await res.json()
    
    return events
}

/**
 * Calls getOdds for all sports
 * @returns Flat array of OddsEvents across all sports
 */
export async function getAllOdds(): Promise<OddsEvent[]> {
    const results = await Promise.allSettled(ACTIVE_SPORTS.map(sport => getOdds(sport)))
    
    results.forEach((r, i) => {
        if (r.status === 'rejected'){
            console.error(`Failed ${ACTIVE_SPORTS[i].key}:`, r.reason)
        }
    })

    return results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => (r as PromiseFulfilledResult<OddsEvent[]>).value)
}