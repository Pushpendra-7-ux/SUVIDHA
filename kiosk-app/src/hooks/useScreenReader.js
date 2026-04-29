import { useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook for TalkBack-style screen reader functionality
 * Only reads the element that currently has focus (like Android TalkBack or iOS VoiceOver)
 */
export const useScreenReader = (isEnabled) => {
  const utteranceQueueRef = useRef([])
  const isSpeakingRef = useRef(false)
  const currentUtteranceRef = useRef(null)
  const lastAnnouncedRef = useRef('')
  const voicesRef = useRef([])

  // Pre-load voices to avoid Windows/Chrome network voice latency bug
  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis?.getVoices() || []
    }
    loadVoices()
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  const getFastLocalVoice = useCallback(() => {
    if (!voicesRef.current.length) return null;
    // Prefer local English voices to prevent slow network fetching
    return voicesRef.current.find(v => v.localService && v.lang.startsWith('en')) 
        || voicesRef.current.find(v => v.localService) 
        || voicesRef.current[0];
  }, []);

  // Announce text via speech synthesis
  const announce = useCallback((text, priority = 'normal') => {
    if (!isEnabled || !text) return

    // Avoid repeating the same announcement
    if (lastAnnouncedRef.current === text && priority === 'normal') return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.15
    utterance.pitch = 1
    utterance.volume = 1
    
    const voice = getFastLocalVoice();
    if (voice) utterance.voice = voice;

    if (priority === 'high') {
      // Cancel current speech and prioritize this announcement
      window.speechSynthesis?.cancel()
      utteranceQueueRef.current = []
      isSpeakingRef.current = false
    } else if (isSpeakingRef.current) {
      // Queue the utterance if already speaking
      utteranceQueueRef.current.push(utterance)
      return
    }

    utterance.onstart = () => {
      isSpeakingRef.current = true
      currentUtteranceRef.current = utterance
      lastAnnouncedRef.current = text
    }

    utterance.onend = () => {
      isSpeakingRef.current = false
      currentUtteranceRef.current = null
      
      // Process next queued utterance
      if (utteranceQueueRef.current.length > 0) {
        const nextUtterance = utteranceQueueRef.current.shift()
        window.speechSynthesis?.speak(nextUtterance)
      }
    }

    utterance.onerror = () => {
      isSpeakingRef.current = false
      currentUtteranceRef.current = null
    }

    window.speechSynthesis?.speak(utterance)
  }, [isEnabled])

  // Get readable text from element (TalkBack style)
  const getElementAnnouncement = useCallback((element) => {
    if (!element) return ''

    // innerText is better than textContent as it ignores hidden text/SVG noise
    let text = ''
    if (element.innerText) {
      text = element.innerText.trim()
    } else if (element.textContent) {
      text = element.textContent.trim()
    }
    
    // Clean up excessive newlines from nested elements
    text = text.replace(/\n+/g, ' ').trim()

    const ariaLabel = element.getAttribute('aria-label')
    const placeholder = element.getAttribute('placeholder')
    const type = element.getAttribute('type')
    const tagName = element.tagName.toLowerCase()

    // Determine element type and announcement
    if (ariaLabel) {
      return ariaLabel
    }

    if (tagName === 'button') {
      return text ? `Button: ${text}` : 'Button'
    }

    if (tagName === 'a') {
      return text ? `Link: ${text}` : 'Link'
    }

    if (tagName === 'input') {
      const inputType = type || 'text'
      const label = document.querySelector(`label[for="${element.id}"]`)?.textContent || placeholder || ''
      return label ? `${label}, ${inputType} input` : `${inputType} input`
    }

    if (tagName === 'textarea') {
      const label = document.querySelector(`label[for="${element.id}"]`)?.textContent || placeholder || ''
      return label ? `${label}, text area` : 'Text area'
    }

    if (tagName === 'select') {
      const label = document.querySelector(`label[for="${element.id}"]`)?.textContent || ''
      const selected = element.options[element.selectedIndex]?.text || ''
      return label ? `${label}, ${selected}` : `Select, ${selected}`
    }

    if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
      return `Heading: ${text}`
    }

    if (tagName === 'img') {
      const alt = element.getAttribute('alt')
      return alt || 'Image'
    }

    if (text && text.length > 0) {
      return text
    }

    return ''
  }, [])

  // Announce button/link/element click
  const announceClick = useCallback((element) => {
    const announcement = getElementAnnouncement(element)
    if (announcement) {
      announce(`${announcement}, activated`, 'normal')
    }
  }, [announce, getElementAnnouncement])

  // Announce page or section
  const announcePage = useCallback((pageName) => {
    announce(`${pageName}`, 'high')
  }, [announce])

  // Listen for focus changes (TalkBack style - only read focused element)
  useEffect(() => {
    if (!isEnabled) return

    const handleFocus = (e) => {
      const element = e.target
      
      // Ignore some elements
      if (element.tagName === 'BODY' || element.tagName === 'HTML') return
      if (element.classList.contains('a11y-bar')) return
      if (element.classList.contains('a11y-btn')) return

      const announcement = getElementAnnouncement(element)
      if (announcement) {
        announce(announcement, 'normal')
      }
    }

    // Use capture phase to catch focus early
    document.addEventListener('focus', handleFocus, true)
    return () => {
      document.removeEventListener('focus', handleFocus, true)
    }
  }, [isEnabled, announce, getElementAnnouncement])

  // Listen for click events and announce them
  useEffect(() => {
    if (!isEnabled) return

    const handleClick = (e) => {
      // Only announce clicks on buttons and interactive elements
      const element = e.target.closest('button, a, [role="button"]')
      if (element) {
        announceClick(element)
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [isEnabled, announceClick])

  // Listen for form submission announcements
  useEffect(() => {
    if (!isEnabled) return

    const handleSubmit = (e) => {
      const form = e.target
      announce('Form submitted', 'high')
    }

    document.addEventListener('submit', handleSubmit, true)
    return () => {
      document.removeEventListener('submit', handleSubmit, true)
    }
  }, [isEnabled, announce])

  // Stop speech synthesis when disabled
  useEffect(() => {
    if (!isEnabled) {
      window.speechSynthesis?.cancel()
      utteranceQueueRef.current = []
      isSpeakingRef.current = false
      lastAnnouncedRef.current = ''
    }
  }, [isEnabled])

  // Sequentially read the entire page contents
  const readEntirePage = useCallback((containerId = 'main-content') => {
    if (!isEnabled) return;
    
    // Cancel any existing speech
    window.speechSynthesis?.cancel();
    utteranceQueueRef.current = [];
    isSpeakingRef.current = false;
    
    const container = document.getElementById(containerId) || document.body;
    
    // Find all readable elements in order
    const elements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, button, a, label');
    
    let toRead = [];
    elements.forEach(el => {
      // Skip hidden elements or ones inside hidden parents
      if (el.offsetParent === null || window.getComputedStyle(el).display === 'none') return;
      
      const announcement = getElementAnnouncement(el);
      if (announcement && announcement.trim().length > 0) {
        // avoid consecutive duplicates
        if (toRead.length === 0 || toRead[toRead.length - 1] !== announcement) {
           toRead.push(announcement);
        }
      }
    });
    
    if (toRead.length > 0) {
      // Start sequential reading
      const firstText = toRead.shift();
      announce(firstText, 'high'); // High priority to interrupt everything else
      
      // Queue the rest
      toRead.forEach(text => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.15;
        const voice = getFastLocalVoice();
        if (voice) utterance.voice = voice;
        utteranceQueueRef.current.push(utterance);
      });
    }
  }, [isEnabled, announce, getElementAnnouncement]);

  return {
    announce,
    announceClick,
    announcePage,
    getElementAnnouncement,
    readEntirePage,
    isSpeaking: isSpeakingRef.current,
  }
}
