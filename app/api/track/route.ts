import { NextResponse } from "next/server"

// BIGO tracking endpoint
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Get the BIGO pixel ID from environment or use the default
    const pixelId = "905552102262610176"

    // Prepare the tracking data
    const eventData = {
      ...data,
      timestamp: new Date().toISOString(),
      event_id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    }

    // Log the event data for debugging
    console.log("Sending tracking event to BIGO:", eventData)

    // Send the event to BIGO's server
    const response = await fetch(`https://api.topnotchs.site/ad/event?pixel_id=${pixelId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })

    if (!response.ok) {
      throw new Error(`BIGO API responded with status: ${response.status}`)
    }

    const responseData = await response.json()
    console.log("BIGO API response:", responseData)

    return NextResponse.json({ success: true, data: responseData })
  } catch (error) {
    console.error("Error sending tracking event to BIGO:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
