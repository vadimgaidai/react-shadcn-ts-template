export type User = unknown | null

export type AuthContextType = {
  user: User
  isAuthenticated: boolean
  login: (payload: { email: string; password: string }) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
}

export type AuthProviderProps = {
  children: React.ReactNode
}
