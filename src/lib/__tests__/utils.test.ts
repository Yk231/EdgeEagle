import { describe, it, expect } from 'vitest'
import { formatOdds, americanToImplied, americanToProb, probToAmerican } from '@/lib/utils'

describe('americanToImplied', () => {
  it('converts even money to 0.5', () => {
    expect(americanToImplied(100)).toBe(0.5)
    expect(americanToImplied(-100)).toBe(0.5)
  })

  it('converts underdogs (positive odds)', () => {
    expect(americanToImplied(150)).toBeCloseTo(0.4)
    expect(americanToImplied(300)).toBeCloseTo(0.25)
  })

  it('converts favorites (negative odds)', () => {
    expect(americanToImplied(-150)).toBeCloseTo(0.6)
    expect(americanToImplied(-200)).toBeCloseTo(0.6667, 4)
    expect(americanToImplied(-110)).toBeCloseTo(0.5238, 4)
  })

  it('handles extreme odds', () => {
    expect(americanToImplied(10000)).toBeCloseTo(0.0099, 4)
    expect(americanToImplied(-10000)).toBeCloseTo(0.9901, 4)
  })

  it('always returns a probability between 0 and 1', () => {
    for (const odds of [-100000, -500, -110, 100, 110, 500, 100000]) {
      const p = americanToImplied(odds)
      expect(p).toBeGreaterThan(0)
      expect(p).toBeLessThan(1)
    }
  })

  it('gives favorites more than 50% and underdogs less', () => {
    expect(americanToImplied(-120)).toBeGreaterThan(0.5)
    expect(americanToImplied(120)).toBeLessThan(0.5)
  })

  it('bigger underdogs get lower probabilities', () => {
    expect(americanToImplied(200)).toBeLessThan(americanToImplied(150))
    expect(americanToImplied(-300)).toBeGreaterThan(americanToImplied(-200))
  })

  it('a -110/-110 market adds up to more than 100% (the vig)', () => {
    const total = americanToImplied(-110) * 2
    expect(total).toBeGreaterThan(1)
    expect(total).toBeCloseTo(1.0476, 4)
  })
})

describe('americanToProb', () => {
  it('converts even money to 50%', () => {
    expect(americanToProb(100)).toBe('50.0%')
    expect(americanToProb(-100)).toBe('50.0%')
  })

  it('converts underdogs (positive odds)', () => {
    expect(americanToProb(150)).toBe('40.0%')
    expect(americanToProb(300)).toBe('25.0%')
  })

  it('converts favorites (negative odds)', () => {
    expect(americanToProb(-150)).toBe('60.0%')
    expect(americanToProb(-200)).toBe('66.7%')
  })

  it('rounds to one decimal place', () => {
    expect(americanToProb(-110)).toBe('52.4%') // 52.38
    expect(americanToProb(250)).toBe('28.6%')  // 28.57
  })

  it('agrees with americanToImplied', () => {
    for (const odds of [-300, -200, -110, 100, 150, 250]) {
      expect(americanToProb(odds)).toBe(`${(americanToImplied(odds) * 100).toFixed(1)}%`)
    }
  })
})

describe('probToAmerican', () => {
  it('converts underdogs (prob < 0.5) to positive odds', () => {
    expect(probToAmerican(0.4)).toBe('+150')
    expect(probToAmerican(0.25)).toBe('+300')
  })

  it('converts favorites (prob > 0.5) to negative odds', () => {
    expect(probToAmerican(0.75)).toBe('-300')
    expect(probToAmerican(2 / 3)).toBe('-200')
    expect(probToAmerican(110 / 210)).toBe('-110')
  })

  it('treats exactly 50% as -100', () => {
    expect(probToAmerican(0.5)).toBe('-100')
  })

  it('rounds to the nearest whole number', () => {
    expect(probToAmerican(0.3)).toBe('+233') // 233.33
    expect(probToAmerican(0.6)).toBe('-150')
  })

  it('returns "0" for probabilities outside (0, 1)', () => {
    for (const odds of [-.2, 0, 1, 1.5]) {
      expect(probToAmerican(odds)).toBe('0')
    }
  })

  it('round-trips with americanToImplied', () => {
    for (const odds of [-300, -200, -150, -110, 150, 200, 300]) {
      expect(probToAmerican(americanToImplied(odds))).toBe(formatOdds(odds))
    }
  })
})