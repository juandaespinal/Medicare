"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface QualifiedResultProps {
  allowanceAmount: string
  onFinalClaimClick: () => void
}

export default function DmediQualifiedResult({ allowanceAmount, onFinalClaimClick }: QualifiedResultProps) {
  // Default phone number - this MUST be the exact number Ringba will detect and replace
  const defaultPhoneNumber = "+18554690274"
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState(defaultPhoneNumber)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  // Reference to the button element
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Function to add debug info
  const addDebugInfo = (info: string) => {
    console.log("DEBUG:", info)
    setDebugInfo((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${info}`])
  }

  // Function to format phone number for display
  const formatPhoneNumber = (phone: string): string => {
    try {
      // Remove all non-digit characters
      const cleaned = phone.replace(/\D/g, "")

      // Format based on length
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
      } else if (cleaned.length === 11 && cleaned[0] === "1") {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
      }

      // If we can't format it, return the original
      return phone
    } catch (error) {
      console.error("Error formatting phone number:", error)
      return phone
    }
  }

  // Effect to handle Ringba number detection and replacement
  useEffect(() => {
    addDebugInfo("Component mounted, starting Ringba detection")

    // Function to check if Ringba has loaded and assigned a number
    const checkRingbaStatus = () => {
      addDebugInfo("Checking Ringba status...")

      // Method 1: Check _rgba object
      if (window._rgba && window._rgba.numbers && window._rgba.numbers.length > 0) {
        const assignedNumber = window._rgba.numbers[0]
        addDebugInfo(`Found number in _rgba.numbers: ${assignedNumber}`)
        if (assignedNumber && assignedNumber !== defaultPhoneNumber) {
          setDisplayPhoneNumber(assignedNumber)
          addDebugInfo(`Updated display number to: ${assignedNumber}`)
          return true
        }
      }

      // Method 2: Check ringba_known_numbers
      if (window.ringba_known_numbers && Object.keys(window.ringba_known_numbers).length > 0) {
        const numbers = Object.values(window.ringba_known_numbers)
        addDebugInfo(`Found ringba_known_numbers: ${JSON.stringify(numbers)}`)
        if (numbers.length > 0) {
          // Extract the phone number from the first number object
          const firstNumber = numbers[0] as any
          const phoneNumber = firstNumber.int || firstNumber.loc || firstNumber
          addDebugInfo(`Extracted phone number: ${phoneNumber}`)

          if (phoneNumber && typeof phoneNumber === "string" && phoneNumber !== defaultPhoneNumber) {
            setDisplayPhoneNumber(phoneNumber)
            addDebugInfo(`Updated display number from known_numbers: ${phoneNumber}`)
            return true
          }
        }
      }

      // Method 3: Check if any phone elements have been replaced by Ringba
      const phoneElements = document.querySelectorAll('a[href^="tel:"], .phone-display, #dynamic-phone-number')
      for (const element of phoneElements) {
        const href = element.getAttribute("href")
        const text = element.textContent

        if (href && href.startsWith("tel:") && href !== `tel:${defaultPhoneNumber}`) {
          const newNumber = href.replace("tel:", "")
          addDebugInfo(`Found replaced tel: link: ${newNumber}`)
          setDisplayPhoneNumber(newNumber)
          return true
        }

        if (text && text !== formatPhoneNumber(defaultPhoneNumber) && text.match(/$$\d{3}$$\s\d{3}-\d{4}/)) {
          addDebugInfo(`Found replaced text content: ${text}`)
          const digitsOnly = text.replace(/\D/g, "")
          setDisplayPhoneNumber(digitsOnly)
          return true
        }
      }

      return false
    }

    // Check immediately
    const initialCheck = setTimeout(() => {
      if (!checkRingbaStatus()) {
        addDebugInfo("No Ringba number detected initially")
      }
    }, 1000)

    // Continue checking periodically for 30 seconds
    const interval = setInterval(() => {
      if (checkRingbaStatus()) {
        clearInterval(interval)
        addDebugInfo("Ringba number detected, stopping checks")
      }
    }, 2000)

    // Stop checking after 30 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval)
      addDebugInfo("Stopped checking for Ringba after 30 seconds")
    }, 30000)

    // Cleanup
    return () => {
      clearTimeout(initialCheck)
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [defaultPhoneNumber])

  // Handle button click
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const phoneToCall = displayPhoneNumber || defaultPhoneNumber
    addDebugInfo(`Call initiated to: ${phoneToCall}`)

    // Make the call
    window.location.href = `tel:${phoneToCall}`
  }

  return (
    <div className="max-w-2xl mx-auto qualified-result">
      <div className="border-0 shadow-lg overflow-hidden mb-6 rounded-lg">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 text-white text-center">
          <h3 className="text-xl font-bold">Qualification Confirmed</h3>
        </div>

        <div className="p-4 text-center">
          <div className="flex justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          <h4 className="text-2xl font-bold text-center mb-4">Congratulations! You Qualify!</h4>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-600 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <p className="text-lg text-yellow-800 font-medium">
                Your {allowanceAmount} is reserved for the next 15 minutes
              </p>
            </div>
          </div>

          <p className="text-xl mb-5">
            Call{" "}
            <span className="font-bold phone-display" id="dynamic-phone-number">
              {formatPhoneNumber(displayPhoneNumber)}
            </span>{" "}
            now to speak with an advisor who will help you claim your {allowanceAmount}.
          </p>

          {/* Debug info panel - only show in development or when there are debug messages */}
          {debugInfo.length > 0 && (
            <div className="mb-4 p-3 bg-gray-100 text-xs text-left max-h-40 overflow-y-auto">
              <div className="font-bold mb-2">Debug Info:</div>
              {debugInfo.map((info, index) => (
                <div key={index} className="mb-1">
                  {info}
                </div>
              ))}
            </div>
          )}

          {/* Enhanced attention-grabbing button for qualified result */}
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-30 rounded-2xl"></div>

            <button
              ref={buttonRef}
              onClick={handleButtonClick}
              className="relative w-full max-w-lg mx-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-12 sm:py-10 px-6 sm:px-10 rounded-xl text-2xl sm:text-3xl shadow-2xl transition-all duration-200 ease-in-out border-4 border-yellow-400 animate-pulse"
              data-default-number={defaultPhoneNumber}
              data-ringba-number={displayPhoneNumber}
            >
              <div className="absolute -right-3 -top-3 bg-yellow-400 text-red-700 text-sm font-bold px-2 py-1 rounded-full">
                FREE
              </div>
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>CALL NOW</span>
              </div>
            </button>
          </div>

          <div className="mt-3 flex justify-center items-center text-sm text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Your information is secure & confidential</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add TypeScript interface for the global window object
declare global {
  interface Window {
    ringba_known_numbers?: Record<string, any>
    ringbaPhoneNumber?: any
    defaultRingbaNumber?: string
    _rgba?: {
      numbers?: any[]
      data?: any
      q: any[]
      loading?: boolean
    }
    rtkClickID?: string
    debugInfo?: {
      scriptsLoaded: string[]
      errors: string[]
    }
  }
}
