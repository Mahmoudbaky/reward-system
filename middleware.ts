import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Add error monitoring headers
  const response = NextResponse.next();

  // Add headers to help with debugging
  response.headers.set("X-App-Environment", process.env.NODE_ENV || "unknown");

  return response;
}
