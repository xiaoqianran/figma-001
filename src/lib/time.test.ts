/**
 * Unit tests for shipped time helpers (src/lib/time.ts).
 * Run: npm test  (node --experimental-strip-types --test)
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { formatClockTime, greetingFromHour, greetingForDate } from './time.ts'

describe('formatClockTime', () => {
  it('pads hours and minutes to HH:MM', () => {
    const d = new Date(2026, 0, 1, 9, 5, 0)
    assert.equal(formatClockTime(d), '09:05')
  })

  it('formats afternoon times in 24h', () => {
    const d = new Date(2026, 0, 1, 14, 41, 0)
    assert.equal(formatClockTime(d), '14:41')
  })

  it('formats midnight and end of day', () => {
    assert.equal(formatClockTime(new Date(2026, 0, 1, 0, 0, 0)), '00:00')
    assert.equal(formatClockTime(new Date(2026, 0, 1, 23, 59, 0)), '23:59')
  })
})

describe('greetingFromHour', () => {
  it('returns Good morning for 0–11', () => {
    assert.equal(greetingFromHour(0), 'Good morning')
    assert.equal(greetingFromHour(9), 'Good morning')
    assert.equal(greetingFromHour(11), 'Good morning')
  })

  it('returns Good afternoon for 12–16', () => {
    assert.equal(greetingFromHour(12), 'Good afternoon')
    assert.equal(greetingFromHour(15), 'Good afternoon')
    assert.equal(greetingFromHour(16), 'Good afternoon')
  })

  it('returns Good evening for 17–23', () => {
    assert.equal(greetingFromHour(17), 'Good evening')
    assert.equal(greetingFromHour(21), 'Good evening')
    assert.equal(greetingFromHour(23), 'Good evening')
  })
})

describe('greetingForDate', () => {
  it('delegates to hour of the given date', () => {
    assert.equal(greetingForDate(new Date(2026, 5, 1, 8, 30)), 'Good morning')
    assert.equal(greetingForDate(new Date(2026, 5, 1, 13, 0)), 'Good afternoon')
    assert.equal(greetingForDate(new Date(2026, 5, 1, 19, 0)), 'Good evening')
  })
})
