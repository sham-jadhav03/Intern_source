import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { docPath } from "@/lib/docs"
import { useDocumentStore } from "@/store/documentStore"
import { useWorkspaceStore } from "@/store/workspaceStore"

/** Creates a page in the given (or current) workspace and opens it in the editor. */
export function useCreatePage() {
  const navigate = useNavigate()
  const createDoc = useDocumentStore((s) => s.createDoc)
  return (parentId: string | null = null, workspaceId?: string) => {
    const doc = createDoc(workspaceId ?? useWorkspaceStore.getState().currentWorkspaceId, parentId)
    navigate(docPath(doc))
    toast.success(parentId ? "Subpage created" : "Page created")
    return doc
  }
}
