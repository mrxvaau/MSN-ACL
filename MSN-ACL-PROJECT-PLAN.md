# MSN ACL — Corporate Website + Admin CMS
## Project Plan (Reference Build: betsbd.com style)

---

## 1. Company Info (placeholders — confirm with client before launch)

- **Company Name:** MSN ACL
- **Phone:** 01751323936
- **Address:** 58, Sabujbag
- **Email:** customercare@msnacl.com

> ⚠️ Note: I could not find a live website for "MSN ACL" to verify business sector (consulting? construction? trading?). The plan below is written generically as a **multidisciplinary corporate/consulting site** (same shape as betsbd.com). Confirm the real industry with your client — it only changes copy/labels, not the architecture.

---

## 2. Reference Site Analysis (betsbd.com)

Sections found on the live site, in order:
1. **Header** — logo, nav (Home / About Us / Projects / Career / Our Policies / Contact Us), search icon, mobile menu
2. **Hero Slider** — full-width auto-rotating image slider, each slide has a "Read More →" CTA
3. **Service Sectors** — carousel of service cards
4. **Stats Counters** — Completed Projects / On Going Projects / Projects Abroad / Clients / Countries / Years in Business (animated numbers)
5. **Flagship Projects** — carousel of featured project cards
6. **Global Presence** — a map/image showing reach
7. **Our Clients** — logo carousel
8. **Funding Agencies** — logo carousel
9. **News & Insights** — blog/news carousel
10. **Our Location** — embedded Google Map
11. **Footer** — company blurb, ISO/logo badge, office address, email, phone, social icons, copyright

Everything above is **fully admin-editable** in our build — text, images, order, and visibility.

---

## 3. Tech Stack (matches what you said: Antigravity + Claude 3.1 Pro, Prisma, PostgreSQL)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | one repo for frontend + API routes, great SEO/SSR, image optimization |
| Styling | **Tailwind CSS + shadcn/ui** | fast, clean, modern, consistent design system |
| Database | **PostgreSQL** | required, relational, production-grade |
| ORM | **Prisma** | type-safe queries, easy migrations |
| Auth (admin) | **NextAuth.js (Credentials provider) + bcrypt** | simple, secure admin login, session-based |
| File/Image storage | **Local `/public/uploads` (dev)** → **Cloudinary or S3-compatible bucket (prod)** | swappable via `.env` |
| Drag-and-drop ordering | **dnd-kit** (admin panel) | smooth reordering UX, writes `order` field to DB |
| Forms/validation | **react-hook-form + zod** | type-safe forms both admin & public (contact form) |
| Rich text (blog/news) | **Tiptap editor** | clean WYSIWYG for blog posts |
| Maps | **Google Maps Embed (iframe) + Leaflet for "Global Presence" pins** | matches reference site, fully data-driven |
| Email (contact form) | **Resend or Nodemailer (SMTP)** | sends inquiries to customercare@msnacl.com |
| Deployment | Vercel (frontend) + Neon/Supabase/Railway (Postgres) — or single VPS with Docker | your choice, both documented |

---

## 4. Core Principle: EVERYTHING Admin-Controlled

Every visual block on the public site maps to a DB table with at minimum:
`id, title, description, imageUrl, order (Int), isPublished (Boolean), createdAt, updatedAt`

Admin can:
- Add new item → appears in **specified position** (default: end of list, or "Add to top")
- **Drag to reorder** any list (hero slides, services, projects, clients, funders, news, gallery, footer social links)
- Edit title/description/image inline
- Toggle publish/unpublish (hide without deleting)
- Delete with confirmation
- Upload images with preview + auto-resize/optimize

---

## 5. Prisma Schema (`schema.prisma`) — Draft

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hash
  name      String
  role      String   @default("admin") // admin | superadmin
  createdAt DateTime @default(now())
}

model SiteSetting {
  id          String  @id @default(cuid())
  companyName String  @default("MSN ACL")
  phone       String  @default("01751323936")
  email       String  @default("customercare@msnacl.com")
  address     String  @default("58, Sabujbag")
  logoUrl     String?
  faviconUrl  String?
  mapEmbedUrl String?
  footerText  String?
  updatedAt   DateTime @updatedAt
}

model HeroSlide {
  id          String   @id @default(cuid())
  title       String
  subtitle    String?
  imageUrl    String
  ctaText     String?  @default("Read More")
  ctaLink     String?
  order       Int      @default(0)
  isPublished Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Service {
  id          String   @id @default(cuid())
  title       String
  description String?
  iconUrl     String?
  imageUrl    String?
  order       Int      @default(0)
  isPublished Boolean  @default(true)
}

model Stat {
  id        String  @id @default(cuid())
  label     String  // e.g. "Completed Projects"
  value     Int
  suffix    String? // "+", "%"
  order     Int     @default(0)
}

model Project {
  id          String   @id @default(cuid())
  title       String
  description String?
  content     String?  // rich text, full project page
  imageUrl    String
  gallery     String[] // additional images
  location    String?
  status      String   @default("completed") // completed | ongoing | abroad
  isFlagship  Boolean  @default(false)
  order       Int      @default(0)
  isPublished Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model Client {
  id          String  @id @default(cuid())
  name        String
  logoUrl     String
  websiteUrl  String?
  order       Int     @default(0)
  isPublished Boolean @default(true)
}

model FundingAgency {
  id          String  @id @default(cuid())
  name        String
  logoUrl     String
  order       Int     @default(0)
  isPublished Boolean @default(true)
}

model NewsPost {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String?
  content     String   // rich text HTML
  coverImage  String
  order       Int      @default(0)
  isPublished Boolean  @default(true)
  publishedAt DateTime @default(now())
}

model GlobalPresence {
  id        String  @id @default(cuid())
  country   String
  lat       Float
  lng       Float
  note      String?
  order     Int     @default(0)
}

model TeamMember {
  id          String  @id @default(cuid())
  name        String
  designation String
  photoUrl    String
  bio         String?
  order       Int     @default(0)
  isPublished Boolean @default(true)
}

model JobPosting {
  id          String   @id @default(cuid())
  title       String
  department  String?
  location    String?
  deadline    DateTime?
  description String
  applyEmail  String?
  isPublished Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model Policy {
  id      String @id @default(cuid())
  title   String
  fileUrl String   // PDF download
  order   Int      @default(0)
}

model SocialLink {
  id       String @id @default(cuid())
  platform String // facebook | linkedin | whatsapp | twitter | messenger
  url      String
  order    Int    @default(0)
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  subject   String?
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

## 6. Public Site Pages

| Route | Purpose |
|---|---|
| `/` | Home — hero slider, services, stats, flagship projects, global presence map, clients, funders, news, location map, footer |
| `/about-us` | Company history, mission/vision, team members |
| `/projects` | All projects, filterable (Completed / Ongoing / Abroad) |
| `/projects/[slug]` | Single project detail with gallery |
| `/career` | Job postings list |
| `/career/[id]` | Job detail + apply (mailto or form) |
| `/our-policies` | Downloadable policy PDFs |
| `/news` | Blog/news listing |
| `/news/[slug]` | Single news/blog post |
| `/contact-us` | Contact form (saves to DB + emails customercare@msnacl.com) + embedded map |

## 7. Admin Panel (`/admin`)

- `/admin/login` — secure login
- `/admin` — dashboard (quick stats: unread messages, total projects, etc.)
- `/admin/hero-slides` — CRUD + drag reorder
- `/admin/services` — CRUD + drag reorder
- `/admin/stats` — CRUD + drag reorder
- `/admin/projects` — CRUD + drag reorder + flagship toggle
- `/admin/clients` — CRUD + drag reorder
- `/admin/funding-agencies` — CRUD + drag reorder
- `/admin/news` — CRUD (rich text editor) + drag reorder
- `/admin/global-presence` — CRUD (map pins)
- `/admin/team` — CRUD + drag reorder
- `/admin/career` — CRUD job postings
- `/admin/policies` — upload/manage PDFs
- `/admin/messages` — view contact form submissions
- `/admin/settings` — site-wide settings (logo, phone, email, address, map embed, social links, footer text)

Every admin list page = table/grid with thumbnail, title, **drag handle** (dnd-kit), publish toggle, edit, delete.

---

## 8. Design Direction

- Clean, modern, corporate — generous white space, soft shadows, rounded-xl cards
- Primary brand color: pick 1 strong color (e.g. deep navy/teal) + 1 accent (e.g. amber/orange) — to be confirmed with client logo
- Typography: Inter or Plus Jakarta Sans for clean modern look
- Smooth scroll-triggered fade-in animations (Framer Motion)
- Fully responsive (mobile-first), image carousels swipeable on touch
- Loading skeletons instead of spinners for perceived performance
- Dark-mode-ready admin panel (optional, nice-to-have)

---

## 9. Security & Credentials

- All secrets in `.env` (never committed — add `.env` to `.gitignore`)
- `.env.example` provided with placeholder keys
- Admin password hashed with bcrypt, never stored plain
- Rate-limit contact form + admin login (basic in-memory or Upstash if available)
- CSRF protection via NextAuth defaults
- Input sanitization on rich text (DOMPurify) before saving/rendering

**.env keys needed:**
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=         # used only in seed script, not stored plain
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
CONTACT_RECEIVER_EMAIL=customercare@msnacl.com
CLOUDINARY_URL=         # if using Cloudinary for images
NEXT_PUBLIC_GOOGLE_MAPS_EMBED=
```

---

## 10. Build Milestones (suggested order for Antigravity/Claude to execute)

1. **Scaffold** — Next.js + TS + Tailwind + shadcn/ui, folder structure, `.env.example`
2. **Database** — Prisma schema above, run migration, seed script (sample admin user + demo content)
3. **Auth** — NextAuth admin login, protected `/admin` routes via middleware
4. **Admin CRUD** — generic reusable CRUD components (table + drag-reorder + form modal) → wire to each model
5. **Image upload** — API route for uploads, stores path/URL in DB
6. **Public Home page** — build all sections, pulling live data from DB
7. **Public inner pages** — About, Projects, Career, Policies, News, Contact
8. **Contact form** — DB save + email send
9. **Polish** — animations, responsiveness, SEO meta tags, sitemap.xml, favicon
10. **Final QA** — test admin reorder → confirms public page updates instantly; test all forms; lighthouse check

---

## 11. Folder Structure (Next.js App Router)

```
msn-acl/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx                 # Home
│   │   │   ├── about-us/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   ├── projects/[slug]/page.tsx
│   │   │   ├── career/page.tsx
│   │   │   ├── our-policies/page.tsx
│   │   │   ├── news/page.tsx
│   │   │   ├── news/[slug]/page.tsx
│   │   │   └── contact-us/page.tsx
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   ├── layout.tsx               # sidebar nav, auth guard
│   │   │   ├── page.tsx                 # dashboard
│   │   │   ├── hero-slides/page.tsx
│   │   │   ├── services/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   ├── clients/page.tsx
│   │   │   ├── funding-agencies/page.tsx
│   │   │   ├── news/page.tsx
│   │   │   ├── team/page.tsx
│   │   │   ├── career/page.tsx
│   │   │   ├── policies/page.tsx
│   │   │   ├── messages/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── upload/route.ts
│   │       ├── contact/route.ts
│   │       └── [model]/route.ts         # REST CRUD per model
│   ├── components/
│   │   ├── public/                      # HeroSlider, ServiceCard, StatCounter, etc.
│   │   ├── admin/                       # ReorderableList, CrudForm, ImageUploader
│   │   └── ui/                          # shadcn components
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   └── types/
├── public/uploads/
├── .env.example
└── package.json
```

---

## 12. What I Need From You Before/During Build

1. Confirm MSN ACL's actual **industry/services** (consulting, construction, trading, etc.) so copy matches reality
2. Logo file (or should we design a placeholder?)
3. Brand colors (if any exist already)
4. Real Google Maps location link for 58, Sabujbag
5. Any social media links (Facebook/LinkedIn/etc.)
6. Hosting preference (Vercel+Neon, or your own VPS?)

---
