import { useNavigate } from 'react-router-dom'
import { Shield, ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { GlassCard, Toggle, Button } from '@/components/ui'
import { useVPNStore } from '@/store/vpnStore'
import { toast } from 'sonner'

export default function SettingsKillSwitch() {
  const navigate = useNavigate()
  const { vpnSettings, updateVpnSetting } = useVPNStore()

  const isEnabled = vpnSettings.killSwitch

  const handleToggle = (checked: boolean) => {
    updateVpnSetting('killSwitch', checked)
    toast.success(
      checked 
        ? 'Kill Switch enabled — maximum protection active' 
        : 'Kill Switch disabled — use with caution'
    )
  }

  return (
    <div className="pb-12 max-w-lg mx-auto">
      {/* Back header */}
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={() => navigate('/app/settings')}
          className="p-2 -ml-2 text-secondary active:text-white transition-colors"
          aria-label="Back to Settings"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-white/5 flex items-center justify-center text-secondary">
            <Shield size={18} />
          </div>
          <div>
            <div className="font-semibold text-3xl tracking-[-0.7px]">Kill Switch</div>
            <div className="text-tertiary text-sm -mt-0.5">Always-on network protection</div>
          </div>
        </div>
      </div>

      {/* Hero status card */}
      <GlassCard className="mb-8" padding="lg">
        <div className="flex items-start gap-4">
          <div className={`mt-1 ${isEnabled ? 'text-emerald-400' : 'text-[#F59E0B]'}`}>
            {isEnabled ? <CheckCircle2 size={28} /> : <AlertTriangle size={28} />}
          </div>
          <div className="flex-1">
            <div className="uppercase tracking-[2px] text-xs text-tertiary mb-1">CURRENT STATE</div>
            <div className="text-2xl font-semibold tracking-[-0.4px]">
              {isEnabled ? 'Fully Protected' : 'Protection Inactive'}
            </div>
            <p className="text-secondary mt-3 text-[13px] leading-relaxed">
              {isEnabled 
                ? 'If the VPN connection ever drops unexpectedly, all internet traffic is instantly blocked to prevent IP leaks.'
                : 'Your traffic may continue over the open internet if the VPN disconnects. Not recommended for sensitive activity.'}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* The working toggle */}
      <div className="mb-8">
        <div className="flex items-center justify-between px-1 mb-3">
          <div className="font-medium text-sm tracking-wide text-secondary">ENABLE KILL SWITCH</div>
          <Toggle 
            checked={isEnabled} 
            onCheckedChange={handleToggle}
            size="lg"
            aria-label="Toggle Kill Switch"
          />
        </div>
        <div className="text-[11px] text-[#475569] px-1">Changes take effect immediately.</div>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <GlassCard padding="md">
          <div className="text-sm font-semibold mb-3 tracking-tight">How it works</div>
          <ul className="space-y-2.5 text-sm text-secondary">
            <li className="flex gap-2"><span className="text-[#3B82F6] mt-px">•</span> Monitors the VPN tunnel 24/7</li>
            <li className="flex gap-2"><span className="text-[#3B82F6] mt-px">•</span> Instantly cuts connectivity on any drop</li>
            <li className="flex gap-2"><span className="text-[#3B82F6] mt-px">•</span> No data leaves your device without protection</li>
            <li className="flex gap-2"><span className="text-[#3B82F6] mt-px">•</span> Perfect for public Wi-Fi and high-risk networks</li>
          </ul>
        </GlassCard>

        <GlassCard padding="md" className="border-[#F59E0B]/20">
          <div className="flex gap-3">
            <AlertTriangle className="text-[#F59E0B] flex-shrink-0 mt-0.5" size={18} />
            <div className="text-xs leading-snug text-secondary">
              When Kill Switch is active, you may briefly lose internet while the VPN reconnects. This is by design for your privacy.
            </div>
          </div>
        </GlassCard>
      </div>

      <Button 
        variant="secondary" 
        size="md" 
        fullWidth 
        className="mt-8"
        onClick={() => navigate('/app/settings')}
      >
        Back to Settings
      </Button>
    </div>
  )
}
