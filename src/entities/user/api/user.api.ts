import type { User } from "../model/types"

import { httpClient } from "@/shared/lib"

export const userApi = {
  getMe: async (): Promise<User> => {
    return httpClient.get("users/me").json<User>()
  },
}
