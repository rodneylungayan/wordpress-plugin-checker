import { NextResponse } from 'next/server'

export function middleware(req) {
  const authHeader = req.headers.get('authorization')
  const username = process.env.SITE_USERNAME
  const password = process.env.SITE_PASSWORD

  if (authHeader) {
    // Get Base64 part of header
    const base64Credentials = authHeader.split(' ')[1]
    const [inputUser, inputPass] = Buffer.from(base64Credentials, 'base64')
      .toString()
      .split(':')

    if (inputUser === username && inputPass === password) {
      return NextResponse.next() // allow access
    }
  }

  // Return 401 to trigger browser popup
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Protected Area"' },
  })
}

// Protect the whole site
export const config = {
  matcher: '/:path*',
}
