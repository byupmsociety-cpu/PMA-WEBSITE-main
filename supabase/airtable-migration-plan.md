# Airtable → Supabase Migration Plan (Events & Team Members)

This document outlines how to migrate PMA website data currently stored in Airtable into Supabase.

## 1. Current state

- **Events**:
  - Read at runtime via the Vite `airtableApiPlugin` and the `/api/airtable/events` endpoint.
  - Consumed in the frontend via the `useEvents` hook.
- **Team members**:
  - Fetched from the `/api/airtable/team` route.
  - Used to render the public team page.
- Supabase now has native tables:
  - `public.events`
  - `public.team_members`
  - Admin UI exists to manage both tables.

## 2. Export from Airtable

1. In Airtable, open the base used by the Vite plugin.
2. For the **Events** table:
   - Export as CSV.
   - Make sure you include: title, date/time fields, description, location, status/visibility, registration link.
3. For the **Team** table:
   - Export as CSV.
   - Include: name, position, bio, image URL, any ordering/ID field.

## 3. Import into Supabase

1. In the Supabase dashboard, go to **Table editor**.
2. For `public.events`:
   - Use the **Import data** option and upload the events CSV.
   - Map Airtable columns to:
     - `title` → `title`
     - start date/time → `start_time`
     - end date/time (if any) → `end_time`
     - `description` → `description`
     - `location` → `location`
     - registration link → `registration_link`
     - visibility (if present) → `is_public` (true/false)
3. For `public.team_members`:
   - Import the team CSV into `team_members`.
   - Map columns:
     - name → `name`
     - position → `position`
     - bio → `bio`
     - image URL → `image_url`
     - any ordering/ID field → `priority`

## 4. Frontend changes for events

1. Create a new hook (for example `useSupabaseEvents`) that:
   - Reads from `supabase.from("events")` with `select("*")` and appropriate ordering.
   - Filters by `is_public = true` for public pages.
2. Update `EventsPage` to:
   - Use `useSupabaseEvents` instead of `useEvents`.
   - Keep `useEvents` temporarily only if you want a dual-source comparison.
3. Once tested, remove:
   - The Airtable-specific `useEvents` hook.
   - The `/api/airtable/events` route usage.

## 5. Frontend changes for team members

1. Create a new hook or data loader for `team_members`:
   - Query `supabase.from("team_members")` ordered by `priority`, then `name`.
2. Update `TeamPage` to use Supabase data instead of the Airtable endpoint.
3. Once confirmed working, stop using the `/api/airtable/team` route.

## 6. Cleanup

After both pages are reading from Supabase and the admin UI is in active use:

1. Remove the `events` and `team` branches of the Airtable Vite plugin if no other code paths depend on them.
2. Remove any unused environment variables related to Airtable (keeping them only if the leaderboard still uses Airtable).
3. Optionally, mark Airtable tables as read-only/archive them for historical reference.

## 7. Rollout strategy

- **Staging first**:
  - Run imports and frontend changes against a Supabase dev project.
  - Verify admin dashboard flows (create/update/delete events and team members).
  - Compare Supabase-backed pages visually with Airtable-backed ones.
- **Production**:
  - Import fresh CSVs from Airtable into the production Supabase project.
  - Deploy the build that reads from Supabase.
  - Keep Airtable as a temporary backup for a short period, then retire it for these resources.

