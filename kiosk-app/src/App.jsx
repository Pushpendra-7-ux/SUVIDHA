import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { WifiOff } from 'lucide-react'
import { AccessibilityProvider } from './context/AccessibilityContext'
import { AuthProvider } from './context/AuthContext'
import AutoLogoutManager from './components/AutoLogoutManager'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import LanguageSelect from './pages/LanguageSelect'
import MainMenu from './pages/MainMenu'
import ServiceScreen from './pages/ServiceScreen'
import LodgeComplaint from './pages/LodgeComplaint'
import TrackStatus from './pages/TrackStatus'
import QRDisplay from './pages/QRDisplay'
import CategorySelect from './pages/CategorySelect'
import ComplaintForm from './pages/ComplaintForm'
import ComplaintReview from './pages/ComplaintReview'
import SuccessScreen from './pages/SuccessScreen'
import PayBillFlow from './pages/PayBillFlow'
import NewConnectionFlow from './pages/NewConnectionFlow'
import Header from './components/Header'
import AccessibilityBar from './components/AccessibilityBar'
import RouteAnnouncer from './components/RouteAnnouncer'

function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="bg-red-600 text-white font-bold py-2 px-4 flex items-center justify-center gap-2 z-[60] relative">
      <WifiOff className="w-5 h-5" />
      <span>System Offline. Data will sync automatically when network is restored.</span>
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <BrowserRouter>
          <AuthProvider>
        {/* Skip-to-content for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <AutoLogoutManager>
          <div className="h-screen flex flex-col overflow-hidden">
            <OfflineBanner />
            <AccessibilityBar />
          <Header />
          <RouteAnnouncer />
          <main id="main-content" role="main" className="flex-1 overflow-hidden">
            <Routes>
              {/* Kiosk terminal screens */}
              <Route path="/" element={<LanguageSelect />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/home" element={<ProtectedRoute><MainMenu /></ProtectedRoute>} />
              <Route path="/categories" element={<ProtectedRoute><CategorySelect /></ProtectedRoute>} />
              <Route path="/service/:serviceId" element={<ProtectedRoute><ServiceScreen /></ProtectedRoute>} />
              <Route path="/service/:serviceId/pay" element={<ProtectedRoute><PayBillFlow /></ProtectedRoute>} />
              <Route path="/service/:serviceId/new" element={<ProtectedRoute><NewConnectionFlow /></ProtectedRoute>} />
              <Route path="/service/:serviceId/complaint" element={<ProtectedRoute><LodgeComplaint /></ProtectedRoute>} />
              <Route path="/service/:serviceId/trackStatus" element={<ProtectedRoute><TrackStatus /></ProtectedRoute>} />
              <Route path="/qr/:sessionId" element={<ProtectedRoute><QRDisplay /></ProtectedRoute>} />
              <Route path="/review/:sessionId" element={<ProtectedRoute><ComplaintReview /></ProtectedRoute>} />

              {/* Mobile screens (after QR scan) */}
              <Route path="/report/:sessionId" element={<ComplaintForm />} />
              <Route path="/success/:trackingId" element={<SuccessScreen />} />
            </Routes>
          </main>
        </div>
        </AutoLogoutManager>
          </AuthProvider>
        </BrowserRouter>
      </AccessibilityProvider>
    </LanguageProvider>
  )
}

export default App
