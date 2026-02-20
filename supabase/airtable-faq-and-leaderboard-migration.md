# Airtable → Supabase Migration (FAQ & Leaderboard)

This document complements `supabase/airtable-migration-plan.md` and covers migrating the remaining Airtable-backed data (**FAQ** and **Leaderboard**) into Supabase.

## 1. Current state

- **FAQ**:
  - Read at runtime via the `/api/airtable/faq` endpoint and the Vite `airtableApiPlugin` in development.
  - Consumed in the frontend by `HackathonFAQPage`.
- **Leaderboard**:
  - Read and written via `/api/airtable/leaderboard` (GET top scores, POST new scores).
  - Used exclusively by `GamePage` for the quiz leaderboard.
- Supabase now has native tables:
  - `public.faq_items`
  - `public.leaderboard_scores`
  - A helper function `public.upsert_leaderboard_score(email, name, score)` to safely upsert scores.

## 2. Export from Airtable

1. In Airtable, open the same base currently used for FAQ and Leaderboard.
2. For the **FAQ** table:
   - Export the table as CSV.
   - Include at least: `Question` / `question`, `Answer` / `answer`, and any ordering field (`ID`, `Number`, `Order`, `#`, etc.).
3. For the **Leaderboard** table:
   - Export as CSV.
   - Include: `name`, `email`, `score`, and (optionally) `createdTime`.

## 3. Import into Supabase

### FAQ → `public.faq_items`

1. In the Supabase dashboard, go to **Table editor** → `faq_items`.
2. Use **Import data** and upload the FAQ CSV.
3. Map Airtable columns to:
   - `Question` / `question` → `question`
   - `Answer` / `answer` → `answer`
   - Ordering field (`ID`, `Number`, `Order`, `#`) → `sort_order`
4. For all imported rows set:
   - `is_public = true` (unless you intentionally want some hidden from the public page).

### Leaderboard → `public.leaderboard_scores`

1. In **Table editor**, open `leaderboard_scores`.
2. Import the leaderboard CSV.
3. Map Airtable columns to:
   - `name` → `name`
   - `email` → `email` (this will be lowercased by the upsert function on future writes)
   - `score` → `score`
   - `createdTime` (optional) → `created_at` (or leave `created_at` as default for new rows).
4. Ensure there is at most one row per email address; if there are duplicates, resolve them during or after import so the unique constraint on `email` can be enforced cleanly.

## 4. Frontend changes

Once the data is imported and verified:

1. Update `HackathonFAQPage` to:
   - Query `supabase.from("faq_items")` with `eq("is_public", true)` and `order("sort_order")`.
   - Render questions/answers from Supabase instead of `/api/airtable/faq`.
2. Update `GamePage` to:
   - Read leaderboard data from `supabase.from("leaderboard_scores")` sorted by `score DESC`, limited to top 5.
   - Submit new scores via `supabase.rpc("upsert_leaderboard_score", { p_email, p_name, p_score })`.

## 5. Cleanup

After the FAQ and leaderboard pages are confirmed to be reading/writing from Supabase:

1. Remove the FAQ and leaderboard branches of the Airtable Vite plugin.
2. Delete the `/api/airtable/faq` and `/api/airtable/leaderboard` API routes.
3. Remove any remaining Airtable-related env vars and documentation once all Airtable-backed features have been migrated.

