import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Star, StarOff, MapPin } from 'lucide-react'
import { useVPNStore, type Server } from '@/store/vpnStore'
import { toast } from 'sonner'

export default function Locations() {
  const navigate = useNavigate()
  const { 
    servers, 
    currentServer, 
    selectedServerId,
    favoriteServers, 
    isConnected, 
    isConnecting,
    changeServer, 
    connect,
    toggleFavorite, 
    setSelectedServer 
  } = useVPNStore()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')

  const filtered = servers
    .filter(s => {
      const q = search.toLowerCase()
      const match = s.city.toLowerCase().includes(q) || s.country.toLowerCase().includes(q)
      if (filter === 'favorites') return favoriteServers.includes(s.id) && match
      return match
    })
    .sort((a, b) => {
      const aFav = favoriteServers.includes(a.id) ? -1 : 1
      const bFav = favoriteServers.includes(b.id) ? -1 : 1
      return aFav - bFav || a.ping - b.ping
    })

  const handleSelect = (server: Server) => {
    setSelectedServer(server.id)

    if (isConnected) {
      // Already connected → seamless re-route
      changeServer(server)
      toast.success(`Switched to ${server.city}`, {
        description: `Re-routing through ${server.country} • ${server.ping}ms`,
      })
    } else if (!isConnecting) {
      // Not connected → tapping a location should actually connect you to it (most expected behavior)
      connect()
      toast.success(`Connecting to ${server.city}`, {
        description: `${server.country} • ${server.ping}ms`,
      })
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-[28px] tracking-[-1px] font-semibold">Locations</h1>
        <p className="text-tertiary text-sm">94 servers • 6 continents</p>
      </div>

      {/* Quick entry to new visual Server Map */}
      <button
        onClick={() => navigate('/app/server-map')}
        className="glass w-full mb-6 rounded-3xl p-4 flex items-center justify-between active:scale-[0.985] transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3B82F6]/20 to-[#22D3EE]/10 flex items-center justify-center">
            <MapPin className="text-[var(--accent)]" size={22} />
          </div>
          <div className="text-left">
            <div className="font-semibold tracking-tight">Open Server Map</div>
            <div className="text-xs text-tertiary">Interactive visual selection with live dots</div>
          </div>
        </div>
        <div className="text-[var(--accent)] group-active:translate-x-0.5 transition">→</div>
      </button>

      {/* Search + Filters */}
      <div className="relative mb-4">
        <Search className="absolute left-5 top-3.5 text-tertiary" size={18} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search cities or countries..."
          className="input pl-12 py-3 text-sm"
        />
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'favorites'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`tab ${filter === f ? 'tab-active' : ''}`}
          >
            {f === 'all' ? 'All Servers' : 'Favorites'}
          </button>
        ))}
      </div>

      {/* Server List */}
      <div className="space-y-3 pb-8">
        {filtered.length === 0 && (
          <div className="glass rounded-3xl p-8 text-center text-tertiary">No servers found.</div>
        )}

        {filtered.map((server) => {
          const isConnectedHere = currentServer?.id === server.id
          const isSelectedNext = selectedServerId === server.id && !isConnectedHere
          const isFav = favoriteServers.includes(server.id)

          return (
            <div
              key={server.id}
              onClick={() => handleSelect(server)}
              className={`server-card flex items-center justify-between cursor-pointer transition-all ${isConnectedHere ? 'active ring-2 ring-emerald-400/70' : ''} ${isSelectedNext ? 'ring-2 ring-[var(--accent)] shadow-[0_0_0_1px_var(--accent)]' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl w-9">{server.flag}</div>
                <div>
                  <div className="font-semibold tracking-[-0.2px]">{server.city}</div>
                  <div className="text-xs text-tertiary">{server.country}</div>
                </div>
              </div>

              <div className="flex items-center gap-5 text-right">
                <div>
                  <div className="font-mono text-sm tabular-nums">{server.ping}<span className="text-[10px] text-tertiary">ms</span></div>
                  <div className="text-[10px] text-tertiary -mt-px">ping</div>
                </div>

                {/* Status badges */}
                <div className="flex items-center gap-2">
                  {isConnectedHere && (
                    <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-medium tracking-widest">
                      CONNECTED
                    </div>
                  )}
                  {isSelectedNext && (
                    <div className="px-2.5 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] text-[10px] font-semibold tracking-widest">
                      NEXT
                    </div>
                  )}

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(server.id) }}
                    className="p-2 -mr-2 text-tertiary hover:text-white active:text-[#F59E0B] transition-colors"
                  >
                    {isFav ? <Star size={18} className="fill-[#F59E0B] text-[#F59E0B]" /> : <StarOff size={18} />}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
