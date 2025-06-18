"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import InitialContent from "@/components/initial-content"
import MedicareQuestion from "@/components/medicare-question"
import DmediQualifiedResult from "./qualified-result"
import NotQualifiedResult from "@/components/not-qualified-result"
import CountdownTimer from "@/components/countdown-timer"
import Footer from "@/components/footer"

export default function MedicareLandingPage() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState("initial-content")
  const [allowanceAmount, setAllowanceAmount] = useState("$2,500 Grocery Allowance")
  const [formattedAmount, setFormattedAmount] = useState("$2,500")
  const [has2500Amount, setHas2500Amount] = useState(true)

  // Audio refs - removed claim audio
  const medicareQuestionAudioRef = useRef<HTMLAudioElement>(null)
  const congratulationsAudioRef = useRef<HTMLAudioElement>(null)
  const congratulations2500AudioRef = useRef<HTMLAudioElement>(null)

  // Track if Medicare audio has already played to prevent duplicates
  const [medicareAudioPlayed, setMedicareAudioPlayed] = useState(false)

  useEffect(() => {
    // Get amount parameter from URL, but default to 2500
    const amountParam = searchParams.get("amount") || "2500"

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

  // Audio playback function with logging
  const playAudio = (audioRef: React.RefObject<HTMLAudioElement>, audioName: string) => {
    console.log(`Attempting to play audio: ${audioName}`)
    if (audioRef.current) {
      // Stop any currently playing audio first
      audioRef.current.pause()
      audioRef.current.currentTime = 0

      // Play with error handling
      audioRef.current.play().catch((error) => {
        console.error(`Audio playback failed for ${audioName}:`, error)
      })
    }
  }

  // Navigation handlers
  const handleInitialClaim = () => {
    // REMOVED CLAIM AUDIO - no audio plays when clicking "Claim Now"
    // Reset Medicare audio flag when starting over
    setMedicareAudioPlayed(false)
    // Skip age question and go directly to Medicare question
    setCurrentStep("medicare-question")
  }

  const handleMedicareSelection = (option: string) => {
    if (option === "Yes") {
      if (has2500Amount) {
        playAudio(congratulations2500AudioRef, "Congratulations 2500 Audio")
      } else {
        playAudio(congratulationsAudioRef, "Congratulations Audio")
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
    setMedicareAudioPlayed(false) // Reset for next time
  }

  const handleExploreOtherBenefits = () => {
    setCurrentStep("initial-content")
    setMedicareAudioPlayed(false) // Reset for next time
  }

  // Play Medicare question audio ONLY ONCE when that step is reached
  useEffect(() => {
    if (currentStep === "medicare-question" && !medicareAudioPlayed) {
      console.log("Medicare question step reached, playing audio...")
      // Small delay to ensure component is mounted
      const timer = setTimeout(() => {
        playAudio(medicareQuestionAudioRef, "Medicare Question Audio")
        setMedicareAudioPlayed(true) // Mark as played to prevent duplicates
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [currentStep, medicareAudioPlayed])

  return (
    <div className="min-h-screen bg-red-800">
      {/* Hidden audio elements - REMOVED CLAIM AUDIO */}
      <audio
        ref={medicareQuestionAudioRef}
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

          {currentStep === "medicare-question" && <MedicareQuestion onMedicareSelect={handleMedicareSelection} />}

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
