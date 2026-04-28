import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Zap, UserSquare2, FileText, Printer } from 'lucide-react'
import NumPad from '../components/NumPad'
import { printReceipt } from '../utils/printReceipt'

export default function LoadExtensionFlow() {
  const { serviceId } = useParams()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [consumerNo, setConsumerNo] = useState('')
  const [selectedLoad, setSelectedLoad] = useState('')
  const [refNo] = useState(`LE-${Math.floor(1000 + Math.random() * 9000)}-EL`)

  const handleConsumerSubmit = () => {
    if (consumerNo.length === 10) setStep(2)
  }

  const handleLoadSelect = (loadValue) => {
    setSelectedLoad(loadValue)
    setStep(3)
    // Simulate real delay for processing
    setTimeout(() => setStep(4), 2500)
  }

  const loadOptions = [
    { value: '2kW', desc: 'Small Household' },
    { value: '3kW', desc: 'Standard Household' },
    { value: '5kW', desc: 'Large Household (AC/Geyser)' },
    { value: '7.5kW', desc: 'Heavy Usage / Commercial' },
    { value: '10kW', desc: 'Small Industrial' },
    { value: 'Custom', desc: 'Require Special Assessment' }
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
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-800 tracking-tight">Load Extension Request</h2>
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
                <UserSquare2 className="absolute -right-8 -top-8 w-48 h-48 text-orange-50 opacity-50" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2 relative z-10">Account Verification</h3>
                <p className="text-gray-500 mb-8 text-lg relative z-10">Please enter your 10-digit Electrical Consumer Number.</p>

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
                      ? 'bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                  Fetch Account Details
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center">
                <NumPad value={consumerNo} onChange={setConsumerNo} maxLength={10} />
              </div>
            </motion.div>
          )}

          {/* STEP 2: Select New Load Requirement */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col"
            >
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Select Required Load</h3>
              <p className="text-gray-500 mb-8 text-lg">Choose the total load capacity you need to extend to.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loadOptions.map((opt) => (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLoadSelect(opt.value)}
                    className="p-6 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:bg-orange-50 hover:border-orange-200 text-left transition-colors group flex items-center justify-between"
                  >
                    <div>
                      <span className="block text-2xl font-bold text-slate-800 group-hover:text-orange-600">{opt.value}</span>
                      <span className="block text-slate-500 text-lg mt-1">{opt.desc}</span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-orange-300 group-hover:bg-orange-100 transition-colors">
                      <Zap className="w-6 h-6 text-slate-400 group-hover:text-orange-500" />
                    </div>
                  </motion.button>
                ))}
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
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-orange-500 animate-pulse" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">Processing Request...</h3>
              <p className="text-lg text-slate-500">Evaluating load feasibility on the grid.</p>
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
              <h3 className="text-4xl font-display font-bold text-slate-800 mb-2 text-center">Extension Requested</h3>
              <p className="text-xl text-slate-500 text-center mb-8">Your request for {selectedLoad} has been logged for physical inspection.</p>

              <div className="w-full bg-slate-50 rounded-2xl p-6 border-2 border-slate-100 mb-6 text-center">
                <span className="block text-slate-500 text-sm uppercase tracking-widest mb-2 font-medium">Service Reference No</span>
                <span className="text-4xl font-bold font-display text-orange-600">{refNo}</span>
              </div>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() => printReceipt({
                    title: 'Load Extension Request',
                    refNo,
                    department: 'Electricity Department',
                    serviceType: 'Load Extension Request',
                    fields: [
                      { label: 'Consumer Number', value: consumerNo },
                      { label: 'Load Requested', value: selectedLoad },
                      { label: 'Status', value: 'Pending Physical Inspection' },
                      { label: 'Expected TAT', value: '7–10 Working Days' },
                    ],
                    note: 'A field engineer will visit your premises for load assessment. Please keep the meter accessible.',
                  })}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-orange-600 text-white rounded-2xl text-xl font-bold hover:bg-orange-700 transition-colors shadow-md"
                >
                  <Printer className="w-5 h-5" /> Print / Save Receipt
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="flex-1 px-6 py-4 bg-slate-800 text-white rounded-2xl text-xl font-bold hover:bg-slate-700 transition-colors shadow-md"
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
