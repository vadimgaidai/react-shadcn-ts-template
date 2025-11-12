import type { LucideIcon } from "lucide-react"

import type { AppPath } from "@/shared/config"

export interface NavigationSubItem {
  title: string
  url: AppPath
  isActive?: boolean
}

export interface NavigationItem {
  title: string
  url: AppPath
  icon?: LucideIcon
  items?: NavigationSubItem[]
}

export type NavigationConfig = NavigationItem[]
