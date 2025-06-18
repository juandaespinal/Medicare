"use client"

import { useState, useEffect } from "react"

export default function Footer() {
  const [currentYear, setCurrentYear] = useState("")

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString())
  }, [])

  return (
    <footer className="text-center text-white text-xs mt-3 opacity-80">
      <p className="mb-1">© {currentYear} Medicare Benefits Assistance. All Rights Reserved.</p>
      <div className="mt-2 flex justify-center space-x-3">
        <a href="#" className="text-white hover:underline text-xs">
          Privacy
        </a>
        <a href="#" className="text-white hover:underline text-xs">
          Terms
        </a>
        <a href="#" className="text-white hover:underline text-xs">
          Contact
        </a>
      </div>
    </footer>
  )
}
