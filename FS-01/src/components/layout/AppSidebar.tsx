import { useMemo } from "react"
import { NavLink } from "react-router-dom"
import { FileText, Home, LayoutGrid, PanelLeftClose, Plus, Search, Settings, Star, UserPlus, Users } from "lucide-react"
import { Logo } from "@/components/common/Logo"
import { PageTree } from "@/components/workspace/PageTree"
import { useCreatePage } from "@/hooks/useCreatePage"
import { docPath, docTitle } from "@/lib/docs"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/appStore"
import { useDocumentStore } from "@/store/documentStore"
import { useCurrentWorkspace } from "@/store/workspaceStore"
import { WorkspaceSwitcher } from "./WorkspaceSwitcher"

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex h-8 items-center gap-2.5 rounded-md px-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
    isActive && "bg-sidebar-accent font-medium text-sidebar-foreground",
  )

export function AppSidebar({ onNavigate, mobile }: { onNavigate?: () => void; mobile?: boolean }) {
  const workspace = useCurrentWorkspace()
  const allDocs = useDocumentStore((s) => s.docs)
  const docs = useMemo(() => allDocs.filter((d) => d.workspaceId === workspace?.id), [allDocs, workspace?.id])
  const favorites = docs.filter((d) => d.favorite)
  const createPage = useCreatePage()
  const setSearchOpen = useAppStore((s) => s.setSearchOpen)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-12 items-center justify-between px-4">
        <Logo />
        {!mobile && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Collapse sidebar"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent"
          >
            <PanelLeftClose className="size-4" />
          </button>
        )}
      </div>

      <div className="px-2">
        <WorkspaceSwitcher onNavigate={onNavigate} />
      </div>

      <div className="mt-2 space-y-0.5 px-2">
        <button type="button" onClick={() => { setSearchOpen(true); onNavigate?.() }} className={navClass({ isActive: false }) + " w-full"}>
          <Search className="size-4" /> Search
          <kbd className="ml-auto rounded border bg-background px-1.5 font-sans text-[10px] text-muted-foreground">Ctrl K</kbd>
        </button>
        <NavLink to="/dashboard" onClick={onNavigate} className={navClass}><Home className="size-4" /> Home</NavLink>
        {workspace && (
          <NavLink to={`/workspace/${workspace.id}`} end onClick={onNavigate} className={navClass}><LayoutGrid className="size-4" /> All pages</NavLink>
        )}
        <NavLink to="/members" onClick={onNavigate} className={navClass}><Users className="size-4" /> Members</NavLink>
        <NavLink to="/settings" onClick={onNavigate} className={navClass}><Settings className="size-4" /> Settings</NavLink>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        {favorites.length > 0 && (
          <section className="mb-4">
            <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">Favorites</p>
            <ul className="space-y-px">
              {favorites.map((d) => (
                <li key={d.id}>
                  <NavLink to={docPath(d)} onClick={onNavigate} className={({ isActive }) => cn(navClass({ isActive }), "h-7")}>
                    <span className="text-[13px]">{d.icon}</span>
                    <span className="truncate">{docTitle(d)}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <div className="group flex items-center justify-between px-2 pb-1">
            <p className="text-xs font-medium text-muted-foreground">Pages</p>
            <button
              type="button"
              aria-label="New page"
              onClick={() => { createPage(); onNavigate?.() }}
              className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
          {docs.length ? (
            <PageTree docs={docs} onNavigate={onNavigate} />
          ) : (
            <button type="button" onClick={() => createPage()} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent">
              <FileText className="size-4" /> Create your first page
            </button>
          )}
        </section>
        {favorites.length === 0 && docs.length > 0 && (
          <p className="mt-4 flex items-center gap-1.5 px-2 text-xs text-muted-foreground">
            <Star className="size-3" /> Star pages to pin them here
          </p>
        )}
      </div>

      <div className="border-t p-2">
        <NavLink to="/members?invite=1" onClick={onNavigate} className={navClass({ isActive: false })}>
          <UserPlus className="size-4" /> Invite members
        </NavLink>
        <button type="button" onClick={() => { createPage(); onNavigate?.() }} className={navClass({ isActive: false }) + " w-full"}>
          <Plus className="size-4" /> New page
        </button>
      </div>
    </div>
  )
}
