import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, Fingerprint, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import NumPad from '../components/NumPad'

export default function LoginPage() {
  const { t } = useLanguage()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Where to go after login (defaults to /home if they just arrived at /login directly)
  const from = location.state?.from?.pathname || '/home'

  const [step, setStep] = useState('select') // select, phone, aadhaar, verify, success
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSimulateVerify = async (method) => {
    setLoading(true)
    // Simulate API delay
    await new Promise(r => setTimeout(r, 2000))
    setLoading(false)
    setStep('success')
    
    // Call login with mock user data
    login({
      id: method === 'phone' ? inputValue : `UID-${inputValue.slice(-4)}`,
      method: method,
      verifiedAt: new Date().toISOString()
    })

    setTimeout(() => {
      navigate(from, { replace: true })
    }, 1500)
  }

  const handleMethodSelect = (method) => {
    setStep(method)
    setInputValue('')
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-5.5rem)] bg-surface overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl border border-gray-100"
        >
          {/* Header */}
          <div className="bg-slate-50 border-b border-gray-100 px-8 py-6 flex items-center justify-center relative">
            {(step === 'phone' || step === 'aadhaar') && (
              <button 
                onClick={() => setStep('select')}
                className="absolute left-6 p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <h3 className="text-2xl font-display font-bold text-slate-800 text-center">
              {t('identityVerification')}
            </h3>
          </div>

          <div className="p-8 2xl:p-12 min-h-[400px] flex flex-col items-center justify-center relative bg-white">
            <AnimatePresence mode="wait">
              
              {/* Step 1: Select Method */}
              {step === 'select' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="w-full flex flex-col gap-6"
                >
                  <p className="text-xl text-center text-gray-600 mb-4">{t('promptToScan') || "Please select a login method"}</p>
                  
                  <button
                    onClick={() => handleMethodSelect('phone')}
                    className="flex items-center justify-between w-full h-24 px-8 border-2 border-gray-200 rounded-2xl hover:border-assam-blue hover:bg-blue-50 transition-all group focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-assam-blue">
                        <Smartphone className="w-7 h-7" />
                      </div>
                      <span className="text-2xl font-bold text-gray-700 group-hover:text-assam-blue">Mobile OTP</span>
                    </div>
                    <ArrowRight className="w-8 h-8 text-gray-300 group-hover:text-assam-blue" />
                  </button>

                  <button
                    onClick={() => handleMethodSelect('aadhaar')}
                    className="flex items-center justify-between w-full h-24 px-8 border-2 border-gray-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group focus:outline-none focus:ring-4 focus:ring-emerald-300"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Fingerprint className="w-7 h-7" />
                      </div>
                      <span className="text-2xl font-bold text-gray-700 group-hover:text-emerald-700">Aadhaar / Biometrics</span>
                    </div>
                    <ArrowRight className="w-8 h-8 text-gray-300 group-hover:text-emerald-500" />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Enter Phone */}
              {step === 'phone' && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-assam-blue mb-6">
                      <Smartphone className="w-10 h-10" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mb-2">{t('enterNumber') || "Enter Mobile Number"}</p>
                    <p className="text-lg text-gray-500 text-center mb-8">{t('needMobile') || "We'll send an OTP for verification"}</p>
                    
                    <input 
                      type="tel"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                      className="w-full max-w-md h-20 text-center text-4xl font-mono bg-gray-50 border-2 border-gray-300 rounded-2xl focus:border-assam-blue focus:ring-4 focus:ring-blue-200 outline-none transition-all mb-8"
                      readOnly
                    />

                    <button 
                      onClick={() => handleSimulateVerify('phone')}
                      disabled={inputValue.length !== 10 || loading}
                      className="w-full max-w-md h-16 rounded-xl bg-assam-blue text-white text-xl font-bold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-colors"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
                      Send OTP & Verify
                    </button>
                  </div>

                  <div className="flex items-center justify-center bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
                    <NumPad value={inputValue} onChange={setInputValue} maxLength={10} />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Aadhaar */}
              {step === 'aadhaar' && (
                <motion.div
                  key="aadhaar"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                      <Fingerprint className="w-10 h-10" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mb-2">Aadhaar Verification</p>
                    <p className="text-lg text-gray-500 text-center mb-8">{t('enterAadhar') || "Enter 12-digit Aadhaar number"}</p>
                    
                    <input 
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ''))}
                      placeholder="XXXX XXXX XXXX"
                      maxLength={12}
                      className="w-full max-w-md h-20 text-center text-4xl font-mono bg-gray-50 border-2 border-gray-300 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 outline-none transition-all mb-8 tracking-widest"
                      readOnly
                    />

                    <button 
                      onClick={() => handleSimulateVerify('aadhaar')}
                      disabled={inputValue.length !== 12 || loading}
                      className="w-full max-w-md h-16 rounded-xl bg-emerald-600 text-white text-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-colors"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
                      Verify Aadhaar
                    </button>
                  </div>

                  <div className="flex items-center justify-center bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
                    <NumPad value={inputValue} onChange={setInputValue} maxLength={12} />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 mb-6"
                  >
                    <CheckCircle2 className="w-16 h-16" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">Verification Successful</h3>
                  <p className="text-xl text-gray-500">Redirecting to menu...</p>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
