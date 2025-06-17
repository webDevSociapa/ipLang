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
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        const ip = ipData.ip;

        const geoRes = await fetch(`https://ip-api.com/json/${ip}`); // ✅ HTTPS here
        const geoData = await geoRes.json();

        const countryCode = geoData.countryCode || 'US';

        const map = {
          SA: 'ar', EG: 'ar', AE: 'ar',
          DE: 'de', AT: 'de', CH: 'de',
          ES: 'es', MX: 'es', AR: 'es',
          FR: 'fr', RU: 'ru',
        };

        const language = map[countryCode] || 'en';

        setInfo({
          ip,
          country: countryCode,
          language,
        });
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
