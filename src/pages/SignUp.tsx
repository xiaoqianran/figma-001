import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Input } from '@/components/ui'
import {
  isSignupFormValid,
  validateSignupForm,
  type SignupFieldErrors,
} from '@/lib/signupValidation'

export default function SignUp() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<SignupFieldErrors>({})
  const [attempted, setAttempted] = useState(false)

  const values = { name, email, password }
  const canSubmit = isSignupFormValid(values)

  const clearFieldError = (field: keyof SignupFieldErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAttempted(true)
    const nextErrors = validateSignupForm(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Account created', {
        description: 'Welcome to Aether. Your privacy journey begins now.',
      })
      navigate('/app')
    }, 920)
  }

  return (
    <div className="min-h-screen px-6 pt-6 pb-12 flex flex-col">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="w-11 h-11 -ml-2"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </Button>

      <div className="max-w-sm w-full mx-auto flex-1 flex flex-col pt-8">
        <div className="mb-9">
          <div className="uppercase tracking-[4px] text-xs text-tertiary mb-2">START YOUR JOURNEY</div>
          <h1 className="font-display text-[36px] leading-[38px] tracking-[-1.6px] font-semibold">
            Create your account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="FULL NAME"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value)
              if (attempted) clearFieldError('name')
            }}
            placeholder="Alex Rivera"
            leftIcon={<User size={18} />}
            autoComplete="name"
            error={errors.name}
            aria-invalid={!!errors.name}
          />

          <Input
            label="EMAIL"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value)
              if (attempted) clearFieldError('email')
            }}
            placeholder="you@domain.com"
            leftIcon={<Mail size={18} />}
            autoComplete="email"
            error={errors.email}
            aria-invalid={!!errors.email}
          />

          <Input
            label="PASSWORD"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value)
              if (attempted) clearFieldError('password')
            }}
            placeholder="Minimum 8 characters"
            leftIcon={<Lock size={18} />}
            autoComplete="new-password"
            hint={errors.password ? undefined : 'Use a strong, unique password you don’t use elsewhere.'}
            error={errors.password}
            aria-invalid={!!errors.password}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="text-tertiary hover:text-[var(--text-primary)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <Button
            type="submit"
            disabled={loading || (attempted && !canSubmit)}
            className="w-full mt-3"
            loading={loading}
          >
            Create Account
          </Button>

          {attempted && !canSubmit && (
            <p className="text-center text-xs text-[#EF4444]" role="alert">
              Please fix the highlighted fields to continue.
            </p>
          )}
        </form>

        <div className="text-center text-sm text-tertiary mt-8">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/signin')}
            className="text-[var(--accent)] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
          >
            Sign in
          </button>
        </div>

        <div className="mt-auto pt-8 text-center text-xs text-tertiary">
          By creating an account you agree to our
          <br />
          <Link
            to="/app/privacy"
            className="text-[var(--accent)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
          >
            Privacy Policy
          </Link>
          {' and '}
          <Link
            to="/app/faq"
            className="text-[var(--accent)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
          >
            Terms of Service
          </Link>
          .
        </div>
      </div>
    </div>
  )
}
