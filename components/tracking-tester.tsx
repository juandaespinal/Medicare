"use client"

import { useState, useEffect } from "react"
import {
  enableTrackingDebug,
  disableTrackingDebug,
  checkServerToServerTracking,
  testServerToServerTracking,
} from "@/utils/tracking-debug"
import { trackPageView, trackButtonClick } from "@/utils/bigo-tracking"

export default function TrackingTester() {
  const [isDebugEnabled, setIsDebugEnabled] = useState(false)
  const [trackingStatus, setTrackingStatus] = useState({ configured: false, message: "Checking..." })
  const [testResults, setTestResults] = useState<Array<{ name: string; success: boolean; message: string }>>([])
  const [isExpanded, setIsExpanded] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [pixelId, setPixelId] = useState<string>("")

  // Check tracking status on mount
  useEffect(() => {
    checkTrackingStatus()
    getPixelId()
  }, [])

  // Get pixel ID from the API
  const getPixelId = async () => {
    try {
      const response = await fetch("/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "check_pixel_id",
          test: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      if (data.pixel_id) {
        setPixelId(data.pixel_id)
      }
    } catch (error) {
      console.error("Error fetching pixel ID:", error)
    }
  }

  // Check tracking status
  const checkTrackingStatus = async () => {
    setIsLoading(true)
    const status = await checkServerToServerTracking()
    setTrackingStatus(status)
    setIsLoading(false)
  }

  // Toggle debug mode
  const toggleDebug = () => {
    if (isDebugEnabled) {
      disableTrackingDebug()
      setIsDebugEnabled(false)
    } else {
      enableTrackingDebug()
      setIsDebugEnabled(true)
    }
  }

  // Run tracking tests
  const runTests = async () => {
    setIsLoading(true)
    const results: Array<{ name: string; success: boolean; message: string }> = []

    // Test 1: Check if server-to-server tracking is configured
    const status = await checkServerToServerTracking()
    results.push({
      name: "S2S Configuration",
      success: status.configured,
      message: status.message,
    })

    // Test 2: Send a test event
    const testEventSuccess = await testServerToServerTracking()
    results.push({
      name: "Send Test Event",
      success: testEventSuccess,
      message: testEventSuccess ? "Test event sent successfully" : "Failed to send test event",
    })

    // Test 3: Track page view
    try {
      const pageViewSuccess = await trackPageView("test_page")
      results.push({
        name: "Track Page View",
        success: !!pageViewSuccess,
        message: pageViewSuccess ? "Page view tracked successfully" : "Failed to track page view",
      })
    } catch (error) {
      results.push({
        name: "Track Page View",
        success: false,
        message: `Error: ${(error as Error).message}`,
      })
    }

    // Test 4: Track button click
    try {
      const buttonClickSuccess = await trackButtonClick("test_button", { test_data: "test_value" })
      results.push({
        name: "Track Button Click",
        success: !!buttonClickSuccess,
        message: buttonClickSuccess ? "Button click tracked successfully" : "Failed to track button click",
      })
    } catch (error) {
      results.push({
        name: "Track Button Click",
        success: false,
        message: `Error: ${(error as Error).message}`,
      })
    }

    setTestResults(results)
    setIsLoading(false)
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div
          className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h3 className="text-sm font-medium">S2S BIGO Tracking Tester</h3>
          <span>{isExpanded ? "▼" : "▲"}</span>
        </div>

        {isExpanded && (
          <div className="p-4 max-w-md">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Tracking Status:</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${trackingStatus.configured ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {trackingStatus.configured ? "Configured" : "Not Configured"}
                </span>
              </div>
              <p className="text-xs text-gray-500">{trackingStatus.message}</p>
              {pixelId && (
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Pixel ID:</strong> {pixelId}
                </p>
              )}
            </div>

            <div className="flex space-x-2 mb-4">
              <button
                onClick={toggleDebug}
                className={`text-xs px-3 py-1 rounded ${isDebugEnabled ? "bg-red-600 text-white" : "bg-blue-600 text-white"}`}
                disabled={isLoading}
              >
                {isDebugEnabled ? "Disable Debug" : "Enable Debug"}
              </button>

              <button
                onClick={runTests}
                className="text-xs px-3 py-1 rounded bg-green-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Running..." : "Run Tests"}
              </button>

              <button
                onClick={checkTrackingStatus}
                className="text-xs px-3 py-1 rounded bg-gray-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Checking..." : "Refresh Status"}
              </button>
            </div>

            {testResults.length > 0 && (
              <div className="border-t border-gray-200 pt-3">
                <h4 className="text-sm font-medium mb-2">Test Results:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-xs p-2 rounded bg-gray-50">
                      <div className="flex justify-between">
                        <span className="font-medium">{result.name}:</span>
                        <span className={result.success ? "text-green-600" : "text-red-600"}>
                          {result.success ? "Success" : "Failed"}
                        </span>
                      </div>
                      <p className="text-gray-500 mt-1">{result.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500">
              <p>Server-to-server tracking sends events through your server instead of directly from the browser.</p>
              <p className="mt-1">
                Client-side fallback is enabled to ensure tracking continues even if server-side fails.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
