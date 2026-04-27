import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

const serviceIcons = {
  electricity: '⚡',
  water: '💧',
  gas: '🔥',
  sanitation: '🗑️',
  municipal: '🏛️',
  smartcity: '📱'
}

const serviceColors = {
  electricity: 'from-yellow-400 to-yellow-600',
  water: 'from-blue-400 to-blue-600',
  gas: 'from-orange-400 to-orange-600',
  sanitation: 'from-emerald-400 to-emerald-600',
  municipal: 'from-purple-400 to-purple-600',
  smartcity: 'from-indigo-400 to-indigo-600'
}

// Mock data for complaints
const mockComplaints = {
  'CMP20260101001': {
    id: 'CMP20260101001',
    title: 'Power supply interruption',
    status: 'resolved',
    date: '2026-01-15',
    department: 'electricity',
    description: 'Continuous power cuts in the area'
  },
  'CMP20260120002': {
    id: 'CMP20260120002',
    title: 'Water supply issue',
    status: 'in-progress',
    date: '2026-01-20',
    department: 'water',
    description: 'Low water pressure in the morning'
  },
  'CMP20260210003': {
    id: 'CMP20260210003',
    title: 'Gas meter not working',
    status: 'pending',
    date: '2026-02-10',
    department: 'gas',
    description: 'Gas meter showing incorrect reading'
  },
}

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending', icon: Clock },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress', icon: Info },
    resolved: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Resolved', icon: CheckCircle }
  }
  
  const config = statusConfig[status] || statusConfig.pending
  const Icon = config.icon
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bg} ${config.text} text-sm font-semibold`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </div>
  )
}

export default function TrackStatus() {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [trackingId, setTrackingId] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [searchAttempted, setSearchAttempted] = useState(false)

  const handleSearch = () => {
    if (!trackingId.trim()) return
    
    setSearchAttempted(true)
    const complaint = mockComplaints[trackingId.toUpperCase()]
    setSearchResult(complaint || null)
  }

  return (
    <section className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-8 bg-gradient-to-b from-slate-50 to-slate-100" aria-label="Track Complaint Status">
      {/* Back Button */}
      <div className="w-full max-w-3xl mb-6">
        <motion.button
          onClick={() => navigate(`/service/${serviceId}`)}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 font-bold text-lg text-gray-700 hover:text-assam-blue px-6 py-3 rounded-xl shadow-md bg-white border border-gray-100 transition-colors"
          aria-label="Go back to service menu"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </motion.button>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-8 sm:p-12 max-w-3xl w-full shadow-2xl border-2 border-gray-50"
      >
        {/* Service Header */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br ${serviceColors[serviceId] || 'from-slate-400 to-slate-600'} text-white shadow-lg`}>
            <span className="text-5xl">{serviceIcons[serviceId] || '📋'}</span>
          </div>
        </div>

        <h2 className="text-center font-display text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">
          {t('trackStatus') || 'Track Complaint Status'}
        </h2>
        
        <p className="text-center text-xl text-assam-blue font-semibold mb-2">
          {t(serviceId) || serviceId}
        </p>

        <p className="text-center text-gray-600 text-lg mb-8 leading-relaxed px-4">
          Enter your complaint reference number to check the current status and updates.
        </p>

        {/* Search Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border-2 border-blue-200">
          <label htmlFor="tracking-id" className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
            Complaint Reference Number
          </label>
          <div className="flex gap-3">
            <input
              id="tracking-id"
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
              placeholder="e.g., CMP20260101001"
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-assam-blue focus:outline-none text-lg font-semibold"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              aria-label="Enter complaint reference number"
            />
            <motion.button
              onClick={handleSearch}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-assam-blue text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-900 transition-colors shadow-lg"
              aria-label="Search complaint"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">Search</span>
            </motion.button>
          </div>
        </div>

        {/* Search Results */}
        {searchAttempted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            {searchResult ? (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{searchResult.title}</h3>
                    <p className="text-gray-600">Reference: <strong>{searchResult.id}</strong></p>
                  </div>
                  <StatusBadge status={searchResult.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-emerald-300">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Filed Date</p>
                    <p className="text-lg text-gray-800">{new Date(searchResult.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Department</p>
                    <p className="text-lg text-gray-800 capitalize">{t(searchResult.department) || searchResult.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Days Pending</p>
                    <p className="text-lg text-gray-800">
                      {Math.floor((new Date() - new Date(searchResult.date)) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white rounded-xl border border-emerald-300">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Description</p>
                  <p className="text-gray-600">{searchResult.description}</p>
                </div>

                {/* Status Timeline */}
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Latest Updates</p>
                  <div className="space-y-2">
                    <div className="flex gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-600 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Complaint Received</p>
                        <p className="text-xs text-gray-500">{new Date(searchResult.date).toLocaleString()}</p>
                      </div>
                    </div>
                    {searchResult.status === 'in-progress' && (
                      <div className="flex gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Under Investigation</p>
                          <p className="text-xs text-gray-500">2 days ago</p>
                        </div>
                      </div>
                    )}
                    {searchResult.status === 'resolved' && (
                      <>
                        <div className="flex gap-3">
                          <div className="w-3 h-3 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Under Investigation</p>
                            <p className="text-xs text-gray-500">3 days ago</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-3 h-3 rounded-full bg-emerald-600 mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Issue Resolved</p>
                            <p className="text-xs text-gray-500">1 day ago</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-start gap-3">
                <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-red-800 mb-1">No Results Found</h3>
                  <p className="text-red-700">
                    We couldn't find a complaint with the reference number "<strong>{trackingId}</strong>". 
                    Please check and try again.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Sample Reference Numbers */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Sample Reference Numbers to Try</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {Object.keys(mockComplaints).map((id) => (
              <motion.button
                key={id}
                onClick={() => {
                  setTrackingId(id)
                  setSearchAttempted(true)
                  const complaint = mockComplaints[id]
                  setSearchResult(complaint)
                }}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-white border-2 border-blue-300 rounded-lg text-sm font-mono font-bold text-assam-blue hover:bg-blue-100 transition-colors"
              >
                {id}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
