import { useRef } from "react"
import { EditorContent, useEditor, type Editor as TiptapEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import type { User } from "@/types"
import { CollaboratorCursors } from "./CollaboratorCursors"

export function useDocEditor(content: string, onChange: (html: string) => void) {
  return useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false, autolink: true, defaultProtocol: "https" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: ({ node, editor }) =>
          node.type.name === "heading" ? `Heading ${node.attrs.level}` : editor.isEmpty ? "Start writing, or use the toolbar to format your page…" : "Type something…",
      }),
    ],
    content,
    editorProps: { attributes: { class: "doc-content min-h-[45vh] pb-24", spellcheck: "true" } },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
  })
}

export function Editor({ editor, collaborators }: { editor: TiptapEditor; collaborators: User[] }) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div ref={ref} className="relative">
      <EditorContent editor={editor} />
      <CollaboratorCursors editor={editor} users={collaborators} containerRef={ref} />
    </div>
  )
}
