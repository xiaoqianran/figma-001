import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sun, Moon, Monitor, Check, Palette } from 'lucide-react'
import { GlassCard, Button, Toggle } from '@/components/ui'
import { useVPNStore } from '@/store/vpnStore'
import { toast } from 'sonner'

/**
 * Appearance — Dedicated beautiful theme & personalization hub.
 * 
 * First-class Light Theme support page.
 * Matches Figma Light Theme + Design System spirit.
 * Persisted instantly via store + CSS vars.
 */
export default function Appearance() {
  const navigate = useNavigate()
  const { theme, setTheme, toggleTheme, reduceMotion = false, largerText = false, setReduceMotion, setLargerText } = useVPNStore()

  const themes = [
    {
      id: 'dark' as const,
      label: 'Dark',
      icon: Moon,
      desc: 'Signature deep void. The original Aether experience.',
      preview: 'from-[#05070A] to-[#0C0F14]',
      accent: 'border-[#3B82F6]/60',
    },
    {
      id: 'light' as const,
      label: 'Light',
      icon: Sun,
      desc: 'Clean, bright & elegant. Full Figma Light Theme parity.',
      preview: 'from-[#F8FAFC] to-white',
      accent: 'border-slate-300',
    },
  ]

  const handleThemeSelect = (newTheme: 'dark' | 'light') => {
    if (newTheme !== theme) {
      setTheme(newTheme)
      toast.success(`Switched to ${newTheme} theme`, {
        description: 'Your preference is saved across sessions.',
      })
    }
  }

  return (
    <div className="pb-12 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={() => navigate('/app/profile')}
          className="p-2 -ml-2 text-secondary active:text-[var(--text-primary)] transition-colors"
          aria-label="Back to Profile"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="font-semibold text-3xl tracking-[-0.8px]">Appearance</div>
          <div className="text-secondary text-sm">Theme, contrast &amp; personalization</div>
        </div>
      </div>

      {/* Current Status */}
      <GlassCard className="mb-8" padding="md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-subtle flex items-center justify-center">
              <Palette size={22} className="text-[var(--accent)]" />
            </div>
            <div>
              <div className="font-semibold">Current Theme</div>
              <div className="text-secondary text-sm capitalize flex items-center gap-1.5 mt-0.5">
                {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                {theme} mode — beautiful on every device
              </div>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={toggleTheme}
            leftIcon={theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          >
            Switch
          </Button>
        </div>
      </GlassCard>

      {/* Theme Selection — Large beautiful cards */}
      <div className="mb-8">
        <div className="uppercase tracking-[2px] text-xs text-secondary mb-3 px-1">CHOOSE YOUR THEME</div>
        
        <div className="space-y-4">
          {themes.map((t) => {
            const Icon = t.icon
            const isActive = theme === t.id
            
            return (
              <button
                key={t.id}
                onClick={() => handleThemeSelect(t.id)}
                className={`glass w-full text-left rounded-3xl p-6 active:scale-[0.985] transition-all border flex items-start gap-5 group ${isActive ? `ring-1 ring-[var(--accent)] ${t.accent}` : 'hover:border-[var(--border-strong)]'} focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.preview} flex items-center justify-center flex-shrink-0 shadow-inner border border-[var(--border)]`}>
                  <Icon size={26} className={isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'} />
                </div>
                
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-xl tracking-[-0.4px]">{t.label} Theme</div>
                    {isActive && (
                      <div className="flex items-center gap-1 text-[var(--accent)] text-sm font-medium">
                        <Check size={18} /> Active
                      </div>
                    )}
                  </div>
                  <div className="text-secondary mt-1.5 pr-4 text-[15px] leading-snug">
                    {t.desc}
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-xs text-tertiary">
                    <div className="px-3 py-1 rounded-full bg-subtle">Full variant support</div>
                    <div className="px-3 py-1 rounded-full bg-subtle">Instant switch</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Future / Additional Appearance Options */}
      <div>
        <div className="uppercase tracking-[2px] text-xs text-secondary mb-3 px-1">MORE OPTIONS</div>
        
        <GlassCard className="mb-3" interactive padding="md">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-medium">Reduce Motion</div>
              <div className="text-xs text-secondary mt-0.5">Minimize non-essential animations</div>

              {/* Live preview — obvious instant feedback */}
              <div className="mt-3 flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full bg-[#3B82F6] ${!reduceMotion ? 'animate-pulse' : ''}`} />
                <span className="text-[10px] text-tertiary">{reduceMotion ? 'Motion reduced' : 'Animating normally'}</span>
              </div>
            </div>
            <Toggle
              checked={reduceMotion}
              onCheckedChange={(v) => {
                setReduceMotion(v)
                toast.success(v ? 'Reduced motion enabled' : 'Reduced motion disabled', {
                  description: v ? 'Non-essential animations are minimized.' : 'Full motion restored.',
                })
              }}
              aria-label="Reduce Motion"
            />
          </div>
        </GlassCard>

        <GlassCard className="mb-3" interactive padding="md">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-medium">Larger Text</div>
              <div className="text-xs text-secondary mt-0.5">Increase UI scale for readability</div>

              {/* Live preview — obvious instant feedback */}
              <div className="mt-3 text-[10px] text-tertiary" style={{ fontSize: largerText ? '13px' : '10px' }}>
                Sample text scales {largerText ? 'up' : 'normally'}
              </div>
            </div>
            <Toggle
              checked={largerText}
              onCheckedChange={(v) => {
                setLargerText(v)
                toast.success(v ? 'Larger text enabled' : 'Default text size restored', {
                  description: v ? 'UI elements are scaled up for easier reading.' : undefined,
                })
              }}
              aria-label="Larger Text"
            />
          </div>
        </GlassCard>

        <div className="mt-8 text-center">
          <div onClick={() => navigate('/app/theme-preview')} className="inline-flex items-center gap-2 text-[var(--accent)] text-sm font-medium active:opacity-70 cursor-pointer">
            Explore full component variants in Theme Preview <Monitor size={16} />
          </div>
          <div className="text-[10px] text-tertiary mt-6 tracking-[1.5px]">AETHER • CRAFTED WITH CARE</div>
        </div>
      </div>
    </div>
  )
}
