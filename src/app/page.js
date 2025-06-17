'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [info, setInfo] = useState({
    ip: '',
    country: '',
    language: '',
  });

  useEffect(() => {
    const getInfo = async () => {
      try {
        const translated = new URLSearchParams(window.location.search).get("translated");

        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        const ip = ipData.ip;

        const geoRes = await fetch(`https://ipwho.is/${ip}`);
        const geoData = await geoRes.json();

        const countryCode = geoData.country_code || 'US';

        const map = {
          SA: 'ar', EG: 'ar', AE: 'ar',
          DE: 'de', AT: 'de', CH: 'de',
          ES: 'es', MX: 'es', AR: 'es',
          FR: 'fr', RU: 'ru',
        };

        const language = map[countryCode] || 'en';

        // ✅ Auto-redirect to Google Translate if not already translated
        if (language !== 'en' && !translated) {
          const currentURL = window.location.href;
          const sep = currentURL.includes('?') ? '&' : '?';
          const redirectURL = `https://translate.google.com/translate?hl=${language}&sl=en&tl=${language}&u=${encodeURIComponent(currentURL + sep + 'translated=1')}`;
          window.location.href = redirectURL;
          return;
        }

        setInfo({ ip, country: countryCode, language });
      } catch (error) {
        console.error('Error fetching IP or location info:', error);
      }
    };

    getInfo();
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Welcome to our website</h1>
      <p>This page automatically translates based on your IP address.</p>
      <ul>
        <li><strong>IPv4 Address:</strong> {info.ip}</li>
        <li><strong>Detected Country:</strong> {info.country}</li>
        <li><strong>Target Language:</strong> {info.language}</li>
      </ul>
    </main>
  );
}
