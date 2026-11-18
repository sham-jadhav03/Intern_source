import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Check, ChevronsUpDown, Plus, Settings } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateWorkspaceDialog } from "@/components/workspace/CreateWorkspaceDialog"
import { useCurrentWorkspace, useWorkspaceStore } from "@/store/workspaceStore"

export function WorkspaceSwitcher({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate()
  const current = useCurrentWorkspace()
  const workspaces = useWorkspaceStore((s) => s.workspaces)
  const setCurrent = useWorkspaceStore((s) => s.setCurrentWorkspace)
  const [creating, setCreating] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-sidebar-accent aria-expanded:bg-sidebar-accent"
            />
          }
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md border bg-background text-base">{current?.icon ?? "✨"}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{current?.name ?? "No workspace"}</span>
            <span className="block text-xs text-muted-foreground">Free plan</span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            {workspaces.map((w) => (
              <DropdownMenuItem
                key={w.id}
                onClick={() => {
                  setCurrent(w.id)
                  navigate(`/workspace/${w.id}`)
                  onNavigate?.()
                }}
              >
                <span className="text-base leading-none">{w.icon}</span>
                <span className="flex-1 truncate">{w.name}</span>
                {w.id === current?.id && <Check className="text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setCreating(true)}><Plus /> Create workspace</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { navigate("/settings?tab=workspace"); onNavigate?.() }}><Settings /> Workspace settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateWorkspaceDialog open={creating} onOpenChange={setCreating} />
    </>
  )
}
