import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, ChevronDown, HelpCircle, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard, Button, Input } from '@/components/ui'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    id: 'q1',
    question: 'Does Aether keep logs of my browsing activity or IP addresses?',
    answer: 'No. Aether operates on a strict no-logs policy. We never store browsing history, DNS queries, timestamps of connections, or any traffic data. Our zero-knowledge architecture means even if compelled by authorities, there is nothing to hand over beyond what you voluntarily provided at signup (email for billing only).',
    category: 'Privacy'
  },
  {
    id: 'q2',
    question: 'What is Aether\'s zero-knowledge architecture?',
    answer: 'Zero-knowledge means the servers that route your traffic cannot decrypt or inspect your data. We use WireGuard with ChaCha20-Poly1305 and AES-256-GCM. Session keys are ephemeral and discarded on disconnect. Your real IP is never exposed to destination sites while the VPN tunnel is active.',
    category: 'Privacy'
  },
  {
    id: 'q3',
    question: 'How does the Kill Switch protect me if the VPN drops?',
    answer: 'The Kill Switch monitors the VPN tunnel 24/7. If the connection is interrupted for any reason (Wi-Fi switch, server reboot, etc.), it instantly blocks all non-VPN network traffic. You stay protected until the tunnel is re-established. It works at the system level and cannot be bypassed by apps.',
    category: 'Security'
  },
  {
    id: 'q4',
    question: 'What encryption and protocols does Aether use?',
    answer: 'We exclusively use the modern WireGuard protocol with post-quantum safe key exchange options in Pro. All traffic is encrypted with authenticated encryption (AEAD). We never fall back to legacy OpenVPN or IKEv2 unless you explicitly enable them in advanced settings for compatibility.',
    category: 'Security'
  },
  {
    id: 'q5',
    question: 'Why does my internet speed decrease when connected to the VPN?',
    answer: 'VPN encryption and routing through distant servers adds overhead (typically 5-25%). Choose a nearby server with low load for best speeds. Our Pro network uses 10 Gbps+ uplinks and optimized routing. Speedtest in-app shows real-world performance before and during sessions.',
    category: 'Connection'
  },
  {
    id: 'q6',
    question: 'What happens if my VPN connection suddenly drops?',
    answer: 'Thanks to the always-on Kill Switch, your traffic is blocked until reconnection. The app will automatically attempt to reconnect using the last server or best available. You will see a clear banner. All activity during the brief window is firewalled — no leaks occur.',
    category: 'Connection'
  },
  {
    id: 'q7',
    question: 'How do I cancel my subscription or request a refund?',
    answer: 'Go to Profile → Premium & Plans or Billing & Invoices. You can cancel anytime and retain access until the end of the paid period. Refunds are granted within 30 days of first purchase for annual plans (contact support for exceptions). We never prorate or surprise-charge.',
    category: 'Billing'
  },
  {
    id: 'q8',
    question: 'Can I use Aether on all my devices at once?',
    answer: 'Free accounts are limited to 1 device. Aether Pro allows up to 8 simultaneous connections. You can install on phones, tablets, laptops, routers, and smart TVs. Each device counts as one connection regardless of platform.',
    category: 'Devices'
  },
  {
    id: 'q9',
    question: 'Is using a VPN legal?',
    answer: 'Yes, VPNs are completely legal in the vast majority of countries including the US, EU, UK, Canada, Australia, and Japan. A small number of countries restrict or ban them. Always check local laws. Aether does not assist with any illegal activity.',
    category: 'General'
  },
  {
    id: 'q10',
    question: 'Does Aether work with Netflix, Disney+, and other streaming services?',
    answer: 'Yes. Our optimized streaming servers are specially configured to bypass geo-blocks. Performance varies by title and region; if a server stops working we rotate it within hours. Use the in-app "Streaming optimized" filter in Locations.',
    category: 'Connection'
  },
  {
    id: 'q11',
    question: 'How can I request deletion of all my account data?',
    answer: 'Visit Profile → Privacy & Data. Use the "Delete Account" flow. This permanently purges your profile, preferences, payment metadata, and logs within 30 days (legal hold exceptions may apply for fraud/abuse cases). You will receive a final confirmation email.',
    category: 'Privacy'
  },
  {
    id: 'q12',
    question: 'What kind of customer support do you offer?',
    answer: 'All users receive email support with responses typically within 4 hours (business days). Pro subscribers get priority 24/7 live chat and phone callback options. We also maintain this extensive FAQ and an active community forum at community.aether.vpn.',
    category: 'General'
  }
]

const categories = ['All', 'Privacy', 'Security', 'Connection', 'Billing', 'Devices', 'General'] as const

type Category = typeof categories[number]

export default function FAQ() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [openIds, setOpenIds] = useState<string[]>([])

  const filteredFAQs = useMemo(() => {
    const q = search.toLowerCase().trim()
    
    return faqData.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory
      const matchesSearch = !q || 
        item.question.toLowerCase().includes(q) || 
        item.answer.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [search, activeCategory])

  const toggleFAQ = (id: string) => {
    setOpenIds(prev => 
      prev.includes(id) 
        ? prev.filter(openId => openId !== id)
        : [...prev, id]
    )
  }

  const clearFilters = () => {
    setSearch('')
    setActiveCategory('All')
    setOpenIds([])
  }

  const openAll = () => {
    setOpenIds(filteredFAQs.map(f => f.id))
  }

  const closeAll = () => {
    setOpenIds([])
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
          <h1 className="font-display text-[28px] tracking-[-1px] font-semibold">FAQ</h1>
          <p className="text-tertiary text-sm">Answers to common questions about privacy &amp; VPN</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <Input
          placeholder="Search questions or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={18} />}
          containerClassName="mb-1"
        />
      </div>

      {/* Category Filters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="uppercase tracking-[2px] text-xs text-tertiary">CATEGORIES</div>
          {filteredFAQs.length > 0 && (
            <div className="flex gap-2 text-xs">
              <button onClick={openAll} className="text-[#3B82F6] active:opacity-70">Expand all</button>
              <span className="text-tertiary">•</span>
              <button onClick={closeAll} className="text-[#3B82F6] active:opacity-70">Collapse all</button>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`tab ${activeCategory === cat ? 'tab-active' : 'bg-white/5 text-[#94A3B8]'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count + clear */}
      <div className="flex items-center justify-between mb-4 px-1 text-sm">
        <div className="text-[#94A3B8]">
          {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'}
          {search && <span> for “{search}”</span>}
        </div>
        {(search || activeCategory !== 'All') && (
          <button 
            onClick={clearFilters}
            className="text-[#3B82F6] text-sm font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* FAQ List */}
      <div className="space-y-3 pb-4">
        {filteredFAQs.length === 0 ? (
          <GlassCard className="text-center py-12" padding="lg">
            <HelpCircle className="mx-auto mb-4 text-tertiary" size={42} />
            <div className="font-semibold text-lg tracking-tight mb-2">No matches found</div>
            <p className="text-[#94A3B8] max-w-[260px] mx-auto">
              Try different keywords or browse all categories. Still stuck?
            </p>
            <Button 
              variant="secondary" 
              className="mt-6" 
              onClick={() => navigate('/app/help')}
            >
              Contact Support
            </Button>
          </GlassCard>
        ) : (
          filteredFAQs.map((item) => {
            const isOpen = openIds.includes(item.id)
            return (
              <GlassCard 
                key={item.id} 
                className="overflow-hidden" 
                padding="none"
                interactive
              >
                <button
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left active:bg-white/5 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex-1 pr-2">
                    <div className="font-medium tracking-[-0.1px] leading-snug">
                      {item.question}
                    </div>
                    <div className="text-[10px] uppercase tracking-[1.5px] text-[#3B82F6] mt-1.5 font-medium">
                      {item.category}
                    </div>
                  </div>
                  <div className={`mt-1 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} className="text-tertiary" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-sm text-[#CBD5E1] leading-relaxed border-t border-white/10">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            )
          })
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8">
        <GlassCard className="text-center" padding="lg">
          <div className="flex justify-center mb-3">
            <div className="w-11 h-11 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center">
              <MessageCircle className="text-[#3B82F6]" size={22} />
            </div>
          </div>
          <div className="font-semibold tracking-tight mb-1">Can’t find what you’re looking for?</div>
          <p className="text-sm text-[#94A3B8] mb-5">Our support team is here 24/7 for Pro members.</p>
          <Button 
            fullWidth 
            variant="primary"
            onClick={() => navigate('/app/help')}
          >
            Go to Help &amp; Support
          </Button>
        </GlassCard>
      </div>
    </div>
  )
}
