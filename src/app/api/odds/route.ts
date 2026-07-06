import { NextResponse } from 'next/server'
import { findEVBets } from '@/lib/ev-calc'
import { EVBet } from '@/types/bets'
import mockData from '@/lib/mock.json'
import { getAllOdds } from '@/lib/fetch-odds'
import { getAllScores } from '@/lib/fetch-scores'

const USE_MOCK = process.env.NODE_ENV === 'development'

export async function GET() {

  //if (USE_MOCK) { return NextResponse.json(mockData) }

  try {

    const ACTIVE_SPORTS = [
      'baseball_mlb',
      'soccer_fifa_world_cup',
      // add others as needed
    ]

    const events = await getAllOdds()
    const scoreMap = await getAllScores(ACTIVE_SPORTS, events)

    const evBets: EVBet[] = events
      .flatMap(findEVBets)
      .sort((a, b) => b.ev - a.ev)

    return NextResponse.json({
      evBets,
      allEvents: events.map(e => ({
        ...e,
        game_title: `${e.away_team} vs. ${e.home_team}`,
        isLive: scoreMap[e.id]?.isLive ?? false,
        completed: scoreMap[e.id]?.completed ?? false,
        scores: scoreMap[e.id]?.scores ?? null,
      })),
      meta: {
        eventsScanned: events.length,
        betsFound: evBets.length,
        fetchedAt: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error('Failed to fetch odds:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
