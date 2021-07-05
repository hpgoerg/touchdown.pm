/**
 * @module i18n
 *
 * @description
 * Defines the location of the used locale (i18n) files
 * and initializes i18n (i18next)
 *
 * @author Hans-Peter Görg
 **/

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

import deTranslations from './i18n/locales/de.json';
import enTranslations from './i18n/locales/en.json';

const resources = {
    en: {
        translation: enTranslations
    },
    de: {
        translation: deTranslations
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(LanguageDetector)
    .init({
        resources,
        fallbackLng: 'en',
        keySeparator: true, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
