import { useCallback } from 'react'
import { useKeyboard } from '../context/KeyboardContext'

/**
 * useKioskInput — wraps a state value/setter so that tapping the input
 * opens the on-screen keyboard pre-loaded with the current value.
 *
 * Usage:
 *   const [name, setName] = useState('')
 *   const inputProps = useKioskInput(name, setName, { maxLength: 60, placeholder: 'Enter name' })
 *   return <input {...inputProps} className="..." />
 */
export function useKioskInput(value, onChange, { maxLength = 999, placeholder = '' } = {}) {
  const { openKeyboard } = useKeyboard()

  const handleFocus = useCallback((e) => {
    e.target.blur() // prevent native keyboard on mobile/touch
    openKeyboard({
      currentValue: value,
      max: maxLength,
      onCommit: (v) => onChange(v),
    })
  }, [value, maxLength, onChange, openKeyboard])

  return {
    value,
    readOnly: true,
    placeholder,
    onFocus: handleFocus,
    onClick: handleFocus,
    style: { cursor: 'pointer' },
  }
}
