import ky, { type KyInstance } from 'ky'

import { getAccessToken } from '@/utils/storage'

const api: KyInstance = ky.create({
  prefixUrl: '/api',
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
