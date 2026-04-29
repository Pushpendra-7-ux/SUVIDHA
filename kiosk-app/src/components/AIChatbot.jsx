import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Mic, Send, MicOff, Bot } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am the Suvidha AI Assistant. How can I help you today?' }
  ])
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)
  const synthRef = useRef(window.speechSynthesis)
  
  const navigate = useNavigate()
  const location = useLocation()

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-IN'

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        handleSend(transcript)
        setIsListening(false)
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }
  }, [])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      // Cancel any ongoing AI speech before listening
      synthRef.current?.cancel()
      try {
        recognitionRef.current?.start()
      } catch (e) {
        console.error("Recognition start failed", e)
      }
    }
  }

  const speak = useCallback((text) => {
    synthRef.current?.cancel()
    if (!text) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.05
    utterance.pitch = 1.05
    synthRef.current?.speak(utterance)
  }, [])

  const processIntent = (text) => {
    const lower = text.toLowerCase()
    
    // Simulate AI Intent Parsing
    if (lower.includes('electricity') || lower.includes('power') || lower.includes('light')) {
      return {
        reply: "I can help you with Electricity services like paying your bill, requesting a new connection, or reporting an issue. I'll take you there now.",
        action: () => navigate('/service/electricity')
      }
    }
    
    if (lower.includes('gas') || lower.includes('lpg') || lower.includes('cylinder')) {
      return {
        reply: "I can help you with Gas services such as booking a cylinder or applying for a new connection. Redirecting you to the Gas department.",
        action: () => navigate('/service/gas')
      }
    }
    
    if (lower.includes('water') || lower.includes('municipal') || lower.includes('tax') || lower.includes('garbage')) {
      return {
        reply: "I can help you with Municipal services including property tax and water connections. Let's go to the Municipal section.",
        action: () => navigate('/service/municipal')
      }
    }
    
    if (lower.includes('home') || lower.includes('menu') || lower.includes('back')) {
      return {
        reply: "Taking you back to the main menu.",
        action: () => navigate('/home')
      }
    }
    
    if (lower.includes('login') || lower.includes('sign in')) {
      return {
        reply: "Let's get you logged in. Please verify your identity using OTP or Aadhaar.",
        action: () => navigate('/login')
      }
    }

    if (lower.includes('complaint') || lower.includes('issue') || lower.includes('problem')) {
      return {
        reply: "I'm sorry to hear you're facing an issue. You can register a complaint by scanning the QR code on the home screen with your mobile device.",
        action: () => navigate('/home')
      }
    }

    return {
      reply: "I'm your virtual assistant for Suvidha 2026. You can ask me to pay a bill, navigate to a department like Electricity or Gas, or help you with Municipal taxes. How may I assist you?",
      action: null
    }
  }

  const handleSend = (text = inputText) => {
    if (!text.trim()) return

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text }])
    setInputText('')

    // Process AI response immediately for snappy UX
    const intent = processIntent(text)
    setMessages(prev => [...prev, { role: 'ai', text: intent.reply }])
    speak(intent.reply)
    
    if (intent.action) {
      setTimeout(() => {
        intent.action()
        setIsOpen(false) // Close chat when navigating
      }, 1500) // Reduced wait time before redirecting
    }
  }

  // Don't show chatbot on login or language select screen
  if (location.pathname === '/' || location.pathname === '/login') return null;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[60] w-16 h-16 bg-gradient-to-br from-assam-blue to-blue-700 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-105 transition-transform border-4 border-white dark:border-slate-800"
            aria-label="Open AI Assistant"
          >
            <Bot size={32} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[60] w-[380px] h-[550px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-assam-blue to-blue-700 p-4 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Suvidha AI</h3>
                  <p className="text-xs text-blue-200">Voice Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsOpen(false)
                  synthRef.current?.cancel()
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close AI Assistant"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/50">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-assam-blue text-white rounded-br-sm' 
                      : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-white border border-gray-100 dark:border-slate-600 rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleListen}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                  aria-label={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isListening ? "Listening..." : "Type or speak..."}
                  className="flex-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-full px-4 py-3 focus:outline-none focus:border-assam-blue dark:focus:border-blue-500 text-sm"
                  disabled={isListening}
                />
                
                <button
                  onClick={() => handleSend()}
                  disabled={!inputText.trim() || isListening}
                  className="w-12 h-12 rounded-full bg-assam-blue flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors"
                  aria-label="Send message"
                >
                  <Send size={20} className="ml-1" />
                </button>
              </div>
              <p className="text-center text-[10px] text-gray-400 mt-2">
                Try saying: "Help me pay my electricity bill"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
