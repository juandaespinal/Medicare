/**
 * Direct BIGO tracking implementation based on official documentation
 * https://www.bigoads.com/help/detail?id=111&moduleId=11&articleId=2&currentLan=EN&isPreview=1
 */

// Mode 1: POST request with application/json
export async function trackBigoEventMode1(pixelId: string, eventName: string, eventData?: Record<string, any>) {
  try {
    const payload = {
      pixel_id: pixelId,
      event: eventName,
      ...eventData,
    }

    const response = await fetch("https://api.bytegle.site/bigoad/trackingevent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`BIGO API responded with status: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error(`Error tracking BIGO event (Mode 1): ${error}`)
    return false
  }
}

// Mode 2: GET request with parameters spliced after the URL
export function trackBigoEventMode2(pixelId: string, eventName: string, eventData?: Record<string, any>) {
  try {
    // Create URL with parameters
    const url = new URL("https://api.bytegle.site/bigoad/trackingevent")

    // Add required parameters
    url.searchParams.append("pixel_id", pixelId)
    url.searchParams.append("event", eventName)

    // Add additional data
    if (eventData) {
      Object.entries(eventData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    // Create an image element to make the request
    const img = new Image(1, 1)
    img.src = url.toString()
    img.style.display = "none"
    document.body.appendChild(img)

    // Remove the image after a timeout
    setTimeout(() => {
      if (document.body.contains(img)) {
        document.body.removeChild(img)
      }
    }, 5000)

    return true
  } catch (error) {
    console.error(`Error tracking BIGO event (Mode 2): ${error}`)
    return false
  }
}

// Helper function to initialize BIGO tracking
export function initBigoTracking(pixelId: string) {
  // Create a global function to track events
  window.trackBigoEvent = (eventName: string, eventData?: Record<string, any>) => {
    // Use Mode 1 by default (POST request)
    return trackBigoEventMode1(pixelId, eventName, eventData)
  }

  // Track page view on initialization
  window.trackBigoEvent("PageView", {
    url: window.location.href,
    referrer: document.referrer || "",
    title: document.title,
    timestamp: Date.now(),
  })

  console.log(`BIGO tracking initialized with pixel ID: ${pixelId}`)
  return window.trackBigoEvent
}

// Add TypeScript interface for the global window object
declare global {
  interface Window {
    trackBigoEvent?: (eventName: string, eventData?: Record<string, any>) => Promise<boolean>
  }
}
