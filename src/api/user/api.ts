import type { IUser } from './types'

import api from '@/lib/ky'

const userApi = {
  getMe: async (): Promise<IUser> => {
    return api.get('get-me').json<IUser>()
  },
}

export default userApi
