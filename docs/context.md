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
-   `src/lib/`: Utility functions plus hardcoded content data (resources, APM Playbook, video library) and small Supabase helpers.
-   `supabase/migrations/`: Stores all SQL database migrations for the Supabase instance.
-   `.cursor/`: Contains essential agent directives, rules, and setup templates.

## 4. Key Conventions

-   **Admin Access:** The application includes restricted areas (`/admin/*`). Access requires a user with an `admin` or `super-admin` role in the `public.profiles` table. The default super-admin is seeded via database migrations: `byupmsociety@gmail.com` | Password: `superadminPM123`.
-   **Environment Variables:** Supabase connects via `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` defined in `.env`.
-   **Supabase Project:** Since 2026-10-26 the site uses project `eekhwyjcivruiqmtdeeq` (`pma-website`). The repo is linked, so apply migrations with the Supabase CLI (`supabase db query --linked`) and record each version in `supabase_migrations.schema_migrations`. Built in auth email is capped at 2 per hour (no custom SMTP).
-   **Resources Content Lives in Code:** Resources page content is TypeScript data, not database rows. `/admin/resources` does not affect it.
    -   `src/lib/resources.ts`: resource categories, resources, and tips.
    -   `src/lib/apmPlaybook.ts`: the APM Playbook steps. Links can point to a category, a resource, or a page section (`kind: "section"`).
    -   `src/lib/videoLibrary.ts`: Practice Interviews topics, interview guides, and YouTube videos. Videos marked `fromCourse: true` are unlisted Aced course lessons and stay hidden (filtered out in `src/components/resources/PracticeInterviews.tsx`). Mark `startHere: true` to feature a video first.
-   **Feedback:** All feedback goes to `public.user_feedback`, and admins review it at `/admin/feedback`. Signed in users use `FeedbackModal`. The Resources page has an anonymous 1 to 5 rating card (`ResourcesFeedback.tsx`, `type = 'rating'`, with `rating` and `page` columns). RLS lets anyone insert ratings but only admins read them.
-   **Animations:** `AnimatedSection` becomes visible only once 10% of it is in view. Don't wrap very tall content in it, or that content never appears.
-   **Changelog:** Record notable changes in `CHANGELOG.md`.
-   **SEO & Custom Domains:** Set `VITE_SITE_URL` for sitemap generation and proper Open Graph URL indexing. Pre-build scripts automatically update `sitemap.xml` and `robots.txt` based on available application routes.
