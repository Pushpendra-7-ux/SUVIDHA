import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

// All supported Indian languages
const LANGUAGES = [
  { code: 'en',  label: 'English',    native: 'English',        flag: '🇮🇳', script: 'Latin'    },
  { code: 'hi',  label: 'Hindi',      native: 'हिन्दी',           flag: '🇮🇳', script: 'Devanagari' },
  { code: 'as',  label: 'Assamese',   native: 'অসমীয়া',          flag: '🇮🇳', script: 'Assamese'  },
  { code: 'kn',  label: 'Kannada',    native: 'ಕನ್ನಡ',           flag: '🇮🇳', script: 'Kannada'   },
  { code: 'ta',  label: 'Tamil',      native: 'தமிழ்',            flag: '🇮🇳', script: 'Tamil'     },
  { code: 'te',  label: 'Telugu',     native: 'తెలుగు',           flag: '🇮🇳', script: 'Telugu'    },
  { code: 'ml',  label: 'Malayalam',  native: 'മലയാളം',           flag: '🇮🇳', script: 'Malayalam' },
  { code: 'mr',  label: 'Marathi',    native: 'मराठी',            flag: '🇮🇳', script: 'Devanagari' },
  { code: 'gu',  label: 'Gujarati',   native: 'ગુજરાતી',          flag: '🇮🇳', script: 'Gujarati'  },
  { code: 'pa',  label: 'Punjabi',    native: 'ਪੰਜਾਬੀ',           flag: '🇮🇳', script: 'Gurmukhi'  },
  { code: 'bn',  label: 'Bengali',    native: 'বাংলা',            flag: '🇮🇳', script: 'Bengali'   },
  { code: 'or',  label: 'Odia',       native: 'ଓଡ଼ିଆ',            flag: '🇮🇳', script: 'Odia'      },
  { code: 'ur',  label: 'Urdu',       native: 'اُردُو',            flag: '🇮🇳', script: 'Nastaliq'  },
  { code: 'sa',  label: 'Sanskrit',   native: 'संस्कृतम्',          flag: '🇮🇳', script: 'Devanagari' },
  { code: 'mni', label: 'Meitei',     native: 'মৈতৈলোন্',          flag: '🇮🇳', script: 'Meitei'    },
  { code: 'ks',  label: 'Kashmiri',   native: 'کٲشُر',             flag: '🇮🇳', script: 'Perso-Arabic' },
]

// Colour palette cycling for cards
const CARD_COLOURS = [
  'from-blue-700 to-blue-900',
  'from-rose-600 to-rose-800',
  'from-violet-600 to-violet-900',
  'from-teal-600 to-teal-800',
  'from-amber-500 to-orange-700',
  'from-indigo-600 to-indigo-900',
  'from-emerald-600 to-emerald-800',
  'from-pink-600 to-pink-800',
]

export default function MoreLanguages() {
  const navigate = useNavigate()
  const { setLang } = useLanguage()

  const handleSelect = (code) => {
    setLang(code)
    navigate('/home')
  }

  return (
    <div className="h-[calc(100vh-5.5rem)] bg-slate-50 flex flex-col overflow-hidden">

      {/* ── Header bar ── */}
      <div className="bg-assam-blue flex items-center justify-between px-8 py-4 shrink-0 shadow-lg">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
        >
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/60 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg">Back</span>
        </button>

        <div className="flex items-center gap-3">
          <Globe className="w-7 h-7 text-yellow-400" />
          <div>
            <h1 className="text-2xl font-display font-extrabold text-white leading-tight">
              Choose Your Language
            </h1>
            <p className="text-blue-200 text-sm font-medium">
              भाषा चुनें  •  ভাষা বাছনি  •  ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-blue-200 text-sm">भारत की भाषाएँ</span>
          <p className="text-white font-bold">{LANGUAGES.length} Languages</p>
        </div>
      </div>

      {/* ── Tricolor accent line ── */}
      <div className="h-1 w-full flex shrink-0">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-t border-b border-slate-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* ── Language Grid ── */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {LANGUAGES.map((lang, idx) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(lang.code)}
              className="group bg-white rounded-2xl p-5 shadow-sm border-2 border-slate-900 hover:bg-slate-50 hover:shadow-md flex flex-col items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-slate-400 transition-all min-h-[120px]"
            >
              <span className="text-3xl">{lang.flag}</span>
              <span className="text-2xl font-bold text-slate-900 font-display leading-tight text-center">
                {lang.native}
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest">
                {lang.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Footer notice */}
        <p className="text-center text-slate-400 text-sm mt-8 pb-4">
          If your language is not shown above, the portal defaults to English.
        </p>
      </div>
    </div>
  )
}
