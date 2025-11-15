import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';
import deTranslations from './locales/de.json';
import esTranslations from './locales/es.json';
import itTranslations from './locales/it.json';
import trTranslations from './locales/tr.json';
import hiTranslations from './locales/hi.json';
import jaTranslations from './locales/ja.json';
import zhTranslations from './locales/zh.json';

const resources = {
  en: { translation: enTranslations },
  fr: { translation: frTranslations },
  de: { translation: deTranslations },
  es: { translation: esTranslations },
  it: { translation: itTranslations },
  tr: { translation: trTranslations },
  hi: { translation: hiTranslations },
  ja: { translation: jaTranslations },
  zh: { translation: zhTranslations }
};

// Initialize i18n synchronously to prevent blank screens
i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Fallback language
    lng: 'en', // Default language
    debug: false, // Set to true for debugging

    interpolation: {
      escapeValue: false // React already escapes values
    },

    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },

    react: {
      useSuspense: false // Disable Suspense to prevent blank screens - we handle loading states manually
    },

    // Load resources synchronously
    initImmediate: false
  });

export default i18n;

