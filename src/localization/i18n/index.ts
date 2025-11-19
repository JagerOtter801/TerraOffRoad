import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import en from './en.json'
import es from './es.json';


const resources = {
    en: {translation:en},
    es: {translation:es }
};

// Check the user's device language settings and find the best match
const deviceLanguage = RNLocalize.findBestLanguageTag(['en','es']);


// Initialize i18next with React Native support
// - resources: provides all translation files
// - lng: sets the initial language to device language, defaults to English if no match
// - fallbackLng: uses English if a translation is missing in the selected language
// - interpolation.escapeValue: set to false because React already escapes values to prevent XSS attacks
i18n.use(initReactI18next).init({resources, lng: deviceLanguage?.languageTag || 'en',
    fallbackLng : 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;