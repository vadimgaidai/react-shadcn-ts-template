import { useContext } from 'react'

import AuthContext from '../components/auth-context'
import type { AuthContextType } from '../types'

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
