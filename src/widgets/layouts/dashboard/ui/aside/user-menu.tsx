import { LogOut } from "lucide-react"
import type { FC } from "react"

import { useAuth } from "@/features/auth"
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/shared/ui"

export const UserMenu: FC = () => {
  const { user, logout } = useAuth()

  const getInitials = (name?: string): string => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = () => {
    logout().catch((error) => {
      console.error("Logout failed:", error)
    })
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={user?.avatar} alt={user?.name} />
        <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
      </Avatar>
      <p className="ml-1 flex-1 truncate text-sm font-medium">{user?.name || "Guest"}</p>
      <Button size="icon" variant="ghost" onClick={handleLogout} title="Logout">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
