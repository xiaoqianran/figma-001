import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sun, Shield } from 'lucide-react'
import { GlassCard, Button, VPNOrb } from '@/components/ui'
import { useVPNStore } from '@/store/vpnStore'

/**
 * LightDemo — Dedicated beautiful view showcasing the Light Theme experience.
 * 
 * A major standalone view highlighting how Aether looks & feels in bright light.
 * Perfect for demonstrating Figma Light Theme parity.
 * Fully functional with live orb and navigation back.
 */
export default function LightDemo() {
  const navigate = useNavigate()
  const { setTheme } = useVPNStore()

  return (
    <div className="pb-12 -mx-5 px-5 pt-6 bg-[var(--bg-base)] min-h-screen">
      {/* Light-specific elegant header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-3 -ml-3 text-secondary">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <Sun className="text-amber-500" size={22} />
            <div className="font-semibold text-3xl tracking-[-1px]">Light Experience</div>
          </div>
          <div className="text-secondary">Pure, crisp, and refined</div>
        </div>
      </div>

      <GlassCard padding="lg" className="mb-6 text-center">
        <div className="text-[var(--accent)] font-medium tracking-[3px] text-xs mb-2">FIGMA LIGHT THEME</div>
        <div className="text-2xl font-semibold tracking-tight mb-2">Clarity meets craft.</div>
        <p className="text-secondary max-w-[260px] mx-auto">Every surface, shadow and interaction reimagined for bright environments while keeping the soul of Aether intact.</p>
      </GlassCard>

      {/* Live Orb in Light Context */}
      <div className="mb-8">
        <div className="uppercase text-xs tracking-[2px] text-secondary mb-3 text-center">THE ORB — ELEVATED IN LIGHT</div>
        <GlassCard className="flex flex-col items-center py-10">
          <VPNOrb status="connected" size={220} />
          <div className="mt-6 text-center">
            <div className="text-emerald-600 font-semibold tracking-tight">PROTECTED</div>
            <div className="text-xs text-secondary mt-1">Connected to fastest server • 14ms</div>
          </div>
        </GlassCard>
      </div>

      {/* Sample Premium-style card in light */}
      <div className="mb-8">
        <div className="uppercase text-xs tracking-[2px] text-secondary mb-3 px-1">PREMIUM IN LIGHT</div>
        <GlassCard className="premium-card-accent border p-7">
          <div className="flex gap-4 items-start">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#22D3EE] flex items-center justify-center text-white flex-shrink-0">
              <Shield size={22} />
            </div>
            <div className="flex-1">
              <div className="uppercase text-xs tracking-[1.5px] text-[var(--accent)]">AETHER PRO</div>
              <div className="text-2xl font-semibold tracking-[-0.6px] mt-0.5">You’re unstoppable.</div>
              <div className="text-secondary mt-2">Unlimited devices • 94 servers • Priority support</div>
              <Button className="mt-6" fullWidth onClick={() => navigate('/app/premium')}>Manage Subscription</Button>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={() => { setTheme('dark'); navigate('/app/theme-preview') }}>View in Dark</Button>
        <Button onClick={() => navigate('/app/theme-preview')}>Full Variants →</Button>
      </div>

      <div className="text-center mt-10 text-[10px] tracking-[2px] text-tertiary">LIGHT THEME • CRAFTED FOR EVERY LIGHTING CONDITION</div>
    </div>
  )
}
