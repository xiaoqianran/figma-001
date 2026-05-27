import { useNavigate } from 'react-router-dom'
import { Bell, ArrowLeft, Check, AlertCircle } from 'lucide-react'
import { GlassCard, Toggle, Button } from '@/components/ui'
import { useVPNStore } from '@/store/vpnStore'
import { toast } from 'sonner'

export default function SettingsNotifications() {
  const navigate = useNavigate()
  const { vpnSettings, updateVpnSetting } = useVPNStore()

  const isEnabled = vpnSettings.notifications

  const handleToggle = (checked: boolean) => {
    updateVpnSetting('notifications', checked)
    toast.success(
      checked 
        ? 'Notifications enabled — you’ll stay informed' 
        : 'Notifications muted'
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
            <Bell size={18} />
          </div>
          <div>
            <div className="font-semibold text-3xl tracking-[-0.7px]">Notifications</div>
            <div className="text-tertiary text-sm -mt-0.5">Stay in the loop, securely</div>
          </div>
        </div>
      </div>

      {/* Main toggle hero */}
      <GlassCard className="mb-8" padding="lg">
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 ${isEnabled ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : 'bg-white/5 text-tertiary'}`}>
            <Bell size={32} />
          </div>
          <div className="text-xl font-semibold tracking-tight mb-1">
            {isEnabled ? 'Alerts are enabled' : 'Quiet mode active'}
          </div>
          <p className="text-[#94A3B8] text-sm max-w-[260px]">
            Receive timely updates about your connection status, security events, and important Aether news.
          </p>
        </div>
      </GlassCard>

      {/* The Toggle */}
      <div className="mb-8">
        <div className="flex items-center justify-between px-1 mb-3">
          <div className="font-medium text-sm tracking-wide text-[#94A3B8]">ALLOW NOTIFICATIONS</div>
          <Toggle 
            checked={isEnabled} 
            onCheckedChange={handleToggle}
            size="lg"
            aria-label="Toggle Notifications"
          />
        </div>
      </div>

      {/* Notification categories (visual only — future granular control) */}
      <div className="space-y-3">
        <div className="px-1 text-xs font-medium tracking-[1px] text-tertiary mb-1">YOU WILL RECEIVE</div>

        {[
          { icon: Check, title: 'Connection status', desc: 'Protected / Disconnected / Reconnecting', enabled: isEnabled },
          { icon: AlertCircle, title: 'Security alerts', desc: 'Kill switch activations and unusual activity', enabled: isEnabled },
          { icon: Check, title: 'Server updates', desc: 'Maintenance, new locations, and performance tips', enabled: isEnabled },
        ].map((item, idx) => (
          <GlassCard key={idx} padding="sm" className="flex items-center gap-4">
            <div className={`w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center ${item.enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-[#475569]'}`}>
              <item.icon size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm">{item.title}</div>
              <div className="text-xs text-tertiary leading-tight">{item.desc}</div>
            </div>
            <div className={`text-[10px] px-2 py-px rounded ${item.enabled ? 'text-emerald-400' : 'text-[#475569]'} font-mono tracking-widest`}>
              {item.enabled ? 'ON' : 'OFF'}
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-6 px-1 text-[11px] text-[#475569]">
        Notifications respect your device’s system preferences and never include personal data.
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
