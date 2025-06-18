import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only run this middleware for the /dinomedi route
  if (request.nextUrl.pathname.startsWith("/dinomedi")) {
    // Get the original response
    const response = NextResponse.next()

    // Add a custom header to indicate we should inject the script
    response.headers.set("x-inject-bg-script", "true")

    return response
  }

  return NextResponse.next()
}

// This middleware should only run on the /dinomedi route
export const config = {
  matcher: "/dinomedi/:path*",
}
