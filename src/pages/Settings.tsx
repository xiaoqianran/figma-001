import { useNavigate } from 'react-router-dom'
import { Shield, Lock, Bell, ChevronRight, ArrowLeft, Info, Sun, Moon, Palette } from 'lucide-react'
import { GlassCard, Button } from '@/components/ui'
import { useVPNStore } from '@/store/vpnStore'
import { toast } from 'sonner'

interface SettingItemProps {
  icon: React.ElementType
  title: string
  subtitle: string
  enabled: boolean
  to: string
}

const SettingItem = ({ icon: Icon, title, subtitle, enabled, to }: SettingItemProps) => {
  const navigate = useNavigate()

  return (
    <GlassCard 
      interactive 
      onClick={() => navigate(to)}
      className="cursor-pointer active:scale-[0.985] transition-all"
      aria-label={`${title} settings. Currently ${enabled ? 'enabled' : 'disabled'}. ${subtitle}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-subtle flex items-center justify-center text-secondary flex-shrink-0">
            <Icon size={22} />
          </div>
          <div>
            <div className="font-semibold text-[15px] tracking-[-0.1px]">{title}</div>
            <div className="text-xs text-tertiary mt-0.5 leading-tight">{subtitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-right">
          <div className={`text-[10px] font-mono tracking-[1.5px] px-3 py-1 rounded-full ${enabled ? 'bg-emerald-500/15 text-emerald-400' : 'bg-subtle text-tertiary'}`}>
            {enabled ? 'ENABLED' : 'DISABLED'}
          </div>
          <ChevronRight className="text-[#475569]" size={18} />
        </div>
      </div>
    </GlassCard>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const { vpnSettings, theme } = useVPNStore()

  return (
    <div className="pb-10 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={() => navigate('/app/profile')}
          className="p-2 -ml-2 text-secondary active:text-white transition-colors"
          aria-label="Back to Profile"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="font-semibold text-3xl tracking-[-0.8px]">Settings</div>
          <div className="text-tertiary text-sm">Configure your protection experience</div>
        </div>
      </div>

      {/* Quick status */}
      <GlassCard className="mb-8 bg-[var(--bg-subtle)] border-white/5" padding="sm">
        <div className="flex items-center gap-3 px-1 py-1">
          <Info size={16} className="text-[#3B82F6]" />
          <div className="text-xs text-secondary">
            All settings are saved automatically and sync across your devices.
          </div>
        </div>
      </GlassCard>

      {/* NEW: Theme / Appearance Switcher — full light theme support */}
      <div className="mb-6">
        <div className="uppercase tracking-[2px] text-xs text-secondary mb-3 px-1">APPEARANCE</div>
        <GlassCard interactive onClick={() => navigate('/app/appearance')} className="cursor-pointer mb-3" aria-label="Open Theme & Appearance settings">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-subtle flex items-center justify-center text-[var(--accent)]">
                <Palette size={22} />
              </div>
              <div>
                <div className="font-semibold">Theme &amp; Appearance</div>
                <div className="text-xs text-secondary">Light, Dark &amp; full component variants</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-secondary">
              <span className="capitalize font-medium">{theme}</span>
              <ChevronRight size={18} className="text-tertiary" />
            </div>
          </div>
        </GlassCard>

        {/* Quick toggle buttons — delightful instant feedback */}
        <div className="flex gap-3">
          <Button 
            variant={theme === 'dark' ? 'primary' : 'secondary'} 
            size="sm" 
            fullWidth
            leftIcon={<Moon size={16} />}
            onClick={() => {
              const { setTheme } = useVPNStore.getState()
              setTheme('dark')
              toast.success('Dark theme activated')
            }}
          >
            Dark
          </Button>
          <Button 
            variant={theme === 'light' ? 'primary' : 'secondary'} 
            size="sm" 
            fullWidth
            leftIcon={<Sun size={16} />}
            onClick={() => {
              const { setTheme } = useVPNStore.getState()
              setTheme('light')
              toast.success('Light theme activated — enjoy the clarity')
            }}
          >
            Light
          </Button>
        </div>
        <button 
          onClick={() => navigate('/app/theme-preview')}
          className="mt-3 w-full text-xs text-center text-[var(--accent)] hover:underline active:opacity-80"
        >
          Open full Theme Preview &amp; Component Variants →
        </button>
        <button 
          onClick={() => navigate('/app/light-demo')}
          className="mt-1 w-full text-xs text-center text-secondary hover:underline active:opacity-80"
        >
          Dedicated Light Experience Demo →
        </button>
      </div>

      {/* Settings List — the hub */}
      <div className="space-y-3">
        <SettingItem 
          icon={Shield} 
          title="Kill Switch" 
          subtitle="Block internet if VPN connection drops" 
          enabled={vpnSettings.killSwitch} 
          to="/app/settings/kill-switch" 
        />
        <SettingItem 
          icon={Lock} 
          title="Auto-Connect" 
          subtitle="Automatically connect on trusted Wi-Fi" 
          enabled={vpnSettings.autoConnect} 
          to="/app/settings/auto-connect" 
        />
        <SettingItem 
          icon={Bell} 
          title="Notifications" 
          subtitle="Connection status, security alerts & updates" 
          enabled={vpnSettings.notifications} 
          to="/app/settings/notifications" 
        />
      </div>

      {/* Footer actions */}
      <div className="mt-10 flex flex-col gap-3">
        <Button 
          variant="ghost" 
          size="md"
          onClick={() => {
            const { updateVpnSetting } = useVPNStore.getState()
            updateVpnSetting('killSwitch', true)
            updateVpnSetting('autoConnect', false)
            updateVpnSetting('notifications', true)
            toast.success('Settings reset to recommended defaults')
          }}
          className="text-tertiary hover:text-secondary"
        >
          Reset all to recommended defaults
        </Button>
        <div className="text-center text-[10px] text-[#475569] tracking-[2px] mt-2">
          AETHER VPN • PRIVACY FIRST
        </div>
      </div>
    </div>
  )
}
