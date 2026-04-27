import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Zap, Droplet, Flame, FileText, CreditCard, Smartphone } from 'lucide-react'
import NumPad from '../components/NumPad'
import QRCodeBlock from '../components/QRCodeBlock'

const serviceData = {
  electricity: { icon: Zap, label: 'Electricity Bill', color: 'text-yellow-500', bg: 'bg-yellow-50', gradient: 'from-yellow-400 to-yellow-600', idName: 'Consumer Number' },
  water: { icon: Droplet, label: 'Water Bill', color: 'text-blue-500', bg: 'bg-blue-50', gradient: 'from-blue-400 to-blue-600', idName: 'Account Number' },
  gas: { icon: Flame, label: 'Gas Bill', color: 'text-orange-500', bg: 'bg-orange-50', gradient: 'from-orange-400 to-orange-600', idName: 'Customer ID' },
}

export default function PayBillFlow() {
  const { type } = useParams()
  const navigate = useNavigate()
  const service = serviceData[type] || { icon: FileText, label: 'Service Bill', color: 'text-slate-500', bg: 'bg-slate-50', gradient: 'from-slate-400 to-slate-600', idName: 'Reference Number' }
  const Icon = service.icon

  const [step, setStep] = useState(1)
  const [consumerNo, setConsumerNo] = useState('')
  const [billFetched, setBillFetched] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(null)

  // Mock Bill info
  const billAmount = (Math.random() * 2000 + 500).toFixed(2)
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const handleFetchBill = () => {
    if (consumerNo.length > 5) {
      setStep(2)
      // Simulate network
      setTimeout(() => setBillFetched(true), 1200)
    }
  }

  const handlePayment = (method) => {
    setPaymentMethod(method)
    setStep(3)
    // Simulate real flow with appropriate delays based on the selected method
    setTimeout(() => {
      navigate(`/success/${Math.floor(Math.random() * 1000000)}?type=payment&amount=${billAmount}&method=${method}`)
    }, method === 'UPI' ? 6000 : 4000)
  }

  return (
    <section className="flex-1 flex flex-col items-center h-[calc(100vh-5.5rem)] bg-surface px-6 py-8 overflow-hidden">
      {/* Top Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <motion.button
          onClick={() => step === 1 ? navigate(`/service/${type}`) : setStep(step - 1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 px-6 py-4 bg-white shadow-md rounded-xl text-gray-700 font-bold text-xl border border-gray-100"
        >
          <ArrowLeft className="w-6 h-6" /> Back
        </motion.button>

        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${service.gradient} text-white`}>
            <Icon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-800">Pay {service.label}</h2>
        </div>
      </div>

      <div className="w-full max-w-5xl flex-1 flex flex-col items-center">
        <AnimatePresence mode="wait">

          {/* STEP 1: Enter ID wrapper */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
            >
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Enter {service.idName}</h3>
                <p className="text-gray-500 mb-8 text-lg">Please enter your unique 6+ digit ID shown on your previous bill.</p>

                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 mb-8 text-center min-h-[5rem] flex items-center justify-center">
                  {consumerNo ? (
                    <span className="text-5xl font-display font-bold tracking-widest text-slate-800">{consumerNo}</span>
                  ) : (
                    <span className="text-2xl text-slate-400 font-medium tracking-wide">Enter Number</span>
                  )}
                </div>

                <button
                  onClick={handleFetchBill}
                  disabled={consumerNo.length <= 5}
                  className={`w-full py-5 rounded-2xl text-2xl font-bold transition-all ${consumerNo.length > 5
                      ? `bg-gradient-to-r ${service.gradient} text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1`
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                  Fetch Bill Details
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                <NumPad value={consumerNo} onChange={setConsumerNo} maxLength={12} />
              </div>
            </motion.div>
          )}

          {/* STEP 2: Bill Summary */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
            >
              {!billFetched ? (
                <div className="p-16 flex flex-col items-center justify-center space-y-6">
                  <div className="w-16 h-16 border-4 border-slate-200 border-t-assam-blue rounded-full animate-spin"></div>
                  <p className="text-2xl font-medium text-slate-600 animate-pulse">Fetching Bill details...</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className={`p-8 bg-gradient-to-br ${service.gradient} text-white flex justify-between items-end`}>
                    <div>
                      <p className="text-white/80 font-medium mb-1 uppercase tracking-wider text-sm">{service.idName}</p>
                      <p className="text-2xl font-display font-bold tracking-widest">{consumerNo}</p>
                      <p className="text-white/90 font-medium mt-4 text-lg">Mr. Diganta Borah</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 font-medium mb-1 uppercase tracking-wider text-sm">Amount Due</p>
                      <p className="text-5xl font-display font-bold">₹{billAmount}</p>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex justify-between items-center py-4 border-b border-slate-100">
                      <span className="text-lg text-slate-500">Due Date</span>
                      <span className="text-xl font-bold text-slate-800">{dueDate}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 mb-4">
                      <span className="text-lg text-slate-500">Bill Cycle</span>
                      <span className="text-xl font-bold text-slate-800">Feb 2026 - Mar 2026</span>
                    </div>

                    <h4 className="text-xl font-bold text-slate-800 mb-4">Select Payment Method</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button onClick={() => handlePayment('UPI')} className="p-6 border-2 border-slate-200 rounded-2xl hover:border-assam-blue hover:bg-slate-50 flex items-center justify-center gap-3 transition-colors">
                        <Smartphone className="w-8 h-8 text-assam-blue" />
                        <span className="text-2xl font-bold text-slate-700">UPI / QR Scan</span>
                      </button>
                      <button onClick={() => handlePayment('Card')} className="p-6 border-2 border-slate-200 rounded-2xl hover:border-assam-blue hover:bg-slate-50 flex items-center justify-center gap-3 transition-colors">
                        <CreditCard className="w-8 h-8 text-assam-blue" />
                        <span className="text-2xl font-bold text-slate-700">Card Payment</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 3: Processing Payment */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg bg-white p-12 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center mt-12 border-4 border-gray-50"
            >
              {paymentMethod === 'UPI' ? (
                <>
                  <h3 className="text-3xl font-bold text-slate-800 mb-4">Scan QR to Pay</h3>
                  <p className="text-lg text-slate-500 mb-8">Scan with any UPI app (GPay, PhonePe, Paytm)</p>
                  <QRCodeBlock value={`upi://pay?pa=urbaneye@assam&pn=AssamGovt&am=${billAmount}&cu=INR`} category="Payment" />
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-assam-blue rounded-full animate-spin mt-8 mx-auto"></div>
                  <p className="text-slate-500 mt-4 animate-pulse">Waiting for payment confirmation...</p>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <CreditCard className="w-12 h-12 text-assam-blue animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">Insert or Tap Card</h3>
                  <p className="text-lg text-slate-500 mb-8">Please follow the instructions on the card terminal.</p>
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-assam-blue rounded-full animate-spin mt-4 mx-auto"></div>
                  <p className="text-slate-500 mt-4 animate-pulse">Processing secure transaction...</p>
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  )
}
