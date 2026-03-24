import type { FC } from "react"
import { Link } from "react-router"

import { Navigation } from "./navigation"
import { UserMenu } from "./user-menu"

import { env } from "@/shared/config"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/shared/ui/sidebar"

export const Aside: FC = () => {
  const appName = env.VITE_APP_NAME
  const appVersion = "1.0.0"
  const appInitial = appName[0] ?? "A"

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <span className="text-lg font-bold">{appInitial}</span>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{appName}</span>
                  <span className="text-xs">v{appVersion}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Navigation />
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
