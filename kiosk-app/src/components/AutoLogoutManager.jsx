import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import IdleOverlay from './IdleOverlay'

const IDLE_TIMEOUT = 60000 // 60 seconds of inactivity triggers warning
const LOGOUT_COUNTDOWN = 10 // 10 seconds to respond before logout

export default function AutoLogoutManager({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isIdle, setIsIdle] = useState(false)
  const [countdown, setCountdown] = useState(LOGOUT_COUNTDOWN)
  
  const idleTimer = useRef(null)
  const countdownTimer = useRef(null)

  const resetIdle = () => {
    setIsIdle(false)
    setCountdown(LOGOUT_COUNTDOWN)
    
    clearTimeout(idleTimer.current)
    clearInterval(countdownTimer.current)
    
    // Don't trigger idle logic if we are already on the start screen
    if (location.pathname === '/') return

    idleTimer.current = setTimeout(() => {
      setIsIdle(true)
    }, IDLE_TIMEOUT)
  }

  useEffect(() => {
    resetIdle()
    const events = ['touchstart', 'mousedown', 'mousemove', 'keydown']
    events.forEach(e => window.addEventListener(e, resetIdle))
    
    return () => {
      clearTimeout(idleTimer.current)
      clearInterval(countdownTimer.current)
      events.forEach(e => window.removeEventListener(e, resetIdle))
    }
  }, [location.pathname, user])

  // Handle countdown when idle
  useEffect(() => {
    if (isIdle) {
      countdownTimer.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Time's up!
            clearInterval(countdownTimer.current)
            setIsIdle(false)
            if (user) {
              logout()
            }
            navigate('/', { replace: true })
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(countdownTimer.current)
  }, [isIdle, user, logout, navigate])

  return (
    <>
      {children}
      {isIdle && (
        <IdleOverlay 
          onDismiss={resetIdle} 
          countdown={countdown} 
          isLoggedIn={!!user}
        />
      )}
    </>
  )
}
