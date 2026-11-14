

// After a singular event is analyzed, if it is found to be +EV it is returned in this format
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
}

// An API request's metadata
export type Meta = {
  eventsScanned: number
  betsFound: number
  fetchedAt: string
}

// --------------------------------------------------------------------------------

// The following objects are structed based on the format of the API's response:

// A particular bet outcome
// E.g. LA Lakers, -110, +10.5 spread
export type Outcome = {
    name: string
    description?: string
    price: number
    point?: number
}

// A particular market and all outcomes for it
// E.g. h2h, and an array of all h2h outcomes across all sports
export type Market = {
    key: string
    last_update: string
    outcomes: Outcome[]
}

// A particular bookmaker and all offered markets
// E.g. draftkings, DraftKings, and all its offered markets
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
