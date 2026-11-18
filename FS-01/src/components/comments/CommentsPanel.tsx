import { useMemo, useState } from "react"
import { MessageSquare, Send, X } from "lucide-react"
import { toast } from "sonner"
import { EmptyState } from "@/components/common/EmptyState"
import { UserAvatar } from "@/components/common/UserAvatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useDocumentStore } from "@/store/documentStore"
import { useCurrentUser } from "@/store/workspaceStore"
import { CommentItem } from "./CommentItem"

export function CommentsPanel({ docId, onClose }: { docId: string; onClose: () => void }) {
  const me = useCurrentUser()
  const all = useDocumentStore((s) => s.comments)
  const addComment = useDocumentStore((s) => s.addComment)
  const [tab, setTab] = useState<"open" | "resolved">("open")
  const [body, setBody] = useState("")

  const comments = useMemo(() => all.filter((c) => c.docId === docId), [all, docId])
  const open = comments.filter((c) => !c.resolved)
  const resolved = comments.filter((c) => c.resolved)
  const list = (tab === "open" ? open : resolved).sort((a, b) => a.createdAt.localeCompare(b.createdAt))

  const submit = () => {
    if (!body.trim()) return
    addComment(docId, body.trim())
    setBody("")
    setTab("open")
    toast.success("Comment added")
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold"><MessageSquare className="size-4" /> Comments</h2>
        <Button variant="ghost" size="icon-sm" aria-label="Close comments" onClick={onClose}><X /></Button>
      </div>
      <div className="px-4 pt-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="w-full">
            <TabsTrigger value="open">Open ({open.length})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({resolved.length})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {list.length ? (
          list.map((c) => <CommentItem key={c.id} comment={c} />)
        ) : (
          <EmptyState
            icon={MessageSquare}
            title={tab === "open" ? "No open comments" : "No resolved comments"}
            description={tab === "open" ? "Start a discussion. Your teammates will be notified." : "Resolved threads will appear here."}
          />
        )}
      </div>
      <div className="shrink-0 border-t p-3">
        <div className="flex gap-2">
          <UserAvatar user={me} size="sm" className="mt-1" />
          <div className="flex-1 rounded-lg border bg-background focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); submit() }
              }}
              rows={2}
              placeholder="Add a comment…"
              className="min-h-0 resize-none border-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
            />
            <div className="flex items-center justify-between px-2 pb-2">
              <span className="text-[11px] text-muted-foreground">Ctrl + Enter to send</span>
              <Button size="sm" disabled={!body.trim()} onClick={submit}><Send /> Comment</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
