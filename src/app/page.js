'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [info, setInfo] = useState({
    ip: '',
    country: '',
    language: '',
  });

  const [manualLang, setManualLang] = useState('');

  const languageMap = {
    en: 'English',
    ar: 'Arabic',
    de: 'German',
    es: 'Spanish',
    fr: 'French',
    ru: 'Russian',
    ja: 'Japanese',
  };

  const countryLangMap = {
    SA: 'ar', EG: 'ar', AE: 'ar',
    DE: 'de', AT: 'de', CH: 'de',
    ES: 'es', MX: 'es', AR: 'es',
    FR: 'fr', RU: 'ru', JP: 'ja',
  };

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
        const detectedLang = countryLangMap[countryCode] || 'en';

        // Prevent redirect loop by checking if already on Google Translate
        if (detectedLang !== 'en' && !translated && !window.location.hostname.includes('translate.google')) {
          const originalURL = window.location.origin + window.location.pathname + window.location.search;
          const sep = originalURL.includes('?') ? '&' : '?';
          const redirectURL = `https://translate.google.com/translate?hl=${detectedLang}&sl=en&tl=${detectedLang}&u=${encodeURIComponent(originalURL + sep + 'translated=1')}`;
          window.location.href = redirectURL;
          return;
        }

        setInfo({ ip, country: countryCode, language: detectedLang });
      } catch (error) {
        console.error('Error fetching IP or location info:', error);
      }
    };

    getInfo();
  }, []);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setManualLang(selectedLang);

    if (selectedLang) {
      const originalURL = window.location.origin + window.location.pathname + window.location.search;
      const sep = originalURL.includes('?') ? '&' : '?';
      const redirectURL = `https://translate.google.com/translate?hl=${selectedLang}&sl=en&tl=${selectedLang}&u=${encodeURIComponent(originalURL + sep + 'translated=1')}`;
      window.location.href = redirectURL;
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Welcome to our website</h1>
      <p>This page automatically translates based on your IP address.</p>

      <ul>
        <li><strong>IPv4 Address:</strong> {info.ip}</li>
        <li><strong>Detected Country:</strong> {info.country}</li>
        <li><strong>Target Language:</strong> {info.language}</li>
      </ul>

      <div style={{ marginTop: '20px', position: 'relative', display: 'inline-block' }}>
        <label htmlFor="language-select" style={{ marginRight: '10px' }}>
          <strong>Change Language:</strong>
        </label>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          <select
            id="language-select"
            value={manualLang}
            onChange={handleLanguageChange}
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              width: '180px'
            }}
          >
            <option value="">Select Language</option>
            {Object.entries(languageMap).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
          <span style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            fontSize: '12px',
          }}>▼</span>
        </div>
      </div>
    </main>
  );
}
