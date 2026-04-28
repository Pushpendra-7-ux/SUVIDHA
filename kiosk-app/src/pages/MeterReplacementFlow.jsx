import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Wrench, AlertTriangle, MonitorX, Gauge, Flame, UserSquare2, FileText, Printer } from 'lucide-react'
import NumPad from '../components/NumPad'
import { printReceipt } from '../utils/printReceipt'

export default function MeterReplacementFlow() {
  const { serviceId } = useParams()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [consumerNo, setConsumerNo] = useState('')
  const [selectedReason, setSelectedReason] = useState('')
  const [refNo] = useState(`MR-${Math.floor(1000 + Math.random() * 9000)}-EL`)

  const handleConsumerSubmit = () => {
    if (consumerNo.length === 10) setStep(2)
  }

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason)
    setStep(3)
    // Simulate real delay for processing
    setTimeout(() => setStep(4), 2500)
  }

  const reasonOptions = [
    { id: 'burnt', label: 'Meter Burnt/Damaged', icon: Flame, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'display', label: 'Display Not Visible', icon: MonitorX, color: 'text-slate-600', bg: 'bg-slate-100' },
    { id: 'fast', label: 'Meter Running Fast', icon: Gauge, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'physical', label: 'Physical Damage (External)', icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' }
  ]

  return (
    <section className="flex-1 flex flex-col items-center h-[calc(100vh-5.5rem)] bg-surface px-6 py-8 overflow-hidden">
      {/* Top Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <motion.button
          onClick={() => {
            if (step === 1) navigate(`/service/${serviceId}`)
            else if (step === 2) setStep(1)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 px-6 py-4 bg-white shadow-md rounded-xl text-gray-700 font-bold text-xl border border-gray-100"
        >
          <ArrowLeft className="w-6 h-6" /> Back
        </motion.button>

        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-800 text-white">
            <Wrench className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-800 tracking-tight">Meter Replacement</h2>
        </div>
      </div>

      <div className="w-full max-w-5xl flex-1 flex flex-col items-center">
        <AnimatePresence mode="wait">

          {/* STEP 1: Enter Consumer No */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
            >
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col relative overflow-hidden">
                <UserSquare2 className="absolute -right-8 -top-8 w-48 h-48 text-slate-50 opacity-50" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2 relative z-10">Account Verification</h3>
                <p className="text-gray-500 mb-8 text-lg relative z-10">Please enter your 10-digit Electrical Consumer Number to fetch meter details.</p>

                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 mb-8 text-center min-h-[5rem] flex items-center justify-center">
                  {consumerNo ? (
                    <span className="text-5xl font-display font-bold tracking-[0.2em] text-slate-800">
                      {consumerNo.replace(/(.{5})/g, '$1 ').trim()}
                    </span>
                  ) : (
                    <span className="text-2xl text-slate-400 font-medium tracking-wide">XXXXX XXXXX</span>
                  )}
                </div>

                <div className="flex-1" />

                <button
                  onClick={handleConsumerSubmit}
                  disabled={consumerNo.length !== 10}
                  className={`w-full py-5 rounded-2xl text-2xl font-bold transition-all ${consumerNo.length === 10
                      ? 'bg-gradient-to-r from-slate-600 to-slate-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                  Fetch Meter Details
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center">
                <NumPad value={consumerNo} onChange={setConsumerNo} maxLength={10} />
              </div>
            </motion.div>
          )}

          {/* STEP 2: Select Reason */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col"
            >
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Reason for Replacement</h3>
              <p className="text-gray-500 mb-8 text-lg">Please select the issue you are facing with your current meter.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reasonOptions.map((opt) => {
                  const Icon = opt.icon
                  return (
                    <motion.button
                      key={opt.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleReasonSelect(opt.label)}
                      className="p-8 rounded-3xl border-2 border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col items-center justify-center text-center gap-4"
                    >
                      <div className={`w-20 h-20 rounded-full ${opt.bg} flex items-center justify-center`}>
                        <Icon className={`w-10 h-10 ${opt.color}`} />
                      </div>
                      <span className="text-2xl font-bold text-slate-800">{opt.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Submitting */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-sm bg-white p-12 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center mt-12"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-slate-600 animate-pulse" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">Generating Order...</h3>
              <p className="text-lg text-slate-500">Creating replacement work order.</p>
            </motion.div>
          )}

          {/* STEP 4: Application Receipt */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col items-center p-12 mt-4"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-4xl font-display font-bold text-slate-800 mb-2 text-center">Request Received</h3>
              <p className="text-xl text-slate-500 text-center mb-4">Your meter replacement request has been successfully registered.</p>
              
              <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
                 <p className="text-blue-800 text-center"><strong>SLA:</strong> A technician will visit your registered address within <strong>48 Working Hours</strong>.</p>
              </div>

              <div className="w-full bg-slate-50 rounded-2xl p-6 border-2 border-slate-100 mb-6 text-center">
                <span className="block text-slate-500 text-sm uppercase tracking-widest mb-2 font-medium">Work Order No</span>
                <span className="text-4xl font-bold font-display text-slate-800">{refNo}</span>
              </div>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() => printReceipt({
                    title: 'Meter Replacement Work Order',
                    refNo,
                    department: 'Electricity Department',
                    serviceType: 'Meter Replacement',
                    fields: [
                      { label: 'Consumer Number', value: consumerNo },
                      { label: 'Reason', value: selectedReason },
                      { label: 'Status', value: 'Work Order Raised' },
                      { label: 'SLA', value: 'Technician visit within 48 Working Hours' },
                    ],
                    note: 'Please ensure someone is present at the registered address during the technician visit.',
                  })}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-slate-700 text-white rounded-2xl text-xl font-bold hover:bg-slate-800 transition-colors shadow-md"
                >
                  <Printer className="w-5 h-5" /> Print / Save Receipt
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="flex-1 px-6 py-4 bg-slate-900 text-white rounded-2xl text-xl font-bold hover:bg-slate-800 transition-colors shadow-md"
                >
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
