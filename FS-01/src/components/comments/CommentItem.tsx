import { CheckCircle2, MoreHorizontal, RotateCcw, Trash2 } from "lucide-react"
import { UserAvatar } from "@/components/common/UserAvatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { CURRENT_USER_ID } from "@/data/mock"
import { cn, formatDateTime, timeAgo } from "@/lib/utils"
import { useDocumentStore } from "@/store/documentStore"
import { useUser } from "@/store/workspaceStore"
import type { Comment } from "@/types"

export function CommentItem({ comment }: { comment: Comment }) {
  const author = useUser(comment.authorId)
  const { toggleResolved, deleteComment } = useDocumentStore()
  if (!author) return null

  return (
    <article className={cn("group rounded-lg border bg-card p-3 transition-colors", comment.resolved && "bg-muted/40")}>
      <header className="flex items-center gap-2">
        <UserAvatar user={author} size="sm" showStatus />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{author.name}</p>
          <p className="text-xs text-muted-foreground" title={formatDateTime(comment.createdAt)}>{timeAgo(comment.createdAt)}</p>
        </div>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={comment.resolved ? "Reopen" : "Resolve"}
                className={comment.resolved ? "text-emerald-600" : "text-muted-foreground"}
                onClick={() => toggleResolved(comment.id)}
              />
            }
          >
            {comment.resolved ? <RotateCcw /> : <CheckCircle2 />}
          </TooltipTrigger>
          <TooltipContent>{comment.resolved ? "Reopen" : "Resolve"}</TooltipContent>
        </Tooltip>
        {comment.authorId === CURRENT_USER_ID && (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" aria-label="Comment options" className="text-muted-foreground" />}>
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem variant="destructive" onClick={() => deleteComment(comment.id)}><Trash2 /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>
      <p className={cn("mt-2 text-sm leading-relaxed whitespace-pre-wrap", comment.resolved && "text-muted-foreground")}>{comment.body}</p>
      {comment.resolved && (
        <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600"><CheckCircle2 className="size-3" /> Resolved</p>
      )}
    </article>
  )
}
