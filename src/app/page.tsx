'use client'

import { useEffect, useState, useCallback } from 'react'
import { probToAmerican, americanToProb, formatEV, formatGameTime, formatOdds } from '@/lib/utils'
import GameModal from '../components/GameModal'
import Filter from '@/components/Filters'
import { EVBet, OddsEvent } from '@/types/bets'
import { PAGE_SIZE, REFRESH_INTERVAL, SPORTS, SPORT_LOGOS, MARKETS, MARKET_NAMES, BOOKMAKERS, BOOKMAKER_LOGOS, BOOKMAKER_NAMES } from '@/lib/constants'
import { GreenPulse, RedPulse } from '@/components/Pulse'

type Meta = {
  eventsScanned: number
  betsFound: number
  fetchedAt: string
}

export default function Home() {
  const [bets, setBets] = useState<EVBet[]>([])
  const [meta, setMeta] = useState<Meta>({
    eventsScanned: 0,
    betsFound: 0,
    fetchedAt: new Date().toISOString(),
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [allEvents, setAllEvents] = useState<OddsEvent[]>([])
  const [selectedGame, setSelectedGame] = useState<{ event: OddsEvent; market: string; point?: number } | null>(null)
  
  const [page, setPage] = useState(1)

  // Filters
  const [minEV, setMinEV] = useState(0)
  const [sportFilter, setSportFilter] = useState<Set<string>>(
    new Set(SPORTS.map(b => b.key))
  )
  const [bookFilter, setBookFilter] = useState<Set<string>>(
    new Set(BOOKMAKERS.map(b => b.name))
  )
  const [marketFilter, setMarketFilter] = useState<Set<string>>(
    new Set(MARKETS.map(b => b.key))
  )
  const [sortBy, setSortBy] = useState<'ev' | 'odds'>('ev')

  const fetchBets = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch('/api/odds')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setBets(data.evBets)
      setMeta(data.meta)
      setAllEvents(data.allEvents ?? [])

    } catch {
      setError('Failed to fetch odds. Retrying soon.')
    } finally {
      setLoading(false)
    }
  }, [])


  // Refresh 
  useEffect(() => {
    fetchBets()
  }, [fetchBets])

  // Load more bets
  useEffect(() => {
    setPage(1)
  }, [minEV, marketFilter, sortBy])


  const filtered = bets
    .filter(b => b.ev >= minEV / 100)
    .filter(b => sportFilter.has(b.sport_title))
    .filter(b => marketFilter.has(b.market))
    .filter(b => bookFilter.has(b.bookmaker_title))
    .sort((a, b) => sortBy === 'ev' ? b.ev - a.ev : Math.abs(b.odds) - Math.abs(a.odds))

  const paginated = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = filtered.length > paginated.length
  
  return (
    <main className="min-h-screen bg-[#03060E] text-gray-100" style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <header className="border-b border-gray-800/60 px-30 py-4">
        <div className="flex flex-row">
          <img src={'/logos/EdgeEagleLogo.png'} className=" h-34" />

          <div className="ml-auto flex items-center gap-4 text-base text-gray-500">
            <div className="flex items-center gap-1.5">
              <GreenPulse />
              <span>Updated {new Date(meta.fetchedAt).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Ticker bar — top bets scrolling */}
      {!loading && filtered.length > 0 && (
        <div className="bg-gray-900/40 border-b border-gray-800/40 overflow-hidden py-2">
          <div className="flex gap-8 animate-[marquee_30s_linear_infinite] whitespace-nowrap px-6">
            {[...filtered, ...filtered].slice(0, 20).map((bet, i) => (
              <span key={i} className="text-xs text-gray-400 shrink-0">
                <span className="text-white font-medium">{bet.team}</span>
                <span className="mx-1 text-gray-600">·</span>
                <span className="text-amber-400 font-mono">{formatOdds(bet.odds)}</span>
                <span className="mx-1 text-gray-600">·</span>
                <span className="text-emerald-400 font-mono">{formatEV(bet.ev)}</span>
                <span className="mx-1 text-gray-600">via</span>
                <span className="text-gray-300">{bet.bookmaker_title}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-screen-2xl mx-auto px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">

          {/* Min EV input */}
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-500 whitespace-nowrap">Min EV</label>
            <input
              type="range"
              min={0}
              max={5}
              step={0.1}
              value={minEV}
              onChange={e => setMinEV(parseFloat(e.target.value))}
              className="w-28 accent-emerald-400"
            />
            <span className="text-xs font-mono text-emerald-400 w-10">{minEV.toFixed(1)}%</span>
          </div>


          <div className="h-4 w-px bg-gray-800" />

          <Filter
            label="Sports"
            options={SPORTS.map(b => b.key)}
            selected={sportFilter}
            onToggle={value => {
              const next = new Set(sportFilter)
              next.has(value) ? next.delete(value) : next.add(value)
              setSportFilter(next)
            }}
            onToggleAll={allSelected => {
              setSportFilter(allSelected ? new Set() : new Set(SPORTS.map(b => b.key)))
            }}
          />

          <Filter
            label="Markets"
            options={MARKETS.map(b => b.key)}
            selected={marketFilter}
            onToggle={value => {
              const next = new Set(marketFilter)
              next.has(value) ? next.delete(value) : next.add(value)
              setMarketFilter(next)
            }}
            onToggleAll={allSelected => {
              setMarketFilter(allSelected ? new Set() : new Set(MARKETS.map(b => b.key)))
            }}
            names={MARKET_NAMES}
          />


          <Filter
            label="Books"
            options={BOOKMAKERS.map(b => b.name)}
            selected={bookFilter}
            onToggle={value => {
              const next = new Set(bookFilter)
              next.has(value) ? next.delete(value) : next.add(value)
              setBookFilter(next)
            }}
            onToggleAll={allSelected => {
              setBookFilter(allSelected ? new Set() : new Set(BOOKMAKERS.map(b => b.name)))
            }}
          />

          <div>
            <button
              onClick={() => {
                setBookFilter(new Set(BOOKMAKERS.map(b => b.name)))
                setMarketFilter(new Set(MARKETS.map(b => b.key)))
                setSportFilter(new Set(SPORTS.map(b => b.key)))
                setSortBy('ev')
                setMinEV(0)
              }}
              className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1 border border-gray-800 rounded hover:border-gray-600"
            >
              Reset filters
            </button>
          </div>

          <div className="ml-auto">
            <button
              onClick={fetchBets}
              disabled={loading}
              className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1 border border-gray-800 rounded hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Refreshing...' : 'Refresh now'}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-screen-2xl mx-auto px-6 pb-12">
        {error ? (
          <div className="text-red-400 text-sm py-8">{error}</div>
        ) : loading ? (
          <div className="space-y-2 py-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-900/50 rounded animate-pulse" />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-500 text-sm">No bets meet your current filters.</p>
            <p className="text-gray-600 text-xs mt-1">Try lowering the min EV threshold or switching markets.</p>
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left">
                <th className="pb-2 text-xs font-medium text-gray-600 uppercase tracking-wider pr-6">Game</th>
                <th className="pb-2 text-xs font-medium text-gray-600 uppercase tracking-wider pr-6">Market</th>
                <th className="pb-2 text-xs font-medium text-gray-600 uppercase tracking-wider pr-6">Book Odds</th>
                <th className="pb-2 text-xs font-medium text-gray-600 uppercase tracking-wider pr-6">Consensus Odds</th>
                <th className="pb-2 text-xs font-medium text-gray-600 uppercase tracking-wider ">Expected Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {paginated.map((bet, i) => (
                <tr
                  key={i}
                  onClick={() => {
                    const event = allEvents.find(e => e.game_title === bet.game_title)
                    if (event) setSelectedGame({ event, market: bet.market, point: bet.point })
                  }}
                  className="group hover:bg-gray-900/40 transition-colors cursor-pointer"
                >

      
                  <td className="py-3 pr-6">
                    <div className="flex flex-row gap-4 items-center">
                      <img src={SPORT_LOGOS[bet.sport_title]} alt={bet.sport_title} className=" h-10" />
                      <div className="flex flex-col gap-2">
                        <span className="text-base font-semibold text-white-200">{bet.game_title}</span>
                        <div className="flex flex-row items-center gap-3 text-base font-medium text-gray-400">
                          {bet.sport_title} • {formatGameTime(bet.commence_time)} 
                          {allEvents.find(e => e.game_title === bet.game_title)?.isLive && (
                            <RedPulse/>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>


          

                  <td className="py-3 pr-6 font-semibold text-white">
                    <div className="flex flex-col gap-2">
                      {bet.market === 'h2h' ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-base font-semibold text-white">Moneyline</span>
                          <span className="text-base font-medium text-gray-400">{bet.team}</span>
                        </div>
                      ) : bet.market === 'spreads' ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-base font-semibold text-white">Spread</span>
                          <span className="text-base font-medium text-gray-400">
                            {bet.team} {bet.point !== undefined ? (bet.point > 0 ? `+${bet.point}` : bet.point) : ''}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className="text-base font-semibold text-white">Total</span>
                          <span className="text-base font-medium text-gray-400">
                            {bet.team} {bet.point}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>



                  <td className="py-3 pr-6">
                    <div className="flex flex-row gap-4 items-center">
                      <img src={BOOKMAKER_LOGOS[bet.bookmaker_key]} alt={bet.bookmaker_title} className="h-14" />
                      <div className="flex flex-col py-3 pr-6 font-mono font-bold tabular-nums">
                        <p className="text-gray-300">{bet.bookmaker_title}</p>
                        <div className="flex flex-row gap-1">
                          <p className="text-gray-400">Odds:</p> 
                          <p className="text-amber-400">{formatOdds(bet.odds)}</p> 
                        </div>
                        <div className="flex flex-row gap-2">
                          <p className="text-gray-400">Implied Prob:</p> 
                          <p className="text-amber-400">{americanToProb(bet.odds)}</p> 
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 pr-6">
                    <div className="flex flex-row gap-4 items-center">
                      <img src={BOOKMAKER_LOGOS['pinnacle']} alt={'pinnacle'} className="h-12" />
                      <div className="flex flex-col py-3 pr-6 font-mono font-bold tabular-nums">
                        <p className="text-gray-300">Pinnacle</p>
                        <div className="flex flex-row gap-1">
                          <p className="text-gray-400">Odds:</p> 
                          <p className="text-amber-400">{probToAmerican(bet.trueProb)}</p> 
                        </div>
                        <div className="flex flex-row gap-2">
                          <p className="text-gray-400">Implied Prob:</p> 
                          <p className="text-amber-400">{`${(bet.trueProb * 100).toFixed(1)}%`}</p> 
                        </div>
                      </div>

                    </div>
                  </td>


                  <td className="py-3">
                    <span className="font-mono text-emerald-400 font-semibold tabular-nums px-3 py-2 rounded-full border border-emerald-400/30 bg-emerald-400/10">
                      {formatEV(bet.ev)}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

        {hasMore && (
          <div className="py-6">
            <button
              onClick={() => setPage(p => p + 1)}
              className="text-xs text-gray-500 hover:text-white transition-colors px-4 py-2 border border-gray-800 rounded hover:border-gray-600"
            >
              Load more
            </button>
          </div>
        )}

        {/* Footer */}
        {!loading && (
          <div className="mt-8 pt-4 border-t border-gray-900 flex items-center justify-between text-base text-gray-700">
            <span>EV calculated vs Pinnacle devigged lines · {meta.eventsScanned} events · {meta.betsFound} raw bets before filters</span>
            <span>Last updated {new Date(meta.fetchedAt).toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      {selectedGame && (
        <GameModal
          event={selectedGame.event}
          market={selectedGame.market}
          point={selectedGame.point}
          last_update={new Date(meta.fetchedAt).toLocaleTimeString()}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </main>
  )
}