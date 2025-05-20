import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  ACCESS_TOKEN_EXPIRES_AT_KEY,
} from '@/constants/auth.constant'

/**
 * Stores tokens and access token expiration time in localStorage
 * @param accessToken - JWT access token
 * @param refreshToken - JWT refresh token
 * @param expiresIn - seconds until access token expires
 */
export const setTokens = (accessToken: string, refreshToken: string, expiresIn: number) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  const expiresAt = Date.now() + expiresIn * 1000
  localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, expiresAt.toString())
}

/** Returns the access token from localStorage */
export const getAccessToken = (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY)

/** Returns the refresh token from localStorage */
export const getRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY)

/** Returns the access token expiration timestamp (ms) from localStorage */
export const getAccessTokenExpiresAt = (): number | null => {
  const val = localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_KEY)
  return val ? parseInt(val, 10) : null
}

/** Removes all tokens and expiration from localStorage */
export const removeTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY)
}

/** Returns true if the access token is expired (or missing expiration) */
export const isAccessTokenExpired = (): boolean => {
  const expiresAt = getAccessTokenExpiresAt()
  if (!expiresAt) return true
  return Date.now() >= expiresAt
}
