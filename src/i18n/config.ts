import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import nsEN from './en/translation.json'

export const locales = {
  en: 'en',
} as const

export type Locales = (typeof locales)[keyof typeof locales]

export const I18_LANG = 'i18nextLng'

const lang = locales.en
document.documentElement.lang = lang

i18next.use(initReactI18next).init({
  lng: lang,
  debug: import.meta.env.MODE !== 'production',
  resources: {
    en: { translation: nsEN },
  },
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
  },
})
