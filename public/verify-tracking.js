// Verification script for tracking codes
;(() => {
  console.log("Running tracking verification...")

  // Check for RedTrack script
  const scripts = document.querySelectorAll("script")
  let redtrackFound = false

  scripts.forEach((script) => {
    if (script.src && script.src.includes("cy9n0.rdtk.io/track.js")) {
      redtrackFound = true
      console.log("✅ RedTrack script found:", script.src)
    }
  })

  if (!redtrackFound) {
    console.log("❌ RedTrack script not found in the page")

    // Attempt to inject the script if not found
    console.log("Attempting to inject the RedTrack script...")
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = "https://cy9n0.rdtk.io/track.js?rtkcmpid=680e4702db362950095e9559"
    document.head.appendChild(script)
    console.log("✅ RedTrack script injected")
  }

  // Check for BIGO tracking
  if (window.bgdataLayer) {
    console.log("✅ BIGO tracking initialized successfully")
  } else {
    console.log("❌ BIGO tracking not initialized")
  }

  // Check for Ringba
  if (window._rgba) {
    console.log("✅ Ringba script initialized successfully")
  } else {
    console.log("❌ Ringba script not initialized")
  }

  return "Tracking verification complete"
})()
