import { useState } from "react"
import { Check, Copy, Globe, Lock, Users } from "lucide-react"
import { toast } from "sonner"
import { UserAvatar } from "@/components/common/UserAvatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { docTitle } from "@/lib/docs"
import { isEmail } from "@/lib/utils"
import { useWorkspaceStore } from "@/store/workspaceStore"
import type { Doc, Role } from "@/types"

const ACCESS = [
  { value: "restricted", label: "Only invited people", icon: Lock },
  { value: "workspace", label: "Everyone in the workspace", icon: Users },
  { value: "public", label: "Anyone with the link", icon: Globe },
]

export function ShareDialog({ doc, open, onOpenChange }: { doc: Doc; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { users, members, inviteMember } = useWorkspaceStore()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("Editor")
  const [access, setAccess] = useState("workspace")
  const [copied, setCopied] = useState(false)
  const people = members.filter((m) => m.workspaceId === doc.workspaceId).map((m) => ({ m, u: users.find((u) => u.id === m.userId)! })).filter((x) => x.u)
  const accessItem = ACCESS.find((a) => a.value === access)!

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {
      /* clipboard can be blocked; still show feedback */
    }
    setCopied(true)
    toast.success("Link copied to clipboard")
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share "{docTitle(doc)}"</DialogTitle>
          <DialogDescription>Invite people or copy a link to this page.</DialogDescription>
        </DialogHeader>
        <form
          noValidate
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault()
            if (!isEmail(email)) return toast.error("Enter a valid email address")
            inviteMember(email.trim(), role)
            toast.success(`Invited ${email.trim()} as ${role}`)
            setEmail("")
          }}
        >
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Add people by email" className="flex-1" />
          <div className="flex gap-2">
            <Select items={["Editor", "Viewer"].map((r) => ({ value: r, label: r }))} value={role} onValueChange={(v) => v && setRole(v as Role)}>
              <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Editor">Editor</SelectItem><SelectItem value="Viewer">Viewer</SelectItem></SelectContent>
            </Select>
            <Button type="submit">Invite</Button>
          </div>
        </form>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">People with access</p>
          <ul className="max-h-48 space-y-2 overflow-y-auto">
            {people.map(({ m, u }) => (
              <li key={u.id} className="flex items-center gap-2.5">
                <UserAvatar user={u} size="sm" showStatus={m.status === "active"} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{u.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{u.email}</span>
                </span>
                <span className="text-xs text-muted-foreground">{m.status === "invited" ? "Invited" : m.role}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">General access</p>
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-muted"><accessItem.icon className="size-4" /></span>
            <Select items={ACCESS.map(({ value, label }) => ({ value, label }))} value={access} onValueChange={(v) => { if (v) { setAccess(v); toast(`Access: ${ACCESS.find((a) => a.value === v)?.label}`) } }}>
              <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
              <SelectContent>{ACCESS.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Input readOnly value={window.location.href} className="flex-1 text-muted-foreground" onFocus={(e) => e.target.select()} />
          <Button variant="outline" onClick={copy}>{copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy link"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
