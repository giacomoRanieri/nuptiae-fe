import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { routing } from './app/i18n';
import { logger } from './lib/logger';

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
        const BASE_URL = process.env.NEXT_PUBLIC_LOGIN_ENDPOINT || 'http://localhost:3000';

        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: participantId, token })
        });

        if (loginResponse.ok) {
          let setCookie = loginResponse.headers.get('set-cookie');
          logger.warn("[middleware] set-cookie", setCookie);
          if (setCookie) {
            if (process.env.NODE_ENV === 'production') {
              setCookie = setCookie.replace(/SameSite=Strict/i, 'SameSite=Lax');
              if (!setCookie.includes('Domain=')) {
                setCookie += '; Domain=.giacomoloredana.it';
              }
            } else {
              setCookie = setCookie.split(';')[0] + '; Path=/';
            }

            // Create response redirecting to same URL without token
            const nextUrl = request.nextUrl.clone();
            //nextUrl.searchParams.delete('token');

            const response = NextResponse.redirect(nextUrl);

            // Copy the Set-Cookie header from backend to browser response
            response.headers.set('Set-Cookie', setCookie);

            return response;
          }
        } else {
          logger.error("Middleware Login failed", loginResponse.status);
          const errorUrl = request.nextUrl.clone();
          errorUrl.pathname = `/${parts[1]}/error`; // Maintain locale
          return NextResponse.redirect(errorUrl);
        }
      } catch (e) {
        logger.error("Middleware Middleware error", e);
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
