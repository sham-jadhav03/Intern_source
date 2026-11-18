import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CURRENT_USER_ID } from "@/data/mock"
import { cn, isEmail } from "@/lib/utils"
import { useAppStore } from "@/store/appStore"
import { useWorkspaceStore } from "@/store/workspaceStore"
import { AuthLayout, FieldError } from "./AuthLayout"

type Field = "name" | "email" | "password" | "confirm"

function strength(pw: string) {
  return [pw.length >= 8, /[A-Z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length
}
const STRENGTH = ["Too weak", "Weak", "Fair", "Good", "Strong"]
const STRENGTH_COLOR = ["bg-destructive", "bg-destructive", "bg-amber-500", "bg-emerald-500", "bg-emerald-500"]

export default function Register() {
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAppStore()
  const updateUser = useWorkspaceStore((s) => s.updateUser)
  const [form, setForm] = useState<Record<Field, string>>({ name: "", email: "", password: "", confirm: "" })
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && !loading) return <Navigate to="/dashboard" replace />

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }
  const score = strength(form.password)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (form.name.trim().length < 2) next.name = "Enter your full name."
    if (!isEmail(form.email)) next.email = "Enter a valid email address."
    if (form.password.length < 8) next.password = "Use at least 8 characters."
    else if (score < 2) next.password = "Add an uppercase letter, number or symbol."
    if (form.confirm !== form.password) next.confirm = "Passwords don't match."
    setErrors(next)
    if (Object.keys(next).length) return
    setLoading(true)
    setTimeout(() => {
      // The prototype has a single local account; registering personalises it.
      updateUser(CURRENT_USER_ID, { name: form.name.trim(), email: form.email.trim() })
      login(true)
      toast.success("Account created", { description: "Your workspace is ready." })
      navigate("/dashboard", { replace: true })
    }, 800)
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start collaborating with your team in minutes.">
      <form onSubmit={submit} noValidate className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" autoComplete="name" className="h-9" value={form.name} onChange={set("name")} aria-invalid={!!errors.name} placeholder="Jordan Lee" />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" autoComplete="email" className="h-9" value={form.email} onChange={set("email")} aria-invalid={!!errors.email} placeholder="you@company.com" />
          <FieldError>{errors.email}</FieldError>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="new-password" className="h-9" value={form.password} onChange={set("password")} aria-invalid={!!errors.password} placeholder="At least 8 characters" />
          {form.password && (
            <div className="flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={cn("h-1 flex-1 rounded-full bg-muted transition-colors", i < score && STRENGTH_COLOR[score])} />
                ))}
              </div>
              <span className="w-14 text-right text-xs text-muted-foreground">{STRENGTH[score]}</span>
            </div>
          )}
          <FieldError>{errors.password}</FieldError>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type="password" autoComplete="new-password" className="h-9" value={form.confirm} onChange={set("confirm")} aria-invalid={!!errors.confirm} />
          <FieldError>{errors.confirm}</FieldError>
        </div>
        <Button type="submit" size="lg" className="mt-1 w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />} Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
