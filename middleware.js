import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Check if the path is an admin route (excluding login)
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // Get the token from cookies
    const authToken = request.cookies.get('admin_auth_token')?.value;
    
    // If there's no token, redirect to login
    if (!authToken) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

// Only run middleware on matching paths
export const config = {
  matcher: ['/admin/:path*'],
};
