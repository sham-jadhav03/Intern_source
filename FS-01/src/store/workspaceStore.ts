import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as mock from "@/data/mock"
import { uid } from "@/lib/utils"
import type { Member, Role, User, Workspace } from "@/types"

interface WorkspaceState {
  users: User[]
  workspaces: Workspace[]
  members: Member[]
  currentWorkspaceId: string
  setCurrentWorkspace: (id: string) => void
  createWorkspace: (data: Pick<Workspace, "name" | "icon" | "description">) => Workspace
  updateWorkspace: (id: string, data: Partial<Workspace>) => void
  deleteWorkspace: (id: string) => void
  updateUser: (id: string, data: Partial<User>) => void
  inviteMember: (email: string, role: Role) => void
  setRole: (userId: string, role: Role) => void
  removeMember: (userId: string) => void
}

const COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#0ea5e9", "#8b5cf6", "#ef4444", "#14b8a6"]

const nameFromEmail = (email: string) =>
  email.split("@")[0]!.split(/[._-]+/).filter(Boolean).map((p) => p[0]!.toUpperCase() + p.slice(1)).join(" ")

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      users: mock.users,
      workspaces: mock.workspaces,
      members: mock.members,
      currentWorkspaceId: mock.workspaces[0]!.id,
      setCurrentWorkspace: (id) => set({ currentWorkspaceId: id }),
      createWorkspace: (data) => {
        const ws: Workspace = { ...data, id: uid(), createdAt: new Date().toISOString() }
        set((s) => ({
          workspaces: [...s.workspaces, ws],
          members: [...s.members, { workspaceId: ws.id, userId: mock.CURRENT_USER_ID, role: "Owner", status: "active" }],
          currentWorkspaceId: ws.id,
        }))
        return ws
      },
      updateWorkspace: (id, data) => set((s) => ({ workspaces: s.workspaces.map((w) => (w.id === id ? { ...w, ...data } : w)) })),
      deleteWorkspace: (id) =>
        set((s) => {
          const workspaces = s.workspaces.filter((w) => w.id !== id)
          return { workspaces, members: s.members.filter((m) => m.workspaceId !== id), currentWorkspaceId: workspaces[0]?.id ?? "" }
        }),
      updateUser: (id, data) => set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...data } : u)) })),
      inviteMember: (email, role) => {
        const { users, currentWorkspaceId } = get()
        let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
        if (!user) {
          user = { id: uid(), name: nameFromEmail(email) || email, email, color: COLORS[users.length % COLORS.length]! }
          set({ users: [...users, user] })
        }
        const userId = user.id
        set((s) => ({
          members: s.members.some((m) => m.workspaceId === currentWorkspaceId && m.userId === userId)
            ? s.members
            : [...s.members, { workspaceId: currentWorkspaceId, userId, role, status: "invited" }],
        }))
      },
      setRole: (userId, role) =>
        set((s) => ({ members: s.members.map((m) => (m.workspaceId === s.currentWorkspaceId && m.userId === userId ? { ...m, role } : m)) })),
      removeMember: (userId) =>
        set((s) => ({ members: s.members.filter((m) => !(m.workspaceId === s.currentWorkspaceId && m.userId === userId)) })),
    }),
    { name: "fs02-workspaces" },
  ),
)

export const useCurrentUser = () => useWorkspaceStore((s) => s.users.find((u) => u.id === mock.CURRENT_USER_ID)!)
export const useCurrentWorkspace = () =>
  useWorkspaceStore((s) => s.workspaces.find((w) => w.id === s.currentWorkspaceId) ?? s.workspaces[0])
export const useUser = (id: string | undefined) => useWorkspaceStore((s) => s.users.find((u) => u.id === id))
