import { House } from 'lucide-react'

import type { INavigationConfig } from './types'

import { paths } from '@/constants/paths.constant'

export const menuConfig: INavigationConfig = [
  {
    title: 'navigation.home',
    url: paths.homePage,
    icon: House,
  },
]
