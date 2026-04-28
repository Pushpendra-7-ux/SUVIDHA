import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Zap, Building2, Droplets } from 'lucide-react'

const headlines = [
  { icon: Zap,       color: 'text-yellow-400', text: '⚡ Electricity Dept: Free Smart Meter upgrades for all Sector 4 residents. Book via Meter Services.' },
  { icon: Building2, color: 'text-teal-400',   text: '🏛️ Smart City Initiative: 24/7 Water Pipeline Phase-2 installation begins 15th Oct in Beltola.' },
  { icon: Droplets,  color: 'text-blue-400',   text: '🚧 Road Dept: Flyover construction on NH-37 will cause traffic diversion from Mon–Fri 9AM–6PM.' },
  { icon: Zap,       color: 'text-yellow-400', text: '🌳 Green City Drive: Central Park renovation Phase 1 tender approved. Work starts next week.' },
  { icon: Building2, color: 'text-teal-400',   text: '📱 Now Available: Lodge civic complaints directly from your mobile by scanning QR at this kiosk.' },
]

const SEPARATOR = '    ●    '

export default function NewsTicker({ variant = 'default' }) {
  // Build the single string to scroll
  const tickerText = headlines.map(h => h.text).join(SEPARATOR) + SEPARATOR

  const isDark = variant === 'dark'

  return (
    <div
      className={`w-full shrink-0 flex items-center h-11 overflow-hidden relative z-30
        ${isDark
          ? 'bg-gradient-to-r from-[#001633] via-[#002147] to-[#001633] border-t border-blue-900'
          : 'bg-gradient-to-r from-[#0C2340] via-[#1E3A5F] to-[#0C2340] border-t-2 border-yellow-500/50'
        }`}
    >
      {/* Glowing left badge */}
      <div className="relative z-20 h-full flex items-center gap-2 pl-5 pr-6 bg-yellow-500 shrink-0 shadow-[4px_0_16px_rgba(234,179,8,0.3)]">
        <Megaphone className="w-4 h-4 text-[#0C2340]" />
        <span className="text-[#0C2340] font-black text-xs uppercase tracking-widest whitespace-nowrap">
          Govt. Updates
        </span>
      </div>

      {/* Fade overlay left */}
      <div className="absolute left-[136px] top-0 bottom-0 w-10 z-10 bg-gradient-to-r from-[#0C2340] to-transparent pointer-events-none" />

      {/* Scrolling text track */}
      <div className="flex-1 overflow-hidden flex items-center h-full">
        <motion.div
          className="flex whitespace-nowrap items-center gap-0 text-blue-100 text-sm font-medium tracking-wide"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 38,
          }}
        >
          {/* Doubled content for seamless loop */}
          {[...headlines, ...headlines].map((item, i) => (
            <span key={i} className="flex items-center gap-2 shrink-0">
              <span className={`${item.color} font-bold opacity-90`}>◆</span>
              <span className="text-blue-50 font-medium">{item.text}</span>
              <span className="text-blue-600 mx-4 text-lg">|</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Fade overlay right */}
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-[#0C2340] to-transparent pointer-events-none" />
    </div>
  )
}
