import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector"; // Importa o detector

// Importa os arquivos de tradução (JSON)
import pt from './locales/pt.json';
import en from './locales/en.json';

i18n
  .use(LanguageDetector)  // Usando o detector de linguagem
  .use(initReactI18next)   // Integrando com React
  .init({
    resources: {
      pt: { translation: pt },   // Texto em português
      en: { translation: en },   // Texto em inglês
    },
    fallbackLng: "pt",    // Idioma fallback, caso o navegador não tenha preferência
    interpolation: {
      escapeValue: false, // React já escapa o valor
    },
  });

export default i18n;
