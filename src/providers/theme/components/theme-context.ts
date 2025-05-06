import { createContext } from 'react'

import { initialState } from '../config'
import type { ThemeProviderState } from '../types'

const ThemeContext = createContext<ThemeProviderState>(initialState)

export default ThemeContext
