import { NextResponse, NextRequest } from 'next/server';

/**
 * Middleware for:
 * 1. CORS configuration
 * 2. Rate limiting headers
 * 3. Security headers
 */
export function middleware(req: NextRequest) {
    const response = NextResponse.next();

    // ─── Security Headers ───
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(self)'
    );

    // ─── CORS for API routes ───
    if (req.nextUrl.pathname.startsWith('/api/')) {
        const allowedOrigins = [
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        ];
        const origin = req.headers.get('origin') || '';

        if (allowedOrigins.includes(origin)) {
            response.headers.set('Access-Control-Allow-Origin', origin);
        }
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Access-Control-Allow-Credentials', 'true');

        // Handle preflight
        if (req.method === 'OPTIONS') {
            return new NextResponse(null, {
                status: 204,
                headers: response.headers,
            });
        }
    }

    return response;
}

export const config = {
    matcher: [
        // Match all API routes
        '/api/:path*',
        // Match page routes (for security headers)
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
