import { useState } from 'react'
import { Play, RefreshCw, Share2, BarChart3, Zap, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, GlassCard, Modal } from '@/components/ui'
import { useVPNStore, type SpeedtestResult } from '@/store/vpnStore'
import { InteractiveSpeedChart } from '@/components/InteractiveSpeedChart'
import { toast } from 'sonner'

type TestPhase = 'idle' | 'ping' | 'download' | 'upload' | 'jitter' | 'complete'

type ComparisonResult = {
  direct: SpeedtestResult
  vpn: SpeedtestResult
  timestamp: string
}

export default function Speedtest() {
  const { isConnected, currentServer, servers, speedtestHistory, addSpeedtestResult, clearSpeedtestHistory } = useVPNStore()
  
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null)
  const [phase, setPhase] = useState<TestPhase>('idle')
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<Partial<SpeedtestResult>>({})
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<number | null>(null)

  // New features state
  const [isComparisonMode, setIsComparisonMode] = useState(false)
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult | null>(null)
  const [isRunningComparison, setIsRunningComparison] = useState(false)
  const [showShareCard, setShowShareCard] = useState(false)
  const [lastSharedResult, setLastSharedResult] = useState<SpeedtestResult | null>(null)

  // Note: Share dialog ESC + focus management is now fully handled by the accessible Modal component.

  // Robustly resolve the server for the current test (selected or current VPN server)
  const getTestServer = () => {
    if (selectedServerId) {
      return servers.find(s => s.id === selectedServerId) || null
    }
    return currentServer
  }

  // Realistic simulation: server characteristics influence measured values
  const generateRealisticMetrics = (server: ReturnType<typeof getTestServer>, isDirect: boolean = false) => {
    const basePing = server?.ping || 25
    const loadFactor = (server?.load || 35) / 100

    // Direct connection: worse performance (higher ping, lower speeds)
    const pingMultiplier = isDirect ? 1.6 : 1.0
    const speedMultiplier = isDirect ? 0.72 : 1.0

    const ping = Math.floor(basePing * pingMultiplier + Math.random() * 12 + loadFactor * 8)
    const download = Math.floor((isDirect ? 52 : 78) + Math.random() * 58 * speedMultiplier - loadFactor * 12)
    const upload = Math.floor((isDirect ? 19 : 29) + Math.random() * 32 * speedMultiplier)
    const jitter = parseFloat((Math.random() * 2.6 + (isDirect ? 2.4 : 0.7) + loadFactor).toFixed(1))

    return {
      ping: Math.max(5, ping),
      download: Math.max(12, download),
      upload: Math.max(6, upload),
      jitter: Math.max(0.3, jitter),
    }
  }

  const simulatePhase = (newPhase: TestPhase, start: number, end: number, duration: number): Promise<void> => {
    return new Promise(resolve => {
      setPhase(newPhase)
      const startTime = Date.now()
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const percent = Math.min(elapsed / duration, 1)
        const currentProgress = start + (end - start) * percent
        setProgress(Math.floor(currentProgress))

        if (percent >= 1) {
          clearInterval(interval)
          setProgress(end)
          resolve()
        }
      }, 50)
    })
  }

  // Core robust speedtest runner (supports server selection + comparison context)
  const runSpeedtest = async (forceDirect: boolean = false) => {
    const testServer = getTestServer()
    const isDirectRun = forceDirect || (isComparisonMode && !forceDirect) // handled by caller for comparison

    setPhase('ping')
    setProgress(0)
    setResults({})

    // Phase 1: Ping
    await simulatePhase('ping', 0, 20, 720)
    const metricsStep1 = generateRealisticMetrics(testServer, isDirectRun)
    setResults(r => ({ ...r, ping: metricsStep1.ping }))

    // Phase 2: Download
    await simulatePhase('download', 20, 55, isDirectRun ? 980 : 1320)
    const metricsStep2 = generateRealisticMetrics(testServer, isDirectRun)
    setResults(r => ({ ...r, download: metricsStep2.download }))

    // Phase 3: Upload
    await simulatePhase('upload', 55, 85, 1050)
    const metricsStep3 = generateRealisticMetrics(testServer, isDirectRun)
    setResults(r => ({ ...r, upload: metricsStep3.upload }))

    // Phase 4: Jitter
    await simulatePhase('jitter', 85, 100, 520)
    const finalMetrics = generateRealisticMetrics(testServer, isDirectRun)

    const finalResults: SpeedtestResult = {
      ping: finalMetrics.ping,
      download: finalMetrics.download,
      upload: finalMetrics.upload,
      jitter: finalMetrics.jitter,
      timestamp: new Date().toISOString(),
      server: testServer?.city,
      serverId: testServer?.id,
      serverCountry: testServer?.country,
    }

    setResults(finalResults)
    setPhase('complete')

    // Persist to store (store handles Activity log integration automatically)
    addSpeedtestResult(finalResults)

    return finalResults
  }

  // NEW: Simple before/after VPN comparison mode
  const runComparisonTest = async () => {
    setIsRunningComparison(true)
    setComparisonResults(null)
    setPhase('idle')
    setResults({})
    setSelectedHistoryIndex(null)

    // Step 1: Simulate direct (baseline) — no VPN benefit
    const directResult = await runSpeedtest(true)

    // Brief pause for UX clarity
    await new Promise(res => setTimeout(res, 420))

    // Step 2: Now run the VPN-protected measurement
    const vpnResult = await runSpeedtest(false)

    const comp: ComparisonResult = {
      direct: directResult,
      vpn: vpnResult,
      timestamp: new Date().toISOString(),
    }

    setComparisonResults(comp)
    setIsRunningComparison(false)
    setPhase('complete')

    // The VPN result is already persisted via runSpeedtest
    toast.success('Comparison complete', {
      description: `VPN improved download by ${Math.round(((vpnResult.download - directResult.download) / directResult.download) * 100)}%`,
    })
  }

  const reset = () => {
    setPhase('idle')
    setProgress(0)
    setResults({})
    setComparisonResults(null)
    setIsComparisonMode(false)
    setIsRunningComparison(false)
    setSelectedHistoryIndex(null)
  }

  const clearHistory = () => {
    clearSpeedtestHistory()
    setSelectedHistoryIndex(null)
    setComparisonResults(null)
    toast.info('History cleared')
  }

  const getPhaseLabel = () => {
    switch (phase) {
      case 'ping': return 'Testing Ping...'
      case 'download': return 'Measuring Download Speed...'
      case 'upload': return 'Measuring Upload Speed...'
      case 'jitter': return 'Calculating Jitter...'
      case 'complete': return isComparisonMode || comparisonResults ? 'Comparison Complete' : 'Test Complete'
      default: return isComparisonMode ? 'Ready for Comparison' : 'Ready to Test'
    }
  }

  // Share Result implementation: beautiful text + clipboard + visual card
  const handleShareResult = (resultToShare?: SpeedtestResult) => {
    const result = resultToShare || (results as SpeedtestResult)
    if (!result || !result.download) return

    const testServerName = result.server || getTestServer()?.city || 'Unknown'
    const dateStr = new Date(result.timestamp).toLocaleString([], { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    })

    const shareText = 
`Aether VPN Speed Test
━━━━━━━━━━━━━━━━━━━━━━
Server: ${testServerName}
${result.serverCountry ? `Location: ${result.serverCountry}\n` : ''}
Ping: ${result.ping} ms   •   Jitter: ${result.jitter} ms

Download: ${result.download} Mbps
Upload:   ${result.upload} Mbps

Tested: ${dateStr}
━━━━━━━━━━━━━━━━━━━━━━
Protected by Aether • Invisible. Fast. Private.`

    // Copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      setLastSharedResult(result)
      setShowShareCard(true)
      toast.success('Result copied to clipboard', {
        description: 'Ready to share. Beautiful card shown below.',
      })
    }).catch(() => {
      // Fallback
      setLastSharedResult(result)
      setShowShareCard(true)
      toast('Result ready', { description: shareText })
    })
  }

  // Close the nice share/preview card
  const closeShareCard = () => {
    setShowShareCard(false)
  }

  // Handle chart point selection -> highlight corresponding history card
  const handleChartSelect = (reversedDisplayIndex: number) => {
    // Map back: displayResults are reversed slice(0,8) so original index in full history is reversedDisplayIndex
    // We use it to set visual selection state
    setSelectedHistoryIndex(reversedDisplayIndex)
    
    // Scroll hint
    setTimeout(() => {
      const el = document.getElementById('history-list')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
  }

  // Compute server flags for display in history
  const getServerFlag = (serverName?: string) => {
    if (!serverName) return '🌐'
    const found = servers.find(s => s.city === serverName)
    return found?.flag || '🌐'
  }

  // Empty / First-Run Experience (beautiful, helpful, on-brand)
  const renderEmptyState = () => (
    <div className="mt-2">
      <GlassCard className="p-8 text-center" variant="strong">
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-[#3B82F6]/20 to-[#22D3EE]/10 flex items-center justify-center">
          <BarChart3 size={42} className="text-[#3B82F6]" />
        </div>

        <h2 className="font-display text-2xl tracking-[-0.6px] mb-2">Ready to measure your speed?</h2>
        <p className="text-secondary max-w-[280px] mx-auto mb-8 text-[15px]">
          Run your first test to see real-world performance. Pick a specific server or let Aether choose the best route.
        </p>

        <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto mb-8 text-left">
          {[
            { icon: <Zap size={16} />, title: 'Realistic Simulation', desc: 'Server load and distance affect results' },
            { icon: <TrendingUp size={16} />, title: 'Interactive History', desc: 'Hover charts to inspect every test' },
            { icon: <Clock size={16} />, title: 'VPN Impact', desc: 'Use Comparison Mode to see direct vs protected' },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3 items-start rounded-2xl bg-white/[0.025] p-4">
              <div className="mt-0.5 text-[#3B82F6]">{item.icon}</div>
              <div>
                <div className="font-medium text-sm">{item.title}</div>
                <div className="text-xs text-tertiary leading-snug mt-px">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button size="xl" onClick={() => runSpeedtest()} className="gap-3 w-full max-w-[280px]">
            <Play size={20} /> Run Your First Speed Test
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={() => { setIsComparisonMode(true); runComparisonTest() }} 
            className="gap-2 text-sm"
          >
            Or try Before/After Comparison
          </Button>
        </div>
      </GlassCard>
    </div>
  )

  // Share result content rendered inside accessible Modal (provides focus trap, ESC, focus restore, ARIA)
  const renderShareContent = () => {
    const r = lastSharedResult
    if (!r) return null

    return (
      <div className="space-y-5">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#3B82F6]/10 mb-3">
            <Share2 size={22} className="text-[#3B82F6]" />
          </div>
          <div className="font-display text-xl tracking-tight">Shareable Result</div>
          <div className="text-xs text-secondary mt-1 tracking-[1.5px]">COPIED TO CLIPBOARD</div>
        </div>

        <div className="rounded-2xl bg-[var(--bg-elevated)] p-5 font-mono text-sm border border-white/5">
          <div className="text-[#3B82F6] font-semibold tracking-[1px] mb-3">AETHER VPN SPEED TEST</div>
          <div className="space-y-1 text-[#E2E8F0]">
            <div><span className="text-tertiary">Server</span> {r.server || 'Auto'}</div>
            <div><span className="text-tertiary">Ping</span> {r.ping} ms  •  Jitter {r.jitter} ms</div>
            <div className="pt-1"><span className="text-tertiary">Download</span> {r.download} Mbps</div>
            <div><span className="text-tertiary">Upload</span> {r.upload} Mbps</div>
          </div>
          <div className="h-px bg-white/10 my-4" />
          <div className="text-[11px] text-tertiary">{new Date(r.timestamp).toLocaleString()}</div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => handleShareResult(r)}>Copy Again</Button>
          <Button className="flex-1" onClick={closeShareCard}>Done</Button>
        </div>
        <p className="text-center text-[10px] text-tertiary tracking-widest">Paste into messages, notes, or social posts</p>
      </div>
    )
  }

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-[28px] tracking-[-1px] font-semibold">Speedtest</h1>
          <p className="text-tertiary text-sm mt-1">
            {phase === 'idle' && selectedServerId 
              ? `Testing on ${servers.find(s => s.id === selectedServerId)?.city}`
              : isConnected && currentServer 
                ? `Testing via ${currentServer.city}` 
                : 'Measure your real connection performance'}
          </p>
        </div>
        {speedtestHistory.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearHistory} className="text-[#EF4444] hover:text-[#EF4444]" aria-label="Clear all speed test history">
            Clear
          </Button>
        )}
      </div>

      {/* Server Selector — always available in idle, robustly tied to selection */}
      {phase === 'idle' && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="text-xs tracking-widest text-tertiary">TEST SERVER</div>
            <div className="text-[10px] text-tertiary">Tap to override current location</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedServerId(null)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition active:scale-[0.985] ${!selectedServerId ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)] ring-1 ring-[var(--border-strong)]' : 'bg-[var(--bg-subtle)] text-secondary hover:text-white'}`}
            >
              Auto (Current Route)
            </button>
            {servers.slice(0, 7).map(server => (
              <button
                key={server.id}
                onClick={() => setSelectedServerId(server.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 active:scale-[0.985] ${selectedServerId === server.id ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)] ring-1 ring-[var(--border-strong)]' : 'bg-[var(--bg-subtle)] text-secondary hover:text-white'}`}
              >
                <span>{server.flag}</span>
                <span>{server.city}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Meter Card — Enhanced with comparison awareness */}
      <GlassCard className="mb-6 flex flex-col items-center py-8" padding="lg">
        <div className="relative w-48 h-48 mb-5">
          <svg 
            className="w-full h-full -rotate-90" 
            viewBox="0 0 100 100"
            role="img"
            aria-label={`Speed test progress meter. Current phase: ${getPhaseLabel()}. ${phase === 'complete' && results.download ? `Latest download: ${results.download} Mbps` : ''}`}
          >
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <motion.circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke={isComparisonMode || comparisonResults ? '#22D3EE' : '#3B82F6'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="263.9"
              strokeDashoffset={263.9 - (progress / 100) * 263.9}
              transition={{ ease: 'easeOut', duration: 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[10px] tracking-[2px] text-tertiary mb-1">{isComparisonMode ? 'COMPARISON' : 'YOUR SPEED'}</div>
            <div className="font-mono text-5xl font-semibold tabular-nums tracking-tighter">
              {phase === 'complete' && results.download ? results.download : Math.floor((progress / 100) * (results.download || 85))}
            </div>
            <div className="text-sm text-secondary -mt-1">Mbps</div>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-sm text-tertiary">{getPhaseLabel()}</div>
          {phase !== 'idle' && phase !== 'complete' && (
            <div className="font-mono text-xs text-[#3B82F6] mt-1">{progress}%</div>
          )}
          {isComparisonMode && !isRunningComparison && phase === 'idle' && (
            <div className="text-[10px] text-[#22D3EE] mt-1 tracking-widest">BEFORE / AFTER MODE ACTIVE</div>
          )}
          {/* Live region for screen readers during test phases */}
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {phase !== 'idle' && phase !== 'complete' ? `${getPhaseLabel()} ${progress}% complete` : ''}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'idle' && !isRunningComparison && (
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[320px]">
              <Button onClick={() => runSpeedtest()} size="xl" leftIcon={<Play size={19} />}>
                Start Speed Test
              </Button>
              <Button 
                variant="secondary" 
                size="xl" 
                onClick={() => { setIsComparisonMode(true); runComparisonTest() }} 
                leftIcon={<ArrowRight size={18} />}
              >
                Comparison
              </Button>
            </div>
          )}

          {phase === 'complete' && (
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="secondary" onClick={reset} leftIcon={<RefreshCw size={17} />}>
                Test Again
              </Button>
              <Button onClick={() => handleShareResult()} leftIcon={<Share2 size={17} />}>
                Share Result
              </Button>
              {!comparisonResults && (
                <Button 
                  variant="ghost" 
                  onClick={() => { setIsComparisonMode(true); runComparisonTest() }}
                  className="text-[#22D3EE]"
                >
                  Run Comparison
                </Button>
              )}
            </div>
          )}

          {isRunningComparison && (
            <div className="text-xs text-tertiary font-mono tracking-[2px]">RUNNING DIRECT + VPN MEASUREMENT…</div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* LIVE / FINAL Results Grid — using component helper */}
      {Object.keys(results).length > 0 && !comparisonResults && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {(['ping', 'download', 'upload', 'jitter'] as const).map((key) => {
            const value = results[key as keyof SpeedtestResult]
            if (value === undefined) return null
            const label = key === 'ping' ? 'PING' : key.toUpperCase()
            const unit = key === 'ping' || key === 'jitter' ? 'ms' : 'Mbps'
            const accent = key === 'download' ? 'text-[#3B82F6]' : key === 'upload' ? 'text-[#22D3EE]' : 'text-white'
            return (
              <GlassCard key={key} padding="sm" className="text-center">
                <div className="text-[10px] tracking-[1.5px] text-tertiary mb-1">{label}</div>
                <div className={`font-mono text-3xl font-semibold tabular-nums ${accent}`}>
                  {value}<span className="text-sm text-tertiary font-normal ml-px">{unit}</span>
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}

      {/* COMPARISON MODE RESULTS — Before / After VPN (the optional feature) */}
      {comparisonResults && (
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="text-sm text-tertiary">VPN IMPACT COMPARISON</div>
            <div className="text-[10px] px-2 py-px rounded bg-[#22D3EE]/10 text-[#22D3EE]">DIRECT vs PROTECTED</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Direct */}
            <GlassCard padding="md" className="border border-white/5">
              <div className="uppercase text-[10px] tracking-[1.5px] text-[#EF4444] mb-2">DIRECT CONNECTION</div>
              <div className="text-4xl font-semibold tabular-nums mb-4 font-mono tracking-tighter">
                {comparisonResults.direct.download}<span className="text-xl text-tertiary"> Mbps</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>Ping <span className="font-semibold tabular-nums">{comparisonResults.direct.ping}</span>ms</div>
                <div>Up <span className="font-semibold tabular-nums">{comparisonResults.direct.upload}</span></div>
                <div>Jitter <span className="font-semibold tabular-nums">{comparisonResults.direct.jitter}</span></div>
              </div>
            </GlassCard>

            {/* VPN */}
            <GlassCard padding="md" accent className="relative">
              <div className="uppercase text-[10px] tracking-[1.5px] text-emerald-400 mb-2">PROTECTED BY AETHER</div>
              <div className="text-4xl font-semibold tabular-nums mb-4 font-mono tracking-tighter text-[#22D3EE]">
                {comparisonResults.vpn.download}<span className="text-xl text-tertiary"> Mbps</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>Ping <span className="font-semibold tabular-nums">{comparisonResults.vpn.ping}</span>ms</div>
                <div>Up <span className="font-semibold tabular-nums">{comparisonResults.vpn.upload}</span></div>
                <div>Jitter <span className="font-semibold tabular-nums">{comparisonResults.vpn.jitter}</span></div>
              </div>

              {/* Delta badges */}
              <div className="absolute top-5 right-5 flex flex-col items-end gap-1 text-xs">
                {comparisonResults.vpn.download > comparisonResults.direct.download && (
                  <div className="text-emerald-400 font-medium">+{Math.round(((comparisonResults.vpn.download - comparisonResults.direct.download) / comparisonResults.direct.download) * 100)}% faster</div>
                )}
                {comparisonResults.vpn.ping < comparisonResults.direct.ping && (
                  <div className="text-[#3B82F6] font-medium">-{comparisonResults.direct.ping - comparisonResults.vpn.ping}ms ping</div>
                )}
              </div>
            </GlassCard>
          </div>

          <div className="mt-3 flex justify-end">
            <Button variant="secondary" size="sm" onClick={reset} leftIcon={<RefreshCw size={15} />}>Run New Test</Button>
          </div>
        </div>
      )}

      {/* Interactive History Graphs + List */}
      {speedtestHistory.length > 0 ? (
        <div id="history-list">
          <div className="flex items-baseline justify-between mb-3 px-0.5">
            <div>
              <div className="text-sm text-tertiary">Performance History</div>
              <div className="text-[10px] text-tertiary">{speedtestHistory.length} tests recorded • Auto-logged to Activity</div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleShareResult(speedtestHistory[0])} className="gap-1.5 text-xs">
              <Share2 size={14} /> Share Latest
            </Button>
          </div>

          {/* The powerful interactive graph component we added */}
          <InteractiveSpeedChart 
            results={speedtestHistory} 
            onSelectResult={handleChartSelect}
            selectedIndex={selectedHistoryIndex}
            maxPoints={8}
          />

          {/* Enhanced clickable history rows */}
          <div className="mt-4 space-y-2">
            {speedtestHistory.map((test, index) => {
              const isActive = selectedHistoryIndex === index
              return (
                <GlassCard 
                  key={index} 
                  interactive 
                  padding="sm"
                  accent={isActive}
                  onClick={() => setSelectedHistoryIndex(isActive ? null : index)}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer active:scale-[0.985]"
                  aria-label={`Speed test result: ${test.download} Mbps download, ${test.ping} ms ping on ${test.server || 'auto server'} at ${new Date(test.timestamp).toLocaleTimeString()}`}
                  aria-pressed={isActive}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xl">{getServerFlag(test.server)}</div>
                    <div>
                      <div className="font-medium text-sm tabular-nums tracking-tight">
                        {test.download} Mbps <span className="font-normal text-tertiary">down</span>
                      </div>
                      <div className="text-[11px] text-tertiary">
                        {new Date(test.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {test.server && <span className="ml-1.5">• {test.server}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div className="font-mono text-xs text-secondary">
                      {test.ping}ms <span className="opacity-60">·</span> ↑{test.upload}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="px-2 py-1 text-[10px]" 
                      onClick={(e) => { e.stopPropagation(); handleShareResult(test) }}
                    >
                      Share
                    </Button>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </div>
      ) : (
        // First-run / empty experience
        renderEmptyState()
      )}

      {/* Footer hint */}
      {!isConnected && speedtestHistory.length > 0 && (
        <div className="text-center text-tertiary text-[10px] mt-8 tracking-[1.5px]">
          Connect to VPN for the most accurate server-specific measurements
        </div>
      )}

      {/* Accessible share result overlay using Modal (full focus trap + ARIA + keyboard management) */}
      <Modal
        open={showShareCard}
        onClose={closeShareCard}
        title="Share Speed Test Result"
        size="sm"
        description="Review and copy your speed test details for sharing."
      >
        {renderShareContent()}
      </Modal>
    </div>
  )
}
