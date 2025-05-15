/**
 * Utility functions for tracking events
 */

// Function to fire BIGO button click event
export function trackButtonClick(buttonType: string, buttonName: string, additionalData?: Record<string, any>) {
  if (typeof window !== "undefined" && window.bge && typeof window.bge === "function") {
    try {
      // Fire generic button click event
      window.bge("event", "button", {
        button_type: buttonType,
        button_name: buttonName,
        ...additionalData,
      })

      console.log(`BIGO button click tracked: ${buttonType} - ${buttonName}`, additionalData)

      // Also fire specific event based on button type
      if (buttonType === "consultation" || buttonType === "call") {
        window.bge("event", "phone_button", {
          button_name: buttonName,
          ...additionalData,
        })
      } else if (buttonType === "form") {
        window.bge("event", "form_button", {
          button_name: buttonName,
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
      window.bge("event", "ec_order", {
        value: orderValue,
        currency: "USD",
        ...additionalData,
      })

      console.log(`BIGO place order tracked with value: ${orderValue}`, additionalData)
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
      window.bge("event", "page_view", pageName ? { page_name: pageName } : undefined)
      console.log(`BIGO page view tracked${pageName ? ` for ${pageName}` : ""}`)
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
