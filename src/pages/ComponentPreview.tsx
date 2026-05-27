import { useState } from 'react'
import { Mail, Lock, Search, User, ArrowRight, Globe } from 'lucide-react'
import { 
  Button, Input, GlassCard, VPNOrb, 
  Select, Checkbox, RadioGroup, FormField, Toggle,
  Modal, BottomSheet, SettingsRow
} from '@/components/ui'
import { Shield, Bell, Zap } from 'lucide-react'

/**
 * Dev-only Component Library Explorer.
 * Visit /dev/components (available in development builds only).
 *
 * Showcases the complete Aether UI Component Library — Phase 1 foundations + expanded
 * form controls, overlays (Modal/BottomSheet), and layout primitives (SettingsRow).
 * Used for visual QA, documentation, and highlighting newest components.
 */
export default function ComponentPreview() {
  const [search, setSearch] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)

  // New form component demo states
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('us')
  const [agree, setAgree] = useState(false)
  const [plan, setPlan] = useState('pro')
  const [notifications, setNotifications] = useState(true)

  // Overlay demo state
  const [showModal, setShowModal] = useState(false)
  const [showBottomSheet, setShowBottomSheet] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl tracking-[-1.5px] mb-2">Aether UI — Component Library</h1>
        <p className="text-tertiary mb-10">
          Complete production library • Foundations + Advanced Forms + Overlays (Modal/BottomSheet) + SettingsRow
          <span className="block text-xs mt-1 opacity-70">Newest highlights: Modal, BottomSheet, SettingsRow, full Input matrix. Dev-only explorer for wrap-up verification.</span>
        </p>

        {/* === Core Primitives === */}
        <div className="mb-4 text-xs uppercase tracking-[2px] text-tertiary">Core Primitives</div>

        {/* Buttons Section */}
        <GlassCard className="mb-10">
          <h2 className="text-xl font-semibold mb-6 tracking-tight">Button</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary (lg)</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="xl" rightIcon={<ArrowRight size={18} />}>
              Extra Large
            </Button>
            <Button variant="secondary" fullWidth className="max-w-xs">
              Full Width
            </Button>
          </div>
        </GlassCard>

        {/* Inputs Section */}
        <GlassCard className="mb-10">
          <h2 className="text-xl font-semibold mb-6 tracking-tight">Input</h2>
          <div className="space-y-6 max-w-md">
            <Input
              label="EMAIL ADDRESS"
              placeholder="you@domain.com"
              leftIcon={<Mail size={18} />}
            />

            <Input
              label="PASSWORD"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="text-tertiary hover:text-white"
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              }
              hint="Use a strong, unique password"
            />

            <Input
              label="SEARCH"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search servers..."
              leftIcon={<Search size={18} />}
            />

            <Input
              label="FULL NAME"
              placeholder="Alex Rivera"
              leftIcon={<User size={18} />}
              error="Name is required"
            />

            {/* Advanced Input matrix demos */}
            <Input
              label="PHONE NUMBER"
              prefix="+1"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              leftIcon={<Globe size={18} />}
              hint="Supports country code prefixes for international numbers"
            />

            <Input
              label="INVITE CODE"
              variant="filled"
              placeholder="AETHER-2026"
              hint="Using filled variant for secondary / compact fields"
            />
          </div>
        </GlassCard>

        {/* Form Controls — Checkbox, RadioGroup, Select, FormField, Toggle */}
        <GlassCard className="mb-10">
          <h2 className="text-xl font-semibold mb-6 tracking-tight">Form Controls</h2>
          <div className="space-y-8 max-w-md">
            {/* Select */}
            <Select
              label="SERVER LOCATION"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              options={[
                { value: 'us', label: 'United States — New York' },
                { value: 'uk', label: 'United Kingdom — London' },
                { value: 'jp', label: 'Japan — Tokyo' },
                { value: 'sg', label: 'Singapore' },
              ]}
              placeholder="Choose a region"
            />

            {/* Checkbox */}
            <div>
              <div className="text-xs tracking-widest text-tertiary mb-2 pl-1">CHECKBOX</div>
              <Checkbox
                checked={agree}
                onCheckedChange={setAgree}
                label="I agree to the Terms of Service and Privacy Policy"
                description="You can change this later in Account Settings."
              />
            </div>

            {/* RadioGroup */}
            <RadioGroup
              label="SUBSCRIPTION PLAN"
              options={[
                { value: 'free', label: 'Free', description: 'Basic speeds • 1 device' },
                { value: 'pro', label: 'Pro — Recommended', description: 'Unlimited speed • 5 devices • Priority support' },
                { value: 'family', label: 'Family', description: '10 devices • Shared billing' },
              ]}
              value={plan}
              onValueChange={setPlan}
              hint="Choose the plan that fits your needs"
            />

            {/* FormField wrapper example */}
            <FormField label="NOTIFICATIONS" hint="Control global alerts">
              <div className="pt-1">
                <Toggle 
                  checked={notifications} 
                  onCheckedChange={setNotifications} 
                  size="md" 
                  label="Enable push notifications" 
                />
              </div>
            </FormField>

            {/* Simple standalone Toggle for completeness */}
            <div>
              <div className="text-xs tracking-widest text-tertiary mb-2 pl-1">TOGGLE (existing)</div>
              <Toggle checked={notifications} onCheckedChange={setNotifications} label="Kill Switch (demo)" />
            </div>
          </div>
        </GlassCard>

        {/* SettingsRow — newest widely-adopted layout primitive (used across Profile, Settings hubs) */}
        <GlassCard className="mb-10">
          <h2 className="text-xl font-semibold mb-6 tracking-tight">SettingsRow (Newest Layout Primitive)</h2>
          <p className="text-tertiary mb-4 text-sm">Reusable settings list rows with icon, chevron, navigation, and right content support. Replaces duplicated markup everywhere.</p>
          <div className="space-y-2 max-w-md">
            <SettingsRow icon={Shield} title="Kill Switch" subtitle="Block all traffic if VPN drops" to="/app/settings/kill-switch" />
            <SettingsRow icon={Zap} title="Auto-Connect" subtitle="Connect on trusted networks" status="on" />
            <SettingsRow icon={Bell} title="Notifications" subtitle="Manage alerts & preferences" rightElement={<Toggle checked={notifications} onCheckedChange={setNotifications} size="sm" />} />
          </div>
          <div className="mt-3 text-[10px] text-tertiary">Fully wired to React Router + store where used in production pages.</div>
        </GlassCard>

        {/* GlassCard variants */}
        <GlassCard className="mb-10">
          <h2 className="text-xl font-semibold mb-6 tracking-tight">GlassCard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard interactive>
              Default + Interactive (hover me)
            </GlassCard>
            <GlassCard variant="strong">
              Strong variant
            </GlassCard>
            <GlassCard accent>
              With accent border
            </GlassCard>
            <GlassCard padding="sm">
              Small padding
            </GlassCard>
          </div>
        </GlassCard>

        {/* VPNOrb - The Crown Jewel */}
        <GlassCard className="mb-10">
          <h2 className="text-xl font-semibold mb-6 tracking-tight">VPNOrb — The Hero</h2>
          <p className="text-tertiary mb-8 text-sm">
            The single most important interaction in Aether. Click the orb below to cycle states.
          </p>
          
          <InteractiveOrbDemo />
          
          <div className="mt-8 text-center text-xs text-tertiary">
            This is the exact component used in the real Home screen.
          </div>
        </GlassCard>

        {/* === Overlays === */}
        <div className="mb-4 text-xs uppercase tracking-[2px] text-tertiary">Overlays</div>

        {/* Overlay System Demo (Modal + BottomSheet) — newest additions */}
        <GlassCard className="mb-10">
          <h2 className="text-xl font-semibold mb-6 tracking-tight">Overlays — Modal &amp; BottomSheet (Newest)</h2>
          <p className="text-tertiary mb-6 text-sm">
            Production-ready overlay primitives with focus trap, ESC, animations, and full accessibility.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setShowModal(true)}>Open Modal</Button>
            <Button variant="secondary" onClick={() => setShowBottomSheet(true)}>Open BottomSheet</Button>
          </div>
          <div className="mt-4 text-xs text-tertiary">
            Fully accessible (focus trap, ESC, ARIA, drag-to-dismiss on sheet). Used in Speedtest share + preview demos.
          </div>
        </GlassCard>

        <p className="text-center text-tertiary text-sm mt-12">
          Aether UI Component Library — Wrap-up complete • All primitives, forms, overlays &amp; layout rows production-ready
        </p>

        {/* Modal Demo */}
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          title="Confirm Action"
          description="This is a reusable Modal component with focus trap and spring animations."
        >
          <p className="text-secondary">This demonstrates the new Modal primitive.</p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={() => setShowModal(false)}>Confirm</Button>
          </div>
        </Modal>

        {/* BottomSheet Demo */}
        <BottomSheet
          open={showBottomSheet}
          onClose={() => setShowBottomSheet(false)}
          title="Quick Actions"
        >
          <div className="space-y-3 py-2">
            <Button fullWidth variant="secondary">Share Result</Button>
            <Button fullWidth variant="secondary">Export Data</Button>
            <Button fullWidth onClick={() => setShowBottomSheet(false)}>Close</Button>
          </div>
        </BottomSheet>
      </div>
    </div>
  )
}

function InteractiveOrbDemo() {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected'>('idle')

  const handleToggle = () => {
    if (status === 'idle') {
      setStatus('connecting')
      setTimeout(() => setStatus('connected'), 1200)
    } else if (status === 'connected') {
      setStatus('idle')
    } else {
      // during connecting, do nothing
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div onClick={handleToggle} className="cursor-pointer">
        <VPNOrb 
          status={status} 
          size={220} 
          onToggle={handleToggle}
          disabled={status === 'connecting'}
        />
      </div>
      
      <div className="mt-4 flex gap-3 text-xs">
        <div className={`px-3 py-1 rounded-full ${status === 'idle' ? 'bg-[var(--bg-subtle)] text-white' : 'text-tertiary'}`}>
          Idle
        </div>
        <div className={`px-3 py-1 rounded-full ${status === 'connecting' ? 'bg-[#22D3EE]/20 text-[#22D3EE]' : 'text-tertiary'}`}>
          Connecting
        </div>
        <div className={`px-3 py-1 rounded-full ${status === 'connected' ? 'bg-emerald-500/20 text-emerald-400' : 'text-tertiary'}`}>
          Connected
        </div>
      </div>
      
      <p className="mt-3 text-[10px] text-tertiary">
        Click the orb to simulate connection flow
      </p>
    </div>
  )
}
