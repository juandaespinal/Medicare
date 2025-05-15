import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Medicare Benefits - Check Your Eligibility",
  description: "Find out if you qualify for additional Medicare benefits and allowances.",
}

export default function NewBigoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script id="bigo-tracking-script" strategy="afterInteractive">
        {`
          // Global BIGO tracking function
          window.trackBigoEvent = function(eventName, params = {}) {
            try {
              // Get URL parameters
              const urlParams = new URLSearchParams(window.location.search);
              const bbg = urlParams.get('bbg') || urlParams.get('_BBG_') || '';
              const pixelId = urlParams.get('pixel_id') || urlParams.get('_PIXEL_ID_') || '905533174088800512';
              
              if (!bbg) {
                console.log("[Bigo Global] Cannot track: BBG parameter missing");
                return false;
              }
              
              console.log("[Bigo Global] Tracking " + eventName + " event");
              
              // Create tracking pixel
              const img = document.createElement('img');
              const timestamp = Date.now();
              
              // Build URL
              let url = 'https://api.bytegle.site/bigoad/trackingevent?bbg=' + 
                encodeURIComponent(bbg) + 
                '&pixel_id=' + encodeURIComponent(pixelId) + 
                '&event_id=' + encodeURIComponent(eventName) + 
                '&timestamp_ms=' + timestamp;
              
              // Add additional parameters
              for (const key in params) {
                url += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
              }
              
              img.onload = function() {
                console.log("[Bigo Global] " + eventName + " tracking complete");
              };
              
              img.onerror = function() {
                console.log("[Bigo Global] " + eventName + " tracking error (may be normal)");
              };
              
              img.src = url;
              img.style.display = 'none';
              document.body.appendChild(img);
              
              return true;
            } catch (error) {
              console.error("[Bigo Global] Tracking error:", error);
              return false;
            }
          };
          
          // Track page view on load
          document.addEventListener('DOMContentLoaded', function() {
            if (window.location.pathname.includes('/newbigo')) {
              const urlParams = new URLSearchParams(window.location.search);
              const bbg = urlParams.get('bbg') || urlParams.get('_BBG_') || '';
              
              if (bbg) {
                console.log("[Bigo Global] BBG parameter found, tracking page view");
                window.trackBigoEvent('page_view');
              }
            }
          });
          
          // Set up visibility change listener to detect when user returns from call
          document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible' && window.callStartTime) {
              const callDuration = Date.now() - window.callStartTime;
              const MIN_CALL_DURATION = 10000; // 10 seconds
              
              // Only consider it a completed call if the duration is longer than our minimum
              if (callDuration >= MIN_CALL_DURATION) {
                console.log("[Bigo Global] User returned from call after " + callDuration + "ms");
                
                // Track phone_detail event
                window.trackBigoEvent('phone_detail', {
                  call_duration: callDuration.toString(),
                  timestamp: new Date().toISOString()
                });
                
                // Track form submission event
                setTimeout(function() {
                  window.trackBigoEvent('form', {
                    action: 'call_completed',
                    call_duration: callDuration.toString(),
                    timestamp: new Date().toISOString()
                  });
                }, 300);
                
                // Clear the call start time
                window.callStartTime = null;
              }
            }
          });
        `}
      </Script>
      {children}
    </>
  )
}
