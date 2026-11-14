import { Market } from "@/types/bets"

export function PieChart({ probs, labels, colors, centerLabel }: {
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

  const slices = probs.map((prob, i) => {
    const before = probs.slice(0, i).reduce((sum, p) => sum + p, 0)
    return {
        arc: circumference * prob,
        offset: circumference * before,
        color: colors[i], prob, label: labels[i],
    }
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


type pieConfigProps = {
    market: string,
    point?: number,
    favorite: string,
    underdog: string,
    favProb: number, 
    dogProb: number, 
    pinnacleMarket?: Market,
    pinnacleProbs: Record<string, number>,
    hasDraw: boolean,
    drawProb: number,
  };

  
export function getPieConfig({market, point, favorite, favProb, underdog, dogProb, pinnacleMarket, pinnacleProbs, hasDraw, drawProb}: pieConfigProps) {
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
        probs: [favProb, drawProb, dogProb],
        labels: [favorite, 'Draw', underdog],
        colors: ['#1D4ED8', '#9CA3AF', '#F97316'],
        centerLabel: 'WIN PROB',
      }
    }


    // Default: return h2h 2way
    return {
      probs: [favProb, dogProb],
      labels: [favorite, underdog],
      colors: ['#1D4ED8', '#F97316'],
      centerLabel: 'WIN PROB',
    }

  }