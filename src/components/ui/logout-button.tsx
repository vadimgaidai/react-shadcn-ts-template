import { Button } from '@/components/ui/button'

const LogoutButton = () => {
  const handleLogout = () => {
    // TODO: Add your logout logic here (clear tokens, redirect, etc.)
    alert('Logged out!')
  }

  return (
    <Button variant="outline" className="w-full" onClick={handleLogout}>
      Logout
    </Button>
  )
}

export default LogoutButton
