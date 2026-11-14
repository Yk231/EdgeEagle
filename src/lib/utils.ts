// Conversion functions

export function probToAmerican(prob: number): string {
  if (prob <= 0 || prob >= 1) return "0"
  if (prob < 0.5) {
    return formatOdds(Math.round(100 / prob - 100))
  } else {
    return formatOdds(Math.round(-(prob / (1 - prob)) * 100))
  }
}

export function americanToProb(odds: number): string {
  return `${(americanToImplied(odds) * 100).toFixed(1)}%`
}

export function americanToImplied(odds: number): number {
    if (odds > 0) {
        return 100 / (odds + 100)
    } else {
        return Math.abs(odds) / (Math.abs(odds) + 100)
    }
}

// Format functions

export function formatOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`
}

export function formatEV(ev: number): string {
  return `+${(ev * 100).toFixed(1)}%`
}

export function formatGameTime(isoString: string): string {
  const date = new Date(isoString)
  date.setSeconds(0, 0) 
  const now = new Date()

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const gameDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  if (gameDay.getTime() === today.getTime()) {
    return `Today, ${timeStr}`
  } else if (gameDay.getTime() === tomorrow.getTime()) {
    return `Tomorrow, ${timeStr}`
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }
}
