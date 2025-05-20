import type { AuthResponse, LoginPayload } from './types'

import api from '@/lib/ky'
import { getRefreshToken } from '@/utils/storage'

const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    return api.post('auth/login', { json: payload }).json<AuthResponse>()
  },
  refresh: async (): Promise<AuthResponse> => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token')
    }
    return api.post('auth/refresh', { json: { refreshToken } }).json<AuthResponse>()
  },
}

export default authApi
