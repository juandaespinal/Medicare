/**
 * Utility for debugging BIGO tracking events
 */

// Flag to enable/disable debug mode
let debugMode = false

// Store tracking history
const trackingHistory: Array<{
  timestamp: string
  eventName: string
  eventData: any
  success: boolean
}> = []

// Enable debug mode
export function enableTrackingDebug() {
  debugMode = true
  console.log("🔍 BIGO Tracking Debug Mode: ENABLED")

  // Add visual indicator to the page
  if (typeof document !== "undefined") {
    const debugIndicator = document.createElement("div")
    debugIndicator.id = "bigo-debug-indicator"
    debugIndicator.style.position = "fixed"
    debugIndicator.style.bottom = "10px"
    debugIndicator.style.right = "10px"
    debugIndicator.style.backgroundColor = "rgba(0, 0, 0, 0.7)"
    debugIndicator.style.color = "#fff"
    debugIndicator.style.padding = "8px 12px"
    debugIndicator.style.borderRadius = "4px"
    debugIndicator.style.fontSize = "12px"
    debugIndicator.style.fontFamily = "monospace"
    debugIndicator.style.zIndex = "9999"
    debugIndicator.style.cursor = "pointer"
    debugIndicator.textContent = "🔍 BIGO Debug: ON"

    // Add click handler to show tracking history
    debugIndicator.addEventListener("click", showTrackingHistory)

    document.body.appendChild(debugIndicator)
  }

  // Monkey patch the original bge function to log events
  if (typeof window !== "undefined" && window.bge) {
    const originalBge = window.bge

    window.bge = function (...args: any[]) {
      // Log the event
      console.log("🔍 BIGO Event:", ...args)

      // Show visual feedback
      showEventFeedback(args[1] || "unknown", args[2] || {})

      // Record in history
      trackingHistory.push({
        timestamp: new Date().toISOString(),
        eventName: args[1] || "unknown",
        eventData: args[2] || {},
        success: true,
      })

      // Call the original function
      return originalBge.apply(this, args)
    }
  }
}

// Disable debug mode
export function disableTrackingDebug() {
  debugMode = false
  console.log("🔍 BIGO Tracking Debug Mode: DISABLED")

  // Remove visual indicator
  if (typeof document !== "undefined") {
    const debugIndicator = document.getElementById("bigo-debug-indicator")
    if (debugIndicator) {
      debugIndicator.remove()
    }
  }
}

// Show visual feedback when an event is fired
function showEventFeedback(eventName: string, eventData: any) {
  if (!debugMode || typeof document === "undefined") return

  // Create a temporary notification
  const notification = document.createElement("div")
  notification.style.position = "fixed"
  notification.style.bottom = "60px"
  notification.style.right = "10px"
  notification.style.backgroundColor = "rgba(0, 128, 0, 0.8)"
  notification.style.color = "#fff"
  notification.style.padding = "8px 12px"
  notification.style.borderRadius = "4px"
  notification.style.fontSize = "12px"
  notification.style.fontFamily = "monospace"
  notification.style.zIndex = "9999"
  notification.style.maxWidth = "300px"
  notification.style.wordBreak = "break-word"
  notification.innerHTML = `
    <div><strong>Event:</strong> ${eventName}</div>
    <div><strong>Data:</strong> ${JSON.stringify(eventData).substring(0, 100)}${JSON.stringify(eventData).length > 100 ? "..." : ""}</div>
  `

  document.body.appendChild(notification)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0"
    notification.style.transition = "opacity 0.5s"
    setTimeout(() => notification.remove(), 500)
  }, 3000)
}

// Show tracking history
function showTrackingHistory() {
  if (!debugMode || typeof document === "undefined") return

  // Check if history panel already exists
  let historyPanel = document.getElementById("bigo-history-panel")

  if (historyPanel) {
    // If it exists, just toggle visibility
    historyPanel.style.display = historyPanel.style.display === "none" ? "block" : "none"
    return
  }

  // Create history panel
  historyPanel = document.createElement("div")
  historyPanel.id = "bigo-history-panel"
  historyPanel.style.position = "fixed"
  historyPanel.style.top = "50%"
  historyPanel.style.left = "50%"
  historyPanel.style.transform = "translate(-50%, -50%)"
  historyPanel.style.backgroundColor = "rgba(0, 0, 0, 0.9)"
  historyPanel.style.color = "#fff"
  historyPanel.style.padding = "20px"
  historyPanel.style.borderRadius = "8px"
  historyPanel.style.maxWidth = "80%"
  historyPanel.style.maxHeight = "80%"
  historyPanel.style.overflow = "auto"
  historyPanel.style.zIndex = "10000"
  historyPanel.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)"

  // Add close button
  const closeButton = document.createElement("button")
  closeButton.textContent = "Close"
  closeButton.style.position = "absolute"
  closeButton.style.top = "10px"
  closeButton.style.right = "10px"
  closeButton.style.padding = "5px 10px"
  closeButton.style.backgroundColor = "#f44336"
  closeButton.style.border = "none"
  closeButton.style.borderRadius = "4px"
  closeButton.style.color = "white"
  closeButton.style.cursor = "pointer"
  closeButton.onclick = () => (historyPanel!.style.display = "none")

  historyPanel.appendChild(closeButton)

  // Add title
  const title = document.createElement("h2")
  title.textContent = "BIGO Tracking History"
  title.style.marginTop = "0"
  historyPanel.appendChild(title)

  // Add history items
  if (trackingHistory.length === 0) {
    const noEvents = document.createElement("p")
    noEvents.textContent = "No tracking events recorded yet."
    historyPanel.appendChild(noEvents)
  } else {
    const list = document.createElement("div")

    trackingHistory.forEach((event, index) => {
      const item = document.createElement("div")
      item.style.marginBottom = "15px"
      item.style.padding = "10px"
      item.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
      item.style.borderRadius = "4px"

      const time = new Date(event.timestamp).toLocaleTimeString()

      item.innerHTML = `
        <div><strong>#${index + 1} - ${time}</strong></div>
        <div><strong>Event:</strong> ${event.eventName}</div>
        <div><strong>Data:</strong> <pre style="margin: 5px 0; white-space: pre-wrap;">${JSON.stringify(event.eventData, null, 2)}</pre></div>
        <div><strong>Status:</strong> <span style="color: ${event.success ? "#4caf50" : "#f44336"}">${event.success ? "Success" : "Failed"}</span></div>
      `

      list.appendChild(item)
    })

    historyPanel.appendChild(list)
  }

  document.body.appendChild(historyPanel)
}

// Check if BIGO tracking is properly initialized
export function checkBigoTracking(): { initialized: boolean; message: string } {
  if (typeof window === "undefined") {
    return { initialized: false, message: "Window object not available (server-side rendering)" }
  }

  if (!window.bgdataLayer) {
    return { initialized: false, message: "bgdataLayer not found" }
  }

  if (!window.bge) {
    return { initialized: false, message: "bge function not found" }
  }

  // Check if the BIGO script is loaded
  const bigoScript = document.querySelector('script[src*="topnotchs.site/ad/events.js"]')
  if (!bigoScript) {
    return { initialized: false, message: "BIGO script not found in DOM" }
  }

  return { initialized: true, message: "BIGO tracking is properly initialized" }
}

// Test BIGO tracking by sending a test event
export function testBigoTracking(): boolean {
  const status = checkBigoTracking()

  if (!status.initialized) {
    console.error("❌ BIGO Tracking Test Failed:", status.message)
    return false
  }

  try {
    // Send a test event
    window.bge("event", "test_event", {
      test_id: `test_${Date.now()}`,
      timestamp: new Date().toISOString(),
    })

    console.log("✅ BIGO Tracking Test: Test event sent successfully")
    return true
  } catch (error) {
    console.error("❌ BIGO Tracking Test Failed:", error)
    return false
  }
}

// Get tracking history
export function getTrackingHistory() {
  return [...trackingHistory]
}
