"use client"

import { useSearchParams } from "next/navigation"
import { useState, useCallback, useEffect } from "react"

// Global flag to track if page view has been fired
// This ensures it's tracked across component remounts
let globalPageViewFired = false

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

        // Prevent duplicate page_view events using the global flag
        if (eventId === "page_view" && globalPageViewFired) {
          console.log("[Bigo] Page view already fired globally, skipping duplicate")
          return Promise.resolve(true)
        }

        // Mark page_view as fired if this is a page_view event
        if (eventId === "page_view") {
          globalPageViewFired = true
          // Also set the window flag for other scripts
          if (typeof window !== "undefined") {
            window._bigoTracking = window._bigoTracking || {}
            window._bigoTracking.pageViewFired = true
          }
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

  // Track page view on mount - but only once globally
  useEffect(() => {
    // Skip if not on newbigo path or if page view already fired globally
    if (!isNewbigoPath() || globalPageViewFired) {
      console.log("[Bigo] Skipping page view tracking - already fired or not on newbigo path")
      return
    }

    const bbg = safeGetParam("bbg") || safeGetParam("_BBG_") || ""
    if (bbg) {
      console.log("[Bigo] BBG parameter found, tracking page view (first time)")
      trackBigoEvent("page_view")
    }
  }, [safeGetParam, trackBigoEvent, isNewbigoPath])

  // Track phone consultation
  const trackPhoneConsultation = useCallback(
    (phoneNumber: string) => {
      return trackBigoEvent("phone_consult", { phone_number: phoneNumber })
    },
    [trackBigoEvent],
  )

  // Track form submission
  const trackFormSubmission = useCallback(
    (formData: Record<string, string> = {}) => {
      return trackBigoEvent("form", formData)
    },
    [trackBigoEvent],
  )

  // Track phone detail page browse
  const trackPhoneDetail = useCallback(
    (phoneNumber: string, additionalData: Record<string, string> = {}) => {
      return trackBigoEvent("phone_detail", {
        phone_number: phoneNumber,
        ...additionalData,
      })
    },
    [trackBigoEvent],
  )

  return {
    trackBigoEvent,
    trackPhoneConsultation,
    trackFormSubmission,
    trackPhoneDetail,
    isTracking,
  }
}

// Helper function to handle the complete call tracking flow
export function handleCallTrackingFlow(
  phoneNumber: string,
  trackPhoneConsultation: (phoneNumber: string) => Promise<boolean>,
  trackFormSubmission: (formData: Record<string, string>) => Promise<boolean>,
  trackPhoneDetail: (phoneNumber: string, additionalData: Record<string, string>) => Promise<boolean>,
  callback?: () => void,
) {
  // First track the phone consultation event
  trackPhoneConsultation(phoneNumber)
    .then(() => {
      console.log("[Bigo] Phone consultation tracking complete")

      // Make the call
      window.location.href = `tel:${phoneNumber}`

      // Set up visibility change listener to detect when user returns from call
      const callStartTime = Date.now()
      const MIN_CALL_DURATION = 10000 // 10 seconds

      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          // Remove the event listener to prevent multiple firings
          document.removeEventListener("visibilitychange", handleVisibilityChange)

          const callDuration = Date.now() - callStartTime

          // Only consider it a completed call if the duration is longer than our minimum
          if (callDuration >= MIN_CALL_DURATION) {
            console.log(`[Bigo] User returned from call after ${callDuration}ms`)

            // Track phone detail event
            trackPhoneDetail(phoneNumber, {
              call_duration: callDuration.toString(),
              timestamp: new Date().toISOString(),
            }).then(() => {
              console.log("[Bigo] Phone detail tracking complete")

              // Then track the form submission event
              setTimeout(() => {
                trackFormSubmission({
                  action: "call_completed",
                  phone_number: phoneNumber,
                  call_duration: callDuration.toString(),
                  timestamp: new Date().toISOString(),
                }).then(() => {
                  console.log("[Bigo] Form submission tracking complete")

                  // Execute callback if provided
                  if (callback) {
                    callback()
                  }
                })
              }, 300)
            })
          }
        }
      }

      // Add visibility change listener
      document.addEventListener("visibilitychange", handleVisibilityChange)
    })
    .catch((error) => {
      console.error("[Bigo] Phone consultation tracking error:", error)

      // Still make the call even if tracking fails
      window.location.href = `tel:${phoneNumber}`
    })
}
