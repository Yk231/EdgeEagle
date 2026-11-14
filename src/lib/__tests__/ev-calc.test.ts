import { describe, it, expect } from 'vitest'
import { devig, calculateEV, findEVBets } from '@/lib/ev-calc'
import type { OddsEvent, Outcome } from '@/types/bets'

// Test helpers
const h2h = (a: number, b: number): Outcome[] => [
  { name: 'Team A', price: a },
  { name: 'Team B', price: b },
]
const book = (key: string, outcomes: Outcome[], marketKey = 'h2h') => ({
  key, title: key,
  markets: [{ key: marketKey, last_update: '', outcomes }],
})
const event = (bookmakers: ReturnType<typeof book>[]) => ({
  id: '1', sport_key: 'basketball_nba', sport_title: 'NBA',
  commence_time: '2026-11-14T00:00:00Z',
  home_team: 'Team B', away_team: 'Team A', bookmakers,
}) as unknown as OddsEvent


describe('devig', () => {
  it('splits a symmetric market 50/50', () => {
    const p = devig(h2h(-110, -110))
    expect(p['Team A']).toBeCloseTo(0.5)
    expect(p['Team B']).toBeCloseTo(0.5)
  })
  it('removes the vig so probabilities sum to 1', () => {
    const p = devig(h2h(-200, 170))
    expect(p['Team A'] + p['Team B']).toBeCloseTo(1, 10)
    expect(p['Team A']).toBeCloseTo(0.6429, 4)
  })
})

describe('calculateEV', () => {
  it('is zero for a fair price', () => expect(calculateEV(0.5, 100)).toBeCloseTo(0))
  it('is positive when the price beats the true odds', () =>
    expect(calculateEV(0.5, 110)).toBeCloseTo(0.05))
  it('is negative for standard juice on a coin flip', () =>
    expect(calculateEV(0.5, -110)).toBeCloseTo(-0.04545, 4))
  it('handles favorites', () => expect(calculateEV(0.55, -110)).toBeCloseTo(0.05))
})

describe('findEVBets', () => {
  it('flags a soft-book price that beats Pinnacle', () => {
    const bets = findEVBets(event([
      book('pinnacle', h2h(-110, -110)),
      book('draftkings', h2h(110, -130)),
    ]))
    expect(bets).toHaveLength(1)
    expect(bets[0]).toMatchObject({ team: 'Team A', bookmaker_key: 'draftkings' })
    expect(bets[0].ev).toBeCloseTo(0.05)
  })

  it('returns nothing when no price beats the reference', () => {
    expect(findEVBets(event([
      book('pinnacle', h2h(-110, -110)),
      book('fanduel', h2h(-115, -105)),
    ]))).toHaveLength(0)
  })

  it('never compares Pinnacle against itself', () => {
    const bets = findEVBets(event([book('pinnacle', h2h(105, -125))]))
    expect(bets.every(b => b.bookmaker_key !== 'pinnacle')).toBe(true)
  })
  
})