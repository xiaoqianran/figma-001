import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Shield, Zap, Globe } from 'lucide-react'
import { Button } from '@/components/ui'

const slides = [
  {
    icon: Shield,
    title: 'True Zero-Knowledge',
    desc: 'We cannot see your traffic. Ever. Our architecture makes it mathematically impossible for us to log what you do.',
    accent: 'from-[#3B82F6] to-[#22D3EE]',
  },
  {
    icon: Zap,
    title: 'Blazing, Stable Speed',
    desc: 'Our global backbone is engineered for consistent performance. No throttling. No surprises. Just speed.',
    accent: 'from-[#22D3EE] to-[#3B82F6]',
  },
  {
    icon: Globe,
    title: 'The World, Unlocked',
    desc: 'Choose from 94 locations across 6 continents. Access what matters to you — wherever you are.',
    accent: 'from-[#3B82F6] via-[#22D3EE] to-[#3B82F6]',
  },
]

export default function Onboarding() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const slide = slides[index]

  const next = () => {
    if (index < slides.length - 1) {
      setIndex(index + 1)
    } else {
      navigate('/lets-you-in')
    }
  }

  const prev = () => index > 0 && setIndex(index - 1)

  return (
    <div className="min-h-screen flex flex-col px-6 pt-12 pb-8 relative">
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="ghost"
          size="md"
          onClick={prev}
          className={`px-4 ${index === 0 ? 'invisible' : ''}`}
        >
          <ArrowLeft size={18} className="mr-1" /> Back
        </Button>
        <button onClick={() => navigate('/lets-you-in')} className="text-sm text-tertiary hover:text-white">
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-sm"
          >
            <div className={`mx-auto mb-9 w-20 h-20 rounded-3xl bg-gradient-to-br ${slide.accent} flex items-center justify-center`}>
              <slide.icon className="w-10 h-10 text-white" strokeWidth={1.8} />
            </div>

            <h2 className="font-display text-[34px] leading-[38px] tracking-[-1.2px] font-semibold mb-5">
              {slide.title}
            </h2>
            <p className="text-secondary text-[15px] leading-relaxed">
              {slide.desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress + CTA */}
      <div className="mt-auto">
        <div className="flex gap-2 justify-center mb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}
            />
          ))}
        </div>

        <Button
          onClick={next}
          className="w-full text-[15px] tracking-[-0.2px] group"
          rightIcon={<ArrowRight className="group-hover:translate-x-0.5 transition" />}
        >
          {index === slides.length - 1 ? 'Create your account' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}
