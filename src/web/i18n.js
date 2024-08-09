import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

import translationEN from "./locales/en/translation.json";
import translationUK from "./locales/uk/translation.json";
import translationRU from "./locales/ru/translation.json";
import translationDE from "./locales/de/translation.json";
import translationPL from "./locales/pl/translation.json";
import translationCh from "./locales/ch/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  uk: {
    translation: translationUK,
  },
  ru: {
    translation: translationRU,
  },
  de: {
    translation: translationDE,
  },
  pl: {
    translation: translationPL,
  },
  ch: {
    translation: translationCh,
  }
};

i18n
	.use(Backend)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: 'en',
		debug: true,
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
