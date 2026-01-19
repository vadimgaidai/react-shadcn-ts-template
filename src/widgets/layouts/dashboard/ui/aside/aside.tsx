import type { ComponentProps, FC } from "react"
import { Link } from "react-router"

import { Navigation } from "./navigation"
import { UserMenu } from "./user-menu"

import { env } from "@/shared/config"
import { cn } from "@/shared/lib"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Separator } from "@/shared/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar"

interface AsideProps extends ComponentProps<typeof Sidebar> {
  className?: string
}

/**
 * Main application sidebar with navigation and user menu
 */
export const Aside: FC<AsideProps> = ({ className, ...props }) => {
  const appName = env.VITE_APP_NAME
  const appVersion = "1.0.0"
  const appInitial = appName[0] ?? "A"

  return (
    <Sidebar className={cn(className)} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/" className="outline-none">
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

      <Separator />

      <SidebarContent>
        <ScrollArea className="flex-initial gap-0">
          <div className="p-4">
            <Navigation />
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4">
          <UserMenu />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
