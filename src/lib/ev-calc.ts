import { OddsEvent, Outcome, EVBet } from '@/types/bets'
import { median, americanToImplied } from './utils'

export function devig(outcomes: Outcome[]): Record<string, number> {
    const total = outcomes.reduce((sum, o) => sum + americanToImplied(o.price), 0)
    return Object.fromEntries(
        outcomes.map(o => [o.name, americanToImplied(o.price) / total])
    )
}

export function calculateEV(trueProb: number, odds: number): number {
    const potentialProfit = odds > 0 ? odds / 100 : 100 / Math.abs(odds)
    return (trueProb * potentialProfit) - ((1 - trueProb) * 1)
}

export function calculateMedian(event: OddsEvent, marketKey: string, minBooks: number = 4): Record<string, number> | null {
    
    const probAccumulator: Record<string, number[]> = {}

    for (const book of event.bookmakers) {
        const market = book.markets.find(m => m.key === marketKey)
        if (!market) continue
        const devigged = devig(market.outcomes)

        for (const [name, prob] of Object.entries(devigged)) {
            if (!probAccumulator[name]) probAccumulator[name] = []
            probAccumulator[name].push(prob)
        }
    }

    const names = Object.keys(probAccumulator)
    if (names.length < minBooks) return null 
    for (const n of names) {
        if (probAccumulator[n].length < minBooks) return null
    }

    return Object.fromEntries(
        names.map(n => [n, median(probAccumulator[n])])
    )
}

export function findEVBets(event: OddsEvent): EVBet[] {
    const results: EVBet[] = []

    const pinnacle = event.bookmakers.find(b => b.key === 'pinnacle')

    const allMarketKeys = new Set<string>()
    for (const book of event.bookmakers) {
        for (const market of book.markets) {
            allMarketKeys.add(market.key)
        }
    }

    if (!pinnacle) return results

    for (const pinnacleMarket of pinnacle.markets) {
        const isH2H = pinnacleMarket.key.startsWith('h2h')

        // Key by name+point for spreads/totals so we only compare same lines
        const devigged = devig(pinnacleMarket.outcomes)
        const trueProbMap: Record<string, number> = {}
        for (const o of pinnacleMarket.outcomes) {
            const key = isH2H ? o.name : `${o.name}_${o.point}`
            trueProbMap[key] = devigged[o.name]
        }

        for (const bookmaker of event.bookmakers) {
            if (bookmaker.key === 'pinnacle') continue

            const market = bookmaker.markets.find(m => m.key === pinnacleMarket.key)
            if (!market) continue

            for (const outcome of market.outcomes) {
                const key = isH2H ? outcome.name : `${outcome.name}_${outcome.point}`
                const trueProb = trueProbMap[key]
                if (trueProb === undefined) continue

                const impliedProb = americanToImplied(outcome.price)
                const ev = calculateEV(trueProb, outcome.price)

                if (ev > 0) {
                    results.push({
                        sport_key: event.sport_key,
                        sport_title: event.sport_title,
                        commence_time: event.commence_time,
                        game_title: `${event.away_team} vs. ${event.home_team}`,
                        market: pinnacleMarket.key,
                        team: outcome.name,
                        point: outcome.point,
                        bookmaker_key: bookmaker.key,
                        bookmaker_title: bookmaker.title,
                        odds: outcome.price,
                        trueProb,
                        impliedProb,
                        ev,
                        referenceType: 'pinnacle'
                    })
                }
            }
        }
    }

    return results
}