import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Building2, Search, IndianRupee, FileText, QrCode, CreditCard, Printer } from 'lucide-react'
import NumPad from '../components/NumPad'
import { printReceipt } from '../utils/printReceipt'

const ASSESSMENT_TYPES = [
  { id: 'residential', label: 'Residential', icon: '🏠', desc: 'Houses, flats, apartments' },
  { id: 'commercial', label: 'Commercial', icon: '🏢', desc: 'Shops, offices, warehouses' },
  { id: 'industrial', label: 'Industrial', icon: '🏭', desc: 'Factories, plants' },
  { id: 'vacant', label: 'Vacant Land', icon: '🌿', desc: 'Empty plots, open land' },
]

// Mock property records
const MOCK_PROPERTIES = {
  '1234567890': { owner: 'Ramesh Kumar', address: '45, Sector-3, Beltola', type: 'Residential', area: '120 sqm', tax: '₹4,320', arrears: '₹0', dueDate: '31 Mar 2027', pid: '1234567890' },
  '9876543210': { owner: 'Priya Sharma', address: '12, MG Road, Guwahati', type: 'Commercial', area: '280 sqm', tax: '₹18,960', arrears: '₹5,400', dueDate: '31 Mar 2027', pid: '9876543210' },
}

export default function PropertyTaxFlow() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [pid, setPid] = useState('')
  const [propertyData, setPropertyData] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [payMethod, setPayMethod] = useState('')
  const [refNo] = useState(`PT-${Math.floor(1000 + Math.random() * 9000)}-MC`)

  const handleSearch = () => {
    if (pid.length < 8) return
    const data = MOCK_PROPERTIES[pid]
    if (data) {
      setPropertyData(data)
      setNotFound(false)
      setStep(2)
    } else {
      setNotFound(true)
    }
  }

  const handlePaySelect = (method) => {
    setPayMethod(method)
    setStep(3)
    setTimeout(() => setStep(4), 2800)
  }

  return (
    <section className="flex-1 flex flex-col items-center h-[calc(100vh-5.5rem)] bg-surface px-6 py-6 overflow-hidden">

      {/* Top Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-6">
        <motion.button
          onClick={() => step <= 2 ? navigate('/service/municipal') : (step === 3 ? null : navigate('/home'))}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 px-5 py-3 bg-white shadow-md rounded-xl text-gray-700 font-bold text-xl border border-gray-100"
          disabled={step === 3}
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </motion.button>

        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100">
          <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xl">
            🏛️
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-800">Property Tax</h2>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[1,2,3,4].map(s => (
            <div key={s} className={`h-2 rounded-full transition-all ${s <= step ? 'bg-violet-600 w-8' : 'bg-slate-200 w-4'}`} />
          ))}
        </div>
      </div>

      <div className="w-full max-w-5xl flex-1 flex flex-col items-center">
        <AnimatePresence mode="wait">

          {/* STEP 1 — Enter Property ID */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -40 }}
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Left */}
              <div className="bg-white p-7 rounded-3xl shadow-xl border border-gray-100 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center">
                    <Search className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Property Lookup</h3>
                    <p className="text-gray-500 text-sm">Enter 10-digit Property ID</p>
                  </div>
                </div>

                {/* PID Display */}
                <div className={`border-2 rounded-2xl px-5 py-4 mb-4 text-center min-h-[72px] flex items-center justify-center transition-colors
                  ${notFound ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-slate-50'}`}>
                  {pid ? (
                    <span className="text-4xl font-display font-bold tracking-[0.15em] text-slate-800">
                      {pid.replace(/(.{5})/g, '$1 ').trim()}
                    </span>
                  ) : (
                    <span className="text-xl text-slate-400">XXXXX XXXXX</span>
                  )}
                </div>
                {notFound && (
                  <p className="text-rose-600 text-sm font-semibold mb-3 text-center">No property found with this ID. Please check and retry.</p>
                )}

                {/* Assessment Type hint */}
                <p className="text-slate-500 text-sm font-medium mb-3">Common Property Types:</p>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {ASSESSMENT_TYPES.map(t => (
                    <div key={t.id} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                      <span className="text-lg">{t.icon}</span>
                      <div>
                        <span className="text-xs font-bold text-slate-700">{t.label}</span>
                        <p className="text-xs text-slate-400">{t.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex-1" />
                <button onClick={handleSearch} disabled={pid.length < 8}
                  className={`w-full py-4 rounded-2xl text-xl font-bold transition-all flex items-center justify-center gap-3
                    ${pid.length >= 8 ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                  <Search className="w-5 h-5" /> Fetch Property Details
                </button>

                <p className="text-center text-xs text-slate-400 mt-3">
                  Try: <button onClick={() => { setPid('1234567890'); setNotFound(false) }} className="underline text-violet-500">1234567890</button>
                  {' '}or <button onClick={() => { setPid('9876543210'); setNotFound(false) }} className="underline text-violet-500">9876543210</button>
                </p>
              </div>

              {/* NumPad */}
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center">
                <NumPad value={pid} onChange={(v) => { setPid(v); setNotFound(false) }} maxLength={10} />
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Property Summary & Payment */}
          {step === 2 && propertyData && (
            <motion.div key="s2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              className="w-full flex flex-col gap-5"
            >
              {/* Property Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-5 flex items-center justify-between">
                  <div>
                    <p className="text-violet-200 text-sm font-medium uppercase tracking-widest">Property ID: {propertyData.pid}</p>
                    <h3 className="text-3xl font-display font-bold text-white mt-1">{propertyData.owner}</h3>
                    <p className="text-violet-200 mt-1">{propertyData.address}</p>
                  </div>
                  <span className="text-5xl">🏠</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-slate-100">
                  {[
                    { label: 'Type', value: propertyData.type },
                    { label: 'Built-up Area', value: propertyData.area },
                    { label: 'Current Tax', value: propertyData.tax },
                    { label: 'Arrears', value: propertyData.arrears || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="px-5 py-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{label}</p>
                      <p className="text-xl font-bold text-slate-800 mt-1">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Due Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IndianRupee className="w-6 h-6 text-amber-600" />
                  <div>
                    <p className="font-bold text-amber-900 text-lg">Total Amount Due</p>
                    <p className="text-amber-700 text-sm">Due by: {propertyData.dueDate}</p>
                  </div>
                </div>
                <span className="text-3xl font-display font-extrabold text-amber-800">
                  {propertyData.tax}{propertyData.arrears !== '₹0' ? ` + ${propertyData.arrears}` : ''}
                </span>
              </div>

              {/* Payment Method */}
              <div>
                <h4 className="text-lg font-bold text-slate-700 mb-3">Select Payment Method</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'upi', label: 'UPI / QR Scan', icon: QrCode, desc: 'GPay, PhonePe, Paytm', color: 'from-emerald-500 to-teal-600' },
                    { id: 'card', label: 'Card Payment', icon: CreditCard, desc: 'Debit / Credit Card', color: 'from-blue-600 to-indigo-700' },
                    { id: 'receipt', label: 'Get Challan', icon: FileText, desc: 'Pay at bank/post office', color: 'from-slate-600 to-slate-800' },
                  ].map(m => (
                    <motion.button key={m.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handlePaySelect(m.id)}
                      className={`p-6 rounded-2xl bg-gradient-to-br ${m.color} text-white flex flex-col items-center gap-3 shadow-lg hover:shadow-xl transition-shadow`}
                    >
                      <m.icon className="w-8 h-8" />
                      <span className="text-lg font-bold">{m.label}</span>
                      <span className="text-xs opacity-75">{m.desc}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Processing */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-12 flex flex-col items-center text-center mt-10"
            >
              <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mb-6">
                <IndianRupee className="w-10 h-10 text-violet-600 animate-pulse" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">Processing Payment…</h3>
              <p className="text-lg text-slate-500">Connecting to municipal payment gateway.</p>
            </motion.div>
          )}

          {/* STEP 4 — Receipt */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center p-10 mt-4"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-5">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-4xl font-display font-bold text-slate-800 mb-1">Payment Successful</h3>
              <p className="text-slate-500 text-lg mb-2 text-center">Property tax payment has been recorded with Municipal Corporation.</p>

              <div className="w-full bg-slate-50 rounded-2xl p-6 border-2 border-slate-100 mb-4 text-center">
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-1 font-medium">Transaction Receipt No</p>
                <span className="text-3xl font-bold font-display text-violet-700">{refNo}</span>
              </div>

              <div className="w-full bg-amber-50 border border-amber-100 rounded-xl px-5 py-3 mb-6 text-center">
                <p className="text-amber-800 text-sm">📋 Please collect your receipt from the kiosk printer or check your registered mobile for SMS confirmation.</p>
              </div>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() => printReceipt({
                    title: 'Property Tax Payment Receipt',
                    refNo,
                    department: 'Municipal Corporation',
                    serviceType: 'Property Tax Payment',
                    fields: [
                      { label: 'Property ID', value: propertyData.pid },
                      { label: 'Owner Name', value: propertyData.owner },
                      { label: 'Address', value: propertyData.address },
                      { label: 'Property Type', value: propertyData.type },
                      { label: 'Built-up Area', value: propertyData.area },
                      { label: 'Tax Paid', value: propertyData.tax },
                      { label: 'Payment Method', value: payMethod.toUpperCase() },
                      { label: 'Financial Year', value: '2026–27' },
                    ],
                    note: 'This receipt is valid as proof of property tax payment for FY 2026–27. Please retain for your records.',
                  })}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-violet-600 text-white rounded-2xl text-xl font-bold hover:bg-violet-700 transition-colors shadow-md"
                >
                  <Printer className="w-5 h-5" /> Print / Save Receipt
                </button>
                <button onClick={() => navigate('/home')}
                  className="flex-1 px-6 py-4 bg-slate-800 text-white rounded-2xl text-xl font-bold hover:bg-slate-700 transition-colors shadow-md">
                  Return to Home
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  )
}
