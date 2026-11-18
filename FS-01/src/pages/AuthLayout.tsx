import type { ReactNode } from "react"
import { Logo } from "@/components/common/Logo"
import { AvatarStack } from "@/components/common/UserAvatar"
import { users } from "@/data/mock"

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-background lg:grid-cols-[1fr_minmax(0,560px)]">
      <div className="flex flex-col px-6 py-8 sm:px-10">
        <Logo />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
        <p className="text-center text-xs text-muted-foreground">Frontend prototype · all data stays in your browser</p>
      </div>

      <aside className="relative hidden overflow-hidden border-l bg-sidebar lg:flex lg:flex-col lg:justify-center lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_60%)]" />
        <div className="relative space-y-6">
          <div className="rounded-xl border bg-background p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium">🗺️ Product Roadmap Q1 2027</span>
              <AvatarStack users={users.slice(0, 4)} />
            </div>
            <div className="space-y-2.5">
              <div className="h-3 w-3/4 rounded bg-muted" />
              <div className="relative h-3 w-full rounded bg-muted">
                <span className="absolute -top-1 left-2/3 h-5 w-0.5 bg-pink-500" />
                <span className="absolute -top-6 left-2/3 rounded bg-pink-500 px-1.5 py-0.5 text-[10px] font-medium text-white">Priya</span>
              </div>
              <div className="h-3 w-5/6 rounded bg-muted" />
              <div className="relative h-3 w-2/3 rounded bg-muted">
                <span className="absolute -top-1 left-1/3 h-5 w-0.5 bg-emerald-500" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Write, plan and decide together.</h2>
            <p className="mt-2 text-sm text-muted-foreground">Docs, comments and version history for teams that move fast. See who's editing, live.</p>
          </div>
        </div>
      </aside>
    </div>
  )
}

export function FieldError({ children }: { children?: string }) {
  return children ? <p className="text-xs text-destructive">{children}</p> : null
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.6 10.6 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}
