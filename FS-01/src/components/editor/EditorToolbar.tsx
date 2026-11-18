import { useState, type ReactNode } from "react"
import { useEditorState, type Editor } from "@tiptap/react"
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, ChevronDown, Code2, Heading1, Heading2, Heading3, Italic,
  Link2, List, ListOrdered, Pilcrow, Quote, Redo2, Underline, Undo2, Unlink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

function ToolButton({ label, shortcut, active, disabled, onClick, children }: { label: string; shortcut?: string; active?: boolean; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={label}
            aria-pressed={active}
            disabled={disabled}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-35 [&_svg]:size-4",
              active && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
            )}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}{shortcut && <span className="opacity-60">{shortcut}</span>}</TooltipContent>
    </Tooltip>
  )
}

const Divider = () => <span className="mx-1 h-5 w-px shrink-0 bg-border" />

const BLOCKS = [
  { key: "p", label: "Text", icon: Pilcrow },
  { key: "h1", label: "Heading 1", icon: Heading1 },
  { key: "h2", label: "Heading 2", icon: Heading2 },
  { key: "h3", label: "Heading 3", icon: Heading3 },
] as const

const ALIGNS = [
  { key: "left", label: "Align left", icon: AlignLeft },
  { key: "center", label: "Align center", icon: AlignCenter },
  { key: "right", label: "Align right", icon: AlignRight },
  { key: "justify", label: "Justify", icon: AlignJustify },
] as const

export function EditorToolbar({ editor }: { editor: Editor }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      code: e.isActive("codeBlock"),
      link: e.isActive("link"),
      href: (e.getAttributes("link").href as string | undefined) ?? "",
      block: e.isActive("heading", { level: 1 }) ? "h1" : e.isActive("heading", { level: 2 }) ? "h2" : e.isActive("heading", { level: 3 }) ? "h3" : "p",
      align: (["center", "right", "justify"] as const).find((a) => e.isActive({ textAlign: a })) ?? "left",
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })
  const chain = () => editor.chain().focus()
  const block = BLOCKS.find((b) => b.key === s.block)!
  const align = ALIGNS.find((a) => a.key === s.align)!

  const setBlock = (key: (typeof BLOCKS)[number]["key"]) => {
    if (key === "p") chain().setParagraph().run()
    else chain().toggleHeading({ level: Number(key[1]) as 1 | 2 | 3 }).run()
  }

  return (
    <div className="no-scrollbar flex items-center gap-0.5 overflow-x-auto px-1 py-1">
      <ToolButton label="Undo" shortcut="Ctrl Z" disabled={!s.canUndo} onClick={() => chain().undo().run()}><Undo2 /></ToolButton>
      <ToolButton label="Redo" shortcut="Ctrl Shift Z" disabled={!s.canRedo} onClick={() => chain().redo().run()}><Redo2 /></ToolButton>
      <Divider />
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="shrink-0 gap-1.5 px-2 text-muted-foreground" />}>
          <block.icon /> <span className="hidden w-16 text-left sm:inline">{block.label}</span> <ChevronDown className="size-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          {BLOCKS.map((b) => (
            <DropdownMenuItem key={b.key} onClick={() => setBlock(b.key)} className={cn(s.block === b.key && "text-primary")}>
              <b.icon /> {b.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Divider />
      <ToolButton label="Bold" shortcut="Ctrl B" active={s.bold} onClick={() => chain().toggleBold().run()}><Bold /></ToolButton>
      <ToolButton label="Italic" shortcut="Ctrl I" active={s.italic} onClick={() => chain().toggleItalic().run()}><Italic /></ToolButton>
      <ToolButton label="Underline" shortcut="Ctrl U" active={s.underline} onClick={() => chain().toggleUnderline().run()}><Underline /></ToolButton>
      <LinkButton editor={editor} active={s.link} href={s.href} />
      <Divider />
      <ToolButton label="Bullet list" active={s.bullet} onClick={() => chain().toggleBulletList().run()}><List /></ToolButton>
      <ToolButton label="Numbered list" active={s.ordered} onClick={() => chain().toggleOrderedList().run()}><ListOrdered /></ToolButton>
      <ToolButton label="Quote" active={s.quote} onClick={() => chain().toggleBlockquote().run()}><Quote /></ToolButton>
      <ToolButton label="Code block" active={s.code} onClick={() => chain().toggleCodeBlock().run()}><Code2 /></ToolButton>
      <Divider />
      {/* Full alignment group on wider screens, one compact dropdown on phones */}
      <div className="hidden items-center gap-0.5 md:flex">
        {ALIGNS.map((a) => (
          <ToolButton key={a.key} label={a.label} active={s.align === a.key} onClick={() => chain().setTextAlign(a.key).run()}><a.icon /></ToolButton>
        ))}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="shrink-0 gap-1 px-2 text-muted-foreground md:hidden" aria-label="Text alignment" />}>
          <align.icon /> <ChevronDown className="size-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          {ALIGNS.map((a) => (
            <DropdownMenuItem key={a.key} onClick={() => chain().setTextAlign(a.key).run()}><a.icon /> {a.label}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function LinkButton({ editor, active, href }: { editor: Editor; active: boolean; href: string }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")

  const apply = () => {
    const value = url.trim()
    if (!value) editor.chain().focus().extendMarkRange("link").unsetLink().run()
    else editor.chain().focus().extendMarkRange("link").setLink({ href: /^[a-z]+:/i.test(value) ? value : `https://${value}` }).run()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) setUrl(href) }}>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="Link"
            onMouseDown={(e) => e.preventDefault()}
            className={cn("flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-4", active && "bg-primary/10 text-primary")}
          />
        }
      >
        <Link2 />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <form onSubmit={(e) => { e.preventDefault(); apply() }} className="flex gap-2">
          <Input autoFocus value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste or type a link…" />
          <Button type="submit" size="default">Apply</Button>
        </form>
        {active && (
          <Button variant="ghost" size="sm" className="justify-start text-destructive" onClick={() => { editor.chain().focus().extendMarkRange("link").unsetLink().run(); setOpen(false) }}>
            <Unlink /> Remove link
          </Button>
        )}
        {editor.state.selection.empty && !active && <p className="text-xs text-muted-foreground">Tip: select text first to turn it into a link.</p>}
      </PopoverContent>
    </Popover>
  )
}
