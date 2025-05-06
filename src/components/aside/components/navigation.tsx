import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'

import { menuConfig } from '@/components/aside'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

const Navigation: FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const parentLocation = String(location.pathname.split('/').filter(Boolean).at(0))

  return (
    <SidebarMenu>
      {menuConfig.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            className="h-auto"
            isActive={item.url.includes(parentLocation) || item.url === location.pathname}
          >
            <Link to={item.url}>
              {item?.icon && <item.icon />}
              <span>{t(item.title)}</span>
            </Link>
          </SidebarMenuButton>
          {item.items?.length ? (
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={subItem.url === location.pathname || subItem.isActive}
                  >
                    <Link to={subItem.url}>{t(subItem.title)}</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          ) : null}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export default Navigation
