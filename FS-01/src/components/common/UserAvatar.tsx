import { cn, initials } from "@/lib/utils"
import { useIsOnline } from "@/hooks/usePresence"
import type { User } from "@/types"

const SIZES = { xs: "size-5 text-[9px]", sm: "size-7 text-[11px]", md: "size-8 text-xs", lg: "size-10 text-sm", xl: "size-16 text-xl" }

interface Props {
  user: Pick<User, "id" | "name" | "color">
  size?: keyof typeof SIZES
  showStatus?: boolean
  className?: string
}

export function UserAvatar({ user, size = "md", showStatus, className }: Props) {
  const online = useIsOnline(user.id)
  return (
    <span className={cn("relative inline-flex shrink-0", className)} title={user.name}>
      <span
        className={cn("inline-flex items-center justify-center rounded-full font-semibold text-white select-none", SIZES[size])}
        style={{ backgroundColor: user.color }}
      >
        {initials(user.name)}
      </span>
      {showStatus && (
        <span
          aria-label={online ? "Online" : "Offline"}
          className={cn(
            "absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-background transition-colors",
            online ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600",
          )}
        />
      )}
    </span>
  )
}

export function AvatarStack({ users, max = 4, size = "sm" }: { users: User[]; max?: number; size?: Props["size"] }) {
  const shown = users.slice(0, max)
  const extra = users.length - shown.length
  return (
    <div className="flex items-center -space-x-1.5">
      {shown.map((u) => (
        <UserAvatar key={u.id} user={u} size={size} className="rounded-full ring-2 ring-background" />
      ))}
      {extra > 0 && (
        <span className="z-10 inline-flex size-7 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground ring-2 ring-background">
          +{extra}
        </span>
      )}
    </div>
  )
}
