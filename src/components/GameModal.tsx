'use client'

import { useEffect, useState } from 'react'
import { formatGameTime, formatOdds, americanToImplied } from '@/lib/utils'
import { calculateEV, findEVBets } from '@/lib/ev-calc'
import { OddsEvent, Bookmaker, EVBet } from '@/types/bets'
import { MARKET_NAMES, SPORT_ADDITIONAL_MARKETS } from '@/lib/constants'
import { RedPulse } from './Pulse'
import { LOGOS } from '@/lib/logos'
import { PieChart, getPieConfig } from './PieChart'

// ─── Types ───────────────────────────────────────────────────────────────────
type BookRow = {
  book: Bookmaker
  price: number
  ev: number
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function GameModal({
  event,
  market,
  point,
  last_update,
  onClose,
}: {
  event: OddsEvent
  market: string
  point?: number
  last_update: string
  onClose: () => void
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const [extraMarketKeys, setExtraMarketKeys] = useState<string[] | null>(null)
  const [extraEvBets, setExtraEvBets] = useState<EVBet[]>([])
  const [loadingExtra, setLoadingExtra] = useState(false)
  const [extraError, setExtraError] = useState<string | null>(null)

  async function loadAdditionalMarkets() {
    const marketsParam = SPORT_ADDITIONAL_MARKETS[event.sport_key]
    if (!marketsParam) {
      setExtraError('No additional markets configured for this sport yet')
      return
    }

    setLoadingExtra(true)
    setExtraError(null)

    try {
      const res = await fetch(
        `/api/odds/event?sport=${event.sport_key}&eventId=${event.id}&markets=${marketsParam}`
      )
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const extraEvent: OddsEvent = await res.json()

      // Merge the newly-fetched markets into a copy of this event's bookmakers,
      // then reuse the app's existing +EV engine on the merged event.
      const bookmakerMap = new Map(
        event.bookmakers.map(b => [b.key, { ...b, markets: [...b.markets] }])
      )
      for (const b of extraEvent.bookmakers) {
        const existing = bookmakerMap.get(b.key)
        if (existing) {
          const have = new Set(existing.markets.map(m => m.key))
          existing.markets.push(...b.markets.filter(m => !have.has(m.key)))
        } else {
          bookmakerMap.set(b.key, b)
        }
      }
      const merged: OddsEvent = { ...event, bookmakers: Array.from(bookmakerMap.values()) }

      const marketKeys = marketsParam.split(',')
      const bets = findEVBets(merged)
        .filter(b => marketKeys.includes(b.market))
        .sort((a, b) => b.ev - a.ev)

      setExtraMarketKeys(marketKeys)
      setExtraEvBets(bets)
    } catch (err) {
      setExtraError(err instanceof Error ? err.message : 'Failed to load additional markets')
    } finally {
      setLoadingExtra(false)
    }
  }



  // ── Find Pinnacle's market ──────────────────────────────────────────────────
  const pinnacleBook = event.bookmakers.find(b => b.key === 'pinnacle')

  // For spreads/totals, match by market key AND point value
  const pinnacleMarket = pinnacleBook?.markets.find(m => {
    if (m.key !== market) return false
    if (market.startsWith('h2h')) return true
    // For spreads/totals, find the market containing the clicked point value
    return point !== undefined
      ? m.outcomes.some(o => Math.abs(o.point ?? 0) === Math.abs(point))
      : true
  })

  // ── Devig Pinnacle ──────────────────────────────────────────────────────────
  const pinnacleProbs: Record<string, number> = {}
  if (pinnacleMarket) {
    const total = pinnacleMarket.outcomes.reduce((sum, o) => sum + americanToImplied(o.price), 0)
    for (const o of pinnacleMarket.outcomes) {
      pinnacleProbs[o.name] = americanToImplied(o.price) / total
    }
  }

  // ── Outcome names from Pinnacle ─────────────────────────────────────────────
  const outcomeNames = pinnacleMarket?.outcomes.map(o => o.name) ?? []
  const hasDraw = outcomeNames.includes('Draw')

  // ── Fav/dog for h2h and spreads ────────────────────────────────────────────
  const homeProb = pinnacleProbs[event.home_team] ?? 0
  const awayProb = pinnacleProbs[event.away_team] ?? 0
  const drawProb = pinnacleProbs['Draw'] ?? 0
  const favorite = homeProb >= awayProb ? event.home_team : event.away_team
  const underdog = favorite === event.home_team ? event.away_team : event.home_team
  const favProb = pinnacleProbs[favorite] ?? 0.5
  const dogProb = pinnacleProbs[underdog] ?? 0.5

  // ── Build rows for a given outcome ─────────────────────────────────────────
  function getRows(outcomeName: string): BookRow[] {
    return event.bookmakers
      .filter(b => b.key !== 'pinnacle')
      .flatMap(book => {
        const bookMarket = book.markets.find(m => {
          if (m.key !== market) return false
          if (market.startsWith('h2h')) return true
          return point !== undefined
            ? m.outcomes.some(o => Math.abs(o.point ?? 0) === Math.abs(point))
            : true
        })
        const outcome = bookMarket?.outcomes.find(o => o.name === outcomeName)
        if (!outcome) return []
        const fairProb = pinnacleProbs[outcomeName] ?? 0
        const ev = calculateEV(fairProb, outcome.price)
        return [{ book, price: outcome.price, ev }]
      })
      .sort((a, b) => b.ev - a.ev) // sort by EV descending
  }

  // ── Side table ─────────────────────────────────────────────────────────────
  function SideTable({ outcomeName, label }: { outcomeName: string; label: string }) {
    const rows = getRows(outcomeName)
    const pinnacleOutcome = pinnacleMarket?.outcomes.find(o => o.name === outcomeName)

    return (
      <div>
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-1">
          {label}
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-800">
              <th className="pb-2 text-xs text-gray-600 font-medium px-1">Book</th>
              <th className="pb-2 text-xs text-gray-600 font-medium px-1 text-right">Odds</th>
              <th className="pb-2 text-xs text-gray-600 font-medium px-1 text-right">EV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900">
            {pinnacleOutcome && (
              <tr className="bg-amber-400/5">
                <td className="py-2 px-1 text-amber-400 text-xs font-medium">Pinnacle</td>
                <td className="py-2 px-1 text-right font-mono text-amber-400 font-bold text-xs">
                  {formatOdds(pinnacleOutcome.price)}
                </td>
                <td className="py-2 px-1 text-right text-gray-600 text-xs">ref</td>
              </tr>
            )}
            {rows.map(({ book, price, ev }) => (
              <tr key={book.key} className="hover:bg-gray-900/30 transition-colors">
                <td className="py-2 px-1 text-gray-400 text-xs truncate max-w-[90px]">{book.title}</td>
                <td className={`py-2 px-1 text-right font-mono text-xs tabular-nums font-bold ${ev > 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                  {formatOdds(price)}
                </td>
                <td className={`py-2 px-1 text-right font-mono text-xs tabular-nums ${ev > 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                  {ev > 0 ? '+' : ''}{(ev * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const pieConfig = getPieConfig({
    market, point, favorite, favProb, underdog, dogProb,
    pinnacleMarket, pinnacleProbs, hasDraw, drawProb,
  });

  // ── Layout config per market type ──────────────────────────────────────────
  function renderBody() {
    if (market.startsWith('totals')) {
      return (
        <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-start">
          <SideTable outcomeName="Over" label={`Over ${point ?? ''}`} />
          <div className="pt-6">
            <PieChart {...pieConfig} />
          </div>
          <SideTable outcomeName="Under" label={`Under ${point ?? ''}`} />
        </div>
      )
    }

    if (hasDraw) {
      return (
        <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-start">
          <SideTable outcomeName={event.home_team} label={event.home_team} />
          <div className="flex flex-col items-center gap-6 pt-6">
            <PieChart {...pieConfig} />
            <SideTable outcomeName="Draw" label="Draw" />
          </div>
          <SideTable outcomeName={event.away_team} label={event.away_team} />
        </div>
      )
    }

    const favPoint = pinnacleMarket?.outcomes.find(o => o.name === favorite)?.point
    const dogPoint = pinnacleMarket?.outcomes.find(o => o.name === underdog)?.point

    return (
      <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-start">
        <SideTable
          outcomeName={favorite}
          label={market === 'spreads' && favPoint !== undefined
            ? `${favorite} ${favPoint > 0 ? `+${favPoint}` : favPoint}`
            : `${favorite} (Fav)`
          }
        />
        <div className="pt-6">
          <PieChart {...pieConfig} />
        </div>
        <SideTable
          outcomeName={underdog}
          label={market === 'spreads' && dogPoint !== undefined
            ? `${underdog} ${dogPoint > 0 ? `+${dogPoint}` : dogPoint}`
            : `${underdog} (Dog)`
          }
        />
      </div>
    )

  }

  const marketLabel = MARKET_NAMES[market] ?? market

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-[#0D1321] border border-gray-800 rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8">
          <div className="flex flex-col gap-2 items-center">
            <p className="text-2xl text-white font-semibold">
              {`${event.away_team} vs. ${event.home_team}`}
            </p>
            <p className="text-base text-gray-400 font-medium">
              {marketLabel} • {formatGameTime(event.commence_time)} • {event.sport_title}
            </p>
          </div>
        </div>

        {/* Live button */}
        {event.isLive &&
          <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/40 rounded-lg px-4 py-1.5">
              <span className="text-red-400 text-xs font-bold tracking-widest">LIVE</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
          </div>
        }

        {/* Score */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 pb-10">

          {/* Away team */}
          <div className="flex items-center justify-end gap-4 p-6">

            <div className="flex flex-col items-center pl-10 pr-10">
              <div className="flex flex-row items-center gap-4">
                {LOGOS[event.away_team] ? (
                  <img src={LOGOS[event.away_team]} className="h-20 w-20 object-contain opacity-85" />
                ) : (
                  <div className="h-12 w-12" />
                )}           
              </div>
              <p className="text-xs text-white-600 uppercase tracking-wider mt-2">{event.away_team}</p>
            </div>

            {event.isLive && event.scores && (
              <p className="text-5xl font-bold text-red-900 font-mono">
                {event.scores.find(s => s.name === event.away_team)?.score ?? '0'}
              </p>
            )}
          </div>

          {/* VS */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 border border-white/10 ml-5 mr-5">
            <span className="text-xs text-gray-500 font-semibold">VS</span>
          </div>

          {/* Home team */}
          <div className="flex flex-col items-center justify-start gap-4 p-6">
            {event.isLive && event.scores && (
              <p className="text-5xl font-bold text-red-900 font-mono">
                {event.scores.find(s => s.name === event.home_team)?.score ?? '0'}
              </p>
            )}
            <div className="flex flex-col items-center pl-10 pr-10">
              <div className="flex flex-row items-center gap-4">
                {LOGOS[event.home_team] ? (
                  <img src={LOGOS[event.home_team]} className="h-20 w-20 object-contain opacity-85" />
                ) : (
                  <div className="h-12 w-12" />
                )}                         </div>
              <p className="text-xs justify-center text-white-600 uppercase tracking-wider mt-2">{event.home_team}</p>
            </div>
          </div>

        </div>

        <div className="w-full h-px bg-white/10" />

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {renderBody()}
        </div>

        {extraError && (
          <p className="text-xs text-red-400 px-1 mt-4">{extraError}</p>
        )}

        {extraMarketKeys && !extraError && (
          extraEvBets.length === 0 ? (
            <p className="text-xs text-gray-600 px-1 mt-4">No +EV bets found in these markets right now.</p>
          ) : (
            <table className="w-full text-sm mt-4">
              <thead>
                <tr className="text-left border-b border-gray-800">
                  <th className="pb-2 text-xs text-gray-600 font-medium px-1">Market</th>
                  <th className="pb-2 text-xs text-gray-600 font-medium px-1">Selection</th>
                  <th className="pb-2 text-xs text-gray-600 font-medium px-1">Book</th>
                  <th className="pb-2 text-xs text-gray-600 font-medium px-1 text-right">Odds</th>
                  <th className="pb-2 text-xs text-gray-600 font-medium px-1 text-right">EV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {extraEvBets.map((b, i) => (
                  <tr key={i} className="hover:bg-gray-900/30 transition-colors">
                    <td className="py-2 px-1 text-gray-500 text-xs">{MARKET_NAMES[b.market] ?? b.market}</td>
                    <td className="py-2 px-1 text-gray-300 text-xs">
                      {b.team}{b.point !== undefined ? ` ${b.point > 0 ? `+${b.point}` : b.point}` : ''}
                    </td>
                    <td className="py-2 px-1 text-gray-400 text-xs truncate max-w-[90px]">{b.bookmaker_title}</td>
                    <td className="py-2 px-1 text-right font-mono text-xs tabular-nums font-bold text-emerald-400">
                      {formatOdds(b.odds)}
                    </td>
                    <td className="py-2 px-1 text-right font-mono text-xs tabular-nums text-emerald-400">
                      +{(b.ev * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}

        <div className="flex items-center justify-between p-4 pt-4">
          <button
            onClick={loadAdditionalMarkets}
            disabled={loadingExtra}
            className="text-sm text-gray-600 hover:text-gray-300 disabled:opacity-50 transition-colors"
          >
            {loadingExtra ? 'Loading…' : 'Run additional markets'}
          </button>
          <span className="text-sm text-gray-600">Last updated {last_update}</span>
        </div>
      </div>
    </div>

  )
}
