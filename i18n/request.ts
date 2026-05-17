import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['it'];

const timeZones: Record<string, string> = {
  it: 'Europe/Rome',
  // en: 'Europe/London', // Add new languages and their timezones here
};

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as string)) {
    locale = 'it';
  }

  // Determine timezone based on locale map, fallback to UTC
  const timeZone = timeZones[locale] || 'UTC';

  return {
    locale,
    timeZone,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
