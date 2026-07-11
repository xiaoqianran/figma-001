import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, ArrowRight } from 'lucide-react'
import { useVPNStore } from '@/store/vpnStore'
import { formatDuration } from '@/lib/utils'
import { greetingForDate } from '@/lib/time'
import { toast } from 'sonner'
import { VPNOrb } from '@/components/ui'

export default function Home() {
  const navigate = useNavigate()
  const {
    isConnected,
    isConnecting,
    currentServer,
    selectedServerId,
    connectionStartTime,
    uploadSpeed,
    downloadSpeed,
    connect,
    disconnect,
    servers,
  } = useVPNStore()

  const [elapsed, setElapsed] = useState(0)
  const [greeting, setGreeting] = useState(() => greetingForDate())

  // Live timer
  useEffect(() => {
    if (!isConnected || !connectionStartTime) {
      setElapsed(0)
      return
    }
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - connectionStartTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [isConnected, connectionStartTime])

  // Time-of-day greeting from local clock (not a hardcoded "Good evening")
  useEffect(() => {
    const tick = () => setGreeting(greetingForDate())
    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [])

  const handleToggle = () => {
    if (isConnected) {
      disconnect()
      toast.info('Disconnected', { description: 'Your connection is now private again.' })
    } else {
      connect()
    }
  }

  // Determine which server to display:
  // - If connected: always the live currentServer
  // - If disconnected but user pre-selected a location: show the pending choice (this is what connect() will use)
  // - Fallback: first server in list
  const pendingSelected = selectedServerId ? servers.find(s => s.id === selectedServerId) : null
  const displayServer = isConnected 
    ? (currentServer || servers[0]) 
    : (pendingSelected || currentServer || servers[0])

  return (
    <div className="pb-4 text-[var(--text-primary)]">
      {/* Greeting — live local time-of-day */}
      <div className="mb-8">
        <div className="text-tertiary text-sm">{greeting}, Alex</div>
        <div className="font-display text-[28px] tracking-[-1px] font-semibold mt-1">Stay protected.</div>
      </div>

      {/* HEROIC CONNECTION ORB */}
      <div className="flex flex-col items-center py-6">
        <VPNOrb
          status={isConnecting ? 'connecting' : isConnected ? 'connected' : 'idle'}
          onToggle={handleToggle}
          disabled={isConnecting}
        />

        {/* Current / Pending Location Card — strongly highlights when you have pre-selected a different server */}
        <button 
          onClick={() => navigate('/app/locations')}
          className={`glass w-full max-w-[340px] rounded-3xl p-5 flex items-center gap-4 active:scale-[0.985] transition ${!isConnected && pendingSelected ? 'ring-2 ring-[var(--accent)]' : ''}`}
        >
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 text-tertiary text-xs tracking-widest">
              <MapPin size={14} /> 
              {isConnected ? 'CURRENT LOCATION' : pendingSelected ? 'SELECTED FOR NEXT CONNECTION' : 'CURRENT LOCATION'}
            </div>
            <div className="font-semibold text-xl tracking-[-0.4px] mt-1">{displayServer.city}</div>
            <div className="text-secondary">
              {displayServer.country} • {displayServer.ping}ms
              {!isConnected && pendingSelected && (
                <span className="ml-2 text-[10px] text-[var(--accent)] font-semibold">• TAP ORB TO CONNECT</span>
              )}
            </div>
          </div>
          <div className="text-[var(--accent)]">
            <ArrowRight size={20} />
          </div>
        </button>
      </div>

      {/* Live Stats — Only when connected */}
      <AnimatePresence>
        {isConnected && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2"
          >
            <div className="grid grid-cols-3 gap-3 max-w-[340px] mx-auto">
              <div className="glass rounded-3xl p-4 text-center">
                <div className="text-[10px] tracking-widest text-tertiary mb-1">ELAPSED</div>
                <div className="font-mono text-2xl font-semibold tabular-nums tracking-tighter">{formatDuration(elapsed)}</div>
              </div>
              <div className="glass rounded-3xl p-4 text-center">
                <div className="text-[10px] tracking-widest text-tertiary mb-1">UPLOAD</div>
                <div className="font-mono text-2xl font-semibold tabular-nums tracking-tighter">{uploadSpeed}<span className="text-sm text-tertiary">KB/s</span></div>
              </div>
              <div className="glass rounded-3xl p-4 text-center">
                <div className="text-[10px] tracking-widest text-tertiary mb-1">DOWNLOAD</div>
                <div className="font-mono text-2xl font-semibold tabular-nums tracking-tighter">{downloadSpeed}<span className="text-sm text-tertiary">KB/s</span></div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-4 text-xs">
              <button 
                onClick={() => navigate('/app/activity')}
                className="flex items-center gap-2 text-tertiary hover:text-white transition"
              >
                VIEW CONNECTION LOG <Clock size={14} />
              </button>
              <span className="text-[#334155]">•</span>
              <button 
                onClick={() => navigate('/app/diagnostics')}
                className="flex items-center gap-2 text-tertiary hover:text-white transition"
              >
                FULL DIAGNOSTICS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isConnected && (
        <div className="text-center text-tertiary text-xs mt-4 tracking-widest">YOUR TRAFFIC IS NOT PROTECTED</div>
      )}
    </div>
  )
}
