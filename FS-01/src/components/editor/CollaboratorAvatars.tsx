import { UserAvatar } from "@/components/common/UserAvatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CURRENT_USER_ID } from "@/data/mock"
import { useIsOnline } from "@/hooks/usePresence"
import type { User } from "@/types"

function Row({ user, editing }: { user: User; editing: boolean }) {
  const online = useIsOnline(user.id)
  return (
    <li className="flex items-center gap-2.5 py-1.5">
      <UserAvatar user={user} size="sm" showStatus />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{user.name}{user.id === CURRENT_USER_ID && " (you)"}</span>
        <span className="block text-xs text-muted-foreground">{online ? (editing ? "Editing this page" : "Online") : "Offline"}</span>
      </span>
      {online && editing && <span className="size-2 rounded-full" style={{ backgroundColor: user.color }} />}
    </li>
  )
}

/** Avatar stack of who's here; click to see everyone's presence. */
export function CollaboratorAvatars({ members, active }: { members: User[]; active: User[] }) {
  const shown = active.slice(0, 4)
  return (
    <Popover>
      <PopoverTrigger render={<button type="button" aria-label="Collaborators" className="flex items-center -space-x-1.5 rounded-full p-0.5 hover:bg-muted" />}>
        {shown.map((u) => (
          <span key={u.id} className="rounded-full ring-2 ring-background"><UserAvatar user={u} size="sm" showStatus /></span>
        ))}
        {active.length > shown.length && (
          <span className="z-10 inline-flex size-7 items-center justify-center rounded-full bg-muted text-[11px] font-medium ring-2 ring-background">+{active.length - shown.length}</span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <p className="text-xs font-medium text-muted-foreground">{active.length} here now · {members.length} with access</p>
        <ul className="max-h-72 overflow-y-auto">
          {members.map((u) => <Row key={u.id} user={u} editing={active.some((a) => a.id === u.id)} />)}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
