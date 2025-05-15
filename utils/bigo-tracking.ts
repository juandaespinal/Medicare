/**
 * Utility functions for server-to-server BIGO tracking
 */

// Function to track events with BIGO via server-to-server
export async function trackBigoEvent(eventName: string, eventData?: Record<string, any>) {
  try {
    if (typeof window === "undefined") {
      console.warn("trackBigoEvent called on the server side")
      return false
    }

    console.log(`Sending server-to-server BIGO event: ${eventName}`, eventData || {})

    // Get client-side data to enhance the event
    const clientData = {
      url: window.location.href,
      referrer: document.referrer || "",
      user_agent: navigator.userAgent,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }

    // Send the event to our server-side API
    const response = await fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: eventName,
        ...clientData,
        ...(eventData || {}),
      }),
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success) {
      console.log(`Server-to-server BIGO event ${eventName} sent successfully:`, result)
      return true
    } else {
      console.error(`Error sending server-to-server BIGO event ${eventName}:`, result.error)
      return false
    }
  } catch (error) {
    console.error(`Error tracking server-to-server BIGO event ${eventName}:`, error)
    return false
  }
}

// Common tracking functions
export async function trackPageView(pageName?: string) {
  return trackBigoEvent("page_view", pageName ? { page_name: pageName } : undefined)
}

export async function trackButtonClick(buttonName: string, buttonData?: Record<string, any>) {
  return trackBigoEvent("button_click", {
    button_name: buttonName,
    ...buttonData,
  })
}

export async function trackFormSubmit(formName: string, formData?: Record<string, any>) {
  return trackBigoEvent("form_submit", {
    form_name: formName,
    ...formData,
  })
}

export async function trackConversion(value?: number, currency = "USD", conversionData?: Record<string, any>) {
  return trackBigoEvent("conversion", {
    value: value || 1,
    currency,
    ...conversionData,
  })
}

export async function trackPhoneCall(phoneNumber: string, callData?: Record<string, any>) {
  return trackBigoEvent("phone_call", {
    phone_number: phoneNumber,
    ...callData,
  })
}
