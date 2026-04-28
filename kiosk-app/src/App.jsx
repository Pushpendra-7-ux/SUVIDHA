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
import MoreLanguages from './pages/MoreLanguages'
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
import GenericServiceFlow from './pages/GenericServiceFlow'
import LoadExtensionFlow from './pages/LoadExtensionFlow'
import MeterReplacementFlow from './pages/MeterReplacementFlow'
import GasMeterServicesFlow from './pages/GasMeterServicesFlow'
import PropertyTaxFlow from './pages/PropertyTaxFlow'
import Header from './components/Header'
import AccessibilityBar from './components/AccessibilityBar'
import RouteAnnouncer from './components/RouteAnnouncer'
import OnScreenKeyboard from './components/OnScreenKeyboard'
import { KeyboardProvider } from './context/KeyboardContext'

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
        <KeyboardProvider>
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
          {/* Global On-Screen Keyboard — renders as fixed overlay */}
          <OnScreenKeyboard />
          <main id="main-content" role="main" className="flex-1 overflow-hidden">
            <Routes>
              {/* Kiosk terminal screens */}
              <Route path="/" element={<LanguageSelect />} />
              <Route path="/more-languages" element={<MoreLanguages />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/home" element={<ProtectedRoute><MainMenu /></ProtectedRoute>} />
              <Route path="/categories" element={<ProtectedRoute><CategorySelect /></ProtectedRoute>} />
              <Route path="/service/:serviceId" element={<ProtectedRoute><ServiceScreen /></ProtectedRoute>} />
              <Route path="/service/:serviceId/pay" element={<ProtectedRoute><PayBillFlow /></ProtectedRoute>} />
              <Route path="/service/:serviceId/new" element={<ProtectedRoute><NewConnectionFlow /></ProtectedRoute>} />
              <Route path="/service/:serviceId/complaint" element={<ProtectedRoute><LodgeComplaint /></ProtectedRoute>} />
              <Route path="/service/:serviceId/trackStatus" element={<ProtectedRoute><TrackStatus /></ProtectedRoute>} />
              
              {/* Custom Realistic Flows */}
              <Route path="/service/electricity/loadExtension" element={<ProtectedRoute><LoadExtensionFlow /></ProtectedRoute>} />
              <Route path="/service/electricity/meterReplacement" element={<ProtectedRoute><MeterReplacementFlow /></ProtectedRoute>} />
              <Route path="/service/gas/meterServices" element={<ProtectedRoute><GasMeterServicesFlow /></ProtectedRoute>} />
              <Route path="/service/municipal/propertyTax" element={<ProtectedRoute><PropertyTaxFlow /></ProtectedRoute>} />
              
              {/* Fallback route for other service actions like loadExtension, meterReplacement, etc. */}
              <Route path="/service/:serviceId/:actionId" element={<ProtectedRoute><GenericServiceFlow /></ProtectedRoute>} />
              
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
        </KeyboardProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  )
}

export default App

