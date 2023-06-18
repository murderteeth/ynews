import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: [
    '/api/collect/:function*',
    '/api/summarize/:function*',
    '/api/article/:function*'
  ],
}

export function middleware(request: NextRequest) {
  const key = request.headers.get('key')
  if(!key) return new NextResponse(null, { status: 401 })
  if(key !== process.env.APP_API_KEY) return new NextResponse(null, { status: 403 })
  return NextResponse.next()
}
