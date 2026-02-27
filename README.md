# BYU PMA Website


## How can I edit this code?

There are several ways of editing your application.

**Edit Repo**

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Supabase Setup**

Events, team, FAQ, and leaderboard data come from Supabase. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to `.env`, then run `npm run dev`. The app connects directly to Supabase using the Supabase client library.

**Admin / Super-admin bootstrap**

The admin dashboard (`/admin`) and super-admin features (Users & Roles at `/admin/users`) require users with `admin` or `super-admin` roles. The migration `20260227000001_seed_super_admin.sql` creates a default super-admin account:

- **Email:** byupmsociety@gmail.com
- **Password:** superadminPM123

This account bypasses the @byu.edu signup restriction since it is created directly in the database. To promote additional super-admins, run in Supabase SQL Editor:

```sql
UPDATE public.profiles SET role = 'super-admin' WHERE email = 'your-email@byu.edu';
```

**Production / custom domain (SEO)**

For a custom domain, set `VITE_SITE_URL` (e.g. `https://your-domain.com`) in your build environment. It is used for per-route Open Graph URLs and for the sitemap. Running `npm run build` generates `public/sitemap.xml` and updates `public/robots.txt` with the correct Sitemap URL.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## This project is deployed on Vercel

