/**
 * Utility functions for tracking events
 */

// Function to generate a unique event ID
function generateEventId() {
  return `ev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Function to fire BIGO button click event
export function trackButtonClick(buttonType: string, buttonName: string, additionalData?: Record<string, any>) {
  if (typeof window !== "undefined" && window.bge && typeof window.bge === "function") {
    try {
      const timestamp = new Date().toISOString()
      const eventId = generateEventId()

      // Fire generic button click event
      window.bge("event", "button", {
        button_type: buttonType,
        button_name: buttonName,
        event_id: eventId,
        timestamp: timestamp,
        ...additionalData,
      })

      console.log(`BIGO button click tracked: ${buttonType} - ${buttonName}`, {
        event_id: eventId,
        timestamp: timestamp,
        ...additionalData,
      })

      // Also fire specific event based on button type
      if (buttonType === "consultation" || buttonType === "call") {
        window.bge("event", "phone_button", {
          button_name: buttonName,
          event_id: `${eventId}_phone`,
          timestamp: timestamp,
          ...additionalData,
        })
      } else if (buttonType === "form") {
        window.bge("event", "form_button", {
          button_name: buttonName,
          event_id: `${eventId}_form`,
          timestamp: timestamp,
          ...additionalData,
        })
      }

      return true
    } catch (e) {
      console.error("Error tracking button click:", e)
      return false
    }
  } else {
    console.warn("BIGO tracking not available for button click")
    return false
  }
}

// Function to fire BIGO place order event
export function trackPlaceOrder(orderValue = 1, additionalData?: Record<string, any>) {
  if (typeof window !== "undefined" && window.bge && typeof window.bge === "function") {
    try {
      const timestamp = new Date().toISOString()
      const eventId = generateEventId()

      window.bge("event", "ec_order", {
        value: orderValue,
        currency: "USD",
        event_id: eventId,
        timestamp: timestamp,
        ...additionalData,
      })

      console.log(`BIGO place order tracked with value: ${orderValue}`, {
        event_id: eventId,
        timestamp: timestamp,
        ...additionalData,
      })
      return true
    } catch (e) {
      console.error("Error tracking place order:", e)
      return false
    }
  } else {
    console.warn("BIGO tracking not available for place order")
    return false
  }
}

// Function to track page view (for components that need to trigger it manually)
export function trackPageView(pageName?: string) {
  if (typeof window !== "undefined" && window.bge && typeof window.bge === "function") {
    try {
      const timestamp = new Date().toISOString()
      const eventId = generateEventId()

      window.bge("event", "page_view", {
        event_id: eventId,
        timestamp: timestamp,
        ...(pageName ? { page_name: pageName } : {}),
        url: window.location.href,
        referrer: document.referrer || "",
        title: document.title || "",
      })

      console.log(`BIGO page view tracked${pageName ? ` for ${pageName}` : ""}`, {
        event_id: eventId,
        timestamp: timestamp,
        url: window.location.href,
      })
      return true
    } catch (e) {
      console.error("Error tracking page view:", e)
      return false
    }
  } else {
    console.warn("BIGO tracking not available for page view")
    return false
  }
}
