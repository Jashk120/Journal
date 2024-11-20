import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define public paths that should be accessible only to unauthenticated users
    const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail';
    const token = request.cookies.get('token')?.value || '';

    // Redirect authenticated users trying to access public paths to the home page
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    // Allow access to the home path for everyone
    if (path === '/') {
        return NextResponse.next();
    }

    // Redirect unauthenticated users trying to access protected paths to the login page
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/auth', request.nextUrl));
    }

    // Continue processing if no redirects are necessary
    return NextResponse.next();
}

// Config to match paths for middleware
export const config = {
    matcher: [
        '/',
        '/profile',
        '/login',
        '/signup',
        '/verifyemail',
        '/trades',
        '/dashboard'
    ]
};
