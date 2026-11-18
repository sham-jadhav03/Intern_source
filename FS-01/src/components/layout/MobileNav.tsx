import { NavLink } from "react-router-dom"
import { Home, LayoutGrid, Plus, Search, Settings } from "lucide-react"
import { useCreatePage } from "@/hooks/useCreatePage"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/appStore"
import { useWorkspaceStore } from "@/store/workspaceStore"

const item = ({ isActive }: { isActive: boolean }) =>
  cn("flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium text-muted-foreground", isActive && "text-foreground")

/** Bottom tab bar for phones; the full sidebar lives in a drawer. */
export function MobileNav() {
  const createPage = useCreatePage()
  const setSearchOpen = useAppStore((s) => s.setSearchOpen)
  const wsId = useWorkspaceStore((s) => s.currentWorkspaceId)

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <NavLink to="/dashboard" className={item}><Home className="size-5" /> Home</NavLink>
      <NavLink to={`/workspace/${wsId}`} end className={item}><LayoutGrid className="size-5" /> Pages</NavLink>
      <button type="button" onClick={() => createPage()} className="flex flex-1 items-center justify-center" aria-label="New page">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
          <Plus className="size-5" />
        </span>
      </button>
      <button type="button" onClick={() => setSearchOpen(true)} className={item({ isActive: false })}><Search className="size-5" /> Search</button>
      <NavLink to="/settings" className={item}><Settings className="size-5" /> Settings</NavLink>
    </nav>
  )
}
