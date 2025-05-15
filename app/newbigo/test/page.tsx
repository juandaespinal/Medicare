"use client"

import { useState, useEffect } from "react"
import { trackPageView, trackButtonClick, trackPhoneCall, trackConversion } from "@/utils/bigo-tracking"

export default function TestPage() {
  const [eventLog, setEventLog] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Track page view on mount
  useEffect(() => {
    const trackInitialView = async () => {
      setIsLoading(true)
      try {
        const success = await trackPageView("test_page")
        addToLog(`Page view tracked: ${success ? "Success" : "Failed"}`)
      } catch (error) {
        addToLog(`Error tracking page view: ${(error as Error).message}`)
      } finally {
        setIsLoading(false)
      }
    }

    trackInitialView()
  }, [])

  // Add message to log
  const addToLog = (message: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev])
  }

  // Handle button click
  const handleButtonClick = async (buttonName: string) => {
    setIsLoading(true)
    try {
      const success = await trackButtonClick(buttonName, { test: true, timestamp: Date.now() })
      addToLog(`Button click tracked (${buttonName}): ${success ? "Success" : "Failed"}`)
    } catch (error) {
      addToLog(`Error tracking button click: ${(error as Error).message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle phone call
  const handlePhoneCall = async () => {
    setIsLoading(true)
    try {
      const phoneNumber = "+18554690274"
      const success = await trackPhoneCall(phoneNumber, { test: true, timestamp: Date.now() })
      addToLog(`Phone call tracked: ${success ? "Success" : "Failed"}`)

      // Simulate a call
      setTimeout(async () => {
        try {
          const convSuccess = await trackConversion(1, "USD", {
            event_type: "test_call_completed",
            phone_number: phoneNumber,
            call_duration: 15000,
          })
          addToLog(`Conversion tracked: ${convSuccess ? "Success" : "Failed"}`)
        } catch (error) {
          addToLog(`Error tracking conversion: ${(error as Error).message}`)
        } finally {
          setIsLoading(false)
        }
      }, 2000)
    } catch (error) {
      addToLog(`Error tracking phone call: ${(error as Error).message}`)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Server-to-Server BIGO Tracking Test Page</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Test Actions</h2>

            <div className="space-y-4">
              <div>
                <button
                  onClick={() => handleButtonClick("test_button_1")}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Track Button Click 1"}
                </button>
              </div>

              <div>
                <button
                  onClick={() => handleButtonClick("test_button_2")}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Track Button Click 2"}
                </button>
              </div>

              <div>
                <button
                  onClick={handlePhoneCall}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Track Phone Call + Conversion"}
                </button>
              </div>

              <div>
                <button
                  onClick={async () => {
                    setIsLoading(true)
                    try {
                      const success = await trackPageView("manual_page_view")
                      addToLog(`Manual page view tracked: ${success ? "Success" : "Failed"}`)
                    } catch (error) {
                      addToLog(`Error tracking manual page view: ${(error as Error).message}`)
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Track Manual Page View"}
                </button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Event Log</h2>

            <div className="bg-gray-100 p-4 rounded h-80 overflow-y-auto">
              {eventLog.length === 0 ? (
                <p className="text-gray-500 italic">No events logged yet.</p>
              ) : (
                <div className="space-y-2">
                  {eventLog.map((log, index) => (
                    <div key={index} className="text-sm font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            This page is used to test server-to-server BIGO tracking functionality. Each button click will trigger a
            tracking event sent through your server. The event log shows the result of each tracking attempt.
          </p>
        </div>
      </div>
    </div>
  )
}
