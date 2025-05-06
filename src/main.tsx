import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import '@/assets/global.css'
import '@/i18n/config'

import App from './App.tsx'
import { queryClient, TanStackQueryDevtools } from './lib/tanstack'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <TanStackQueryDevtools buttonPosition="bottom-right" />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
