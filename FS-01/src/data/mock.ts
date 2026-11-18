import type { Comment, Doc, Member, User, Version, Workspace } from "@/types"

const ago = (mins: number) => new Date(Date.now() - mins * 60_000).toISOString()
const H = 60
const D = 24 * H

export const CURRENT_USER_ID = "u1"

export const users: User[] = [
  { id: "u1", name: "Alex Morgan", email: "alex.morgan@acme.io", color: "#6366f1", title: "Product Lead" },
  { id: "u2", name: "Priya Sharma", email: "priya.sharma@acme.io", color: "#ec4899", title: "Senior Designer" },
  { id: "u3", name: "Marcus Chen", email: "marcus.chen@acme.io", color: "#10b981", title: "Staff Engineer" },
  { id: "u4", name: "Sofia Rossi", email: "sofia.rossi@acme.io", color: "#f59e0b", title: "Marketing Manager" },
  { id: "u5", name: "Daniel Okafor", email: "daniel.okafor@acme.io", color: "#0ea5e9", title: "Frontend Engineer" },
  { id: "u6", name: "Emma Lindqvist", email: "emma.lindqvist@acme.io", color: "#8b5cf6", title: "UX Researcher" },
  { id: "u7", name: "Kenji Tanaka", email: "kenji.tanaka@acme.io", color: "#ef4444", title: "Backend Engineer" },
  { id: "u8", name: "Hannah Weber", email: "hannah.weber@acme.io", color: "#14b8a6", title: "Content Strategist" },
]

export const workspaces: Workspace[] = [
  { id: "w1", name: "Acme Product", icon: "🚀", description: "Roadmaps, specs and design docs for the core product team.", createdAt: ago(120 * D) },
  { id: "w2", name: "Marketing Hub", icon: "📣", description: "Campaigns, brand guidelines and content planning.", createdAt: ago(90 * D) },
  { id: "w3", name: "Engineering", icon: "⚙️", description: "Architecture notes, runbooks and onboarding.", createdAt: ago(60 * D) },
]

const m = (workspaceId: string, userId: string, role: Member["role"]): Member => ({ workspaceId, userId, role, status: "active" })

export const members: Member[] = [
  m("w1", "u1", "Owner"), m("w1", "u2", "Admin"), m("w1", "u3", "Editor"), m("w1", "u5", "Editor"), m("w1", "u6", "Editor"), m("w1", "u4", "Viewer"),
  m("w2", "u1", "Admin"), m("w2", "u4", "Owner"), m("w2", "u8", "Editor"), m("w2", "u2", "Viewer"),
  m("w3", "u1", "Editor"), m("w3", "u3", "Owner"), m("w3", "u7", "Admin"), m("w3", "u5", "Editor"),
]

const roadmap = `
<h1>Q1 2027 goals</h1>
<p>This quarter we focus on <strong>real-time collaboration</strong>, <em>performance</em> and a smoother onboarding experience. Each initiative has an owner and a measurable outcome.</p>
<h2>Key initiatives</h2>
<ol>
  <li><p><strong>Multiplayer editing</strong>: presence, live cursors and conflict-free merges.</p></li>
  <li><p><strong>Comments 2.0</strong>: threaded replies, mentions and resolve states.</p></li>
  <li><p><strong>Version history</strong>: named snapshots with one-click restore.</p></li>
</ol>
<h2>Success metrics</h2>
<ul>
  <li><p>Weekly active collaborators per workspace up <strong>25%</strong></p></li>
  <li><p>Median page load under <code>800ms</code></p></li>
  <li><p>Activation rate for new teams above 40%</p></li>
</ul>
<blockquote><p>"The best collaboration tools disappear. People should feel like they are in the same room." (Customer interview, Oct 2026)</p></blockquote>
<h3>Open questions</h3>
<p>How do we price multiplayer for teams on the free plan? See <a href="https://example.com/pricing">pricing research</a>.</p>
`

const designSystem = `
<h1>Design principles</h1>
<p>Our interface should feel <strong>calm, fast and precise</strong>. Every component follows the same spacing scale and type ramp.</p>
<h2>Spacing</h2>
<p>We use a 4px base grid. Common steps are 4, 8, 12, 16, 24 and 32.</p>
<pre><code>--space-1: 4px;
--space-2: 8px;
--space-4: 16px;</code></pre>
<h2>Components</h2>
<ul>
  <li><p>Buttons: primary, secondary, ghost, destructive</p></li>
  <li><p>Inputs share a 32px height and 8px radius</p></li>
  <li><p>Dialogs are centered with a soft backdrop blur</p></li>
</ul>
`

const weeklySync = `
<h2>Attendees</h2>
<p>Alex, Priya, Marcus, Daniel, Emma</p>
<h2>Agenda</h2>
<ol>
  <li><p>Multiplayer beta status</p></li>
  <li><p>Design review feedback</p></li>
  <li><p>Hiring update</p></li>
</ol>
<h2>Action items</h2>
<ul>
  <li><p><strong>Marcus</strong>: finalize the CRDT spike write-up by Friday</p></li>
  <li><p><strong>Priya</strong>: share updated cursor label designs</p></li>
  <li><p><strong>Daniel</strong>: profile editor bundle size</p></li>
</ul>
`

const p = (text: string) => `<p>${text}</p>`

const d = (id: string, workspaceId: string, parentId: string | null, title: string, icon: string, content: string, updatedMins: number, updatedBy: string, favorite = false, viewedMins?: number): Doc => ({
  id, workspaceId, parentId, title, icon, content, favorite,
  createdAt: ago(updatedMins + 20 * D),
  updatedAt: ago(updatedMins),
  updatedBy,
  lastViewedAt: viewedMins === undefined ? undefined : ago(viewedMins),
})

export const docs: Doc[] = [
  d("d1", "w1", null, "Product Roadmap Q1 2027", "🗺️", roadmap, 25, "u2", true, 10),
  d("d2", "w1", "d1", "Launch Checklist", "✅", p("Pre-launch QA, docs, changelog, and announcement plan."), 3 * H, "u1", false, 2 * H),
  d("d3", "w1", "d1", "Feature Prioritization", "📊", p("RICE scoring for the Q1 candidates. Multiplayer leads with a score of 84."), 2 * D, "u3"),
  d("d4", "w1", null, "Design System Guidelines", "🎨", designSystem, 5 * H, "u2", true, 30),
  d("d5", "w1", "d4", "Color & Typography Tokens", "🖌️", p("Semantic tokens map to light and dark palettes."), 4 * D, "u2"),
  d("d6", "w1", null, "Meeting Notes", "📝", p("A running archive of team meetings."), 6 * D, "u1"),
  d("d7", "w1", "d6", "Weekly Sync, Nov 17", "🗓️", weeklySync, 22 * H, "u1", false, 20 * H),
  d("d8", "w1", "d6", "Design Review, Nov 12", "🧩", p("Reviewed the new comments panel and version history drawer."), 6 * D, "u6"),
  d("d9", "w1", null, "Customer Research Insights", "🔍", p("Synthesis from 18 interviews with team leads across 6 industries."), 3 * D, "u6", true, 3 * D),
  d("d10", "w2", null, "Brand Voice & Messaging", "💬", p("We sound confident, warm and concise. Never jargon-heavy."), 8 * H, "u4", true, 5 * H),
  d("d11", "w2", null, "Campaign Calendar 2027", "📅", p("Quarterly themes and launch moments for 2027."), 2 * D, "u4"),
  d("d12", "w2", "d11", "Blog Post: Real-time Collaboration", "✍️", p("Draft: Why we rebuilt our editor for multiplayer."), 1 * D, "u8", false, 1 * D),
  d("d13", "w3", null, "API Architecture Overview", "🏗️", p("Services communicate over gRPC; the public API is REST + webhooks."), 12 * H, "u3", false, 9 * H),
  d("d14", "w3", null, "Onboarding Guide for New Engineers", "👋", p("Week one: environment setup, codebase tour, first PR."), 5 * D, "u7"),
  d("d15", "w3", null, "Incident Postmortem: Sync Outage", "🚨", p("On Nov 3, document sync was degraded for 42 minutes."), 15 * D, "u7"),
]

const c = (id: string, docId: string, authorId: string, body: string, mins: number, resolved = false): Comment => ({ id, docId, authorId, body, createdAt: ago(mins), resolved })

export const comments: Comment[] = [
  c("c1", "d1", "u2", "Can we add a design milestone for the cursor label explorations? I'd like to share options by mid-January.", 3 * H),
  c("c2", "d1", "u3", "The CRDT spike might push multiplayer into early Q2. Let's flag that risk explicitly in the roadmap.", 2 * H),
  c("c3", "d1", "u6", "Love the customer quote. Can we link the full interview notes?", 50),
  c("c4", "d1", "u5", "Updated the load-time metric to reflect p50, not p95.", 2 * D, true),
  c("c5", "d4", "u5", "Should the ghost button have a visible border in dark mode?", 6 * H),
  c("c6", "d7", "u3", "Spike write-up is in progress, should land Thursday.", 20 * H),
]

const v = (id: string, docId: string, authorId: string, mins: number, label: string, title: string, content: string): Version => ({ id, docId, authorId, createdAt: ago(mins), label, title, content })

export const versions: Version[] = [
  v("v1", "d1", "u2", 1 * D, "Added success metrics", "Product Roadmap Q1 2027", roadmap.replace(/<blockquote>[\s\S]*?<\/blockquote>/, "").replace(/<h3>[\s\S]*$/, "")),
  v("v2", "d1", "u1", 3 * D, "Key initiatives draft", "Product Roadmap Q1 2027", `<h1>Q1 2027 goals</h1>${p("Focus areas: collaboration, performance, onboarding.")}<h2>Key initiatives</h2><ol><li><p>Multiplayer editing</p></li><li><p>Comments 2.0</p></li></ol>`),
  v("v3", "d1", "u1", 7 * D, "Initial outline", "Roadmap (draft)", `<h1>Q1 goals</h1>${p("TBD: gather input from team leads.")}`),
  v("v4", "d4", "u2", 2 * D, "Spacing section", "Design System Guidelines", designSystem.replace(/<h2>Components[\s\S]*$/, "")),
  v("v5", "d4", "u2", 9 * D, "First draft", "Design System Guidelines", `<h1>Design principles</h1>${p("Calm, fast and precise.")}`),
]
