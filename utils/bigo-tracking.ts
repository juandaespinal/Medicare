/**
 * Utility functions for BIGO tracking
 */

// Function to track events with BIGO
export function trackBigoEvent(eventName: string, eventData?: Record<string, any>) {
  try {
    if (typeof window !== "undefined" && window.bge) {
      console.log(`Tracking BIGO event: ${eventName}`, eventData || {})

      if (eventData) {
        window.bge("event", eventName, eventData)
      } else {
        window.bge("event", eventName)
      }

      return true
    }
  } catch (error) {
    console.error(`Error tracking BIGO event ${eventName}:`, error)
  }

  return false
}

// Common tracking functions
export function trackPageView(pageName?: string) {
  return trackBigoEvent("page_view", pageName ? { page_name: pageName } : undefined)
}

export function trackButtonClick(buttonName: string, buttonData?: Record<string, any>) {
  return trackBigoEvent("button_click", {
    button_name: buttonName,
    ...buttonData,
  })
}

export function trackFormSubmit(formName: string, formData?: Record<string, any>) {
  return trackBigoEvent("form_submit", {
    form_name: formName,
    ...formData,
  })
}

export function trackConversion(value?: number, currency = "USD", conversionData?: Record<string, any>) {
  return trackBigoEvent("conversion", {
    value: value || 1,
    currency,
    ...conversionData,
  })
}

export function trackPhoneCall(phoneNumber: string, callData?: Record<string, any>) {
  return trackBigoEvent("phone_call", {
    phone_number: phoneNumber,
    ...callData,
  })
}
