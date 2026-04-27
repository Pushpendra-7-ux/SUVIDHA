import { useCallback } from 'react'
import { useAccessibilityContext } from '../context/AccessibilityContext'

/**
 * Hook to wrap button/interactive handlers with screen reader announcements
 * Usage: const handleClick = useAccessibleClick(() => navigate('/home'), 'Home button activated')
 */
export const useAccessibleClick = (callback, announcement) => {
  const { announceClick } = useAccessibilityContext()

  return useCallback((...args) => {
    if (announcement) {
      announceClick(announcement)
    }
    if (callback) {
      callback(...args)
    }
  }, [callback, announcement, announceClick])
}

/**
 * Hook for form field focus announcements
 * Usage: const handleFocus = useAccessibleFocus('Email field')
 */
export const useAccessibleFocus = (fieldLabel) => {
  const { announce } = useAccessibilityContext()

  return useCallback(() => {
    announce(`${fieldLabel}, input field`)
  }, [fieldLabel, announce])
}

/**
 * Hook to announce errors and validation messages
 * Usage: useAccessibleError('Email is invalid', isError)
 */
export const useAccessibleError = (message, isActive) => {
  const { announce } = useAccessibilityContext()

  return useCallback(() => {
    if (isActive && message) {
      announce(`Error: ${message}`, 'high')
    }
  }, [message, isActive, announce])
}
