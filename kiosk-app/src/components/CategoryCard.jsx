import { motion } from 'framer-motion'

export default function CategoryCard({ category, index, onSelect }) {
  const { id, label, icon: Icon, color } = category

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.96 }}
      onClick={onSelect}
      role="option"
      aria-label={`Report ${label}`}
      className="touch-target group glass rounded-2xl p-5 sm:p-6 flex flex-col items-center gap-3 cursor-pointer hover:shadow-lg hover:shadow-primary-800/10 transition-shadow focus-visible:ring-4 focus-visible:ring-accent-300 focus-visible:ring-offset-2"
    >
      {/* Icon circle */}
      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={1.8} aria-hidden="true" />
      </div>

      {/* Label */}
      <span className="text-xs sm:text-sm font-semibold text-primary-800 text-center leading-tight">
        {label}
      </span>
    </motion.button>
  )
}
