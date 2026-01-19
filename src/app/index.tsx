import type { FC } from "react"
import { useRoutes } from "react-router"

import { AppProviders } from "./providers"
import { routes } from "./routes"

import { cn } from "@/shared/lib"
import { Toaster } from "@/shared/ui/sonner"

const App: FC = () => {
  const element = useRoutes(routes)

  return (
    <AppProviders>
      <div className={cn("bg-background min-h-screen w-full font-sans antialiased")}>{element}</div>
      <Toaster />
    </AppProviders>
  )
}

export default App
