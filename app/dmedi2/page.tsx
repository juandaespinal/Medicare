"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import DmediQualifiedResult from "./qualified-result"
import NotQualifiedResult from "@/components/not-qualified-result"
import CountdownTimer from "@/components/countdown-timer"
import Footer from "@/components/footer"
import { ChevronRight, CheckCircle, XCircle, Clock, Gift, DollarSign } from "lucide-react"

export default function MedicareLandingPage() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState("initial-content")
  const [allowanceAmount, setAllowanceAmount] = useState("$2,500 Grocery Allowance")
  const [formattedAmount, setFormattedAmount] = useState("$2,500")
  const [has2500Amount, setHas2500Amount] = useState(true)

  // Audio refs
  const congratulationsAudioRef = useRef<HTMLAudioElement>(null)
  const congratulations2500AudioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Always set to $2500 for grocery allowance
    setFormattedAmount("$2,500")
    setAllowanceAmount("$2,500 Grocery Allowance")
    setHas2500Amount(true)
  }, [searchParams])

  // Audio playback function
  const playAudio = (audioRef: React.RefObject<HTMLAudioElement>) => {
    if (audioRef.current) {
      // Reset to beginning
      audioRef.current.currentTime = 0

      // Play with error handling
      audioRef.current.play().catch((error) => {
        console.error("Audio playback failed:", error)
      })
    }
  }

  // Navigation handlers
  const handleMedicareSelection = (option: string) => {
    if (option === "Yes") {
      playAudio(congratulations2500AudioRef)
      setTimeout(() => {
        setCurrentStep("qualified-result")
      }, 500)
    } else {
      setCurrentStep("not-qualified-result")
    }
  }

  const handleFinalClaim = () => {
    alert("Thank you! A Medicare benefits specialist will contact you shortly.")
    setCurrentStep("initial-content")
  }

  const handleExploreOtherBenefits = () => {
    setCurrentStep("initial-content")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-700 to-red-900">
      {/* Hidden audio elements */}
      <audio
        ref={congratulationsAudioRef}
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Congratulations%20It%20looks-ioNmTiUC6kPduBw8jU4hlxcu0m0JTY.wav"
        preload="auto"
      />
      <audio
        ref={congratulations2500AudioRef}
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Congratulations%20It%20looks%202500-pzvxJtQUtpHomiaNMFN077E2LYgnVc.wav"
        preload="auto"
      />

      <div className="container mx-auto px-3 py-2 max-w-5xl">
        {/* Urgency Banner */}
        <div className="bg-yellow-400 text-black text-center py-2 mb-3 rounded-lg font-bold animate-pulse text-sm">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>⚡ LIMITED TIME: 2024 Benefits Still Available ⚡</span>
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-4 mb-4 border-4 border-yellow-400">
          {currentStep === "initial-content" && (
            <div>
              {/* ABOVE THE FOLD - Qualification Check First */}
              <div className="text-center mb-4">
                <h1 className="text-2xl md:text-4xl font-black mb-2 leading-tight">
                  <span className="text-green-600">$2,500 GROCERY CARD</span>
                  <br />
                  <span className="text-red-600">+ $185 MONTHLY BONUS</span>
                </h1>
                <div className="bg-yellow-300 text-black p-2 rounded-lg font-bold text-lg mb-3">
                  🎯 TOTAL VALUE: <span className="text-xl">$4,720/YEAR!</span>
                </div>
              </div>

              {/* QUALIFICATION CHECK - ABOVE THE FOLD */}
              <div className="bg-gradient-to-r from-purple-100 via-blue-100 to-green-100 border-4 border-purple-400 rounded-2xl p-4 md:p-6 mb-6 shadow-2xl relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                  <div className="absolute top-4 right-4 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-2 left-4 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                </div>

                <div className="text-center mb-4 relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full mb-3 animate-pulse shadow-lg">
                    <span className="text-2xl font-bold">?</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-gray-800 mb-2">🎯 INSTANT QUALIFICATION</h2>
                  <div className="bg-white border-3 border-yellow-400 p-3 md:p-4 rounded-xl shadow-lg mb-3">
                    <p className="text-lg md:text-xl font-bold text-gray-700 mb-2">One simple question:</p>
                    <h3 className="text-xl md:text-2xl font-black text-purple-700">
                      Do you have Medicare Parts A and B?
                    </h3>
                  </div>
                  <div className="bg-red-100 border-2 border-red-400 p-2 rounded-lg">
                    <p className="text-red-800 font-bold text-sm">⏰ Benefits expire Dec 31st - Don't wait!</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
                  <button
                    onClick={() => handleMedicareSelection("Yes")}
                    className="group relative bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white font-black py-6 md:py-8 px-6 md:px-8 rounded-2xl text-xl md:text-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl senior-button size-pulse border-4 border-green-300"
                  >
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-6 h-6 md:w-8 md:h-8" />
                        <span>YES, I HAVE BOTH</span>
                        <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
                      </div>
                      <div className="text-xs md:text-sm bg-green-800 px-2 py-1 rounded-full">
                        ✓ CLAIM $4,720 BENEFITS
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity"></div>
                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                      MOST POPULAR
                    </div>
                  </button>

                  <button
                    onClick={() => handleMedicareSelection("No")}
                    className="group relative bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-black py-6 md:py-8 px-6 md:px-8 rounded-2xl text-xl md:text-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl senior-button border-4 border-gray-300"
                  >
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-6 h-6 md:w-8 md:h-8" />
                        <span>NO, I DON'T</span>
                        <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
                      </div>
                      <div className="text-xs md:text-sm bg-gray-700 px-2 py-1 rounded-full">SEE OTHER OPTIONS</div>
                    </div>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity"></div>
                  </button>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 text-purple-700 font-bold text-sm md:text-lg bg-white px-4 py-2 rounded-full shadow-lg">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                    <span>👆 Click your answer above 👆</span>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* BELOW THE FOLD - Detailed Benefits */}
              <div className="space-y-6">
                {/* Social Proof - Compact */}
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs md:text-sm">
                    <div>
                      <div className="text-lg md:text-xl font-black text-green-600">847K+</div>
                      <div className="text-gray-600">Qualified</div>
                    </div>
                    <div>
                      <div className="text-lg md:text-xl font-black text-blue-600">$1.2B</div>
                      <div className="text-gray-600">Claimed</div>
                    </div>
                    <div>
                      <div className="text-lg md:text-xl font-black text-red-600">72hrs</div>
                      <div className="text-gray-600">Processing</div>
                    </div>
                  </div>
                </div>

                {/* Benefits Display - Compact */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Grocery Allowance Card */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-400 shadow-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Gift className="w-6 h-6 text-green-600" />
                        <h3 className="text-lg font-black text-green-700">GROCERY BENEFIT</h3>
                      </div>
                      <div className="bg-green-600 text-white p-2 rounded-lg mb-3">
                        <span className="text-2xl font-black">$2,500</span>
                        <div className="text-xs">For Food & Groceries</div>
                      </div>
                      <div className="flex justify-center mb-3">
                        <img
                          src="/allowance-card.png"
                          alt="$2,500 Grocery Allowance Card"
                          className="max-w-full h-auto rounded-lg shadow-lg border-2 border-green-300"
                          style={{ maxWidth: "200px" }}
                        />
                      </div>
                      <div className="text-xs text-green-700 font-semibold">
                        ✓ ANY grocery store • ✓ No restrictions • ✓ Organic foods
                      </div>
                    </div>
                  </div>

                  {/* Social Security Bonus */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-400 shadow-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-black text-blue-700">MONTHLY BONUS</h3>
                      </div>
                      <div className="bg-blue-600 text-white p-2 rounded-lg mb-3">
                        <span className="text-2xl font-black">$185</span>
                        <div className="text-xs">Every Month</div>
                      </div>
                      <div className="flex justify-center mb-3">
                        <img
                          src="/social-security-check.png"
                          alt="$185 Monthly Social Security Bonus Check"
                          className="max-w-full h-auto rounded-lg shadow-lg border-2 border-blue-300"
                          style={{ maxWidth: "200px" }}
                        />
                      </div>
                      <div className="text-xs text-blue-700 font-semibold">
                        ✓ Added to Social Security • ✓ Automatic • ✓ $2,220/year extra
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators - Compact */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-gray-50 p-3 rounded-xl border-2 border-gray-200">
                  <div className="flex flex-col items-center">
                    <CheckCircle className="w-6 h-6 text-green-600 mb-1" />
                    <p className="font-bold">100% FREE</p>
                    <p className="text-gray-600">No costs</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Clock className="w-6 h-6 text-blue-600 mb-1" />
                    <p className="font-bold">INSTANT</p>
                    <p className="text-gray-600">30 seconds</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Gift className="w-6 h-6 text-purple-600 mb-1" />
                    <p className="font-bold">NO OBLIGATION</p>
                    <p className="text-gray-600">Just checking</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === "qualified-result" && (
            <DmediQualifiedResult allowanceAmount={allowanceAmount} onFinalClaimClick={handleFinalClaim} />
          )}

          {currentStep === "not-qualified-result" && <NotQualifiedResult onExploreClick={handleExploreOtherBenefits} />}
        </div>

        <CountdownTimer />
        <Footer />
      </div>
    </div>
  )
}
