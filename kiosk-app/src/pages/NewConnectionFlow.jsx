import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, FileText, FileBadge2, Smartphone, ShieldCheck } from 'lucide-react'
import NumPad from '../components/NumPad'

export default function NewConnectionFlow() {
  const { type } = useParams()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [aadhar, setAadhar] = useState('')
  const [mobile, setMobile] = useState('')

  const handleAadharSubmit = () => {
    if (aadhar.length === 12) setStep(2)
  }

  const handleMobileSubmit = () => {
    if (mobile.length === 10) {
      setStep(3)
      // Simulate real delay
      setTimeout(() => setStep(4), 2000)
    }
  }

  return (
    <section className="flex-1 flex flex-col items-center h-[calc(100vh-5.5rem)] bg-surface px-6 py-8 overflow-hidden">
      {/* Top Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <motion.button
          onClick={() => {
            if (step === 1) navigate(`/service/${type}`)
            else if (step === 2) setStep(1)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 px-6 py-4 bg-white shadow-md rounded-xl text-gray-700 font-bold text-xl border border-gray-100"
        >
          <ArrowLeft className="w-6 h-6" /> Back
        </motion.button>

        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-700 text-white">
            <FileBadge2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-800 tracking-tight">New Connection</h2>
        </div>
      </div>

      <div className="w-full max-w-5xl flex-1 flex flex-col items-center">
        <AnimatePresence mode="wait">

          {/* STEP 1: Enter Aadhar */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
            >
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col relative overflow-hidden">
                <ShieldCheck className="absolute -right-8 -top-8 w-48 h-48 text-indigo-50 opacity-50" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2 relative z-10">Identity Verification</h3>
                <p className="text-gray-500 mb-8 text-lg relative z-10">Please enter your 12-digit Aadhar Card Number for e-KYC.</p>

                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 mb-8 text-center min-h-[5rem] flex items-center justify-center">
                  {aadhar ? (
                    <span className="text-5xl font-display font-bold tracking-[0.2em] text-slate-800">
                      {aadhar.replace(/(.{4})/g, '$1 ').trim()}
                    </span>
                  ) : (
                    <span className="text-2xl text-slate-400 font-medium tracking-wide">XXXX XXXX XXXX</span>
                  )}
                </div>

                <div className="flex-1" />

                <button
                  onClick={handleAadharSubmit}
                  disabled={aadhar.length !== 12}
                  className={`w-full py-5 rounded-2xl text-2xl font-bold transition-all ${aadhar.length === 12
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                  Verify via Biometrics
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center">
                <NumPad value={aadhar} onChange={setAadhar} maxLength={12} />
              </div>
            </motion.div>
          )}

          {/* STEP 2: Enter Mobile */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
            >
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col relative overflow-hidden">
                <Smartphone className="absolute -right-8 -top-8 w-48 h-48 text-indigo-50 opacity-50" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2 relative z-10">Link Mobile Number</h3>
                <p className="text-gray-500 mb-8 text-lg relative z-10">We need this number for sending OTPs and application updates.</p>

                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 mb-8 text-center min-h-[5rem] flex items-center justify-center">
                  {mobile ? (
                    <span className="text-5xl font-display font-bold tracking-[0.1em] text-slate-800">
                      {mobile}
                    </span>
                  ) : (
                    <span className="text-2xl text-slate-400 font-medium tracking-wide">Enter 10 Digits</span>
                  )}
                </div>

                <div className="flex-1" />

                <button
                  onClick={handleMobileSubmit}
                  disabled={mobile.length !== 10}
                  className={`w-full py-5 rounded-2xl text-2xl font-bold transition-all ${mobile.length === 10
                      ? 'bg-gradient-to-r from-assam-blue to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                  Submit Application
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center">
                <NumPad value={mobile} onChange={setMobile} maxLength={10} />
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
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-indigo-500 animate-pulse" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">Submitting...</h3>
              <p className="text-lg text-slate-500">Creating your profile and updating records.</p>
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
              <h3 className="text-4xl font-display font-bold text-slate-800 mb-2 text-center">Application Received</h3>
              <p className="text-xl text-slate-500 text-center mb-8">Your request has been successfully registered.</p>

              <div className="w-full bg-slate-50 rounded-2xl p-6 border-2 border-slate-100 mb-10 text-center">
                <span className="block text-slate-500 text-sm uppercase tracking-widest mb-2 font-medium">Application Reference No</span>
                <span className="text-4xl font-bold font-display text-assam-blue">UE-{Math.floor(1000 + Math.random() * 9000)}-AP</span>
              </div>

              <button
                onClick={() => navigate('/home')}
                className="px-10 py-5 bg-slate-800 text-white rounded-2xl text-2xl font-bold hover:bg-slate-700 transition-colors shadow-lg"
              >
                Return to Home
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  )
}
