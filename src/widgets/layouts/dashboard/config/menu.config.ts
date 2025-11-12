import { House } from "lucide-react"

import type { NavigationConfig } from "../model/types"

import { paths } from "@/shared/config"

export const menuConfig: NavigationConfig = [
  {
    title: "navigation.home",
    url: paths.home,
    icon: House,
  },
]
