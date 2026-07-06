

export type Outcome = {
    name: string // Example: Lakers
    description?: string // Optional because it only exists for props
    price: number // American odds (-110, +240, etc.)
    point?: number // Optional because it only exists for spreads and totals
}

export type Market = {
    key: string
    last_update: string
    outcomes: Outcome[]
}

export type Bookmaker = {
    key: string 
    title: string
    markets: Market[]
}

// Example: Here's an NFL game between X and Y, and here's what every sportsbook is charging for each type of bet."
export type OddsEvent = {
    id: string
    sport_key: string
    sport_title: string
    commence_time: string
    home_team: string
    away_team: string
    game_title: string
    bookmakers: Bookmaker[]
    // Live tracking
    isLive?: boolean
    completed?: boolean
    scores?: { name: string; score: string }[] | null
}

export type EVBet = {
    sport_key: string
    sport_title: string
    commence_time: string
    game_title: string
    market: string
    team: string
    point?: number
    bookmaker_key: string
    bookmaker_title: string
    odds: number
    trueProb: number
    impliedProb: number
    ev: number
    referenceType: 'pinnacle' | 'consensus'
}
