import type { FC } from "react"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router"

import { menuConfig } from "../../config/menu.config"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/ui"

export const Navigation: FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const parentLocation = String(location.pathname.split("/").filter(Boolean)[0] ?? "")

  return (
    <SidebarMenu>
      {menuConfig.map((item) => {
        const isItemActive = item.url.includes(parentLocation) || item.url === location.pathname

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              className="h-auto"
              {...(isItemActive ? { isActive: true } : {})}
            >
              <Link to={item.url}>
                {item?.icon && <item.icon />}
                <span>{t(item.title)}</span>
              </Link>
            </SidebarMenuButton>
            {item.items?.length ? (
              <SidebarMenuSub>
                {item.items.map((subItem) => {
                  const isSubItemActive = subItem.url === location.pathname || subItem.isActive

                  return (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        {...(isSubItemActive ? { isActive: true } : {})}
                      >
                        <Link to={subItem.url}>{t(subItem.title)}</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                })}
              </SidebarMenuSub>
            ) : null}
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
