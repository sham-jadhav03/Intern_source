import { useState, type ReactNode } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Bell, Building2, Check, Monitor, Moon, Palette, Sun, User as UserIcon } from "lucide-react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { UserAvatar } from "@/components/common/UserAvatar"
import { Topbar } from "@/components/layout/Topbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { WORKSPACE_ICONS } from "@/components/workspace/CreateWorkspaceDialog"
import { CURRENT_USER_ID } from "@/data/mock"
import { cn, isEmail } from "@/lib/utils"
import { useAppStore, type NotificationPrefs, type Theme } from "@/store/appStore"
import { useDocumentStore } from "@/store/documentStore"
import { useCurrentUser, useCurrentWorkspace, useWorkspaceStore } from "@/store/workspaceStore"

const TABS = [
  { value: "profile", label: "Profile", icon: UserIcon },
  { value: "workspace", label: "Workspace", icon: Building2 },
  { value: "appearance", label: "Appearance", icon: Palette },
  { value: "notifications", label: "Notifications", icon: Bell },
]

function Card({ title, description, children, footer }: { title: string; description?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <h2 className="font-semibold">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
      {footer && <div className="flex justify-end gap-2 border-t bg-muted/30 px-5 py-3 sm:px-6">{footer}</div>}
    </section>
  )
}

export default function Settings() {
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.value === params.get("tab")) ? params.get("tab")! : "profile"

  return (
    <>
      <Topbar><span className="text-sm font-medium">Settings</span></Topbar>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your account, workspace and preferences.</p>
          <Tabs value={tab} onValueChange={(v) => setParams({ tab: String(v) }, { replace: true })} className="mt-6">
            <TabsList className="no-scrollbar w-full justify-start overflow-x-auto sm:w-fit">
              {TABS.map(({ value, label, icon: Icon }) => (
                <TabsTrigger key={value} value={value} className="flex-none px-3"><Icon /> {label}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="profile" className="mt-4"><ProfileSettings /></TabsContent>
            <TabsContent value="workspace" className="mt-4"><WorkspaceSettings /></TabsContent>
            <TabsContent value="appearance" className="mt-4"><AppearanceSettings /></TabsContent>
            <TabsContent value="notifications" className="mt-4"><NotificationSettings /></TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

const COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#0ea5e9", "#8b5cf6", "#ef4444", "#14b8a6"]

function ProfileSettings() {
  const user = useCurrentUser()
  const updateUser = useWorkspaceStore((s) => s.updateUser)
  const [form, setForm] = useState({ name: user.name, email: user.email, title: user.title ?? "", color: user.color })
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const dirty = form.name !== user.name || form.email !== user.email || form.title !== (user.title ?? "") || form.color !== user.color

  const save = () => {
    const next: typeof errors = {}
    if (form.name.trim().length < 2) next.name = "Name must be at least 2 characters."
    if (!isEmail(form.email)) next.email = "Enter a valid email address."
    setErrors(next)
    if (Object.keys(next).length) return
    updateUser(CURRENT_USER_ID, { ...form, name: form.name.trim(), email: form.email.trim() })
    toast.success("Profile updated")
  }

  return (
    <Card
      title="Profile"
      description="This is how teammates see you across workspaces."
      footer={<>
        <Button variant="outline" disabled={!dirty} onClick={() => setForm({ name: user.name, email: user.email, title: user.title ?? "", color: user.color })}>Reset</Button>
        <Button disabled={!dirty} onClick={save}>Save changes</Button>
      </>}
    >
      <div className="flex flex-wrap items-center gap-4">
        <UserAvatar user={{ ...user, name: form.name || user.name, color: form.color }} size="xl" />
        <div>
          <p className="mb-2 text-sm font-medium">Avatar color</p>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button key={c} type="button" aria-label={`Color ${c}`} onClick={() => setForm({ ...form, color: c })} className="flex size-7 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition-transform hover:scale-110" style={{ backgroundColor: c, boxShadow: form.color === c ? `0 0 0 2px var(--background), 0 0 0 4px ${c}` : undefined }}>
                {form.color === c && <Check className="size-3.5 text-white" />}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="p-name">Full name</Label>
          <Input id="p-name" value={form.name} aria-invalid={!!errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="p-email">Email</Label>
          <Input id="p-email" type="email" value={form.email} aria-invalid={!!errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="p-title">Job title</Label>
          <Input id="p-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Product Designer" />
        </div>
      </div>
    </Card>
  )
}

function WorkspaceSettings() {
  const navigate = useNavigate()
  const workspace = useCurrentWorkspace()
  const { workspaces, updateWorkspace, deleteWorkspace } = useWorkspaceStore()
  const deleteWorkspaceDocs = useDocumentStore((s) => s.deleteWorkspaceDocs)
  const [form, setForm] = useState({ name: workspace?.name ?? "", icon: workspace?.icon ?? "🚀", description: workspace?.description ?? "" })
  const [confirm, setConfirm] = useState(false)
  // Re-sync the form when the user switches workspace from the sidebar.
  const [syncedId, setSyncedId] = useState(workspace?.id)
  if (workspace && syncedId !== workspace.id) {
    setSyncedId(workspace.id)
    setForm({ name: workspace.name, icon: workspace.icon, description: workspace.description })
  }
  if (!workspace) return null
  const dirty = form.name !== workspace.name || form.icon !== workspace.icon || form.description !== workspace.description

  return (
    <div className="space-y-6">
      <Card
        title="Workspace"
        description="Settings apply to everyone in this workspace."
        footer={<Button disabled={!dirty || form.name.trim().length < 2} onClick={() => { updateWorkspace(workspace.id, { ...form, name: form.name.trim() }); toast.success("Workspace updated") }}>Save changes</Button>}
      >
        <div className="grid gap-2">
          <Label>Icon</Label>
          <div className="flex flex-wrap gap-1.5">
            {WORKSPACE_ICONS.map((i) => (
              <button key={i} type="button" onClick={() => setForm({ ...form, icon: i })} aria-pressed={form.icon === i} className={cn("flex size-9 items-center justify-center rounded-lg border text-lg hover:bg-muted", form.icon === i && "border-primary bg-primary/10")}>{i}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="w-name">Name</Label>
          <Input id="w-name" value={form.name} maxLength={40} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {form.name.trim().length < 2 && <p className="text-xs text-destructive">Name must be at least 2 characters.</p>}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="w-desc">Description</Label>
          <Textarea id="w-desc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </Card>

      <section className="rounded-xl border border-destructive/30 bg-card p-5 sm:p-6">
        <h2 className="font-semibold text-destructive">Danger zone</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {workspaces.length > 1 ? "Permanently delete this workspace and all of its pages." : "You can't delete your only workspace."}
          </p>
          <Button variant="destructive" disabled={workspaces.length <= 1} onClick={() => setConfirm(true)}>Delete workspace</Button>
        </div>
      </section>
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={`Delete ${workspace.name}?`}
        description="All pages, comments and members in this workspace will be removed. This cannot be undone."
        confirmLabel="Delete workspace"
        onConfirm={() => {
          deleteWorkspaceDocs(workspace.id)
          deleteWorkspace(workspace.id)
          toast.success("Workspace deleted")
          navigate("/dashboard")
        }}
      />
    </div>
  )
}

function AppearanceSettings() {
  const { theme, setTheme, fullWidth, setFullWidth } = useAppStore()
  const options: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]
  return (
    <div className="space-y-6">
      <Card title="Theme" description="Choose how Cowork looks on this device.">
        <div className="grid gap-3 sm:grid-cols-3">
          {options.map(({ value, label, icon: Icon }) => (
            <button key={value} type="button" onClick={() => setTheme(value)} aria-pressed={theme === value} className={cn("overflow-hidden rounded-xl border text-left transition-all hover:border-primary/40", theme === value && "border-primary ring-2 ring-primary/25")}>
              <div className={cn("flex h-20 gap-1.5 p-2.5", value === "dark" ? "bg-zinc-900" : value === "light" ? "bg-zinc-100" : "bg-linear-to-r from-zinc-100 from-50% to-zinc-900 to-50%")}>
                <div className={cn("w-1/4 rounded-md", value === "dark" ? "bg-zinc-800" : "bg-white")} />
                <div className={cn("flex-1 space-y-1.5 rounded-md p-2", value === "light" ? "bg-white" : "bg-zinc-800")}>
                  <div className="h-1.5 w-2/3 rounded bg-primary/60" />
                  <div className="h-1.5 w-full rounded bg-zinc-400/40" />
                  <div className="h-1.5 w-4/5 rounded bg-zinc-400/40" />
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium">
                <Icon className="size-4" /> {label}
                {theme === value && <Check className="ml-auto size-4 text-primary" />}
              </div>
            </button>
          ))}
        </div>
      </Card>
      <Card title="Editor">
        <label className="flex items-center justify-between gap-4">
          <span>
            <span className="block text-sm font-medium">Full-width pages</span>
            <span className="block text-sm text-muted-foreground">Use the whole window width for document content.</span>
          </span>
          <Switch checked={fullWidth} onCheckedChange={(v) => setFullWidth(!!v)} />
        </label>
      </Card>
    </div>
  )
}

const NOTIFICATIONS: { key: keyof NotificationPrefs; label: string; description: string }[] = [
  { key: "mentions", label: "Mentions", description: "When someone @mentions you in a page or comment" },
  { key: "comments", label: "Comments on your pages", description: "New comments and replies on pages you created" },
  { key: "docUpdates", label: "Page updates", description: "When pages you follow are edited" },
  { key: "invites", label: "Workspace invitations", description: "When you're invited to a workspace" },
  { key: "weeklyDigest", label: "Weekly digest", description: "A Monday summary of activity in your workspaces" },
  { key: "desktop", label: "Desktop notifications", description: "Show notifications in your operating system" },
]

function NotificationSettings() {
  const { notifications, setNotification } = useAppStore()
  return (
    <Card title="Notifications" description="Choose what you want to hear about.">
      <div className="divide-y">
        {NOTIFICATIONS.map(({ key, label, description }) => (
          <label key={key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <span>
              <span className="block text-sm font-medium">{label}</span>
              <span className="block text-sm text-muted-foreground">{description}</span>
            </span>
            <Switch
              checked={notifications[key]}
              onCheckedChange={(v) => {
                setNotification(key, !!v)
                toast(`${label} notifications ${v ? "on" : "off"}`)
              }}
            />
          </label>
        ))}
      </div>
    </Card>
  )
}
