/**
 * Utility functions for tracking events using server-side API
 */

// Function to send tracking event to our server-side API
async function sendTrackingEvent(eventType: string, eventData: Record<string, any>) {
  try {
    const response = await fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: eventType,
        ...eventData,
      }),
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log(`Tracking event ${eventType} sent successfully:`, data)
    return true
  } catch (error) {
    console.error(`Error sending ${eventType} tracking event:`, error)
    return false
  }
}

// Function to track button clicks
export function trackButtonClick(buttonType: string, buttonName: string, additionalData?: Record<string, any>) {
  return sendTrackingEvent("button", {
    button_type: buttonType,
    button_name: buttonName,
    ...additionalData,
  })
}

// Function to track place order events
export function trackPlaceOrder(orderValue = 1, additionalData?: Record<string, any>) {
  return sendTrackingEvent("ec_order", {
    value: orderValue,
    currency: "USD",
    ...additionalData,
  })
}

// Function to track page views
export function trackPageView(pageName?: string) {
  return sendTrackingEvent("page_view", {
    ...(pageName ? { page_name: pageName } : {}),
    url: window.location.href,
    referrer: document.referrer || "",
    title: document.title || "",
  })
}
