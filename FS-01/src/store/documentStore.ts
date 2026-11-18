import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as mock from "@/data/mock"
import { uid } from "@/lib/utils"
import type { Comment, Doc, Version } from "@/types"

interface DocumentState {
  docs: Doc[]
  comments: Comment[]
  versions: Version[]
  createDoc: (workspaceId: string, parentId?: string | null) => Doc
  deleteDoc: (id: string) => void
  deleteWorkspaceDocs: (workspaceId: string) => void
  duplicateDoc: (id: string) => Doc | undefined
  updateDoc: (id: string, data: Partial<Pick<Doc, "title" | "icon" | "content">>) => void
  toggleFavorite: (id: string) => void
  markViewed: (id: string) => void
  addComment: (docId: string, body: string) => void
  toggleResolved: (id: string) => void
  deleteComment: (id: string) => void
  saveVersion: (docId: string, label: string) => void
  restoreVersion: (versionId: string) => Version | undefined
}

const now = () => new Date().toISOString()
const ME = mock.CURRENT_USER_ID

/** A doc's id plus all of its descendants' ids. */
export function subtreeIds(docs: Doc[], id: string): string[] {
  return [id, ...docs.filter((d) => d.parentId === id).flatMap((c) => subtreeIds(docs, c.id))]
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      docs: mock.docs,
      comments: mock.comments,
      versions: mock.versions,
      createDoc: (workspaceId, parentId = null) => {
        const doc: Doc = {
          id: uid(), workspaceId, parentId, title: "", icon: "📄", content: "", favorite: false,
          createdAt: now(), updatedAt: now(), updatedBy: ME, lastViewedAt: now(),
        }
        set((s) => ({ docs: [...s.docs, doc] }))
        return doc
      },
      deleteDoc: (id) =>
        set((s) => {
          const ids = new Set(subtreeIds(s.docs, id))
          return {
            docs: s.docs.filter((d) => !ids.has(d.id)),
            comments: s.comments.filter((c) => !ids.has(c.docId)),
            versions: s.versions.filter((v) => !ids.has(v.docId)),
          }
        }),
      deleteWorkspaceDocs: (workspaceId) => set((s) => ({ docs: s.docs.filter((d) => d.workspaceId !== workspaceId) })),
      duplicateDoc: (id) => {
        const src = get().docs.find((d) => d.id === id)
        if (!src) return
        const copy: Doc = { ...src, id: uid(), title: `${src.title || "Untitled"} (copy)`, favorite: false, createdAt: now(), updatedAt: now(), updatedBy: ME }
        set((s) => ({ docs: [...s.docs, copy] }))
        return copy
      },
      updateDoc: (id, data) =>
        set((s) => ({ docs: s.docs.map((d) => (d.id === id ? { ...d, ...data, updatedAt: now(), updatedBy: ME } : d)) })),
      toggleFavorite: (id) => set((s) => ({ docs: s.docs.map((d) => (d.id === id ? { ...d, favorite: !d.favorite } : d)) })),
      markViewed: (id) => set((s) => ({ docs: s.docs.map((d) => (d.id === id ? { ...d, lastViewedAt: now() } : d)) })),
      addComment: (docId, body) =>
        set((s) => ({ comments: [...s.comments, { id: uid(), docId, authorId: ME, body, createdAt: now(), resolved: false }] })),
      toggleResolved: (id) => set((s) => ({ comments: s.comments.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c)) })),
      deleteComment: (id) => set((s) => ({ comments: s.comments.filter((c) => c.id !== id) })),
      saveVersion: (docId, label) => {
        const doc = get().docs.find((d) => d.id === docId)
        if (!doc) return
        const version: Version = { id: uid(), docId, authorId: ME, createdAt: now(), label, title: doc.title, content: doc.content }
        set((s) => ({ versions: [version, ...s.versions] }))
      },
      restoreVersion: (versionId) => {
        const version = get().versions.find((v) => v.id === versionId)
        if (!version) return
        get().saveVersion(version.docId, "Before restore")
        get().updateDoc(version.docId, { title: version.title, content: version.content })
        return version
      },
    }),
    { name: "fs02-documents" },
  ),
)
