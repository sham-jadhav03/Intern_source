import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CornerDownLeft, FileSearch, Search } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { byRecent, docPath, docTitle } from "@/lib/docs"
import { cn, stripHtml, timeAgo } from "@/lib/utils"
import { useAppStore } from "@/store/appStore"
import { useDocumentStore } from "@/store/documentStore"
import { useWorkspaceStore } from "@/store/workspaceStore"

export function SearchDialog() {
  const navigate = useNavigate()
  const { searchOpen, setSearchOpen } = useAppStore()
  const docs = useDocumentStore((s) => s.docs)
  const workspaces = useWorkspaceStore((s) => s.workspaces)
  const setCurrent = useWorkspaceStore((s) => s.setCurrentWorkspace)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen(!useAppStore.getState().searchOpen)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [setSearchOpen])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return [...docs].sort(byRecent("updatedAt")).slice(0, 6).map((doc) => ({ doc, snippet: "" }))
    return docs.flatMap((doc) => {
      const text = stripHtml(doc.content)
      const idx = text.toLowerCase().indexOf(q)
      if (!docTitle(doc).toLowerCase().includes(q) && idx < 0) return []
      const snippet = idx >= 0 ? (idx > 30 ? "…" : "") + text.slice(Math.max(0, idx - 30), idx + 70) : ""
      return [{ doc, snippet }]
    }).slice(0, 20)
  }, [docs, query])

  const open = (i: number) => {
    const r = results[i]
    if (!r) return
    setCurrent(r.doc.workspaceId)
    navigate(docPath(r.doc))
    setSearchOpen(false)
    setQuery("")
  }

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent showCloseButton={false} className="top-[15%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogTitle className="sr-only">Search pages</DialogTitle>
        <div className="flex items-center gap-2 border-b px-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0) }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
              if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
              if (e.key === "Enter") open(active)
            }}
            placeholder="Search pages and content…"
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border px-1.5 text-[10px] text-muted-foreground">Esc</kbd>
        </div>
        <div className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{query ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Recently edited"}</p>
          {results.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center text-sm text-muted-foreground">
              <FileSearch className="mb-2 size-6" />
              No pages match "{query}"
            </div>
          ) : (
            results.map(({ doc, snippet }, i) => {
              const ws = workspaces.find((w) => w.id === doc.workspaceId)
              return (
                <button
                  key={doc.id}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => open(i)}
                  className={cn("flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left", i === active && "bg-accent")}
                >
                  <span className="text-base">{doc.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{docTitle(doc)}</span>
                    <span className="block truncate text-xs text-muted-foreground">{snippet || `${ws?.name ?? ""} · edited ${timeAgo(doc.updatedAt)}`}</span>
                  </span>
                  {i === active && <CornerDownLeft className="size-3.5 text-muted-foreground" />}
                </button>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
