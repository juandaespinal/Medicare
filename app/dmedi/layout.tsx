import type React from "react"
import "../../app/globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Medicare Health Allowance Benefits",
  description: "Claim your Medicare Health Allowance benefits today",
}

export default function DmediLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Basic console log to verify logging works */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log("BASIC CONSOLE LOG TEST - THIS SHOULD APPEAR");
            `,
          }}
        />

        {/* RDTK Tracking Script */}
        <script type="text/javascript" src="https://cy9n0.rdtk.io/track.js?rtkcmpid=680e4702db362950095e9559"></script>

        {/* Direct Ringba script - simplified version */}
        <script src="//b-js.ringba.com/CAefa19b14140b4593baf4f0e1d288e9e8" async></script>

        {/* Meta tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:," />
      </head>
      <body>
        {children}

        {/* Simple script to check if Ringba is loaded */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log("PAGE LOADED - CHECKING FOR RINGBA");
              
              // Set default number
              window.defaultRingbaNumber = "+18554690274";
              
              // Check for Ringba every second
              let checkCount = 0;
              const checkInterval = setInterval(() => {
                checkCount++;
                console.log("Checking for Ringba... attempt " + checkCount);
                
                if (window._rgba || window.ringba_known_numbers) {
                  console.log("RINGBA DETECTED!");
                  console.log("_rgba:", window._rgba);
                  console.log("ringba_known_numbers:", window.ringba_known_numbers);
                  clearInterval(checkInterval);
                }
                
                // Stop checking after 20 attempts
                if (checkCount >= 20) {
                  console.log("RINGBA NOT DETECTED AFTER 20 CHECKS");
                  clearInterval(checkInterval);
                }
              }, 1000);
            `,
          }}
        />
      </body>
    </html>
  )
}
