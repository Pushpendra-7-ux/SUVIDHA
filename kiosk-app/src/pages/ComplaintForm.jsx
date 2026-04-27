import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MapPin, User, Phone, Mail, MessageSquare, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import FileUploader from '../components/FileUploader'

export default function ComplaintForm() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const category = sessionId?.split('-')[0] || 'general'

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    description: '',
    location: '',
  })
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [gpsLoading, setGpsLoading] = useState(false)
  const formRef = useRef(null)

  const categoryLabels = {
    road: 'Road & Infrastructure',
    water: 'Water Supply',
    electricity: 'Street Lighting',
    sanitation: 'Sanitation & Waste',
    safety: 'Public Safety',
    noise: 'Noise Pollution',
    parks: 'Parks & Green Spaces',
    other: 'Other Issues',
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const detectLocation = () => {
    if (!navigator.geolocation) return
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(prev => ({
          ...prev,
          location: `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`
        }))
        setGpsLoading(false)
      },
      () => {
        setGpsLoading(false)
      }
    )
  }

  const validate = () => {
    const err = {}
    if (!form.name.trim()) err.name = 'Name is required'
    if (!form.phone.trim()) err.phone = 'Phone number is required'
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) err.phone = 'Enter a valid 10-digit phone number'
    if (!form.description.trim()) err.description = 'Please describe the issue'
    else if (form.description.trim().length < 20) err.description = 'Provide at least 20 characters'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Enter a valid email'
    return err
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // Focus first error field
      const firstErrField = Object.keys(validationErrors)[0]
      formRef.current?.querySelector(`[name="${firstErrField}"]`)?.focus()
      return
    }

    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    const trackingId = `UE-${Date.now().toString(36).toUpperCase()}`
    navigate(`/success/${trackingId}`)
  }

  return (
    <section
      className="flex-1 flex flex-col items-center min-h-screen px-4 py-6 sm:py-10 bg-surface"
      aria-label="File a complaint"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-accent-500" aria-hidden="true" />
            {categoryLabels[category] || category}
          </div>
          <h2 className="font-display text-2xl font-bold text-primary-800">
            Report an Issue
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below to submit your complaint
          </p>
        </div>

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-5 sm:p-7 space-y-5 shadow-lg"
          noValidate
          aria-label="Complaint submission form"
        >
          {/* Name */}
          <FieldGroup
            id="name"
            label="Full Name"
            icon={User}
            required
            error={errors.name}
          >
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className="form-input"
            />
          </FieldGroup>

          {/* Phone */}
          <FieldGroup
            id="phone"
            label="Phone Number"
            icon={Phone}
            required
            error={errors.phone}
          >
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              required
              maxLength={10}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              className="form-input"
            />
          </FieldGroup>

          {/* Email (optional) */}
          <FieldGroup
            id="email"
            label="Email (Optional)"
            icon={Mail}
            error={errors.email}
          >
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className="form-input"
            />
          </FieldGroup>

          {/* Location */}
          <FieldGroup
            id="location"
            label="Location"
            icon={MapPin}
          >
            <div className="flex gap-2">
              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                placeholder="Auto-detect or enter manually"
                className="form-input flex-1"
              />
              <motion.button
                type="button"
                onClick={detectLocation}
                whileTap={{ scale: 0.95 }}
                disabled={gpsLoading}
                className="touch-target px-3 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 text-xs font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
                aria-label="Detect my location using GPS"
              >
                {gpsLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">Detect</span>
              </motion.button>
            </div>
          </FieldGroup>

          {/* Description */}
          <FieldGroup
            id="description"
            label="Describe the Issue"
            icon={MessageSquare}
            required
            error={errors.description}
          >
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the problem you observed..."
              required
              rows={4}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : undefined}
              className="form-input resize-none"
            />
          </FieldGroup>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-primary-800 mb-2">
              Upload Evidence (Photos / Documents)
            </label>
            <FileUploader files={files} setFiles={setFiles} />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="touch-target w-full flex items-center justify-center gap-2 bg-saffron-gradient text-white font-semibold text-base py-3.5 rounded-xl shadow-md shadow-accent-500/20 hover:shadow-lg hover:shadow-accent-500/30 transition-shadow disabled:opacity-70 disabled:cursor-not-allowed focus-visible:ring-4 focus-visible:ring-accent-300 focus-visible:ring-offset-2"
            aria-label={loading ? 'Submitting your complaint...' : 'Submit complaint'}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" aria-hidden="true" />
                <span>Submit Complaint</span>
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-4 text-xs text-gray-400 text-center">
          Your information is secured and used only for complaint resolution
        </p>
      </motion.div>
    </section>
  )
}

/* ── Field Group Component ───────────────────────── */
function FieldGroup({ id, label, icon: Icon, required, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-semibold text-primary-800 mb-1.5">
        <Icon className="w-4 h-4 text-primary-400" aria-hidden="true" />
        {label}
        {required && <span className="text-danger text-xs" aria-hidden="true">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1 mt-1 text-xs text-danger"
            role="alert"
          >
            <AlertCircle className="w-3 h-3" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
