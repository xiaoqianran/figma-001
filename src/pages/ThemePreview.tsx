import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sun, Moon, RotateCcw, Eye, Zap } from 'lucide-react'
import { useState } from 'react'
import { 
  GlassCard, Button, Input, Toggle, SettingsRow, VPNOrb 
} from '@/components/ui'
import { useVPNStore } from '@/store/vpnStore'
import { toast } from 'sonner'

/**
 * ThemePreview — Full Light + Dark component matrix + live preview.
 * 
 * The definitive showcase page for the new Light Theme support.
 * Shows every major primitive and composite in both themes.
 * Includes interactive controls and beautiful Figma-aligned sections.
 * 
 * Route: /app/theme-preview
 * Also accessible from Appearance and Settings.
 */
export default function ThemePreview() {
  const navigate = useNavigate()
  const { theme, toggleTheme, setTheme } = useVPNStore()
  
  const [inputValue, setInputValue] = useState('aether.vpn')
  const [toggle1, setToggle1] = useState(true)
  const [toggle2, setToggle2] = useState(false)
  const [orbStatus, setOrbStatus] = useState<'idle' | 'connecting' | 'connected'>('idle')

  const isLight = theme === 'light'

  const sampleServers = [
    { city: 'New York', country: 'United States', flag: '🇺🇸', ping: 12 },
    { city: 'London', country: 'United Kingdom', flag: '🇬🇧', ping: 24 },
  ]

  const cycleOrb = () => {
    const next = orbStatus === 'idle' ? 'connecting' : orbStatus === 'connecting' ? 'connected' : 'idle'
    setOrbStatus(next)
    if (next === 'connected') {
      toast.success('Preview: Connected state')
    }
  }

  const resetAll = () => {
    setInputValue('aether.vpn')
    setToggle1(true)
    setToggle2(false)
    setOrbStatus('idle')
    toast.info('Preview state reset')
  }

  return (
    <div className="pb-16 max-w-lg mx-auto">
      {/* Sticky beautiful header */}
      <div className="sticky top-0 z-40 -mx-5 px-5 pt-2 pb-4 bg-[var(--bg-base)]/95 backdrop-blur-xl border-b border-[var(--border)] mb-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-secondary active:text-[var(--text-primary)] flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={20} /> Back
          </button>
          
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-subtle text-xs font-mono tracking-[1.5px] flex items-center gap-1.5">
              {isLight ? <Sun size={14} /> : <Moon size={14} />} 
              {theme.toUpperCase()} THEME
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={toggleTheme}
              leftIcon={isLight ? <Moon size={15} /> : <Sun size={15} />}
            >
              Switch
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Intro */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-subtle text-xs tracking-[2px] mb-3">
          <Eye size={14} /> FULL DESIGN SYSTEM
        </div>
        <h1 className="font-display text-4xl tracking-[-1.5px] font-semibold">Theme Preview</h1>
        <p className="text-secondary mt-2 max-w-[300px] mx-auto text-[15px]">
          Every component, every variant — rendered live in the current theme.
          Switch anytime. Full Light Theme parity with Figma.
        </p>
        <div className="flex justify-center gap-3 mt-5">
          <Button size="sm" variant="ghost" onClick={resetAll} leftIcon={<RotateCcw size={15} />}>
            Reset State
          </Button>
          <Button size="sm" onClick={() => navigate('/app/appearance')} leftIcon={<Zap size={15} />}>
            Appearance Settings
          </Button>
        </div>
      </div>

      {/* 1. Typography & Tokens */}
      <section className="mb-10">
        <div className="uppercase tracking-[2px] text-xs text-secondary mb-3 px-1">TYPOGRAPHY &amp; TOKENS</div>
        <GlassCard padding="lg">
          <div className="space-y-6">
            <div>
              <div className="text-[10px] text-tertiary mb-1">DISPLAY / HEADINGS</div>
              <div className="font-display text-4xl tracking-[-2px]">Invisible. Unbreakable.</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-tertiary text-xs">PRIMARY</div>
                <div className="font-semibold text-xl tracking-tight mt-0.5">The World Unlocked</div>
              </div>
              <div>
                <div className="text-tertiary text-xs">SECONDARY</div>
                <div className="text-secondary mt-0.5">Zero-knowledge encryption with beautiful craft.</div>
              </div>
            </div>
            <div className="pt-4 border-t border-[var(--border)] flex gap-4 text-xs">
              <div className="flex-1"><span className="text-tertiary">Accent:</span> <span className="font-mono text-[var(--accent)]">#3B82F6</span></div>
              <div className="flex-1"><span className="text-tertiary">Success:</span> <span className="font-mono text-[#10B981]">#10B981</span></div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* 2. Buttons — All Variants & Sizes */}
      <section className="mb-10">
        <div className="uppercase tracking-[2px] text-xs text-secondary mb-3 px-1">BUTTONS — FULL MATRIX</div>
        <div className="space-y-3">
          {/* Sizes row */}
          <GlassCard padding="md">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => toast('sm')}>Small</Button>
              <Button size="md" onClick={() => toast('md')}>Medium</Button>
              <Button size="lg" onClick={() => toast('lg')}>Large</Button>
              <Button size="xl" onClick={() => toast('xl')}>Extra Large</Button>
            </div>
          </GlassCard>

          {/* Variants */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex gap-3">
              <Button variant="primary" onClick={() => toast.success('Primary action')} fullWidth>Primary</Button>
              <Button variant="secondary" onClick={() => toast('Secondary')} fullWidth>Secondary</Button>
            </div>
            <Button variant="ghost" onClick={() => toast.info('Ghost')}>Ghost / Subtle</Button>
            <Button variant="primary" loading>Connecting…</Button>
          </div>
        </div>
      </section>

      {/* 3. Inputs + States */}
      <section className="mb-10">
        <div className="uppercase tracking-[2px] text-xs text-secondary mb-3 px-1">INPUTS — RICH VARIANTS</div>
        <GlassCard padding="lg" className="space-y-5">
          <Input 
            label="Server Hostname" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="Enter hostname" 
            leftIcon={<span className="text-tertiary">🌐</span>}
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            hint="At least 8 characters" 
          />
          <Input 
            label="With Error" 
            value="invalid@"
            error="Please enter a valid email address" 
          />
          <div className="pt-2">
            <div className="text-xs text-tertiary mb-2">Search Input</div>
            <div className="relative">
              <Input placeholder="Search 94 servers across 6 continents..." />
            </div>
          </div>
        </GlassCard>
      </section>

      {/* 4. VPN Orb — Hero Component */}
      <section className="mb-10">
        <div className="uppercase tracking-[2px] text-xs text-secondary mb-3 px-1 flex items-center justify-between">
          <span>THE HERO — VPN ORB (ALL STATES)</span>
          <Button variant="ghost" size="sm" onClick={cycleOrb}>Cycle States</Button>
        </div>
        <GlassCard padding="lg" className="flex flex-col items-center">
          <VPNOrb 
            status={orbStatus} 
            size={220}
            onToggle={() => {
              const next = orbStatus === 'connected' ? 'idle' : 'connected'
              setOrbStatus(next)
            }} 
          />
          <div className="mt-6 text-center">
            <div className="font-mono text-xs tracking-[2px] text-tertiary mb-1">STATUS: {orbStatus.toUpperCase()}</div>
            <div className="text-sm text-secondary">Tap orb or use Cycle — fully interactive in preview</div>
          </div>
          <div className="flex gap-2 mt-6">
            {(['idle', 'connecting', 'connected'] as const).map(s => (
              <Button 
                key={s} 
                variant={orbStatus === s ? 'primary' : 'secondary'} 
                size="sm" 
                onClick={() => setOrbStatus(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* 5. Toggles */}
      <section className="mb-10">
        <div className="uppercase tracking-[2px] text-xs text-secondary mb-3 px-1">TOGGLES — Figma Precision</div>
        <GlassCard padding="md" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Kill Switch</div>
              <div className="text-xs text-secondary">Always-on protection</div>
            </div>
            <Toggle checked={toggle1} onCheckedChange={setToggle1} size="lg" />
          </div>
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-6">
            <div>
              <div className="font-medium">Auto-Connect</div>
              <div className="text-xs text-secondary">On trusted networks only</div>
            </div>
            <Toggle checked={toggle2} onCheckedChange={setToggle2} size="md" label="Wi-Fi" />
          </div>
        </GlassCard>
      </section>

      {/* 6. Settings Rows & Cards */}
      <section className="mb-10">
        <div className="uppercase tracking-[2px] text-xs text-secondary mb-3 px-1">SETTINGS ROWS + GLASS COMPOSITES</div>
        <div className="space-y-3">
          <SettingsRow 
            icon={Sun} 
            title="Appearance" 
            subtitle="Light & Dark theme with full variants" 
            to="/app/appearance" 
            status="on"
          />
          <SettingsRow 
            icon={Moon} 
            title="Theme Preview" 
            subtitle="Complete component matrix" 
            onClick={() => { /* already here */ }} 
          />
          <SettingsRow 
            icon={Zap} 
            title="Advanced Diagnostics" 
            subtitle="Speed, latency & packet loss" 
            status={toggle1 ? 'on' : 'off'} 
          />
        </div>
      </section>

      {/* 7. Server Cards (Locations style) */}
      <section className="mb-10">
        <div className="uppercase tracking-[2px] text-xs text-secondary mb-3 px-1">SERVER CARDS — LOCATIONS</div>
        <div className="space-y-3">
          {sampleServers.map((srv, idx) => (
            <div key={idx} className="server-card flex items-center justify-between px-5 py-4 active:scale-[0.985]">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{srv.flag}</div>
                <div>
                  <div className="font-semibold tracking-tight">{srv.city}</div>
                  <div className="text-xs text-secondary">{srv.country}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm text-emerald-400">{srv.ping} ms</div>
                <div className="text-[10px] text-tertiary">Load 28%</div>
              </div>
            </div>
          ))}
          <div className="text-center text-xs text-tertiary pt-1">Active server gets accent border automatically</div>
        </div>
      </section>

      {/* 8. Full Variant Notes + CTA */}
      <GlassCard className="text-center py-8" padding="lg">
        <div className="mx-auto w-10 h-10 rounded-2xl bg-subtle flex items-center justify-center mb-4">
          <Eye className="text-[var(--accent)]" size={20} />
        </div>
        <div className="font-semibold text-xl tracking-tight mb-2">Full Variants Supported</div>
        <p className="text-secondary text-sm max-w-xs mx-auto">
          Light theme mirrors every dark token: glass, orb, inputs, buttons, cards, toggles, status, typography.
          All pages now respect your choice.
        </p>
        <div className="mt-6 flex flex-col gap-2 items-center">
          <Button onClick={() => navigate('/app')} variant="secondary" fullWidth>
            Return to Home
          </Button>
          <div onClick={() => { setTheme(isLight ? 'dark' : 'light'); toast.success('Theme switched from preview') }} className="text-xs text-[var(--accent)] cursor-pointer mt-1">
            Quick toggle from here too
          </div>
        </div>
      </GlassCard>

      <div className="h-10" />
    </div>
  )
}
