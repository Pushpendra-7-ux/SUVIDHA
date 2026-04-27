import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, FileImage, FileText, AlertTriangle } from 'lucide-react'

const MAX_FILES = 5
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

export default function FileUploader({ files, setFiles }) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')

  const addFiles = useCallback((incoming) => {
    setError('')
    const newFiles = [...incoming].filter(f => {
      if (!ALLOWED_TYPES.includes(f.type)) {
        setError(`${f.name}: File type not supported`)
        return false
      }
      if (f.size > MAX_SIZE) {
        setError(`${f.name}: File exceeds 10 MB limit`)
        return false
      }
      return true
    })

    if (files.length + newFiles.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} files allowed`)
      return
    }

    setFiles(prev => [...prev, ...newFiles])
  }, [files, setFiles])

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setError('')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    addFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => setDragActive(false)

  return (
    <div>
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        aria-label={`Upload files. ${files.length} of ${MAX_FILES} files added. Accepted: JPEG, PNG, WebP, PDF. Max 10 MB each.`}
        className={`touch-target relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
          ${dragActive
            ? 'border-accent-500 bg-accent-50/50'
            : 'border-gray-200 bg-gray-50/50 hover:border-primary-300 hover:bg-primary-50/30'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          onChange={(e) => addFiles(e.target.files)}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />

        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
          <Upload className="w-5 h-5 text-primary-600" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-primary-700">
          {dragActive ? 'Drop files here' : 'Tap to upload or drag & drop'}
        </p>
        <p className="text-xs text-gray-400">
          JPEG, PNG, WebP, PDF — Max 10 MB — Up to {MAX_FILES} files
        </p>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1 mt-2 text-xs text-danger"
            role="alert"
          >
            <AlertTriangle className="w-3 h-3" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Previews */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2" role="list" aria-label="Uploaded files">
          <AnimatePresence mode="popLayout">
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                layout
                className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-gray-100 shadow-sm"
                role="listitem"
              >
                {/* Thumbnail */}
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview of ${file.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText className="w-5 h-5 text-gray-400" aria-hidden="true" />
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-primary-800 truncate">{file.name}</p>
                  <p className="text-[10px] text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>

                {/* Remove */}
                <motion.button
                  type="button"
                  onClick={() => removeFile(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="touch-target w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-danger transition-colors"
                  aria-label={`Remove file ${file.name}`}
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
