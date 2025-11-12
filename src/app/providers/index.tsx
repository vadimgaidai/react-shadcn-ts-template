import { QueryClientProvider } from "@tanstack/react-query"
import type { FC, ReactNode } from "react"
import { Suspense } from "react"

import { ThemeProvider } from "./theme-provider"

import { queryClient, ReactQueryDevtools } from "@/shared/lib"

interface AppProvidersProps {
  children: ReactNode
}

export const AppProviders: FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        {children}
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
