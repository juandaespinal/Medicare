"use client"

import type React from "react"
import { useEffect } from "react"
import TrackingTester from "@/components/tracking-tester"
import { trackPageView } from "@/utils/bigo-tracking"
import { useBigoTracking } from "@/utils/bigo-pixel-tracking"

export default function NewBigoClient({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize BIGO pixel tracking
  const { trackBigoEvent } = useBigoTracking()

  // Track page view when the component mounts
  useEffect(() => {
    // Track page view on mount
    const trackInitialPageView = async () => {
      try {
        console.log("Tracking initial page view via server-to-server")
        await trackPageView("initial_page_view")
      } catch (error) {
        console.error("Error tracking initial page view:", error)
      }
    }

    trackInitialPageView()

    // Track page view when visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Visibility changed to visible, tracking page view")
        trackPageView("visibility_change")
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // Determine if we're in development mode
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <html lang="en">
      <head>
        {/* RedTrack Tracking Script - Positioned at the top for priority loading */}
        <script type="text/javascript" src="https://cy9n0.rdtk.io/track.js?rtkcmpid=680e4702db362950095e9559"></script>

        {/* Other meta tags and styles */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Medicare Grocery Allowance Benefits</title>
        <meta name="description" content="Claim your Medicare Grocery Allowance benefits today" />

        {/* Ringba Number Pool Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function(e,d) {
            //Ringba.com phone number tracking
            var ringba_com_tag="JS27fbc6124e1b476c86fb0dc9ada51072";
            var _sc = d.getElementsByTagName('script'), _s = _sc[_sc.length - 1];
            e._rgba = e._rgba || { q: [] }; e._rgba.q.push({ tag: ringba_com_tag, script: _s });
            if (!(e._rgba.loading = !!e._rgba.loading)) {
                var sc = d.createElement('script'); sc.type = 'text/javascript'; sc.async = true;
                sc.src = '//js.callcdn.com/js_v3/min/ringba.com.js';
                var s = d.getElementsByTagName('script')[0]; s.parentNode.insertBefore(sc, s);
                e._rgba.loading = true;
            }
            
            // Store the default number in a global variable for easy access
            e.defaultRingbaNumber = "+18554690274";
          })(window,document);
        `,
          }}
        />
      </head>
      <body>
        {children}

        {/* Include the tracking tester in development mode */}
        {isDevelopment && <TrackingTester />}

        {/* Additional scripts at the end of body */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (window._rgba_tags = (window._rgba_tags || [])).push({ type: "User", track_attempted: "yes" });
          var intervalId = setInterval(() => {
            if (window.rtkClickID != undefined) {
              (window._rgba_tags = (window._rgba_tags || [])).push({ type: "User", clickid: window.rtkClickID });
              console.log("Just ran the rtkClickID script to add Ringba tags: ", window.rtkClickID);
              clearInterval(intervalId);
            } else {
              console.log("rtkcid not defined yet");
            }
          }, 500);
        `,
          }}
        />
      </body>
    </html>
  )
}

// Add TypeScript interface for the global window object
declare global {
  interface Window {
    ringba_known_numbers?: Record<string, any>
    ringbaPhoneNumber?: any
    defaultRingbaNumber?: string
    _rgba?: {
      numbers?: any[]
      data?: any
      q: any[]
      loading?: boolean
    }
    rtkClickID?: string
  }
}
