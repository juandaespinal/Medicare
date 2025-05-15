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
    (eventId: string) => {
      try {
        // Only track on /newbigo path if option is enabled
        if (!isNewbigoPath()) {
          console.log("[Bigo] Not on /newbigo path, skipping tracking")
          return
        }

        // Get parameters safely
        const bbg = safeGetParam("bbg") || safeGetParam("_BBG_") || ""
        const pixelId = safeGetParam("pixel_id") || safeGetParam("_PIXEL_ID_") || "905533174088800512"

        if (!bbg) {
          console.log("[Bigo] Cannot track: BBG parameter missing")
          return
        }

        console.log(`[Bigo] Tracking ${eventId} event`)
        setIsTracking(true)

        // Create and append tracking pixel with error handling
        try {
          // Use DOM methods instead of the Image constructor
          const img = document.createElement("img")
          const timestamp = Date.now()
          const url = `https://api.bytegle.site/bigoad/trackingevent?bbg=${encodeURIComponent(bbg)}&pixel_id=${encodeURIComponent(
            pixelId,
          )}&event_id=${encodeURIComponent(eventId)}&timestamp_ms=${timestamp}`

          img.onload = () => {
            console.log(`[Bigo] ${eventId} tracking complete`)
            setIsTracking(false)
          }

          img.onerror = () => {
            console.log(`[Bigo] ${eventId} tracking error (may be normal)`)
            setIsTracking(false)
          }

          img.src = url
          img.style.display = "none"
          document.body.appendChild(img)
        } catch (imgError) {
          console.error("[Bigo] Error creating tracking pixel:", imgError)
          setIsTracking(false)
        }
      } catch (error) {
        console.error("[Bigo] Tracking error:", error)
        setIsTracking(false)
      }
    },
    [safeGetParam, isNewbigoPath],
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

  return { trackBigoEvent, isTracking }
}
