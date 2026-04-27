import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Copy, Home, ExternalLink, FileText } from 'lucide-react'

export default function SuccessScreen() {
  const { trackingId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState(30)

  const searchParams = new URLSearchParams(location.search)
  const isPayment = searchParams.get('type') === 'payment'
  const amount = searchParams.get('amount')
  const method = searchParams.get('method') || 'UPI'

  // Auto-redirect for kiosk (detects desktop resolution)
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            navigate('/')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [navigate])

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(trackingId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { }
  }

  return (
    <section
      className="flex-1 flex flex-col items-center justify-center h-[calc(100vh-5.5rem)] px-4 py-10 overflow-hidden"
      aria-label="Complaint submitted successfully"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="bg-white rounded-3xl p-8 sm:p-12 max-w-xl w-full text-center shadow-xl border-4 border-gray-50 flex flex-col items-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
          className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-success-50 flex items-center justify-center mb-6"
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          >
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-success-500" strokeWidth={2} aria-hidden="true" />
          </motion.div>
        </motion.div>

        {isPayment ? (
          <>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4">
              Payment Successful!
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Your payment of <span className="font-bold text-gray-800">₹{amount}</span> has been securely processed. Thank you for using the SUVIDHA 2026 kiosk.
            </p>

            <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-6 mb-8 w-full max-w-md text-left shadow-sm">
              <div className="flex justify-between py-3 border-b border-gray-200 bg-white px-4 rounded-t-xl">
                <span className="text-gray-500 font-medium">Transaction ID</span>
                <span className="font-bold text-gray-800 font-mono">{trackingId}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200 bg-white px-4">
                <span className="text-gray-500 font-medium">Amount Paid</span>
                <span className="font-bold text-green-600 text-lg">₹{amount}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200 bg-white px-4">
                <span className="text-gray-500 font-medium">Payment Method</span>
                <span className="font-bold text-gray-800">{method}</span>
              </div>
              <div className="flex justify-between py-3 bg-white px-4 rounded-b-xl">
                <span className="text-gray-500 font-medium">Date & Time</span>
                <span className="font-bold text-gray-800">{new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
            </div>
            <p className="mb-8 text-sm text-gray-500 font-medium">An SMS receipt has been sent to your registered mobile number.</p>
          </>
        ) : (
          <>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4">
              Complaint Submitted!
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Your grievance has been successfully registered. You will receive updates on your registered phone number.
            </p>

            {/* Tracking ID */}
            <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-6 mb-8 w-full max-w-md">
              <p className="text-sm text-gray-500 uppercase font-bold tracking-widest mb-2">
                Tracking Number
              </p>
              <div className="flex items-center justify-center gap-2">
                <span
                  className="font-mono text-xl sm:text-2xl font-bold text-primary-800 tracking-wider"
                  aria-label={`Tracking number: ${trackingId}`}
                >
                  {trackingId}
                </span>
                <motion.button
                  onClick={copyId}
                  whileTap={{ scale: 0.9 }}
                  className="touch-target p-2 rounded-lg hover:bg-primary-100 transition-colors"
                  aria-label={copied ? 'Tracking number copied' : 'Copy tracking number'}
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-success-500" aria-hidden="true" />
                  ) : (
                    <Copy className="w-4 h-4 text-primary-500" aria-hidden="true" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Status info */}
            <div className="space-y-4 mb-10 w-full max-w-md mx-auto text-left bg-white border-2 border-gray-50 rounded-2xl p-6 shadow-sm">
              {[
                { step: '1', text: 'Complaint received', done: true },
                { step: '2', text: 'Under review by Municipality', done: false },
                { step: '3', text: 'Resolution in progress', done: false },
                { step: '4', text: 'Issue resolved', done: false },
              ].map(s => (
                <div key={s.step} className="flex items-center gap-3" role="listitem">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${s.done
                      ? 'bg-success-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                    }`}>
                    {s.done ? '✓' : s.step}
                  </div>
                  <span className={`text-base font-medium ${s.done ? 'text-gray-800' : 'text-gray-400'}`}>
                    {s.text}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <motion.button
            onClick={() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="touch-target w-full flex-1 flex flex-col items-center justify-center bg-emerald-600 text-white font-bold text-xl py-5 rounded-2xl shadow-lg hover:bg-emerald-700 transition-colors mb-4 gap-2"
            aria-label="Print Thermal Receipt"
          >
            <FileText className="w-6 h-6" />
            Print Receipt
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="touch-target w-full flex-1 flex flex-col items-center justify-center bg-assam-blue text-white font-bold text-xl py-5 rounded-2xl shadow-lg hover:bg-blue-900 transition-colors mb-4 gap-2"
            aria-label="Return to home screen"
          >
            <Home className="w-6 h-6" />
            Return to Main Menu
          </motion.button>
        </div>

        {/* Auto-redirect (kiosk only) */}
        {window.innerWidth >= 1024 && countdown > 0 && (
          <p className="mt-4 text-xs text-gray-400" aria-live="polite">
            Returning to home in {countdown} seconds...
          </p>
        )}
      </motion.div>
    </section>
  )
}
