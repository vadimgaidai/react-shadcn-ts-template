import { LogOut } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

import { Button } from '@/components/ui/button'

interface LogoutProps {
  onLogout?: () => void
}

const Logout: React.FC<LogoutProps> = ({ onLogout }) => {
  const onLogoutHandler = () => {
    if (onLogout) {
      onLogout()
    }
  }

  return (
    <div className="flex items-center">
      <Avatar>
        <AvatarImage src="https://ui.shadcn.com/avatars/shadcn.jpg" />
        <AvatarFallback className="bg-white">shadcn</AvatarFallback>
      </Avatar>
      <p className="ml-4 truncate">shadcn</p>
      <Button className="ml-auto" size="icon" variant="ghost" onClick={onLogoutHandler}>
        <LogOut />
      </Button>
    </div>
  )
}

export default Logout
