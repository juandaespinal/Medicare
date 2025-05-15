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
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: Date.now(),
      client_id: localStorage.getItem("bigo_client_id") || `client_${Math.random().toString(36).substring(2, 15)}`,
    }

    // Store client ID for future use
    if (!localStorage.getItem("bigo_client_id")) {
      localStorage.setItem("bigo_client_id", clientData.client_id as string)
    }

    // Try to get click ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const clickId = urlParams.get("click_id") || urlParams.get("clickid") || urlParams.get("bigo_click_id")

    // Try to get RedTrack click ID if available
    const rtkClickID = (window as any).rtkClickID

    // Send the event to our server-side API
    const response = await fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: eventName,
        ...clientData,
        ...(clickId ? { click_id: clickId } : {}),
        ...(rtkClickID ? { rtk_click_id: rtkClickID } : {}),
        ...(eventData || {}),
      }),
    })

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
  return trackBigoEvent("PageView", pageName ? { page_name: pageName } : undefined)
}

export async function trackButtonClick(buttonName: string, buttonData?: Record<string, any>) {
  return trackBigoEvent("Click", {
    button_name: buttonName,
    ...buttonData,
  })
}

export async function trackFormSubmit(formName: string, formData?: Record<string, any>) {
  return trackBigoEvent("FormSubmit", {
    form_name: formName,
    ...formData,
  })
}

export async function trackConversion(value?: number, currency = "USD", conversionData?: Record<string, any>) {
  return trackBigoEvent("Purchase", {
    value: value || 1,
    currency,
    ...conversionData,
  })
}

export async function trackPhoneCall(phoneNumber: string, callData?: Record<string, any>) {
  return trackBigoEvent("Contact", {
    phone_number: phoneNumber,
    contact_type: "phone",
    ...callData,
  })
}
