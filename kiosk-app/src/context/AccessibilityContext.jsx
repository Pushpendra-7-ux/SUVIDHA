import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useScreenReader } from '../hooks/useScreenReader'

const AccessibilityContext = createContext()

export function AccessibilityProvider({ children }) {
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(() => {
    return localStorage.getItem('kiosk-screen-reader') === 'on'
  })

  const { announce, announceClick, announcePage } = useScreenReader(screenReaderEnabled)

  // Persist preference
  useEffect(() => {
    localStorage.setItem('kiosk-screen-reader', screenReaderEnabled ? 'on' : 'off')
  }, [screenReaderEnabled])

  const toggleScreenReader = useCallback(() => {
    setScreenReaderEnabled(prev => !prev)
  }, [])

  const value = {
    screenReaderEnabled,
    toggleScreenReader,
    announce,
    announceClick,
    announcePage,
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibilityContext() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibilityContext must be used within AccessibilityProvider')
  }
  return context
}

