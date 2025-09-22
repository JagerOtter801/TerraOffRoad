import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import en from './en.json'
import es from './es.json';


const resources = {
    en: {translation:en},
    es: {translation:es }
};

const deviceLanguage = RNLocalize.findBestLanguageTag(['en','es']);

i18n.use(initReactI18next).init({resources, lng: deviceLanguage?.languageTag || 'en',
    fallbackLng : 'en',
    interpolation: {
        escapeValue: false,
    },
});
