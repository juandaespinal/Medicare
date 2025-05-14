"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Clock, ShieldCheck, ChevronRight } from "lucide-react"

type Step = {
  question?: string
  options?: string[]
  isEnd?: boolean
  isQualified?: boolean
  isInitial?: boolean
}

interface QuestionsFormProps {
  onFormStart?: () => void
  onFormComplete?: () => void
  formStarted?: boolean
  largerText?: boolean
  seniorFriendly?: boolean
  amount?: string
}

export function QuestionsForm({
  onFormStart,
  onFormComplete,
  formStarted = false,
  largerText = false,
  seniorFriendly = false,
  amount = "",
}: QuestionsFormProps) {
  const [currentStep, setCurrentStep] = useState(formStarted ? 1 : 0)
  const [isQualified, setIsQualified] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)

  // Create ref for the audio element - only for the first "Claim Now" button
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Create and set up audio element
  useEffect(() => {
    // Create audio element only once and keep it in the DOM
    const audio = new Audio("/lets-get-you-qualified-1.wav")
    audio.preload = "auto"

    // Store reference
    audioRef.current = audio

    // Force load the audio file
    audio.load()

    // No cleanup function that removes the element
    return () => {
      // Just stop playback if component unmounts
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  // Function to play audio
  const playAudio = () => {
    if (!audioRef.current) return

    // Reset to beginning
    audioRef.current.currentTime = 0

    // Play the audio with better error handling
    const playPromise = audioRef.current.play()

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error("Audio playback failed:", error)
      })
    }
  }

  const steps: Step[] = [
    {
      isInitial: true,
    },
    {
      question: "What is your age range?",
      options: ["Under 65", "Over 65"],
    },
    {
      question: "Are you on Medicare Parts A and B?",
      options: ["Yes", "No"],
    },
    {
      isEnd: true,
      isQualified: true,
    },
    {
      isEnd: true,
      isQualified: false,
    },
  ]

  // Set up a global click handler to detect user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!userInteracted) {
        setUserInteracted(true)
        // Remove the listener after first interaction
        document.removeEventListener("click", handleUserInteraction)
      }
    }

    document.addEventListener("click", handleUserInteraction)

    return () => {
      document.removeEventListener("click", handleUserInteraction)
    }
  }, [userInteracted])

  const handleInitialClaim = () => {
    // Play the audio when the first "Claim Now" button is clicked
    playAudio()

    setCurrentStep(1)
    setUserInteracted(true)

    if (onFormStart) {
      onFormStart()
    }
  }

  const handleOptionClick = (option: string) => {
    if (currentStep === 1) {
      // Always proceed to Medicare question regardless of age
      setCurrentStep(2)
    } else if (currentStep === 2) {
      if (option === "Yes") {
        // Qualified - has Medicare
        setIsQualified(true)
        setCurrentStep(3)
      } else {
        // Disqualified - no Medicare
        setIsQualified(false)
        setCurrentStep(4)
      }
    }
  }

  const handleResultAction = () => {
    if (onFormComplete) {
      onFormComplete()
    }
  }

  // If we're on the initial page and not in form started mode
  if (!formStarted && currentStep === 0) {
    return (
      <div className="text-center">
        <div className="mb-3 text-base font-bold text-red-600">Check Eligibility - Takes 30 Seconds!</div>

        {/* Enhanced attention-grabbing button */}
        <div className="relative">
          {/* Glow effect behind button */}
          <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-30 rounded-2xl"></div>

          <button
            onClick={handleInitialClaim}
            className="relative w-full max-w-lg mx-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-12 sm:py-10 px-6 sm:px-10 rounded-xl text-2xl sm:text-3xl shadow-2xl transition-all duration-200 ease-in-out transform hover:scale-105 border-4 border-yellow-400 animate-pulse"
          >
            <div className="absolute -right-3 -top-3 bg-yellow-400 text-red-700 text-sm font-bold px-2 py-1 rounded-full">
              FREE
            </div>
            <div className="flex items-center justify-center">
              <span>CLAIM NOW</span>
              <ChevronRight className="ml-2 h-8 w-8" />
            </div>
          </button>
        </div>

        <div className="mt-3 flex justify-center items-center text-sm text-gray-600">
          <ShieldCheck className="h-4 w-4 mr-1.5" />
          <span>Your information is secure & confidential</span>
        </div>
      </div>
    )
  }

  // Get the current step data
  const currentStepData = steps[currentStep]

  // Handle end states (qualified or not qualified)
  if (currentStepData.isEnd) {
    if (currentStepData.isQualified) {
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
                    Your {amount ? `${amount} ` : ""}Health Allowance is reserved for the next 15 minutes
                  </p>
                </div>
              </div>

              <p className="text-xl mb-5">
                Click the button below now to talk to an advisor who will help you claim your{" "}
                {amount ? `${amount} ` : ""}Health Allowance.
              </p>

              {/* Enhanced attention-grabbing button for qualified result */}
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-30 rounded-2xl"></div>

                <button
                  onClick={handleResultAction}
                  className="relative w-full max-w-lg mx-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-12 sm:py-10 px-6 sm:px-10 rounded-xl text-2xl sm:text-3xl shadow-2xl transition-all duration-200 ease-in-out transform hover:scale-105 border-4 border-yellow-400 animate-pulse"
                >
                  <div className="absolute -right-3 -top-3 bg-yellow-400 text-red-700 text-sm font-bold px-2 py-1 rounded-full">
                    FREE
                  </div>
                  <div className="flex items-center justify-center">
                    <span>CLAIM NOW</span>
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
    } else {
      return (
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 text-white text-center">
              <h3 className="text-xl font-bold">Not Qualified</h3>
            </div>

            <div className="p-4 text-center">
              <h4 className="text-xl font-bold text-center mb-4">
                We're sorry, but based on your answers, you don't qualify for this specific Medicare benefit.
              </h4>

              <p className="mb-4 text-lg">
                There may be other Medicare benefits available to you. Please consult with a Medicare specialist for
                more information.
              </p>

              <Button
                onClick={handleResultAction}
                className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-5 px-8 rounded-md text-lg shadow-lg mt-2"
              >
                Explore Other Benefits
              </Button>
            </div>
          </Card>
        </div>
      )
    }
  }

  // Handle question steps with enhanced UI
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-0 shadow-2xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-4 text-white text-center">
          <h3 className="text-2xl font-bold">Medicare Benefits Eligibility Check</h3>
          <p className="text-blue-100 mt-1">Please answer the following questions to check your eligibility</p>
        </div>

        <div className="p-6 bg-gray-50">
          <div className="mb-6">
            {/* Progress indicator */}
            <div className="flex justify-center items-center mb-4">
              <div className="w-full max-w-xs bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: currentStep === 1 ? "50%" : "100%" }}
                ></div>
              </div>
              <span className="ml-3 text-gray-600 font-medium">Step {currentStep}/2</span>
            </div>

            {/* Question */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-5">
              <h4 className="text-3xl font-bold text-center mb-2 text-gray-800">{currentStepData.question}</h4>
              <p className="text-center text-gray-500 mb-4">Please select one option below</p>
            </div>

            {/* Options */}
            {currentStepData.options && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {currentStepData.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-8 px-4 rounded-lg text-2xl shadow-md transition-all duration-200 hover:shadow-lg border-2 border-blue-300 option-pulse"
                  >
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-center text-gray-500 text-sm mt-4">
            <p>Your answers help us determine your eligibility for Medicare benefits</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
