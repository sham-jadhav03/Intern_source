import { Suspense } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useSimulatedPresence } from "@/hooks/usePresence"
import { useAppStore } from "@/store/appStore"
import { AppSidebar } from "./AppSidebar"
import { MobileNav } from "./MobileNav"
import { SearchDialog } from "./SearchDialog"

export function PageLoader() {
  return (
    <div className="mx-auto w-full max-w-3xl animate-pulse space-y-4 p-8">
      <div className="h-8 w-1/2 rounded-lg bg-muted" />
      <div className="h-4 w-full rounded bg-muted" />
      <div className="h-4 w-5/6 rounded bg-muted" />
      <div className="h-4 w-2/3 rounded bg-muted" />
    </div>
  )
}

export function AppLayout() {
  const location = useLocation()
  const { isAuthenticated, sidebarCollapsed, mobileNavOpen, setMobileNavOpen } = useAppStore()
  useSimulatedPresence()

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <AnimatePresence initial={false}>
        {!sidebarCollapsed && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="hidden shrink-0 overflow-hidden border-r lg:block"
          >
            <div className="h-full w-64"><AppSidebar /></div>
          </motion.aside>
        )}
      </AnimatePresence>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 gap-0 p-0 sm:max-w-72" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AppSidebar mobile onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden pb-14 md:pb-0">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <SearchDialog />
      <MobileNav />
    </div>
  )
}
