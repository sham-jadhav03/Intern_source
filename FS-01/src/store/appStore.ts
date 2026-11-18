import { useEffect, useState } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Theme = "light" | "dark" | "system"

export interface NotificationPrefs {
  mentions: boolean
  comments: boolean
  docUpdates: boolean
  invites: boolean
  weeklyDigest: boolean
  desktop: boolean
}

const SESSION_KEY = "fs02-session"
const readSession = () => !!(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY))

interface AppState {
  isAuthenticated: boolean
  searchOpen: boolean
  mobileNavOpen: boolean
  setSearchOpen: (v: boolean) => void
  setMobileNavOpen: (v: boolean) => void
  theme: Theme
  sidebarCollapsed: boolean
  fullWidth: boolean
  notifications: NotificationPrefs
  login: (remember: boolean) => void
  logout: () => void
  setTheme: (t: Theme) => void
  toggleSidebar: () => void
  setFullWidth: (v: boolean) => void
  setNotification: (key: keyof NotificationPrefs, v: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: readSession(),
      searchOpen: false,
      mobileNavOpen: false,
      setSearchOpen: (searchOpen) => set({ searchOpen }),
      setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
      theme: "system",
      sidebarCollapsed: false,
      fullWidth: false,
      notifications: { mentions: true, comments: true, docUpdates: false, invites: true, weeklyDigest: true, desktop: false },
      login: (remember) => {
        // "Remember me" decides whether the mock session survives closing the browser.
        const storage = remember ? localStorage : sessionStorage
        storage.setItem(SESSION_KEY, "1")
        set({ isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem(SESSION_KEY)
        sessionStorage.removeItem(SESSION_KEY)
        set({ isAuthenticated: false })
      },
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setFullWidth: (fullWidth) => set({ fullWidth }),
      setNotification: (key, v) => set((s) => ({ notifications: { ...s.notifications, [key]: v } })),
    }),
    {
      name: "fs02-app",
      partialize: (s) => ({ theme: s.theme, sidebarCollapsed: s.sidebarCollapsed, fullWidth: s.fullWidth, notifications: s.notifications }),
    },
  ),
)

const darkQuery = window.matchMedia("(prefers-color-scheme: dark)")

export function useResolvedTheme(): "light" | "dark" {
  const theme = useAppStore((s) => s.theme)
  const [systemDark, setSystemDark] = useState(darkQuery.matches)
  useEffect(() => {
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    darkQuery.addEventListener("change", onChange)
    return () => darkQuery.removeEventListener("change", onChange)
  }, [])
  return theme === "system" ? (systemDark ? "dark" : "light") : theme
}
