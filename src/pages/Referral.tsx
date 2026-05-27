import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Gift, Users, MessageCircle, Mail, Link as LinkIcon, Check, Award } from 'lucide-react'
import { GlassCard, Button, Input } from '@/components/ui'
import { useVPNStore } from '@/store/vpnStore'
import { toast } from 'sonner'

const shareOptions = [
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: '#25D366' },
  { id: 'telegram', label: 'Telegram', icon: MessageCircle, color: '#229ED9' },
  { id: 'email', label: 'Email', icon: Mail, color: '#3B82F6' },
  { id: 'link', label: 'Copy Link', icon: LinkIcon, color: '#94A3B8' },
]

export default function Referral() {
  const navigate = useNavigate()
  const { 
    referralCode, 
    referredFriendsCount, 
    monthsEarned,
    recordReferralSuccess,
    redeemReferralCode,
  } = useVPNStore()

  const [copied, setCopied] = useState(false)
  const [redeemCode, setRedeemCode] = useState('')
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [recentlyReferred, setRecentlyReferred] = useState<string[]>([
    'Jordan K.', 'Sam P.', 'Taylor M.'
  ])

  const inviteLink = `https://aether.vpn/invite/${referralCode}`

  const copyToClipboard = async (text: string, successMsg: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success(successMsg)
      
      // Reset copied indicator
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Fallback
      toast.error('Could not copy automatically', {
        description: 'Please copy manually: ' + text,
      })
    }
  }

  const handleCopyCode = () => {
    copyToClipboard(referralCode, 'Referral code copied')
  }

  const handleCopyLink = () => {
    copyToClipboard(inviteLink, 'Invite link copied to clipboard')
  }

  const handleShare = (option: typeof shareOptions[0]) => {
    const messages: Record<string, string> = {
      whatsapp: 'Opening WhatsApp with your personalized invite...',
      telegram: 'Opening Telegram with your personalized invite...',
      email: 'Composing email with your referral link...',
      link: 'Invite link ready.',
    }

    if (option.id === 'link') {
      handleCopyLink()
      return
    }

    toast.success(`Shared via ${option.label}`, {
      description: messages[option.id] || 'Invitation prepared (simulated).',
    })

    // For demo purposes: after a share action, offer the user an easy way to record the reward.
    // We intentionally do not auto-reward on every share click (more realistic)
  }

  // Functional reward action — simulates a successful referral conversion
  const simulateSuccessfulReferral = () => {
    recordReferralSuccess()
    
    // Add a fun simulated friend name
    const demoNames = ['Morgan L.', 'Casey R.', 'Riley T.', 'Jamie S.', 'Alex D.']
    const newName = demoNames[referredFriendsCount % demoNames.length]
    
    setRecentlyReferred(prev => [newName, ...prev].slice(0, 5))

    toast.success(`+1 month Pro unlocked!`, {
      description: `${newName} just joined using your link. Thank you!`,
    })
  }

  const handleRedeemCode = async () => {
    if (!redeemCode.trim()) {
      toast.error('Please enter a referral code')
      return
    }

    setIsRedeeming(true)

    // Small delay for UX
    await new Promise(r => setTimeout(r, 380))

    const result = redeemReferralCode(redeemCode)

    if (result.success) {
      toast.success('Referral code redeemed!', {
        description: result.message,
      })
      setRedeemCode('')
      
      // Add a nice entry to recent list
      setRecentlyReferred(prev => ['Friend via code', ...prev].slice(0, 5))
    } else {
      toast.error('Redemption failed', {
        description: result.message,
      })
    }

    setIsRedeeming(false)
  }

  const progressToNextMilestone = Math.min(((referredFriendsCount % 5) / 5) * 100, 100)
  const nextMilestone = Math.floor(referredFriendsCount / 5) * 5 + 5

  return (
    <div className="pb-24">
      {/* Top nav */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-2xl glass active:scale-95 transition"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-[28px] tracking-[-1px] font-semibold">Refer a Friend</h1>
          <p className="text-tertiary text-sm">Both of you get a free month of Pro</p>
        </div>
      </div>

      {/* Hero reward highlight */}
      <GlassCard className="mb-8 bg-gradient-to-br from-[#3B82F6]/10 via-transparent to-[#22D3EE]/5 border-[#3B82F6]/20" padding="lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#22D3EE] flex items-center justify-center text-white flex-shrink-0">
            <Gift size={28} />
          </div>
          <div>
            <div className="font-semibold tracking-tight text-lg">You’ve earned {monthsEarned} month{monthsEarned === 1 ? '' : 's'} free</div>
            <div className="text-secondary mt-0.5">Keep inviting — every successful referral adds another month to your plan.</div>
          </div>
        </div>
      </GlassCard>

      {/* Your Referral Code */}
      <div className="mb-8">
        <div className="uppercase tracking-[2px] text-xs text-tertiary mb-3 px-1">YOUR REFERRAL CODE</div>
        
        <GlassCard className="text-center" padding="lg">
          <div className="font-mono text-4xl tracking-[4px] font-semibold text-[#22D3EE] mb-1 select-all">
            {referralCode}
          </div>
          <div className="text-xs text-tertiary mb-6">Share this code or the invite link below</div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="primary" 
              onClick={handleCopyCode}
              leftIcon={copied ? <Check size={17} /> : <Copy size={17} />}
              className="min-w-[168px]"
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleCopyLink}
              leftIcon={<LinkIcon size={17} />}
            >
              Copy Invite Link
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* Share options */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="uppercase tracking-[2px] text-xs text-tertiary">INVITE FRIENDS</div>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {shareOptions.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.id}
                onClick={() => handleShare(option)}
                className="glass rounded-3xl p-5 flex flex-col items-center justify-center gap-3 active:scale-[0.985] transition hover:border-white/20"
              >
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${option.color}15`, color: option.color }}
                >
                  <Icon size={22} />
                </div>
                <div className="text-sm font-medium">{option.label}</div>
              </button>
            )
          })}
        </div>

        {/* Functional simulation control */}
        <div className="mt-4">
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={simulateSuccessfulReferral}
            leftIcon={<Users size={17} />}
          >
            Simulate Successful Invite (Earn Reward)
          </Button>
          <div className="text-center text-[10px] text-[#475569] mt-2 tracking-widest">
            DEMO — Records a real referral in the app
          </div>
        </div>
      </div>

      {/* Rewards & Progress */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="uppercase tracking-[2px] text-xs text-tertiary">YOUR REWARDS</div>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <GlassCard padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-4xl font-semibold tabular-nums tracking-[-1px]">{referredFriendsCount}</div>
              <div className="text-secondary -mt-1">friends referred</div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                <Award size={15} /> {monthsEarned} months earned
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-tertiary mb-1.5">
              <span>Progress to next milestone</span>
              <span className="tabular-nums">{referredFriendsCount} / {nextMilestone}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] transition-all duration-500 rounded-full" 
                style={{ width: `${progressToNextMilestone}%` }}
              />
            </div>
            <div className="text-[11px] text-[#475569] mt-1.5">
              {5 - (referredFriendsCount % 5)} more successful invites for an extra surprise reward
            </div>
          </div>

          {/* Recent referred friends */}
          {recentlyReferred.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-xs uppercase tracking-[1.5px] text-tertiary mb-3">Recent invites</div>
              <div className="flex flex-wrap gap-2">
                {recentlyReferred.map((name, idx) => (
                  <div key={idx} className="px-3.5 py-1 rounded-full text-sm bg-white/5 text-secondary">
                    {name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Redeem a friend's code */}
      <div>
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="uppercase tracking-[2px] text-xs text-tertiary">HAVE A CODE?</div>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <GlassCard padding="lg">
          <div className="text-sm text-secondary mb-4">
            Enter a friend’s referral code to claim your mutual reward.
          </div>

          <div className="flex gap-3">
            <Input
              placeholder="FRIEND-CODE-HERE"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
              containerClassName="flex-1"
              onKeyDown={(e) => { if (e.key === 'Enter') handleRedeemCode() }}
            />
            <Button 
              onClick={handleRedeemCode} 
              loading={isRedeeming}
              disabled={!redeemCode.trim()}
              className="px-6"
            >
              Redeem
            </Button>
          </div>

          <div className="text-[11px] text-[#475569] mt-4">
            Both you and your friend will receive one month of Aether Pro — completely free.
          </div>
        </GlassCard>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-[#475569]">
        Referral rewards are applied automatically to your next billing cycle.
      </div>
    </div>
  )
}
