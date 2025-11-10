'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
    dataLayer?: any[]
  }
}

export default function PhoneClickTracking() {
  useEffect(() => {
    const trackPhoneClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const phoneLink = target.closest('a[href^="tel:"]')

      if (phoneLink && phoneLink instanceof HTMLAnchorElement) {
        const phoneNumber = phoneLink.href.replace('tel:', '')

        // Send event to Google Analytics
        if (typeof window.gtag !== 'undefined') {
          window.gtag('event', 'phone_call_click', {
            event_category: 'engagement',
            event_label: phoneNumber,
            phone_number: phoneNumber,
            value: 1
          })

          console.log('Phone click tracked:', phoneNumber)
        }
      }
    }

    // Add click listener to document
    document.addEventListener('click', trackPhoneClick, true)

    // Cleanup
    return () => {
      document.removeEventListener('click', trackPhoneClick, true)
    }
  }, [])

  return null
}
