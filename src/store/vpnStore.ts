import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Server {
  id: string
  country: string
  city: string
  flag: string
  ping: number
  load: number
  ip: string
}

export interface LogEntry {
  id: string
  timestamp: string
  type: 'connect' | 'disconnect' | 'server_change' | 'speedtest'
  server: string
  duration?: string
  dataUsed?: string
}

export interface SpeedtestResult {
  ping: number
  download: number
  upload: number
  jitter: number
  timestamp: string
  server?: string
  serverId?: string
  serverCountry?: string
}

export interface PaymentMethod {
  id: string
  type: 'paypal' | 'google_pay' | 'apple_pay' | 'card' | 'wallet'
  label: string
  isDefault: boolean
  lastFour?: string
  brand?: string
}

export interface Invoice {
  id: string
  date: string
  amount: string
  status: 'paid' | 'pending'
  plan: string
  period: string
}

export interface Device {
  id: string
  name: string
  type: 'Phone' | 'Laptop' | 'Desktop' | 'Tablet' | 'Other'
  lastActive: string
  location?: string
  ip?: string
  isCurrent?: boolean
}

export interface SubscriptionDetails {
  plan: string
  status: 'active' | 'trialing'
  price: string
  renewsAt: string
  billingCycle: 'monthly' | 'yearly'
  nextBilling: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'connection' | 'security' | 'update' | 'system'
  timestamp: string
  read: boolean
}

interface VPNState {
  // Connection
  isConnected: boolean
  isConnecting: boolean
  currentServer: Server | null
  connectionStartTime: number | null
  uploadSpeed: number
  downloadSpeed: number
  dataUploaded: number
  dataDownloaded: number

  // Servers
  servers: Server[]
  favoriteServers: string[]
  selectedServerId: string | null

  // Logs
  logs: LogEntry[]

  // User
  user: {
    name: string
    email: string
    avatar: string
    plan: string
    expiresAt: string
  }

  // Speedtest
  speedtestHistory: SpeedtestResult[]

  // Privacy & Data
  privacySettings: {
    analyticsSharing: boolean
    crashReporting: boolean
    personalizedRecommendations: boolean
    dataCollectionForImprovement: boolean
  }

  // VPN Core Settings (for Settings pages: Kill Switch, Auto-Connect, Notifications)
  vpnSettings: {
    killSwitch: boolean
    autoConnect: boolean
    notifications: boolean
  }

  // Referral System
  referralCode: string
  referredFriendsCount: number
  monthsEarned: number

  // Account Security (2FA, Password, Devices)
  security: {
    twoFactorEnabled: boolean
    lastPasswordChange: string
    devices: Device[]
  }

  // Premium / Billing
  subscription: SubscriptionDetails
  paymentMethods: PaymentMethod[]
  invoices: Invoice[]

  // Notifications Center (full featured list + granular prefs)
  notifications: Notification[]
  notificationPreferences: {
    connectionEvents: boolean
    securityAlerts: boolean
    serverUpdates: boolean
    productNews: boolean
  }

  // Theme / Appearance (persisted user preference)
  theme: 'dark' | 'light'
  reduceMotion: boolean
  largerText: boolean

  // Actions
  connect: () => void
  disconnect: () => void
  changeServer: (server: Server) => void
  toggleFavorite: (serverId: string) => void
  setSelectedServer: (id: string) => void
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  clearLogs: () => void

  // Speedtest actions
  addSpeedtestResult: (result: SpeedtestResult) => void
  clearSpeedtestHistory: () => void

  // Premium / Billing actions
  upgradeSubscription: (newPlan: string, cycle?: 'monthly' | 'yearly') => void
  addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'isDefault'> & { makeDefault?: boolean }) => void
  removePaymentMethod: (id: string) => void
  setDefaultPaymentMethod: (id: string) => void

  // Privacy & Referral actions
  updatePrivacySetting: (key: keyof VPNState['privacySettings'], value: boolean) => void
  recordReferralSuccess: () => void
  redeemReferralCode: (code: string) => { success: boolean; message: string }

  // VPN Settings actions
  updateVpnSetting: (key: keyof VPNState['vpnSettings'], value: boolean) => void

  // Account Security actions
  setTwoFactorEnabled: (enabled: boolean) => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>
  removeDevice: (deviceId: string) => void

  // Theme actions
  setTheme: (theme: 'dark' | 'light') => void
  toggleTheme: () => void

  // Appearance accessibility actions
  setReduceMotion: (enabled: boolean) => void
  setLargerText: (enabled: boolean) => void

  // Notifications Center actions (integrated with vpnSettings + preferences)
  addNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  clearNotifications: () => void
  updateNotificationPreference: (key: keyof VPNState['notificationPreferences'], value: boolean) => void
}

const defaultServers: Server[] = [
  { id: 'us-ny', country: 'United States', city: 'New York', flag: '🇺🇸', ping: 12, load: 28, ip: '172.67.12.45' },
  { id: 'us-sf', country: 'United States', city: 'San Francisco', flag: '🇺🇸', ping: 38, load: 41, ip: '104.21.89.33' },
  { id: 'uk-lon', country: 'United Kingdom', city: 'London', flag: '🇬🇧', ping: 24, load: 19, ip: '172.67.45.12' },
  { id: 'de-fra', country: 'Germany', city: 'Frankfurt', flag: '🇩🇪', ping: 31, load: 52, ip: '162.159.130.45' },
  { id: 'jp-tok', country: 'Japan', city: 'Tokyo', flag: '🇯🇵', ping: 89, load: 34, ip: '104.21.67.89' },
  { id: 'sg-sin', country: 'Singapore', city: 'Singapore', flag: '🇸🇬', ping: 67, load: 22, ip: '172.67.23.56' },
  { id: 'nl-ams', country: 'Netherlands', city: 'Amsterdam', flag: '🇳🇱', ping: 19, load: 15, ip: '104.21.12.34' },
  { id: 'au-syd', country: 'Australia', city: 'Sydney', flag: '🇦🇺', ping: 142, load: 61, ip: '162.159.200.12' },
  { id: 'ca-tor', country: 'Canada', city: 'Toronto', flag: '🇨🇦', ping: 29, load: 37, ip: '172.67.78.90' },
  { id: 'fr-par', country: 'France', city: 'Paris', flag: '🇫🇷', ping: 22, load: 44, ip: '104.21.55.67' },
]

const defaultUser = {
  name: 'Alex Rivera',
  email: 'alex.rivera@proton.me',
  avatar: 'AR',
  plan: 'Aether Pro',
  expiresAt: '2026-03-14',
}

const defaultSubscription: SubscriptionDetails = {
  plan: 'Aether Pro',
  status: 'active',
  price: '$9.99',
  renewsAt: '2026-03-14',
  billingCycle: 'monthly',
  nextBilling: 'Mar 14, 2026',
}

const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'card',
    label: 'Visa •••• 4242',
    isDefault: true,
    lastFour: '4242',
    brand: 'Visa',
  },
  {
    id: 'pm_2',
    type: 'paypal',
    label: 'PayPal • alex.rivera@proton.me',
    isDefault: false,
  },
]

const defaultInvoices: Invoice[] = [
  { id: 'inv_001', date: '2026-02-14', amount: '$9.99', status: 'paid', plan: 'Aether Pro', period: 'Feb 14 - Mar 14, 2026' },
  { id: 'inv_002', date: '2026-01-14', amount: '$9.99', status: 'paid', plan: 'Aether Pro', period: 'Jan 14 - Feb 14, 2026' },
  { id: 'inv_003', date: '2025-12-14', amount: '$99.99', status: 'paid', plan: 'Aether Pro (Yearly)', period: 'Dec 14, 2025 - Jan 14, 2026' },
  { id: 'inv_004', date: '2025-11-14', amount: '$9.99', status: 'paid', plan: 'Aether Pro', period: 'Nov 14 - Dec 14, 2025' },
]

const defaultPrivacySettings = {
  analyticsSharing: true,
  crashReporting: true,
  personalizedRecommendations: false,
  dataCollectionForImprovement: true,
}

const defaultVpnSettings = {
  killSwitch: true,      // VPN best practice: on by default
  autoConnect: false,
  notifications: true,
}

const defaultReferralCode = 'ALEX-RV-42K9'

export const useVPNStore = create<VPNState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      isConnecting: false,
      currentServer: null,
      connectionStartTime: null,
      uploadSpeed: 0,
      downloadSpeed: 0,
      dataUploaded: 0,
      dataDownloaded: 0,

      servers: defaultServers,
      favoriteServers: ['us-ny', 'nl-ams'],
      selectedServerId: null,

      logs: [],

      user: defaultUser,

      // Premium defaults
      subscription: defaultSubscription,
      paymentMethods: defaultPaymentMethods,
      invoices: defaultInvoices,

      // Privacy & Referral defaults
      privacySettings: defaultPrivacySettings,
      referralCode: defaultReferralCode,
      referredFriendsCount: 3,
      monthsEarned: 1,

      // VPN Settings defaults (used by /app/settings pages)
      vpnSettings: defaultVpnSettings,

      // Security defaults
      security: {
        twoFactorEnabled: false,
        lastPasswordChange: '2026-02-28',
        devices: [
          {
            id: 'd1',
            name: 'MacBook Pro',
            type: 'Laptop',
            lastActive: 'Now',
            location: 'San Francisco, CA',
            ip: '192.168.1.42',
            isCurrent: true,
          },
          {
            id: 'd2',
            name: 'iPhone 16 Pro',
            type: 'Phone',
            lastActive: '12 min ago',
            location: 'San Francisco, CA',
            ip: '172.16.0.88',
          },
          {
            id: 'd3',
            name: 'iPad Pro',
            type: 'Tablet',
            lastActive: 'Yesterday',
            location: 'Los Angeles, CA',
            ip: '10.0.0.15',
          },
        ],
      },

      // Theme default — starts dark for signature Aether feel. User can switch.
      theme: 'dark',
      // Accessibility / motion & readability prefs (user-controlled, persisted)
      reduceMotion: false,
      largerText: false,

      // Notifications Center defaults (seeded demo data for rich functional experience)
      notifications: [
        {
          id: 'n1',
          title: 'Connected to New York',
          message: 'Successfully established secure tunnel to US-NY server. All traffic protected.',
          type: 'connection',
          timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
          read: false,
        },
        {
          id: 'n2',
          title: 'Security Alert: Kill Switch Engaged',
          message: 'Kill switch activated after unexpected disconnect. Your IP was never exposed.',
          type: 'security',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          read: true,
        },
        {
          id: 'n3',
          title: 'New Server Available',
          message: 'We added 3 new locations in Asia-Pacific. Lowest ping in region: Singapore.',
          type: 'update',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(),
          read: true,
        },
        {
          id: 'n4',
          title: 'Weekly Performance Report',
          message: 'Your average download speed this week: 187 Mbps. 12% improvement over last week.',
          type: 'system',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 29).toISOString(),
          read: true,
        },
      ],
      notificationPreferences: {
        connectionEvents: true,
        securityAlerts: true,
        serverUpdates: true,
        productNews: false,
      },

      connect: () => {
        const { selectedServerId, servers, currentServer } = get()
        const targetServer = servers.find(s => s.id === selectedServerId) || currentServer || servers[0]

        set({ isConnecting: true })

        // Simulate realistic connection time
        setTimeout(() => {
          const now = Date.now()
          set({
            isConnected: true,
            isConnecting: false,
            currentServer: targetServer,
            connectionStartTime: now,
            uploadSpeed: 42,
            downloadSpeed: 187,
            dataUploaded: 0,
            dataDownloaded: 0,
          })

          get().addLog({
            type: 'connect',
            server: `${targetServer.city}, ${targetServer.country}`,
          })

          // Push rich notification if preferences + master toggle allow
          const prefs = get().notificationPreferences
          const master = get().vpnSettings.notifications
          if (master && prefs.connectionEvents) {
            get().addNotification({
              title: `Connected to ${targetServer.city}`,
              message: `Secure tunnel established via ${targetServer.country}. ${targetServer.ping}ms ping.`,
              type: 'connection',
            })
          }
        }, 1450)
      },

      disconnect: () => {
        const { currentServer, connectionStartTime, dataDownloaded } = get()
        
        if (currentServer && connectionStartTime) {
          const durationSec = Math.floor((Date.now() - connectionStartTime) / 1000)
          const duration = `${Math.floor(durationSec / 60)}m ${durationSec % 60}s`
          
          get().addLog({
            type: 'disconnect',
            server: `${currentServer.city}, ${currentServer.country}`,
            duration,
            dataUsed: `${(dataDownloaded / 1024 / 1024).toFixed(1)} MB`,
          })

          // Push disconnect notification
          const prefs = get().notificationPreferences
          const master = get().vpnSettings.notifications
          if (master && prefs.connectionEvents) {
            get().addNotification({
              title: 'Connection Ended',
              message: `Disconnected from ${currentServer.city}. Session duration: ${duration}.`,
              type: 'connection',
            })
          }
        }

        set({
          isConnected: false,
          isConnecting: false,
          connectionStartTime: null,
          uploadSpeed: 0,
          downloadSpeed: 0,
        })
      },

      changeServer: (server: Server) => {
        const { isConnected, currentServer } = get()
        
        if (currentServer && isConnected) {
          get().addLog({
            type: 'server_change',
            server: `${server.city}, ${server.country}`,
          })
        }

        set({
          currentServer: server,
          selectedServerId: server.id,
          ...(isConnected && {
            uploadSpeed: Math.floor(Math.random() * 30) + 35,
            downloadSpeed: Math.floor(Math.random() * 120) + 140,
          }),
        })
      },

      toggleFavorite: (serverId: string) => {
        const { favoriteServers } = get()
        const newFavorites = favoriteServers.includes(serverId)
          ? favoriteServers.filter(id => id !== serverId)
          : [...favoriteServers, serverId]
        
        set({ favoriteServers: newFavorites })
      },

      setSelectedServer: (id: string) => {
        set({ selectedServerId: id })
      },

      addLog: (entry) => {
        const log: LogEntry = {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        }
        set((state) => ({ logs: [log, ...state.logs].slice(0, 50) }))
      },

      clearLogs: () => set({ logs: [] }),

      // Speedtest
      speedtestHistory: [],

      addSpeedtestResult: (result) => {
        set((state) => ({
          speedtestHistory: [result, ...state.speedtestHistory].slice(0, 10),
        }))
        // Deep integration: automatically record speedtests in Activity logs
        const serverLabel = result.server 
          ? `${result.server}${result.serverCountry ? `, ${result.serverCountry}` : ''}` 
          : 'Unknown server'
        get().addLog({
          type: 'speedtest',
          server: serverLabel,
          duration: `${result.download}↓ / ${result.upload}↑ Mbps`,
          dataUsed: `Ping ${result.ping}ms • Jitter ${result.jitter}ms`,
        })
      },

      clearSpeedtestHistory: () => set({ speedtestHistory: [] }),

      // Premium / Billing Actions (realistic simulations)
      upgradeSubscription: (newPlan: string, cycle: 'monthly' | 'yearly' = 'monthly') => {
        const prices: Record<string, Record<string, string>> = {
          'Aether Pro': { monthly: '$9.99', yearly: '$99.99' },
          'Aether Family': { monthly: '$14.99', yearly: '$149.99' },
          'Free': { monthly: '$0', yearly: '$0' },
        }
        const price = prices[newPlan]?.[cycle] || '$9.99'
        const months = cycle === 'yearly' ? 12 : 1
        const renewDate = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000)
        const renewsAt = renewDate.toISOString().split('T')[0]
        const nextBilling = renewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

        set((state) => {
          const updatedUser = { ...state.user, plan: newPlan, expiresAt: renewsAt }
          return {
            subscription: {
              plan: newPlan,
              status: 'active',
              price,
              renewsAt,
              billingCycle: cycle,
              nextBilling,
            },
            user: updatedUser,
          }
        })
      },

      addPaymentMethod: (method) => {
        const newMethod: PaymentMethod = {
          ...method,
          id: `pm_${Date.now()}`,
          isDefault: method.makeDefault || false,
        }
        set((state) => {
          let methods = [...state.paymentMethods]
          if (newMethod.isDefault) {
            methods = methods.map(m => ({ ...m, isDefault: false }))
          }
          return { paymentMethods: [...methods, newMethod] }
        })
      },

      removePaymentMethod: (id: string) => {
        set((state) => {
          const remaining = state.paymentMethods.filter(m => m.id !== id)
          // If removed default, make first one default
          if (state.paymentMethods.find(m => m.id === id)?.isDefault && remaining.length > 0) {
            remaining[0] = { ...remaining[0], isDefault: true }
          }
          return { paymentMethods: remaining }
        })
      },

      setDefaultPaymentMethod: (id: string) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.map(m => ({
            ...m,
            isDefault: m.id === id,
          })),
        }))
      },

      // Privacy & Referral actions (simulated but fully functional + persisted)
      updatePrivacySetting: (key, value) =>
        set((state) => ({
          privacySettings: { ...state.privacySettings, [key]: value },
        })),

      recordReferralSuccess: () =>
        set((state) => ({
          referredFriendsCount: state.referredFriendsCount + 1,
          monthsEarned: state.monthsEarned + 1,
        })),

      redeemReferralCode: (code: string) => {
        const current = get()
        const normalized = code.trim().toUpperCase()
        if (!normalized || normalized === current.referralCode.toUpperCase()) {
          return { success: false, message: 'Invalid code or your own referral code.' }
        }
        // Grant reward (simulates both parties benefiting)
        set((state) => ({
          referredFriendsCount: state.referredFriendsCount + 1,
          monthsEarned: state.monthsEarned + 1,
        }))
        return { success: true, message: 'Code redeemed! You and your friend each received 1 month of Pro free.' }
      },

      // VPN Settings (Kill Switch / Auto-Connect / Notifications) — fully functional + persisted
      updateVpnSetting: (key, value) =>
        set((state) => ({
          vpnSettings: { ...state.vpnSettings, [key]: value },
        })),

      // Account Security actions (fully simulated, functional, persisted)
      setTwoFactorEnabled: (enabled) =>
        set((state) => ({
          security: { ...state.security, twoFactorEnabled: enabled },
        })),

      changePassword: async (currentPassword, newPassword) => {
        // Simulation: accept any current (demo), enforce basic rules on new
        await new Promise((r) => setTimeout(r, 620))
        if (newPassword.length < 8) {
          return { success: false, message: 'New password must be at least 8 characters.' }
        }
        if (newPassword === currentPassword) {
          return { success: false, message: 'New password must be different from current password.' }
        }
        const today = new Date().toISOString().split('T')[0]
        set((state) => ({
          security: { ...state.security, lastPasswordChange: today },
        }))
        return { success: true, message: 'Password changed successfully.' }
      },

      removeDevice: (deviceId) =>
        set((state) => {
          const currentDev = state.security.devices.find((d) => d.isCurrent)
          if (currentDev && currentDev.id === deviceId) {
            // Prevent removing current; caller should toast
            return state
          }
          return {
            security: {
              ...state.security,
              devices: state.security.devices.filter((d) => d.id !== deviceId),
            },
          }
        }),

      // Theme persistence + switch (beautiful instant switch via CSS vars)
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      // Accessibility prefs (Reduce Motion + Larger Text)
      setReduceMotion: (enabled) => set({ reduceMotion: enabled }),
      setLargerText: (enabled) => set({ largerText: enabled }),

      // Notifications Center — fully functional list, real toggles, simulation-ready
      addNotification: (notif) => {
        const notification: Notification = {
          ...notif,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          read: false,
        }
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 50),
        }))
      },
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      clearNotifications: () => set({ notifications: [] }),
      updateNotificationPreference: (key, value) =>
        set((state) => ({
          notificationPreferences: { ...state.notificationPreferences, [key]: value },
        })),
    }),
    {
      name: 'aether-vpn-storage',
      partialize: (state) => ({
        favoriteServers: state.favoriteServers,
        logs: state.logs,
        user: state.user,
        currentServer: state.currentServer,
        speedtestHistory: state.speedtestHistory,
        subscription: state.subscription,
        paymentMethods: state.paymentMethods,
        invoices: state.invoices,
        // Privacy & Referral persistence
        privacySettings: state.privacySettings,
        referralCode: state.referralCode,
        referredFriendsCount: state.referredFriendsCount,
        monthsEarned: state.monthsEarned,
        // VPN Settings persistence (for Settings hub + subpages)
        vpnSettings: state.vpnSettings,
        // Security persistence (2FA, devices, password date)
        security: state.security,
        // Theme persistence — survives refresh, beautiful instant switch
        theme: state.theme,
        // Accessibility / motion & readability prefs
        reduceMotion: state.reduceMotion,
        largerText: state.largerText,
        // Notifications Center full persistence (list + granular prefs)
        notifications: state.notifications,
        notificationPreferences: state.notificationPreferences,
      }),
    }
  )
)
