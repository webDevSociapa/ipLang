import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { nextUrl, headers } = request;

  // Prevent loop if already translated
  if (nextUrl.searchParams.has('translated')) return NextResponse.next();

  // Get IP from headers
  let ip =
    headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() ||
    request.ip ||
    '';

  // Fallback: Get public IP from api.ipify if local IP
  const isPrivate = /^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[0-1])/.test(ip);
  if (!ip || isPrivate) {
    try {
      const res = await fetch('https://api.ipify.org');
      ip = await res.text();
    } catch {
      ip = '';
    }
  }

  // Get country from IP
  let countryCode = 'US';
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await res.json();
    if (data.status === 'success') {
      countryCode = data.countryCode;
    }
  } catch {}

  // Map country to language
  const map = {
    SA: 'ar', EG: 'ar', AE: 'ar',
    DE: 'de', AT: 'de', CH: 'de',
    ES: 'es', MX: 'es', AR: 'es',
    FR: 'fr', RU: 'ru'
  };
  const lang = map[countryCode] || 'en';

  // Redirect only if not English
  if (lang !== 'en') {
    const url = request.nextUrl.clone();
    url.searchParams.set('translated', '1');
    const redirectURL = `https://translate.google.com/translate?hl=${lang}&sl=en&tl=${lang}&u=${encodeURIComponent(url.toString())}`;
    return NextResponse.redirect(redirectURL);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/about', '/products/:path*'], // Adjust paths as needed
};
