"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import InitialContent from "@/components/initial-content"
import AgeQuestion from "@/components/age-question"
import MedicareQuestion from "@/components/medicare-question"
import QualifiedResult from "@/components/qualified-result"
import NotQualifiedResult from "@/components/not-qualified-result"
import CountdownTimer from "@/components/countdown-timer"
import Footer from "@/components/footer"

export default function MedicareLandingPage() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState("initial-content")
  const [allowanceAmount, setAllowanceAmount] = useState("Health Allowance")
  const [formattedAmount, setFormattedAmount] = useState("")
  const [has2500Amount, setHas2500Amount] = useState(false)

  // Audio refs
  const claimAudioRef = useRef<HTMLAudioElement>(null)
  const ageSelectionAudioRef = useRef<HTMLAudioElement>(null)
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
      setAllowanceAmount(`${formatted} Health Allowance`)
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

  // Navigation handlers
  const handleInitialClaim = () => {
    playAudio(claimAudioRef)
    setCurrentStep("age-question")
  }

  const handleAgeSelection = () => {
    playAudio(ageSelectionAudioRef)
    setTimeout(() => {
      setCurrentStep("medicare-question")
    }, 500)
  }

  const handleMedicareSelection = (option: string) => {
    if (option === "Yes") {
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
      {/* Test Deployment Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => alert(`Deployment test successful! Current time: ${new Date().toLocaleString()}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
        >
          Test Deploy
        </button>
      </div>
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
            <QualifiedResult allowanceAmount={allowanceAmount} onFinalClaimClick={handleFinalClaim} />
          )}

          {currentStep === "not-qualified-result" && <NotQualifiedResult onExploreClick={handleExploreOtherBenefits} />}
        </div>

        <CountdownTimer />
        <Footer />
      </div>
    </div>
  )
}
