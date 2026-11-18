import { useEffect, useState, type RefObject } from "react"
import type { Editor } from "@tiptap/react"
import { motion } from "framer-motion"
import type { User } from "@/types"

interface Cursor { x: number; y: number; h: number }

/**
 * Simulated remote cursors. Each collaborator hops to a random text position on a timer,
 * placed with ProseMirror's coordsAtPos so carets land on real characters. No networking.
 */
export function CollaboratorCursors({ editor, users, containerRef }: { editor: Editor; users: User[]; containerRef: RefObject<HTMLDivElement | null> }) {
  const [cursors, setCursors] = useState<Record<string, Cursor>>({})

  useEffect(() => {
    const move = (userId: string) => {
      const box = containerRef.current?.getBoundingClientRect()
      if (!box || editor.isDestroyed) return
      const size = editor.state.doc.content.size
      const pos = 1 + Math.floor(Math.random() * Math.max(1, size - 2))
      try {
        const c = editor.view.coordsAtPos(pos)
        setCursors((prev) => ({ ...prev, [userId]: { x: c.left - box.left, y: c.top - box.top, h: Math.max(16, c.bottom - c.top) } }))
      } catch {
        /* position became invalid mid-edit; skip this tick */
      }
    }
    users.forEach((u) => move(u.id))
    const timers = users.map((u, i) => setInterval(() => move(u.id), 2600 + i * 900))
    return () => timers.forEach(clearInterval)
  }, [editor, users, containerRef])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {users.map((u) => {
        const c = cursors[u.id]
        if (!c) return null
        return (
          <motion.div
            key={u.id}
            className="absolute top-0 left-0"
            initial={false}
            animate={{ x: c.x, y: c.y }}
            transition={{ type: "spring", stiffness: 140, damping: 20 }}
          >
            <span className="block w-0.5 rounded-full" style={{ height: c.h, backgroundColor: u.color }} />
            <span className="absolute bottom-full left-0 mb-0.5 rounded-md rounded-bl-none px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-white shadow-sm" style={{ backgroundColor: u.color }}>
              {u.name.split(" ")[0]}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
