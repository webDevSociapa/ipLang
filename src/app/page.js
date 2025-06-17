'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [info, setInfo] = useState({ ip: '', country: '', lang: '' });

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        const ip = data.ip;
        fetch(`http://ip-api.com/json/${ip}`)
          .then(res => res.json())
          .then(geo => {
            const map = {
              SA: 'ar', EG: 'ar', AE: 'ar',
              DE: 'de', AT: 'de', CH: 'de',
              ES: 'es', MX: 'es', AR: 'es',
              FR: 'fr', RU: 'ru'
            };
            const lang = map[geo.countryCode] || 'en';
            setInfo({ ip, country: geo.countryCode, lang });
          });
      });
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome to our website</h1>
      <p>This page automatically translates based on your IP address.</p>
      <ul>
        <li><strong>IPv4 Address:</strong> {info.ip}</li>
        <li><strong>Detected Country:</strong> {info.country}</li>
        <li><strong>Target Language:</strong> {info.lang}</li>
      </ul>
    </main>
  );
}
