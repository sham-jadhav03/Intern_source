import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  Check, ChevronRight, Cloud, Copy, Download, FileX, History, Link2, Loader2, Maximize2, MessageSquare, Minimize2,
  MoreHorizontal, Save, Share2, Star, Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { CommentsPanel } from "@/components/comments/CommentsPanel"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { EmptyState } from "@/components/common/EmptyState"
import { CollaboratorAvatars } from "@/components/editor/CollaboratorAvatars"
import { Editor, useDocEditor } from "@/components/editor/Editor"
import { EditorToolbar } from "@/components/editor/EditorToolbar"
import { ShareDialog } from "@/components/editor/ShareDialog"
import { VersionHistory } from "@/components/editor/VersionHistory"
import { Topbar } from "@/components/layout/Topbar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { CURRENT_USER_ID } from "@/data/mock"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useOnlineMap } from "@/hooks/usePresence"
import { ancestors, docPath, docTitle } from "@/lib/docs"
import { cn, timeAgo } from "@/lib/utils"
import { useAppStore } from "@/store/appStore"
import { useDocumentStore } from "@/store/documentStore"
import { useWorkspaceStore } from "@/store/workspaceStore"
import type { Doc, Version } from "@/types"

export default function DocumentEditor() {
  const { docId } = useParams()
  const navigate = useNavigate()
  const doc = useDocumentStore((s) => s.docs.find((d) => d.id === docId))

  if (!doc) {
    return (
      <>
        <Topbar />
        <div className="p-8">
          <EmptyState icon={FileX} title="Page not found" description="This page may have been deleted or moved." action={<Button onClick={() => navigate("/dashboard")}>Back to home</Button>} />
        </div>
      </>
    )
  }
  // key: a fresh editor instance per document
  return <DocumentView key={doc.id} doc={doc} />
}

type SaveState = "saved" | "saving"

function DocumentView({ doc }: { doc: Doc }) {
  const navigate = useNavigate()
  const { docs, comments, updateDoc, toggleFavorite, markViewed, duplicateDoc, deleteDoc, saveVersion, restoreVersion } = useDocumentStore()
  const { users, members, workspaces, setCurrentWorkspace } = useWorkspaceStore()
  const { fullWidth, setFullWidth } = useAppStore()
  const online = useOnlineMap()
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  const [saveState, setSaveState] = useState<SaveState>("saved")
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const pending = useRef<string | null>(null)

  const flush = () => {
    clearTimeout(saveTimer.current)
    if (pending.current !== null) {
      updateDoc(doc.id, { content: pending.current })
      pending.current = null
    }
    setSaveState("saved")
  }

  const editor = useDocEditor(doc.content, (html) => {
    pending.current = html
    setSaveState("saving")
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(flush, 600)
  })

  useEffect(() => {
    markViewed(doc.id)
    setCurrentWorkspace(doc.workspaceId)
    // Persist any unsaved keystrokes when leaving the page.
    return () => {
      clearTimeout(saveTimer.current)
      if (pending.current !== null) useDocumentStore.getState().updateDoc(doc.id, { content: pending.current })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc.id])

  const workspace = workspaces.find((w) => w.id === doc.workspaceId)
  const trail = useMemo(() => ancestors(docs, doc), [docs, doc])
  const wsMembers = useMemo(
    () => users.filter((u) => members.some((m) => m.workspaceId === doc.workspaceId && m.userId === u.id && m.status === "active")),
    [users, members, doc.workspaceId],
  )
  const me = wsMembers.find((u) => u.id === CURRENT_USER_ID)
  const others = useMemo(() => wsMembers.filter((u) => u.id !== CURRENT_USER_ID && online[u.id]).slice(0, 3), [wsMembers, online])
  const active = me ? [me, ...others] : others
  const openComments = comments.filter((c) => c.docId === doc.id && !c.resolved).length
  const lastEditor = users.find((u) => u.id === doc.updatedBy)

  const restore = (v: Version) => {
    flush()
    restoreVersion(v.id)
    editor.commands.setContent(v.content, { emitUpdate: false })
    toast.success(`Restored "${v.label}"`, { description: "Your previous content was saved as a version." })
    setHistoryOpen(false)
  }

  const exportHtml = () => {
    flush()
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${docTitle(doc)}</title></head><body><h1>${docTitle(doc)}</h1>${editor.getHTML()}</body></html>`
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([html], { type: "text/html" })),
      download: `${docTitle(doc).replace(/[^\w-]+/g, "-").toLowerCase()}.html`,
    })
    a.click()
    URL.revokeObjectURL(a.href)
    toast.success("Exported as HTML")
  }

  const words = editor.getText().trim().split(/\s+/).filter(Boolean).length

  const comments_ = <CommentsPanel docId={doc.id} onClose={() => setCommentsOpen(false)} />

  return (
    <>
      <Topbar
        showSearch={false}
        actions={
          <>
            <span className="mr-1 hidden sm:block"><CollaboratorAvatars members={wsMembers} active={active} /></span>
            <Button variant="outline" size="sm" className="max-sm:hidden" onClick={() => setShareOpen(true)}><Share2 /> Share</Button>
            <Button variant="ghost" size="icon-sm" className="sm:hidden" aria-label="Share" onClick={() => setShareOpen(true)}><Share2 /></Button>
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Comments" aria-pressed={commentsOpen} className={cn("relative", commentsOpen && "bg-muted")} onClick={() => setCommentsOpen((o) => !o)} />}>
                <MessageSquare />
                {openComments > 0 && <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">{openComments}</span>}
              </TooltipTrigger>
              <TooltipContent side="bottom">Comments</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Version history" onClick={() => setHistoryOpen(true)} />}>
                <History />
              </TooltipTrigger>
              <TooltipContent side="bottom">Version history</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Page options" />}><MoreHorizontal /></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => { toggleFavorite(doc.id); toast(doc.favorite ? "Removed from favorites" : "Added to favorites") }}>
                  <Star className={doc.favorite ? "fill-amber-400 text-amber-400" : ""} /> {doc.favorite ? "Remove from favorites" : "Add to favorites"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { navigator.clipboard?.writeText(window.location.href).catch(() => {}); toast.success("Link copied") }}><Link2 /> Copy link</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { flush(); const c = duplicateDoc(doc.id); if (c) { navigate(docPath(c)); toast.success("Page duplicated") } }}><Copy /> Duplicate</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFullWidth(!fullWidth)}>{fullWidth ? <Minimize2 /> : <Maximize2 />} {fullWidth ? "Standard width" : "Full width"}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { flush(); saveVersion(doc.id, `Snapshot ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`); toast.success("Version saved") }}><Save /> Save version</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setHistoryOpen(true)}><History /> Version history</DropdownMenuItem>
                <DropdownMenuItem onClick={exportHtml}><Download /> Export as HTML</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => setConfirmDelete(true)}><Trash2 /> Delete page</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      >
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-sm">
          {workspace && (
            <Link to={`/workspace/${workspace.id}`} className="hidden shrink-0 rounded px-1 text-muted-foreground hover:bg-muted hover:text-foreground sm:block">
              {workspace.icon} {workspace.name}
            </Link>
          )}
          {trail.map((p) => (
            <Fragment key={p.id}>
              <ChevronRight className="hidden size-3.5 shrink-0 text-muted-foreground sm:block" />
              <Link to={docPath(p)} className="hidden max-w-32 truncate rounded px-1 text-muted-foreground hover:bg-muted hover:text-foreground md:block">{docTitle(p)}</Link>
            </Fragment>
          ))}
          <ChevronRight className="hidden size-3.5 shrink-0 text-muted-foreground sm:block" />
          <span className="truncate px-1 font-medium">{doc.icon} {docTitle(doc)}</span>
          <span className="ml-1 hidden shrink-0 items-center gap-1 text-xs text-muted-foreground lg:flex">
            {saveState === "saving" ? <><Loader2 className="size-3 animate-spin" /> Saving…</> : <><Cloud className="size-3" /> Saved</>}
          </span>
        </nav>
      </Topbar>

      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1 overflow-y-auto">
          <div className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur-md">
            <div className={cn("mx-auto px-2 sm:px-6", fullWidth ? "max-w-none" : "max-w-4xl")}>
              <EditorToolbar editor={editor} />
            </div>
          </div>

          <article className={cn("mx-auto px-5 pt-10 sm:px-12", fullWidth ? "max-w-none" : "max-w-3xl")}>
            <TitleField doc={doc} onEnter={() => editor.commands.focus("start")} onChange={(title) => updateDoc(doc.id, { title })} />
            <div className="mt-3 mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {lastEditor && <span>Last edited by {lastEditor.id === CURRENT_USER_ID ? "you" : lastEditor.name} · {timeAgo(doc.updatedAt)}</span>}
              <span>{words} words</span>
              <span className="flex items-center gap-1 lg:hidden">{saveState === "saving" ? "Saving…" : <><Check className="size-3" /> Saved</>}</span>
            </div>
            <Editor editor={editor} collaborators={others} />
          </article>
        </div>

        <AnimatePresence initial={false}>
          {isDesktop && commentsOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              className="shrink-0 overflow-hidden border-l bg-sidebar"
            >
              <div className="h-full w-[340px]">{comments_}</div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {!isDesktop && (
        <Sheet open={commentsOpen} onOpenChange={setCommentsOpen}>
          <SheetContent side="right" showCloseButton={false} className="w-full gap-0 p-0 sm:max-w-sm">
            <SheetTitle className="sr-only">Comments</SheetTitle>
            {comments_}
          </SheetContent>
        </Sheet>
      )}

      <VersionHistory doc={doc} open={historyOpen} onOpenChange={setHistoryOpen} onRestore={restore} onSave={() => { flush(); saveVersion(doc.id, "Manual snapshot"); toast.success("Version saved") }} />
      <ShareDialog doc={doc} open={shareOpen} onOpenChange={setShareOpen} />
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Delete "${docTitle(doc)}"?`}
        description="This page and any subpages will be permanently deleted."
        onConfirm={() => {
          pending.current = null
          clearTimeout(saveTimer.current)
          deleteDoc(doc.id)
          toast.success("Page deleted")
          navigate(`/workspace/${doc.workspaceId}`)
        }}
      />
    </>
  )
}

function TitleField({ doc, onChange, onEnter }: { doc: Doc; onChange: (t: string) => void; onEnter: () => void }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [doc.title])
  useEffect(() => {
    if (!doc.title) ref.current?.focus()
    // only on mount: new untitled pages start with the title focused
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex items-start gap-3">
      <span className="pt-1 text-4xl leading-none select-none">{doc.icon}</span>
      <textarea
        ref={ref}
        rows={1}
        value={doc.title}
        aria-label="Page title"
        placeholder="Untitled"
        onChange={(e) => onChange(e.target.value.replace(/\n/g, ""))}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onEnter() } }}
        className="w-full resize-none overflow-hidden bg-transparent text-3xl font-bold tracking-tight outline-none placeholder:text-muted-foreground/50 sm:text-4xl"
      />
    </div>
  )
}
