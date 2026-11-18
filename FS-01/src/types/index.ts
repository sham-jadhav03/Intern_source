export type Role = "Owner" | "Admin" | "Editor" | "Viewer"

export interface User {
  id: string
  name: string
  email: string
  color: string
  title?: string
}

export interface Workspace {
  id: string
  name: string
  icon: string
  description: string
  createdAt: string
}

export interface Member {
  userId: string
  workspaceId: string
  role: Role
  status: "active" | "invited"
}

export interface Doc {
  id: string
  workspaceId: string
  parentId: string | null
  title: string
  icon: string
  content: string
  favorite: boolean
  createdAt: string
  updatedAt: string
  updatedBy: string
  lastViewedAt?: string
}

export interface Comment {
  id: string
  docId: string
  authorId: string
  body: string
  createdAt: string
  resolved: boolean
}

export interface Version {
  id: string
  docId: string
  authorId: string
  createdAt: string
  label: string
  title: string
  content: string
}
