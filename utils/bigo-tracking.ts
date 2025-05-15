/**
 * Utility functions for server-to-server BIGO tracking with client-side fallback
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
      timestamp: Date.now(),
      client_id: getOrCreateClientId(),
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

      // If server-side tracking fails, try client-side fallback
      return await clientSideFallbackTracking(eventName, { ...clientData, ...(eventData || {}) })
    }
  } catch (error) {
    console.error(`Error tracking server-to-server BIGO event ${eventName}:`, error)

    // If server-side tracking fails with an exception, try client-side fallback
    return await clientSideFallbackTracking(eventName, { ...(eventData || {}) })
  }
}

// Helper to get or create a persistent client ID
function getOrCreateClientId(): string {
  try {
    let clientId = localStorage.getItem("bigo_client_id")

    if (!clientId) {
      clientId = `client_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`
      localStorage.setItem("bigo_client_id", clientId)
    }

    return clientId
  } catch (e) {
    // Fallback if localStorage is not available
    return `client_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`
  }
}

// Client-side fallback tracking function
async function clientSideFallbackTracking(eventName: string, eventData?: Record<string, any>): Promise<boolean> {
  try {
    console.log(`Attempting client-side fallback tracking for event: ${eventName}`, eventData)

    // Check if BIGO tracking is available
    if (typeof window.bge !== "function") {
      console.error("Client-side BIGO tracking not available (bge function not found)")
      return false
    }

    // Map our event names to BIGO event names if needed
    const bigoEventName = mapToBigoEventName(eventName)

    // Send the event directly to BIGO
    window.bge(bigoEventName, eventData)

    console.log(`Client-side fallback tracking sent for event: ${bigoEventName}`)
    return true
  } catch (error) {
    console.error(`Client-side fallback tracking failed for event ${eventName}:`, error)
    return false
  }
}

// Map our event names to BIGO event names
function mapToBigoEventName(eventName: string): string {
  const eventMap: Record<string, string> = {
    page_view: "page_view",
    button_click: "click",
    form_submit: "form_submit",
    conversion: "purchase",
    phone_call: "contact",
  }

  return eventMap[eventName] || eventName
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

// Add TypeScript interface for the global window object
declare global {
  interface Window {
    bge?: (eventName: string, eventData?: any) => void
    bgdataLayer?: any[]
  }
}
