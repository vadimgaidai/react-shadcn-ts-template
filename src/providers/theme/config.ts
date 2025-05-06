import type { ThemeProviderState } from './types'

export const DEFAULT_STORAGE_KEY = 'vite-ui-theme'
export const DEFAULT_THEME = 'system'

export const initialState: ThemeProviderState = {
  theme: DEFAULT_THEME,
  setTheme: () => null,
}
