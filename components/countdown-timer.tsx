"use client"

import { useState, useEffect } from "react"

export default function CountdownTimer() {
  const [minutes, setMinutes] = useState(7)
  const [seconds, setSeconds] = useState(30)
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    // Set current date
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" }
    setCurrentDate(date.toLocaleDateString("en-US", options))

    // Initialize countdown timer
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      } else if (minutes > 0) {
        setMinutes(minutes - 1)
        setSeconds(59)
      } else {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [minutes, seconds])

  return (
    <div className="text-center mt-3">
      <div className="bg-red-700 inline-block px-3 py-2 rounded text-sm">
        <p className="text-yellow-300 font-bold mb-1">
          WARNING: Limited supply of Medicare benefits available as of <span>{currentDate}</span>.
        </p>
        <div className="flex justify-center items-center">
          <p className="text-white font-bold mr-2">EXPIRES IN:</p>
          <div className="bg-black text-white px-2 py-0.5 rounded mx-1">{String(minutes).padStart(2, "0")}</div>
          <span className="text-white">:</span>
          <div className="bg-black text-white px-2 py-0.5 rounded mx-1">{String(seconds).padStart(2, "0")}</div>
        </div>
      </div>
    </div>
  )
}
