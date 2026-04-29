import { motion } from 'framer-motion'
import { Shield, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  return (
    <header role="banner" className="w-full shadow-md z-50 relative">
      {/* Indian tricolor bar */}
      <div className="bg-tricolor-bar" aria-hidden="true" />

      <div className="bg-white dark:bg-slate-900 text-assam-blue dark:text-white shadow-sm border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left — Emblem + Brand */}
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center bg-white rounded-full p-1"
              >
                <img src="/ANE.jpg" alt="State Emblem" className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full mix-blend-multiply" />
              </motion.div>

              <div>
                <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight">
                  SUVIDHA 2026
                </h1>
                <p className="text-[10px] sm:text-xs text-assam-red font-bold tracking-widest uppercase">
                  Government of Assam
                </p>
              </div>
            </div>

            {/* Right — Government badges & Profile */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-4 border-r border-slate-200 pr-4">
                <img src="/ANE.jpg" alt="ANE" className="h-12 object-contain mix-blend-multiply bg-slate-50 border border-slate-100 rounded px-2 py-1" />
                <img src="/meity.png" alt="MeitY" className="h-12 object-contain mix-blend-multiply bg-slate-50 border border-slate-100 rounded px-2 py-1" />
                <img src="/G20_India_LogoforUSP.png" alt="G20 India" className="h-12 object-contain mix-blend-multiply bg-slate-50 border border-slate-100 rounded px-2 py-1" />
              </div>
              
              {user && (
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 text-assam-blue border border-slate-200 hover:border-assam-blue rounded-full px-4 py-2 transition-colors font-bold focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <div className="w-8 h-8 rounded-full bg-assam-blue text-white flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <span className="hidden sm:inline">Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
