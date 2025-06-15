import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
   matcher: [
      '/',
      '/products/:path*',
      '/banners/:path*',
      '/orders/:path*',
      '/categories/:path*',
      '/payments/:path*',
      '/codes/:path*',
      '/users/:path*',
      '/reports/:path*',
      '/api/:path*',
   ],
}
