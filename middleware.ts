import createMiddleware from 'next-intl/middleware';
import {routing} from './app/i18n';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(it)/:path*']
};
