import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Trash2, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { GlassCard, Button, Input } from '@/components/ui'
import { useVPNStore } from '@/store/vpnStore'
import { toast } from 'sonner'

type PrivacyKey = 'analyticsSharing' | 'crashReporting' | 'personalizedRecommendations' | 'dataCollectionForImprovement'

const privacyLabels: Record<PrivacyKey, { title: string; desc: string }> = {
  analyticsSharing: {
    title: 'Anonymous Usage Analytics',
    desc: 'Help improve Aether by sharing aggregated, anonymized usage patterns.',
  },
  crashReporting: {
    title: 'Crash & Error Reporting',
    desc: 'Automatically send crash reports to help us fix issues faster.',
  },
  personalizedRecommendations: {
    title: 'Personalized Server Recommendations',
    desc: 'Use your location & history to suggest optimal servers.',
  },
  dataCollectionForImprovement: {
    title: 'Data for Service Improvement',
    desc: 'Allow limited telemetry to enhance speeds, reliability and features.',
  },
}

export default function Privacy() {
  const navigate = useNavigate()
  const { 
    user, 
    privacySettings, 
    updatePrivacySetting, 
    logs,
    disconnect 
  } = useVPNStore()

  const [deleteStep, setDeleteStep] = useState<'idle' | 'confirm' | 'deleting' | 'deleted'>('idle')
  const [confirmText, setConfirmText] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  const handleToggle = (key: PrivacyKey) => {
    const newValue = !privacySettings[key]
    updatePrivacySetting(key, newValue)
    
    toast.success(newValue ? 'Setting enabled' : 'Setting disabled', {
      description: privacyLabels[key].title,
    })
  }

  const handleExportData = async () => {
    setIsExporting(true)

    // Build a comprehensive export package (simulation of real GDPR-style export)
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      userProfile: {
        name: user.name,
        email: user.email,
        plan: user.plan,
        memberSince: '2024-11-02',
      },
      privacySettings: { ...privacySettings },
      activitySummary: {
        totalSessions: logs.length,
        lastExportNote: 'Full raw logs are included separately in Activity export',
      },
      accountMetadata: {
        devicesLinked: 2,
        lastLogin: new Date().toISOString(),
        dataRetentionPolicy: 'Zero-knowledge: no traffic or connection content is ever logged',
      },
      legal: {
        notice: 'This export contains all data Aether holds about your account. We do not store browsing history, DNS queries, or traffic contents.',
        rights: 'Under applicable privacy laws you may request full deletion at any time.',
      },
    }

    // Small delay for polish
    await new Promise(r => setTimeout(r, 420))

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aether-data-export-${user.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsExporting(false)
    toast.success('Export complete', {
      description: 'Your privacy data archive has been downloaded securely.',
    })
  }

  const startDeleteFlow = () => {
    setDeleteStep('confirm')
    setConfirmText('')
  }

  const cancelDelete = () => {
    setDeleteStep('idle')
    setConfirmText('')
  }

  const confirmAccountDeletion = async () => {
    if (confirmText.trim().toUpperCase() !== 'DELETE') {
      toast.error('Confirmation text incorrect', {
        description: 'Please type DELETE exactly to proceed.',
      })
      return
    }

    setDeleteStep('deleting')

    // Realistic simulation delay
    await new Promise(r => setTimeout(r, 1650))

    // Simulate full cleanup
    disconnect()
    
    setDeleteStep('deleted')
    toast.success('Account scheduled for deletion', {
      description: 'All data will be permanently purged within 30 days per our policy.',
    })
  }

  const finishAndRedirect = () => {
    // In a real app this would log the user out fully
    navigate('/')
  }

  const renderToggle = (key: PrivacyKey) => {
    const enabled = privacySettings[key]
    const { title, desc } = privacyLabels[key]

    return (
      <GlassCard key={key} className="flex items-center justify-between p-5" interactive>
        <div className="pr-4">
          <div className="font-medium tracking-tight">{title}</div>
          <div className="text-sm text-[#94A3B8] mt-1 leading-snug">{desc}</div>
        </div>

        {/* Beautiful custom toggle switch */}
        <button
          onClick={() => handleToggle(key)}
          className={`relative w-14 h-8 rounded-full transition-all duration-200 flex-shrink-0 ${
            enabled ? 'bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]' : 'bg-white/10'
          }`}
          aria-label={`Toggle ${title}`}
          aria-pressed={enabled}
        >
          <div
            className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-200 ${
              enabled ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </GlassCard>
    )
  }

  // Deleted success state — beautiful full screen treatment inside the card flow
  if (deleteStep === 'deleted') {
    return (
      <div className="pb-24">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={finishAndRedirect}
            className="w-10 h-10 flex items-center justify-center rounded-2xl glass active:scale-95 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-display text-[28px] tracking-[-1px] font-semibold">Privacy &amp; Data</h1>
          </div>
        </div>

        <GlassCard className="text-center py-14 px-6" padding="lg">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-semibold tracking-tight mb-3">Account Deletion Initiated</div>
          <p className="text-[#94A3B8] max-w-[300px] mx-auto leading-relaxed">
            Thank you for trusting Aether. Your data is being permanently removed from our systems.
            You will receive a final confirmation email within 24 hours.
          </p>
          <div className="mt-8">
            <Button variant="secondary" onClick={finishAndRedirect} fullWidth>
              Return to Welcome Screen
            </Button>
          </div>
          <div className="mt-6 text-[11px] text-[#475569] tracking-widest">AETHER • ZERO KNOWLEDGE • FOREVER</div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="pb-24">
      {/* Top navigation */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-2xl glass active:scale-95 transition"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-[28px] tracking-[-1px] font-semibold">Privacy &amp; Data</h1>
          <p className="text-tertiary text-sm">Control your information and account</p>
        </div>
      </div>

      {/* Trust banner */}
      <GlassCard className="mb-8 border border-[#22D3EE]/20" padding="md">
        <div className="flex gap-4">
          <div className="mt-0.5">
            <Shield className="text-[#22D3EE]" size={22} />
          </div>
          <div className="text-sm leading-snug text-[#94A3B8]">
            Aether is built on a true zero-knowledge architecture. We cannot see, store, or sell your browsing activity.
            These controls affect only the minimal metadata we collect to keep the service running.
          </div>
        </div>
      </GlassCard>

      {/* Privacy Controls */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="uppercase tracking-[2px] text-xs text-tertiary">PRIVACY CONTROLS</div>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="space-y-3">
          {(Object.keys(privacyLabels) as PrivacyKey[]).map(renderToggle)}
        </div>
      </div>

      {/* Data Management */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="uppercase tracking-[2px] text-xs text-tertiary">DATA MANAGEMENT</div>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="space-y-4">
          {/* Export Data */}
          <GlassCard padding="lg">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-[#22D3EE] flex-shrink-0">
                <Download size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold tracking-tight">Export My Data</div>
                <div className="text-sm text-[#94A3B8] mt-1 pr-2">
                  Download a complete archive of your account information, preferences, and activity metadata in JSON format.
                </div>
                <div className="mt-5">
                  <Button 
                    variant="secondary" 
                    onClick={handleExportData}
                    loading={isExporting}
                    leftIcon={<Download size={16} />}
                  >
                    Download Data Archive
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Delete Account */}
          <GlassCard 
            className={`border ${deleteStep === 'confirm' ? 'border-[#EF4444]/40' : 'border-white/10'}`} 
            padding="lg"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444] flex-shrink-0">
                <Trash2 size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold tracking-tight">Delete Account</div>
                <div className="text-sm text-[#94A3B8] mt-1 pr-2">
                  Permanently delete your Aether account and all associated data. This action is irreversible after 30 days.
                </div>

                {deleteStep === 'idle' && (
                  <div className="mt-5">
                    <Button 
                      variant="secondary" 
                      onClick={startDeleteFlow}
                      className="text-[#EF4444] border-[#EF4444]/30 hover:border-[#EF4444]/50"
                    >
                      Delete My Account
                    </Button>
                  </div>
                )}

                {deleteStep === 'confirm' && (
                  <div className="mt-5 space-y-4">
                    <div className="flex items-start gap-2 text-[#F59E0B] text-sm">
                      <AlertTriangle size={16} className="mt-px flex-shrink-0" />
                      <div>
                        This will immediately sign you out and schedule permanent deletion of your profile, 
                        preferences, and history.
                      </div>
                    </div>

                    <Input
                      label="TYPE DELETE TO CONFIRM"
                      placeholder="DELETE"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      containerClassName="max-w-xs"
                    />

                    <div className="flex gap-3 pt-1">
                      <Button variant="ghost" onClick={cancelDelete}>
                        Cancel
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={confirmAccountDeletion}
                        className="text-[#EF4444] border-[#EF4444]/40"
                        disabled={confirmText.trim().toUpperCase() !== 'DELETE'}
                      >
                        Permanently Delete Account
                      </Button>
                    </div>
                  </div>
                )}

                {deleteStep === 'deleting' && (
                  <div className="mt-5 flex items-center gap-3 text-sm text-[#94A3B8]">
                    <div className="animate-spin w-4 h-4 border-2 border-white/20 border-t-[#EF4444] rounded-full" />
                    Securely erasing data and revoking sessions...
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Footer info */}
      <div className="px-1">
        <div className="flex gap-3 text-xs text-[#475569]">
          <Info size={14} className="mt-px" />
          <span>
            For full legal details see our Privacy Policy. Data requests can also be made by emailing privacy@aether.vpn.
          </span>
        </div>
      </div>
    </div>
  )
}
