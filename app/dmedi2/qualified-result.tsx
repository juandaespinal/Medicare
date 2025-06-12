"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Gift, DollarSign, Clock, Star, CheckCircle, Phone, Sparkles, ArrowDown } from "lucide-react"

interface QualifiedResultProps {
  allowanceAmount: string
  onFinalClaimClick: () => void
}

export default function DmediQualifiedResult({ allowanceAmount, onFinalClaimClick }: QualifiedResultProps) {
  // Default phone number - this MUST be the exact number Ringba will detect and replace
  const defaultPhoneNumber = "+18445700294"
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState(defaultPhoneNumber)

  // Reference to the button element
  const buttonRef = useRef<HTMLButtonElement>(null)

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
    console.log("Ringba: Component mounted, starting detection")

    // Function to check if Ringba has loaded and assigned a number
    const checkRingbaStatus = () => {
      console.log("Ringba: Checking status...")
      console.log("Ringba: Current display number:", displayPhoneNumber)
      console.log("Ringba: Default number:", defaultPhoneNumber)
      console.log("Ringba: Window _rgba object:", window._rgba)
      console.log("Ringba: Known numbers:", window.ringba_known_numbers)

      // Method 1: Check _rgba object
      if (window._rgba && window._rgba.numbers && window._rgba.numbers.length > 0) {
        const assignedNumber = window._rgba.numbers[0]
        console.log(`Found number in _rgba.numbers: ${assignedNumber}`)
        if (assignedNumber && assignedNumber !== defaultPhoneNumber) {
          setDisplayPhoneNumber(assignedNumber)
          console.log(`Updated display number to: ${assignedNumber}`)
          return true
        }
      }

      // Method 2: Check ringba_known_numbers
      if (window.ringba_known_numbers && Object.keys(window.ringba_known_numbers).length > 0) {
        const numbers = Object.values(window.ringba_known_numbers)
        console.log("Ringba: Found known numbers:", numbers.length)
        if (numbers.length > 0) {
          // Extract the phone number from the first number object
          const firstNumber = numbers[0] as any
          const phoneNumber = firstNumber.int || firstNumber.loc || firstNumber
          console.log("Ringba: Extracted number:", phoneNumber)

          if (phoneNumber && typeof phoneNumber === "string" && phoneNumber !== defaultPhoneNumber) {
            setDisplayPhoneNumber(phoneNumber)
            console.log("Ringba: Updated display number:", phoneNumber)
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
          console.log(`Found replaced tel: link: ${newNumber}`)
          setDisplayPhoneNumber(newNumber)
          return true
        }

        if (text && text !== formatPhoneNumber(defaultPhoneNumber) && text.match(/$$\d{3}$$\s\d{3}-\d{4}/)) {
          console.log(`Found replaced text content: ${text}`)
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
        console.log("Ringba: No number detected initially")
      }
    }, 1000)

    // Continue checking periodically for 30 seconds
    const interval = setInterval(() => {
      if (checkRingbaStatus()) {
        clearInterval(interval)
        console.log("Ringba: Number detected, stopping checks")
      }
    }, 2000)

    // Stop checking after 30 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval)
      console.log("Ringba: Stopped checking after 30 seconds")
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
    console.log("Ringba: Call initiated to:", phoneToCall)

    // Make the call
    window.location.href = `tel:${phoneToCall}`
  }

  return (
    <div className="max-w-4xl mx-auto qualified-result">
      {/* ABOVE THE FOLD - MASSIVE CALL SECTION */}
      <div className="mb-6">
        {/* Celebration Header - Compact for mobile */}
        <div className="text-center mb-4">
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 p-3 md:p-4 rounded-2xl border-4 border-yellow-500 shadow-2xl animate-pulse">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-yellow-700 animate-spin" />
              <h1 className="text-xl md:text-3xl font-black text-yellow-800">🎉 APPROVED! 🎉</h1>
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-yellow-700 animate-spin" />
            </div>
            <p className="text-sm md:text-xl font-bold text-yellow-800">$4,720 IN BENEFITS RESERVED!</p>
          </div>
        </div>

        {/* MASSIVE CALL TO ACTION - ABOVE THE FOLD */}
        <div className="bg-white border-4 border-red-500 rounded-3xl p-4 md:p-6 shadow-2xl mb-4 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-yellow-50 to-red-50 opacity-50"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-2 left-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute top-4 right-4 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-2 left-4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          </div>

          <div className="relative z-10 text-center">
            {/* Urgency Timer */}
            <div className="bg-red-100 border-3 border-red-400 rounded-xl p-4 mb-5">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="w-6 h-6 md:w-8 md:h-8 text-red-600 animate-pulse" />
                <h2 className="text-lg md:text-2xl font-black text-red-800">⏰ 15 MINUTES LEFT!</h2>
                <Clock className="w-6 h-6 md:w-8 md:h-8 text-red-600 animate-pulse" />
              </div>
              <p className="text-sm md:text-lg font-bold text-red-700">Your benefits expire if you don't call now!</p>
            </div>

            {/* GIANT CALL BUTTON */}
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-red-400 blur-2xl opacity-60 rounded-3xl animate-pulse"></div>
              <a
                href={`tel:${displayPhoneNumber}`}
                className="relative block w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white font-black py-10 md:py-14 px-6 md:px-8 rounded-3xl text-2xl md:text-4xl shadow-2xl transition-all duration-300 transform hover:scale-105 border-6 border-yellow-400 size-pulse"
                data-default-number={defaultPhoneNumber}
                data-ringba-number={displayPhoneNumber}
              >
                <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-yellow-400 text-red-700 text-sm md:text-lg font-black px-3 py-2 rounded-full animate-bounce shadow-lg">
                  FREE CALL
                </div>
                <div className="flex flex-col items-center justify-center space-y-3 md:space-y-5">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <Phone className="w-8 h-8 md:w-12 md:h-12 animate-pulse" />
                    <span>CALL NOW</span>
                    <Phone className="w-8 h-8 md:w-12 md:h-12 animate-pulse" />
                  </div>
                  <div className="text-lg md:text-2xl">CLAIM $4,720 BENEFITS</div>
                  <div className="text-base md:text-xl bg-red-800 px-4 py-2 rounded-full">
                    {formatPhoneNumber(displayPhoneNumber)}
                  </div>
                </div>
              </a>
            </div>

            {/* Quick Benefits Summary */}
            <div className="bg-green-50 border-3 border-green-400 rounded-xl p-3 md:p-4">
              <h3 className="text-lg md:text-xl font-black text-green-800 mb-2">🎯 WHAT YOU'RE CLAIMING:</h3>
              <div className="grid grid-cols-2 gap-2 md:gap-4 text-center">
                <div className="bg-white p-2 md:p-3 rounded-lg border-2 border-green-300">
                  <div className="text-xl md:text-2xl font-black text-green-600">$2,500</div>
                  <div className="text-xs md:text-sm font-bold text-green-700">Grocery Card</div>
                </div>
                <div className="bg-white p-2 md:p-3 rounded-lg border-2 border-blue-300">
                  <div className="text-xl md:text-2xl font-black text-blue-600">$185/mo</div>
                  <div className="text-xs md:text-sm font-bold text-blue-700">SS Bonus</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-gray-600 font-bold text-sm animate-bounce">
            <ArrowDown className="w-5 h-5" />
            <span>See your full benefits below</span>
            <ArrowDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* BELOW THE FOLD - DETAILED BENEFITS */}
      <div className="space-y-6">
        {/* Benefits Showcase */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Grocery Allowance */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-6 rounded-2xl border-4 border-green-400 shadow-xl">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-3 md:mb-4">
                <Gift className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
                <h3 className="text-xl md:text-2xl font-black text-green-700">GROCERY BENEFIT</h3>
              </div>
              <div className="bg-green-600 text-white p-3 md:p-4 rounded-xl mb-3 md:mb-4 shadow-lg">
                <span className="text-3xl md:text-4xl font-black">$2,500</span>
                <div className="text-sm md:text-lg">Grocery Allowance Card</div>
              </div>
              <div className="flex justify-center mb-3 md:mb-4">
                <img
                  src="/allowance-card.png"
                  alt="$2,500 Grocery Allowance Card"
                  className="max-w-full h-auto rounded-lg shadow-lg border-2 border-green-300"
                  style={{ maxWidth: "200px" }}
                />
              </div>
              <div className="space-y-2 text-green-700 font-semibold text-sm md:text-base">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Use at ANY grocery store</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                  <span>No restrictions on food items</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Covers organic & specialty foods</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Security Bonus */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 rounded-2xl border-4 border-blue-400 shadow-xl">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-3 md:mb-4">
                <DollarSign className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                <h3 className="text-xl md:text-2xl font-black text-blue-700">MONTHLY BONUS</h3>
              </div>
              <div className="bg-blue-600 text-white p-3 md:p-4 rounded-xl mb-3 md:mb-4 shadow-lg">
                <span className="text-3xl md:text-4xl font-black">$185</span>
                <div className="text-sm md:text-lg">Every Month</div>
              </div>
              <div className="flex justify-center mb-3 md:mb-4">
                <img
                  src="/social-security-check.png"
                  alt="$185 Monthly Social Security Bonus Check"
                  className="max-w-full h-auto rounded-lg shadow-lg border-2 border-blue-300"
                  style={{ maxWidth: "200px" }}
                />
              </div>
              <div className="space-y-2 text-blue-700 font-semibold text-sm md:text-base">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Added to your Social Security</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Automatic monthly payments</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                  <span>$2,220 extra income per year</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Value Display */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-4 border-purple-400 rounded-2xl p-4 md:p-6 text-center shadow-xl">
          <h3 className="text-xl md:text-2xl font-black text-purple-800 mb-3">🎯 YOUR TOTAL BENEFIT VALUE</h3>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4 text-2xl md:text-3xl font-black">
            <span className="text-green-600">$2,500</span>
            <span className="text-gray-500">+</span>
            <span className="text-blue-600">$2,220/year</span>
            <span className="text-gray-500">=</span>
            <span className="text-purple-600 text-3xl md:text-4xl">$4,720!</span>
          </div>
          <p className="text-base md:text-lg text-purple-700 font-bold mt-2">
            That's like getting a $393 monthly raise!
          </p>
        </div>

        {/* Second Call Button - Sticky for mobile */}
        <div className="bg-red-50 border-4 border-red-400 rounded-2xl p-4 md:p-6 text-center shadow-xl">
          <h3 className="text-xl md:text-2xl font-black text-red-800 mb-3">📞 DON'T LOSE YOUR BENEFITS!</h3>
          <p className="text-base md:text-lg font-bold text-red-700 mb-4">
            Call {formatPhoneNumber(displayPhoneNumber)} now before your 15-minute reservation expires!
          </p>

          <a
            href={`tel:${displayPhoneNumber}`}
            className="block w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-black py-6 md:py-8 px-4 md:px-6 rounded-2xl text-xl md:text-2xl shadow-xl transition-all duration-300 transform hover:scale-105 border-4 border-yellow-400 animate-pulse"
            data-default-number={defaultPhoneNumber}
            data-ringba-number={displayPhoneNumber}
          >
            <div className="flex items-center justify-center space-x-3">
              <Phone className="w-6 h-6 md:w-8 md:h-8" />
              <span>CALL {formatPhoneNumber(displayPhoneNumber)}</span>
              <Phone className="w-6 h-6 md:w-8 md:h-8" />
            </div>
          </a>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 text-center text-xs md:text-sm bg-gray-50 p-3 md:p-4 rounded-xl border-2 border-gray-200">
          <div className="flex flex-col items-center">
            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600 mb-1 md:mb-2" />
            <p className="font-bold">100% FREE</p>
            <p className="text-gray-600">No hidden fees</p>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mb-1 md:mb-2" />
            <p className="font-bold">FAST PROCESSING</p>
            <p className="text-gray-600">72 hour approval</p>
          </div>
          <div className="flex flex-col items-center">
            <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-600 mb-1 md:mb-2" />
            <p className="font-bold">GOVERNMENT APPROVED</p>
            <p className="text-gray-600">Official benefits</p>
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
