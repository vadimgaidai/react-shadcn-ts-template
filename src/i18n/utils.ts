import { I18_LANG, locales } from './config'

export const getLanguageCodeFromLS = () => {
  try {
    const codeFromStorage = localStorage.getItem(I18_LANG)
    return codeFromStorage || locales.en
  } catch {
    return locales.en
  }
}
