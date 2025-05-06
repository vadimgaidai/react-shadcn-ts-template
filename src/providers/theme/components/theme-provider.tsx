import type { FC } from 'react'
import { useEffect, useState } from 'react'

import { DEFAULT_STORAGE_KEY, DEFAULT_THEME } from '../config'
import type { Theme, ThemeProviderProps } from '../types'

import ThemeProviderContext from './theme-context'

const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = DEFAULT_STORAGE_KEY,
  ...props
}) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (themeState: Theme): void => {
      localStorage.setItem(storageKey, themeState)
      setTheme(themeState)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export default ThemeProvider
