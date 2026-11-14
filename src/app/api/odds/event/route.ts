import { NextRequest, NextResponse } from 'next/server'
import { OddsEvent } from '@/types/bets'

const API_KEY = process.env.ODDS_API_KEY
const BASE_URL = 'https://api.the-odds-api.com/v4'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sport = searchParams.get('sport')
  const eventId = searchParams.get('eventId')
  const markets = searchParams.get('markets')
  const regions = searchParams.get('regions') ?? 'us,us_ex,us2,eu'

  if (!sport || !eventId || !markets) {
    return NextResponse.json(
      { error: 'Missing required params: sport, eventId, markets' },
      { status: 400 }
    )
  }

  const url =
    `${BASE_URL}/sports/${sport}/events/${eventId}/odds` +
    `?apiKey=${API_KEY}&regions=${regions}&markets=${markets}&oddsFormat=american`

  const res = await fetch(url)

  if (!res.ok) {
    const text = await res.text()
    console.warn(`Event odds fetch failed for ${sport}/${eventId}: ${res.status} ${text}`)
    return NextResponse.json({ error: `Upstream error ${res.status}` }, { status: res.status })
  }

  const event: OddsEvent = await res.json()
  return NextResponse.json(event)
}