import { useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import { ChevronRight, MoreHorizontal, Plus } from "lucide-react"
import { useCreatePage } from "@/hooks/useCreatePage"
import { docPath, docTitle } from "@/lib/docs"
import { cn } from "@/lib/utils"
import type { Doc } from "@/types"
import { PageActionsMenu } from "./PageActionsMenu"

interface Props {
  docs: Doc[]
  parentId?: string | null
  depth?: number
  onNavigate?: () => void
}

export function PageTree({ docs, parentId = null, depth = 0, onNavigate }: Props) {
  const children = docs.filter((d) => d.parentId === parentId).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  if (!children.length) return null
  return (
    <ul className="space-y-px">
      {children.map((doc) => (
        <PageTreeItem key={doc.id} doc={doc} docs={docs} depth={depth} onNavigate={onNavigate} />
      ))}
    </ul>
  )
}

function PageTreeItem({ doc, docs, depth, onNavigate }: { doc: Doc; docs: Doc[]; depth: number; onNavigate?: () => void }) {
  const { docId } = useParams()
  const createPage = useCreatePage()
  const hasChildren = docs.some((d) => d.parentId === doc.id)
  const [open, setOpen] = useState(depth === 0 && hasChildren)

  return (
    <li>
      <div
        className={cn(
          "group/item relative flex h-7 items-center gap-1 rounded-md pr-1 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
          docId === doc.id && "bg-sidebar-accent font-medium text-sidebar-foreground",
        )}
        style={{ paddingLeft: 4 + depth * 14 }}
      >
        <button
          type="button"
          aria-label={open ? "Collapse" : "Expand"}
          onClick={() => setOpen((o) => !o)}
          className={cn("flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-foreground/10", !hasChildren && "invisible")}
        >
          <ChevronRight className={cn("size-3.5 transition-transform duration-150", open && "rotate-90")} />
        </button>
        <NavLink to={docPath(doc)} onClick={onNavigate} className="flex min-w-0 flex-1 items-center gap-1.5 py-1">
          <span className="text-[13px] leading-none">{doc.icon}</span>
          <span className="truncate">{docTitle(doc)}</span>
        </NavLink>
        <div className="flex items-center opacity-0 transition-opacity group-hover/item:opacity-100 focus-within:opacity-100 max-lg:opacity-100">
          <PageActionsMenu
            doc={doc}
            trigger={
              <button type="button" aria-label="Page actions" className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-foreground/10">
                <MoreHorizontal className="size-3.5" />
              </button>
            }
          />
          <button
            type="button"
            aria-label="Add subpage"
            onClick={() => {
              setOpen(true)
              createPage(doc.id, doc.workspaceId)
              onNavigate?.()
            }}
            className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-foreground/10"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>
      {open && hasChildren && <PageTree docs={docs} parentId={doc.id} depth={depth + 1} onNavigate={onNavigate} />}
    </li>
  )
}
