import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import { useVPNStore, type Invoice } from '@/store/vpnStore'
import { GlassCard, Button } from '@/components/ui'
import { toast } from 'sonner'

export default function Billing() {
  const navigate = useNavigate()
  const { invoices, subscription } = useVPNStore()

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Realistic simulation: create a simple text receipt and trigger download
    const content = [
      'AETHER VPN — INVOICE',
      '============================',
      `Invoice ID: ${invoice.id}`,
      `Date: ${new Date(invoice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      `Plan: ${invoice.plan}`,
      `Billing Period: ${invoice.period}`,
      `Amount: ${invoice.amount}`,
      `Status: ${invoice.status.toUpperCase()}`,
      '',
      'Thank you for choosing Aether.',
      'Your subscription keeps the internet free and private.',
      '',
      'Aether Inc.',
      'Privacy First • Zero Logs',
    ].join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aether-invoice-${invoice.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('Invoice downloaded', {
      description: `${invoice.id} • ${invoice.amount}`,
    })
  }

  const totalSpent = invoices
    .reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '')), 0)
    .toFixed(2)

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-secondary active:bg-[var(--bg-subtle)] rounded-full"
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <div className="font-semibold text-3xl tracking-[-0.6px]">Billing</div>
          <div className="text-secondary text-sm">History & invoices</div>
        </div>
      </div>

      {/* Summary Card */}
      <GlassCard padding="lg" className="mb-8" accent>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs uppercase tracking-[2px] text-[#22D3EE]">LIFETIME SPEND</div>
            <div className="text-5xl font-semibold tracking-[-2.2px] tabular-nums mt-1">${totalSpent}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-tertiary">Active plan</div>
            <div className="font-semibold text-lg tracking-tight">{subscription.plan}</div>
            <div className="text-xs text-emerald-400 mt-px">{subscription.nextBilling} • renews</div>
          </div>
        </div>
      </GlassCard>

      {/* Invoices List */}
      <div className="mb-5 px-1 flex items-baseline justify-between">
        <div>
          <div className="uppercase tracking-[2px] text-xs text-[#22D3EE]">INVOICES</div>
          <div className="font-semibold text-xl tracking-tight">Billing history</div>
        </div>
        <div className="text-xs text-tertiary">{invoices.length} total</div>
      </div>

      {invoices.length === 0 ? (
        <GlassCard padding="lg" className="text-center py-10">
          <FileText className="mx-auto mb-4 text-tertiary" size={42} />
          <p className="text-secondary">No invoices yet.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <GlassCard key={invoice.id} padding="lg" interactive className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="font-mono text-sm text-secondary">{invoice.id}</div>
                  <div className={`text-[10px] px-2 py-px rounded font-medium tracking-wider uppercase ${invoice.status === 'paid' 
                    ? 'bg-emerald-500/15 text-emerald-400' 
                    : 'bg-amber-500/15 text-amber-400'}`}>
                    {invoice.status}
                  </div>
                </div>
                <div className="font-semibold text-lg tracking-tight mt-0.5">{invoice.plan}</div>
                <div className="text-xs text-tertiary mt-px">{invoice.period}</div>
              </div>

              <div className="text-right flex flex-col items-end gap-2">
                <div className="font-semibold tabular-nums text-xl tracking-tight">{invoice.amount}</div>
                <div className="text-xs text-tertiary">{new Date(invoice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleDownloadInvoice(invoice)}
                  className="mt-0.5 !h-8 px-3 text-xs gap-1.5"
                >
                  <Download size={14} /> Download
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <div className="mt-9 px-1">
        <Button 
          variant="secondary" 
          fullWidth 
          onClick={() => navigate('/app/premium')}
        >
          Manage Subscription
        </Button>
        <p className="text-center mt-4 text-xs text-tertiary">
          Need help with billing? <span className="text-[#3B82F6]">Contact support</span>
        </p>
      </div>
    </div>
  )
}
