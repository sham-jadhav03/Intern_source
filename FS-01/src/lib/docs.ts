import type { Doc } from "@/types"

export const docPath = (doc: Pick<Doc, "id" | "workspaceId">) => `/workspace/${doc.workspaceId}/doc/${doc.id}`

export const docTitle = (doc: Pick<Doc, "title">) => doc.title.trim() || "Untitled"

/** Root-first chain of parents for breadcrumbs. */
export function ancestors(docs: Doc[], doc: Doc): Doc[] {
  const chain: Doc[] = []
  let parent = docs.find((d) => d.id === doc.parentId)
  while (parent && !chain.includes(parent)) {
    chain.unshift(parent)
    parent = docs.find((d) => d.id === parent!.parentId)
  }
  return chain
}

export const byRecent = <K extends "updatedAt" | "lastViewedAt">(key: K) => (a: Doc, b: Doc) =>
  (b[key] ?? "").localeCompare(a[key] ?? "")
