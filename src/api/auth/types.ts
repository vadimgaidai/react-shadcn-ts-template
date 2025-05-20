export type AuthResponse = {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export type LoginPayload = {
  email: string
  password: string
}
