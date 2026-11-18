# Cowork: Real-Time Collaborative Workspace (FS-02 frontend prototype)

A frontend-only prototype of a Notion/Linear-style collaborative workspace. All data is mock data persisted to `localStorage`. There is no backend, no auth server and no real-time networking. Collaborators, presence and cursors are simulated.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
```

Sign in with any email and a password of 6+ characters (the demo email is prefilled).
To reset the demo data, clear the site's localStorage (keys start with `fs02-`).

## Stack

React 19 · Vite 8 · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI flavour) · Lucide · React Router 7 · Zustand (with `persist`) · TipTap 3 · Framer Motion · Sonner toasts

## Structure

```
src/
  App.tsx                    routes, theme sync, providers
  components/
    layout/                  AppLayout, AppSidebar, Topbar, WorkspaceSwitcher, UserMenu, SearchDialog (Ctrl K), MobileNav
    editor/                  Editor (TipTap setup), EditorToolbar, CollaboratorAvatars, CollaboratorCursors, ShareDialog, VersionHistory
    comments/                CommentsPanel, CommentItem
    workspace/               PageTree, PageActionsMenu, DocumentCard, WorkspaceCard, CreateWorkspaceDialog
    common/                  UserAvatar/AvatarStack, ConfirmDialog, EmptyState, Logo
    ui/                      shadcn/ui primitives (button, dialog, dropdown-menu, sheet, select, tabs, ...)
  pages/                     Login, Register, Dashboard, Workspace, DocumentEditor, Members, Settings (+ AuthLayout)
  store/                     appStore (auth, theme, prefs), workspaceStore (users, workspaces, members), documentStore (docs, comments, versions)
  hooks/                     usePresence (simulated online status), useCreatePage, useMediaQuery
  lib/                       utils (cn, timeAgo, validation), docs (paths, breadcrumbs)
  data/mock.ts               users, workspaces, members, documents, comments, versions
  types/                     shared TypeScript types
```

## Features

- **Auth (UI only):** login and register with client-side validation, a password strength meter, show/hide password, a Google button, a forgot-password dialog, and "Remember me" (localStorage vs. sessionStorage session). App routes redirect to login when signed out.
- **Dashboard:** greeting, quick-access cards, recently viewed, favorites, recently edited, workspace cards, and a create-workspace dialog.
- **Sidebar:** workspace switcher, search, navigation, favorites, and a nested page tree with create / rename / duplicate / favorite / delete. On desktop it collapses; below 1024px it becomes a drawer, and phones also get a bottom tab bar.
- **Workspace page:** header with members, page search, an All/Favorites filter, a hierarchical page list, and empty states.
- **Editor (TipTap):** editable title; paragraph and H1–H3; bold, italic, underline; bullet and numbered lists; quote; code block; links; alignment; undo/redo; placeholder. It autosaves to localStorage (debounced) with a Saving/Saved indicator and shows a word count.
- **Collaboration (simulated):** presence avatars with online dots that change over time, a collaborator popover, and colored live cursors placed on real text positions.
- **Comments:** side panel on desktop, drawer on mobile. Open/Resolved tabs, add (Ctrl+Enter), resolve/reopen, and delete your own comments.
- **Version history:** list, preview and restore. A restore first snapshots the current content as "Before restore". You can also save a version manually.
- **Share dialog:** invite by email with a role, general-access setting, and copy link.
- **Page options:** favorite, copy link, duplicate, full width, save version, export as HTML, delete.
- **Members:** search, role filter, inline role change, online status, invite modal (multiple emails, role cards), resend invite, and remove with confirmation.
- **Settings:** profile (name, email, title, avatar color), workspace (name, icon, description, delete), appearance (light/dark/system, full-width pages), and notification toggles.
- **Global:** Ctrl K search across titles and content, light/dark/system themes, toasts, a 404 page, and a lazy-loaded editor chunk.

## Known limitations

- There is no backend. Data lives in one browser's localStorage and nothing syncs between tabs or devices.
- Authentication is cosmetic. There is one local account (`Alex Morgan`), and registering just renames it.
- Collaborators, presence and cursors are random simulations. Remote edits never change the document.
- Invites, password resets and notification settings only show toasts. No email is sent.
- Comments are page-level and are not anchored to text selections.
- The main JS chunk is about 800 kB (about 255 kB gzipped). The TipTap editor is split into its own chunk.
