import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Copy, Check, RefreshCw } from 'lucide-react'
import { useVPNStore } from '@/store/vpnStore'
import { toast } from 'sonner'
import { Button, Input, GlassCard } from '@/components/ui'

/** 6-digit TOTP style code input — premium glass squares with auto-advance */
function VerificationCodeInput({
  digits,
  setDigits,
  disabled,
}: {
  digits: string[]
  setDigits: (d: string[]) => void
  disabled?: boolean
}) {
  const inputs = Array.from({ length: 6 })

  const focusInput = (idx: number) => {
    const el = document.getElementById(`code-${idx}`) as HTMLInputElement | null
    el?.focus()
    el?.select()
  }

  const handleChange = (idx: number, value: string) => {
    // Only digits
    const digit = value.replace(/\D/g, '').slice(0, 1)
    if (!digit && value !== '') return

    const newDigits = [...digits]
    newDigits[idx] = digit
    setDigits(newDigits)

    // Auto advance
    if (digit && idx < 5) {
      setTimeout(() => focusInput(idx + 1), 10)
    }
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[idx] && idx > 0) {
        const newDigits = [...digits]
        newDigits[idx - 1] = ''
        setDigits(newDigits)
        focusInput(idx - 1)
      } else if (digits[idx]) {
        const newDigits = [...digits]
        newDigits[idx] = ''
        setDigits(newDigits)
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      focusInput(idx - 1)
    } else if (e.key === 'ArrowRight' && idx < 5) {
      focusInput(idx + 1)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    e.preventDefault()

    const newDigits = Array(6).fill('')
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i]
    }
    setDigits(newDigits)

    // Focus last filled or next empty
    const last = Math.min(pasted.length, 5)
    setTimeout(() => focusInput(last), 20)
  }

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {inputs.map((_, i) => (
        <input
          key={i}
          id={`code-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          disabled={disabled}
          className="input w-12 h-14 text-center text-3xl font-mono tracking-[3px] p-0 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 rounded-2xl bg-[#0B0F14] border border-white/10"
          autoComplete="one-time-code"
          aria-label={`Digit ${i + 1} of 6`}
        />
      ))}
    </div>
  )
}

export default function TwoFA() {
  const navigate = useNavigate()
  const { setTwoFactorEnabled } = useVPNStore()

  const [digits, setDigits] = useState(Array(6).fill(''))
  const [verifying, setVerifying] = useState(false)
  const [copied, setCopied] = useState(false)

  // Live region for verification feedback
  const [verifyStatus, setVerifyStatus] = useState('')

  const fullCode = digits.join('')
  const canVerify = fullCode.length === 6

  // Simulated secret key (real apps generate per-user)
  const secretKey = 'AETH ERVP N202 6KX9 3LMQ'

  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(secretKey.replace(/\s/g, ''))
      setCopied(true)
      toast.success('Secret key copied', { description: 'Paste into your authenticator app if you can\'t scan.' })
      setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.error('Could not copy — select the key manually')
    }
  }

  const handleVerify = async () => {
    if (!canVerify) return

    setVerifying(true)

    // Realistic verification simulation (always succeeds in demo for great UX)
    await new Promise((r) => setTimeout(r, 780))

    setTwoFactorEnabled(true)

    setVerifying(false)

    const msg = 'Two-factor authentication enabled'
    setVerifyStatus(msg)
    toast.success(msg, {
      description: 'Your account is now significantly more secure. Great choice.',
    })

    // Navigate back to security hub
    navigate('/app/security')
  }

  // Simple attractive SVG QR simulation (looks like real TOTP QR without external deps)
  const QRCode = () => (
    <svg width="172" height="172" viewBox="0 0 172 172" className="rounded-2xl" style={{ background: '#fff' }}>
      {/* Quiet zone border */}
      <rect x="0" y="0" width="172" height="172" fill="#ffffff" />
      {/* Finder patterns (the big squares in corners) */}
      {/* Top-left */}
      <rect x="12" y="12" width="42" height="42" fill="#111827" rx="3" />
      <rect x="20" y="20" width="26" height="26" fill="#fff" />
      <rect x="26" y="26" width="14" height="14" fill="#111827" />
      {/* Top-right */}
      <rect x="118" y="12" width="42" height="42" fill="#111827" rx="3" />
      <rect x="126" y="20" width="26" height="26" fill="#fff" />
      <rect x="132" y="26" width="14" height="14" fill="#111827" />
      {/* Bottom-left */}
      <rect x="12" y="118" width="42" height="42" fill="#111827" rx="3" />
      <rect x="20" y="126" width="26" height="26" fill="#fff" />
      <rect x="26" y="132" width="14" height="14" fill="#111827" />
      {/* Data modules — pseudo-random but deterministic nice pattern */}
      {Array.from({ length: 13 }).map((_, row) =>
        Array.from({ length: 13 }).map((__, col) => {
          // Skip finder pattern areas
          if ((row < 3 && col < 3) || (row < 3 && col > 9) || (row > 9 && col < 3)) return null
          const on = ((row * 7 + col * 3) % 5) !== 0 && ((row + col) % 3 !== 1)
          return on ? (
            <rect
              key={`${row}-${col}`}
              x={20 + col * 10}
              y={20 + row * 10}
              width="7.5"
              height="7.5"
              fill="#111827"
              rx="1"
            />
          ) : null
        })
      )}
      {/* Center Aether branding mark */}
      <circle cx="86" cy="86" r="15" fill="#fff" />
      <circle cx="86" cy="86" r="9" fill="#335ef7" />
      <text x="86" y="90" textAnchor="middle" fontSize="9" fill="#fff" fontFamily="monospace" fontWeight="700">AE</text>
    </svg>
  )

  return (
    <div className="pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="w-11 h-11 -ml-2 p-0"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <div className="uppercase tracking-[3px] text-xs text-tertiary">SECURE YOUR ACCOUNT</div>
          <h1 className="font-display text-[26px] tracking-[-1px] font-semibold leading-none mt-0.5">Set up 2FA</h1>
        </div>
      </div>

      <GlassCard padding="lg" className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-[#3B82F6]">
            <Shield size={22} />
          </div>
          <div>
            <div className="font-semibold">Authenticator App</div>
            <div className="text-xs text-tertiary">Use Google Authenticator, Authy, or 1Password</div>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center py-4 bg-[#0A0D12] rounded-3xl border border-white/10 mb-5">
          <QRCode />
        </div>

        <div className="text-center text-sm mb-1 text-secondary">Scan this QR code with your authenticator app</div>

        {/* Secret key for manual entry */}
        <div className="mt-4">
          <div className="text-[10px] tracking-[1.5px] uppercase text-tertiary mb-1.5 pl-1">CAN'T SCAN? ENTER THIS KEY</div>
          <button
            onClick={handleCopySecret}
            className="w-full flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-left font-mono text-sm tracking-[2px] hover:border-[#3B82F6]/40 active:bg-white/10 transition group"
          >
            <span className="text-[#F1F5F9]">{secretKey}</span>
            <span className="text-tertiary group-active:text-white">
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </span>
          </button>
        </div>
      </GlassCard>

      {/* Verification */}
      <GlassCard padding="lg">
        <div className="mb-5">
          <div className="text-xs tracking-[2px] text-tertiary mb-2 pl-0.5">STEP 2 — VERIFY SETUP</div>
          <div className="font-medium mb-1">Enter the 6-digit code from your app</div>
          <div className="text-xs text-tertiary">The code refreshes every 30 seconds.</div>
        </div>

        <VerificationCodeInput digits={digits} setDigits={setDigits} disabled={verifying} />

        {/* Also offer classic single Input for easy paste from password managers */}
        <div className="mt-5">
          <Input
            label="OR PASTE CODE"
            type="text"
            maxLength={6}
            value={fullCode}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, '').slice(0, 6)
              const newD = Array(6).fill('')
              for (let i = 0; i < cleaned.length; i++) newD[i] = cleaned[i]
              setDigits(newD)
            }}
            placeholder="123456"
            containerClassName="mt-1"
          />
        </div>

        <div className="mt-6">
          <Button
            onClick={handleVerify}
            loading={verifying}
            disabled={!canVerify}
            fullWidth
            size="lg"
          >
            {verifying ? 'Verifying...' : 'Verify & Enable 2FA'}
          </Button>
        </div>

        <button
          onClick={() => {
            setDigits(Array(6).fill(''))
            toast('Code cleared')
          }}
          className="mx-auto mt-4 block text-xs text-tertiary flex items-center gap-1 hover:text-white active:opacity-75"
        >
          <RefreshCw size={12} /> Clear code
        </button>
      </GlassCard>

      <p className="text-center mt-8 text-[11px] text-tertiary px-4">
        After enabling, you will need this code on every new login or device.
      </p>

      {/* Live region for 2FA verification status */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">{verifyStatus}</div>
    </div>
  )
}
