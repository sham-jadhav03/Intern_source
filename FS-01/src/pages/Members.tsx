import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Mail, MoreHorizontal, Search, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { EmptyState } from "@/components/common/EmptyState"
import { UserAvatar } from "@/components/common/UserAvatar"
import { Topbar } from "@/components/layout/Topbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CURRENT_USER_ID } from "@/data/mock"
import { useIsOnline } from "@/hooks/usePresence"
import { isEmail } from "@/lib/utils"
import { useCurrentWorkspace, useWorkspaceStore } from "@/store/workspaceStore"
import type { Member, Role, User } from "@/types"

const ROLES: { value: Role; description: string }[] = [
  { value: "Owner", description: "Full control, including billing and deletion" },
  { value: "Admin", description: "Manage members and workspace settings" },
  { value: "Editor", description: "Create, edit and comment on pages" },
  { value: "Viewer", description: "Read and comment only" },
]
const roleItems = ROLES.map((r) => ({ value: r.value, label: r.value }))

function RoleSelect({ value, onChange, disabled }: { value: Role; onChange: (r: Role) => void; disabled?: boolean }) {
  return (
    <Select items={roleItems} value={value} onValueChange={(v) => v && onChange(v as Role)} disabled={disabled}>
      <SelectTrigger size="sm" className="w-28"><SelectValue /></SelectTrigger>
      <SelectContent alignItemWithTrigger={false} className="w-64">
        {ROLES.map((r) => (
          <SelectItem key={r.value} value={r.value}>
            <span className="flex flex-col">
              <span>{r.value}</span>
              <span className="text-xs whitespace-normal text-muted-foreground">{r.description}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function StatusBadge({ member, user }: { member: Member; user: User }) {
  const online = useIsOnline(user.id)
  if (member.status === "invited") return <Badge variant="outline" className="gap-1"><Mail className="size-3" /> Invited</Badge>
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={online ? "size-2 rounded-full bg-emerald-500" : "size-2 rounded-full bg-zinc-300 dark:bg-zinc-600"} />
      {online ? "Online" : "Offline"}
    </span>
  )
}

export default function Members() {
  const [params, setParams] = useSearchParams()
  const workspace = useCurrentWorkspace()
  const { users, members, setRole, removeMember } = useWorkspaceStore()
  const [query, setQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all")
  const [removing, setRemoving] = useState<User | null>(null)
  const inviteOpen = params.get("invite") === "1"
  const setInviteOpen = (o: boolean) => setParams(o ? { invite: "1" } : {}, { replace: true })

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return members
      .filter((m) => m.workspaceId === workspace?.id && (roleFilter === "all" || m.role === roleFilter))
      .map((m) => ({ member: m, user: users.find((u) => u.id === m.userId)! }))
      .filter(({ user }) => user && (!q || user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)))
  }, [members, users, workspace?.id, query, roleFilter])
  const total = members.filter((m) => m.workspaceId === workspace?.id).length

  return (
    <>
      <Topbar><span className="text-sm font-medium">Members</span></Topbar>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Members</h1>
              <p className="mt-1 text-sm text-muted-foreground">{total} people in {workspace?.icon} {workspace?.name}. Manage who can view and edit.</p>
            </div>
            <Button onClick={() => setInviteOpen(true)}><UserPlus /> Invite members</Button>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email…" className="pl-8" />
            </div>
            <Select
              items={[{ value: "all", label: "All roles" }, ...roleItems]}
              value={roleFilter}
              onValueChange={(v) => v && setRoleFilter(v as Role | "all")}
            >
              <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {ROLES.map((r) => <SelectItem key={r.value} value={r.value}>{r.value}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border bg-card">
            <div className="hidden grid-cols-[1fr_140px_110px_48px] gap-4 border-b bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground md:grid">
              <span>Member</span><span>Role</span><span>Status</span><span />
            </div>
            {rows.length === 0 ? (
              <div className="p-6"><EmptyState icon={Users} title="No members found" description="Try a different search or role filter." /></div>
            ) : (
              <ul className="divide-y">
                {rows.map(({ member, user }) => {
                  const isMe = user.id === CURRENT_USER_ID
                  return (
                    <li key={user.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-3 md:grid-cols-[1fr_140px_110px_48px]">
                      <div className="flex min-w-0 items-center gap-3">
                        <UserAvatar user={user} showStatus={member.status === "active"} />
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 truncate text-sm font-medium">
                            {user.name} {isMe && <Badge variant="secondary">You</Badge>}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="col-start-1 row-start-2 flex items-center gap-3 md:col-start-auto md:row-start-auto">
                        {member.role === "Owner" ? (
                          <Badge variant="secondary" className="gap-1"><ShieldCheck className="size-3" /> Owner</Badge>
                        ) : (
                          <RoleSelect
                            value={member.role}
                            disabled={isMe}
                            onChange={(r) => { setRole(user.id, r); toast.success(`${user.name} is now ${r === "Admin" ? "an" : "a"} ${r}`) }}
                          />
                        )}
                        <span className="md:hidden"><StatusBadge member={member} user={user} /></span>
                      </div>
                      <span className="hidden md:block"><StatusBadge member={member} user={user} /></span>
                      <div className="row-span-2 flex justify-end md:row-span-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${user.name}`} disabled={isMe || member.role === "Owner"} />}>
                            <MoreHorizontal />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            {member.status === "invited" && (
                              <DropdownMenuItem onClick={() => toast.success(`Invitation resent to ${user.email}`)}><Mail /> Resend invite</DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => { navigator.clipboard?.writeText(user.email); toast("Email copied") }}><Mail /> Copy email</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => setRemoving(user)}><Trash2 /> Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} />
      <ConfirmDialog
        open={!!removing}
        onOpenChange={(o) => !o && setRemoving(null)}
        title={`Remove ${removing?.name}?`}
        description={`They will lose access to ${workspace?.name}. You can invite them again later.`}
        confirmLabel="Remove member"
        onConfirm={() => {
          if (!removing) return
          removeMember(removing.id)
          toast.success(`${removing.name} was removed`)
        }}
      />
    </>
  )
}

function InviteDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const inviteMember = useWorkspaceStore((s) => s.inviteMember)
  const workspace = useCurrentWorkspace()
  const [emails, setEmails] = useState("")
  const [role, setRoleValue] = useState<Role>("Editor")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const list = emails.split(/[\s,;]+/).filter(Boolean)
    if (!list.length) return setError("Enter at least one email address.")
    const bad = list.filter((x) => !isEmail(x))
    if (bad.length) return setError(`Invalid email: ${bad.join(", ")}`)
    list.forEach((x) => inviteMember(x, role))
    toast.success(`Invited ${list.length} ${list.length === 1 ? "person" : "people"} as ${role}`)
    setEmails(""); setMessage(""); setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Invite to {workspace?.name}</DialogTitle>
            <DialogDescription>Separate multiple emails with commas.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-1.5">
            <Label htmlFor="invite-emails">Email addresses</Label>
            <Input id="invite-emails" autoFocus value={emails} aria-invalid={!!error} onChange={(e) => { setEmails(e.target.value); setError("") }} placeholder="jamie@acme.io, taylor@acme.io" />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <div className="grid gap-2">
            <Label>Role</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {ROLES.filter((r) => r.value !== "Owner").map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRoleValue(r.value)}
                  aria-pressed={role === r.value}
                  className={`rounded-lg border p-2.5 text-left transition-colors hover:bg-muted/60 ${role === r.value ? "border-primary bg-primary/5 ring-1 ring-primary/30" : ""}`}
                >
                  <span className="block text-sm font-medium">{r.value}</span>
                  <span className="block text-xs text-muted-foreground">{r.description}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="invite-msg">Message <span className="font-normal text-muted-foreground">(optional)</span></Label>
            <Textarea id="invite-msg" rows={2} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Join us to plan the Q1 roadmap!" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit"><Mail /> Send invites</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
