import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, PlusCircle, AlertCircle, IndianRupee, Search, UserCog, Activity, Wrench, Droplets, Receipt } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import AuthenticationModal from '../components/AuthenticationModal'

const ServiceScreen = () => {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [authOpen, setAuthOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  const getServiceData = (t) => ({
    electricity: { 
      title: t('electricity'), icon: '⚡', theme: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-200',
      actions: [
        { id: 'new', label: t('newConnection'), icon: PlusCircle, color: 'text-indigo-600 bg-indigo-100 border-indigo-200', secure: true },
        { id: 'pay', label: t('payBill'), icon: IndianRupee, color: 'text-emerald-600 bg-emerald-100 border-emerald-200', secure: true },
        { id: 'loadExtension', label: t('loadExtension'), icon: Activity, color: 'text-orange-600 bg-orange-100 border-orange-200', secure: true },
        { id: 'meterReplacement', label: t('meterReplacement'), icon: Wrench, color: 'text-slate-600 bg-slate-100 border-slate-200', secure: true },
        { id: 'complaint', label: t('lodgeComplaint'), icon: AlertCircle, color: 'text-rose-600 bg-rose-100 border-rose-200', secure: false },
        { id: 'trackStatus', label: t('trackStatus'), icon: Search, color: 'text-blue-600 bg-blue-100 border-blue-200', secure: false },
        { id: 'credentials', label: t('updateCredentials'), icon: UserCog, color: 'text-teal-600 bg-teal-100 border-teal-200', secure: true }
      ]
    },
    gas: { 
      title: t('gas'), icon: '🔥', theme: 'bg-orange-50 text-orange-600', border: 'border-orange-200',
      actions: [
        { id: 'new', label: t('newConnection'), icon: PlusCircle, color: 'text-indigo-600 bg-indigo-100 border-indigo-200', secure: true },
        { id: 'meterServices', label: t('meterServices'), icon: Wrench, color: 'text-slate-600 bg-slate-100 border-slate-200', secure: true },
        { id: 'complaint', label: t('lodgeComplaint'), icon: AlertCircle, color: 'text-rose-600 bg-rose-100 border-rose-200', secure: false },
        { id: 'pay', label: t('payBill'), icon: IndianRupee, color: 'text-emerald-600 bg-emerald-100 border-emerald-200', secure: true },
        { id: 'trackStatus', label: t('trackStatus'), icon: Search, color: 'text-blue-600 bg-blue-100 border-blue-200', secure: false },
        { id: 'credentials', label: t('updateCredentials'), icon: UserCog, color: 'text-teal-600 bg-teal-100 border-teal-200', secure: true }
      ]
    },
    municipal: { 
      title: t('municipal'), icon: '🏛️', theme: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-200',
      actions: [
        { id: 'propertyTax', label: t('propertyTax'), icon: Receipt, color: 'text-violet-600 bg-violet-100 border-violet-200', secure: true },
        { id: 'waterConnection', label: t('waterConnection') || 'Water Connection', icon: Droplets, color: 'text-blue-600 bg-blue-100 border-blue-200', secure: true },
        { id: 'complaint', label: t('lodgeComplaint'), icon: AlertCircle, color: 'text-rose-600 bg-rose-100 border-rose-200', secure: false },
        { id: 'trackStatus', label: t('trackStatus'), icon: Search, color: 'text-slate-600 bg-slate-100 border-slate-200', secure: false },
        { id: 'credentials', label: t('updateCredentials'), icon: UserCog, color: 'text-emerald-600 bg-emerald-100 border-emerald-200', secure: true }
      ]
    },
    // Default fallback actions for other categories
    default: {
      actions: [
        { id: 'pay', label: t('payBill'), icon: IndianRupee, color: 'text-emerald-600 bg-emerald-100 border-emerald-200', secure: true },
        { id: 'history', label: t('viewHistory'), icon: FileText, color: 'text-blue-600 bg-blue-100 border-blue-200', secure: true },
        { id: 'new', label: t('newConnection'), icon: PlusCircle, color: 'text-indigo-600 bg-indigo-100 border-indigo-200', secure: true },
        { id: 'complaint', label: t('lodgeComplaint'), icon: AlertCircle, color: 'text-rose-600 bg-rose-100 border-rose-200', secure: false }
      ]
    }
  })

  const serviceData = getServiceData(t)
  // Ensure we fall back to generic properties if it's an 'other' category
  const genericService = { 
    title: t(serviceId) || t('serviceNotFound'), 
    icon: '📋', theme: 'bg-slate-50 text-slate-600', border: 'border-slate-200' 
  }
  const service = serviceData[serviceId] || genericService
  const actions = serviceData[serviceId]?.actions || serviceData.default.actions

  if (!serviceData[serviceId] && !['water', 'sanitation', 'smartcity', 'road', 'safety', 'noise', 'parks', 'other'].includes(serviceId)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 min-h-screen">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">{t('serviceNotFound')}</h2>
        <button onClick={() => navigate('/')} className="px-8 py-4 bg-assam-blue text-white rounded-2xl text-xl font-bold hover:bg-blue-800 transition-colors">
          {t('goBack')}
        </button>
      </div>
    )
  }

  const handleAction = (action) => {
    if (action.secure) {
      setPendingAction(action.id)
      setAuthOpen(true)
    } else {
      navigate(`/service/${serviceId}/${action.id}`)
    }
  }

  const handleAuthSuccess = () => {
    setAuthOpen(false)
    if (pendingAction) {
      navigate(`/service/${serviceId}/${pendingAction}`)
    }
  }

  return (
    <div className="min-h-[calc(100vh-5.5rem)] bg-slate-50 flex flex-col items-center p-6 relative overflow-hidden">
      {/* Decorative dots background */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative z-10 w-full max-w-6xl flex justify-between items-end mb-8 mt-4">
        <div>
          <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-assam-blue font-bold text-xl mb-4 opacity-80 hover:opacity-100 transition-opacity">
            <ArrowLeft className="w-6 h-6" /> {t('back')}
          </button>
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${service.theme} ${service.border} border mb-4 text-3xl shadow-sm`}>
            {service.icon}
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-slate-800 tracking-tight">{service.title}</h2>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 flex-1">

        {/* Left Col - Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
          {actions.map((action, idx) => {
            const Icon = action.icon
            return (
              <motion.button
                key={action.id}
                onClick={() => handleAction(action)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="h-28 bg-white rounded-2xl shadow-md border border-gray-100 hover:border-slate-300 flex items-center px-6 justify-between group transition-all focus:outline-none hover:shadow-lg focus:ring-4 focus:ring-slate-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${action.color} shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xl font-bold text-gray-700 group-hover:text-assam-blue text-left leading-tight max-w-[150px]">{action.label}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors shrink-0">
                  <span className="text-2xl text-slate-400 group-hover:text-assam-blue">›</span>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Right Col - Info / Instructions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col border border-gray-100 relative"
        >
          <div className={`h-40 ${service.theme} p-8 flex items-end relative overflow-hidden border-b ${service.border}`}>
            {/* Decorative abstract shape */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-40 rounded-full -translate-y-32 translate-x-16 blur-2xl"></div>
            <h3 className="text-3xl font-bold relative z-10 text-slate-800">
              {t('accessYour')} {service.title}
            </h3>
          </div>

          <div className="p-8 flex-1 flex flex-col justify-center items-center text-center space-y-6">
            <div className={`w-28 h-28 rounded-full ${service.theme} flex items-center justify-center text-6xl shadow-inner border ${service.border}`}>
              {service.icon}
            </div>
            <div>
              <p className="text-2xl text-slate-800 font-medium mb-4">{t('tapActionToProceed')}</p>
              <p className="text-slate-500 text-lg">{t('promptToScan')}</p>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Authentication Modal */}
      <AuthenticationModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        onSuccess={handleAuthSuccess} 
      />
    </div>
  )
}

export default ServiceScreen
