import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, MessageCircle, Mail, Phone, Ticket, 
  CheckCircle, AlertCircle, Send, User, Bot 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard, Button, Input } from '@/components/ui'
import { toast } from 'sonner'

type Ticket = {
  id: string
  subject: string
  category: string
  description: string
  status: 'Open' | 'In Progress' | 'Resolved'
  timestamp: string
}

type ChatMessage = {
  id: string
  from: 'user' | 'support'
  text: string
  time: string
}

type ContactMode = 'chat' | 'email' | null

const supportCategories = [
  'Connection Issues',
  'Account & Login',
  'Billing & Payments',
  'Privacy & Security',
  'App Features',
  'Other'
] as const

const quickCategories = [
  { label: 'Connection Problems', icon: AlertCircle, desc: 'Drops, slow speeds, leaks', filter: 'Connection' },
  { label: 'Account & Billing', icon: Ticket, desc: 'Subscriptions, invoices, refunds', filter: 'Billing' },
  { label: 'Privacy & Security', icon: CheckCircle, desc: 'Logs, kill switch, encryption', filter: 'Privacy' },
  { label: 'App & Devices', icon: User, desc: 'Multiple devices, install help', filter: 'Devices' },
]

export default function Help() {
  const navigate = useNavigate()

  // Ticket form state
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketCategory, setTicketCategory] = useState<typeof supportCategories[number]>('Connection Issues')
  const [ticketDescription, setTicketDescription] = useState('')
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false)

  // My tickets (local simulation)
  const [myTickets, setMyTickets] = useState<Ticket[]>([
    {
      id: 'AET-3891',
      subject: 'Kill switch not blocking traffic on macOS',
      category: 'Connection Issues',
      description: 'After latest update the kill switch seems to allow some DNS leaks when switching networks.',
      status: 'In Progress',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
    }
  ])

  // Chat simulation
  const [contactMode, setContactMode] = useState<ContactMode>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'm1', from: 'support', text: 'Hi! I\'m Aether Support. How can I help you today?', time: 'just now' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isChatReplying, setIsChatReplying] = useState(false)

  // Email simulation
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  // --- Ticket handlers ---
  const submitTicket = async () => {
    if (!ticketSubject.trim() || !ticketDescription.trim()) {
      toast.error('Please fill out subject and description')
      return
    }

    setIsSubmittingTicket(true)

    // Simulate network delay
    await new Promise(r => setTimeout(r, 650))

    const newTicket: Ticket = {
      id: `AET-${Math.floor(4000 + Math.random() * 5500)}`,
      subject: ticketSubject.trim(),
      category: ticketCategory,
      description: ticketDescription.trim(),
      status: 'Open',
      timestamp: new Date().toISOString()
    }

    setMyTickets(prev => [newTicket, ...prev])

    // Reset form
    setTicketSubject('')
    setTicketDescription('')
    setTicketCategory('Connection Issues')

    setIsSubmittingTicket(false)

    toast.success('Ticket submitted successfully', {
      description: `${newTicket.id} • We'll respond within 4 hours`,
    })
  }

  const updateTicketStatus = (ticketId: string, newStatus: Ticket['status']) => {
    setMyTickets(prev =>
      prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t)
    )
    toast.success(`Ticket ${ticketId} marked ${newStatus.toLowerCase()}`)
  }

  // --- Chat simulation ---
  const sendChatMessage = async () => {
    const text = chatInput.trim()
    if (!text) return

    const userMsg: ChatMessage = {
      id: 'u' + Date.now(),
      from: 'user',
      text,
      time: 'now'
    }

    setChatMessages(prev => [...prev, userMsg])
    setChatInput('')
    setIsChatReplying(true)

    // Simulate typing + reply
    await new Promise(r => setTimeout(r, 780 + Math.random() * 600))

    const cannedReplies: Record<string, string> = {
      'speed': 'Thanks for reporting the speed issue. Can you run a speedtest from the app and tell me the numbers + which server you\'re on?',
      'kill': 'The Kill Switch is designed to be failsafe. Try toggling it off/on in Profile settings, or reinstall the latest app version.',
      'connect': 'Most connection failures are fixed by switching protocols in advanced settings or choosing a different city. Would you like me to suggest the best server for your region?',
      'billing': 'For billing questions, the fastest path is usually through the Billing page. I can also escalate your ticket directly.',
      'refund': 'Pro annual subscriptions qualify for full refunds within the first 30 days. I can open a refund request for you right now if you confirm the invoice number.',
      'device': 'Pro gives you 8 simultaneous connections. You can manage active sessions from the Security section in your account.',
    }

    let replyText = 'Thanks for the details. A support specialist will follow up via email shortly with next steps. Is there anything else I can clarify right now?'

    const lower = text.toLowerCase()
    for (const [key, val] of Object.entries(cannedReplies)) {
      if (lower.includes(key)) {
        replyText = val
        break
      }
    }

    const supportMsg: ChatMessage = {
      id: 's' + Date.now(),
      from: 'support',
      text: replyText,
      time: 'now'
    }

    setChatMessages(prev => [...prev, supportMsg])
    setIsChatReplying(false)
  }

  const openChat = () => {
    setContactMode('chat')
    // Reset chat if needed
    if (chatMessages.length === 0) {
      setChatMessages([{ id: 'm1', from: 'support', text: 'Hi! I\'m Aether Support. How can I help you today?', time: 'just now' }])
    }
  }

  const closeContact = () => {
    setContactMode(null)
  }

  // --- Email simulation ---
  const sendEmail = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast.error('Subject and message are required')
      return
    }
    setIsSendingEmail(true)
    await new Promise(r => setTimeout(r, 520))

    toast.success('Email sent to support@aether.vpn', {
      description: 'We typically reply within 2–4 hours during business days.',
    })

    setEmailSubject('')
    setEmailBody('')
    setIsSendingEmail(false)
    setContactMode(null)
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' • ' + 
           d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-2xl glass active:scale-95 transition"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-[28px] tracking-[-1px] font-semibold">Help &amp; Support</h1>
          <p className="text-tertiary text-sm">We’re here to help. 24/7 for Pro members.</p>
        </div>
      </div>

      {/* Quick Category Shortcuts — link to FAQ */}
      <div className="mb-8">
        <div className="uppercase tracking-[2px] text-xs text-tertiary mb-3 px-1">BROWSE BY TOPIC</div>
        <div className="grid grid-cols-2 gap-3">
          {quickCategories.map((cat, idx) => (
            <GlassCard
              key={idx}
              interactive
              onClick={() => navigate(`/app/faq?cat=${cat.filter}`)} // Even if not parsed, user sees FAQ filtered
              className="p-4 cursor-pointer active:scale-[0.985]"
              aria-label={`Browse ${cat.label} topics in FAQ`}
            >
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-2xl bg-subtle flex items-center justify-center text-[#3B82F6] flex-shrink-0">
                  <cat.icon size={18} />
                </div>
                <div className="min-w-0">
                  <div className="font-medium tracking-tight text-sm">{cat.label}</div>
                  <div className="text-[11px] text-tertiary leading-snug mt-0.5 line-clamp-2">{cat.desc}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
        <button 
          onClick={() => navigate('/app/faq')}
          className="text-xs text-[#3B82F6] mt-3 ml-1 font-medium flex items-center gap-1"
        >
          View full FAQ → 
        </button>
      </div>

      {/* Contact Options */}
      <div className="mb-8">
        <div className="uppercase tracking-[2px] text-xs text-tertiary mb-3 px-1">CONTACT US</div>
        
        <div className="grid grid-cols-1 gap-3">
          {/* Live Chat */}
          <GlassCard 
            interactive 
            className={`p-4 flex items-center gap-4 ${contactMode === 'chat' ? 'ring-1 ring-[#3B82F6]/60' : ''}`}
            onClick={openChat}
            aria-label="Start live chat with support"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <MessageCircle size={22} />
            </div>
            <div className="flex-1">
              <div className="font-semibold tracking-tight">Live Chat</div>
              <div className="text-xs text-secondary">Average reply time &lt; 90 seconds • Pro priority</div>
            </div>
            <Button size="sm" variant="secondary">Start chat</Button>
          </GlassCard>

          {/* Email */}
          <GlassCard 
            interactive 
            className={`p-4 flex items-center gap-4 ${contactMode === 'email' ? 'ring-1 ring-[#3B82F6]/60' : ''}`}
            onClick={() => setContactMode('email')}
            aria-label="Compose email to support"
          >
            <div className="w-11 h-11 rounded-2xl bg-subtle flex items-center justify-center text-[#3B82F6]">
              <Mail size={22} />
            </div>
            <div className="flex-1">
              <div className="font-semibold tracking-tight">Email Support</div>
              <div className="text-xs text-secondary">support@aether.vpn • replies in 2–4 hrs</div>
            </div>
            <Button size="sm" variant="ghost">Compose</Button>
          </GlassCard>

          {/* Phone (simulated) */}
          <GlassCard interactive className="p-4 flex items-center gap-4" onClick={() => {
            toast('Calling support', { description: '+1 (888) 555-AETHER • US & Canada only' })
          }} aria-label="Request phone callback from support">
            <div className="w-11 h-11 rounded-2xl bg-subtle flex items-center justify-center text-[#3B82F6]">
              <Phone size={22} />
            </div>
            <div className="flex-1">
              <div className="font-semibold tracking-tight">Phone Callback</div>
              <div className="text-xs text-secondary">Pro members only • Mon–Fri 9am–10pm ET</div>
            </div>
            <Button size="sm" variant="ghost">Request call</Button>
          </GlassCard>
        </div>
      </div>

      {/* Inline Contact Panels */}
      <AnimatePresence>
        {contactMode === 'chat' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mb-8"
          >
            <GlassCard padding="lg" className="border border-emerald-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageCircle size={18} className="text-emerald-400" />
                  <span className="font-semibold">Live Chat with Support</span>
                </div>
                <button onClick={closeContact} className="text-xs text-tertiary">Close</button>
              </div>

              {/* Chat history */}
              <div className="bg-[#0A0E14] rounded-2xl p-4 mb-4 h-[220px] overflow-y-auto space-y-3 text-sm custom-scroll">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : ''}`}>
                    <div className={`max-w-[82%] rounded-2xl px-3.5 py-2 ${msg.from === 'user' 
                      ? 'bg-[#3B82F6] text-white' 
                      : 'bg-white/10 text-[#E2E8F0]'}`}>
                      <div className="flex items-center gap-2 text-[10px] opacity-70 mb-0.5">
                        {msg.from === 'support' ? <Bot size={12} /> : <User size={12} />}
                        {msg.from === 'support' ? 'Support' : 'You'} • {msg.time}
                      </div>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isChatReplying && (
                  <div className="flex gap-2 text-tertiary text-xs pl-1">
                    <Bot size={14} /> Support is typing...
                  </div>
                )}
              </div>

              {/* Chat input */}
              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendChatMessage() }}
                  placeholder="Type your message..."
                  className="input flex-1 py-2.5 text-sm"
                />
                <Button 
                  onClick={sendChatMessage} 
                  disabled={!chatInput.trim() || isChatReplying}
                  size="md"
                >
                  <Send size={16} />
                </Button>
              </div>
              <p className="text-[10px] text-tertiary mt-2 text-center">Simulated chat • Real support responds via email</p>
            </GlassCard>
          </motion.div>
        )}

        {contactMode === 'email' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-8"
          >
            <GlassCard padding="lg">
              <div className="flex justify-between items-center mb-4">
                <div className="font-semibold flex items-center gap-2">
                  <Mail size={18} /> Email Support
                </div>
                <button onClick={closeContact} className="text-xs text-tertiary">Cancel</button>
              </div>

              <div className="space-y-4">
                <Input
                  label="SUBJECT"
                  placeholder="Issue with connection on iOS 18"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />

                <div>
                  <div className="text-xs tracking-widest text-tertiary mb-2 pl-1">MESSAGE</div>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Please describe the issue in detail. Include your device model, app version, and server location if relevant."
                    rows={5}
                    className="input w-full resize-y min-h-[110px] py-3 px-4 text-sm leading-relaxed"
                  />
                </div>

                <Button 
                  fullWidth 
                  onClick={sendEmail} 
                  loading={isSendingEmail}
                  leftIcon={<Send size={16} />}
                >
                  Send Message to Support
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit a Ticket */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Ticket size={16} className="text-tertiary" />
          <div className="uppercase tracking-[2px] text-xs text-tertiary">SUBMIT A SUPPORT TICKET</div>
        </div>

        <GlassCard padding="lg">
          <div className="space-y-4">
            <Input
              label="SUBJECT"
              placeholder="Brief summary of your issue"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
            />

            {/* Category pills */}
            <div>
              <div className="text-xs tracking-widest text-tertiary mb-2 pl-1">CATEGORY</div>
              <div className="flex flex-wrap gap-2">
                {supportCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTicketCategory(cat)}
                    className={`px-3 py-1 text-xs rounded-full border transition ${ticketCategory === cat 
                      ? 'bg-[#3B82F6] border-[#3B82F6] text-white' 
                      : 'border-white/15 text-secondary hover:bg-subtle'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs tracking-widest text-tertiary mb-2 pl-1">DESCRIPTION</div>
              <textarea
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="Tell us exactly what’s happening, when it started, and any error messages or steps you’ve already tried."
                rows={4}
                className="input w-full resize-y min-h-[98px] py-3 px-4 text-sm"
              />
            </div>

            <Button 
              fullWidth 
              onClick={submitTicket} 
              loading={isSubmittingTicket}
              leftIcon={<Ticket size={17} />}
            >
              Submit Ticket
            </Button>
            <p className="text-center text-[10px] text-tertiary">You’ll receive a confirmation email with your ticket number.</p>
          </div>
        </GlassCard>
      </div>

      {/* My Tickets */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="uppercase tracking-[2px] text-xs text-tertiary">YOUR RECENT TICKETS</div>
          <span className="text-xs text-tertiary">{myTickets.length} total</span>
        </div>

        {myTickets.length === 0 ? (
          <GlassCard className="text-center py-8 text-tertiary">
            No tickets yet. Submit one above — we’re fast.
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {myTickets.map((ticket) => (
              <GlassCard key={ticket.id} padding="md" className="text-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#3B82F6] font-medium">{ticket.id}</span>
                      <span className={`text-[10px] px-2 py-px rounded font-medium tracking-wider uppercase ${
                        ticket.status === 'Resolved' ? 'bg-emerald-500/15 text-emerald-400' :
                        ticket.status === 'In Progress' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-blue-500/15 text-blue-400'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="font-medium tracking-tight mt-1 pr-1">{ticket.subject}</div>
                    <div className="text-xs text-tertiary mt-0.5">{ticket.category} • {formatTime(ticket.timestamp)}</div>
                  </div>
                </div>

                <div className="mt-3 text-secondary text-xs leading-relaxed line-clamp-2 border-t border-[var(--border)] pt-3">
                  {ticket.description}
                </div>

                <div className="flex gap-2 mt-4">
                  {ticket.status !== 'Resolved' && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => updateTicketStatus(ticket.id, 'Resolved')}
                    >
                      Mark Resolved
                    </Button>
                  )}
                  {ticket.status === 'Open' && (
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => updateTicketStatus(ticket.id, 'In Progress')}
                    >
                      Escalate
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => navigate('/app/faq')}
                  >
                    Related FAQ
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-[10px] text-tertiary tracking-widest">
        AETHER SUPPORT • PRIVACY-FIRST • RESPONSE TIME &lt; 4HRS
      </div>
    </div>
  )
}
