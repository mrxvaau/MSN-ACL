# MSN ACL - Corporate Website

A premium, modern corporate and consulting web application built for MSN ACL.

## Project Overview

MSN ACL's corporate web platform is designed to provide a highly performant, SEO-optimized, and visually stunning digital presence. It includes a full public-facing site detailing the company's projects, news, career opportunities, and services. It also includes a custom-built, fully authenticated Admin Dashboard to manage all website content dynamically.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: Framer Motion
- **Database ORM**: Prisma
- **Database Provider**: SQLite (Development) / PostgreSQL (Production)
- **Authentication**: NextAuth.js (v4)
- **Icons**: Lucide React
- **Drag & Drop**: dnd-kit

## How to Run Locally

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>
cd msn-acl

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root of the project with the following structure:

```env
# Database (SQLite for local dev)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="dev-secret-change-in-production-32chars"
NEXTAUTH_URL="http://localhost:3000"

# Initial Admin Credentials (used during seeding)
ADMIN_EMAIL="admin@msnacl.com"
ADMIN_PASSWORD="Admin123!"

# SMTP (Optional for Dev, required for production contact emails)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
CONTACT_RECEIVER_EMAIL="customercare@msnacl.com"
```

### 4. Database Setup & Seeding
```bash
# Run Prisma migrations to construct the database schema
npx prisma migrate dev --name init

# Seed the database with the initial Admin user and dummy placeholder data
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
```
The application will be running at `http://localhost:3000`. 
Admin Dashboard: `http://localhost:3000/admin/login` (Login with credentials from your `.env`).

## How to Create Additional Admin Users
Presently, the system uses a single admin account created during the initial database seed (`prisma/seed.ts`).
To create additional admins:
1. You can manually create a record in your database connected directly through a SQL client (remember to `bcrypt` hash the password).
2. Or use Prisma Studio: Run `npx prisma studio` and add a new row to the `Admin` table.
3. For a larger team, you could expand the existing Admin Dashboard to include a "Manage Users" page.

## Transitioning to PostgreSQL for Production
The application is currently configured to use a local SQLite database for ease of development. To migrate to PostgreSQL for your production environment:

1. **Update `prisma/schema.prisma`:**
   Change the datasource provider from `"sqlite"` to `"postgresql"`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **(Optional) Array Type Conversion:** 
   Currently, array fields like `gallery` in the `Project` model are stored as JSON strings (`String @default("[]")`) to maintain SQLite compatibility. In Postgres, you can natively use string arrays (`String[]`). You can safely leave them as JSON strings, or update them.

3. **Update `.env`:**
   Set the `DATABASE_URL` to your production PostgreSQL connection string (e.g., from Neon, Supabase, or AWS RDS).

4. **Run Migration:**
   ```bash
   npx prisma migrate dev --name switch-to-postgres
   ```
   *(Note: You may need to delete the `prisma/migrations` folder before doing this to start fresh in Postgres).*

5. **Re-seed:**
   ```bash
   npx prisma db seed
   ```

## Deployment Guide (Vercel)

This Next.js application is optimized for deployment on Vercel.

1. **Push your code to a Git repository** (GitHub, GitLab, Bitbucket).
2. **Import the Project in Vercel.**
3. **Configure Environment Variables in the Vercel Dashboard:**
   - `DATABASE_URL` (Your production Postgres URL)
   - `NEXTAUTH_SECRET` (Generate a secure random string)
   - `NEXTAUTH_URL` (Your production domain, e.g., `https://msnacl.com`)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (Your mail server credentials)
   - `CONTACT_RECEIVER_EMAIL` (Where contact forms should be sent)
4. **Deploy.** Vercel will automatically run `npm run build` and provision the necessary edge functions and static assets.

## Configuring SMTP for Contact Emails
To ensure contact form submissions are emailed to your team:
1. Obtain SMTP credentials from your email provider (e.g., Google Workspace, Amazon SES, SendGrid, Resend).
2. Add the credentials to your production environment variables:
   - `SMTP_HOST` (e.g., `smtp.gmail.com`)
   - `SMTP_PORT` (usually `465` or `587`)
   - `SMTP_USER` (your email address/API key)
   - `SMTP_PASS` (your app password/API secret)
   - `CONTACT_RECEIVER_EMAIL` (the inbox receiving the messages)
3. The application will automatically detect these and send HTML emails via `nodemailer` when the public `/contact-us` form is submitted.
