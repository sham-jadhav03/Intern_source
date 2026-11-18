import { useState, type ReactElement } from "react"
import { useNavigate } from "react-router-dom"
import { Copy, ExternalLink, FilePlus2, Pencil, Star, StarOff, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useCreatePage } from "@/hooks/useCreatePage"
import { docPath, docTitle } from "@/lib/docs"
import { subtreeIds, useDocumentStore } from "@/store/documentStore"
import type { Doc } from "@/types"

interface Props {
  doc: Doc
  trigger: ReactElement
  onDeleted?: () => void
}

export function PageActionsMenu({ doc, trigger, onDeleted }: Props) {
  const navigate = useNavigate()
  const createPage = useCreatePage()
  const { updateDoc, toggleFavorite, duplicateDoc, deleteDoc, docs } = useDocumentStore()
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState(doc.title)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const childCount = subtreeIds(docs, doc.id).length - 1

  const rename = () => {
    updateDoc(doc.id, { title: name.trim() })
    setRenaming(false)
    toast.success("Page renamed")
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={trigger} />
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onClick={() => navigate(docPath(doc))}><ExternalLink /> Open</DropdownMenuItem>
          <DropdownMenuItem onClick={() => createPage(doc.id, doc.workspaceId)}><FilePlus2 /> Add subpage</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setName(doc.title); setRenaming(true) }}><Pencil /> Rename</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              toggleFavorite(doc.id)
              toast(doc.favorite ? "Removed from favorites" : "Added to favorites")
            }}
          >
            {doc.favorite ? <><StarOff /> Remove favorite</> : <><Star /> Add to favorites</>}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              const copy = duplicateDoc(doc.id)
              if (copy) toast.success("Page duplicated", { action: { label: "Open", onClick: () => navigate(docPath(copy)) } })
            }}
          >
            <Copy /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setConfirmDelete(true)}><Trash2 /> Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={renaming} onOpenChange={setRenaming}>
        <DialogContent>
          <form onSubmit={(e) => { e.preventDefault(); rename() }} className="grid gap-4">
            <DialogHeader><DialogTitle>Rename page</DialogTitle></DialogHeader>
            <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Untitled" />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRenaming(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Delete "${docTitle(doc)}"?`}
        description={childCount ? `This page and its ${childCount} subpage${childCount > 1 ? "s" : ""} will be permanently deleted.` : "This page will be permanently deleted."}
        onConfirm={() => {
          deleteDoc(doc.id)
          toast.success("Page deleted")
          onDeleted?.()
        }}
      />
    </>
  )
}
