import { OddsEvent } from '@/types/bets'

const API_KEY = process.env.ODDS_API_KEY
const BASE_URL = 'https://api.the-odds-api.com/v4'

const SPORTS = [
  //'americanfootball_nfl',
  //'basketball_nba',
  'baseball_mlb',
  //'icehockey_nhl',
  //'basketball_wnba',
  //'americanfootball_ncaafb',
  'soccer_fifa_world_cup'
]

const SPORT_MARKETS: Record<string, string> = {
    baseball_mlb: [
        'h2h', 'spreads', 'totals',
        /*'h2h_1st_1_innings', h2h_1st_3_innings', 'h2h_1st_5_innings', 'h2h_1st_7_innings',
        'spreads_1st_1_innings', 'spreads_1st_3_innings', 'spreads_1st_5_innings', 'spreads_1st_7_innings',
        'totals_1st_1_innings', 'totals_1st_3_innings', 'totals_1st_5_innings', 'totals_1st_7_innings',
        */
        ].join(','),

    icehockey_nhl: [
        'h2h', 'spreads', 'totals',
        'h2h_p1', 'h2h_p2', 'h2h_p3',
        'h2h_3_way_p1', 'h2h_3_way_p2', 'h2h_3_way_p3',
        'spreads_p1', 'spreads_p2', 'spreads_p3',
        'totals_p1', 'totals_p2', 'totals_p3',
    ].join(','),

    americanfootball_nfl: [
        'h2h', 'spreads', 'totals',
        'h2h_h1', 'h2h_h2',
        'spreads_h1', 'spreads_h2',
        'totals_h1', 'totals_h2',
        'h2h_q1', 'h2h_q2', 'h2h_q3', 'h2h_q4',
        'spreads_q1', 'spreads_q2', 'spreads_q3', 'spreads_q4',
        'totals_q1', 'totals_q2', 'totals_q3', 'totals_q4',
    ].join(','),

    basketball_nba: [
        'h2h', 'spreads', 'totals',
        'h2h_h1', 'h2h_h2',
        'spreads_h1', 'spreads_h2',
        'totals_h1', 'totals_h2',
        'h2h_q1', 'h2h_q2', 'h2h_q3', 'h2h_q4',
        'spreads_q1', 'spreads_q2', 'spreads_q3', 'spreads_q4',
        'totals_q1', 'totals_q2', 'totals_q3', 'totals_q4',
    ].join(','),

    basketball_wnba: [
        'h2h', 'spreads', 'totals',
        'h2h_h1', 'h2h_h2',
        'spreads_h1', 'spreads_h2',
        'totals_h1', 'totals_h2',
        'h2h_q1', 'h2h_q2', 'h2h_q3', 'h2h_q4',
        'spreads_q1', 'spreads_q2', 'spreads_q3', 'spreads_q4',
        'totals_q1', 'totals_q2', 'totals_q3', 'totals_q4',
    ].join(','),

    americanfootball_ncaafb: [
        'h2h', 'spreads', 'totals',
        'h2h_h1', 'h2h_h2',
        'spreads_h1', 'spreads_h2',
        'totals_h1', 'totals_h2',
        'h2h_q1', 'h2h_q2', 'h2h_q3', 'h2h_q4',
        'spreads_q1', 'spreads_q2', 'spreads_q3', 'spreads_q4',
        'totals_q1', 'totals_q2', 'totals_q3', 'totals_q4',
    ].join(','),

    soccer_fifa_world_cup: [
        'h2h', 'spreads', 'totals',
        //'h2h_h1', 'h2h_h2',
        //'totals_h1', 'totals_h2',
    ].join(','),
}

const BOOKS = [
    /*
    'draftkings',
    'fanduel',
    'betmgm',
    'betrivers',
    'bovada',
    'betonlineag',
    'betus',
    'mybookieag',
    'lowvig',
    'ballybet',
    'betparx',
    'espnbet',
    'fliff',
    'hardrockbet',
    'betopenly',
    */
    'kalshi',
    'novig',
    'polymarket',
    'prophetx',
].join(',')

export async function getOdds(sport: string): Promise<OddsEvent[]> {

    const markets = SPORT_MARKETS[sport] ?? 'h2h,spreads,totals'

    const [pinnacleRes, usRes] = await Promise.all([
        fetch(
            `${BASE_URL}/sports/${sport}/odds?apiKey=${API_KEY}&regions=eu&markets=${markets}&bookmakers=pinnacle&oddsFormat=american`,
        ),
        fetch(
            `${BASE_URL}/sports/${sport}/odds?apiKey=${API_KEY}&regions=us,us_ex&markets=${markets}&bookmakers=${BOOKS}&oddsFormat=american`,
        ),
    ])

    if (!pinnacleRes.ok || !usRes.ok) {
        throw new Error(`Failed to fetch odds for ${sport}`)
    }

    const [pinnacleEvents, usEvents]: [OddsEvent[], OddsEvent[]] = 
        await Promise.all([pinnacleRes.json(), usRes.json()])

    // Merge by event id — add Pinnacle bookmaker into each matching US event
    const usEventMap = new Map(usEvents.map(e => [e.id, e]))
    for (const pinnacleEvent of pinnacleEvents) {
        const usEvent = usEventMap.get(pinnacleEvent.id)
        if (usEvent && pinnacleEvent.bookmakers.length > 0) {
            usEvent.bookmakers.push(...pinnacleEvent.bookmakers)
        }
    }

    return usEvents
}

export async function getAllOdds(): Promise<OddsEvent[]> {
    const results = await Promise.all(SPORTS.map(sport => getOdds(sport)))
    return results.flat()
}