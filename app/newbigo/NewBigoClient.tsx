"use client"

import type React from "react"
import TrackingTester from "@/components/tracking-tester"
import { useBigoTracking } from "@/utils/bigo-pixel-tracking"

export default function NewBigoClient({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize BIGO pixel tracking - this will handle page view tracking once
  useBigoTracking()

  // Determine if we're in development mode
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <html lang="en">
      <head>
        {/* RedTrack Tracking Script - Positioned at the top for priority loading */}
        <script type="text/javascript" src="https://cy9n0.rdtk.io/track.js?rtkcmpid=680e4702db362950095e9559"></script>

        {/* BIGO Tracking Script - with global page view prevention */}
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
                  // Check if page view already fired globally
                  if (eventName === 'page_view' && window._bigoTracking.pageViewFired) {
                    console.log('[BIGO Direct] Page view already fired, skipping duplicate');
                    return true;
                  }
                  
                  const urlParams = new URLSearchParams(window.location.search);
                  const bbg = urlParams.get('bbg') || urlParams.get('_BBG_');
                  const pixelId = urlParams.get('pixel_id') || urlParams.get('_PIXEL_ID_') || '905553625386523392';
                  
                  if (!bbg) {
                    console.log('[BIGO Direct] Cannot track: BBG parameter missing');
                    return false;
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
              
              // DO NOT automatically track page view here - let the React hook handle it
            `,
          }}
        />

        {/* Other meta tags and styles */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Medicare Grocery Allowance Benefits</title>
        <meta name="description" content="Claim your Medicare Grocery Allowance benefits today" />

        {/* Ringba Script - Only using the new script */}
        <script src="//b-js.ringba.com/CAefa19b14140b4593baf4f0e1d288e9e8" async></script>
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
    callStartTime?: number
  }
}
