import { Link } from "react-router-dom"
import { MoreHorizontal, Star } from "lucide-react"
import { UserAvatar } from "@/components/common/UserAvatar"
import { docPath, docTitle } from "@/lib/docs"
import { stripHtml, timeAgo } from "@/lib/utils"
import { useDocumentStore } from "@/store/documentStore"
import { useUser, useWorkspaceStore } from "@/store/workspaceStore"
import type { Doc } from "@/types"
import { PageActionsMenu } from "./PageActionsMenu"

export function DocumentCard({ doc, timeKey = "updatedAt" }: { doc: Doc; timeKey?: "updatedAt" | "lastViewedAt" }) {
  const editor = useUser(doc.updatedBy)
  const workspace = useWorkspaceStore((s) => s.workspaces.find((w) => w.id === doc.workspaceId))
  const toggleFavorite = useDocumentStore((s) => s.toggleFavorite)
  const snippet = stripHtml(doc.content)

  return (
    <div className="group relative flex flex-col rounded-xl border bg-card p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-lg">{doc.icon}</span>
        <div className="relative z-10 flex items-center gap-0.5">
          <button
            type="button"
            aria-label={doc.favorite ? "Remove from favorites" : "Add to favorites"}
            onClick={() => toggleFavorite(doc.id)}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          >
            <Star className={doc.favorite ? "size-4 fill-amber-400 text-amber-400" : "size-4"} />
          </button>
          <PageActionsMenu
            doc={doc}
            trigger={
              <button type="button" aria-label="Page actions" className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted">
                <MoreHorizontal className="size-4" />
              </button>
            }
          />
        </div>
      </div>
      <Link to={docPath(doc)} className="mt-3 font-medium leading-snug after:absolute after:inset-0">
        <span className="line-clamp-1">{docTitle(doc)}</span>
      </Link>
      <p className="mt-1 line-clamp-2 min-h-10 text-sm text-muted-foreground">{snippet || "Empty page"}</p>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        {editor && <UserAvatar user={editor} size="xs" />}
        <span className="truncate">
          {timeKey === "lastViewedAt" && doc.lastViewedAt ? `Viewed ${timeAgo(doc.lastViewedAt)}` : `Edited ${timeAgo(doc.updatedAt)}`}
        </span>
        {workspace && <span className="ml-auto shrink-0 truncate">{workspace.icon} {workspace.name}</span>}
      </div>
    </div>
  )
}
