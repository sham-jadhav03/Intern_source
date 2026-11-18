import { useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { isEmail } from "@/lib/utils"
import { useAppStore } from "@/store/appStore"
import { useCurrentUser } from "@/store/workspaceStore"
import { AuthLayout, FieldError, GoogleIcon } from "./AuthLayout"

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login } = useAppStore()
  const demoUser = useCurrentUser()
  const [email, setEmail] = useState(demoUser.email)
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState<"email" | "google" | null>(null)
  const [forgotOpen, setForgotOpen] = useState(false)

  if (isAuthenticated && !loading) return <Navigate to="/dashboard" replace />
  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard"

  const finish = async (kind: "email" | "google") => {
    setLoading(kind)
    await wait(700)
    login(remember)
    toast.success(`Welcome back, ${demoUser.name.split(" ")[0]}!`)
    navigate(from, { replace: true })
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!isEmail(email)) next.email = "Enter a valid email address."
    if (password.length < 6) next.password = "Password must be at least 6 characters."
    setErrors(next)
    if (!Object.keys(next).length) finish("email")
  }

  return (
    <AuthLayout title="Sign in to Cowork" subtitle="Welcome back. Pick up right where your team left off.">
      <Button variant="outline" size="lg" className="w-full" disabled={!!loading} onClick={() => finish("google")}>
        {loading === "google" ? <Loader2 className="animate-spin" /> : <GoogleIcon />} Continue with Google
      </Button>
      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={submit} noValidate className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" className="h-9" value={email} aria-invalid={!!errors.email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          <FieldError>{errors.email}</FieldError>
        </div>
        <div className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button type="button" onClick={() => setForgotOpen(true)} className="text-xs font-medium text-primary hover:underline">Forgot password?</button>
          </div>
          <div className="relative">
            <Input id="password" type={showPw ? "text" : "password"} autoComplete="current-password" className="h-9 pr-9" value={password} aria-invalid={!!errors.password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
            <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? "Hide password" : "Show password"} className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <FieldError>{errors.password}</FieldError>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} /> Remember me
        </label>
        <Button type="submit" size="lg" className="w-full" disabled={!!loading}>
          {loading === "email" && <Loader2 className="animate-spin" />} Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account? <Link to="/register" className="font-medium text-primary hover:underline">Create one</Link>
      </p>
      <p className="mt-2 text-center text-xs text-muted-foreground">Demo: any password with 6+ characters works.</p>

      <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} defaultEmail={email} />
    </AuthLayout>
  )
}

function ForgotPasswordDialog({ open, onOpenChange, defaultEmail }: { open: boolean; onOpenChange: (o: boolean) => void; defaultEmail: string }) {
  const [email, setEmail] = useState(defaultEmail)
  const [error, setError] = useState("")
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          noValidate
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (!isEmail(email)) return setError("Enter a valid email address.")
            onOpenChange(false)
            toast.success("Reset link sent", { description: `Check ${email} for instructions (simulated).` })
          }}
        >
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>We'll email you a link to choose a new password.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-1.5">
            <Input autoFocus type="email" value={email} aria-invalid={!!error} onChange={(e) => { setEmail(e.target.value); setError("") }} />
            <FieldError>{error}</FieldError>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Send reset link</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
