"use client"

import { useSearchParams } from "next/navigation"
import { useState, useCallback, useEffect } from "react"

interface BigoTrackingOptions {
  onlyTrackOnNewbigo?: boolean
}

export function useBigoTracking(options: BigoTrackingOptions = {}) {
  const { onlyTrackOnNewbigo = true } = options
  const searchParams = useSearchParams()
  const [isTracking, setIsTracking] = useState(false)

  // Safe function to get URL parameters
  const safeGetParam = useCallback(
    (name: string): string => {
      try {
        return searchParams?.get(name) || ""
      } catch (error) {
        console.error("[Bigo] Error getting URL parameter:", error)
        return ""
      }
    },
    [searchParams],
  )

  // Check if we're on the /newbigo path
  const isNewbigoPath = useCallback(() => {
    try {
      if (!onlyTrackOnNewbigo) return true
      return window.location.pathname.includes("/newbigo")
    } catch (error) {
      console.error("[Bigo] Error checking path:", error)
      return false
    }
  }, [onlyTrackOnNewbigo])

  // Track Bigo event with error handling
  const trackBigoEvent = useCallback(
    (eventId: string, additionalParams: Record<string, string> = {}) => {
      try {
        // Only track on /newbigo path if option is enabled
        if (!isNewbigoPath()) {
          console.log("[Bigo] Not on /newbigo path, skipping tracking")
          return Promise.resolve(false)
        }

        // Get parameters safely
        const bbg = safeGetParam("bbg") || safeGetParam("_BBG_") || ""
        const pixelId = safeGetParam("pixel_id") || safeGetParam("_PIXEL_ID_") || "905533174088800512"

        if (!bbg) {
          console.log("[Bigo] Cannot track: BBG parameter missing")
          return Promise.resolve(false)
        }

        console.log(`[Bigo] Tracking ${eventId} event`)
        setIsTracking(true)

        return new Promise<boolean>((resolve) => {
          // Create and append tracking pixel with error handling
          try {
            // Use DOM methods instead of the Image constructor
            const img = document.createElement("img")
            const timestamp = Date.now()

            // Build URL with base parameters
            // IMPORTANT: Use the correct event parameter name (event_id) and format
            let url = `https://api.bytegle.site/bigoad/trackingevent?bbg=${encodeURIComponent(bbg)}&pixel_id=${encodeURIComponent(
              pixelId,
            )}&event_id=${encodeURIComponent(eventId)}&timestamp_ms=${timestamp}`

            // Add any additional parameters
            Object.entries(additionalParams).forEach(([key, value]) => {
              url += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            })

            img.onload = () => {
              console.log(`[Bigo] ${eventId} tracking complete`)
              setIsTracking(false)
              resolve(true)
            }

            img.onerror = () => {
              console.log(`[Bigo] ${eventId} tracking error (may be normal)`)
              setIsTracking(false)
              resolve(true) // Still resolve as true since this is expected behavior
            }

            img.src = url
            img.style.display = "none"
            document.body.appendChild(img)

            // Set a timeout to resolve the promise in case the image never loads or errors
            setTimeout(() => {
              if (isTracking) {
                console.log(`[Bigo] ${eventId} tracking timeout`)
                setIsTracking(false)
                resolve(false)
              }
            }, 5000)
          } catch (imgError) {
            console.error("[Bigo] Error creating tracking pixel:", imgError)
            setIsTracking(false)
            resolve(false)
          }
        })
      } catch (error) {
        console.error("[Bigo] Tracking error:", error)
        setIsTracking(false)
        return Promise.resolve(false)
      }
    },
    [safeGetParam, isNewbigoPath, isTracking],
  )

  // Track page view on mount
  useEffect(() => {
    try {
      if (!isNewbigoPath()) return

      const bbg = safeGetParam("bbg") || safeGetParam("_BBG_") || ""
      if (bbg) {
        console.log("[Bigo] BBG parameter found, tracking page view")
        trackBigoEvent("page_view")
      }
    } catch (error) {
      console.error("[Bigo] Page view tracking error:", error)
    }
  }, [safeGetParam, trackBigoEvent, isNewbigoPath])

  // Track phone consultation
  const trackPhoneConsultation = useCallback(
    (phoneNumber: string) => {
      return trackBigoEvent("phone_consult", { phone_number: phoneNumber })
    },
    [trackBigoEvent],
  )

  // Track button click
  const trackButtonClick = useCallback(
    (buttonId: string, buttonData: Record<string, string> = {}) => {
      return trackBigoEvent("button", { button_id: buttonId, ...buttonData })
    },
    [trackBigoEvent],
  )

  return {
    trackBigoEvent,
    trackPhoneConsultation,
    trackButtonClick,
    isTracking,
  }
}
