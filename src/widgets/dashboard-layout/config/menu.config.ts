import { House } from "lucide-react"

import { paths } from "@/shared/config"
import type { NavigationConfig } from "@/widgets/dashboard-layout"

export const menuConfig: NavigationConfig = [
  {
    title: "navigation.home",
    url: paths.home,
    icon: House,
  },
]
