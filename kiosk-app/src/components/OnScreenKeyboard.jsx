import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Delete, ChevronUp, X, GripHorizontal } from 'lucide-react'
import { useKeyboard } from '../context/KeyboardContext'

const ROWS = [
  ['1','2','3','4','5','6','7','8','9','0','{back}'],
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l','{enter}'],
  ['{shift}','z','x','c','v','b','n','m',',','.','{back}'],
  ['{space}'],
]

const SHIFT_MAP = {
  '1':'!','2':'@','3':'#','4':'$','5':'%','6':'^','7':'&','8':'*','9':'(','0':')',
  ',':'<','.':'>',
  'q':'Q','w':'W','e':'E','r':'R','t':'T','y':'Y','u':'U','i':'I','o':'O','p':'P',
  'a':'A','s':'S','d':'D','f':'F','g':'G','h':'H','j':'J','k':'K','l':'L',
  'z':'Z','x':'X','c':'C','v':'V','b':'B','n':'N','m':'M',
}

/** Fire a native input event so React's synthetic onChange picks it up */
function nativeInput(el, newVal) {
  const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
    || Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set
  if (nativeSetter) nativeSetter.call(el, newVal)
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))
}

export default function OnScreenKeyboard() {
  const { isOpen, closeKeyboard } = useKeyboard()
  const [shifted, setShifted] = useState(false)

  const press = useCallback((key) => {
    // Shift is a UI-only toggle — always handle it first regardless of focus
    if (key === '{shift}') {
      setShifted(s => !s)
      return
    }

    const active = document.activeElement
    // Accept both editable and readOnly inputs (NumPad-style fields are readOnly)
    const isInput = active &&
      (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA') &&
      active.type !== 'submit' && active.type !== 'button' && active.type !== 'checkbox'

    if (!isInput) return

    const val = active.value
    const start = active.selectionStart ?? val.length
    const end = active.selectionEnd ?? val.length

    if (key === '{back}') {
      if (start === end && start > 0) {
        const next = val.slice(0, start - 1) + val.slice(end)
        nativeInput(active, next)
        requestAnimationFrame(() => active.setSelectionRange?.(start - 1, start - 1))
      } else if (start !== end) {
        const next = val.slice(0, start) + val.slice(end)
        nativeInput(active, next)
        requestAnimationFrame(() => active.setSelectionRange?.(start, start))
      }
    } else if (key === '{space}') {
      const max = active.maxLength > 0 ? active.maxLength : Infinity
      if (val.length >= max) return
      const next = val.slice(0, start) + ' ' + val.slice(end)
      nativeInput(active, next)
      requestAnimationFrame(() => active.setSelectionRange?.(start + 1, start + 1))
    } else if (key === '{enter}') {
      if (active.tagName === 'TEXTAREA') {
        const next = val.slice(0, start) + '\n' + val.slice(end)
        nativeInput(active, next)
        requestAnimationFrame(() => active.setSelectionRange?.(start + 1, start + 1))
      } else {
        active.form?.requestSubmit?.()
      }
    } else {
      const max = active.maxLength > 0 ? active.maxLength : Infinity
      if (val.length >= max && start === end) return
      const ch = shifted ? (SHIFT_MAP[key] ?? key.toUpperCase()) : key
      const next = val.slice(0, start) + ch + val.slice(end)
      nativeInput(active, next)
      requestAnimationFrame(() => active.setSelectionRange?.(start + 1, start + 1))
      if (shifted) setShifted(false)
    }
  }, [shifted])

  const renderKey = (key, idx) => {
    if (key === '{back}') return (
      <button key={idx}
        onPointerDown={e => { e.preventDefault(); press(key) }}
        className="flex-1 min-w-[44px] h-12 flex items-center justify-center bg-slate-200 hover:bg-slate-300 active:bg-slate-400 rounded-lg text-slate-700 transition-colors touch-none select-none text-base"
        aria-label="Backspace"
      >
        <Delete className="w-4 h-4" strokeWidth={2} />
      </button>
    )
    if (key === '{enter}') return (
      <button key={idx}
        onPointerDown={e => { e.preventDefault(); press(key) }}
        className="flex-1 min-w-[60px] h-12 flex items-center justify-center bg-assam-blue hover:bg-blue-900 active:bg-blue-950 text-white rounded-lg font-bold text-base transition-colors touch-none select-none"
        aria-label="Enter"
      >
        ↵
      </button>
    )
    if (key === '{shift}') return (
      <button key={idx}
        onPointerDown={e => { e.preventDefault(); press(key) }}
        className={`flex-1 min-w-[44px] h-12 flex items-center justify-center rounded-lg font-bold transition-colors touch-none select-none
          ${shifted ? 'bg-assam-blue text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
        aria-label="Shift" aria-pressed={shifted}
      >
        <ChevronUp className="w-4 h-4" />
      </button>
    )
    if (key === '{space}') return (
      <button key={idx}
        onPointerDown={e => { e.preventDefault(); press(key) }}
        className="flex-1 max-w-[240px] h-12 flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-slate-500 text-sm font-semibold transition-colors touch-none select-none"
        aria-label="Space"
      >
        SPACE
      </button>
    )
    const display = shifted ? (SHIFT_MAP[key] ?? key.toUpperCase()) : key
    return (
      <button key={idx}
        onPointerDown={e => { e.preventDefault(); press(key) }}
        className="flex-1 min-w-[34px] h-12 flex items-center justify-center bg-white hover:bg-slate-50 active:bg-slate-200 border border-slate-200 rounded-lg text-slate-900 font-bold text-lg font-display transition-colors touch-none select-none"
        aria-label={display}
      >
        {display}
      </button>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="kbd"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          drag
          dragMomentum={false}
          dragElastic={0}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[820px] max-w-[96vw] bg-white/95 backdrop-blur-none border border-slate-200 rounded-2xl shadow-2xl select-none"
          style={{ touchAction: 'none' }}
        >
          {/* Drag Handle + Close */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-2 text-slate-400">
              <GripHorizontal className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">On-Screen Keyboard</span>
            </div>
            <button
              onPointerDown={e => { e.preventDefault(); closeKeyboard() }}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-rose-500 transition-colors"
              aria-label="Close keyboard"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Key rows */}
          <div className="flex flex-col gap-2 px-3 py-3">
            {ROWS.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-1.5">
                {row.map((key, kIdx) => renderKey(key, kIdx))}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
