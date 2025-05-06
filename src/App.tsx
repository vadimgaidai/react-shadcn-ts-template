import type { FC } from 'react'
import { useRoutes } from 'react-router'

import { Toaster } from './components/ui/sonner'

import { cn } from '@/lib/utils.ts'
import { ThemeProvider } from '@/providers/theme'
import routes from '@/routes'

const App: FC = () => {
  const element = useRoutes(routes)

  return (
    <ThemeProvider>
      <div className={cn('bg-background min-h-screen w-full font-sans antialiased')}>{element}</div>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
