import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Flame, Building2, LayoutGrid, QrCode } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'


const deptServices = [
  { id: 'electricity', icon: Zap, color: 'from-yellow-400 to-amber-600', path: '/service/electricity', accent: 'border-yellow-400' },
  { id: 'gas', icon: Flame, color: 'from-orange-400 to-red-500', path: '/service/gas', accent: 'border-orange-400' },
  { id: 'municipal', icon: Building2, color: 'from-violet-500 to-indigo-600', path: '/service/municipal', accent: 'border-violet-400' },
]

export default function MainMenu() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <>
      <section className="flex-1 flex flex-col h-[calc(100vh-5.5rem)] bg-surface overflow-hidden" aria-label="Main Menu">

        {/* Title */}
        <div className="text-center pt-5 pb-4 shrink-0">
          <h2 className="text-3xl font-display font-bold text-assam-blue">{t('selectService')}</h2>
          <p className="text-lg text-gray-500 mt-1">{t('howCanWeHelp')}</p>
        </div>

        {/* Main content area — fills available space */}
        <div className="flex-1 flex flex-col justify-center px-6 pb-4 max-w-6xl w-full mx-auto overflow-hidden">

          {/* 3 Primary Department Cards */}
          <div className="grid grid-cols-3 gap-5 mb-5">
            {deptServices.map((service, idx) => (
              <motion.button
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(service.path)}
                className={`group relative flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-2xl transition-all focus:outline-none focus:ring-4 focus:ring-assam-blue py-8 ${service.accent} hover:border-opacity-100 border-opacity-0`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${service.color} text-white shadow-md group-hover:scale-110 transition-transform mb-4`}>
                  <service.icon className="w-8 h-8" />
                </div>
                <span className="text-xl font-bold text-gray-800 group-hover:text-assam-blue transition-colors text-center leading-tight px-2">
                  {t(service.id)}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Bottom Row: Other Dept + Register Complaint QR */}
          <div className="grid grid-cols-2 gap-5">

            {/* Other Department */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => navigate('/categories')}
              className="group relative h-24 flex items-center bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-teal-400 transition-all focus:outline-none focus:ring-4 focus:ring-teal-400"
            >
              {/* Color Stripe on left */}
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-b from-teal-400 to-teal-600" />

              <div className="pl-7 pr-5 flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-md group-hover:scale-110 transition-transform">
                    <LayoutGrid className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <span className="text-xl font-bold text-gray-800 group-hover:text-teal-700 transition-colors leading-tight block">
                      {t('otherDept')}
                    </span>
                    <span className="text-sm text-gray-400 font-medium">{t('otherDeptDesc')}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:border-teal-500 group-hover:bg-teal-50 transition-colors shrink-0">
                  <span className="text-2xl text-gray-400 group-hover:text-teal-600">›</span>
                </div>
              </div>
            </motion.button>

            {/* Register Complaint via QR */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => {
                const sessionId = `general-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
                navigate(`/qr/${sessionId}`)
              }}
              className="group relative h-24 flex items-center overflow-hidden bg-gradient-to-r from-assam-blue to-blue-900 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-400"
            >
              <div className="px-6 flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-blue-200 uppercase tracking-wider mb-0.5">{t('fastTrack')}</p>
                    <h3 className="text-xl font-bold font-display">{t('registerComplaint')}</h3>
                  </div>
                </div>
                <div className="w-10 h-10 bg-white text-assam-blue flex items-center justify-center rounded-full shadow-md group-hover:bg-blue-50 transition-colors shrink-0">
                  <span className="text-2xl mb-0.5">›</span>
                </div>
              </div>
            </motion.button>

          </div>
        </div>


      </section>
    </>
  )
}
