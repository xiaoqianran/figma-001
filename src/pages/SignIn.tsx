import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Input } from '@/components/ui'

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const canSubmit = email.length > 4 && password.length >= 6

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Welcome back, Alex', { description: 'You are now connected to the Aether network.' })
      navigate('/app')
    }, 820)
  }

  return (
    <div className="min-h-screen px-6 pt-6 pb-12 flex flex-col">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="w-11 h-11 -ml-2 mb-2 p-0"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </Button>

      <div className="max-w-sm w-full mx-auto flex-1 flex flex-col pt-8">
        <div className="mb-10">
          <div className="uppercase tracking-[4px] text-xs text-tertiary mb-2">SECURE ACCESS</div>
          <h1 className="font-display text-[38px] leading-none tracking-[-1.8px] font-semibold">Welcome back</h1>
          <p className="mt-3 text-secondary">Sign in to continue protecting your connection.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          <Input
            label="EMAIL ADDRESS"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            leftIcon={<Mail size={18} />}
            autoComplete="email"
          />

          <Input
            label="PASSWORD"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock size={18} />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="text-tertiary hover:text-white transition"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            autoComplete="current-password"
          />

          <div className="flex justify-end">
            <button type="button" className="text-xs text-[#3B82F6]">Forgot password?</button>
          </div>

          <Button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full mt-4"
            loading={loading}
          >
            Sign In
          </Button>
        </form>

        <div className="text-center text-sm text-tertiary mt-auto">
          Don’t have an account?{' '}
          <button onClick={() => navigate('/signup')} className="text-[#3B82F6] font-medium">Create one</button>
        </div>
      </div>
    </div>
  )
}
