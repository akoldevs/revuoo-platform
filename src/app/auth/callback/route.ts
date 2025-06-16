// src/app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  // Redirect the user to the homepage.
  return NextResponse.redirect(requestUrl.origin)
}