export const PAGE_SIZE = 15

export const REFRESH_INTERVAL = 60

export type Sport = {
  title: string
  key: string
  logo: string
  active: boolean
  additionalMarkets?: string
}

// ─────────────────────────────────────────────
//
// Set active to TRUE for any leagues you want to scan
// 
// ─────────────────────────────────────────────
export const SPORTS: Sport[] = [
  // ─────────────────────────────────────────────
  // NCAAF
  // ─────────────────────────────────────────────
  {
    title: 'American Football NCAAF',
    key: 'americanfootball_ncaaf',
    logo: '/logos/ncaaf.png',
    active: true,
    additionalMarkets: 'h2h_q1,h2h_h1,totals_q1,totals_h1,team_totals_q1,team_totals_h1'
  },
  {
    title: 'American Football NCAAF FCS',
    key: 'americanfootball_ncaaf_fcs',
    logo: '/logos/ncaaf.png',
    active: false,
    additionalMarkets: 'h2h_q1,h2h_h1,totals_q1,totals_h1,team_totals_q1,team_totals_h1'
  },

  // ─────────────────────────────────────────────
  // COLLEGE BASKETBALL
  // ─────────────────────────────────────────────
  {
    title: 'Basketball NCAAB',
    key: 'basketball_ncaab',
    logo: '/logos/ncaab.png',
    active: false
  },
  {
    title: 'Basketball WNCAAB',
    key: 'basketball_wncaab',
    logo: '/logos/ncaab.png',
    active: false
  },

  // ─────────────────────────────────────────────
  // MMA
  // ─────────────────────────────────────────────
  {
    title: 'Mixed Martial Arts MMA',
    key: 'mma_mixed_martial_arts',
    logo: '/logos/mma.svg',
    active: false
  },

  // ─────────────────────────────────────────────
  // NBA/WBNA
  // ─────────────────────────────────────────────
  {
    title: 'NBA',
    key: 'basketball_nba',
    logo: '/logos/NBA.png',
    active: false
  },
  {
    title: 'WNBA',
    key: 'basketball_wnba',
    logo: '/logos/wnba.svg',
    active: false
  },

  // ─────────────────────────────────────────────
  // NFL
  // ─────────────────────────────────────────────
  {
    title: 'NFL',
    key: 'americanfootball_nfl',
    logo: '/logos/nfl.svg',
    active: false,
    additionalMarkets: 'h2h_q1,h2h_h1,totals_q1,totals_h1,team_totals_q1,team_totals_h1'
  },

  // ─────────────────────────────────────────────
  // Baseball
  // ─────────────────────────────────────────────
  {
    title: 'MLB',
    key: 'baseball_mlb',
    logo: '/logos/mlb.svg',
    active: false
  },
  {
    title: 'NPB',
    key: 'baseball_npb',
    logo: '/logos/npb.svg',
    active: false
  },
  {
    title: 'KBO',
    key: 'baseball_kbo',
    logo: '/logos/mlb.svg',
    active: false
  },
  {
    title: 'NCAA Baseball',
    key: 'baseball_ncaa',
    logo: '/logos/ncaabaseball.svg',
    active: false
  },

  // ─────────────────────────────────────────────
  // SOCCER — SMALLER / SECONDARY LEAGUES
  // ─────────────────────────────────────────────
  {
    title: 'Soccer Primera División - Argentina',
    key: 'soccer_argentina_primera_division',
    logo: '/logos/soccer-argentina.png',
    active: false
  },
  {
    title: 'La Liga - Spain',
    key: 'soccer_spain_la_liga',
    logo: '/logos/soccer-laliga-spain.png',
    active: false,
    additionalMarkets: 'h2h_h1,alternate_totals_corners,alternate_team_totals_corners,btts,btts_h1'
  },
  {
    title: 'Soccer A-League',
    key: 'soccer_australia_aleague',
    logo: '/logos/a-league.webp',
    active: false
  },
  {
    title: 'Soccer Austrian Football Bundesliga',
    key: 'soccer_austria_bundesliga',
    logo: '/logos/austria-bundesliga.png',
    active: false
  },
  {
    title: 'Soccer Belgium First Div',
    key: 'soccer_belgium_first_div',
    logo: '/logos/belgium.png',
    active: false
  },
  {
    title: 'Soccer Brazil Série A',
    key: 'soccer_brazil_campeonato',
    logo: '/logos/brazil.png',
    active: false
  },
  {
    title: 'Soccer Brazil Série B',
    key: 'soccer_brazil_serie_b',
    logo: '/logos/brazil.png',
    active: false
  },
  {
    title: 'Soccer Primera División - Chile',
    key: 'soccer_chile_campeonato',
    logo: '/logos/chile.png',
    active: false
  },
  {
    title: 'Soccer Super League - China',
    key: 'soccer_china_superleague',
    logo: '/logos/china.png',
    active: false
  },
  {
    title: 'Soccer Denmark Superliga',
    key: 'soccer_denmark_superliga',
    logo: '/logos/denmark.png',
    active: false
  },
  {
    title: 'Soccer Championship',
    key: 'soccer_efl_champ',
    logo: '/logos/efl.png',
    active: false
  },
  {
    title: 'Soccer League 1',
    key: 'soccer_england_league1',
    logo: '/logos/efl.png',
    active: false
  },
  {
    title: 'Soccer League 2',
    key: 'soccer_england_league2',
    logo: '/logos/efl.png',
    active: false
  },
  {
    title: 'Soccer Veikkausliiga - Finland',
    key: 'soccer_finland_veikkausliiga',
    logo: '/logos/finland.png',
    active: false
  },
  {
    title: 'Soccer Ligue 2 - France',
    key: 'soccer_france_ligue_two',
    logo: '/logos/ligue2.png',
    active: false
  },
  {
    title: 'Soccer Bundesliga 2 - Germany',
    key: 'soccer_germany_bundesliga2',
    logo: '/logos/bundesliga2.png',
    active: false
  },
  {
    title: 'Soccer Frauen-Bundesliga',
    key: 'soccer_germany_bundesliga_women',
    logo: '/logos/bundesliga.png',
    active: false
  },
  {
    title: 'Soccer 3. Liga - Germany',
    key: 'soccer_germany_liga3',
    logo: '/logos/germany.png',
    active: false
  },
  {
    title: 'Soccer Super League - Greece',
    key: 'soccer_greece_super_league',
    logo: '/logos/greece.png',
    active: false
  },
  {
    title: 'Soccer Serie B - Italy',
    key: 'soccer_italy_serie_b',
    logo: '/logos/serie-b.png',
    active: false
  },
  {
    title: 'Soccer J League',
    key: 'soccer_japan_j_league',
    logo: '/logos/j-league.png',
    active: false
  },
  {
    title: 'Soccer K League 1',
    key: 'soccer_korea_kleague1',
    logo: '/logos/k-league.png',
    active: false
  },
  {
    title: 'Soccer League of Ireland',
    key: 'soccer_league_of_ireland',
    logo: '/logos/ireland.png',
    active: false
  },
  {
    title: 'Soccer Liga MX',
    key: 'soccer_mexico_ligamx',
    logo: '/logos/liga-mx.png',
    active: false
  },
  {
    title: 'Soccer Dutch Eredivisie',
    key: 'soccer_netherlands_eredivisie',
    logo: '/logos/eredivisie.png',
    active: false
  },
  {
    title: 'Soccer Eliteserien - Norway',
    key: 'soccer_norway_eliteserien',
    logo: '/logos/norway.png',
    active: false
  },
  {
    title: 'Soccer Ekstraklasa - Poland',
    key: 'soccer_poland_ekstraklasa',
    logo: '/logos/poland.png',
    active: false
  },
  {
    title: 'Soccer Primeira Liga - Portugal',
    key: 'soccer_portugal_primeira_liga',
    logo: '/logos/portugal.png',
    active: false
  },
  {
    title: 'Soccer Premiership - Scotland',
    key: 'soccer_spl',
    logo: '/logos/scotland.png',
    active: false
  },
  {
    title: 'Soccer Allsvenskan - Sweden',
    key: 'soccer_sweden_allsvenskan',
    logo: '/logos/sweden.png',
    active: false
  },
  {
    title: 'Soccer Superettan - Sweden',
    key: 'soccer_sweden_superettan',
    logo: '/logos/sweden.png',
    active: false
  },
  {
    title: 'Soccer Swiss Superleague',
    key: 'soccer_switzerland_superleague',
    logo: '/logos/switzerland.png',
    active: false
  },
  {
    title: 'Soccer Turkey Super League',
    key: 'soccer_turkey_super_league',
    logo: '/logos/turkey.png',
    active: false
  },
  {
    title: 'Soccer MLS',
    key: 'soccer_usa_mls',
    logo: '/logos/mls.png',
    active: false
  },

  // ─────────────────────────────────────────────
  // ATP TENNIS
  // ─────────────────────────────────────────────
  {
    title: 'Tennis ATP Australian Open',
    key: 'tennis_atp_aus_open_singles',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP Barcelona Open',
    key: 'tennis_atp_barcelona_open',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP Canadian Open',
    key: 'tennis_atp_canadian_open',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP China Open',
    key: 'tennis_atp_china_open',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP Cincinnati Open',
    key: 'tennis_atp_cincinnati_open',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP Dubai Championships',
    key: 'tennis_atp_dubai',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP French Open',
    key: 'tennis_atp_french_open',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP Hamburg Open',
    key: 'tennis_atp_hamburg_open',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP Halle Open',
    key: 'tennis_atp_halle_open',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP Indian Wells',
    key: 'tennis_atp_indian_wells',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP Italian Open',
    key: 'tennis_atp_italian_open',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP Madrid Open',
    key: 'tennis_atp_madrid_open',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP Miami Open',
    key: 'tennis_atp_miami_open',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP Monte-Carlo Masters',
    key: 'tennis_atp_monte_carlo_masters',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP Munich',
    key: 'tennis_atp_munich',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP Paris Masters',
    key: 'tennis_atp_paris_masters',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP Qatar Open',
    key: 'tennis_atp_qatar_open',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: "Tennis ATP Queen's Club Championships",
    key: 'tennis_atp_queens_club_champ',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP Shanghai Masters',
    key: 'tennis_atp_shanghai_masters',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP US Open',
    key: 'tennis_atp_us_open',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP Washington Open',
    key: 'tennis_atp_washington_open',
    logo: '/logos/atp.png',
    active: false
  },
  {
    title: 'Tennis ATP Wimbledon',
    key: 'tennis_atp_wimbledon',
    logo: '/logos/atp.png',
    active: false
  },

  // ─────────────────────────────────────────────
  // WTA TENNIS
  // ─────────────────────────────────────────────
  {
    title: 'Tennis WTA Australian Open',
    key: 'tennis_wta_aus_open_singles',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA Bad Homburg Open',
    key: 'tennis_wta_bad_homburg_open',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA Canadian Open',
    key: 'tennis_wta_canadian_open',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA Charleston Open',
    key: 'tennis_wta_charleston_open',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA China Open',
    key: 'tennis_wta_china_open',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA Cincinnati Open',
    key: 'tennis_wta_cincinnati_open',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA Dubai Championships',
    key: 'tennis_wta_dubai',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA French Open',
    key: 'tennis_wta_french_open',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA German Open',
    key: 'tennis_wta_german_open',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA Guadalajara Open',
    key: 'tennis_wta_guadalajara_open',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA Indian Wells',
    key: 'tennis_wta_indian_wells',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA Italian Open',
    key: 'tennis_wta_italian_open',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA Madrid Open',
    key: 'tennis_wta_madrid_open',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA Miami Open',
    key: 'tennis_wta_miami_open',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA Monterrey Open',
    key: 'tennis_wta_monterrey_open',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA Qatar Open',
    key: 'tennis_wta_qatar_open',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: "Tennis WTA Queen's Club Championships",
    key: 'tennis_wta_queens_club_champ',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA Internationaux de Strasbourg',
    key: 'tennis_wta_strasbourg',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA Stuttgart Open',
    key: 'tennis_wta_stuttgart_open',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA US Open',
    key: 'tennis_wta_us_open',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA Washington Open',
    key: 'tennis_wta_washington_open',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA Wimbledon',
    key: 'tennis_wta_wimbledon',
    logo: '/logos/wta.png',
    active: false
  },
  {
    title: 'Tennis WTA Wuhan Open',
    key: 'tennis_wta_wuhan_open',
    logo: '/logos/wta.png',
    active: false
  }
];

export const SPORT_LOGOS: Record<string, string> = Object.fromEntries(
  SPORTS.map(s => [s.key, s.logo])
)
export const SPORT_NAMES: Record<string, string> = Object.fromEntries(
  SPORTS.map(s => [s.key, s.title])
)
export const SPORT_ADDITIONAL_MARKETS: Record<string, string | undefined> = Object.fromEntries(
  SPORTS.map(s => [s.key, s.additionalMarkets])
)

export const MARKETS = [
  { key: 'h2h', name: 'Moneyline' },
  { key: 'spreads', name: 'Spread' },
  { key: 'totals', name: 'Total' },
]

export const MARKET_NAMES: Record<string, string> = Object.fromEntries(
  MARKETS.map(m => [m.key, m.name])
)

export const BOOKMAKERS = [
  
  /*
  // ─── US ───────────────────────────────────────────────────────────────────
  { key: 'draftkings',    name: 'DraftKings',    logo: '/logos/DraftKings.png' },
  { key: 'fanduel',       name: 'FanDuel',       logo: '/logos/Fanduel.png' },
  { key: 'betmgm',        name: 'BetMGM',        logo: '/logos/betMGM.jpeg' },
  { key: 'betrivers',     name: 'BetRivers',     logo: '/logos/BetRivers.jpeg' },
  { key: 'bovada',        name: 'Bovada',        logo: '/logos/Bovada.webp' },
  { key: 'betonlineag',   name: 'BetOnline',     logo: '/logos/BetOnline.webp' },
  { key: 'betus',         name: 'BetUS',         logo: '/logos/BetUS.jpeg' },
  { key: 'mybookieag',    name: 'MyBookie',      logo: '/logos/MyBookie.jpeg' },
  { key: 'lowvig',        name: 'LowVig',        logo: '/logos/LowVig.jpeg' },
  { key: 'fanatics',      name: 'Fanatics',      logo: '/logos/Fanatics.png' },
  { key: 'williamhill_us',name: 'Caesars',       logo: '/logos/Caesars.jpeg' },

  // ─── US2 ──────────────────────────────────────────────────────────────────
  { key: 'ballybet',      name: 'BallyBet',      logo: '/logos/BallyBet.jpeg' },
  { key: 'betparx',       name: 'BetPARX',       logo: '/logos/betPARX.png' },
  { key: 'espnbet',       name: 'theScore Bet',  logo: '/logos/theScoreBet.jpeg' },
  { key: 'fliff',         name: 'Fliff',         logo: '/logos/Fliff.jpeg' },
  { key: 'hardrockbet',   name: 'Hard Rock Bet', logo: '/logos/HardRockBet.jpeg' },
  { key: 'rebet',         name: 'ReBet',         logo: '/logos/ReBet.png' },
  */

  // ─── US_EX (exchanges) ────────────────────────────────────────────────────
  { key: 'betopenly',     name: 'BetOpenly',     logo: '/logos/BetOpenly.png' },
  { key: 'kalshi',        name: 'Kalshi',        logo: '/logos/Kalshi.jpeg' },
  { key: 'novig',         name: 'Novig',         logo: '/logos/Novig.jpeg' },
  { key: 'polymarket',    name: 'Polymarket',    logo: '/logos/Polymarket.png' },
  { key: 'prophetx',      name: 'ProphetX',      logo: '/logos/ProphetX.png' },

  // ─── EU ───────────────────────────────────────────────────────────────────
  { key: 'pinnacle',      name: 'Pinnacle',      logo: '/logos/Pinnacle.png' },
]


export const BOOKMAKER_LOGOS: Record<string, string> = 
  Object.fromEntries(BOOKMAKERS.map(b => [b.key, b.logo]))
export const BOOKMAKER_NAMES: Record<string, string> = 
  Object.fromEntries(BOOKMAKERS.map(b => [b.key, b.name]))