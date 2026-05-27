import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'

// Onboarding & Auth
import Welcome from '@/pages/Welcome'
import Onboarding from '@/pages/Onboarding'
import LetsYouIn from '@/pages/LetsYouIn'
import SignIn from '@/pages/SignIn'
import SignUp from '@/pages/SignUp'

// Main App
import AppShell from '@/components/AppShell'
import Home from '@/pages/Home'
import Locations from '@/pages/Locations'
import Activity from '@/pages/Activity'
import Profile from '@/pages/Profile'
import Speedtest from '@/pages/Speedtest'

// Settings pages
import Settings from '@/pages/Settings'
import SettingsKillSwitch from '@/pages/SettingsKillSwitch'
import SettingsAutoConnect from '@/pages/SettingsAutoConnect'
import SettingsNotifications from '@/pages/SettingsNotifications'
import Premium from '@/pages/Premium'
import PaymentMethods from '@/pages/PaymentMethods'
import Billing from '@/pages/Billing'
import Privacy from '@/pages/Privacy'
import Referral from '@/pages/Referral'
import FAQ from '@/pages/FAQ'
import Help from '@/pages/Help'

// Account Security
import Security from '@/pages/Security'
import TwoFA from '@/pages/TwoFA'
import Devices from '@/pages/Devices'

// Light Theme + Full Variants (core deliverables — fully implemented)
import Appearance from '@/pages/Appearance'
import ThemePreview from '@/pages/ThemePreview'
import LightDemo from '@/pages/LightDemo'

// High-value new pages (Server Map visual selection, Notifications Center, Advanced Diagnostics)
import ServerMap from '@/pages/ServerMap'
import Notifications from '@/pages/Notifications'
import Diagnostics from '@/pages/Diagnostics'

// Dev-only
import ComponentPreview from '@/pages/ComponentPreview'

// Theme
import { useVPNStore } from '@/store/vpnStore'

export default function App() {
  const { theme, reduceMotion = false, largerText = false } = useVPNStore()

  // Apply data-theme + accessibility attributes (Reduce Motion + Larger Text) to root
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.setAttribute('data-reduce-motion', reduceMotion ? 'true' : 'false')
    root.setAttribute('data-larger-text', largerText ? 'true' : 'false')

    // Also sync body class if needed for any tailwind dark: (future proof)
    if (theme === 'light') {
      document.body.classList.add('theme-light')
      document.body.classList.remove('theme-dark')
    } else {
      document.body.classList.add('theme-dark')
      document.body.classList.remove('theme-light')
    }
  }, [theme, reduceMotion, largerText])

  return (
    <BrowserRouter>
      <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
        <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-200">
          <Routes>
          {/* Public / Onboarding Flow */}
          <Route path="/" element={<Welcome />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/lets-you-in" element={<LetsYouIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Authenticated App — Beautiful cohesive experience */}
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="speedtest" element={<Speedtest />} />
            <Route path="locations" element={<Locations />} />
            <Route path="activity" element={<Activity />} />
            <Route path="profile" element={<Profile />} />

            {/* Settings hub + dedicated sub-pages (Kill Switch, Auto-Connect, Notifications) */}
            <Route path="settings" element={<Settings />} />
            <Route path="settings/kill-switch" element={<SettingsKillSwitch />} />
            <Route path="settings/auto-connect" element={<SettingsAutoConnect />} />
            <Route path="settings/notifications" element={<SettingsNotifications />} />

            <Route path="premium" element={<Premium />} />
            <Route path="payment-methods" element={<PaymentMethods />} />
            <Route path="billing" element={<Billing />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="referral" element={<Referral />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="help" element={<Help />} />

            {/* Account Security pages */}
            <Route path="security" element={<Security />} />
            <Route path="2fa" element={<TwoFA />} />
            <Route path="devices" element={<Devices />} />

            {/* Light Theme + Full Variants pages (new major deliverables) */}
            <Route path="appearance" element={<Appearance />} />
            <Route path="theme-preview" element={<ThemePreview />} />
            <Route path="light-demo" element={<LightDemo />} />

            {/* High-value simulation pages: Server Map + Notifications Center + Advanced Diagnostics/Connection Quality (added by agents) */}
            <Route path="server-map" element={<ServerMap />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="diagnostics" element={<Diagnostics />} />
          </Route>

          {/* Dev-only Component Library Preview (safe in production) */}
          {import.meta.env.DEV && (
            <Route path="/dev/components" element={<ComponentPreview />} />
          )}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </div>
      </MotionConfig>

      <Toaster 
        position="top-center" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            background: 'var(--bg-glass)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            backdropFilter: 'blur(24px)',
          }
        }}
      />
    </BrowserRouter>
  )
}
