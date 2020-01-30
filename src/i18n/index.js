import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LngDetector from "i18next-browser-languagedetector";
import en from "./lang.en.json";
import ru from "./lang.ru.json";
import { DEFAULT_LANG } from "../config.js";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
};

i18n
  .use(LngDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: DEFAULT_LANG,
    detection: {
      order: ["querystring", "localStorage", "cookie"],
      lookupQuerystring: "lang",
      lookupCookie: "i18next",
      lookupLocalStorage: "i18nextLng",
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      caches: ["localStorage", "cookie"],
      excludeCacheFor: ["cimode"],
    },
    keySeparator: ".", // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
