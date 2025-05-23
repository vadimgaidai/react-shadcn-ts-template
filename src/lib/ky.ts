import ky, { type KyInstance } from 'ky'

import { getAccessToken } from '@/utils/storage'

const api: KyInstance = ky.create({
  prefixUrl: `${import.meta.env.VITE_API_URL}/api/`,
  hooks: {
    beforeRequest: [
      (request: Request) => {
        const token = getAccessToken()
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
  },
})

export default api
