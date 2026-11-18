import { lazy, useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { Compass } from "lucide-react"
import { EmptyState } from "@/components/common/EmptyState"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import Dashboard from "@/pages/Dashboard"
import Login from "@/pages/Login"
import Members from "@/pages/Members"
import Register from "@/pages/Register"
import Settings from "@/pages/Settings"
import Workspace from "@/pages/Workspace"
import { useAppStore, useResolvedTheme } from "@/store/appStore"
import { useWorkspaceStore } from "@/store/workspaceStore"

// TipTap is the heaviest dependency; load it only when a document is opened.
const DocumentEditor = lazy(() => import("@/pages/DocumentEditor"))

function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <EmptyState icon={Compass} title="Page not found" description="The page you're looking for doesn't exist." action={<Button onClick={() => navigate("/")}>Go home</Button>} />
    </div>
  )
}

function CurrentWorkspaceRedirect() {
  const id = useWorkspaceStore((s) => s.currentWorkspaceId)
  return <Navigate to={id ? `/workspace/${id}` : "/dashboard"} replace />
}

export default function App() {
  const theme = useResolvedTheme()
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.style.colorScheme = theme
  }, [theme])

  return (
    <TooltipProvider delay={400}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workspace" element={<CurrentWorkspaceRedirect />} />
            <Route path="/workspace/:workspaceId" element={<Workspace />} />
            <Route path="/workspace/:workspaceId/doc/:docId" element={<DocumentEditor />} />
            <Route path="/members" element={<Members />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" />
    </TooltipProvider>
  )
}
