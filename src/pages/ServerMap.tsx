import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, StarOff, MapPin, Zap, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVPNStore, type Server } from '@/store/vpnStore'
import { GlassCard, Button } from '@/components/ui'
import { toast } from 'sonner'

// Approximate positions on stylized world SVG (viewBox 0 0 1000 520)
// Tuned for visual balance across continents
const serverPositions: Record<string, { x: number; y: number; continent: string }> = {
  'us-ny': { x: 220, y: 175, continent: 'NA' },
  'us-sf': { x: 135, y: 195, continent: 'NA' },
  'uk-lon': { x: 470, y: 145, continent: 'EU' },
  'de-fra': { x: 490, y: 155, continent: 'EU' },
  'nl-ams': { x: 480, y: 140, continent: 'EU' },
  'fr-par': { x: 475, y: 160, continent: 'EU' },
  'jp-tok': { x: 820, y: 195, continent: 'AS' },
  'sg-sin': { x: 740, y: 285, continent: 'AS' },
  'au-syd': { x: 870, y: 380, continent: 'OC' },
  'ca-tor': { x: 195, y: 150, continent: 'NA' },
}

const continentLabels: Record<string, string> = {
  NA: 'North America',
  EU: 'Europe',
  AS: 'Asia',
  OC: 'Oceania',
}

const continents = ['All', 'NA', 'EU', 'AS', 'OC'] as const

export default function ServerMap() {
  const navigate = useNavigate()
  const { 
    servers, 
    currentServer, 
    favoriteServers, 
    isConnected, 
    changeServer, 
    toggleFavorite, 
    setSelectedServer,
    selectedServerId: storeSelectedId
  } = useVPNStore()

  const [selectedId, setSelectedId] = useState<string | null>(storeSelectedId || currentServer?.id || null)
  const [search, setSearch] = useState('')
  const [continentFilter, setContinentFilter] = useState<'All' | 'NA' | 'EU' | 'AS' | 'OC'>('All')
  const [pingFilter, setPingFilter] = useState<'all' | 'fast'>('all')

  // Live region message for screen readers when selection or filters change (dynamic content)
  const [liveMessage, setLiveMessage] = useState('')

  const selectedServer = servers.find(s => s.id === selectedId) || null

  // Filtered servers for cards + map dots
  const filteredServers = servers
    .filter(s => {
      const q = search.toLowerCase()
      const textMatch = s.city.toLowerCase().includes(q) || s.country.toLowerCase().includes(q)
      if (!textMatch) return false

      const pos = serverPositions[s.id]
      if (!pos) return true

      const continentMatch = continentFilter === 'All' || pos.continent === continentFilter
      const pingMatch = pingFilter === 'all' || s.ping <= 30
      return continentMatch && pingMatch
    })
    .sort((a, b) => {
      const aFav = favoriteServers.includes(a.id) ? -1 : 1
      const bFav = favoriteServers.includes(b.id) ? -1 : 1
      return aFav - bFav || a.ping - b.ping
    })

  const handleMapSelect = (serverId: string) => {
    setSelectedId(serverId)
    setSelectedServer(serverId)
    const srv = servers.find(s => s.id === serverId)
    if (srv) {
      setLiveMessage(`Selected ${srv.city}, ${srv.country}. ${srv.ping} milliseconds ping.`)
    }
  }

  const handleCardSelect = (server: Server) => {
    setSelectedId(server.id)
    setSelectedServer(server.id)
    setLiveMessage(`Selected ${server.city}, ${server.country}. ${server.ping} milliseconds ping.`)
  }

  const handleSelectForVPN = (server: Server) => {
    setSelectedServer(server.id)
    setSelectedId(server.id)

    if (isConnected) {
      changeServer(server)
      toast.success(`Switched to ${server.city}`, {
        description: `${server.country} • ${server.ping}ms • Now routing all traffic`,
      })
    } else {
      toast.success(`${server.city} selected`, {
        description: 'Return to Home and tap the orb to connect through this server.',
      })
    }
  }

  const handleFavorite = (serverId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    toggleFavorite(serverId)
    const isNowFav = !favoriteServers.includes(serverId)
    toast(isNowFav ? 'Added to favorites' : 'Removed from favorites', {
      description: servers.find(s => s.id === serverId)?.city,
    })
  }

  const handleQuickConnect = () => {
    if (!selectedServer) return
    handleSelectForVPN(selectedServer)
    // If not connected, user still needs to go home — but give nice feedback
    if (!isConnected) {
      setTimeout(() => navigate('/app'), 650)
    }
  }

  const resetFilters = () => {
    setSearch('')
    setContinentFilter('All')
    setPingFilter('all')
  }

  const getPingColor = (ping: number) => {
    if (ping <= 20) return '#22c55e'
    if (ping <= 40) return '#eab308'
    return '#f97316'
  }

  const getLoadColor = (load: number) => {
    if (load < 30) return 'text-emerald-400'
    if (load < 55) return 'text-amber-400'
    return 'text-orange-400'
  }

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate('/app/locations')}
          className="p-2 -ml-2 text-secondary active:text-white transition-colors"
          aria-label="Back to Locations"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="font-display text-[28px] tracking-[-1px] font-semibold flex items-center gap-2">
            <MapPin className="text-[#3B82F6]" /> Server Map
          </div>
          <p className="text-secondary text-sm -mt-0.5">Interactive visual selection • Tap dots or cards</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-4 px-1 text-xs text-secondary">
        <div>94 servers • 6 continents • Live pings</div>
        <button 
          onClick={resetFilters} 
          className="flex items-center gap-1 hover:text-white active:text-[#3B82F6] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 rounded px-1"
          aria-label="Reset all map filters and search"
        >
          <RefreshCw size={13} /> Reset filters
        </button>
      </div>

      {/* Live region for dynamic server selection announcements (screen reader only) */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveMessage}
      </div>

      {/* Interactive Map */}
      <GlassCard className="mb-6 overflow-hidden p-0" padding="none">
        <div className="relative bg-[#0A0E15] p-4">
          <svg 
            viewBox="0 0 1000 520" 
            className="w-full h-auto max-h-[340px] rounded-2xl border border-white/10"
            style={{ background: 'linear-gradient(180deg, #0A0E15 0%, #05070A 100%)' }}
            role="img"
            aria-label="Stylized interactive world map showing Aether VPN server locations as colored dots (green best ping). Use the server cards below or tap dots for selection. Keyboard users: navigate via cards or filters."
            aria-describedby="map-instructions"
          >
            <desc id="map-instructions">The map is visual. Primary server selection and full keyboard support is provided via the searchable and filterable server cards list below the map.</desc>
            {/* Stylized continents (simplified paths for visual simulation) */}
            {/* North America */}
            <path d="M80 120 Q160 80 240 130 Q260 200 180 240 Q100 210 80 120" fill="#111827" stroke="#1F2937" strokeWidth="2" />
            {/* Europe */}
            <path d="M430 100 Q510 85 560 125 Q555 175 490 180 Q440 155 430 100" fill="#111827" stroke="#1F2937" strokeWidth="2" />
            {/* Asia */}
            <path d="M620 105 Q780 95 870 160 Q900 260 780 280 Q660 230 620 105" fill="#111827" stroke="#1F2937" strokeWidth="2" />
            {/* Oceania / Australia */}
            <path d="M800 340 Q890 335 920 385 Q895 420 825 400 Q795 365 800 340" fill="#111827" stroke="#1F2937" strokeWidth="2" />
            {/* Subtle latitude lines */}
            {[140, 200, 280, 360].map((y, i) => (
              <line key={i} x1="40" y1={y} x2="960" y2={y} stroke="#1F2937" strokeWidth="1" strokeDasharray="4 8" />
            ))}

            {/* Connection arcs simulation (decorative between major hubs) */}
            <path d="M220 175 Q350 120 480 145" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeOpacity="0.25" />
            <path d="M490 155 Q650 140 820 195" fill="none" stroke="#22D3EE" strokeWidth="1" strokeOpacity="0.2" />

            {/* Server dots */}
            {servers.map((server) => {
              const pos = serverPositions[server.id]
              if (!pos) return null

              const isSelected = selectedId === server.id
              const isActive = currentServer?.id === server.id
              const isFav = favoriteServers.includes(server.id)
              const isVisible = filteredServers.some(s => s.id === server.id)

              const dotSize = isSelected ? 15 : isActive ? 13 : 10
              const color = getPingColor(server.ping)

              return (
                <g 
                  key={server.id} 
                  onClick={() => handleMapSelect(server.id)}
                  className="cursor-pointer"
                  style={{ opacity: isVisible ? 1 : 0.25 }}
                >
                  {/* Glow ring for selected/active */}
                  {(isSelected || isActive) && (
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={dotSize + 9} 
                      fill="none" 
                      stroke={isSelected ? '#3B82F6' : '#22C55E'} 
                      strokeWidth="2" 
                      strokeOpacity="0.35"
                    />
                  )}
                  <circle 
                    cx={pos.x} 
                    cy={pos.y} 
                    r={dotSize} 
                    fill={color} 
                    stroke="#05070A" 
                    strokeWidth="3"
                  />
                  {/* Inner highlight */}
                  <circle 
                    cx={pos.x - 2} 
                    cy={pos.y - 2} 
                    r={dotSize * 0.4} 
                    fill="white" 
                    opacity="0.6" 
                  />
                  {/* Flag label on hover-ish via title, but always tiny text for sim */}
                  <text 
                    x={pos.x} 
                    y={pos.y - dotSize - 8} 
                    textAnchor="middle" 
                    fontSize="11" 
                    fill="#F1F5F9" 
                    fontWeight="600"
                    opacity={isSelected || isActive ? 1 : 0.85}
                  >
                    {server.flag}
                  </text>
                  {isFav && (
                    <circle cx={pos.x + 9} cy={pos.y - 9} r="5" fill="#F59E0B" stroke="#05070A" strokeWidth="1.5" />
                  )}
                </g>
              )
            })}

            {/* Continent labels */}
            <text x="150" y="95" fill="#475569" fontSize="11" fontWeight="500">NORTH AMERICA</text>
            <text x="460" y="78" fill="#475569" fontSize="11" fontWeight="500">EUROPE</text>
            <text x="720" y="85" fill="#475569" fontSize="11" fontWeight="500">ASIA</text>
            <text x="850" y="445" fill="#475569" fontSize="11" fontWeight="500">OCEANIA</text>
          </svg>

          {/* Map legend */}
          <div className="flex items-center justify-between mt-3 px-2 text-[10px] text-secondary">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> &lt;20ms
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]" /> 21-40ms
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f97316]" /> 41ms+
              </div>
            </div>
            <div className="font-mono tracking-widest">TAP DOTS TO SELECT</div>
          </div>
        </div>
      </GlassCard>

      {/* Selected server detail hero (when chosen) */}
      <AnimatePresence>
        {selectedServer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6"
          >
            <GlassCard accent={currentServer?.id === selectedServer.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{selectedServer.flag}</div>
                  <div>
                    <div className="font-semibold text-xl tracking-[-0.3px]">{selectedServer.city}</div>
                    <div className="text-secondary">{selectedServer.country} • {continentLabels[serverPositions[selectedServer.id]?.continent || 'NA']}</div>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      <span className="font-mono text-[#22D3EE]">{selectedServer.ping}ms</span>
                      <span className={getLoadColor(selectedServer.load)}>Load {selectedServer.load}%</span>
                      <span className="text-tertiary font-mono text-xs">{selectedServer.ip}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <button
                    onClick={(e) => handleFavorite(selectedServer.id, e)}
                    className="p-2 text-tertiary hover:text-white active:scale-90"
                  >
                    {favoriteServers.includes(selectedServer.id) 
                      ? <Star size={20} className="fill-[#F59E0B] text-[#F59E0B]" /> 
                      : <StarOff size={20} />}
                  </button>
                  <Button 
                    onClick={() => handleSelectForVPN(selectedServer)} 
                    size="sm"
                    variant={isConnected ? "secondary" : "primary"}
                  >
                    {isConnected ? 'Switch to Server' : 'Select & Connect'}
                  </Button>
                </div>
              </div>

              {selectedServer.id === currentServer?.id && (
                <div className="mt-3 text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 inline-flex items-center gap-1">
                  <Zap size={13} /> CURRENTLY ACTIVE
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search cities or countries on the map..."
            aria-label="Search servers by city or country"
            className="input py-3 pl-11 text-sm"
          />
          <MapPin className="absolute left-4 top-3.5 text-tertiary" size={18} aria-hidden="true" />
        </div>

        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filter servers by region">
          {continents.map(c => (
            <button
              key={c}
              role="radio"
              onClick={() => setContinentFilter(c)}
              aria-checked={continentFilter === c}
              className={`tab text-xs ${continentFilter === c ? 'tab-active' : 'bg-[var(--bg-subtle)] text-secondary'}`}
            >
              {c === 'All' ? 'All Regions' : continentLabels[c]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filter servers by ping speed">
          <button
            role="radio"
            onClick={() => setPingFilter(pingFilter === 'all' ? 'fast' : 'all')}
            aria-checked={pingFilter === 'fast'}
            className={`tab text-xs ${pingFilter === 'fast' ? 'tab-active' : 'bg-[var(--bg-subtle)] text-secondary'}`}
          >
            {pingFilter === 'fast' ? '⚡ Fastest (<30ms)' : 'All Pings'}
          </button>
        </div>
      </div>

      {/* Server Cards Grid (synced with map) */}
      <div className="grid grid-cols-1 gap-3 pb-6">
        {filteredServers.length === 0 && (
          <div className="glass rounded-3xl p-8 text-center text-secondary">
            No servers match current filters. <button onClick={resetFilters} className="text-[var(--accent)] underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" aria-label="Clear all filters">Clear</button>
          </div>
        )}

        {filteredServers.map((server) => {
          const isSelected = selectedId === server.id
          const isActive = currentServer?.id === server.id
          const isFav = favoriteServers.includes(server.id)
          const pos = serverPositions[server.id]

          return (
            <div
              key={server.id}
              role="button"
              tabIndex={0}
              onClick={() => handleCardSelect(server)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardSelect(server); } }}
              className={`server-card w-full text-left flex items-center justify-between cursor-pointer transition-all ${isSelected ? 'ring-1 ring-[#3B82F6]/70' : ''} ${isActive ? 'active' : ''}`}
              aria-label={`Select server ${server.city}, ${server.country}, ${server.ping}ms ping`}
              aria-pressed={isSelected}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl w-9 flex-shrink-0">{server.flag}</div>
                <div className="min-w-0">
                  <div className="font-semibold tracking-[-0.2px] flex items-center gap-2">
                    {server.city}
                    {pos && <span className="text-[10px] font-mono px-1.5 py-px rounded bg-[var(--bg-subtle)] text-tertiary">{pos.continent}</span>}
                  </div>
                  <div className="text-xs text-tertiary truncate">{server.country}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right flex-shrink-0">
                <div>
                  <div className="font-mono text-sm tabular-nums" style={{ color: getPingColor(server.ping) }}>
                    {server.ping}<span className="text-[10px] text-tertiary">ms</span>
                  </div>
                  <div className="text-[10px] text-tertiary -mt-px">ping • {server.load}%</div>
                </div>

                <button
                  onClick={(e) => handleFavorite(server.id, e)}
                  className="p-2 -mr-1 text-tertiary hover:text-white active:scale-90 transition"
                  aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
                >
                  {isFav ? <Star size={19} className="fill-[#F59E0B] text-[#F59E0B]" /> : <StarOff size={19} />}
                </button>

                <Button 
                  size="sm" 
                  variant={isActive ? 'secondary' : 'ghost'}
                  onClick={(e) => { e.stopPropagation(); handleSelectForVPN(server) }}
                  className="min-w-[86px]"
                >
                  {isActive ? 'Active' : 'Select'}
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom actions */}
      <div className="flex gap-3 pt-2">
        <Button 
          variant="secondary" 
          fullWidth 
          onClick={() => navigate('/app/locations')}
        >
          Back to List View
        </Button>
        {selectedServer && (
          <Button 
            variant="primary" 
            fullWidth 
            onClick={handleQuickConnect}
            leftIcon={<Zap size={17} />}
          >
            {isConnected ? 'Switch Now' : 'Use on Home'}
          </Button>
        )}
      </div>

      <p className="text-center text-[10px] text-[#475569] mt-8 tracking-widest">SIMULATED • POSITIONS ARE APPROXIMATE FOR VISUAL SELECTION</p>
    </div>
  )
}
