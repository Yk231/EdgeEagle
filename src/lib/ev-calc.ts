import { OddsEvent, Outcome, EVBet } from '@/types/bets'
import { americanToImplied } from './utils'

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

// Key an outcome by name + line so different spreads/totals across books don't get mixed
function outcomeKey(o: Outcome, isH2H: boolean): string {
    return isH2H ? o.name : `${o.name}_${o.point}`
}

export function findEVBets(event: OddsEvent): EVBet[] {
    const results: EVBet[] = []

    //Find pinnacle
    const pinnacle = event.bookmakers.find(b => b.key === 'pinnacle')
    if (!pinnacle) return results

    // Make a set of all market keys
    const allMarketKeys = new Set<string>()
    for (const book of event.bookmakers) {
        for (const market of book.markets) {
            allMarketKeys.add(market.key)
        }
    }

    for (const marketKey of allMarketKeys) {
        const isH2H = marketKey.startsWith('h2h')

        // Pinnacle is the only reference. Skip markets it doesn't price.
        const pinnacleMarket = pinnacle?.markets.find(m => m.key === marketKey)
        if (!pinnacleMarket || pinnacleMarket.outcomes.length === 0) continue

        const trueProbMap: Record<string, number> = {}
        const devigged = devig(pinnacleMarket.outcomes)
        for (const o of pinnacleMarket.outcomes) {
            trueProbMap[outcomeKey(o, isH2H)] = devigged[o.name]
        }

        // Loop all non-Pinnacle books for this market
        for (const bookmaker of event.bookmakers) {
            if (bookmaker.key === 'pinnacle') continue

            const market = bookmaker.markets.find(m => m.key === marketKey)
            if (!market) continue

            for (const outcome of market.outcomes) {
                const trueProb = trueProbMap[outcomeKey(outcome, isH2H)]
                if (trueProb === undefined) continue

                const impliedProb = americanToImplied(outcome.price)
                const ev = calculateEV(trueProb, outcome.price)

                if (ev > 0) {
                    results.push({
                        sport_key: event.sport_key,
                        sport_title: event.sport_title,
                        commence_time: event.commence_time,
                        game_title: `${event.away_team} vs. ${event.home_team}`,
                        market: marketKey,
                        team: outcome.name,
                        point: outcome.point,
                        bookmaker_key: bookmaker.key,
                        bookmaker_title: bookmaker.title,
                        odds: outcome.price,
                        trueProb,
                        impliedProb,
                        ev
                    })
                }
            }
        }
    }

    return results
}
