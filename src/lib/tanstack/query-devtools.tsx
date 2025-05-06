import { lazy } from 'react'

export const TanStackQueryDevtools =
  import.meta.env.MODE === 'production'
    ? (): null => null
    : lazy(() =>
        import('@tanstack/react-query-devtools').then((d) => ({
          default: d.ReactQueryDevtools,
        }))
      )
