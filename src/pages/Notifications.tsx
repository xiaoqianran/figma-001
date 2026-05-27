import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell, CheckCheck, Trash2, Play, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVPNStore, type Notification } from '@/store/vpnStore'
import { GlassCard, Button, Toggle } from '@/components/ui'
import { toast } from 'sonner'

const filterTabs: Array<{ key: 'all' | Notification['type']; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'connection', label: 'Connection' },
  { key: 'security', label: 'Security' },
  { key: 'update', label: 'Updates' },
  { key: 'system', label: 'System' },
]

const typeMeta: Record<Notification['type'], { color: string; icon: string; label: string }> = {
  connection: { color: 'emerald', icon: '🔗', label: 'Connection' },
  security: { color: 'rose', icon: '🛡️', label: 'Security' },
  update: { color: 'sky', icon: '🌍', label: 'Server Update' },
  system: { color: 'amber', icon: '📊', label: 'System' },
}

export default function Notifications() {
  const navigate = useNavigate()
  const { 
    notifications, 
    notificationPreferences, 
    updateNotificationPreference,
    markNotificationRead, 
    markAllNotificationsRead, 
    clearNotifications,
    addNotification,
    vpnSettings,
  } = useVPNStore()

  const [activeFilter, setActiveFilter] = useState<'all' | Notification['type']>('all')
  const [showPrefs, setShowPrefs] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const filtered = notifications
    .filter(n => activeFilter === 'all' || n.type === activeFilter)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const handleMarkRead = (id: string) => {
    markNotificationRead(id)
  }

  const handleMarkAll = () => {
    if (unreadCount === 0) return
    markAllNotificationsRead()
    toast.success('All marked as read')
  }

  const handleClear = () => {
    if (notifications.length === 0) return
    clearNotifications()
    toast('Notifications cleared')
  }

  // Functional simulation: generate realistic events based on current prefs + master toggle
  const simulateEvent = () => {
    const masterEnabled = vpnSettings.notifications
    if (!masterEnabled) {
      toast.error('Master notifications disabled', { 
        description: 'Enable in Settings or here to receive simulated events.' 
      })
      return
    }

    const prefs = notificationPreferences
    const candidates: Array<Notification['type']> = []
    if (prefs.connectionEvents) candidates.push('connection')
    if (prefs.securityAlerts) candidates.push('security')
    if (prefs.serverUpdates) candidates.push('update')
    if (prefs.productNews) candidates.push('system')

    if (candidates.length === 0) {
      toast('All categories muted in preferences')
      return
    }

    const type = candidates[Math.floor(Math.random() * candidates.length)]

    const templates: Record<Notification['type'], { title: string; message: string }[]> = {
      connection: [
        { title: 'Reconnected to London', message: 'Tunnel re-established after brief Wi-Fi change. 24ms ping.' },
        { title: 'Auto-switched server', message: 'Optimal server selected for lowest latency in current region.' },
      ],
      security: [
        { title: 'Kill Switch Triggered', message: 'Protected your real IP during network drop. No leaks detected.' },
        { title: 'Unusual Login Blocked', message: 'Attempt from new device in Tokyo region was automatically denied.' },
      ],
      update: [
        { title: 'New Low-Latency Route', message: 'Improved peering added between Frankfurt and Singapore hubs.' },
        { title: 'Server Maintenance Complete', message: 'Tokyo and Sydney nodes fully upgraded — 18% faster on average.' },
      ],
      system: [
        { title: 'Data Usage Milestone', message: 'You have used 47 GB this month. 12 GB remaining on current plan.' },
        { title: 'Weekly Insights Ready', message: 'Your most used server: Netherlands. Peak speed: 214 Mbps.' },
      ],
    }

    const options = templates[type]
    const pick = options[Math.floor(Math.random() * options.length)]

    addNotification({
      title: pick.title,
      message: pick.message,
      type,
    })

    toast.success('New notification simulated', { description: pick.title })
  }

  const formatTime = (ts: string) => {
    const date = new Date(ts)
    const now = Date.now()
    const diffMin = Math.floor((now - date.getTime()) / 60000)
    if (diffMin < 1) return 'Just now'
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  const prefKeys = [
    { key: 'connectionEvents' as const, label: 'Connection Events', desc: 'Connect, disconnect, server switches' },
    { key: 'securityAlerts' as const, label: 'Security Alerts', desc: 'Kill switch, leaks, blocked attempts' },
    { key: 'serverUpdates' as const, label: 'Server & Network Updates', desc: 'New locations, maintenance, performance' },
    { key: 'productNews' as const, label: 'Product & Feature News', desc: 'New capabilities and tips' },
  ]

  return (
    <div className="pb-12 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/app/profile')}
            className="p-2 -ml-2 text-[#94A3B8] active:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
            aria-label="Go back to Profile"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/5 flex items-center justify-center text-[#3B82F6]">
              <Bell size={19} />
            </div>
            <div>
              <div className="font-display text-3xl tracking-[-0.8px] font-semibold">Notifications</div>
              <div className="text-tertiary text-sm -mt-0.5">{notifications.length} total • {unreadCount} unread</div>
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowPrefs(!showPrefs)}
          className="flex items-center gap-1.5 text-xs"
          aria-label={showPrefs ? 'Hide notification preferences' : 'Show notification preferences'}
          aria-expanded={showPrefs}
        >
          <Filter size={15} aria-hidden="true" /> Prefs
        </Button>
      </div>

      {/* Granular Real Toggles — fully wired to store */}
      <AnimatePresence>
        {showPrefs && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <GlassCard padding="lg" className="mb-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-semibold tracking-tight">Notification Preferences</div>
                  <div className="text-xs text-tertiary">These control both auto events and simulations</div>
                </div>
                <div className={`text-[10px] px-2 py-0.5 rounded ${vpnSettings.notifications ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-tertiary'}`}>
                  MASTER: {vpnSettings.notifications ? 'ON' : 'OFF'}
                </div>
              </div>

              <div className="space-y-4">
                {prefKeys.map(({ key, label, desc }) => {
                  const checked = notificationPreferences[key]
                  return (
                    <div key={key} className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm tracking-[-0.1px]">{label}</div>
                        <div className="text-xs text-tertiary leading-snug">{desc}</div>
                      </div>
                      <Toggle 
                        checked={checked} 
                        onCheckedChange={(val) => {
                          updateNotificationPreference(key, val)
                          toast.success(val ? `${label} enabled` : `${label} muted`)
                        }}
                        size="md"
                      />
                    </div>
                  )
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 text-[11px] text-[#475569]">
                Master toggle lives in Settings. These granular controls are respected by the live connection system.
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action bar */}
      <div className="flex gap-2 mb-5">
        <Button 
          onClick={simulateEvent} 
          variant="primary" 
          size="md" 
          className="flex-1 flex items-center justify-center gap-2"
          leftIcon={<Play size={16} />}
        >
          Simulate Event
        </Button>
        <Button 
          onClick={handleMarkAll} 
          variant="secondary" 
          size="md" 
          disabled={unreadCount === 0}
          className="px-4"
        >
          <CheckCheck size={16} />
        </Button>
        <Button 
          onClick={handleClear} 
          variant="secondary" 
          size="md" 
          disabled={notifications.length === 0}
          className="px-4 text-[#EF4444] hover:text-[#EF4444]"
        >
          <Trash2 size={16} />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`tab whitespace-nowrap ${activeFilter === tab.key ? 'tab-active' : 'bg-white/5 text-[#94A3B8]'}`}
          >
            {tab.label}
            {tab.key !== 'all' && (
              <span className="ml-1.5 text-[10px] opacity-70">
                {notifications.filter(n => n.type === tab.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <Bell className="mx-auto mb-3 text-[#475569]" size={32} />
          <div className="font-medium text-[#94A3B8]">No notifications here</div>
          <p className="text-sm text-[#475569] mt-1">Try the Simulate Event button or change filters.</p>
        </div>
      ) : (
        <div className="space-y-2.5 pb-8">
          <AnimatePresence>
            {filtered.map((notif, index) => {
              const meta = typeMeta[notif.type]
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.015, 0.2) }}
                  onClick={() => !notif.read && handleMarkRead(notif.id)}
                  className={`glass rounded-3xl px-5 py-4 cursor-pointer active:scale-[0.985] transition-all border-l-4 ${notif.read ? 'border-transparent opacity-80' : `border-${meta.color}-400`}`}
                >
                  <div className="flex gap-3">
                    <div className="text-2xl mt-0.5 flex-shrink-0">{meta.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold tracking-[-0.15px] leading-tight pr-2">{notif.title}</div>
                        <div className="text-[10px] font-mono text-tertiary whitespace-nowrap pt-0.5">
                          {formatTime(notif.timestamp)}
                        </div>
                      </div>
                      <div className="text-sm text-[#94A3B8] mt-1 leading-snug pr-1">{notif.message}</div>

                      <div className="flex items-center gap-2 mt-3">
                        <div className={`inline text-[10px] tracking-widest px-2 py-px rounded-full bg-white/5 text-tertiary`}>
                          {meta.label.toUpperCase()}
                        </div>
                        {!notif.read && (
                          <div className="text-[10px] text-emerald-400 font-medium tracking-wider">NEW • TAP TO READ</div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      <div className="text-center text-[10px] text-[#475569] tracking-[1px] mt-4">
        NOTIFICATIONS RESPECT YOUR PREFERENCES • NEVER CONTAIN PERSONAL DATA
      </div>
    </div>
  )
}
