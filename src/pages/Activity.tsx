import { useState } from 'react'
import { Trash2, Download } from 'lucide-react'
import { useVPNStore } from '@/store/vpnStore'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Button } from '@/components/ui'

export default function Activity() {
  const { logs, clearLogs } = useVPNStore()
  const [filter, setFilter] = useState<'all' | 'connect' | 'disconnect'>('all')

  const filteredLogs = logs.filter(l => filter === 'all' || l.type === filter)

  const handleExport = () => {
    const csv = logs.map(l => 
      `${l.timestamp},${l.type},"${l.server}",${l.duration || ''},${l.dataUsed || ''}`
    ).join('\n')
    
    const blob = new Blob([`timestamp,type,server,duration,data\n${csv}`], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aether-activity-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Exported', { description: 'Activity log saved to your downloads.' })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-[28px] tracking-[-1px] font-semibold">Activity</h1>
          <p className="text-tertiary text-sm">{logs.length} events • speedtests auto-recorded</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleExport}
            className="px-4 text-xs flex items-center gap-1.5"
          >
            <Download size={15} /> Export
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => { clearLogs(); toast('Logs cleared') }}
            className="w-9 p-0 text-[#EF4444]"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'connect', 'disconnect'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`tab capitalize ${filter === f ? 'tab-active' : 'bg-white/5'}`}>
            {f}
          </button>
        ))}
      </div>

      {filteredLogs.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <div className="text-tertiary mb-2">No activity yet</div>
          <p className="text-sm text-[#475569]">Connect to a server to start recording sessions.</p>
        </div>
      ) : (
        <div className="space-y-1 pb-10">
          {filteredLogs.map((log) => {
            const color = log.type === 'connect' ? 'text-emerald-400' : log.type === 'disconnect' ? 'text-[#EF4444]' : log.type === 'speedtest' ? 'text-[#22D3EE]' : 'text-[#3B82F6]'
            const dotColor = log.type === 'connect' ? 'bg-emerald-400' : log.type === 'disconnect' ? 'bg-[#EF4444]' : log.type === 'speedtest' ? 'bg-[#22D3EE]' : 'bg-[#3B82F6]'
            
            return (
              <div key={log.id} className="log-item glass rounded-3xl px-5 py-4">
                <div className={`log-dot ${dotColor}`} />
                
                <div className="flex items-start justify-between">
                  <div>
                    <div className={`font-semibold tracking-tight ${color}`}>
                      {log.type === 'connect' ? 'Connected' : log.type === 'disconnect' ? 'Disconnected' : log.type === 'speedtest' ? 'Speed Test Completed' : 'Server Changed'}
                    </div>
                    <div className="text-sm text-secondary">{log.server}</div>
                  </div>
                  <div className="text-right text-xs text-tertiary tabular-nums">
                    {format(new Date(log.timestamp), 'HH:mm')}
                  </div>
                </div>
                
                {(log.duration || log.dataUsed) && (
                  <div className="mt-3 text-xs flex gap-3 text-tertiary">
                    {log.type === 'speedtest' ? (
                      <>
                        <span>{log.duration}</span>
                        <span>{log.dataUsed}</span>
                      </>
                    ) : (
                      <>
                        {log.duration && <span>Duration: {log.duration}</span>}
                        {log.dataUsed && <span>Data: {log.dataUsed}</span>}
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
