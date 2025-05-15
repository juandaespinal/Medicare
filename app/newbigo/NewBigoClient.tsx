"use client"

import type React from "react"
import { useEffect, useRef } from "react"
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
  const pageViewTracked = useRef(false)

  // Track page view when the component mounts - but only once
  useEffect(() => {
    // Skip if already tracked
    if (pageViewTracked.current) return
    pageViewTracked.current = true

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

    // Track page view when visibility changes - but only if the page was hidden for a significant time
    let lastHiddenTime = 0
    const MIN_HIDDEN_TIME = 30000 // 30 seconds

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        lastHiddenTime = Date.now()
      } else if (document.visibilityState === "visible" && lastHiddenTime > 0) {
        const hiddenDuration = Date.now() - lastHiddenTime

        // Only track if the page was hidden for more than MIN_HIDDEN_TIME
        if (hiddenDuration > MIN_HIDDEN_TIME) {
          console.log(`Page was hidden for ${hiddenDuration}ms, tracking visibility change page view`)
          trackPageView("visibility_change")
        } else {
          console.log(`Page was hidden for only ${hiddenDuration}ms, not tracking visibility change`)
        }
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

        {/* BIGO Tracking Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize tracking state
              window._bigoTracking = {
                pageViewFired: false
              };
              
              // Helper function to track BIGO events directly
              window.trackBigoEvent = function(eventName, params) {
                try {
                  const urlParams = new URLSearchParams(window.location.search);
                  const bbg = urlParams.get('bbg') || urlParams.get('_BBG_');
                  const pixelId = urlParams.get('pixel_id') || urlParams.get('_PIXEL_ID_') || '905533174088800512';
                  
                  if (!bbg) {
                    console.log('[BIGO Direct] Cannot track: BBG parameter missing');
                    return false;
                  }
                  
                  // Prevent duplicate page_view events
                  if (eventName === 'page_view' && window._bigoTracking.pageViewFired) {
                    console.log('[BIGO Direct] Page view already fired, skipping duplicate');
                    return true;
                  }
                  
                  // Mark page_view as fired if this is a page_view event
                  if (eventName === 'page_view') {
                    window._bigoTracking.pageViewFired = true;
                  }
                  
                  console.log('[BIGO Direct] Tracking ' + eventName + ' event');
                  
                  // Create tracking pixel
                  const img = document.createElement('img');
                  const timestamp = Date.now();
                  
                  // Build URL with parameters
                  let url = 'https://api.bytegle.site/bigoad/trackingevent?bbg=' + 
                    encodeURIComponent(bbg) + 
                    '&pixel_id=' + encodeURIComponent(pixelId) + 
                    '&event_id=' + encodeURIComponent(eventName) + 
                    '&timestamp_ms=' + timestamp;
                  
                  // Add any additional parameters
                  if (params) {
                    Object.keys(params).forEach(function(key) {
                      url += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
                    });
                  }
                  
                  img.onload = function() {
                    console.log('[BIGO Direct] ' + eventName + ' tracking complete');
                  };
                  
                  img.onerror = function() {
                    console.log('[BIGO Direct] ' + eventName + ' tracking error (may be normal)');
                  };
                  
                  img.src = url;
                  img.style.display = 'none';
                  document.body.appendChild(img);
                  
                  return true;
                } catch (error) {
                  console.error('[BIGO Direct] Tracking error:', error);
                  return false;
                }
              };
            `,
          }}
        />

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
    trackBigoEvent?: (eventName: string, params?: Record<string, string>) => boolean
    _bigoTracking?: {
      pageViewFired: boolean
    }
  }
}
