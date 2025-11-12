/**
 * Base API types and interfaces
 */

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
