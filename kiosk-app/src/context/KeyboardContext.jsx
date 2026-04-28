import { createContext, useContext, useState, useCallback, useRef } from 'react'

const KeyboardContext = createContext()

export function KeyboardProvider({ children }) {
  const [isOpen, setIsOpen]       = useState(false)
  const [value, setValue]         = useState('')
  const [maxLength, setMaxLength] = useState(999)
  const commitRef = useRef(null) // called on each keystroke with the new value

  /** Open the keyboard, pre-seeded with current field value */
  const openKeyboard = useCallback(({ currentValue = '', max = 999, onCommit }) => {
    setValue(currentValue)
    setMaxLength(max)
    commitRef.current = onCommit
    setIsOpen(true)
  }, [])

  /** Called by the keyboard component on every key press */
  const handleInput = useCallback((newValue) => {
    setValue(newValue)
    commitRef.current?.(newValue)
  }, [])

  const closeKeyboard = useCallback(() => {
    setIsOpen(false)
    commitRef.current = null
  }, [])

  return (
    <KeyboardContext.Provider value={{ isOpen, openKeyboard, closeKeyboard, handleInput, value, maxLength }}>
      {children}
    </KeyboardContext.Provider>
  )
}

export function useKeyboard() {
  const ctx = useContext(KeyboardContext)
  if (!ctx) throw new Error('useKeyboard must be used within KeyboardProvider')
  return ctx
}
