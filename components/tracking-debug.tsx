"use client"

import { useState, useEffect } from "react"

export default function TrackingDebug() {
  const [events, setEvents] = useState<
    Array<{
      timestamp: string
      type: string
      data: any
      success: boolean
    }>
  >([])
  const [isVisible, setIsVisible] = useState(false)

  // Initialize debug mode
  useEffect(() => {
    // Create a wrapper for the original bge function
    const originalBge = window.bge

    if (originalBge) {
      window.bge = function (...args: any[]) {
        // Log the event
        const event = {
          timestamp: new Date().toISOString(),
          type: args[0] || "unknown",
          data: args[1] || {},
          success: true,
        }

        console.log("[BIGO Debug] Event:", event)

        // Add to events list
        setEvents((prev) => [event, ...prev])

        // Call the original function
        return originalBge.apply(this, args)
      }
    }

    // Create a wrapper for the trackBigoDirectEvent function
    const originalTrackBigoDirectEvent = window.trackBigoDirectEvent

    if (originalTrackBigoDirectEvent) {
      window.trackBigoDirectEvent = function (eventName: string, eventData?: any) {
        // Log the event
        const event = {
          timestamp: new Date().toISOString(),
          type: eventName || "unknown",
          data: eventData || {},
          success: true,
        }

        console.log("[BIGO Debug] Direct Event:", event)

        // Add to events list
        setEvents((prev) => [event, ...prev])

        // Call the original function
        return originalTrackBigoDirectEvent.apply(this, [eventName, eventData])
      }
    }

    // Add keyboard shortcut to toggle debug panel
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+D to toggle debug panel
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setIsVisible((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 right-0 w-96 max-h-96 bg-black bg-opacity-80 text-white p-4 overflow-auto z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold">BIGO Tracking Debug</h3>
        <button onClick={() => setIsVisible(false)} className="text-xs bg-red-600 px-2 py-1 rounded">
          Close
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-xs text-gray-400">No events tracked yet</p>
      ) : (
        <div className="space-y-2">
          {events.map((event, index) => (
            <div key={index} className="text-xs border-b border-gray-700 pb-2">
              <div className="flex justify-between">
                <span className="font-bold">{event.type}</span>
                <span className="text-gray-400">{new Date(event.timestamp).toLocaleTimeString()}</span>
              </div>
              <pre className="mt-1 text-green-400 overflow-x-auto">{JSON.stringify(event.data, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
