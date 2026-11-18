import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useWorkspaceStore } from "@/store/workspaceStore"

export const WORKSPACE_ICONS = ["🚀", "📣", "⚙️", "🎨", "📚", "💡", "🧪", "🌱", "🏢", "🎯", "🛠️", "🌍"]

export function CreateWorkspaceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate()
  const createWorkspace = useWorkspaceStore((s) => s.createWorkspace)
  const [name, setName] = useState("")
  const [icon, setIcon] = useState(WORKSPACE_ICONS[0]!)
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) return setError("Workspace name must be at least 2 characters.")
    const ws = createWorkspace({ name: name.trim(), icon, description: description.trim() })
    toast.success(`Workspace "${ws.name}" created`)
    onOpenChange(false)
    setName(""); setDescription(""); setError("")
    navigate(`/workspace/${ws.id}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Create a workspace</DialogTitle>
            <DialogDescription>Workspaces keep pages, members and settings for a team together.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-1.5">
              {WORKSPACE_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  aria-pressed={icon === i}
                  className={cn("flex size-9 items-center justify-center rounded-lg border text-lg transition-colors hover:bg-muted", icon === i && "border-primary bg-primary/10")}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ws-name">Name</Label>
            <Input id="ws-name" autoFocus value={name} maxLength={40} aria-invalid={!!error} placeholder="e.g. Design Team" onChange={(e) => { setName(e.target.value); setError("") }} />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ws-desc">Description <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <Textarea id="ws-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this workspace for?" rows={3} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Create workspace</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
