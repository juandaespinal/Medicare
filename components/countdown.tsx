"use client"

import { useState, useEffect } from "react"

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    minutes: 7,
    seconds: 30,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 }
        } else {
          clearInterval(timer)
          return { minutes: 0, seconds: 0 }
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-center mt-3">
      <div className="bg-red-700 inline-block px-3 py-2 rounded text-sm">
        <p className="text-yellow-300 font-bold mb-1">
          WARNING: Limited supply of Medicare benefits available as of April 12, 2025.
        </p>
        <div className="flex justify-center items-center">
          <p className="text-white font-bold mr-2">EXPIRES IN:</p>
          <div className="bg-black text-white px-2 py-0.5 rounded mx-1">
            {String(timeLeft.minutes).padStart(2, "0")}
          </div>
          <span className="text-white">:</span>
          <div className="bg-black text-white px-2 py-0.5 rounded mx-1">
            {String(timeLeft.seconds).padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  )
}
