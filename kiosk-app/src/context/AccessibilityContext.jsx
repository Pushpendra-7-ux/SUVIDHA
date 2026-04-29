import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useScreenReader } from '../hooks/useScreenReader'

// ── Modes ──────────────────────────────────────────────────────────────────
// 'light'        → default, no extra classes
// 'dark'         → adds .dark to <html>
// 'high-contrast'→ adds .dark + .hc to <html>  (dark base + extreme contrast)

const MODES = ['light', 'dark', 'high-contrast']

function applyMode(mode) {
  const html = document.documentElement
  html.classList.remove('dark', 'hc')
  if (mode === 'dark') {
    html.classList.add('dark')
  } else if (mode === 'high-contrast') {
    html.classList.add('dark', 'hc')
  }
  // store on <html> as data attr for CSS selectors
  html.setAttribute('data-theme', mode)
}

const AccessibilityContext = createContext()

export function AccessibilityProvider({ children }) {
  // ── Display Mode ──────────────────────────────────────────────────────
  const [displayMode, setDisplayModeState] = useState(() => {
    const saved = localStorage.getItem('kiosk-display-mode')
    // migrate old 'kiosk-theme' setting
    if (!saved) {
      const legacy = localStorage.getItem('kiosk-theme')
      return legacy === 'dark' ? 'dark' : 'light'
    }
    return MODES.includes(saved) ? saved : 'light'
  })

  useEffect(() => {
    applyMode(displayMode)
    localStorage.setItem('kiosk-display-mode', displayMode)
  }, [displayMode])

  const setDisplayMode = useCallback((mode) => {
    if (MODES.includes(mode)) setDisplayModeState(mode)
  }, [])

  const cycleDisplayMode = useCallback(() => {
    setDisplayModeState(prev => {
      const idx = MODES.indexOf(prev)
      return MODES[(idx + 1) % MODES.length]
    })
  }, [])

  const isDark = displayMode === 'dark' || displayMode === 'high-contrast'
  const isHighContrast = displayMode === 'high-contrast'

  // ── Screen Reader ─────────────────────────────────────────────────────
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(() => {
    return localStorage.getItem('kiosk-screen-reader') === 'on'
  })

  const { announce, announceClick, announcePage, readEntirePage } = useScreenReader(screenReaderEnabled)

  useEffect(() => {
    localStorage.setItem('kiosk-screen-reader', screenReaderEnabled ? 'on' : 'off')
  }, [screenReaderEnabled])

  const toggleScreenReader = useCallback(() => {
    setScreenReaderEnabled(prev => !prev)
  }, [])

  // ── Context Value ─────────────────────────────────────────────────────
  const value = {
    // modes
    displayMode,
    setDisplayMode,
    cycleDisplayMode,
    isDark,
    isHighContrast,
    // screen reader
    screenReaderEnabled,
    toggleScreenReader,
    announce,
    announceClick,
    announcePage,
    readEntirePage,
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
