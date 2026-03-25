import type { FC, ReactNode } from "react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router"

import { Aside } from "./aside/aside"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb"
import { Separator } from "@/shared/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/shared/ui/sidebar"
import { menuConfig } from "@/widgets/dashboard-layout"

interface DashboardLayoutProps {
  children: ReactNode
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const parentLocation = String(location.pathname.split("/").filter(Boolean)[0] ?? "")

  const { currentSection, currentSubSection } = useMemo(() => {
    const section = menuConfig.find(
      (el) => el.url.includes(parentLocation) || el.url === location.pathname
    )
    const subSection = section?.items?.find((item) => item.url === location.pathname)

    return {
      currentSection: section,
      currentSubSection: subSection,
    }
  }, [location.pathname, parentLocation])

  return (
    <SidebarProvider>
      <Aside />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {currentSection && (
                <>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={currentSection.url}>
                      {t(currentSection.title)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {currentSubSection && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{t(currentSubSection.title)}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
