import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, KeyRound, Smartphone, Clock, ChevronRight, Eye, EyeOff, Check, X } from 'lucide-react'
import { useVPNStore } from '@/store/vpnStore'
import { toast } from 'sonner'
import { Button, Input, GlassCard, Toggle } from '@/components/ui'

export default function Security() {
  const navigate = useNavigate()
  const { security, setTwoFactorEnabled, changePassword } = useVPNStore()

  // Password change state
  const [showPwForm, setShowPwForm] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  // Live region for security status changes (2FA toggle, password updates)
  const [securityStatus, setSecurityStatus] = useState('')

  const lastChanged = new Date(security.lastPasswordChange).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const handleToggle2FA = (enabled: boolean) => {
    if (enabled) {
      // Direct enable from here is unusual — guide user through proper setup
      navigate('/app/2fa')
      return
    }
    // Disabling is instant simulation (real apps would require re-auth / code)
    setTwoFactorEnabled(false)
    const msg = 'Two-factor authentication disabled'
    setSecurityStatus(msg)
    setTimeout(() => setSecurityStatus(''), 3000)
    toast.success(msg, {
      description: 'Your account is now protected by password only.',
    })
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPw || !newPw || !confirmPw) {
      toast.error('Please fill out all fields')
      return
    }
    if (newPw !== confirmPw) {
      toast.error('New passwords do not match')
      return
    }
    if (newPw.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setPwLoading(true)
    const res = await changePassword(currentPw, newPw)
    setPwLoading(false)

    if (res.success) {
      const msg = res.message || 'Password updated successfully'
      setSecurityStatus(msg)
      setTimeout(() => setSecurityStatus(''), 4000)
      toast.success(res.message, { description: 'Next time you sign in, use your new password.' })
      // Reset form
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
      setShowNew(false)
      setShowPwForm(false)
    } else {
      toast.error(res.message)
    }
  }

  const deviceCount = security.devices.length
  const twoFAEnabled = security.twoFactorEnabled

  return (
    <div className="pb-24">
      {/* Header with back */}
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
          <div className="uppercase tracking-[3px] text-xs text-tertiary">ACCOUNT</div>
          <h1 className="font-display text-[28px] tracking-[-1.2px] font-semibold leading-none mt-0.5">Security</h1>
        </div>
      </div>

      {/* Live region for dynamic security status (2FA, password changes) */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">{securityStatus}</div>

      <p className="text-secondary text-sm mb-8 max-w-[320px]">
        Keep your Aether account safe. Manage password, two-factor authentication, and active sessions.
      </p>

      {/* Password Section */}
      <GlassCard className="mb-4" padding="lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center text-secondary">
              <KeyRound size={18} />
            </div>
            <div>
              <div className="font-semibold">Password</div>
              <div className="text-xs text-tertiary flex items-center gap-1 mt-0.5">
                <Clock size={12} /> Last changed {lastChanged}
              </div>
            </div>
          </div>
          {!showPwForm && (
            <Button variant="secondary" size="sm" onClick={() => setShowPwForm(true)}>
              Change
            </Button>
          )}
        </div>

        {showPwForm && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2 border-t border-white/10">
            <Input
              label="CURRENT PASSWORD"
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="Enter current password"
              autoComplete="current-password"
            />

            <Input
              label="NEW PASSWORD"
              type={showNew ? 'text' : 'password'}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="text-tertiary hover:text-white transition"
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <Input
              label="CONFIRM NEW PASSWORD"
              type={showNew ? 'text' : 'password'}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Re-enter new password"
              autoComplete="new-password"
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => {
                  setShowPwForm(false)
                  setCurrentPw('')
                  setNewPw('')
                  setConfirmPw('')
                  setShowNew(false)
                }}
                disabled={pwLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={pwLoading}
                fullWidth
                disabled={!currentPw || !newPw || !confirmPw}
              >
                Update Password
              </Button>
            </div>
            <p className="text-[10px] text-tertiary pl-1">Your password is never stored in plain text. Zero-knowledge architecture.</p>
          </form>
        )}
      </GlassCard>

      {/* 2FA Section */}
      <GlassCard className="mb-4" padding="lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center text-secondary">
            <Shield size={18} />
          </div>
          <div className="flex-1">
            <div className="font-semibold">Two-Factor Authentication</div>
            <div className="text-xs text-tertiary mt-0.5">Add an extra layer of protection using an authenticator app.</div>
          </div>
          <Toggle
            checked={twoFAEnabled}
            onCheckedChange={handleToggle2FA}
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-[var(--bg-subtle)] px-4 py-3 text-sm">
          <div>
            Status:{' '}
            <span className={twoFAEnabled ? 'text-emerald-400 font-medium' : 'text-[#EF4444] font-medium'}>
              {twoFAEnabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
          {twoFAEnabled ? (
            <button
              onClick={() => {
                setTwoFactorEnabled(false)
                const msg = '2FA disabled in simulation'
                setSecurityStatus(msg)
                setTimeout(() => setSecurityStatus(''), 2500)
                toast.info(msg)
              }}
              className="text-xs text-[#EF4444] font-medium flex items-center gap-1 active:opacity-70"
            >
              <X size={14} /> Disable
            </button>
          ) : (
            <button
              onClick={() => navigate('/app/2fa')}
              className="text-xs text-[#3B82F6] font-medium flex items-center gap-1 active:opacity-70"
            >
              Enable 2FA <ChevronRight size={14} />
            </button>
          )}
        </div>

        {twoFAEnabled && (
          <div className="mt-3 text-[11px] text-tertiary pl-1 flex items-center gap-1.5">
            <Check size={14} className="text-emerald-400" /> Authenticator app connected • Recovery codes available in settings
          </div>
        )}
      </GlassCard>

      {/* Devices & Sessions */}
      <GlassCard
        interactive
        padding="lg"
        className="mb-4"
        onClick={() => navigate('/app/devices')}
        aria-label="Manage logged-in devices and active sessions"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center text-secondary">
              <Smartphone size={18} />
            </div>
            <div>
              <div className="font-semibold">Logged-in Devices</div>
              <div className="text-xs text-tertiary mt-0.5">
                {deviceCount} active session{deviceCount !== 1 ? 's' : ''} • Manage sign-outs
              </div>
            </div>
          </div>
          <ChevronRight className="text-tertiary" size={20} />
        </div>
      </GlassCard>

      {/* Extra security notes */}
      <div className="mt-8 px-1">
        <div className="text-[10px] uppercase tracking-[2px] text-tertiary mb-2">SECURITY NOTES</div>
        <ul className="text-xs text-tertiary space-y-1.5 list-disc pl-4">
          <li>All logins are protected with end-to-end encrypted session tokens.</li>
          <li>Enabling 2FA will require a 6-digit code on every new device.</li>
          <li>You will be notified via email on any new login from an unrecognized device.</li>
        </ul>
      </div>

      <div className="text-center text-[10px] text-tertiary mt-10 tracking-widest">AETHER SECURITY v1.4.2</div>
    </div>
  )
}
