export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  Admin = "admin",
  User = "user",
  Guest = "guest",
}

export interface UserProfile extends User {
  bio?: string
  phone?: string
}
