import ky, { type KyInstance, type HTTPError } from "ky"

import { env } from "@/shared/config"
import { tokenStorage } from "@/shared/lib"

const createHttpClient = (): KyInstance => {
  return ky.create({
    prefixUrl: `${env.VITE_API_URL}/api/`,
    timeout: 30000,
    retry: {
      limit: 0,
      methods: ["get", "post", "put", "patch", "delete"],
    },
    hooks: {
      beforeRequest: [
        (request) => {
          const token = tokenStorage.getAccessToken()
          if (token) {
            request.headers.set("Authorization", `Bearer ${token}`)
          }
        },
      ],
      beforeError: [
        async (error) => {
          const { response } = error

          if (response) {
            try {
              const errorBody = await response.json<{ message?: string; errors?: unknown }>()
              error.message = errorBody.message || error.message
            } catch {
              // Response is not JSON or already consumed
            }
          }

          return error
        },
      ],
    },
  })
}

export const httpClient = createHttpClient()

export type { HTTPError }
