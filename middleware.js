import { NextResponse } from 'next/server';

export async function middleware(request) {
  const url = request.nextUrl;

  if (url.searchParams.has('translated')) return NextResponse.next();

  // Step 1: Get IP
  let ip =
    request.headers.get('x-forwarded-for')?.split(',').shift()?.trim() ||
    '';

  const isPrivate = /^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[0-1])/.test(ip) || !ip;

  if (isPrivate) {
    try {
      const res = await fetch('https://api.ipify.org');
      ip = await res.text();
    } catch {
      ip = '';
    }
  }

  // Step 2: Get country from IP
  let countryCode = 'US';
  try {
    const geo = await fetch(`http://ip-api.com/json/${ip}`).then(res => res.json());
    if (geo.status === 'success') {
      countryCode = geo.countryCode;
    }
  } catch {}

  // Step 3: Language Map
  const map = {
    SA: 'ar', EG: 'ar', AE: 'ar',
    DE: 'de', AT: 'de', CH: 'de',
    ES: 'es', MX: 'es', AR: 'es',
    FR: 'fr', RU: 'ru'
  };
  const lang = map[countryCode] || 'en';

  // Step 4: Redirect
  if (lang !== 'en') {
    url.searchParams.set('translated', '1');
    const redirectURL = `https://translate.google.com/translate?hl=${lang}&sl=en&tl=${lang}&u=${encodeURIComponent(url.toString())}`;
    return NextResponse.redirect(redirectURL);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
