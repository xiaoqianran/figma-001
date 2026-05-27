import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Smartphone, Laptop, Monitor, Tablet, Trash2, ShieldCheck } from 'lucide-react'
import { useVPNStore, type Device } from '@/store/vpnStore'
import { toast } from 'sonner'
import { Button, GlassCard } from '@/components/ui'

/** Device icon by type */
const DeviceIcon = ({ type }: { type: Device['type'] }) => {
  const size = 18
  const cls = "text-secondary"
  if (type === 'Phone') return <Smartphone size={size} className={cls} />
  if (type === 'Laptop') return <Laptop size={size} className={cls} />
  if (type === 'Desktop') return <Monitor size={size} className={cls} />
  if (type === 'Tablet') return <Tablet size={size} className={cls} />
  return <Smartphone size={size} className={cls} />
}

export default function Devices() {
  const navigate = useNavigate()
  const { security, removeDevice } = useVPNStore()
  const { devices } = security

  const handleSignOut = (device: Device) => {
    if (device.isCurrent) {
      toast.error('Cannot sign out current device here', {
        description: 'Use the Sign Out button on your Profile page instead.',
      })
      return
    }

    // Perform removal (store guards current device anyway)
    removeDevice(device.id)

    toast.success(`Signed out ${device.name}`, {
      description: 'All active sessions on that device have been terminated.',
    })
  }

  const handleSignOutAllOthers = () => {
    const others = devices.filter(d => !d.isCurrent)
    if (others.length === 0) {
      toast('No other devices to sign out')
      return
    }

    others.forEach(d => removeDevice(d.id))
    toast.success(`Signed out ${others.length} other device${others.length > 1 ? 's' : ''}`, {
      description: 'Only this device remains active.',
    })
  }

  const currentDevice = devices.find(d => d.isCurrent)

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="w-11 h-11 -ml-2 p-0"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <div className="uppercase tracking-[3px] text-xs text-tertiary">ACCOUNT SECURITY</div>
          <h1 className="font-display text-[28px] tracking-[-1px] font-semibold leading-none mt-0.5">Devices</h1>
        </div>
      </div>

      <p className="text-secondary mb-6 text-sm">
        These devices are currently signed into your Aether account. Sign out any device you don’t recognize immediately.
      </p>

      {/* Current device highlight */}
      {currentDevice && (
        <GlassCard accent padding="lg" className="mb-3">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheck size={20} className="text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base truncate">{currentDevice.name}</span>
                <span className="text-[10px] font-medium px-2 py-px rounded-full bg-emerald-500/15 text-emerald-400 tracking-wider">THIS DEVICE</span>
              </div>
              <div className="text-xs text-tertiary mt-0.5">
                {currentDevice.location} • {currentDevice.ip} • Active now
              </div>
            </div>
            <DeviceIcon type={currentDevice.type} />
          </div>
        </GlassCard>
      )}

      {/* Other devices */}
      <div className="space-y-3">
        {devices
          .filter(d => !d.isCurrent)
          .map((device) => (
            <GlassCard key={device.id} padding="lg" interactive={false}>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <DeviceIcon type={device.type} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{device.name}</div>
                  <div className="text-xs text-tertiary mt-px">
                    {device.location || 'Unknown location'} • {device.ip || '—'} • {device.lastActive}
                  </div>
                  <div className="text-[10px] text-[#475569] mt-1">{device.type}</div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSignOut(device)}
                  className="text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10 px-3 flex-shrink-0"
                >
                  <Trash2 size={15} className="mr-1.5" /> Sign out
                </Button>
              </div>
            </GlassCard>
          ))}
      </div>

      {devices.filter(d => !d.isCurrent).length === 0 && (
        <div className="glass rounded-3xl p-8 text-center text-sm text-tertiary mt-4">
          No other devices are currently signed in.
        </div>
      )}

      {/* Bulk action */}
      {devices.filter(d => !d.isCurrent).length > 0 && (
        <button
          onClick={handleSignOutAllOthers}
          className="mt-6 w-full text-sm font-medium text-[#EF4444] py-3 rounded-3xl border border-white/10 hover:bg-white/5 active:bg-white/10 transition flex items-center justify-center gap-2"
        >
          <Trash2 size={16} /> Sign out all other devices
        </button>
      )}

      <div className="mt-10 text-center">
        <div className="inline-flex items-center gap-2 text-[10px] text-[#475569] bg-white/5 rounded-full px-4 py-1 tracking-widest">
          END-TO-END ENCRYPTED SESSIONS
        </div>
        <p className="text-[10px] mt-3 text-[#475569] max-w-[260px] mx-auto">
          Signing out a device immediately invalidates its access tokens across the Aether network.
        </p>
      </div>
    </div>
  )
}
