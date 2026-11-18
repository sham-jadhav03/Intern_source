import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FilePlus2, FileSearch, FolderX, MoreHorizontal, Search, Settings, Star, UserPlus } from "lucide-react"
import { EmptyState } from "@/components/common/EmptyState"
import { AvatarStack, UserAvatar } from "@/components/common/UserAvatar"
import { Topbar } from "@/components/layout/Topbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageActionsMenu } from "@/components/workspace/PageActionsMenu"
import { useCreatePage } from "@/hooks/useCreatePage"
import { ancestors, docPath, docTitle } from "@/lib/docs"
import { cn, stripHtml, timeAgo } from "@/lib/utils"
import { useDocumentStore } from "@/store/documentStore"
import { useWorkspaceStore } from "@/store/workspaceStore"
import type { Doc } from "@/types"

/** Depth-first ordering so nested pages render under their parent. */
function flattenTree(docs: Doc[], parentId: string | null = null, depth = 0): { doc: Doc; depth: number }[] {
  return docs
    .filter((d) => d.parentId === parentId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .flatMap((doc) => [{ doc, depth }, ...flattenTree(docs, doc.id, depth + 1)])
}

export default function Workspace() {
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const { workspaces, users, members, setCurrentWorkspace } = useWorkspaceStore()
  const workspace = workspaces.find((w) => w.id === workspaceId)
  const allDocs = useDocumentStore((s) => s.docs)
  const toggleFavorite = useDocumentStore((s) => s.toggleFavorite)
  const createPage = useCreatePage()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "favorites">("all")

  useEffect(() => {
    if (workspace) setCurrentWorkspace(workspace.id)
  }, [workspace, setCurrentWorkspace])

  const docs = useMemo(() => allDocs.filter((d) => d.workspaceId === workspaceId), [allDocs, workspaceId])
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q && filter === "all") return flattenTree(docs)
    return docs
      .filter((d) => (filter === "all" || d.favorite) && (!q || docTitle(d).toLowerCase().includes(q) || stripHtml(d.content).toLowerCase().includes(q)))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((doc) => ({ doc, depth: 0 }))
  }, [docs, query, filter])
  const flat = !!query.trim() || filter === "favorites"

  if (!workspace) {
    return (
      <>
        <Topbar />
        <div className="p-8">
          <EmptyState icon={FolderX} title="Workspace not found" description="It may have been deleted." action={<Button onClick={() => navigate("/dashboard")}>Back to home</Button>} />
        </div>
      </>
    )
  }

  const wsMembers = users.filter((u) => members.some((m) => m.workspaceId === workspace.id && m.userId === u.id))

  return (
    <>
      <Topbar>
        <span className="truncate text-sm font-medium">{workspace.icon} {workspace.name}</span>
      </Topbar>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border bg-muted text-3xl">{workspace.icon}</span>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-semibold tracking-tight">{workspace.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{workspace.description || "No description yet."}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <AvatarStack users={wsMembers} />
                  <span>{wsMembers.length} members · {docs.length} pages</span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="icon" aria-label="Workspace settings" onClick={() => navigate("/settings?tab=workspace")}><Settings /></Button>
              <Button variant="outline" onClick={() => navigate("/members?invite=1")}><UserPlus /> Invite</Button>
              <Button onClick={() => createPage(null, workspace.id)}><FilePlus2 /> New page</Button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative sm:w-72">
              <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search pages…" className="pl-8" />
            </div>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <TabsList>
                <TabsTrigger value="all" className="px-3">All pages</TabsTrigger>
                <TabsTrigger value="favorites" className="px-3"><Star /> Favorites</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border bg-card">
            <div className="hidden grid-cols-[1fr_180px_90px] gap-4 border-b bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground sm:grid">
              <span>Name</span><span>Last edited</span><span className="text-right">Actions</span>
            </div>
            {rows.length === 0 ? (
              <div className="p-6">
                {docs.length === 0 ? (
                  <EmptyState icon={FilePlus2} title="No pages yet" description="Create the first page in this workspace." action={<Button onClick={() => createPage(null, workspace.id)}><FilePlus2 /> New page</Button>} />
                ) : (
                  <EmptyState icon={FileSearch} title="No matching pages" description={filter === "favorites" && !query ? "Star pages to see them here." : `Nothing matches "${query}".`} />
                )}
              </div>
            ) : (
              <ul className="divide-y">
                {rows.map(({ doc, depth }) => {
                  const editor = users.find((u) => u.id === doc.updatedBy)
                  const path = flat ? ancestors(docs, doc).map(docTitle).join(" / ") : ""
                  return (
                    <li key={doc.id} className="group grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-2.5 transition-colors hover:bg-muted/40 sm:grid-cols-[1fr_180px_90px]">
                      <Link to={docPath(doc)} className="flex min-w-0 items-center gap-2.5" style={{ paddingLeft: depth * 22 }}>
                        {depth > 0 && <span className="-ml-3 h-px w-2.5 shrink-0 bg-border" />}
                        <span className="text-base">{doc.icon}</span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{docTitle(doc)}</span>
                          {path && <span className="block truncate text-xs text-muted-foreground">in {path}</span>}
                        </span>
                      </Link>
                      <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                        {editor && <UserAvatar user={editor} size="xs" />}
                        <span className="truncate">{timeAgo(doc.updatedAt)}</span>
                      </span>
                      <span className="flex items-center justify-end gap-0.5">
                        <button
                          type="button"
                          onClick={() => toggleFavorite(doc.id)}
                          aria-label={doc.favorite ? "Remove from favorites" : "Add to favorites"}
                          className={cn("flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted", !doc.favorite && "sm:opacity-0 sm:group-hover:opacity-100")}
                        >
                          <Star className={doc.favorite ? "size-4 fill-amber-400 text-amber-400" : "size-4"} />
                        </button>
                        <PageActionsMenu
                          doc={doc}
                          trigger={<button type="button" aria-label="Page actions" className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"><MoreHorizontal className="size-4" /></button>}
                        />
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          <button type="button" onClick={() => createPage(null, workspace.id)} className="mt-3 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
            <FilePlus2 className="size-4" /> Add a page
          </button>
        </div>
      </div>
    </>
  )
}
