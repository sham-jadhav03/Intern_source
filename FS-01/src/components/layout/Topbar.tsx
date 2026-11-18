import type { ReactNode } from "react"
import { Menu, Moon, PanelLeftOpen, Search, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useAppStore, useResolvedTheme } from "@/store/appStore"
import { UserMenu } from "./UserMenu"

interface Props {
  children?: ReactNode
  actions?: ReactNode
  showSearch?: boolean
  className?: string
}

export function Topbar({ children, actions, showSearch = true, className }: Props) {
  const { sidebarCollapsed, toggleSidebar, setMobileNavOpen, setSearchOpen, setTheme } = useAppStore()
  const resolved = useResolvedTheme()

  return (
    <header className={cn("sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur-md sm:px-4", className)}>
      <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}>
        <Menu />
      </Button>
      {sidebarCollapsed && (
        <Button variant="ghost" size="icon-sm" className="max-lg:hidden" aria-label="Expand sidebar" onClick={toggleSidebar}>
          <PanelLeftOpen />
        </Button>
      )}
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>

      {showSearch && (
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="hidden h-8 w-56 items-center gap-2 rounded-lg border bg-muted/40 px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex"
        >
          <Search className="size-4" />
          Search pages…
          <kbd className="ml-auto rounded border bg-background px-1.5 text-[10px]">Ctrl K</kbd>
        </button>
      )}
      <div className="flex shrink-0 items-center gap-1">
        {actions}
        {showSearch && (
          <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search />
          </Button>
        )}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="ghost" size="icon-sm" aria-label="Toggle theme" onClick={() => setTheme(resolved === "dark" ? "light" : "dark")} />
            }
          >
            {resolved === "dark" ? <Sun /> : <Moon />}
          </TooltipTrigger>
          <TooltipContent side="bottom">{resolved === "dark" ? "Light mode" : "Dark mode"}</TooltipContent>
        </Tooltip>
        <UserMenu />
      </div>
    </header>
  )
}
