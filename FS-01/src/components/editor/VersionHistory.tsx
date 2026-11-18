import { useMemo, useState } from "react"
import { History, RotateCcw, Save } from "lucide-react"
import { UserAvatar } from "@/components/common/UserAvatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { docTitle } from "@/lib/docs"
import { cn, formatDateTime, timeAgo } from "@/lib/utils"
import { useDocumentStore } from "@/store/documentStore"
import { useWorkspaceStore } from "@/store/workspaceStore"
import type { Doc, Version } from "@/types"

interface Props {
  doc: Doc
  open: boolean
  onOpenChange: (o: boolean) => void
  onRestore: (v: Version) => void
  onSave: () => void
}

const CURRENT = "current"

export function VersionHistory({ doc, open, onOpenChange, onRestore, onSave }: Props) {
  const all = useDocumentStore((s) => s.versions)
  const users = useWorkspaceStore((s) => s.users)
  const versions = useMemo(() => all.filter((v) => v.docId === doc.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [all, doc.id])
  const [selectedId, setSelectedId] = useState(CURRENT)

  const current: Version = { id: CURRENT, docId: doc.id, authorId: doc.updatedBy, createdAt: doc.updatedAt, label: "Current version", title: doc.title, content: doc.content }
  const items = [current, ...versions]
  const selected = items.find((v) => v.id === selectedId) ?? current

  return (
    <Sheet open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setSelectedId(CURRENT) }}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-4xl data-[side=right]:sm:max-w-4xl">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2"><History className="size-4" /> Version history</SheetTitle>
          <SheetDescription>Preview earlier versions of this page and restore any of them.</SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <div className="flex max-h-[38vh] shrink-0 flex-col border-b md:max-h-none md:w-72 md:border-r md:border-b-0">
            <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
              {items.map((v) => {
                const author = users.find((u) => u.id === v.authorId)
                return (
                  <li key={v.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(v.id)}
                      className={cn("w-full rounded-lg border border-transparent p-2.5 text-left transition-colors hover:bg-muted", selected.id === v.id && "border-primary/30 bg-primary/5")}
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex-1 truncate text-sm font-medium">{v.label}</span>
                        {v.id === CURRENT && <Badge variant="secondary">Live</Badge>}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        {author && <UserAvatar user={author} size="xs" />}
                        <span className="truncate">{author?.name}</span>
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground" title={timeAgo(v.createdAt)}>{formatDateTime(v.createdAt)}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="border-t p-2">
              <Button variant="outline" className="w-full" onClick={onSave}><Save /> Save current version</Button>
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between gap-3 border-b px-4 py-2.5">
              <p className="min-w-0 truncate text-sm text-muted-foreground">
                Previewing <span className="font-medium text-foreground">{selected.label}</span>
              </p>
              <Button size="sm" disabled={selected.id === CURRENT} onClick={() => { onRestore(selected); setSelectedId(CURRENT) }}>
                <RotateCcw /> Restore
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-10">
              <h1 className="mb-6 text-3xl font-bold tracking-tight">{docTitle(selected)}</h1>
              {selected.content ? (
                <div className="doc-content" dangerouslySetInnerHTML={{ __html: selected.content }} />
              ) : (
                <p className="text-sm text-muted-foreground italic">This version is empty.</p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
