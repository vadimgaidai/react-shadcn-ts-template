import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'

import type { Sidebar } from '@/components/ui/sidebar'
import type { paths } from '@/constants/paths.constant'

export interface INavigationSubItem {
  title: string
  url: (typeof paths)[keyof typeof paths]
  isActive?: boolean
}

export interface INavigationItem {
  title: string
  url: (typeof paths)[keyof typeof paths]
  icon?: LucideIcon
  items?: INavigationSubItem[]
}

export type INavigationConfig = Array<INavigationItem>

export interface IAside extends ComponentProps<typeof Sidebar> {
  className?: string
}
