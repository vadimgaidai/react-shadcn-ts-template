/**
 * Application route paths
 */
export const paths = {
  home: "/",
  login: "/login",
  register: "/register",
  profile: "/profile",
  settings: "/settings",
} as const

export type AppPath = (typeof paths)[keyof typeof paths]
