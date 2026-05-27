import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Lock, User } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Input } from '@/components/ui'

export default function SignUp() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const canSubmit = name.length > 1 && email.includes('@') && password.length >= 8

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Account created', { description: 'Welcome to Aether. Your privacy journey begins now.' })
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
          <h1 className="font-display text-[36px] leading-[38px] tracking-[-1.6px] font-semibold">Create your account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="FULL NAME"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="Alex Rivera"
            leftIcon={<User size={18} />}
          />

          <Input
            label="EMAIL"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            leftIcon={<Mail size={18} />}
          />

          <Input
            label="PASSWORD"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            leftIcon={<Lock size={18} />}
            hint="Use a strong, unique password you don’t use elsewhere."
          />

          <Button
            disabled={!canSubmit || loading}
            className="w-full mt-3"
            loading={loading}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-auto pt-8 text-center text-xs text-[#475569]">
          By creating an account you agree to our<br />Privacy Policy and Terms of Service.
        </div>
      </div>
    </div>
  )
}
