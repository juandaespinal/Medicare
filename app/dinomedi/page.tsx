"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import InitialContent from "@/components/initial-content"
import MedicareQuestion from "@/components/medicare-question"
import DinoMediQualifiedResult from "./qualified-result"
import NotQualifiedResult from "@/components/not-qualified-result"
import CountdownTimer from "@/components/countdown-timer"
import Footer from "@/components/footer"

export default function DinoMediLandingPage() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState("initial-content")
  const [allowanceAmount, setAllowanceAmount] = useState("Grocery Allowance")
  const [formattedAmount, setFormattedAmount] = useState("")
  const [has2500Amount, setHas2500Amount] = useState(false)

  // Audio refs
  const congratulationsAudioRef = useRef<HTMLAudioElement>(null)
  const congratulations2500AudioRef = useRef<HTMLAudioElement>(null)

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
    // Skip age question and go directly to Medicare question without playing audio
    setCurrentStep("medicare-question")
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

          {currentStep === "medicare-question" && <MedicareQuestion onMedicareSelect={handleMedicareSelection} />}

          {currentStep === "qualified-result" && (
            <DinoMediQualifiedResult allowanceAmount={allowanceAmount} onFinalClaimClick={handleFinalClaim} />
          )}

          {currentStep === "not-qualified-result" && <NotQualifiedResult onExploreClick={handleExploreOtherBenefits} />}
        </div>

        <CountdownTimer />
        <Footer />
      </div>
    </div>
  )
}
