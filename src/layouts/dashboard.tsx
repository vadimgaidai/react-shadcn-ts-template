import type { FC, ReactNode } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import { Aside, menuConfig } from '@/components/aside'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

const DashboardLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const parentLocation = String(location.pathname.split('/').filter(Boolean).at(0))

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
    <div className="bg-primary-gradient h-screen">
      <SidebarProvider>
        <Aside />
        <SidebarInset className="h-screen bg-transparent">
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger className="text-muted-foreground hover:text-primary -ml-1 hover:bg-transparent" />
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
            </div>
          </header>
          <Separator />
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default DashboardLayout
