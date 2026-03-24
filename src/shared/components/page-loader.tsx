import type { FC } from "react"

import { Spinner } from "@/shared/ui/spinner"

export const PageLoader: FC = () => {
  return (
    <div className="flex h-full flex-1 items-center justify-center p-6">
      <Spinner className="size-6" />
    </div>
  )
}
