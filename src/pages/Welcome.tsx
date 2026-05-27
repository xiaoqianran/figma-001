import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(#1F2937_0.8px,transparent_1px)] bg-[length:5px_5px] opacity-40" />
      <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#3B82F6] opacity-[0.035] blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* Logo Mark — Distinctive Shield */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8"
        >
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-[#3B82F6] via-[#22D3EE] to-[#3B82F6] opacity-90" />
            <div className="absolute inset-[3px] rounded-[28px] bg-[var(--bg-base)] flex items-center justify-center">
              <Shield className="w-12 h-12 text-white" strokeWidth={1.75} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <h1 className="font-display text-[52px] leading-[52px] font-semibold tracking-[-2.2px] mb-3">
            AETHER
          </h1>
          <p className="text-xl text-secondary tracking-[-0.3px]">
            Invisible. Unbreakable. Yours.
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-8 text-tertiary text-[15px] leading-relaxed max-w-[280px]"
        >
          Military-grade encryption.<br />Zero logs. Zero compromises.<br />Designed for those who value privacy.
        </motion.p>

        <Button
          onClick={() => navigate('/onboarding')}
          className="mt-12 w-full max-w-[280px] tracking-[-0.2px] group"
          rightIcon={<ArrowRight className="group-hover:translate-x-0.5 transition" size={19} />}
        >
          Get Started
        </Button>

        <button
          onClick={() => navigate('/lets-you-in')}
          className="mt-6 text-sm text-tertiary hover:text-secondary transition"
        >
          Already have an account? <span className="text-[#3B82F6]">Sign in</span>
        </button>
      </div>

      <div className="absolute bottom-8 text-[10px] text-[#475569] tracking-[3px]">EST 2021 • PRIVACY FIRST</div>
    </div>
  )
}
