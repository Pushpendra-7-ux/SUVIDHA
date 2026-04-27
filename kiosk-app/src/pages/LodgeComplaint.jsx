import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, QrCode, AlertCircle, CheckCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const serviceIcons = {
  electricity: '⚡',
  water: '💧',
  gas: '🔥',
  sanitation: '🗑️',
  municipal: '🏛️',
  smartcity: '📱'
}

const serviceColors = {
  electricity: 'from-yellow-400 to-yellow-600',
  water: 'from-blue-400 to-blue-600',
  gas: 'from-orange-400 to-orange-600',
  sanitation: 'from-emerald-400 to-emerald-600',
  municipal: 'from-purple-400 to-purple-600',
  smartcity: 'from-indigo-400 to-indigo-600'
}

export default function LodgeComplaint() {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleStartComplaint = () => {
    // Generate a session ID for this complaint
    const sessionId = `${serviceId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    navigate(`/qr/${sessionId}`)
  }

  return (
    <section className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-8 bg-gradient-to-b from-slate-50 to-slate-100" aria-label="Lodge Complaint">
      {/* Back Button */}
      <div className="w-full max-w-2xl mb-6">
        <motion.button
          onClick={() => navigate(`/service/${serviceId}`)}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 font-bold text-lg text-gray-700 hover:text-assam-blue px-6 py-3 rounded-xl shadow-md bg-white border border-gray-100 transition-colors"
          aria-label="Go back to service menu"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </motion.button>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-8 sm:p-12 max-w-2xl w-full shadow-2xl border-2 border-gray-50"
      >
        {/* Service Header */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br ${serviceColors[serviceId] || 'from-slate-400 to-slate-600'} text-white shadow-lg`}>
            <span className="text-5xl">{serviceIcons[serviceId] || '📋'}</span>
          </div>
        </div>

        <h2 className="text-center font-display text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">
          {t('lodgeComplaint')}
        </h2>
        
        <p className="text-center text-xl text-assam-blue font-semibold mb-2">
          {t(serviceId) || serviceId}
        </p>

        <p className="text-center text-gray-600 text-lg mb-8 leading-relaxed px-4">
          Report your issue or grievance for the {t(serviceId) || serviceId} department. Quickly register your complaint and track its status.
        </p>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex items-start gap-3"
          >
            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">Quick Registration</p>
              <p className="text-sm text-blue-700">Register your complaint in seconds</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 flex items-start gap-3"
          >
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-emerald-900 mb-1">Track Status</p>
              <p className="text-sm text-emerald-700">Monitor your complaint status anytime</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 flex items-start gap-3"
          >
            <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-purple-900 mb-1">Upload Evidence</p>
              <p className="text-sm text-purple-700">Attach photos or documents</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-orange-900 mb-1">Fast Resolution</p>
              <p className="text-sm text-orange-700">Get quicker responses to your issues</p>
            </div>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.button
          onClick={handleStartComplaint}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full group relative overflow-hidden bg-gradient-to-r from-assam-blue to-blue-900 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl flex items-center justify-between focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all"
          aria-label="Start filing complaint"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-blue-200 uppercase tracking-wider mb-1">Get Started</p>
              <h3 className="text-2xl font-bold font-display">{t('startComplaint') || 'Register Complaint'}</h3>
            </div>
          </div>
          <div className="w-12 h-12 bg-white/20 flex items-center justify-center rounded-full group-hover:bg-white/30 transition-colors">
            <span className="text-2xl">›</span>
          </div>
        </motion.button>

        {/* Alternative: Contact Information */}
        <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-3">
            <strong>Need Help?</strong> You can also contact the {t(serviceId) || 'service'} department directly:
          </p>
          <div className="text-center">
            <p className="text-gray-700 font-semibold">Helpline: 1800-XXX-XXXX</p>
            <p className="text-gray-600 text-sm mt-1">Available: Mon-Fri, 9 AM - 6 PM</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
