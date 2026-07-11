/**
 * Unit tests for shipped signup validation (src/lib/signupValidation.ts).
 * Run via: npm test
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  validateName,
  validateEmail,
  validatePassword,
  validateSignupForm,
  isSignupFormValid,
} from './signupValidation.ts'

describe('validateName', () => {
  it('rejects empty and short names', () => {
    assert.equal(validateName(''), 'Full name is required')
    assert.equal(validateName('   '), 'Full name is required')
    assert.equal(validateName('A'), 'Name must be at least 2 characters')
  })

  it('accepts trimmed multi-char names', () => {
    assert.equal(validateName('Alex'), null)
    assert.equal(validateName('  Jo  '), null)
  })
})

describe('validateEmail', () => {
  it('rejects empty and incomplete addresses', () => {
    assert.equal(validateEmail(''), 'Email is required')
    assert.equal(validateEmail('not-an-email'), 'Enter a valid email address')
    assert.equal(validateEmail('a@b'), 'Enter a valid email address')
    assert.equal(validateEmail('a@b.'), 'Enter a valid email address')
  })

  it('accepts standard addresses', () => {
    assert.equal(validateEmail('you@domain.com'), null)
    assert.equal(validateEmail('  alex@aether.app  '), null)
  })
})

describe('validatePassword', () => {
  it('rejects empty and short passwords', () => {
    assert.equal(validatePassword(''), 'Password is required')
    assert.equal(validatePassword('short'), 'Password must be at least 8 characters')
    assert.equal(validatePassword('1234567'), 'Password must be at least 8 characters')
  })

  it('accepts passwords of length >= 8', () => {
    assert.equal(validatePassword('12345678'), null)
    assert.equal(validatePassword('secure-pass'), null)
  })
})

describe('validateSignupForm / isSignupFormValid', () => {
  it('returns all field errors when invalid', () => {
    const errors = validateSignupForm({ name: '', email: 'x', password: '1' })
    assert.ok(errors.name)
    assert.ok(errors.email)
    assert.ok(errors.password)
    assert.equal(isSignupFormValid({ name: '', email: 'x', password: '1' }), false)
  })

  it('returns empty errors for a valid payload', () => {
    const values = { name: 'Alex Rivera', email: 'you@domain.com', password: 'password1' }
    assert.deepEqual(validateSignupForm(values), {})
    assert.equal(isSignupFormValid(values), true)
  })
})
