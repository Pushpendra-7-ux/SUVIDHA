import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, FileText, Settings, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // If accessed directly without auth, user might be null momentarily before redirect, handle gracefully
  if (!user) return null

  const mockComplaints = [
    { id: 'CMP-2026-892', type: 'Electricity Issue', status: 'In Progress', date: 'Oct 12, 2026' },
    { id: 'CMP-2026-845', type: 'Water Leakage', status: 'Resolved', date: 'Sep 28, 2026' }
  ]

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-5.5rem)] bg-surface overflow-hidden p-6 md:p-8">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/home')}
          className="p-3 rounded-2xl bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-gray-200"
        >
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-3xl font-display font-bold text-gray-800">My Profile</h1>
        <div className="w-14" /> {/* Spacer for centering */}
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8 overflow-y-auto pb-8">
        
        {/* Left Column: User Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1 flex flex-col gap-6"
        >
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-assam-blue to-blue-800 rounded-full flex items-center justify-center text-white mb-6 shadow-md border-4 border-blue-50">
              <User size={56} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Citizen</h2>
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full font-medium text-sm mb-6">
              <Shield size={16} />
              <span>Verified via {user.method === 'aadhaar' ? 'Aadhaar' : 'Mobile'}</span>
            </div>
            
            <div className="w-full space-y-4 text-left border-t border-gray-100 pt-6">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Account ID</p>
                <p className="font-mono text-gray-800 font-medium bg-gray-50 p-2 rounded-lg">{user.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Status</p>
                <p className="text-gray-800 font-medium bg-gray-50 p-2 rounded-lg">Active</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 border border-red-100 p-5 rounded-2xl font-bold text-lg hover:bg-red-100 hover:text-red-700 transition-colors focus:outline-none focus:ring-4 focus:ring-red-200"
          >
            <LogOut size={24} />
            Logout from Kiosk
          </button>
        </motion.div>

        {/* Right Column: Activity & History */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 flex flex-col gap-6"
        >
          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Settings className="text-assam-blue" />
              Quick Settings
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-assam-blue hover:bg-blue-50 transition-colors group">
                <FileText className="w-8 h-8 text-gray-400 group-hover:text-assam-blue mb-3" />
                <span className="font-bold text-gray-700 group-hover:text-assam-blue">My Documents</span>
              </button>
              <button 
                onClick={() => navigate('/service/municipal/pay')}
                className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-assam-blue hover:bg-blue-50 transition-colors group"
              >
                <span className="text-3xl mb-3">💳</span>
                <span className="font-bold text-gray-700 group-hover:text-assam-blue">Pending Bills</span>
              </button>
            </div>
          </div>

          {/* Recent History */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FileText className="text-assam-blue" />
              Recent Service Requests
            </h3>
            
            <div className="space-y-4">
              {mockComplaints.map((complaint) => (
                <div key={complaint.id} className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl hover:border-gray-300 transition-colors bg-gray-50/50">
                  <div>
                    <h4 className="font-bold text-gray-800">{complaint.type}</h4>
                    <p className="text-sm text-gray-500 font-mono mt-1">{complaint.id}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-1 ${
                      complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {complaint.status}
                    </span>
                    <p className="text-xs text-gray-400 font-medium block">{complaint.date}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-4 text-assam-blue font-bold hover:bg-blue-50 rounded-xl transition-colors">
              View All History
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  )
}
