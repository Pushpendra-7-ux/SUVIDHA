import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Monitor, ArrowRight, Clock, MapPin, FileText } from 'lucide-react'

const features = [
  { icon: FileText, label: 'Report Issues', desc: 'File civic complaints instantly' },
  { icon: MapPin, label: 'Location Aware', desc: 'GPS-based issue pinpointing' },
  { icon: Clock, label: 'Track Status', desc: 'Real-time complaint tracking' },
]

export default function KioskHome() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/home')
  }

  return (
    <>
      <section
        className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-8"
        aria-label="Welcome to UrbanEye Grievance Portal"
      >
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl"
        >
          {/* Decorative emblem ring */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="mx-auto w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gov-gradient flex items-center justify-center mb-6 shadow-xl shadow-primary-800/30"
          >
            <Monitor className="w-10 h-10 sm:w-14 sm:h-14 text-white" strokeWidth={1.5} aria-hidden="true" />
          </motion.div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold text-primary-800 mb-3 tracking-tight">
            Smart City Grievance Portal
          </h2>

          <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto">
            Report civic issues directly to your municipality. Upload evidence, track progress, and get faster resolutions.
          </p>

          {/* Start Button */}
          <motion.button
            onClick={handleStart}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="touch-target group relative inline-flex items-center gap-3 bg-saffron-gradient text-white font-semibold text-lg sm:text-xl px-10 py-4 sm:px-14 sm:py-5 rounded-2xl shadow-lg shadow-accent-500/30 hover:shadow-xl hover:shadow-accent-500/40 transition-shadow focus-visible:ring-4 focus-visible:ring-accent-300 focus-visible:ring-offset-2"
            aria-label="Touch to start filing a complaint"
          >
            <span>Touch to Start</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" aria-hidden="true" />

            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-2xl animate-pulse-slow border-2 border-accent-400/40" aria-hidden="true" />
          </motion.button>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl w-full"
          role="list"
          aria-label="Portal features"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="glass rounded-xl p-5 text-center"
              role="listitem"
            >
              <div className="mx-auto w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5 text-primary-700" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-primary-800 text-sm">{f.label}</h3>
              <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <p className="mt-10 text-xs text-gray-400 text-center">
          An initiative under Smart Cities Mission, Government of India
        </p>
      </section>
    </>
  )
}
