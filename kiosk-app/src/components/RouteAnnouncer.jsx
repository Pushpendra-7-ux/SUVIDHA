import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAccessibilityContext } from '../context/AccessibilityContext'

/**
 * Announces page changes when screen reader is enabled
 * TalkBack style - only announces the page name, user navigates with focus
 */
export default function RouteAnnouncer() {
  const location = useLocation()
  const { screenReaderEnabled, announcePage, readEntirePage } = useAccessibilityContext()

  useEffect(() => {
    if (!screenReaderEnabled) return

    // Map route paths to readable page names
    const getPageName = (path) => {
      if (path === '/') return 'Language Selection'
      if (path === '/home') return 'Main Menu'
      if (path.startsWith('/service/')) {
        const service = path.split('/')[2]
        const serviceNames = {
          electricity: 'Electricity Department',
          water: 'Water Department',
          gas: 'Gas Department',
          sanitation: 'Sanitation Department',
          municipal: 'Municipal Services',
          smartcity: 'Smart City Services'
        }
        return `${serviceNames[service] || 'Service'} Screen`
      }
      if (path.startsWith('/qr/')) return 'QR Code Display'
      if (path.startsWith('/report/')) return 'Complaint Form'
      if (path.startsWith('/success/')) return 'Success Screen'
      return 'Page'
    }

    const pageName = getPageName(location.pathname)
    
    // Announce the page name and immediately read the rest of the page
    announcePage(pageName)
    
    // Small generic delay just to ensure DOM finishes painting before querying text
    setTimeout(() => {
      readEntirePage('main-content')
    }, 150)
  }, [location.pathname, screenReaderEnabled, announcePage, readEntirePage])

  return null
}
