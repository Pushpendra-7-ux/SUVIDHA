import React from 'react'
import { Delete } from 'lucide-react'

export default function NumPad({ value, onChange, maxLength = 12 }) {
  const handleKeyClick = (key) => {
    if (key === 'clear') {
      onChange('')
    } else if (key === 'back') {
      onChange(value.slice(0, -1))
    } else {
      if (value.length < maxLength) {
        onChange(value + key)
      }
    }
  }

  const keys = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'clear', '0', 'back'
  ]

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-sm mx-auto">
      {keys.map((key, idx) => {
        const isAction = key === 'clear' || key === 'back'
        return (
          <button
            key={idx}
            onClick={() => handleKeyClick(key)}
            className={`
              flex items-center justify-center p-6 text-2xl font-bold font-display rounded-2xl shadow-md transition-all active:scale-95
              ${isAction 
                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-100'}
            `}
          >
            {key === 'clear' ? (
              <span className="text-xl">Clear</span>
            ) : key === 'back' ? (
              <Delete className="w-8 h-8" strokeWidth={1.5} />
            ) : (
              key
            )}
          </button>
        )
      })}
    </div>
  )
}
