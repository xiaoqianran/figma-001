import { useState } from 'react'
import { ArrowLeft, Plus, Trash2, Check, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useVPNStore, type PaymentMethod } from '@/store/vpnStore'
import { GlassCard, Button, Input } from '@/components/ui'
import { toast } from 'sonner'

type PaymentType = PaymentMethod['type']

const paymentOptions: Array<{
  type: PaymentType
  label: string
  description: string
  icon: React.ReactNode
  color: string
}> = [
  {
    type: 'paypal',
    label: 'PayPal',
    description: 'Fast & secure checkout',
    icon: <span className="font-bold text-[#003087]">PayPal</span>,
    color: '#003087',
  },
  {
    type: 'google_pay',
    label: 'Google Pay',
    description: 'Tap to pay with Google',
    icon: <span className="font-semibold tracking-tight">G Pay</span>,
    color: '#4285F4',
  },
  {
    type: 'apple_pay',
    label: 'Apple Pay',
    description: 'Pay with Touch ID or Face ID',
    icon: <span className="font-semibold"> Pay</span>,
    color: '#000000',
  },
  {
    type: 'card',
    label: 'Credit / Debit Card',
    description: 'Visa, Mastercard, Amex',
    icon: <CreditCard size={22} />,
    color: '#3B82F6',
  },
  {
    type: 'wallet',
    label: 'My Wallet',
    description: 'Aether Wallet • Balance',
    icon: <span className="font-semibold">W</span>,
    color: '#22D3EE',
  },
]

export default function PaymentMethods() {
  const navigate = useNavigate()
  const { 
    paymentMethods, 
    addPaymentMethod, 
    removePaymentMethod, 
    setDefaultPaymentMethod 
  } = useVPNStore()

  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedAddType, setSelectedAddType] = useState<PaymentType>('card')
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    email: '',
  })
  const [submitting, setSubmitting] = useState(false)

  // Live region for form and method status feedback (dynamic content announcements)
  const [statusMessage, setStatusMessage] = useState('')

  const defaultId = paymentMethods.find(m => m.isDefault)?.id

  const handleSelectDefault = (id: string) => {
    setDefaultPaymentMethod(id)
    toast.success('Default payment method updated')
  }

  const handleRemove = (method: PaymentMethod) => {
    if (method.isDefault) {
      toast.error('Cannot remove default payment method. Set another as default first.')
      return
    }
    removePaymentMethod(method.id)
    const msg = 'Payment method removed'
    setStatusMessage(msg)
    setTimeout(() => setStatusMessage(''), 2500)
    toast.success(msg)
  }

  const openAddForm = (type: PaymentType) => {
    setSelectedAddType(type)
    setFormData({ name: '', cardNumber: '', expiry: '', cvv: '', email: '' })
    setShowAddForm(true)
  }

  const closeAddForm = () => {
    setShowAddForm(false)
    setFormData({ name: '', cardNumber: '', expiry: '', cvv: '', email: '' })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const selectedOpt = paymentOptions.find(o => o.type === selectedAddType)!

    setTimeout(() => {
      let newMethod: Omit<PaymentMethod, 'id' | 'isDefault'> = {
        type: selectedAddType,
        label: selectedOpt.label,
      }

      if (selectedAddType === 'card') {
        const lastFour = formData.cardNumber.replace(/\s/g, '').slice(-4) || '4242'
        newMethod = {
          ...newMethod,
          label: `${formData.name ? formData.name.split(' ').pop() + ' ' : ''}•••• ${lastFour}`,
          lastFour,
          brand: formData.cardNumber.startsWith('4') ? 'Visa' : formData.cardNumber.startsWith('5') ? 'Mastercard' : 'Card',
        }
      } else if (selectedAddType === 'paypal' || selectedAddType === 'google_pay') {
        newMethod.label = `${selectedOpt.label} • ${formData.email || 'you@domain.com'}`
      } else if (selectedAddType === 'apple_pay') {
        newMethod.label = 'Apple Pay • iPhone'
      } else {
        newMethod.label = 'Aether Wallet • $142.80'
      }

      addPaymentMethod({ ...newMethod, makeDefault: paymentMethods.length === 0 })

      setSubmitting(false)
      closeAddForm()
      const msg = `${selectedOpt.label} added successfully`
      setStatusMessage(msg)
      setTimeout(() => setStatusMessage(''), 2500)
      toast.success(msg, {
        description: 'It is now available for future payments.',
      })
    }, 850)
  }

  const updateForm = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Simple formatter for card number
  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})/g, '$1 ').trim()
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-secondary active:bg-white/5 rounded-full"
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <div className="font-semibold text-3xl tracking-[-0.6px]">Payment Methods</div>
          <div className="text-secondary text-sm">Choose how you pay</div>
        </div>
      </div>

      {/* Live region for dynamic payment status updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">{statusMessage}</div>

      {/* Current Methods Grid */}
      <div className="mb-8">
        <div className="px-1 mb-4 flex items-center justify-between">
          <div className="uppercase tracking-[2px] text-xs text-[#22D3EE]">YOUR METHODS</div>
          <div className="text-xs text-tertiary">{paymentMethods.length} saved</div>
        </div>

        {paymentMethods.length === 0 && (
          <GlassCard padding="lg" className="text-center">
            <p className="text-secondary">No payment methods yet.</p>
          </GlassCard>
        )}

        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const opt = paymentOptions.find(o => o.type === method.type)
            const isDefault = method.id === defaultId

            return (
              <GlassCard 
                key={method.id} 
                padding="lg" 
                interactive
                accent={isDefault}
                className="flex items-center justify-between gap-4 active:scale-[0.985]"
                onClick={() => !isDefault && handleSelectDefault(method.id)}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${opt?.color}15`, color: opt?.color || '#94A3B8' }}
                  >
                    {opt?.icon || <CreditCard size={20} />}
                  </div>
                  <div>
                    <div className="font-semibold tracking-tight">{method.label}</div>
                    <div className="text-xs text-tertiary">{opt?.description}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isDefault && (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <Check size={14} /> DEFAULT
                    </div>
                  )}
                  {!isDefault && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={(e) => { e.stopPropagation(); handleSelectDefault(method.id) }}
                    >
                      Set default
                    </Button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(method) }}
                    className="p-2 text-tertiary hover:text-[#EF4444] active:bg-white/5 rounded-xl"
                    aria-label="Remove"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </GlassCard>
            )
          })}
        </div>
      </div>

      {/* Add New Section */}
      {!showAddForm && (
        <div>
          <div className="px-1 mb-4">
            <div className="uppercase tracking-[2px] text-xs text-[#22D3EE]">ADD NEW METHOD</div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {paymentOptions.map((opt) => (
              <button
                key={opt.type}
                onClick={() => openAddForm(opt.type)}
                className="glass flex items-center justify-between rounded-3xl px-5 py-4 active:scale-[0.985] transition text-left hover:border-white/20"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-base font-medium"
                    style={{ background: `${opt.color}18`, color: opt.color }}
                  >
                    {opt.icon}
                  </div>
                  <div>
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-xs text-tertiary">{opt.description}</div>
                  </div>
                </div>
                <div className="text-[#3B82F6]">
                  <Plus size={20} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Form Flow */}
      {showAddForm && (
        <GlassCard padding="lg" className="border border-[#3B82F6]/30">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-semibold text-xl">Add {paymentOptions.find(o => o.type === selectedAddType)?.label}</div>
              <div className="text-sm text-tertiary">Securely saved to your account</div>
            </div>
            <button onClick={closeAddForm} className="text-secondary p-1">Cancel</button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Type indicator pills */}
            <div className="flex flex-wrap gap-2">
              {paymentOptions.map(opt => (
                <button
                  type="button"
                  key={opt.type}
                  onClick={() => setSelectedAddType(opt.type)}
                  className={`px-4 py-1.5 text-sm rounded-full border transition ${selectedAddType === opt.type 
                    ? 'bg-[#3B82F6] border-[#3B82F6] text-white' 
                    : 'border-white/15 hover:bg-white/5'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Dynamic Fields */}
            {(selectedAddType === 'card') && (
              <>
                <Input 
                  label="CARDHOLDER NAME" 
                  placeholder="Alex Rivera" 
                  value={formData.name} 
                  onChange={(e) => updateForm('name', e.target.value)} 
                  required 
                />
                <Input 
                  label="CARD NUMBER" 
                  placeholder="4242 4242 4242 4242" 
                  value={formData.cardNumber} 
                  onChange={(e) => updateForm('cardNumber', formatCardNumber(e.target.value))} 
                  maxLength={19}
                  required 
                  leftIcon={<CreditCard size={18} />}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="EXPIRY DATE" 
                    placeholder="04 / 28" 
                    value={formData.expiry} 
                    onChange={(e) => updateForm('expiry', e.target.value.replace(/[^\d/]/g, '').slice(0,5))} 
                    maxLength={5}
                    required 
                  />
                  <Input 
                    label="CVV / CVC" 
                    placeholder="123" 
                    value={formData.cvv} 
                    onChange={(e) => updateForm('cvv', e.target.value.replace(/\D/g, '').slice(0,4))} 
                    maxLength={4}
                    required 
                  />
                </div>
              </>
            )}

            {(selectedAddType === 'paypal' || selectedAddType === 'google_pay') && (
              <Input 
                label="EMAIL ADDRESS" 
                type="email" 
                placeholder="you@proton.me" 
                value={formData.email} 
                onChange={(e) => updateForm('email', e.target.value)} 
                required 
              />
            )}

            {selectedAddType === 'apple_pay' && (
              <div className="text-sm p-4 rounded-2xl bg-white/5 border border-white/10 text-secondary">
                Apple Pay will be linked to the cards saved in your Apple Wallet. Tap to confirm on your device.
              </div>
            )}

            {selectedAddType === 'wallet' && (
              <div className="text-sm p-4 rounded-2xl bg-white/5 border border-white/10 text-secondary">
                Aether Wallet is instantly enabled. Funds are drawn from your Aether balance.
              </div>
            )}

            <div className="pt-3 flex gap-3">
              <Button type="button" variant="secondary" fullWidth onClick={closeAddForm}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                fullWidth 
                loading={submitting}
                disabled={selectedAddType === 'card' && (!formData.name || !formData.cardNumber)}
              >
                Add Payment Method
              </Button>
            </div>

            <p className="text-center text-[10px] text-[#475569] tracking-wider pt-1">
              Your payment info is encrypted and never stored on our servers.
            </p>
          </form>
        </GlassCard>
      )}

      <div className="h-6" />
    </div>
  )
}
