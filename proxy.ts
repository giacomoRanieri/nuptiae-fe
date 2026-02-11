import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './app/i18n';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const accessToken = request.cookies.get('at')?.value;

  // Only intercept requests to the participant page that include a token
  if (pathname.includes('/participant/') && !accessToken) {
    const token = searchParams.get('token');

    // Extract participantId from path (roughly) or pass it if needed. 
    // pathname: /en/participant/123
    const parts = pathname.split('/');
    const participantIndex = parts.indexOf('participant');

    if (participantIndex !== -1 && parts[participantIndex + 1]) {
      const participantId = parts[participantIndex + 1];

      try {
        const BASE_URL = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.replace('/graphql', '') || 'http://localhost:3000';

        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: participantId, token })
        });

        if (loginResponse.ok) {
          let cookie = loginResponse.headers.get('set-cookie');
          if (cookie) {
            if (process.env.NODE_ENV === 'development') {
              cookie = cookie.split(';')[0]
            }

            // Create response redirecting to same URL without token
            const nextUrl = request.nextUrl.clone();
            //nextUrl.searchParams.delete('token');

            const response = NextResponse.redirect(nextUrl);

            // Copy the Set-Cookie header from backend to browser response
            response.headers.set('Set-Cookie', cookie);

            return response;
          }
        } else {
          console.error("Middleware Login failed", loginResponse.status);
          // Allow request to proceed (will be handled by page -> error)
        }
      } catch (e) {
        console.error("Middleware Middleware error", e);
      }
    }
  }

  // Fallback to next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames, plus participant pages handling
  matcher: ['/((?!api|_next|.*\\..*).*)', '/', '/(it)/:path*']
};
