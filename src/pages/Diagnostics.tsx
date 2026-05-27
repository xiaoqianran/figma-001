import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Share2, RefreshCw, Wifi, ShieldCheck, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useVPNStore } from '@/store/vpnStore'
import { GlassCard, Button } from '@/components/ui'
import { toast } from 'sonner'

type QualityRating = 'Excellent' | 'Good' | 'Fair' | 'Poor'

interface DiagnosticResult {
  rating: QualityRating
  ping: number
  jitter: number
  packetLoss: number
  stability: number
  hopCount: number
  timestamp: string
}

const qualityColors: Record<QualityRating, string> = {
  Excellent: '#22c55e',
  Good: '#3b82f6',
  Fair: '#eab308',
  Poor: '#ef4444',
}

export default function Diagnostics() {
  const navigate = useNavigate()
  const { isConnected, currentServer, uploadSpeed, downloadSpeed } = useVPNStore()

  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'latency' | 'jitter' | 'loss' | 'route' | 'complete'>('idle')
  const [liveMetrics, setLiveMetrics] = useState({
    ping: 0,
    jitter: 0,
    packetLoss: 0,
    stability: 0,
  })
  const [lastResult, setLastResult] = useState<DiagnosticResult | null>(null)
  const [hops, setHops] = useState<Array<{ hop: number; location: string; rtt: number }>>([])

  const basePing = currentServer?.ping || 28
  const currentQuality = lastResult?.rating || (isConnected ? 'Good' : 'Fair')

  const getQualityFromMetrics = (ping: number, jitter: number, loss: number): QualityRating => {
    const score = (ping * 0.5) + (jitter * 4) + (loss * 12)
    if (score < 22) return 'Excellent'
    if (score < 38) return 'Good'
    if (score < 58) return 'Fair'
    return 'Poor'
  }

  const simulateDiagnostic = async () => {
    if (isRunning) return
    setIsRunning(true)
    setProgress(0)
    setPhase('latency')
    setHops([])
    setLiveMetrics({ ping: 0, jitter: 0, packetLoss: 0, stability: 0 })

    const phases: Array<{ name: typeof phase; duration: number; target: Partial<typeof liveMetrics> }> = [
      { name: 'latency', duration: 950, target: { ping: Math.floor(basePing + Math.random() * 6 - 2) } },
      { name: 'jitter', duration: 820, target: { jitter: parseFloat((0.6 + Math.random() * 1.8).toFixed(1)) } },
      { name: 'loss', duration: 780, target: { packetLoss: parseFloat((0.1 + Math.random() * (isConnected ? 0.8 : 2.4)).toFixed(1)) } },
      { name: 'route', duration: 1100, target: { stability: Math.floor(82 + Math.random() * 15) } },
    ]

    let cumulative = 0
    const totalDuration = phases.reduce((sum, p) => sum + p.duration, 0)

    for (const p of phases) {
      setPhase(p.name)

      const start = Date.now()
      await new Promise<void>((resolve) => {
        const iv = setInterval(() => {
          const elapsed = Date.now() - start
          const pct = Math.min(elapsed / p.duration, 1)
          const overall = Math.floor(((cumulative + p.duration * pct) / totalDuration) * 100)
          setProgress(overall)

          // Live update partial metrics
          setLiveMetrics(prev => ({
            ping: p.target.ping ?? prev.ping,
            jitter: p.target.jitter ?? prev.jitter,
            packetLoss: p.target.packetLoss ?? prev.packetLoss,
            stability: p.target.stability ?? prev.stability,
          }))

          if (pct >= 1) {
            clearInterval(iv)
            resolve()
          }
        }, 40)
      })

      // Simulate traceroute hops progressively
      if (p.name === 'route') {
        const simulatedHops = [
          { hop: 1, location: 'Local Gateway', rtt: 2 + Math.random() * 3 },
          { hop: 2, location: isConnected ? 'VPN Entry Node' : 'ISP Peer', rtt: Math.floor(basePing * 0.4) },
          { hop: 3, location: currentServer ? `${currentServer.city} PoP` : 'Regional Hub', rtt: Math.floor(basePing * 0.75) },
          { hop: 4, location: 'Core Backbone', rtt: basePing },
        ]
        setHops(simulatedHops)
      }

      cumulative += p.duration
    }

    // Finalize realistic numbers
    const finalPing = Math.floor(basePing + Math.random() * 5 - 1.5)
    const finalJitter = parseFloat((0.7 + Math.random() * 1.9).toFixed(1))
    const finalLoss = parseFloat((0.05 + Math.random() * (isConnected ? 0.9 : 2.8)).toFixed(1))
    const finalStability = Math.floor(84 + Math.random() * 14)

    const rating = getQualityFromMetrics(finalPing, finalJitter, finalLoss)

    const result: DiagnosticResult = {
      rating,
      ping: finalPing,
      jitter: finalJitter,
      packetLoss: finalLoss,
      stability: finalStability,
      hopCount: hops.length || 4,
      timestamp: new Date().toISOString(),
    }

    setLiveMetrics({ ping: finalPing, jitter: finalJitter, packetLoss: finalLoss, stability: finalStability })
    setLastResult(result)
    setPhase('complete')
    setProgress(100)

    // Toast + optionally surface in activity via existing log (already rich)
    toast.success(`Connection Quality: ${rating}`, {
      description: `${finalPing}ms • ${finalJitter}ms jitter • ${finalLoss}% loss`,
    })

    setTimeout(() => {
      setIsRunning(false)
    }, 650)
  }

  const reset = () => {
    setPhase('idle')
    setProgress(0)
    setLiveMetrics({ ping: 0, jitter: 0, packetLoss: 0, stability: 0 })
    setLastResult(null)
    setHops([])
  }

  const handleShare = () => {
    if (!lastResult) return
    const text = `Aether Diagnostics\nServer: ${currentServer ? `${currentServer.city}, ${currentServer.country}` : 'N/A'}\nQuality: ${lastResult.rating}\nPing: ${lastResult.ping}ms | Jitter: ${lastResult.jitter}ms | Loss: ${lastResult.packetLoss}% | Stability: ${lastResult.stability}%`
    
    // Simple simulation of share (copy to clipboard)
    navigator.clipboard?.writeText(text).catch(() => {})
    toast.success('Report copied to clipboard', { description: 'Ready to share or paste into support ticket.' })
  }

  const renderBar = (value: number, max: number, color: string, label: string) => {
    const pct = Math.min(Math.max((value / max) * 100, 4), 100)
    return (
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-secondary">{label}</span>
          <span className="font-mono tabular-nums text-[#F1F5F9]">{value}{label.includes('Loss') || label.includes('Jitter') ? (label.includes('Loss') ? '%' : 'ms') : ''}</span>
        </div>
        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full rounded-full" 
            style={{ background: color, width: `${pct}%` }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>
    )
  }

  const ratingToUse = lastResult?.rating || currentQuality
  const ratingColor = qualityColors[ratingToUse]

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate(isConnected ? '/app' : '/app/speedtest')}
          className="p-2 -ml-2 text-secondary active:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
          aria-label="Go back"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <div>
          <div className="font-display text-[28px] tracking-[-1px] font-semibold">Advanced Diagnostics</div>
          <p className="text-tertiary text-sm">Connection quality, route health &amp; packet analysis</p>
        </div>
      </div>

      {/* Status / Current Server */}
      <GlassCard className="mb-6" padding="lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="uppercase tracking-[1.5px] text-xs text-tertiary">CURRENT TUNNEL</div>
            <div className="text-xl font-semibold tracking-[-0.3px] mt-0.5">
              {currentServer ? `${currentServer.city}, ${currentServer.country}` : 'Not connected'}
            </div>
            {currentServer && (
              <div className="text-sm text-secondary mt-0.5">{currentServer.ip} • Base ping {currentServer.ping}ms</div>
            )}
          </div>
          <div className="text-right">
            <div style={{ color: ratingColor }} className="font-semibold text-2xl tracking-tighter flex items-center gap-2 justify-end">
              {ratingToUse}
              {ratingToUse === 'Excellent' && <ShieldCheck size={22} />}
              {ratingToUse === 'Poor' && <AlertTriangle size={22} />}
            </div>
            <div className="text-xs text-tertiary">QUALITY RATING</div>
          </div>
        </div>
      </GlassCard>

      {/* Live / Last Result Metrics */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="font-medium text-sm tracking-wide text-secondary">CONNECTION QUALITY METRICS</div>
          {phase !== 'idle' && (
            <div className="text-xs font-mono text-[#3B82F6]">{phase.toUpperCase()} • {progress}%</div>
          )}
          {/* Live region announcing live diagnostic progress to assistive tech */}
          <div aria-live="polite" className="sr-only">
            {phase !== 'idle' ? `Diagnostic ${phase} phase, ${progress}% complete. Current ping ${liveMetrics.ping}ms, jitter ${liveMetrics.jitter}ms, loss ${liveMetrics.packetLoss} percent.` : ''}
          </div>
        </div>

        <GlassCard padding="lg" className="space-y-5">
          {renderBar(liveMetrics.ping || (lastResult?.ping ?? basePing), 160, '#3B82F6', 'Latency (Ping)')}
          {renderBar(liveMetrics.jitter || (lastResult?.jitter ?? 1.4), 5, '#22D3EE', 'Jitter')}
          {renderBar(liveMetrics.packetLoss || (lastResult?.packetLoss ?? 0.2), 5, '#F59E0B', 'Packet Loss')}
          {renderBar(liveMetrics.stability || (lastResult?.stability ?? 88), 100, '#22C55E', 'Route Stability')}

          {isConnected && (
            <div className="pt-1 text-xs flex justify-between text-tertiary">
              <div>Live speeds: <span className="font-mono text-[#F1F5F9]">{downloadSpeed}↓ / {uploadSpeed}↑ KB/s</span></div>
              <div>Protected</div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Run Control */}
      <div className="flex gap-3 mb-6" role="group" aria-label="Diagnostic controls">
        <Button 
          onClick={simulateDiagnostic} 
          disabled={isRunning}
          variant="primary" 
          fullWidth 
          size="lg"
          leftIcon={isRunning ? <RefreshCw className="animate-spin" size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          aria-label={isRunning ? 'Running diagnostic, please wait' : 'Run full connection diagnostic test'}
        >
          {isRunning ? 'Running Full Diagnostic…' : 'Run Full Diagnostic'}
        </Button>
        {(lastResult || phase !== 'idle') && (
          <Button onClick={reset} variant="secondary" size="lg" className="px-5" aria-label="Reset diagnostic results">
            Reset
          </Button>
        )}
      </div>

      {/* Traceroute / Route Hops (populated during run) */}
      {(hops.length > 0 || phase === 'route') && (
        <div className="mb-6">
          <div className="px-1 text-xs tracking-widest text-secondary mb-2">SIMULATED ROUTE TRACE</div>
          <GlassCard padding="sm">
            <div className="divide-y divide-white/5 text-sm">
              {hops.length > 0 ? hops.map((h, idx) => (
                <div key={idx} className="flex justify-between py-2.5 px-1 font-mono tabular-nums">
                  <div className="text-secondary">Hop {h.hop}</div>
                  <div className="flex-1 px-4 text-[#F1F5F9] truncate">{h.location}</div>
                  <div className="text-right text-[#22D3EE]">{h.rtt.toFixed(0)}ms</div>
                </div>
              )) : (
                <div className="py-3 px-1 text-tertiary text-xs">Probing route…</div>
              )}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Result Summary Card */}
      {lastResult && (
        <GlassCard className="mb-6 border border-white/10" padding="lg" accent>
          <div className="flex items-center gap-2 mb-4">
            <Wifi size={19} className="text-[#3B82F6]" />
            <div className="font-semibold">Diagnostic Complete — {new Date(lastResult.timestamp).toLocaleTimeString()}</div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <div className="text-tertiary text-xs">OVERALL RATING</div>
              <div style={{ color: ratingColor }} className="font-semibold text-2xl tracking-[-1px]">{lastResult.rating}</div>
            </div>
            <div className="text-right">
              <div className="text-tertiary text-xs">HOPS ANALYZED</div>
              <div className="font-semibold text-2xl tracking-[-1px] tabular-nums">{lastResult.hopCount}</div>
            </div>

            <div>Latency <span className="font-mono float-right">{lastResult.ping} ms</span></div>
            <div>Jitter <span className="font-mono float-right">{lastResult.jitter} ms</span></div>
            <div>Packet Loss <span className="font-mono float-right">{lastResult.packetLoss}%</span></div>
            <div>Stability <span className="font-mono float-right">{lastResult.stability}%</span></div>
          </div>

          <div className="mt-5 flex gap-3">
            <Button onClick={handleShare} variant="secondary" fullWidth leftIcon={<Share2 size={16} />}>Share Report</Button>
            <Button onClick={() => navigate('/app/speedtest')} variant="ghost" fullWidth>Run Speedtest</Button>
          </div>
        </GlassCard>
      )}

      {/* Guidance */}
      {!isConnected && !lastResult && (
        <div className="text-center mt-3 text-xs text-[#475569] px-4">
          Connect to a server on Home to run live-accurate diagnostics. The simulator still produces realistic results.
        </div>
      )}

      <Button 
        variant="ghost" 
        fullWidth 
        className="mt-8 text-tertiary" 
        onClick={() => navigate('/app')}
      >
        Back to Home
      </Button>
    </div>
  )
}
