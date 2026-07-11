import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Home, MapPin, Activity as ActivityIcon, User, Gauge } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVPNStore } from '@/store/vpnStore'

const navItems = [
  { to: '/app', icon: Home, label: 'Home', end: true },
  { to: '/app/speedtest', icon: Gauge, label: 'Speedtest' },
  { to: '/app/locations', icon: MapPin, label: 'Locations' },
  { to: '/app/activity', icon: ActivityIcon, label: 'Activity' },
  { to: '/app/profile', icon: User, label: 'Profile', end: true },
]

export default function AppShell() {
  const location = useLocation()
  const { isConnected, currentServer } = useVPNStore()

  return (
    <div className="min-h-screen pb-20 bg-[var(--bg-base)]">
      {/* Skip link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-white focus:rounded-xl focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      {/* Top Status Bar — fully theme responsive */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-5 h-11 bg-[var(--bg-glass)] backdrop-blur-xl border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-[2px] text-secondary uppercase">AETHER</span>
          </div>
        </div>
        
        {isConnected && currentServer && (
          <div className="flex items-center gap-2 rounded-full bg-subtle px-3 py-1 text-xs">
            <span className="text-emerald-400">●</span>
            <span className="text-secondary font-medium">{currentServer.city}</span>
          </div>
        )}
        
        <div className="text-[10px] text-tertiary font-mono tracking-widest">09:41</div>
      </div>

      {/* Page Content with smooth transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
          className="px-5 pt-6"
          id="main-content"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>

      {/* Premium Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bottom-nav border-t border-[var(--border)]">
        <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all active:scale-95 ${
                  isActive 
                    ? 'text-[var(--text-primary)]' 
                    : 'text-secondary hover:text-[var(--text-primary)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-[10px] font-medium tracking-[0.3px] ${isActive ? 'text-[var(--text-primary)]' : ''}`}>
                    {label}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute -bottom-px h-0.5 w-6 bg-[image:var(--accent-gradient)] rounded-full" 
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
