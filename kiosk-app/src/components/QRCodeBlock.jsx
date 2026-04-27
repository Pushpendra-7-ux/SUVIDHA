import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'

export default function QRCodeBlock({ value, category }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
      className="inline-block"
      role="img"
      aria-label={`QR code for ${category} complaint. URL: ${value}`}
    >
      {/* Border frame */}
      <div className="relative p-4 bg-white rounded-2xl shadow-lg border-2 border-primary-100">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-accent-500 rounded-tl-xl" aria-hidden="true" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-accent-500 rounded-tr-xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-success-500 rounded-bl-xl" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-success-500 rounded-br-xl" aria-hidden="true" />

        <QRCodeSVG
          value={value}
          size={220}
          level="H"
          bgColor="#FFFFFF"
          fgColor="#0C2340"
          includeMargin={false}
        />
      </div>
    </motion.div>
  )
}
