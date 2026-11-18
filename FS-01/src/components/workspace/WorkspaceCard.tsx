import { useNavigate } from "react-router-dom"
import { FileText, Users } from "lucide-react"
import { AvatarStack } from "@/components/common/UserAvatar"
import { cn } from "@/lib/utils"
import { useDocumentStore } from "@/store/documentStore"
import { useWorkspaceStore } from "@/store/workspaceStore"
import type { Workspace } from "@/types"

export function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  const navigate = useNavigate()
  const { users, members, currentWorkspaceId, setCurrentWorkspace } = useWorkspaceStore()
  const docCount = useDocumentStore((s) => s.docs.filter((d) => d.workspaceId === workspace.id).length)
  const wsMembers = members.filter((m) => m.workspaceId === workspace.id)
  const memberUsers = users.filter((u) => wsMembers.some((m) => m.userId === u.id))

  return (
    <button
      type="button"
      onClick={() => {
        setCurrentWorkspace(workspace.id)
        navigate(`/workspace/${workspace.id}`)
      }}
      className={cn(
        "flex flex-col rounded-xl border bg-card p-4 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md",
        currentWorkspaceId === workspace.id && "ring-2 ring-primary/30",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-xl">{workspace.icon}</span>
        <div className="min-w-0">
          <p className="truncate font-medium">{workspace.name}</p>
          <p className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><FileText className="size-3" /> {docCount} pages</span>
            <span className="inline-flex items-center gap-1"><Users className="size-3" /> {wsMembers.length}</span>
          </p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 min-h-10 text-sm text-muted-foreground">{workspace.description || "No description"}</p>
      <div className="mt-3"><AvatarStack users={memberUsers} /></div>
    </button>
  )
}
