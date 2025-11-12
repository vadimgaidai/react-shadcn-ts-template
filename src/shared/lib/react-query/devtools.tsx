import { lazy } from "react"

import { env } from "@/shared/config"

/**
 * Lazy-loaded React Query DevTools
 */
export const ReactQueryDevtools =
  env.MODE === "development" && env.VITE_ENABLE_DEVTOOLS
    ? lazy(() =>
        import("@tanstack/react-query-devtools").then((d) => ({
          default: d.ReactQueryDevtools,
        }))
      )
    : () => null
