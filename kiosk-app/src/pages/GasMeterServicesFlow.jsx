import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Flame, AlertCircle, Wrench, ThermometerSun, Sun, Moon, Sunrise, UserSquare2, FileText, Printer } from 'lucide-react'
import NumPad from '../components/NumPad'
import { printReceipt } from '../utils/printReceipt'

export default function GasMeterServicesFlow() {
  const { serviceId } = useParams()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [consumerNo, setConsumerNo] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [refNo] = useState(`GAS-${Math.floor(1000 + Math.random() * 9000)}`)

  const handleConsumerSubmit = () => {
    if (consumerNo.length === 10) setStep(2)
  }

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    setStep(3)
  }

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot)
    setStep(4)
    // Simulate real delay for processing
    setTimeout(() => setStep(5), 2500)
  }

  const serviceOptions = [
    { id: 'relocate', label: 'Meter Relocation', icon: Wrench, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'leakage', label: 'Leakage Check', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'testing', label: 'Meter Testing', icon: ThermometerSun, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'inspect', label: 'General Inspection', icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100' }
  ]

  const timeSlots = [
    { id: 'morning', label: 'Morning', time: '09:00 AM - 12:00 PM', icon: Sunrise, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'afternoon', label: 'Afternoon', time: '12:00 PM - 04:00 PM', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'evening', label: 'Evening', time: '04:00 PM - 07:00 PM', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' }
  ]

  return (
    <section className="flex-1 flex flex-col items-center h-[calc(100vh-5.5rem)] bg-surface px-6 py-8 overflow-hidden">
      {/* Top Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <motion.button
          onClick={() => {
            if (step === 1) navigate(`/service/${serviceId}`)
            else if (step > 1 && step < 4) setStep(step - 1)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 px-6 py-4 bg-white shadow-md rounded-xl text-gray-700 font-bold text-xl border border-gray-100"
        >
          <ArrowLeft className="w-6 h-6" /> Back
        </motion.button>

        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-rose-500 text-white">
            <Flame className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-800 tracking-tight">Gas Meter Services</h2>
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
                <UserSquare2 className="absolute -right-8 -top-8 w-48 h-48 text-rose-50 opacity-50" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2 relative z-10">Account Verification</h3>
                <p className="text-gray-500 mb-8 text-lg relative z-10">Please enter your 10-digit Gas Consumer Number.</p>

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
                      ? 'bg-gradient-to-r from-orange-400 to-rose-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                  Verify Account
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center">
                <NumPad value={consumerNo} onChange={setConsumerNo} maxLength={10} />
              </div>
            </motion.div>
          )}

          {/* STEP 2: Service Type */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col"
            >
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Select Service</h3>
              <p className="text-gray-500 mb-8 text-lg">What gas meter service do you require today?</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {serviceOptions.map((opt) => {
                  const Icon = opt.icon
                  return (
                    <motion.button
                      key={opt.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleServiceSelect(opt.label)}
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

          {/* STEP 3: Scheduling */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col"
            >
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Schedule Inspection</h3>
              <p className="text-gray-500 mb-8 text-lg">Select a preferred time slot for the technician visit.</p>

              <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
                {timeSlots.map((opt) => {
                  const Icon = opt.icon
                  return (
                    <motion.button
                      key={opt.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSlotSelect(opt.label)}
                      className="p-6 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 text-left transition-colors group flex items-center gap-6"
                    >
                      <div className={`w-16 h-16 rounded-full ${opt.bg} border border-slate-200 flex items-center justify-center group-hover:border-rose-300 shrink-0`}>
                        <Icon className={`w-8 h-8 ${opt.color}`} />
                      </div>
                      <div>
                        <span className="block text-2xl font-bold text-slate-800 group-hover:text-rose-600">{opt.label}</span>
                        <span className="block text-slate-500 text-lg mt-1">{opt.time}</span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 4: Submitting */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-sm bg-white p-12 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center mt-12"
            >
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-rose-500 animate-pulse" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">Booking Appointment...</h3>
              <p className="text-lg text-slate-500">Confirming technician availability.</p>
            </motion.div>
          )}

          {/* STEP 5: Application Receipt */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col items-center p-12 mt-4"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-4xl font-display font-bold text-slate-800 mb-2 text-center">Service Booked</h3>
              <p className="text-xl text-slate-500 text-center mb-4">Your request for <strong>{selectedService}</strong> has been confirmed.</p>
              
              <div className="w-full bg-orange-50 border border-orange-100 rounded-xl p-4 mb-8 text-center">
                 <p className="text-orange-800 text-lg">Scheduled for: <strong>Tomorrow, {selectedSlot}</strong></p>
              </div>

              <div className="w-full bg-slate-50 rounded-2xl p-6 border-2 border-slate-100 mb-6 text-center">
                <span className="block text-slate-500 text-sm uppercase tracking-widest mb-2 font-medium">Booking ID</span>
                <span className="text-4xl font-bold font-display text-rose-600">{refNo}</span>
              </div>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() => printReceipt({
                    title: 'Gas Meter Service Booking',
                    refNo,
                    department: 'Gas Supply Department',
                    serviceType: `Gas Meter – ${selectedService}`,
                    fields: [
                      { label: 'Consumer Number', value: consumerNo },
                      { label: 'Service Requested', value: selectedService },
                      { label: 'Appointment Slot', value: `Tomorrow, ${selectedSlot}` },
                      { label: 'Status', value: 'Confirmed' },
                    ],
                    note: 'Please keep the gas meter area accessible for the technician. Carry a valid photo ID.',
                  })}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-rose-600 text-white rounded-2xl text-xl font-bold hover:bg-rose-700 transition-colors shadow-md"
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
