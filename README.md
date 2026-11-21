# Rohit Rawat — Associate Product Manager Portfolio & CMS

A fast, modern, and responsive personal portfolio website with a private headless Content Management System (CMS) and Admin Dashboard.

- **Public Site**: Fast, accessible, single-page portfolio with animated sections, interactive case study modals, dynamic skills toolkit, and contact form.
- **Admin Dashboard** (`/admin`): Complete CMS to edit all headlines, case studies, work experience, skills, and read recruiter messages without touching code or redeploying.

---

## Tech Stack
- **Front End**: Vite, React 19, TypeScript, Tailwind CSS
- **Animations**: Framer Motion (respects `prefers-reduced-motion`)
- **Icons**: Lucide React
- **Backend & Database**: Supabase (PostgreSQL 15, Auth, Storage)
- **Data Fetching & Cache**: TanStack React Query
- **Routing**: React Router v7 (`/` public portfolio, `/admin/*` dashboard)

---

## Supabase Setup (Click-by-Click Guide)

If you haven't set up Supabase yet, follow these 5 quick steps:

### 1. Create a Project
1. Go to [supabase.com](https://supabase.com) and sign in or sign up.
2. Click **New Project**, name it `portfolio-rohit-rawat`, set a database password, and select your region (e.g. South Asia / Mumbai or Singapore).
3. Wait ~1 minute for the project to provision.

### 2. Copy Project Credentials
1. In your Supabase Dashboard, click the **Settings (gear icon)** at the bottom left -> **API**.
2. Copy the **Project URL** (e.g. `https://xyzcompany.supabase.co`).
3. Copy the **anon public API key**.
4. In your local project, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
5. Paste your URL and anon key into `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

### 3. Run Schema & Seed SQL
1. In your Supabase project left sidebar, click **SQL Editor**.
2. Click **New Query**.
3. Copy all contents from [`supabase/schema.sql`](file:///Users/rohan/Portfolio/supabase/schema.sql) and paste into the editor, then click **Run** (green button).
4. Create another query, copy all contents from [`supabase/seed.sql`](file:///Users/rohan/Portfolio/supabase/seed.sql), paste into the editor, and click **Run**.
   *This automatically creates all tables, Row Level Security (RLS) policies, rate-limiting triggers, and populates your exact resume data.*

### 4. Create Your Admin User
1. In the Supabase left sidebar, click **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Enter email: `rohanrwt9278@gmail.com` and a secure password.
4. Set **Auto Confirm User?** to **ON**, then click **Create User**.
5. *Security recommendation*: Under **Authentication** -> **Signers / Providers**, disable &quot;Allow new users to sign up&quot; so only you can access the admin panel.

---

## Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

- Public Site: `http://localhost:5173`
- Admin Dashboard: `http://localhost:5173/admin`

---

## How to Update Your Website (Non-Developer Guide)

You can update 100% of the site from your browser without code edits:
1. Navigate to `https://your-domain.com/admin` (or `http://localhost:5173/admin`).
2. Log in with `rohanrwt9278@gmail.com` and your password.
3. Access each section from the sidebar:
   - **Site Settings**: Change your headline, subtitle, about bio, phone, email, or toggle the &quot;Currently available - Hire me&quot; banner on/off.
   - **Projects**: Add new projects, edit case study outcomes, upload screenshots, or toggle featured status.
   - **Work Experience**: Update your roles, firms, and bullet point achievements.
   - **Education**: Add certifications, university degrees, or courses.
   - **Skills**: Add or remove skills and adjust proficiency fill bars.
   - **Media Library**: Upload new project screenshots, PRD PDFs, or replace your resume PDF.
   - **Messages**: Review incoming messages from recruiters with unread badges, mark them read, or reply directly via email.
4. Any changes saved in the admin are immediately live for visitors upon refresh!

---

## Files to Replace Checklist

The public site includes placeholder assets. Replace these with your actual files when ready:
- [ ] `public/resume.pdf` — Your real PDF resume (or upload via `/admin/media` and update the URL in Site Settings).
- [ ] `public/profile.jpg` — Your headshot / profile photo.
- [ ] `public/projects/bookmyshow-1.png` — Screenshot of the BookMyShow prototype flow.
- [ ] `public/projects/bookmyshow-2.png` — Second screenshot or PRD preview.
- [ ] `public/projects/bookmyshow-prd.pdf` — Full BookMyShow PRD PDF.

---

## Connecting a Custom Domain (e.g. rohitrawat.com)

1. On **Vercel**: Go to Project Settings -> **Domains**.
2. Enter your custom domain (e.g. `rohitrawat.com` or `pmrohit.com`).
3. Add the displayed DNS records (A record pointing to `76.76.21.21` or CNAME `cname.vercel-dns.com`) at your domain registrar (GoDaddy, Namecheap, Cloudflare).
4. In **Supabase Dashboard**: Go to **Authentication** -> **URL Configuration** and update **Site URL** and **Redirect URLs** to your custom domain.
