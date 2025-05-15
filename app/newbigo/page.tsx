"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import InitialContent from "@/components/initial-content"
import AgeQuestion from "@/components/age-question"
import MedicareQuestion from "@/components/medicare-question"
import NewBigoQualifiedResult from "./qualified-result"
import NotQualifiedResult from "@/components/not-qualified-result"
import CountdownTimer from "@/components/countdown-timer"
import Footer from "@/components/footer"
import { trackPageView } from "@/utils/tracking"

export default function NewBigoLandingPage() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState("initial-content")
  const [allowanceAmount, setAllowanceAmount] = useState("Grocery Allowance")
  const [formattedAmount, setFormattedAmount] = useState("")
  const [has2500Amount, setHas2500Amount] = useState(false)
  const pageLoadedRef = useRef(false)

  // Audio refs
  const claimAudioRef = useRef<HTMLAudioElement>(null)
  const ageSelectionAudioRef = useRef<HTMLAudioElement>(null)
  const congratulationsAudioRef = useRef<HTMLAudioElement>(null)
  const congratulations2500AudioRef = useRef<HTMLAudioElement>(null)

  // Fire BIGO page_view event when the component mounts
  useEffect(() => {
    if (pageLoadedRef.current) return
    pageLoadedRef.current = true

    console.log("NewBigoLandingPage component mounted, firing page_view event")

    // Function to fire BIGO page_view event
    const fireBigoPageView = () => {
      return trackPageView("newbigo_landing")
    }

    // Try to fire immediately
    const success = fireBigoPageView()

    // If not successful, try again after a delay
    if (!success) {
      setTimeout(() => {
        fireBigoPageView()
      }, 2000)
    }

    // Set up retry mechanism
    const retryInterval = setInterval(() => {
      if (window.bge && typeof window.bge === "function") {
        trackPageView("newbigo_landing_retry")
        clearInterval(retryInterval)
      }
    }, 5000)

    // Clean up
    return () => {
      clearInterval(retryInterval)
    }
  }, [])

  // Track step changes
  useEffect(() => {
    if (currentStep !== "initial-content") {
      try {
        if (window.bge && typeof window.bge === "function") {
          window.bge("event", "step_change", {
            step: currentStep,
            timestamp: new Date().toISOString(),
            event_id: `step_${currentStep}_${Math.random().toString(36).substring(2, 9)}`,
          })
          console.log(`Step changed to: ${currentStep}`)
        }
      } catch (e) {
        console.error("Error tracking step change:", e)
      }
    }
  }, [currentStep])

  useEffect(() => {
    // Get amount parameter from URL
    const amountParam = searchParams.get("amount")

    if (amountParam && !isNaN(Number(amountParam))) {
      // Format the amount as currency
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(amountParam))

      setFormattedAmount(formatted)
      setAllowanceAmount(`${formatted} Grocery Allowance`)
      setHas2500Amount(amountParam === "2500")
    }
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

  // Function to add UTM parameter to URL
  const addQualifiedParameter = () => {
    try {
      // Get current URL and create URL object
      const currentUrl = new URL(window.location.href)

      // Add qualifies=yes parameter
      currentUrl.searchParams.set("qualifies", "yes")

      // Update the URL without reloading the page
      window.history.replaceState({}, "", currentUrl.toString())

      console.log("Added qualifies=yes parameter to URL")
    } catch (error) {
      console.error("Error adding qualified parameter to URL:", error)
    }
  }

  // Navigation handlers
  const handleInitialClaim = () => {
    // Play the audio when the first "Claim Now" button is clicked
    playAudio(claimAudioRef)

    // Go to age question instead of directly to Medicare question
    setCurrentStep("age-question")
  }

  // Handle age selection
  const handleAgeSelection = () => {
    playAudio(ageSelectionAudioRef)

    // After age selection, proceed to Medicare question
    setTimeout(() => {
      setCurrentStep("medicare-question")
    }, 500)
  }

  const handleMedicareSelection = (option: string) => {
    if (option === "Yes") {
      // User qualifies - add UTM parameter
      addQualifiedParameter()

      if (has2500Amount) {
        playAudio(congratulations2500AudioRef)
      } else {
        playAudio(congratulationsAudioRef)
      }

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
    <div
      className="min-h-screen bg-red-800 bg-cover bg-center"
      style={{ backgroundImage: "url('images/red-texture-bg.jpg')" }}
    >
      {/* Hidden audio elements */}
      <audio
        ref={claimAudioRef}
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Let-s%20get%20you%20qualified%201-mtqeraGhqXqgNjUU8telTlJiYzijNn.wav"
        preload="auto"
      />
      <audio
        ref={ageSelectionAudioRef}
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/great%20we%20are%20almost%20done%206-UFDENAgMUCtRT0HVqKF5aXetOIH1fE.wav"
        preload="auto"
      />
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

      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="mb-3 text-center">{/* Header content */}</div>

        <div className="bg-white rounded-lg shadow-xl p-4 mb-4">
          {currentStep === "initial-content" && (
            <InitialContent allowanceAmount={allowanceAmount} onClaimClick={handleInitialClaim} />
          )}

          {currentStep === "age-question" && <AgeQuestion onAgeSelect={handleAgeSelection} />}

          {currentStep === "medicare-question" && <MedicareQuestion onMedicareSelect={handleMedicareSelection} />}

          {currentStep === "qualified-result" && (
            <NewBigoQualifiedResult allowanceAmount={allowanceAmount} onFinalClaimClick={handleFinalClaim} />
          )}

          {currentStep === "not-qualified-result" && <NotQualifiedResult onExploreClick={handleExploreOtherBenefits} />}
        </div>

        <CountdownTimer />
        <Footer />
      </div>
    </div>
  )
}
