/**
 * Live clock + greeting helpers for the app shell and Home.
 * Pure functions — safe to unit-test without mounting React.
 */

/** Format a Date as a compact 24h local clock string (HH:MM). */
export function formatClockTime(date: Date = new Date()): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/**
 * Map hour-of-day (0–23) to a time-of-day greeting.
 * Morning: 00–11, Afternoon: 12–16, Evening: 17–23.
 */
export function greetingFromHour(hour: number): string {
  const h = ((Math.floor(hour) % 24) + 24) % 24
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/** Greeting for a given Date (defaults to now). */
export function greetingForDate(date: Date = new Date()): string {
  return greetingFromHour(date.getHours())
}
