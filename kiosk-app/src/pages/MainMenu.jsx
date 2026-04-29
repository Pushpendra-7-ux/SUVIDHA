import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Flame, Building2, LayoutGrid, QrCode,
  AlertCircle, X, Droplets, Home, Wifi, ChevronRight,
  Receipt,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import NewsTicker from '../components/NewsTicker'

/* ── Static data ─────────────────────────────────────────── */

const deptServices = [
  {
    id: 'electricity',
    icon: Zap,
    color: 'from-yellow-400 to-amber-500',
    glow: 'hover:shadow-amber-200',
    path: '/service/electricity',
    accentBorder: 'hover:border-amber-400',
  },
  {
    id: 'gas',
    icon: Flame,
    color: 'from-orange-400 to-red-500',
    glow: 'hover:shadow-red-200',
    path: '/service/gas',
    accentBorder: 'hover:border-orange-400',
  },
  {
    id: 'municipal',
    icon: Building2,
    color: 'from-violet-500 to-indigo-600',
    glow: 'hover:shadow-indigo-200',
    path: '/service/municipal',
    accentBorder: 'hover:border-violet-400',
  },
]

const pendingBills = [
  {
    id: 'elec-bill',
    label: 'Electricity Bill',
    sub: 'APDCL · Consumer #4821093',
    amount: '₹1,248',
    due: '05 May 2026',
    overdue: false,
    icon: Zap,
    iconBg: 'from-yellow-400 to-amber-500',
    path: '/service/electricity',
  },
  {
    id: 'gas-bill',
    label: 'Gas Bill',
    sub: 'Indane LPG · ID #G-00291',
    amount: '₹879',
    due: '02 May 2026',
    overdue: true,
    icon: Flame,
    iconBg: 'from-orange-400 to-red-500',
    path: '/service/gas',
  }
]

const overdueCount = pendingBills.filter(b => b.overdue).length
const totalDue = '₹' + pendingBills
  .reduce((s, b) => s + Number(b.amount.replace(/[₹,]/g, '')), 0)
  .toLocaleString('en-IN')

/* ── Pending Bills Modal ─────────────────────────────────── */

function PendingBillsModal({ onClose, navigate }) {
  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        key="sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl"
        style={{ maxHeight: '72vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-2 pb-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight">Pending Bills</h3>
              <p className="text-xs text-gray-400">
                {pendingBills.length} bills &middot; Total due: <span className="font-semibold text-gray-700">{totalDue}</span>
              </p>
            </div>
            {overdueCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-bold ml-1">
                {overdueCount} Overdue
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Bill list */}
        <div className="overflow-y-auto px-6 py-4 flex flex-col gap-3" style={{ maxHeight: 'calc(72vh - 110px)' }}>
          {pendingBills.map((bill, idx) => (
            <motion.div
              key={bill.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border ${
                bill.overdue
                  ? 'border-red-200 dark:border-red-900/50 bg-red-50/60 dark:bg-red-900/20'
                  : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700'
              } transition-colors`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${bill.iconBg} text-white shadow-sm shrink-0`}>
                <bill.icon className="w-6 h-6" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-gray-800 dark:text-white text-sm truncate">{bill.label}</p>
                  {bill.overdue && (
                    <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                      OVERDUE
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">{bill.sub}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Due: <span className={`font-semibold ${bill.overdue ? 'text-red-500' : 'text-gray-600'}`}>{bill.due}</span>
                </p>
              </div>

              {/* Amount + Pay */}
              <div className="shrink-0 text-right flex flex-col items-end gap-2">
                <span className="text-xl font-extrabold text-gray-900 dark:text-white">{bill.amount}</span>
                <button
                  onClick={() => { onClose(); navigate(bill.path) }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    bill.overdue
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-assam-blue hover:bg-blue-800 text-white'
                  }`}
                >
                  Pay Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ── Main Component ──────────────────────────────────────── */

export default function MainMenu() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [billsOpen, setBillsOpen] = useState(false)

  return (
    <section className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 relative overflow-hidden" aria-label="Main Menu">

      {/* News Ticker */}
      <NewsTicker />

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col justify-center px-8 py-4 max-w-6xl w-full mx-auto gap-5">

        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-display font-extrabold text-assam-blue dark:text-blue-400">{t('selectService')}</h2>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-0.5">{t('howCanWeHelp')}</p>
        </motion.div>

        {/* 3 Primary Department Cards */}
        <div className="grid grid-cols-3 gap-5">
          {deptServices.map((svc, idx) => (
            <motion.button
              key={svc.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => navigate(svc.path)}
              className={`group flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-slate-700 ${svc.accentBorder} py-8 gap-4 hover:shadow-xl ${svc.glow} transition-all focus:outline-none focus:ring-4 focus:ring-assam-blue`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${svc.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                <svc.icon className="w-8 h-8" />
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-assam-blue dark:group-hover:text-blue-400 transition-colors text-center leading-tight px-2">
                {t(svc.id)}
              </span>
            </motion.button>
          ))}
        </div>

        {/* 3 Action Tiles */}
        <div className="grid grid-cols-3 gap-5">

          {/* Pending Bills */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setBillsOpen(true)}
            className="group relative flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-500 hover:shadow-lg transition-all p-5 focus:outline-none focus:ring-4 focus:ring-red-400 overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-gradient-to-b from-red-400 to-red-600" />
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-50 shrink-0 group-hover:scale-110 transition-transform ml-2">
              <Receipt className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-base font-bold text-gray-800 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-tight">
                Pending Bills
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{pendingBills.length} bills · {totalDue} due</p>
            </div>
            {overdueCount > 0 && (
              <span className="shrink-0 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                {overdueCount}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-400 transition-colors shrink-0" />
          </motion.button>

          {/* Other Departments */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            onClick={() => navigate('/categories')}
            className="group relative flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg transition-all p-5 focus:outline-none focus:ring-4 focus:ring-teal-400 overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-gradient-to-b from-teal-400 to-teal-600" />
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-50 shrink-0 group-hover:scale-110 transition-transform ml-2">
              <LayoutGrid className="w-6 h-6 text-teal-600" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-base font-bold text-gray-800 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors leading-tight">
                {t('otherDept')}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{t('otherDeptDesc')}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors shrink-0" />
          </motion.button>

          {/* Register Complaint via QR */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46 }}
            onClick={() => {
              const sessionId = `general-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
              navigate(`/qr/${sessionId}`)
            }}
            className="group relative flex items-center gap-4 bg-gradient-to-br from-assam-blue to-blue-900 rounded-2xl shadow-md border-2 border-transparent hover:shadow-xl transition-all p-5 focus:outline-none focus:ring-4 focus:ring-blue-400 overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/15 backdrop-blur-sm shrink-0 group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-blue-300 uppercase tracking-widest mb-0.5">{t('fastTrack')}</p>
              <p className="text-base font-bold text-white leading-tight">{t('registerComplaint')}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors shrink-0" />
          </motion.button>

        </div>
      </div>

      {/* ── Download App QR — bottom-left corner ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-4 left-5 flex items-center gap-3 bg-white/70 dark:bg-slate-800/70 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3"
      >
        <div className="bg-white rounded-lg p-1 border border-gray-100 shrink-0">
          <img
            src="/suvidha_app_qr.png"
            alt="Scan to download SUVIDHA App"
            className="w-24 h-24 object-contain"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-none">📱 Scan to get</p>
          <p className="text-sm font-bold text-assam-blue dark:text-blue-400 leading-tight">Download<br/>SUVIDHA App</p>
          <p className="text-[10px] text-gray-400 leading-snug">Google Play &amp; App Store</p>
        </div>
      </motion.div>

      {/* ── Pending Bills Modal ── */}
      {billsOpen && (
        <PendingBillsModal
          onClose={() => setBillsOpen(false)}
          navigate={navigate}
        />
      )}

    </section>
  )
}
