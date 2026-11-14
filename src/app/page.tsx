'use client'

import { useEffect, useState, useCallback } from 'react'
import { probToAmerican, americanToProb, formatEV, formatGameTime, formatOdds } from '@/lib/utils'
import GameModal from '../components/GameModal'
import Filter from '@/components/Filters'
import { EVBet, OddsEvent, Meta } from '@/types/bets'
import { PAGE_SIZE, REFRESH_INTERVAL, SPORTS, SPORT_NAMES, SPORT_LOGOS, MARKETS, MARKET_NAMES, BOOKMAKERS, BOOKMAKER_LOGOS, BOOKMAKER_NAMES } from '@/lib/constants'
import { GreenPulse, RedPulse } from '@/components/Pulse'
import { CircleQuestionMark } from 'lucide-react'

export default function Home() {
  const [bets, setBets] = useState<EVBet[]>([])
  const [meta, setMeta] = useState<Meta>({
    eventsScanned: 0,
    betsFound: 0,
    fetchedAt: new Date().toISOString(),
  })
  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [allEvents, setAllEvents] = useState<OddsEvent[]>([])
  const [selectedGame, setSelectedGame] = useState<{ event: OddsEvent; market: string; point?: number } | null>(null)


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
  const [isLiveFilter, setIsLiveFilter] = useState<Set<string>>(
    new Set(['Live events', 'Future events'])
  )
  const filtered = bets
    .filter(b => b.ev >= minEV / 100)
    .filter(b => sportFilter.has(b.sport_key))
    .filter(b => marketFilter.has(b.market))
    .filter(b => bookFilter.has(b.bookmaker_title))
    .filter(b => {
      const event = allEvents.find(e => e.game_title === b.game_title)
      const isLive = event?.isLive ?? false
      if (isLiveFilter.has('Live events') && isLiveFilter.has('Future events')) return true
      if (isLiveFilter.has('Live events') && isLive) return true
      if (isLiveFilter.has('Future events') && !isLive) return true
      return false
    })

  const deduped = filtered.reduce((acc, bet) => {
    const key = `${bet.game_title}_${bet.market}`
    const existing = acc.find(b => `${b.game_title}_${b.market}` === key)
    if (!existing) acc.push(bet)
    return acc
  }, [] as typeof filtered)


  // Refresh bets
  async function fetchBets() {
    try {
      const res = await fetch('/api/odds')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setBets(data.evBets)
      setMeta(data.meta)
      setAllEvents(data.allEvents ?? [])
    } catch {
      setError('Failed to fetch odds.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const load = async () => { await fetchBets() }
    load()
  }, [])

  // Reset to page 1 whenever a filter changes
  function updateMinEV(value: number) {
    setMinEV(value)
    setPage(1)
  }
  function updateMarketFilter(next: Set<string>) {
    setMarketFilter(next)
    setPage(1)
  }

  const paginated = deduped.slice(0, page * PAGE_SIZE)
  const hasMore = deduped.length > paginated.length

  return (
    <main className="min-h-screen bg-[#03060E] text-gray-100" style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <header className="border-b border-gray-800/60 px-30 py-4">
        <div className="flex flex-row">
          <img src={'/logos/EdgeEagleLogo.png'} className=" h-34" />

          <div className="ml-auto flex items-center gap-4 text-base text-gray-500">
            <div className="flex items-center gap-2">
              <GreenPulse />
              <span>Updated {new Date(meta.fetchedAt).toLocaleTimeString()}</span>
              {/* Uncomment for <span>Refresh in {countdown}s</span> */}
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
              onChange={e => updateMinEV(parseFloat(e.target.value))}
              className="w-28 accent-emerald-400"
            />
            <span className="text-xs font-mono text-emerald-400 w-10">{minEV.toFixed(1)}%</span>
          </div>


          <div className="h-4 w-px bg-gray-800" />

          <Filter
            label="Sports"
            options={SPORTS.map(s => s.key)}
            selected={sportFilter}
            onToggle={value => {
              const next = new Set(sportFilter)
              next.has(value) ? next.delete(value) : next.add(value)
              setSportFilter(next)
            }}
            onToggleAll={allSelected => {
              setSportFilter(allSelected ? new Set() : new Set(SPORTS.map(s => s.key)))
            }}
            names={SPORT_NAMES}
          />

          <Filter
            label="Markets"
            options={MARKETS.map(b => b.key)}
            selected={marketFilter}
            onToggle={value => {
              const next = new Set(marketFilter)
              next.has(value) ? next.delete(value) : next.add(value)
              updateMarketFilter(next)
            }}
            onToggleAll={allSelected => {
              updateMarketFilter(allSelected ? new Set() : new Set(MARKETS.map(b => b.key)))
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
                updateMarketFilter(new Set(MARKETS.map(b => b.key)))
                setSportFilter(new Set(SPORTS.map(b => b.key)))
                updateMinEV(0)
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
                <th className="pb-2 text-xs font-medium text-gray-600 uppercase tracking-wider pr-6">Book Line</th>
                <th className="pb-2 text-xs font-medium text-gray-600 uppercase tracking-wider pr-6">Sharp Line</th>
                <th className="pb-2 text-xs font-medium text-gray-600 tracking-wider ">
                  <div className="flex items-center gap-1.5">
                    <p className='uppercase'>Expected Value</p>
                    <div className="relative group">
                      <CircleQuestionMark className="w-3.5 h-3.5 text-gray-700 cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          <p className="font-semibold text-white mb-2">How EV is calculated</p>

                        <div className="flex gap-2">
                          <span className="text-emerald-400 font-mono shrink-0">1.</span>
                          <span>Pinnacle&apos;s odds are <span className="text-white">devigged</span> — their margin is removed so all outcomes sum to exactly 100%</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-emerald-400 font-mono shrink-0">2.</span>
                          <span>This gives the <span className="text-white">true probability</span> of each outcome, free of bookmaker bias</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-emerald-400 font-mono shrink-0">3.</span>
                          <span>Each book&apos;s odds are compared against that true probability</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-emerald-400 font-mono shrink-0">4.</span>
                          <span>If a book offers better odds than fair value, that&apos;s a <span className="text-emerald-400">+EV bet</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </th>
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
                      <img src={SPORT_LOGOS[bet.sport_key]} alt={bet.sport_title} className=" h-10" />
                      <div className="flex flex-col gap-2">
                        <span className="text-base font-semibold text-white-200">{bet.game_title}</span>
                        <div className="flex flex-row items-center gap-3 text-base font-medium text-gray-400">
                          {bet.sport_title} • {formatGameTime(bet.commence_time)}
                          {allEvents.find(e => e.game_title === bet.game_title)?.isLive && (
                            <RedPulse />
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
            <span suppressHydrationWarning>Last updated {new Date(meta.fetchedAt).toLocaleTimeString()}</span>
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