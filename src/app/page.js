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

  const safeJsonFetch = async (url, fallback = {}) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`Fetch failed for ${url}:`, err.message);
      return fallback;
    }
  };

  const setCookie = (name, value, domain) => {
    const base = `${name}=${value}; path=/;`;
    document.cookie = base;
    document.cookie = base + ` domain=${domain || window.location.hostname};`;
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setManualLang(selectedLang);

    if (!selectedLang) return;

    setCookie('googtrans', `/en/${selectedLang}`);
    setCookie('googtrans', `/en/${selectedLang}`, `.${window.location.hostname}`);
    window.location.reload();
  };

  useEffect(() => {
    const getInfo = async () => {
      const ipData = await safeJsonFetch('https://api.ipify.org?format=json', { ip: '0.0.0.0' });
      const ip = ipData.ip || '0.0.0.0';

      const geoData = await safeJsonFetch(`https://ipwho.is/${ip}`, { country_code: 'US', success: false });
      const countryCode = geoData.country_code || 'US';
      const detectedLang = countryLangMap[countryCode] || 'en';

      // If not already translated and not English, set cookie and reload
      const currentCookie = document.cookie.includes('googtrans');
      if (!currentCookie && detectedLang !== 'en') {
        setCookie('googtrans', `/en/${detectedLang}`);
        setCookie('googtrans', `/en/${detectedLang}`, `.${window.location.hostname}`);
        window.location.reload();
        return;
      }

      setInfo({ ip, country: countryCode, language: detectedLang });
    };

    getInfo();
  }, []);

  useEffect(() => {
    const addTranslateScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: Object.keys(languageMap).join(','),
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      };
    };

    addTranslateScript();
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

      <div style={{ marginTop: '20px', position: 'relative', display: 'inline-block' }}>
        <label htmlFor="language-select" style={{ marginRight: '10px' }}>
          <strong>Change Language:</strong>
        </label>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          <select
            id="language-select"
            value={manualLang}
            onChange={handleLanguageChange}
            className="notranslate"
            translate="no"
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
              width: '180px',
            }}
          >
            <option value="">Select Language</option>
            {Object.entries(languageMap).map(([code, name]) => (
              <option key={code} value={code} className="notranslate" translate="no">
                {name}
              </option>
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

      <div id="google_translate_element" style={{ display: 'none' }}></div>
    </main>
  );
}
