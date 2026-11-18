import { useMemo, useState, type ReactNode } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Clock, FilePlus2, History, Palette, Plus, Search, Star, UserPlus } from "lucide-react"
import { EmptyState } from "@/components/common/EmptyState"
import { UserAvatar } from "@/components/common/UserAvatar"
import { Topbar } from "@/components/layout/Topbar"
import { Button } from "@/components/ui/button"
import { CreateWorkspaceDialog } from "@/components/workspace/CreateWorkspaceDialog"
import { DocumentCard } from "@/components/workspace/DocumentCard"
import { WorkspaceCard } from "@/components/workspace/WorkspaceCard"
import { useCreatePage } from "@/hooks/useCreatePage"
import { byRecent, docPath, docTitle } from "@/lib/docs"
import { timeAgo } from "@/lib/utils"
import { useAppStore } from "@/store/appStore"
import { useDocumentStore } from "@/store/documentStore"
import { useCurrentUser, useWorkspaceStore } from "@/store/workspaceStore"

const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"
}

function Section({ title, icon: Icon, children, action }: { title: string; icon: typeof Star; children: ReactNode; action?: ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold"><Icon className="size-4 text-muted-foreground" /> {title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useCurrentUser()
  const docs = useDocumentStore((s) => s.docs)
  const { workspaces, users } = useWorkspaceStore()
  const setSearchOpen = useAppStore((s) => s.setSearchOpen)
  const createPage = useCreatePage()
  const [creatingWs, setCreatingWs] = useState(false)

  const favorites = useMemo(() => docs.filter((d) => d.favorite).sort(byRecent("updatedAt")), [docs])
  const recent = useMemo(() => docs.filter((d) => d.lastViewedAt).sort(byRecent("lastViewedAt")).slice(0, 4), [docs])
  const edited = useMemo(() => [...docs].sort(byRecent("updatedAt")).slice(0, 6), [docs])

  const quick = [
    { icon: FilePlus2, label: "New page", hint: "Start from a blank page", onClick: () => createPage() },
    { icon: Search, label: "Search", hint: "Find any page instantly", onClick: () => setSearchOpen(true) },
    { icon: UserPlus, label: "Invite teammates", hint: "Collaborate in real time", onClick: () => navigate("/members?invite=1") },
    { icon: Palette, label: "Appearance", hint: "Light, dark or system", onClick: () => navigate("/settings?tab=appearance") },
  ]

  return (
    <>
      <Topbar><span className="text-sm font-medium">Home</span></Topbar>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{greeting()}, {user.name.split(" ")[0]}</h1>
              <p className="mt-1 text-sm text-muted-foreground">You have {docs.length} pages across {workspaces.length} workspaces.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCreatingWs(true)}><Plus /> Create workspace</Button>
              <Button onClick={() => createPage()}><FilePlus2 /> New page</Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {quick.map(({ icon: Icon, label, hint, onClick }) => (
              <button key={label} type="button" onClick={onClick} className="group flex items-start gap-3 rounded-xl border bg-card p-4 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="hidden text-xs text-muted-foreground sm:block">{hint}</span>
                </span>
              </button>
            ))}
          </div>

          <Section title="Recently viewed" icon={Clock}>
            {recent.length ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {recent.map((d) => <DocumentCard key={d.id} doc={d} timeKey="lastViewedAt" />)}
              </div>
            ) : (
              <EmptyState icon={Clock} title="Nothing viewed yet" description="Pages you open will show up here." />
            )}
          </Section>

          <Section title="Favorites" icon={Star}>
            {favorites.length ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {favorites.map((d) => <DocumentCard key={d.id} doc={d} />)}
              </div>
            ) : (
              <EmptyState icon={Star} title="No favorites yet" description="Star a page to keep it one click away." />
            )}
          </Section>

          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <Section title="Recently edited" icon={History}>
              <div className="divide-y overflow-hidden rounded-xl border bg-card">
                {edited.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No pages yet.</p>}
                {edited.map((d) => {
                  const editor = users.find((u) => u.id === d.updatedBy)
                  const ws = workspaces.find((w) => w.id === d.workspaceId)
                  return (
                    <Link key={d.id} to={docPath(d)} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
                      <span className="text-lg">{d.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{docTitle(d)}</span>
                        <span className="block truncate text-xs text-muted-foreground">{ws?.icon} {ws?.name}</span>
                      </span>
                      {editor && <UserAvatar user={editor} size="xs" />}
                      <span className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground sm:block">{timeAgo(d.updatedAt)}</span>
                    </Link>
                  )
                })}
              </div>
            </Section>

            <Section title="Your workspaces" icon={Palette} action={<Button variant="ghost" size="sm" onClick={() => setCreatingWs(true)}><Plus /> New</Button>}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {workspaces.map((w) => <WorkspaceCard key={w.id} workspace={w} />)}
              </div>
            </Section>
          </div>
        </div>
      </div>
      <CreateWorkspaceDialog open={creatingWs} onOpenChange={setCreatingWs} />
    </>
  )
}
