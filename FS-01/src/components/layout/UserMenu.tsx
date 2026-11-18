import { useNavigate } from "react-router-dom"
import { LogOut, Monitor, Moon, Settings, Sun, User as UserIcon } from "lucide-react"
import { toast } from "sonner"
import { UserAvatar } from "@/components/common/UserAvatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppStore, type Theme } from "@/store/appStore"
import { useCurrentUser } from "@/store/workspaceStore"

export function UserMenu() {
  const navigate = useNavigate()
  const user = useCurrentUser()
  const { theme, setTheme, logout } = useAppStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<button type="button" aria-label="Account menu" className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />}>
        <UserAvatar user={user} size="sm" showStatus />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2.5 py-2">
            <UserAvatar user={user} size="md" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-foreground">{user.name}</span>
              <span className="block truncate text-xs font-normal">{user.email}</span>
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/settings?tab=profile")}><UserIcon /> Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}><Settings /> Settings</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger><Sun /> Theme</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as Theme)}>
              <DropdownMenuRadioItem value="light"><Sun /> Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark"><Moon /> Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system"><Monitor /> System</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            logout()
            toast("Signed out")
            navigate("/login")
          }}
        >
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
