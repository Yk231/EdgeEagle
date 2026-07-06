'use client'

import { useEffect } from 'react'
import { formatGameTime, formatOdds, americanToImplied } from '@/lib/utils'
import { calculateEV } from '@/lib/ev-calc'
import { OddsEvent, Bookmaker } from '@/types/bets'
import { MARKET_NAMES } from '@/lib/constants'
import { RedPulse } from './Pulse'

// ─── Pie Chart ───────────────────────────────────────────────────────────────
function PieChart({ probs, labels, colors, centerLabel }: {
  probs: number[]
  labels: string[]
  colors: string[]
  centerLabel?: string
}) {
  if (!probs.length || probs.some((_, i) => !labels[i])) return null

  const cx = 70
  const cy = 70
  const r = 54
  const circumference = 2 * Math.PI * r

  let cumulative = 0
  const slices = probs.map((prob, i) => {
    const arc = circumference * prob
    const offset = circumference * cumulative
    cumulative += prob
    return { arc, offset, color: colors[i], prob, label: labels[i] }
  })

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {slices.map((slice, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={slice.color}
            strokeWidth="14"
            strokeDasharray={`${slice.arc} ${circumference - slice.arc}`}
            strokeDashoffset={-slice.offset + circumference / 4}
            opacity="0.9"
          />
        ))}
        <text x={cx} y={cy} textAnchor="middle" fill="#6b7280" fontSize="11">PINNACLE</text>
        <text x={cx} y={cy + 13} textAnchor="middle" fill="#6b7280" fontSize="11">
          {centerLabel ?? 'WIN PROB'}
        </text>
      </svg>
      <div className="flex flex-col gap-1">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
            <span className="text-gray-400">
              {slice.label} {(slice.prob * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

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

  // ── Pie chart config per market type ───────────────────────────────────────
  function getPieConfig() {
    if (market.startsWith('totals')) {
      const overProb = pinnacleProbs['Over'] ?? 0.5
      const underProb = pinnacleProbs['Under'] ?? 0.5
      return {
        probs: [overProb, underProb],
        labels: [`Over ${point}`, `Under ${point}`],
        colors: ['#1D4ED8', '#F97316'],
        centerLabel: 'OVER PROB',
      }
    }

    if (market.startsWith('spread')) {
      const favOutcome = pinnacleMarket?.outcomes.find(o => o.name === favorite)
      const dogOutcome = pinnacleMarket?.outcomes.find(o => o.name === underdog)
      const favPoint = favOutcome?.point
      const dogPoint = dogOutcome?.point
      return {
        probs: [favProb, dogProb],
        labels: [
          `${favorite} ${favPoint !== undefined ? (favPoint > 0 ? `+${favPoint}` : favPoint) : ''}`,
          `${underdog} ${dogPoint !== undefined ? (dogPoint > 0 ? `+${dogPoint}` : dogPoint) : ''}`
        ],
        colors: ['#1D4ED8', '#F97316'],
        centerLabel: 'COVER PROB'
      }
    }

    if (hasDraw) {
      return {
        probs: [homeProb, drawProb, awayProb],
        labels: [event.home_team, 'Draw', event.away_team],
        colors: ['#1D4ED8', '#9CA3AF', '#F97316'],
        centerLabel: 'WIN PROB',
      }
    }
    
    
    // Default: return h2h 2way
    return {
      probs: [favProb, dogProb],
      labels: [
        favorite,
        underdog
      ],
      colors: ['#1D4ED8', '#F97316'],
      centerLabel: 'WIN PROB',
    }
    
  }

  const pieConfig = getPieConfig()

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
        <div className="p-8 border-b border-gray-800">
          <div className="flex flex-col gap-2 items-center">
            <p className="text-2xl text-white font-semibold">
              {`${event.away_team} vs. ${event.home_team}`}
            </p>
            <p className="text-base text-gray-400 font-medium">
              {marketLabel} • {formatGameTime(event.commence_time)} • {event.sport_title}
            </p>
          </div>
        </div>

        {/* Score */}
        {event.isLive && event.scores && (() => {
          const away = event.scores.find(s => s.name === event.away_team)
          const home = event.scores.find(s => s.name === event.home_team)
          return (
            <div className='flex justify-center items-center flex-col p-6 gap-6 border-b border-gray-800'>
              <RedPulse/>
              <p className="text-3xl font-mono font-bold text-white tabular-nums">
                {event.away_team} {away?.score ?? '0'} — {home?.score ?? '0'} {event.home_team}
              </p>
            </div>
          )
        })()}
        

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {renderBody()}
        </div>

        <span className="ml-auto p-4 text-sm text-gray-600">Last updated {last_update}</span>
      </div>
    </div>
  )
}