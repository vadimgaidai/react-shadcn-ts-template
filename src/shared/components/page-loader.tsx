import type { FC } from "react"

/**
 * Page loader component
 */
export const PageLoader: FC = () => {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  )
}
