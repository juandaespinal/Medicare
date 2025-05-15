"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type React from "react"
import { Card } from "@/components/ui/card"
import { CheckCircle, Clock, ShieldCheck, ChevronRight, Phone } from "lucide-react"
import { useBigoTracking, handlePhoneCallTracking } from "@/utils/bigo-pixel-tracking"
import { trackButtonClick, trackPhoneCall, trackConversion } from "@/utils/bigo-tracking"

interface QualifiedResultProps {
  allowanceAmount: string
  onFinalClaimClick: () => void
}

export default function NewBigoQualifiedResult({ allowanceAmount, onFinalClaimClick }: QualifiedResultProps) {
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds
  const { trackPhoneConsultation, trackFormSubmission, isTracking } = useBigoTracking()

  // Default phone number
  const defaultPhoneNumber = "+18554690274"
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState(defaultPhoneNumber)

  // State to track if a call has been made
  const [callMade, setCallMade] = useState(false)
  // State to track if the user has returned from a call
  const [returnedFromCall, setReturnedFromCall] = useState(false)
  // Ref to store the time when the call was initiated
  const callStartTimeRef = useRef<number | null>(null)
  // Minimum call duration to consider it a valid call (in milliseconds)
  const MIN_CALL_DURATION = 10000 // 10 seconds

  // Reference to the button element
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Function to safely extract a string phone number from any value
  const extractPhoneNumber = (value: any): string | null => {
    if (!value) return null

    // If it's already a string, return it
    if (typeof value === "string") return value

    // If it's an object, try common properties
    if (typeof value === "object") {
      // Check for common phone number properties
      if (value.raw) return value.raw
      if (value.number) return value.number
      if (value.phone) return value.phone
      if (value.phoneNumber) return value.phoneNumber
      if (value.display) return value.display
      if (value.value) return value.value

      // Try to stringify if it has a toString method that's not the default Object.toString
      if (value.toString && value.toString !== Object.prototype.toString) {
        const str = value.toString()
        if (str !== "[object Object]") return str
      }
    }

    return null
  }

  // Function to format phone number for display
  const formatPhoneNumber = (phone: string): string => {
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
  }

  // Function to track when the page becomes visible again (user returns from call)
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "visible" && callMade && callStartTimeRef.current) {
      const callDuration = Date.now() - callStartTimeRef.current

      // Only consider it a completed call if the duration is longer than our minimum
      if (callDuration >= MIN_CALL_DURATION) {
        console.log(`User returned from call after ${callDuration}ms`)
        setReturnedFromCall(true)

        // Fire the conversion event
        trackConversion(1, "USD", {
          call_duration: callDuration,
          phone_number: displayPhoneNumber || defaultPhoneNumber,
          event_type: "call_completed",
        }).catch((error) => {
          console.error("Error tracking conversion:", error)
        })
      }
    }
  }, [callMade, displayPhoneNumber, defaultPhoneNumber])

  // Effect to handle phone number updates from Ringba
  useEffect(() => {
    console.log("NewBigoQualifiedResult component mounted - looking for Ringba number")

    // Function to check if Ringba has assigned a number
    const checkRingbaNumber = () => {
      try {
        // Method 1: Check for _rgba global object (new Ringba script)
        if (window._rgba) {
          console.log("Found _rgba object:", window._rgba)

          // Check for numbers property
          if (window._rgba.numbers && window._rgba.numbers.length > 0) {
            const numberValue = window._rgba.numbers[0]
            const number = extractPhoneNumber(numberValue)
            if (number) {
              console.log("Found Ringba number from _rgba.numbers:", number)
              setDisplayPhoneNumber(number)
              updatePhoneDisplay(number)
              return true
            }
          }

          // Check for data property
          if (window._rgba.data) {
            console.log("Found _rgba.data:", window._rgba.data)
            const number = extractPhoneNumber(window._rgba.data)
            if (number) {
              console.log("Found Ringba number from _rgba.data:", number)
              setDisplayPhoneNumber(number)
              updatePhoneDisplay(number)
              return true
            }
          }
        }

        // Method 2: Direct access to ringba_known_numbers
        if (window.ringba_known_numbers && Object.keys(window.ringba_known_numbers).length > 0) {
          console.log("Found ringba_known_numbers:", window.ringba_known_numbers)
          for (const key in window.ringba_known_numbers) {
            if (window.ringba_known_numbers.hasOwnProperty(key)) {
              const numberValue = window.ringba_known_numbers[key]
              const number = extractPhoneNumber(numberValue)
              if (number) {
                console.log("Found Ringba number from known_numbers:", number)
                setDisplayPhoneNumber(number)
                updatePhoneDisplay(number)
                return true
              }
            }
          }
        }

        // Method 3: Check global ringbaPhoneNumber object
        if (window.ringbaPhoneNumber) {
          console.log("Found ringbaPhoneNumber:", window.ringbaPhoneNumber)
          const number = extractPhoneNumber(window.ringbaPhoneNumber)
          if (number) {
            console.log("Found Ringba number from global object:", number)
            setDisplayPhoneNumber(number)
            updatePhoneDisplay(number)
            return true
          }
        }

        // Method 4: Look for Ringba-inserted DOM elements
        const ringbaElements = document.querySelectorAll('[data-ringba-number], .ringba-number, .rnum, a[href^="tel:"]')
        for (const el of ringbaElements) {
          let number = null

          if (el.hasAttribute("data-ringba-number")) {
            number = extractPhoneNumber(el.getAttribute("data-ringba-number"))
          } else if (el.tagName === "A" && el.getAttribute("href")?.startsWith("tel:")) {
            number = extractPhoneNumber(el.getAttribute("href")?.replace("tel:", ""))
          } else {
            number = extractPhoneNumber(el.textContent?.trim())
          }

          if (number && number !== defaultPhoneNumber) {
            console.log("Found Ringba number in DOM:", number)
            setDisplayPhoneNumber(number)
            updatePhoneDisplay(number)
            return true
          }
        }

        // Method 5: Check if window has a defaultRingbaNumber that's different from our default
        if (window.defaultRingbaNumber && window.defaultRingbaNumber !== defaultPhoneNumber) {
          const number = extractPhoneNumber(window.defaultRingbaNumber)
          if (number) {
            console.log("Using window.defaultRingbaNumber:", number)
            setDisplayPhoneNumber(number)
            updatePhoneDisplay(number)
            return true
          }
        }
      } catch (error) {
        console.error("Error checking for Ringba number:", error)
      }

      return false
    }

    // Function to directly update the phone display in the DOM
    const updatePhoneDisplay = (number: string) => {
      // Update the displayed phone number
      const phoneDisplay = document.getElementById("dynamic-phone-number")
      if (phoneDisplay) {
        phoneDisplay.textContent = formatPhoneNumber(number)
      }

      // Store the number on the button for direct access
      if (buttonRef.current) {
        buttonRef.current.setAttribute("data-ringba-number", number)
      }
    }

    // Initial check
    if (!checkRingbaNumber()) {
      // If no Ringba number found, use the default
      console.log("No Ringba number found initially, using default:", defaultPhoneNumber)
      updatePhoneDisplay(defaultPhoneNumber)
    }

    // Check frequently for the first 30 seconds
    const frequentInterval = setInterval(checkRingbaNumber, 500)

    // After 30 seconds, reduce check frequency
    const timeoutId = setTimeout(() => {
      clearInterval(frequentInterval)
      const lessFrequentInterval = setInterval(checkRingbaNumber, 3000)

      // Clean up the less frequent interval when component unmounts
      return () => {
        clearInterval(lessFrequentInterval)
      }
    }, 30000)

    // Clean up the frequent interval and timeout when component unmounts
    return () => {
      clearInterval(frequentInterval)
      clearTimeout(timeoutId)
    }
  }, [defaultPhoneNumber])

  // Set up visibility change listener to detect when user returns from call
  useEffect(() => {
    // Add visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Clean up
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [handleVisibilityChange])

  // Handle button click
  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // Prevent event propagation to stop any parent handlers
    e.stopPropagation()

    try {
      // Track button click
      await trackButtonClick("call_now", {
        phone_number: displayPhoneNumber || defaultPhoneNumber,
        allowance_amount: allowanceAmount,
      })

      // Track phone call
      await trackPhoneCall(displayPhoneNumber || defaultPhoneNumber, {
        call_type: "consultation",
        allowance_amount: allowanceAmount,
      })

      // Set call made state and store the start time
      setCallMade(true)
      callStartTimeRef.current = Date.now()
      console.log("Call initiated at:", new Date(callStartTimeRef.current).toISOString())

      // Use the current display phone number
      const phoneToCall = displayPhoneNumber || defaultPhoneNumber

      // Make the call
      console.log("Initiating call to:", phoneToCall)
      window.location.href = `tel:${phoneToCall}`
    } catch (error) {
      console.error("Error tracking call events:", error)

      // Still make the call even if tracking fails
      const phoneToCall = displayPhoneNumber || defaultPhoneNumber
      window.location.href = `tel:${phoneToCall}`
    }
  }

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle phone call button click
  const handleCallButtonClick = () => {
    const phoneNumber = "1-800-123-4567" // Replace with your actual phone number

    // Track both phone consultation and form submission events
    handlePhoneCallTracking(phoneNumber, trackPhoneConsultation, trackFormSubmission, () => {
      // After tracking is complete, initiate the phone call
      window.location.href = `tel:${phoneNumber}`
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-lg overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 text-white text-center">
          <h3 className="text-xl font-bold">Qualification Confirmed</h3>
        </div>

        <div className="p-4 text-center">
          <div className="flex justify-center mb-3">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <h4 className="text-2xl font-bold text-center mb-4">Congratulations! You Qualify!</h4>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
            <div className="flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-lg text-yellow-800 font-medium">
                Your {allowanceAmount} is reserved for the next{" "}
                <span className="font-bold">{formatTime(timeLeft)}</span>
              </p>
            </div>
          </div>

          <p className="text-xl mb-5">
            Click the button below now to talk to an advisor who will help you claim your {allowanceAmount}.
          </p>

          {/* Call Now Button */}
          <div className="mb-6">
            <button
              onClick={handleCallButtonClick}
              disabled={isTracking}
              className="relative w-full max-w-md mx-auto bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-xl shadow-lg flex items-center justify-center transition-all duration-200 disabled:opacity-70"
            >
              <Phone className="mr-2 h-5 w-5" />
              <span>{isTracking ? "Connecting..." : "Call Now: 1-800-123-4567"}</span>
            </button>
            <p className="text-sm text-gray-600 mt-2">Free consultation with a Medicare specialist</p>
          </div>

          {/* Enhanced attention-grabbing button for qualified result */}
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-30 rounded-2xl"></div>

            <button
              onClick={onFinalClaimClick}
              disabled={isTracking}
              className="relative w-full max-w-lg mx-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-12 sm:py-10 px-6 sm:px-10 rounded-xl text-2xl sm:text-3xl shadow-2xl transition-all duration-200 ease-in-out transform hover:scale-105 border-4 border-yellow-400 animate-pulse disabled:opacity-70"
            >
              <div className="absolute -right-3 -top-3 bg-yellow-400 text-red-700 text-sm font-bold px-2 py-1 rounded-full">
                FREE
              </div>
              <div className="flex items-center justify-center">
                <span>{isTracking ? "Processing..." : "CLAIM NOW"}</span>
                <ChevronRight className="ml-2 h-8 w-8" />
              </div>
            </button>
          </div>

          <div className="mt-3 flex justify-center items-center text-sm text-gray-600">
            <ShieldCheck className="h-4 w-4 mr-1.5" />
            <span>Your information is secure & confidential</span>
          </div>
        </div>
      </Card>
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
  }
}
