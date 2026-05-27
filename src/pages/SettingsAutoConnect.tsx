import { useNavigate } from 'react-router-dom'
import { Lock, ArrowLeft, Wifi, CheckCircle2, Info } from 'lucide-react'
import { GlassCard, Toggle, Button } from '@/components/ui'
import { useVPNStore } from '@/store/vpnStore'
import { toast } from 'sonner'

export default function SettingsAutoConnect() {
  const navigate = useNavigate()
  const { vpnSettings, updateVpnSetting } = useVPNStore()

  const isEnabled = vpnSettings.autoConnect

  const handleToggle = (checked: boolean) => {
    updateVpnSetting('autoConnect', checked)
    toast.success(
      checked 
        ? 'Auto-Connect enabled — seamless protection' 
        : 'Auto-Connect disabled'
    )
  }

  return (
    <div className="pb-12 max-w-lg mx-auto">
      {/* Back header */}
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={() => navigate('/app/settings')}
          className="p-2 -ml-2 text-[#94A3B8] active:text-white transition-colors"
          aria-label="Back to Settings"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-white/5 flex items-center justify-center text-[#94A3B8]">
            <Lock size={18} />
          </div>
          <div>
            <div className="font-semibold text-3xl tracking-[-0.7px]">Auto-Connect</div>
            <div className="text-tertiary text-sm -mt-0.5">Smart connection rules</div>
          </div>
        </div>
      </div>

      {/* Status */}
      <GlassCard className="mb-8" padding="lg">
        <div className="flex items-start gap-4">
          <div className={`mt-1 ${isEnabled ? 'text-[#3B82F6]' : 'text-tertiary'}`}>
            <Wifi size={28} />
          </div>
          <div className="flex-1">
            <div className="uppercase tracking-[2px] text-xs text-tertiary mb-1">BEHAVIOR</div>
            <div className="text-2xl font-semibold tracking-[-0.4px]">
              {isEnabled ? 'Connects Automatically' : 'Manual Only'}
            </div>
            <p className="text-[#94A3B8] mt-3 text-[13px] leading-relaxed">
              {isEnabled 
                ? 'Aether will detect trusted networks and establish a secure connection automatically in the background.'
                : 'You must manually tap the orb or select a server to connect. Full manual control.'}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Prominent Toggle */}
      <div className="mb-8">
        <div className="flex items-center justify-between px-1 mb-3">
          <div className="font-medium text-sm tracking-wide text-[#94A3B8]">ENABLE AUTO-CONNECT</div>
          <Toggle 
            checked={isEnabled} 
            onCheckedChange={handleToggle}
            size="lg"
            aria-label="Toggle Auto-Connect"
          />
        </div>
        <div className="text-[11px] text-[#475569] px-1">Works on Wi-Fi you have previously marked as trusted.</div>
      </div>

      {/* Explanation sections */}
      <div className="space-y-4">
        <GlassCard padding="md">
          <div className="font-semibold text-sm mb-3 tracking-tight">Trusted networks</div>
          <div className="text-sm text-[#94A3B8] space-y-2.5">
            <div className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400" /> Home Wi-Fi</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400" /> Office network</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400" /> Favorite cafés &amp; co-working</div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-xs text-tertiary">
            Networks are learned automatically the first 3 times you connect manually.
          </div>
        </GlassCard>

        <GlassCard padding="md">
          <div className="flex gap-3">
            <Info className="text-[#3B82F6] flex-shrink-0 mt-px" size={17} />
            <div>
              <div className="text-sm font-medium mb-1">Privacy note</div>
              <div className="text-xs text-[#94A3B8]">Auto-connect only activates on networks you have used securely before. Public hotspots always require manual connection.</div>
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
