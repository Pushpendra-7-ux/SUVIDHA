import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Smartphone, Fingerprint, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import NumPad from './NumPad'

export default function AuthenticationModal({ isOpen, onClose, onSuccess }) {
  const { t } = useLanguage()
  const [step, setStep] = useState('select') // select, phone, aadhaar, verify, success
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSimulateVerify = async () => {
    setLoading(true)
    // Simulate API delay
    await new Promise(r => setTimeout(r, 2000))
    setLoading(false)
    setStep('success')
    setTimeout(() => {
      onSuccess()
    }, 1500)
  }

  const handleMethodSelect = (method) => {
    setStep(method)
    setInputValue('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 w-full h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl border-4 border-white"
      >
        {/* Header */}
        <div className="bg-slate-50 border-b border-gray-100 flex items-center justify-between px-8 py-6">
          <h3 className="text-2xl font-display font-bold text-slate-800">
            {t('identityVerification')}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="w-8 h-8 text-gray-500" />
          </button>
        </div>

        <div className="p-8 2xl:p-12 min-h-[400px] flex flex-col items-center justify-center relative">
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
                <p className="text-xl text-center text-gray-600 mb-4">{t('promptToScan')}</p>
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
                  <p className="text-2xl font-bold text-gray-800 mb-2">{t('enterNumber')}</p>
                  <p className="text-lg text-gray-500 text-center mb-8">{t('needMobile')}</p>
                  
                  <input 
                    type="tel"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    className="w-full max-w-md h-20 text-center text-4xl font-mono bg-gray-50 border-2 border-gray-300 rounded-2xl focus:border-assam-blue focus:ring-4 focus:ring-blue-200 outline-none transition-all mb-8"
                    readOnly
                  />

                  <div className="flex gap-4 w-full max-w-md">
                    <button 
                      onClick={() => setStep('select')}
                      className="flex-1 h-16 rounded-xl border-2 border-gray-200 text-xl font-bold text-gray-600 hover:bg-gray-50"
                    >
                      {t('back')}
                    </button>
                    <button 
                      onClick={handleSimulateVerify}
                      disabled={inputValue.length !== 10 || loading}
                      className="flex-[2] h-16 rounded-xl bg-assam-blue text-white text-xl font-bold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-colors"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
                      Send OTP
                    </button>
                  </div>
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
                  <p className="text-2xl font-bold text-gray-800 mb-2">Aadhaar Verification</p>
                  <p className="text-lg text-gray-500 text-center mb-8">{t('enterAadhar')}</p>
                  
                  <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="XXXX XXXX XXXX"
                    maxLength={12}
                    className="w-full max-w-md h-20 text-center text-4xl font-mono bg-gray-50 border-2 border-gray-300 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 outline-none transition-all mb-8 tracking-widest"
                    readOnly
                  />

                  <div className="flex gap-4 w-full max-w-md">
                    <button 
                      onClick={() => setStep('select')}
                      className="flex-1 h-16 rounded-xl border-2 border-gray-200 text-xl font-bold text-gray-600 hover:bg-gray-50"
                    >
                      {t('back')}
                    </button>
                    <button 
                      onClick={handleSimulateVerify}
                      disabled={inputValue.length < 12 || loading}
                      className="flex-[2] h-16 rounded-xl bg-emerald-600 text-white text-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-colors"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
                      Verify
                    </button>
                  </div>
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
                <p className="text-xl text-gray-500">Redirecting securely...</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
