import type { HTTPError } from "ky"

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface HttpClientConfig {
  baseUrl: string
  timeout?: number
}

export type { HTTPError }
