# MSN ACL — Corporate Website & Admin CMS

A professional, multidisciplinary corporate website with a fully integrated, custom-built Content Management System (CMS). Built for MSN ACL to showcase their flagship projects, service sectors, and global presence while providing total administrative control.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router) with TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database:** PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Drag & Drop:** [dnd-kit](https://dndkit.com/) for reordering items
- **Forms & Validation:** react-hook-form & Zod
- **Rich Text Editing:** Tiptap Editor

## ✨ Features

### Public Website
- **Dynamic Content:** Fully data-driven Home, About Us, Projects, Career, Policies, News, and Contact pages.
- **Interactive UI:** Smooth scroll animations (Framer Motion), modern carousels (Embla), and responsive design.
- **Contact Integration:** Built-in contact form sending inquiries directly to `customercare@msnacl.com`.
- **Global Presence Map:** Embedded Google Maps & location data.

### Admin CMS
- **Secure Dashboard:** Protected routes with bcrypt-hashed credentials.
- **Full CRUD Control:** Create, Read, Update, and Delete capabilities for Hero Slides, Services, Stats, Projects, Clients, Funding Agencies, News, Team, Career, and Site Settings.
- **Drag-and-Drop Reordering:** Easily rearrange list items visually.
- **Media Management:** Built-in image uploading and optimization.
- **Rich Text:** Fully featured WYSIWYG editor for news and blog posts.

## 📦 Local Development

### Prerequisites
- Node.js (v20+ recommended)
- PostgreSQL database

### 1. Clone & Install
```bash
git clone <repository-url>
cd MSN-ACL
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in the required values:
```bash
cp .env.example .env
```
Ensure you have set:
- `DATABASE_URL` (PostgreSQL connection string)
- `NEXTAUTH_SECRET` (Run `openssl rand -base64 32` to generate one)
- `NEXTAUTH_URL` (e.g., `http://localhost:3000`)
- `SMTP_*` variables for email sending

### 3. Database Setup
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```
*(The seed command will create an initial admin user and optional placeholder content).*

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public site.  
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to access the CMS.

---

## 🌍 Production Deployment Guide (cPanel)

This guide provides exact step-by-step instructions for deploying the MSN ACL Next.js application to a cPanel shared hosting environment with Node.js and PostgreSQL.

### Step 1: Create the PostgreSQL Database
1. Log in to your cPanel.
2. Scroll to the **Databases** section and click on **PostgreSQL Databases**.
3. Create a new database (e.g., `msnaclco_db`).
4. Scroll down to **Add a New User** and create a user (e.g., `msnaclco_admin`) with a strong password.
5. Under **Add User To Database**, select your new user and new database, then click **Submit**. Grant **ALL PRIVILEGES**.
6. Construct your `DATABASE_URL` string using this format:
   `postgresql://username:password@localhost:5432/databasename`

### Step 2: Upload the Project files
1. Open the **Terminal** in cPanel or SSH into your server.
2. Clone your project or upload your files into a dedicated folder (NOT inside `public_html`).
   ```bash
   mkdir ~/msn-acl-app
   cd ~/msn-acl-app
   git clone <your-repository-url> .
   ```

### Step 3: Setup Node.js App in cPanel
1. In cPanel, find the **Software** section and click **Setup Node.js App**.
2. Click **Create Application**.
3. Fill in the following details:
   - **Node.js version:** Select `20.x.x` (or the latest stable 20+ version available).
   - **Application mode:** `Production`
   - **Application root:** `msn-acl-app` *(The folder you created in Step 2)*
   - **Application URL:** `msnacl.com` *(Select from dropdown)*
   - **Application startup file:** `node_modules/next/dist/bin/next`
4. Do NOT click "Start" or "Run npm install" in the UI yet.
5. Scroll down to **Environment variables** and add your required `.env` variables:
   - `DATABASE_URL` : Your constructed PostgreSQL connection string from Step 1.
   - `NEXTAUTH_SECRET` : Your randomly generated secure string.
   - `NEXTAUTH_URL` : `https://msnacl.com`
   - `ADMIN_EMAIL` : `admin@msnacl.com` (Your admin login email).
   - `ADMIN_PASSWORD` : A highly secure password for your first login.
   - `SMTP_HOST` : e.g., `mail.msnacl.com` (Check cPanel Email Accounts).
   - `SMTP_PORT` : e.g., `465` or `587`.
   - `SMTP_USER` : e.g., `noreply@msnacl.com`.
   - `SMTP_PASS` : Your email password.
   - `CONTACT_RECEIVER_EMAIL` : `customercare@msnacl.com`
6. Click **Save** at the top right.

### Step 4: Run Deployment Commands via SSH
Return to your cPanel Terminal / SSH session. First, enter the Node.js virtual environment using the command provided at the top of the "Setup Node.js App" page in cPanel, e.g.:
```bash
source /home/username/nodevenv/msn-acl-app/20/bin/activate && cd /home/username/msn-acl-app
```

Then, execute the following steps in order:
```bash
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run build
```

### Step 5: Start the Application
1. Go back to **Setup Node.js App** in cPanel.
2. Click the **Start App** button (or **Restart** if it was already running).
3. The app is now live at `https://msnacl.com`.

### Step 6: Verify Upload Permissions
The Next.js app stores uploaded images locally in `/public/uploads`.
Ensure the folder exists and has correct write permissions for the Node.js process:
```bash
mkdir -p public/uploads
chmod 755 public/uploads
```
