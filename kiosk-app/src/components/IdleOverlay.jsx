import { motion } from 'framer-motion'
import { Monitor, Hand } from 'lucide-react'

export default function IdleOverlay({ onDismiss, countdown, isLoggedIn }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDismiss}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onDismiss() }}
      role="dialog"
      aria-modal="true"
      aria-label="Screen is idle. Touch anywhere to continue."
      tabIndex={0}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary-800/95 backdrop-blur-sm cursor-pointer"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="mb-6"
      >
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
          <Monitor className="w-10 h-10 text-white/80" aria-hidden="true" />
        </div>
      </motion.div>

      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-white text-xl sm:text-2xl font-display font-semibold"
      >
        {isLoggedIn ? `Auto-logout in ${countdown}s` : `Returning to start in ${countdown}s`}
      </motion.p>
      
      <p className="mt-2 text-white/80 font-medium">
        Touch anywhere to continue
      </p>

      <p className="mt-3 text-white/40 text-sm">
        UrbanEye — Smart City Grievance Portal
      </p>
    </motion.div>
  )
}
