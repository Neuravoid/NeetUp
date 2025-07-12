import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translations
import enCommon from './locales/en/common.json';
import trCommon from './locales/tr/common.json';

// Translation resources
const resources = {
  en: {
    common: enCommon
  },
  tr: {
    common: trCommon
  }
};

i18n
  // Load translations from HTTP backend (for production/larger apps)
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production',
    
    // Common namespace used in the app
    ns: ['common'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false, // not needed for React as it escapes by default
    },
    
    // Language detector options
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    
    react: {
      useSuspense: true,
    },
  });

export default i18n;
