"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Send, Clock } from "lucide-react"

type Message = {
  id: string
  type: "agent" | "user" | "options"
  content: string
  options?: string[]
}

type ConversationStep = {
  message: string
  options?: string[]
  nextStep?: Record<string, number>
  isEnd?: boolean
}

interface ChatbotInterfaceProps {
  amount?: string
}

export function ChatbotInterface({ amount = "" }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [userInfo, setUserInfo] = useState({
    zipCode: "",
    age: "",
    medicareStatus: "",
    income: "",
  })
  const [inputValue, setInputValue] = useState("")
  const [currentInput, setCurrentInput] = useState<"zipCode" | "age" | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversationFlow: ConversationStep[] = [
    {
      message: `Hi there! I'm Emily, your Medicare benefits specialist. I'd like to check if you qualify for the ${amount ? `${amount} ` : ""}Health Allowance for seniors. Can I ask you a few questions?`,
      options: ["Yes, let's get started", "No thanks"],
      nextStep: {
        "Yes, let's get started": 1,
        "No thanks": 10,
      },
    },
    {
      message: "Great! First, what's your ZIP code?",
      nextStep: { any: 2 },
    },
    {
      message: "Thanks! Are you 64 years or older?",
      options: ["Yes", "No"],
      nextStep: {
        Yes: 3,
        No: 11,
      },
    },
    {
      message: "Do you currently have Medicare Parts A & B?",
      options: ["Yes", "No", "Not sure"],
      nextStep: {
        Yes: 4,
        No: 4,
        "Not sure": 4,
      },
    },
    {
      message: "Is your household income less than $35,000 per year?",
      options: ["Yes", "No"],
      nextStep: {
        Yes: 5,
        No: 5,
      },
    },
    {
      message: `Great news! Based on your answers, you may qualify for the ${amount ? `${amount} ` : ""}Health Allowance benefit. This can help cover groceries, medicine, and other expenses.`,
      nextStep: { any: 6 },
    },
    {
      message: "Would you like to speak with a licensed Medicare benefits specialist to confirm your eligibility?",
      options: ["Yes, connect me", "No thanks"],
      nextStep: {
        "Yes, connect me": 7,
        "No thanks": 9,
      },
    },
    {
      message:
        "Excellent! Please enter your phone number below, and a specialist will call you shortly to discuss your benefits.",
      nextStep: { any: 8 },
    },
    {
      message: `Thank you! A Medicare benefits specialist will call you soon to discuss your eligibility for the ${amount ? `${amount} ` : ""}Health Allowance. Have a great day!`,
      isEnd: true,
    },
    {
      message:
        "No problem. If you change your mind or have questions about Medicare benefits, feel free to come back anytime. Have a great day!",
      isEnd: true,
    },
    {
      message:
        "I understand. If you change your mind about checking your eligibility for Medicare benefits, feel free to come back anytime. Have a great day!",
      isEnd: true,
    },
    {
      message:
        "I'm sorry, but you need to be 64 or older to qualify for this Medicare benefit. If you have questions about future eligibility, feel free to come back when you're closer to Medicare age.",
      isEnd: true,
    },
  ]

  useEffect(() => {
    // Start the conversation
    if (messages.length === 0) {
      addAgentMessage(conversationFlow[0].message)
      if (conversationFlow[0].options) {
        setTimeout(() => {
          addOptionsMessage(conversationFlow[0].options!)
        }, 1000)
      }
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addAgentMessage = (content: string) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "agent",
          content,
        },
      ])
      setIsTyping(false)
    }, 1000)
  }

  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "user",
        content,
      },
    ])
  }

  const addOptionsMessage = (options: string[]) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "options",
        content: "",
        options,
      },
    ])
  }

  const handleOptionClick = (option: string) => {
    addUserMessage(option)

    // Find the next step
    const current = conversationFlow[currentStep]
    let nextStepIndex = -1

    if (current.nextStep) {
      if (current.nextStep[option]) {
        nextStepIndex = current.nextStep[option]
      } else if (current.nextStep["any"]) {
        nextStepIndex = current.nextStep["any"]
      }
    }

    if (nextStepIndex >= 0) {
      setCurrentStep(nextStepIndex)
      const nextStep = conversationFlow[nextStepIndex]

      // Update user info based on selection
      if (currentStep === 2 && option === "Yes") {
        setUserInfo((prev) => ({ ...prev, age: "65+" }))
      } else if (currentStep === 3) {
        setUserInfo((prev) => ({ ...prev, medicareStatus: option }))
      } else if (currentStep === 4) {
        setUserInfo((prev) => ({ ...prev, income: option }))
      }

      // Add the next agent message
      addAgentMessage(nextStep.message)

      // If the next step has options, add them after a delay
      if (nextStep.options) {
        setTimeout(() => {
          addOptionsMessage(nextStep.options!)
        }, 1500)
      }

      // If it's the ZIP code step, show the input
      if (nextStepIndex === 1) {
        setCurrentInput("zipCode")
      } else if (nextStepIndex === 7) {
        // Phone number input would go here
      }

      // Check if this is an end step
      if (nextStep.isEnd) {
        setIsComplete(true)
      }
    }
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    if (currentInput === "zipCode") {
      addUserMessage(inputValue)
      setUserInfo((prev) => ({ ...prev, zipCode: inputValue }))
      setInputValue("")
      setCurrentInput(null)

      // Move to the next step
      const nextStepIndex = conversationFlow[currentStep].nextStep?.["any"] || 0
      setCurrentStep(nextStepIndex)
      addAgentMessage(conversationFlow[nextStepIndex].message)

      if (conversationFlow[nextStepIndex].options) {
        setTimeout(() => {
          addOptionsMessage(conversationFlow[nextStepIndex].options!)
        }, 1500)
      }
    }
  }

  return (
    <div>
      <Card className="shadow-lg border-2 border-gray-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-4 flex items-center">
            <Avatar className="h-10 w-10 border-2 border-white">
              <img src="/friendly-support.png" alt="Agent" />
            </Avatar>
            <div className="ml-3">
              <div className="text-white font-medium">Emily</div>
              <div className="flex items-center text-blue-100 text-sm">
                <CheckCircle className="h-3 w-3 mr-1" />
                <span>Medicare Benefits Specialist</span>
              </div>
            </div>
            <div className="ml-auto flex items-center">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                <span className="h-2 w-2 mr-1 rounded-full bg-white"></span>
                Online
              </span>
            </div>
          </div>

          <div className="h-[300px] overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className="mb-4">
                {message.type === "agent" && (
                  <div className="flex items-start">
                    <Avatar className="h-8 w-8 mr-2">
                      <img src="/friendly-support.png" alt="Agent" />
                    </Avatar>
                    <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                      <p className="text-gray-800">{message.content}</p>
                    </div>
                  </div>
                )}

                {message.type === "user" && (
                  <div className="flex items-start justify-end">
                    <div className="bg-blue-600 rounded-lg p-3 shadow-sm max-w-[80%]">
                      <p className="text-white">{message.content}</p>
                    </div>
                  </div>
                )}

                {message.type === "options" && message.options && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.options.map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        className="bg-white hover:bg-blue-50 border-blue-300 text-blue-700"
                        onClick={() => handleOptionClick(option)}
                      >
                        {option}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start">
                <Avatar className="h-8 w-8 mr-2">
                  <img src="/friendly-support.png" alt="Agent" />
                </Avatar>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {currentInput && (
            <form onSubmit={handleInputSubmit} className="p-4 border-t border-gray-200 bg-white">
              <div className="flex">
                <input
                  type={currentInput === "zipCode" ? "text" : "tel"}
                  placeholder={currentInput === "zipCode" ? "Enter your ZIP code" : "Enter your phone number"}
                  className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  pattern={currentInput === "zipCode" ? "[0-9]{5}" : undefined}
                  maxLength={currentInput === "zipCode" ? 5 : undefined}
                />
                <Button type="submit" className="rounded-l-none">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {isComplete && (
            <div className="p-4 bg-green-50 border-t border-green-200">
              <div className="flex items-center text-green-700">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Your eligibility check is complete!</span>
              </div>
            </div>
          )}

          <div className="p-3 bg-gray-100 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>Response time: &lt;1 min</span>
            </div>
            <div>256-bit SSL Encrypted</div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <a
          href="#"
          className="inline-block bg-blue-800 hover:bg-blue-900 text-white font-bold py-4 px-8 rounded-md text-xl shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          Claim Now
          <span className="ml-2">→</span>
        </a>
      </div>
    </div>
  )
}
