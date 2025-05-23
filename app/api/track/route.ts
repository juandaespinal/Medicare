import { NextResponse } from "next/server"

// BIGO tracking endpoint - Server-to-Server implementation
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Get the BIGO pixel ID from environment or use the default
    const pixelId = process.env.BIGO_PIXEL_ID

    if (!pixelId) {
      throw new Error("BIGO_PIXEL_ID environment variable is not set")
    }

    // Extract event name and data
    const { event, ...eventData } = data

    if (!event) {
      throw new Error("Event name is required")
    }

    // Prepare the tracking data with additional server-side information
    const trackingPayload = {
      ...eventData,
      timestamp: new Date().toISOString(),
      event_id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      server_timestamp: Date.now(),
    }

    console.log(`Server-to-Server BIGO tracking - Event: ${event}, Pixel ID: ${pixelId}`, trackingPayload)

    // Send the event to BIGO's server
    const response = await fetch(`https://api.topnotchs.site/ad/event?pixel_id=${pixelId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: event,
        ...trackingPayload,
      }),
    })

    const responseText = await response.text()
    let responseData

    try {
      // Try to parse as JSON
      responseData = JSON.parse(responseText)
    } catch (e) {
      // If not valid JSON, use the text as is
      responseData = { raw_response: responseText }
    }

    if (!response.ok) {
      console.error(`BIGO API error (${response.status}):`, responseData)
      throw new Error(`BIGO API responded with status: ${response.status}, message: ${responseText}`)
    }

    console.log("BIGO API response:", responseData)

    return NextResponse.json({
      success: true,
      data: responseData,
      event: event,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error sending tracking event to BIGO:", error)
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
