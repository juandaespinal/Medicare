"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface QualifiedResultProps {
  allowanceAmount: string
  onFinalClaimClick: () => void
}

export default function DinoMediQualifiedResult({ allowanceAmount, onFinalClaimClick }: QualifiedResultProps) {
  // Default phone number
  const defaultPhoneNumber = "+18554690274"
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState(defaultPhoneNumber)

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

  // Effect to handle phone number updates from Ringba
  useEffect(() => {
    console.log("DinoMediQualifiedResult component mounted - looking for Ringba number")

    // Listen for the custom Ringba event
    const handleRingbaNumberAssigned = (event: CustomEvent) => {
      const number = event.detail.number
      if (number && number !== defaultPhoneNumber) {
        console.log("Received Ringba number from custom event:", number)
        setDisplayPhoneNumber(number)
        updatePhoneDisplay(number)
      }
    }

    document.addEventListener("ringbaNumberAssigned", handleRingbaNumberAssigned as EventListener)

    // Check if there's already a current Ringba number
    if (window.currentRingbaNumber && window.currentRingbaNumber !== defaultPhoneNumber) {
      console.log("Found existing Ringba number:", window.currentRingbaNumber)
      setDisplayPhoneNumber(window.currentRingbaNumber)
      updatePhoneDisplay(window.currentRingbaNumber)
    }

    // Function to check if Ringba has assigned a number
    const checkRingbaNumber = () => {
      try {
        // Method 1: Check for _rgba global object and look for assigned numbers
        if (window._rgba) {
          console.log("Found _rgba object:", window._rgba)

          // Check if there are any assigned numbers in the _rgba object
          if (window._rgba.numbers && window._rgba.numbers.length > 0) {
            const numberValue = window._rgba.numbers[0]
            const number = extractPhoneNumber(numberValue)
            if (number && number !== defaultPhoneNumber) {
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
            if (number && number !== defaultPhoneNumber) {
              console.log("Found Ringba number from _rgba.data:", number)
              setDisplayPhoneNumber(number)
              updatePhoneDisplay(number)
              return true
            }
          }
        }

        // Method 2: Check for Ringba-modified DOM elements
        // Look for any phone numbers that have been dynamically replaced by Ringba
        const phoneElements = document.querySelectorAll('a[href^="tel:"], .phone-display, [data-ringba-number]')
        for (const el of phoneElements) {
          let number = null

          if (el.tagName === "A" && el.getAttribute("href")?.startsWith("tel:")) {
            // Extract the full tel: URL which might include tracking parameters
            const telHref = el.getAttribute("href")
            if (telHref && telHref !== `tel:${defaultPhoneNumber}`) {
              // Extract just the phone number part (before any query parameters)
              const phoneMatch = telHref.match(/tel:(\+?[\d\-$$$$\s]+)/)
              if (phoneMatch) {
                number = phoneMatch[1]
                console.log("Found Ringba number in tel: link:", number)
                setDisplayPhoneNumber(number)
                updatePhoneDisplay(number)
                return true
              }
            }
          }

          if (el.hasAttribute("data-ringba-number")) {
            number = extractPhoneNumber(el.getAttribute("data-ringba-number"))
            if (number && number !== defaultPhoneNumber) {
              console.log("Found Ringba number in data attribute:", number)
              setDisplayPhoneNumber(number)
              updatePhoneDisplay(number)
              return true
            }
          }

          // Check if the text content has been modified by Ringba
          const textContent = el.textContent?.trim()
          if (textContent && textContent !== formatPhoneNumber(defaultPhoneNumber)) {
            // Try to extract a phone number from the text
            const phoneMatch = textContent.match(/(\+?1?\s*$$?[\d]{3}$$?\s*[\d]{3}\s*[\d]{4})/)
            if (phoneMatch) {
              number = phoneMatch[1]
              console.log("Found Ringba number in text content:", number)
              setDisplayPhoneNumber(number)
              updatePhoneDisplay(number)
              return true
            }
          }
        }

        // Method 3: Check for global Ringba variables
        if (window.ringba_known_numbers && Object.keys(window.ringba_known_numbers).length > 0) {
          console.log("Found ringba_known_numbers:", window.ringba_known_numbers)
          for (const key in window.ringba_known_numbers) {
            if (window.ringba_known_numbers.hasOwnProperty(key)) {
              const numberValue = window.ringba_known_numbers[key]
              const number = extractPhoneNumber(numberValue)
              if (number && number !== defaultPhoneNumber) {
                console.log("Found Ringba number from known_numbers:", number)
                setDisplayPhoneNumber(number)
                updatePhoneDisplay(number)
                return true
              }
            }
          }
        }

        // Method 4: Check if window has a defaultRingbaNumber that's different from our default
        if (window.defaultRingbaNumber && window.defaultRingbaNumber !== defaultPhoneNumber) {
          const number = extractPhoneNumber(window.defaultRingbaNumber)
          if (number) {
            console.log("Using window.defaultRingbaNumber:", number)
            setDisplayPhoneNumber(number)
            updatePhoneDisplay(number)
            return true
          }
        }

        // Method 5: Look for any links with tel: that have tracking parameters (Ringba signature)
        const telLinks = document.querySelectorAll('a[href*="tel:"][href*="rtkcid"]')
        if (telLinks.length > 0) {
          const telHref = telLinks[0].getAttribute("href")
          if (telHref) {
            const phoneMatch = telHref.match(/tel:(\+?[\d]+)/)
            if (phoneMatch) {
              const number = phoneMatch[1]
              console.log("Found Ringba number with tracking parameters:", number)
              setDisplayPhoneNumber(number)
              updatePhoneDisplay(number)
              return true
            }
          }
        }
      } catch (error) {
        console.error("Error checking for Ringba number:", error)
      }

      return false
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

    // Clean up the frequent interval, timeout, and event listener when component unmounts
    return () => {
      clearInterval(frequentInterval)
      clearTimeout(timeoutId)
      document.removeEventListener("ringbaNumberAssigned", handleRingbaNumberAssigned as EventListener)
    }
  }, [defaultPhoneNumber])

  // Handle button click
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    // Check if there's a tel: link with Ringba tracking parameters
    const telLinks = document.querySelectorAll('a[href*="tel:"][href*="rtkcid"]')
    const phoneToCall = displayPhoneNumber || defaultPhoneNumber

    if (telLinks.length > 0) {
      // Use the full Ringba URL with tracking parameters
      const ringbaUrl = telLinks[0].getAttribute("href")
      if (ringbaUrl) {
        console.log("Using Ringba URL with tracking:", ringbaUrl)
        window.location.href = ringbaUrl
        return
      }
    }

    // Fallback to the display phone number
    console.log("Initiating call to:", phoneToCall)
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

          {/* Enhanced attention-grabbing button for qualified result */}
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-30 rounded-2xl"></div>

            <button
              ref={buttonRef}
              onClick={handleButtonClick}
              className="relative w-full max-w-lg mx-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-12 sm:py-10 px-6 sm:px-10 rounded-xl text-2xl sm:text-3xl shadow-2xl transition-all duration-200 ease-in-out border-4 border-yellow-400 animate-pulse"
              data-default-number={defaultPhoneNumber}
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
    currentRingbaNumber?: string
    ringbaNumberAssigned?: (number: string) => void
    _rgba?: {
      numbers?: any[]
      data?: any
      q: any[]
      loading?: boolean
      callback?: (data: any) => void
    }
    bge?: any
    bgdataLayer?: any[]
  }
}
