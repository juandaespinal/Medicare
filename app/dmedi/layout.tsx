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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:," />

        {/* Basic test script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log("=== LAYOUT HEAD SCRIPT LOADED ===");
              window.debugInfo = {
                scriptsLoaded: [],
                errors: []
              };
            `,
          }}
        />
      </head>
      <body>
        {children}

        {/* Load scripts dynamically to avoid blocking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log("=== BODY SCRIPT STARTING ===");
              
              // Set default number
              window.defaultRingbaNumber = "+18554690274";
              
              // Function to load external scripts
              function loadScript(src, name) {
                return new Promise((resolve, reject) => {
                  console.log("Attempting to load " + name + " from: " + src);
                  
                  const script = document.createElement('script');
                  script.src = src;
                  script.async = true;
                  
                  script.onload = function() {
                    console.log(name + " loaded successfully");
                    window.debugInfo.scriptsLoaded.push(name);
                    resolve();
                  };
                  
                  script.onerror = function(error) {
                    console.error(name + " failed to load:", error);
                    window.debugInfo.errors.push(name + " failed to load");
                    reject(error);
                  };
                  
                  document.head.appendChild(script);
                });
              }
              
              // Try to load RedTrack
              loadScript('https://cy9n0.rdtk.io/track.js?rtkcmpid=680e4702db362950095e9559', 'RedTrack')
                .catch(error => console.log('RedTrack blocked or failed'));
              
              // Try to load Ringba
              loadScript('//b-js.ringba.com/CAefa19b14140b4593baf4f0e1d288e9e8', 'Ringba')
                .catch(error => console.log('Ringba blocked or failed'));
              
              // Alternative Ringba loading method
              setTimeout(() => {
                console.log("=== TRYING ALTERNATIVE RINGBA METHOD ===");
                
                // Create the _rgba object manually
                window._rgba = window._rgba || { q: [] };
                
                // Try the traditional Ringba loading method
                (function(e,d) {
                  var ringba_com_tag="JS27fbc6124e1b476c86fb0dc9ada51072";
                  var _sc = d.getElementsByTagName('script'), _s = _sc[_sc.length - 1];
                  e._rgba = e._rgba || { q: [] }; 
                  e._rgba.q.push({ tag: ringba_com_tag, script: _s });
                  
                  if (!(e._rgba.loading = !!e._rgba.loading)) {
                    console.log("Creating Ringba script element...");
                    var sc = d.createElement('script'); 
                    sc.type = 'text/javascript'; 
                    sc.async = true;
                    sc.src = '//js.callcdn.com/js_v3/min/ringba.com.js';
                    
                    sc.onload = function() {
                      console.log("Ringba script loaded via alternative method");
                    };
                    
                    sc.onerror = function() {
                      console.log("Ringba script failed via alternative method");
                    };
                    
                    var s = d.getElementsByTagName('script')[0]; 
                    s.parentNode.insertBefore(sc, s);
                    e._rgba.loading = true;
                  }
                })(window,document);
              }, 2000);
              
              // Check for scripts every 3 seconds
              let checkCount = 0;
              const checkInterval = setInterval(() => {
                checkCount++;
                console.log("=== STATUS CHECK " + checkCount + " ===");
                console.log("Scripts loaded:", window.debugInfo.scriptsLoaded);
                console.log("Errors:", window.debugInfo.errors);
                console.log("window._rgba:", window._rgba);
                console.log("window.ringba_known_numbers:", window.ringba_known_numbers);
                console.log("window.rtkClickID:", window.rtkClickID);
                
                // Stop after 10 checks
                if (checkCount >= 10) {
                  console.log("=== FINAL STATUS ===");
                  console.log("Scripts that loaded:", window.debugInfo.scriptsLoaded);
                  console.log("Scripts that failed:", window.debugInfo.errors);
                  clearInterval(checkInterval);
                }
              }, 3000);
            `,
          }}
        />
      </body>
    </html>
  )
}
