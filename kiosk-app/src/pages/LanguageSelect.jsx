import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Monitor } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import NewsTicker from '../components/NewsTicker'

export default function LanguageSelect() {
  const navigate = useNavigate()
  const { setLang, t } = useLanguage()

  const handleSelectLanguage = (langCode) => {
    setLang(langCode)
    navigate('/home')
  }

  return (
    <div className="h-[calc(100vh-5.5rem)] bg-slate-50 text-slate-900 flex flex-col relative overflow-hidden">

      {/* ── News Ticker — immediately below the Header ── */}
      <NewsTicker />

      {/* Decorative background overlay */}
      <div className="absolute inset-0 bg-slate-100 bg-opacity-50 pointer-events-none -translate-x-1/2 -skew-x-12 transform-gpu" />

      {/* ── Main content — centred in remaining height ── */}
      <div className="relative z-10 flex-1 flex flex-col sm:flex-row items-center justify-center gap-10 px-8 pb-16 max-w-5xl w-full mx-auto">

        {/* Left Side: Branding and Welcome */}
        <div className="flex-1 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block p-6 bg-white rounded-2xl border border-slate-200 mb-6 shadow-xl"
          >
            <Monitor className="w-14 h-14 text-assam-blue mb-3 mx-auto sm:mx-0" strokeWidth={1.5} />
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-1 text-assam-blue">
              SUVIDHA <span className="text-assam-red">2026</span>
            </h1>
            <p className="text-xl text-slate-600 font-medium tracking-wide">
              Government of Assam
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <h2 className="text-2xl font-bold text-slate-800">
              Welcome / স্বাগতম / स्वागत
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              {t('selectLangContext')}
            </p>
          </motion.div>
        </div>

        {/* Right Side: ATM Style Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full flex flex-col gap-4"
        >
          {/* Assamese */}
          <button
            onClick={() => handleSelectLanguage('as')}
            className="group relative overflow-hidden bg-gradient-to-br from-assam-red to-red-800 text-white p-5 rounded-xl shadow-2xl border border-red-500/30 hover:shadow-[0_0_30px_rgba(211,47,47,0.6)] focus:outline-none focus:ring-4 focus:ring-red-400 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <span className="text-3xl font-bold font-display">অসমীয়া</span>
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">›</span>
              </div>
            </div>
          </button>

          {/* English */}
          <button
            onClick={() => handleSelectLanguage('en')}
            className="group relative overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 text-white p-5 rounded-xl shadow-2xl border border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <span className="text-3xl font-bold font-display tracking-wide">English</span>
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">›</span>
              </div>
            </div>
          </button>

          {/* Hindi */}
          <button
            onClick={() => handleSelectLanguage('hi')}
            className="group relative overflow-hidden bg-gradient-to-br from-teal-700 to-teal-900 text-white p-5 rounded-xl shadow-2xl border border-teal-500/30 hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] focus:outline-none focus:ring-4 focus:ring-teal-400 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <span className="text-3xl font-bold font-display tracking-wide">हिन्दी</span>
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">›</span>
              </div>
            </div>
          </button>

          {/* Choose Another Language */}
          <button
            onClick={() => navigate('/more-languages')}
            className="group relative overflow-hidden bg-white text-slate-900 p-5 rounded-xl shadow-md border-2 border-slate-900 hover:bg-slate-50 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-slate-400 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative flex items-center justify-between">
              <div className="text-left">
                <span className="text-2xl font-bold font-display tracking-wide block">Choose Another Language</span>
                <span className="text-sm text-slate-500 font-medium">अन्य भाषा  •  অন্য ভাষা  •  ಇತರ ಭಾಷೆ</span>
              </div>
              <div className="w-11 h-11 bg-slate-900 rounded-full flex items-center justify-center text-white shrink-0">
                <span className="text-2xl">›</span>
              </div>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Footer Logos — pinned above bottom edge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-8 items-center px-4"
      >
        <img src="/DIGITALINDIA200X100_0.png" alt="Digital India" className="h-9 object-contain mix-blend-multiply" />
        <img src="/ANE.jpg" alt="ANE" className="h-9 object-contain mix-blend-multiply" />
        <img src="/meity.png" alt="MeitY" className="h-9 object-contain mix-blend-multiply" />
      </motion.div>

    </div>
  )
}
