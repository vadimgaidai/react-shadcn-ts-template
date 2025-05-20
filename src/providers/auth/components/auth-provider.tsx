import { useQuery } from '@tanstack/react-query'
import { useReadLocalStorage } from 'usehooks-ts'

import type { AuthProviderProps } from '../types'

import AuthContext from './auth-context'

import authApi from '@/api/auth/api'
import type { LoginPayload } from '@/api/auth/types'
import { userApi, userQueryKeys, type IUser } from '@/api/user'
import { ACCESS_TOKEN_KEY } from '@/constants/auth.constant'
import { setTokens, removeTokens } from '@/utils/storage'

const AuthProvider = ({ children }: AuthProviderProps) => {
  const isAuthenticated = useReadLocalStorage<string>(ACCESS_TOKEN_KEY)

  const { data: user, refetch } = useQuery<IUser>({
    queryKey: [userQueryKeys.me],
    queryFn: userApi.getMe,
    enabled: Boolean(isAuthenticated),
  })

  const handleLogin = async (payload: LoginPayload) => {
    try {
      const res = await authApi.login(payload)
      setTokens(res.accessToken, res.refreshToken, res.expiresIn)
      refetch()
    } catch {
      // handle error (e.g. show notification)
    }
  }

  const handleLogout = () => {
    try {
      removeTokens()
      // user will be undefined because enabled: isAuthenticated
    } catch {
      // handle error
    }
  }

  const handleRefresh = async () => {
    try {
      const res = await authApi.refresh()
      setTokens(res.accessToken, res.refreshToken, res.expiresIn)
      refetch()
    } catch {
      handleLogout()
      // handle error (e.g. show notification)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(isAuthenticated),
        login: handleLogin,
        logout: handleLogout,
        refresh: handleRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
