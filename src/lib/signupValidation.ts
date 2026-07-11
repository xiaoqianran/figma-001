/**
 * Pure validation helpers for the SignUp form.
 * Used by the shipped SignUp page — unit-tested without mounting React.
 */

export type SignupField = 'name' | 'email' | 'password'

export interface SignupFormValues {
  name: string
  email: string
  password: string
}

export type SignupFieldErrors = Partial<Record<SignupField, string>>

/** Trimmed name must be at least 2 characters. */
export function validateName(name: string): string | null {
  const trimmed = name.trim()
  if (!trimmed) return 'Full name is required'
  if (trimmed.length < 2) return 'Name must be at least 2 characters'
  return null
}

/**
 * Require a practical email shape: local@domain.tld with a real TLD.
 * Intentionally stricter than a bare `includes('@')` check.
 */
export function validateEmail(email: string): string | null {
  const trimmed = email.trim()
  if (!trimmed) return 'Email is required'
  // Simple, production-common pattern (not full RFC 5322)
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)
  if (!ok) return 'Enter a valid email address'
  return null
}

/** Password must be at least 8 characters. */
export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  return null
}

/** Validate all fields; returns only fields that have errors. */
export function validateSignupForm(values: SignupFormValues): SignupFieldErrors {
  const errors: SignupFieldErrors = {}
  const nameError = validateName(values.name)
  const emailError = validateEmail(values.email)
  const passwordError = validatePassword(values.password)
  if (nameError) errors.name = nameError
  if (emailError) errors.email = emailError
  if (passwordError) errors.password = passwordError
  return errors
}

export function isSignupFormValid(values: SignupFormValues): boolean {
  return Object.keys(validateSignupForm(values)).length === 0
}
