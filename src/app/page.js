'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [info, setInfo] = useState({ ip: '', country: '', language: 'en' });
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

  const translations = {
    en: {
      welcome: 'Welcome to our website',
      desc: 'This page automatically translates based on your IP address.',
      ip: 'IPv4 Address',
      country: 'Detected Country',
      lang: 'Target Language',
      changeLang: 'Change Language',
    },
    es: {
      welcome: 'Bienvenido a nuestro sitio web',
      desc: 'Esta página se traduce automáticamente según su dirección IP.',
      ip: 'Dirección IPv4',
      country: 'País detectado',
      lang: 'Idioma objetivo',
      changeLang: 'Cambiar idioma',
    },
    fr: {
      welcome: 'Bienvenue sur notre site Web',
      desc: 'Cette page se traduit automatiquement en fonction de votre adresse IP.',
      ip: 'Adresse IPv4',
      country: 'Pays détecté',
      lang: 'Langue cible',
      changeLang: 'Changer de langue',
    },
    ar: {
      welcome: 'مرحبًا بك في موقعنا',
      desc: 'يتم ترجمة هذه الصفحة تلقائيًا بناءً على عنوان IP الخاص بك.',
      ip: 'عنوان IPv4',
      country: 'الدولة المكتشفة',
      lang: 'اللغة المستهدفة',
      changeLang: 'تغيير اللغة',
    },
    // Add more as needed...
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
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        const ip = ipData.ip;

        const geoRes = await fetch(`https://ipwho.is/${ip}`);
        const geoData = await geoRes.json();

        const countryCode = geoData.country_code || 'US';
        const detectedLang = countryLangMap[countryCode] || 'en';

        setInfo({ ip, country: countryCode, language: detectedLang });
        setManualLang(detectedLang);
      } catch (error) {
        console.error('Error fetching IP or location info:', error);
      }
    };

    getInfo();
  }, []);

  const selectedLang = manualLang || info.language;
  const t = translations[selectedLang] || translations.en;

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>{t.welcome}</h1>
      <p>{t.desc}</p>

      <ul>
        <li><strong>{t.ip}:</strong> {info.ip}</li>
        <li><strong>{t.country}:</strong> {info.country}</li>
        <li><strong>{t.lang}:</strong> {selectedLang}</li>
      </ul>

      <div style={{ marginTop: '20px', position: 'relative', display: 'inline-block' }}>
        <label htmlFor="language-select" style={{ marginRight: '10px' }}>
          <strong>{t.changeLang}:</strong>
        </label>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          <select
            id="language-select"
            value={manualLang}
            onChange={(e) => setManualLang(e.target.value)}
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
