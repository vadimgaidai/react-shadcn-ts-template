import type { FC } from 'react'
import { useRoutes } from 'react-router'

import { Toaster } from './components/ui/sonner'

import { cn } from '@/lib/utils.ts'
import { AuthProvider } from '@/providers/auth'
import { ThemeProvider } from '@/providers/theme'
import routes from '@/routes'

const App: FC = () => {
  const element = useRoutes(routes)

  return (
    <AuthProvider>
      <ThemeProvider>
        <div className={cn('bg-background min-h-screen w-full font-sans antialiased')}>
          {element}
        </div>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
