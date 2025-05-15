"use client"

import { useState, useEffect } from "react"
import { trackPageView, trackButtonClick, trackPhoneCall, trackConversion } from "@/utils/bigo-tracking"

export default function TestPage() {
  const [eventLog, setEventLog] = useState<string[]>([])

  // Track page view on mount
  useEffect(() => {
    const success = trackPageView("test_page")
    addToLog(`Page view tracked: ${success ? "Success" : "Failed"}`)
  }, [])

  // Add message to log
  const addToLog = (message: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev])
  }

  // Handle button click
  const handleButtonClick = (buttonName: string) => {
    const success = trackButtonClick(buttonName, { test: true, timestamp: Date.now() })
    addToLog(`Button click tracked (${buttonName}): ${success ? "Success" : "Failed"}`)
  }

  // Handle phone call
  const handlePhoneCall = () => {
    const phoneNumber = "+18554690274"
    const success = trackPhoneCall(phoneNumber, { test: true, timestamp: Date.now() })
    addToLog(`Phone call tracked: ${success ? "Success" : "Failed"}`)

    // Simulate a call
    setTimeout(() => {
      const convSuccess = trackConversion(1, "USD", {
        event_type: "test_call_completed",
        phone_number: phoneNumber,
        call_duration: 15000,
      })
      addToLog(`Conversion tracked: ${convSuccess ? "Success" : "Failed"}`)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">BIGO Tracking Test Page</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Test Actions</h2>

            <div className="space-y-4">
              <div>
                <button
                  onClick={() => handleButtonClick("test_button_1")}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Track Button Click 1
                </button>
              </div>

              <div>
                <button
                  onClick={() => handleButtonClick("test_button_2")}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Track Button Click 2
                </button>
              </div>

              <div>
                <button onClick={handlePhoneCall} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Track Phone Call + Conversion
                </button>
              </div>

              <div>
                <button
                  onClick={() => {
                    const success = trackPageView("manual_page_view")
                    addToLog(`Manual page view tracked: ${success ? "Success" : "Failed"}`)
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Track Manual Page View
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
            This page is used to test BIGO tracking functionality. Each button click will trigger a tracking event. The
            event log shows the result of each tracking attempt.
          </p>
        </div>
      </div>
    </div>
  )
}
