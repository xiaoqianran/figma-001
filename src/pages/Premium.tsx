import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown, Check, ArrowRight, CreditCard, Calendar, Zap } from 'lucide-react'
import { useVPNStore } from '@/store/vpnStore'
import { GlassCard, Button } from '@/components/ui'
import { toast } from 'sonner'

interface Plan {
  id: string
  name: string
  price: string
  cycle: string
  savings?: string
  features: string[]
  popular?: boolean
  current?: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    cycle: 'Forever',
    features: [
      '1 device',
      '10 servers',
      'Basic encryption',
      'Standard support',
    ],
  },
  {
    id: 'pro-monthly',
    name: 'Aether Pro',
    price: '$9.99',
    cycle: 'per month',
    features: [
      '5 devices',
      'All 94 servers',
      'All protocols + WireGuard',
      'Priority 24/7 support',
      'No logs policy',
      'Streaming optimized',
    ],
    popular: true,
  },
  {
    id: 'pro-yearly',
    name: 'Aether Pro',
    price: '$99.99',
    cycle: 'per year',
    savings: 'Save 17%',
    features: [
      '5 devices',
      'All 94 servers',
      'All protocols + WireGuard',
      'Priority 24/7 support',
      'No logs policy',
      'Streaming optimized',
    ],
  },
  {
    id: 'family-monthly',
    name: 'Aether Family',
    price: '$14.99',
    cycle: 'per month',
    features: [
      '10 devices',
      'All Pro features',
      'Family sharing dashboard',
      'Dedicated account manager',
    ],
  },
]

export default function Premium() {
  const navigate = useNavigate()
  const { subscription, upgradeSubscription, paymentMethods } = useVPNStore()
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  const defaultPayment = paymentMethods.find(p => p.isDefault) || paymentMethods[0]

  const handleUpgrade = (plan: Plan) => {
    if (plan.name === subscription.plan && !plan.id.includes('yearly')) {
      toast.info('You are already on this plan')
      return
    }

    const cycle = plan.id.includes('yearly') ? 'yearly' : 'monthly'
    const targetPlan = plan.name

    // Simulate payment processing
    const processingToast = toast.loading(`Processing upgrade to ${targetPlan}...`)

    setTimeout(() => {
      upgradeSubscription(targetPlan, cycle)
      toast.dismiss(processingToast)
      toast.success(`Upgraded to ${targetPlan}!`, {
        description: `Billed ${plan.price} ${plan.cycle} to ${defaultPayment?.label || 'default method'}. Thank you!`,
      })
      setSelectedPlanId(null)
      // Refresh visual state via store subscription
    }, 1150)
  }

  const currentPlanName = subscription.plan

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#22D3EE] flex items-center justify-center">
          <Crown className="text-white" size={22} />
        </div>
        <div>
          <div className="font-semibold text-3xl tracking-[-0.6px]">Premium</div>
          <div className="text-secondary text-sm">Manage your subscription</div>
        </div>
      </div>

      {/* Current Subscription */}
      <GlassCard padding="lg" className="mb-8 border border-[#3B82F6]/20" accent>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="uppercase tracking-[2.5px] text-[10px] text-[#22D3EE] font-medium">CURRENT PLAN</div>
            <div className="text-4xl font-semibold tracking-[-1px] mt-1">{subscription.plan}</div>
            <div className="text-emerald-400 text-sm mt-1 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-semibold tabular-nums tracking-tight">{subscription.price}</div>
            <div className="text-xs text-tertiary">{subscription.billingCycle}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-sm">
          <div>
            <div className="text-tertiary text-xs tracking-widest mb-0.5">RENEWS</div>
            <div className="font-medium flex items-center gap-2">
              <Calendar size={15} className="text-secondary" /> {subscription.nextBilling}
            </div>
          </div>
          <div>
            <div className="text-tertiary text-xs tracking-widest mb-0.5">PAYMENT METHOD</div>
            <button 
              onClick={() => navigate('/app/payment-methods')}
              className="font-medium flex items-center gap-2 text-[#3B82F6] active:opacity-70"
            >
              <CreditCard size={15} /> {defaultPayment?.label || 'None'} <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button 
            variant="secondary" 
            fullWidth 
            size="md"
            onClick={() => navigate('/app/payment-methods')}
          >
            Manage Payment Methods
          </Button>
          <Button 
            variant="ghost" 
            fullWidth 
            size="md"
            onClick={() => navigate('/app/billing')}
          >
            View Billing History
          </Button>
        </div>
      </GlassCard>

      {/* Upgrade Plans */}
      <div className="mb-4 px-1">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="uppercase tracking-[2px] text-xs text-[#22D3EE]">CHOOSE YOUR PLAN</div>
            <div className="font-semibold text-xl tracking-tight">Upgrade your protection</div>
          </div>
          <Zap size={18} className="text-secondary" />
        </div>
      </div>

      <div className="space-y-4 mb-10">
        {plans.map((plan) => {
          const isCurrent = plan.name === currentPlanName && !plan.id.includes('yearly') && !plan.id.includes('family')
          const isYearlyCurrent = plan.id.includes('yearly') && subscription.billingCycle === 'yearly' && plan.name === currentPlanName
          const isActive = isCurrent || isYearlyCurrent

          return (
            <GlassCard 
              key={plan.id} 
              padding="lg" 
              interactive
              accent={isActive}
              className={plan.popular ? 'ring-1 ring-[#3B82F6]/60' : ''}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-2xl tracking-[-0.4px]">{plan.name}</span>
                    {plan.popular && (
                      <span className="text-[10px] uppercase tracking-[1.5px] px-2 py-0.5 rounded-full bg-[#3B82F6] text-white">POPULAR</span>
                    )}
                    {isActive && (
                      <span className="text-[10px] uppercase tracking-[1.5px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">CURRENT</span>
                    )}
                  </div>
                  <div className="text-tertiary text-sm mt-px">{plan.cycle}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold tabular-nums text-3xl tracking-[-1px]">{plan.price}</div>
                  {plan.savings && <div className="text-emerald-400 text-xs font-medium">{plan.savings}</div>}
                </div>
              </div>

              <ul className="space-y-2 mb-6 text-sm">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-[#E2E8F0]">
                    <Check size={16} className="text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                fullWidth
                variant={isActive ? 'secondary' : plan.popular ? 'primary' : 'secondary'}
                disabled={isActive}
                onClick={() => {
                  setSelectedPlanId(plan.id)
                  handleUpgrade(plan)
                }}
                loading={selectedPlanId === plan.id}
              >
                {isActive ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </Button>
            </GlassCard>
          )
        })}
      </div>

      {/* Benefits Comparison */}
      <div className="mb-4 px-1">
        <div className="uppercase tracking-[2px] text-xs text-[#22D3EE]">WHY AETHER PRO?</div>
        <div className="font-semibold text-xl tracking-tight">Compare plans</div>
      </div>

      <GlassCard padding="lg">
        <div className="grid grid-cols-3 text-sm font-medium pb-3 border-b border-white/10">
          <div className="text-tertiary">Feature</div>
          <div className="text-center text-tertiary">Free</div>
          <div className="text-center text-[#3B82F6]">Pro / Family</div>
        </div>

        {[
          ['Devices', '1', '5–10'],
          ['Servers', '10', '94 worldwide'],
          ['Speed', 'Standard', 'Unlimited'],
          ['Protocols', 'Basic', 'All + obfuscation'],
          ['Support', 'Standard', 'Priority + live chat'],
          ['Privacy', 'Basic', 'True zero-knowledge'],
          ['Streaming', 'Limited', 'Optimized servers'],
          ['Logs', 'Some metadata', 'No logs ever'],
        ].map(([feature, free, pro], i) => (
          <div key={i} className="grid grid-cols-3 py-3 text-sm border-b border-white/5 last:border-0 items-center">
            <div className="text-[#E2E8F0]">{feature}</div>
            <div className="text-center text-tertiary">{free}</div>
            <div className="text-center text-emerald-400 font-medium flex items-center justify-center gap-1">
              <Check size={15} /> {pro}
            </div>
          </div>
        ))}
      </GlassCard>

      <div className="mt-8 text-center">
        <p className="text-xs text-[#475569]">All plans include our 30-day money-back guarantee. Cancel anytime.</p>
        <button 
          onClick={() => navigate('/app/billing')}
          className="mt-3 text-sm text-[#3B82F6] font-medium flex items-center gap-1 mx-auto"
        >
          View full billing history <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}
