# BYU PMA Website Context

This document is intended to provide concise project context, setup rules, and structural overviews for AI agents working on this repository (`byupmsociety-cpu/PMA-WEBSITE-main`).

## 1. Product Overview (What We Are Building)

**Target Audience:** BYU students who are part of the Product Management Association (PMA), as well as students looking to break into Product Management and join the club.

**Core Mission:** The purpose of this website is to engage users and drive traffic so that students can:
- **Discover & Attend Events:** Stay connected with PMA activities.
- **Learn about PM:** Provide educational content on product management.
- **Access Crucial Tools:** Centralize tools needed to prepare for a PM career.
- **Recruit & Land Roles:** Offer resume-building tools and recruiting resources to help students secure great PM jobs.

## 1. Agent Setup & Git Workflow

Before starting any implementation work, all agents **MUST** follow the workflow defined in `.cursor/AGENT_SETUP_TEMPLATE.md` and `.cursor/rules/setup-and-plan.mdc`:

1.  **Branch Cleanup:** Delete any local *and remote* branches that match `justin-*`. Always ask the user for approval before running destructive commands. **Never** delete `main` or branches that do not start with `justin-`.
    - Local: `git branch -D justin-<branch>`
    - Remote: `git push origin --delete justin-<branch>`
2.  **Sync Main:** `git checkout main` and `git pull origin main`.
3.  **New Branch:** Create and checkout a new branch: `justin-<kebab-case-description>` (e.g., `justin-fix-nav`).
4.  **Plan Only:** Agents must present a **plan only** for the request. Do not write any implementation code until the user approves the plan.
5.  **Completion:** Have the user push the branch: `git push -u origin <branch>`
6.  **Pull Requests:** Create and merge Pull Requests **directly in the PMA GitHub Organization:** `https://github.com/byupmsociety-cpu/PMA-WEBSITE-main`. Do not push to personal GitHub accounts.

## 2. Tech Stack Overview

-   **Frontend:** React 18, Vite, TypeScript.
-   **Routing:** React Router v6 (`react-router-dom`).
-   **Styling:** Tailwind CSS, `shadcn/ui` (accessible, customizable components), `next-themes` (Dark/Light mode support).
-   **State Management & Data Fetching:** `@tanstack/react-query` (Caching, async operations).
-   **Forms & Validation:** `react-hook-form` and `zod`.
-   **Backend & DB:** Supabase (PostgreSQL, Auth, real-time subscriptions, edge functions).

## 3. Project Structure Map

-   `src/App.tsx`: The main React Router definitions. All page routes (e.g., `/admin`, `/jobs`, `/events`) are mapped here.
-   `src/pages/`: Contains page-level components corresponding to application routes (e.g., `HomePage.tsx`, `AdminDashboardPage.tsx`).
-   `src/components/`: Reusable, generic components (Navigation, Footer) including the `shadcn/ui` catalog components.
-   `src/contexts/`: Global application context providers (e.g., `AuthProvider.tsx`, `ThemeContext.tsx`).
-   `src/lib/`: Common utility functions.
-   `supabase/migrations/`: Stores all SQL database migrations for the Supabase instance.
-   `.cursor/`: Contains essential agent directives, rules, and setup templates.

## 4. Key Conventions

-   **Admin Access:** The application includes restricted areas (`/admin/*`). Access requires a user with an `admin` or `super-admin` role in the `public.profiles` table. The default super-admin is seeded via database migrations: `byupmsociety@gmail.com` | Password: `superadminPM123`.
-   **Environment Variables:** Supabase connects via `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` defined in `.env`.
-   **SEO & Custom Domains:** Set `VITE_SITE_URL` for sitemap generation and proper Open Graph URL indexing. Pre-build scripts automatically update `sitemap.xml` and `robots.txt` based on available application routes.
