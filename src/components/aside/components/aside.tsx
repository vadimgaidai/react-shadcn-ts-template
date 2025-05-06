import type { FC } from 'react'
import { Link } from 'react-router'

import Navigation from './navigation'

import type { IAside } from '@/components/aside'
import Logout from '@/components/logout'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const Aside: FC<IAside> = ({ className, ...props }) => (
  <Sidebar className={cn(className)} {...props}>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <Link to="/" className="outline-none">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <span className="text-lg font-bold">L</span>
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Logo</span>
                <span className="text-xs">v1.0.0</span>
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
        <Logout />
      </div>
    </SidebarFooter>
  </Sidebar>
)

export default Aside
