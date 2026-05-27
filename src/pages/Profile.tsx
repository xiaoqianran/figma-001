import { useNavigate } from 'react-router-dom'
import { LogOut, Shield, Bell, Lock, CreditCard, ChevronRight, Crown, KeyRound, HelpCircle, MessageCircle, Gift, UserCog } from 'lucide-react'
import { useVPNStore } from '@/store/vpnStore'
import { toast } from 'sonner'
import { SettingsRow } from '@/components/ui'

export default function Profile() {
  const navigate = useNavigate()
  const { user, disconnect, vpnSettings } = useVPNStore()

  const handleLogout = () => {
    disconnect()
    toast.success('Signed out')
    navigate('/')
  }

  return (
    <div className="pb-8">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#22D3EE] flex items-center justify-center text-2xl font-semibold text-white tracking-tighter">
          {user.avatar}
        </div>
        <div>
          <div className="font-semibold text-2xl tracking-[-0.5px]">{user.name}</div>
          <div className="text-secondary text-sm">{user.email}</div>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="glass rounded-3xl p-6 mb-8 border border-[var(--accent)]/30">
        <div className="flex justify-between items-start">
          <div>
            <div className="uppercase tracking-[2px] text-xs text-[var(--accent-2)]">CURRENT PLAN</div>
            <div className="text-2xl font-semibold tracking-tight mt-1">{user.plan}</div>
          </div>
          <div className="text-right text-xs text-tertiary">
            Renews<br />
            <span className="text-secondary font-medium">{user.expiresAt}</span>
          </div>
        </div>
        <button 
          onClick={() => navigate('/app/premium')}
          className="mt-5 text-sm font-medium text-[var(--accent)] flex items-center gap-1 active:opacity-70"
        >
          Manage Subscription <ChevronRight size={15} />
        </button>
      </div>

      {/* Settings — fully linked to the new Settings hub & dedicated pages (now powered by shared SettingsRow component) */}
      <div className="space-y-3">
        <SettingsRow 
          icon={KeyRound} 
          title="Account Security" 
          subtitle="Password, 2FA &amp; active devices" 
          onClick={() => navigate('/app/security')}
        />

        {/* Appearance — prominent new theme entry point in Profile (using shared SettingsRow) */}
        <SettingsRow 
          icon={<span className="text-[var(--accent)] text-lg leading-none">🎨</span>} 
          title="Appearance" 
          subtitle="Light &amp; Dark themes • Full variants" 
          onClick={() => navigate('/app/appearance')}
        />

        <SettingsRow 
          icon={Shield} 
          title="Kill Switch" 
          subtitle="Always-on protection" 
          to="/app/settings/kill-switch"
          status={vpnSettings.killSwitch ? 'on' : 'off'}
        />
        <SettingsRow 
          icon={Lock} 
          title="Auto-Connect" 
          subtitle="On trusted Wi-Fi only" 
          to="/app/settings/auto-connect"
          status={vpnSettings.autoConnect ? 'on' : 'off'}
        />
        <SettingsRow 
          icon={Bell} 
          title="Notifications" 
          subtitle="Connection alerts & updates" 
          to="/app/settings/notifications"
          status={vpnSettings.notifications ? 'on' : 'off'}
        />
        <SettingsRow 
          icon={Bell} 
          title="Notifications Center" 
          subtitle="View history, simulate & manage preferences" 
          onClick={() => navigate('/app/notifications')}
        />
        <SettingsRow 
          icon={CreditCard} 
          title="Billing & Invoices" 
          subtitle="Payment history & receipts" 
          onClick={() => navigate('/app/billing')} 
        />
        <SettingsRow 
          icon={Crown} 
          title="Premium & Plans" 
          subtitle="Upgrade or manage subscription" 
          onClick={() => navigate('/app/premium')} 
        />
        <SettingsRow 
          icon={CreditCard} 
          title="Payment Methods" 
          subtitle="Cards, PayPal, Apple Pay & more" 
          onClick={() => navigate('/app/payment-methods')} 
        />
        <SettingsRow 
          icon={HelpCircle} 
          title="Help &amp; Support" 
          subtitle="FAQ, contact options &amp; tickets" 
          onClick={() => navigate('/app/help')} 
        />
        <SettingsRow 
          icon={MessageCircle} 
          title="Frequently Asked Questions" 
          subtitle="Privacy, security &amp; troubleshooting" 
          onClick={() => navigate('/app/faq')} 
        />
        <SettingsRow 
          icon={Gift} 
          title="Referral Program" 
          subtitle="Invite friends • earn free months" 
          to="/app/referral" 
        />
        <SettingsRow 
          icon={UserCog} 
          title="Privacy &amp; Data" 
          subtitle="Control what Aether collects" 
          to="/app/privacy" 
        />
      </div>

      <button
        onClick={handleLogout}
        className="mt-10 w-full flex items-center justify-center gap-2 text-red-500 font-medium py-3"
      >
        <LogOut size={17} /> Sign Out
      </button>

      <div className="text-center text-[10px] text-tertiary mt-8 tracking-widest">AETHER v1.4.2 • BUILD 2026.03</div>
    </div>
  )
}
