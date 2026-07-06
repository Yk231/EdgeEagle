export const PAGE_SIZE = 15

export const REFRESH_INTERVAL = 60

export const SPORTS = [
  { key: 'MLB', logo: '/logos/mlb.png' },
  { key: 'NBA', logo: '/logos/nba.png' },
  { key: 'NFL', logo: '/logos/nfl.png' },
  { key: 'NHL', logo: '/logos/nhl.png' },
  { key: 'WNBA', logo: '/logos/wnba.png' },
  { key: 'NCAAF', logo: '/logos/ncaaf.png' },
  { key: 'FIFA World Cup', logo: '/logos/fifa.png' },
]
export const SPORT_LOGOS: Record<string, string> = Object.fromEntries(
  SPORTS.map(s => [s.key, s.logo])
)

export const MARKETS = [
  // Standard markets
  { key: 'h2h', name: 'Moneyline' },
  { key: 'spreads', name: 'Spread' },
  { key: 'totals', name: 'Total' },

  // By period
  { key: 'h2h_h1', name: '1st Half ML' },
  { key: 'h2h_h2', name: '2nd Half ML' },
  { key: 'spreads_h1', name: '1st Half Spread' },
  { key: 'spreads_h2', name: '2nd Half Spread' },
  { key: 'totals_h1', name: '1st Half Total' },
  { key: 'totals_h2', name: '2nd Half Total' },
  { key: 'h2h_q1', name: '1st Qtr ML' },
  { key: 'h2h_q2', name: '2nd Qtr ML' },
  { key: 'h2h_q3', name: '3rd Qtr ML' },
  { key: 'h2h_q4', name: '4th Qtr ML' },
  { key: 'spreads_q1', name: '1st Qtr Spread' },
  { key: 'spreads_q2', name: '2nd Qtr Spread' },
  { key: 'spreads_q3', name: '3rd Qtr Spread' },
  { key: 'spreads_q4', name: '4th Qtr Spread' },
  { key: 'totals_q1', name: '1st Qtr Total' },
  { key: 'totals_q2', name: '2nd Qtr Total' },
  { key: 'totals_q3', name: '3rd Qtr Total' },
  { key: 'totals_q4', name: '4th Qtr Total' },
  { key: 'team_totals_h1', name: '1st Half Team Total' },
  { key: 'team_totals_h2', name: '2nd Half Team Total' },
  { key: 'team_totals_q1', name: '1st Qtr Team Total' },
  { key: 'team_totals_q2', name: '2nd Qtr Team Total' },
  { key: 'team_totals_q3', name: '3rd Qtr Team Total' },
  { key: 'team_totals_q4', name: '4th Qtr Team Total' },

  // Only valid for hockey
  { key: 'h2h_p1', name: '1st Period ML' },
  { key: 'h2h_p2', name: '2nd Period ML' },
  { key: 'h2h_p3', name: '3rd Period ML' },
  { key: 'spreads_p1', name: '1st Period Spread' },
  { key: 'spreads_p2', name: '2nd Period Spread' },
  { key: 'spreads_p3', name: '3rd Period Spread' },
  { key: 'totals_p1', name: '1st Period Total' },
  { key: 'totals_p2', name: '2nd Period Total' },
  { key: 'totals_p3', name: '3rd Period Total' },
  { key: 'team_totals_p1', name: '1st Period Team Total' },
  { key: 'team_totals_p2', name: '2nd Period Team Total' },
  { key: 'team_totals_p3', name: '3rd Period Team Total' },
  
  // Only valid for baseball
  { key: 'h2h_1st_1_innings', name: '1st Inning ML' },
  { key: 'h2h_1st_3_innings', name: '1st 3 Innings ML' },
  { key: 'h2h_1st_5_innings', name: '1st 5 Innings ML' },
  { key: 'h2h_1st_7_innings', name: '1st 7 Innings ML' },
  { key: 'spreads_1st_1_innings', name: '1st Inning Spread' },
  { key: 'spreads_1st_3_innings', name: '1st 3 Innings Spread' },
  { key: 'spreads_1st_5_innings', name: '1st 5 Innings Spread' },
  { key: 'spreads_1st_7_innings', name: '1st 7 Innings Spread' },
  { key: 'totals_1st_1_innings', name: '1st Inning Total' },
  { key: 'totals_1st_3_innings', name: '1st 3 Innings Total' },
  { key: 'totals_1st_5_innings', name: '1st 5 Innings Total' },
  { key: 'totals_1st_7_innings', name: '1st 7 Innings Total' },

  // 3-Way markets
  { key: 'h2h_3_way_p1', name: '1st Period 3-Way ML' }, 
  { key: 'h2h_3_way_p2', name: '2nd Period 3-Way ML' },
  { key: 'h2h_3_way_p3', name: '3rd Period 3-Way ML' },
  { key: 'h2h_3_way_q1', name: '1st Quarter 3-Way ML' },
  { key: 'h2h_3_way_q2', name: '2nd Quarter 3-Way ML' },
  { key: 'h2h_3_way_q3', name: '3rd Quarter 3-Way ML' },
  { key: 'h2h_3_way_q4', name: '4th Quarter 3-Way ML' },
  { key: 'h2h_3_way_h1', name: '1st Half 3-Way ML' },
  { key: 'h2h_3_way_h2', name: '2nd Half 3-Way ML' },
  { key: 'h2h_3_way_1st_1_innings', name: '1st Inning3-Way ML' },
  { key: 'h2h_3_way_1st_3_innings', name: '1st 3 Innings 3-Way ML' },
  { key: 'h2h_3_way_1st_5_innings', name: '1st 5 Innings 3-Way ML' },
  { key: 'h2h_3_way_1st_7_innings', name: '1st 7 Innings 3-Way ML' },

]
export const MARKET_NAMES: Record<string, string> = Object.fromEntries(
  MARKETS.map(m => [m.key, m.name])
)

export const BOOKMAKERS = [
  { key: 'betonlineag', name: 'BetOnline', logo: '/logos/BetOnline.webp' },
  { key: 'betmgm', name: 'BetMGM', logo: '/logos/betMGM.jpeg' },
  { key: 'betrivers', name: 'BetRivers', logo: '/logos/BetRivers.jpeg' },
  { key: 'betus', name: 'BetUS', logo: '/logos/BetUS.jpeg' },
  { key: 'bovada', name: 'Bovada', logo: '/logos/Bovada.webp' },
  { key: 'draftkings', name: 'DraftKings', logo: '/logos/DraftKings.png' },
  { key: 'fanduel', name: 'FanDuel', logo: '/logos/Fanduel.png' },
  { key: 'lowvig', name: 'LowVig', logo: '/logos/LowVig.jpeg' },
  { key: 'mybookieag', name: 'MyBookie', logo: '/logos/MyBookie.jpeg' },
  { key: 'ballybet', name: 'BallyBet', logo: '/logos/BallyBet.jpeg' },
  { key: 'betanysports', name: 'BetAnything', logo: '/logos/BetAnything.jpeg' },
  { key: 'betparx', name: 'BetPARX', logo: '/logos/betPARX.png' },
  { key: 'espnbet', name: 'theScoreBet', logo: '/logos/theScoreBet.jpeg' },
  { key: 'fliff', name: 'Fliff', logo: '/logos/Fliff.jpeg' },
  { key: 'hardrockbet', name: 'Hard Rock Bet', logo: '/logos/HardRockBet.jpeg' },
  { key: 'betopenly', name: 'BetOpenly', logo: '/logos/BetOpenly.png' },
  { key: 'kalshi', name: 'Kalshi', logo: '/logos/Kalshi.jpeg' },
  { key: 'novig', name: 'Novig', logo: '/logos/Novig.jpeg' },
  { key: 'polymarket', name: 'Polymarket', logo: '/logos/Polymarket.png' },
  { key: 'prophetx', name: 'ProphetX', logo: '/logos/ProphetX.png' },
  { key: 'rebet', name: 'ReBet', logo: '/logos/ReBet.png' },
  { key: 'williamhill_us', name: 'Ceasers', logo: '/logos/Ceasers.png' },
  { key: 'fanatics', name: 'Fanatics', logo: '/logos/Fanatics.png' },
  { key: 'pinnacle', name: 'Pinnacle', logo: '/logos/Pinnacle.png' },
]
export const BOOKMAKER_LOGOS: Record<string, string> = 
  Object.fromEntries(BOOKMAKERS.map(b => [b.key, b.logo]))
export const BOOKMAKER_NAMES: Record<string, string> = 
  Object.fromEntries(BOOKMAKERS.map(b => [b.key, b.name]))