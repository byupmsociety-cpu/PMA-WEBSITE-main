# Changelog

Notable changes to the BYU PMA website. Newest first.

## 2026-11-13

### Changed
- **Paid member access** synced from the BYU Clubs export (35 paid; 2 new emails added to the approved list).
- **Auth emails** now go through Resend (`noreply@danielwait.com`, up to 100 an hour) instead of Supabase's built-in mailer (about 2 an hour). Auth `site_url` is now `https://product.byu.edu` and it's an allowed redirect.

### Added
- `docs/paid-member-sync.md`: how to sync paid members, announce access and manage the auth email setup.

## 2026-11-11

### Added
- **Case interview page** at `/events/case-interview` for Case Interview: Build the Fix with AI. A heading, short intro, Nate's note about the event and a "Start the case" button to the case site (https://pma-case-competition.vercel.app/case), which has the full brief and instructions. Linked from the top of the Events page. `/case-competition` redirects to it.
- **Homepage banner** under the navigation linking to the case interview page for tonight's activity. Remove after the event.

## 2026-11-10

### Added
- **Case interview submissions** at `/submit`: teams from Case Interview: Build the Fix with AI submit their team name, members, track, problem and a link to their work. No sign in needed. Entries go to the `case_submissions` table, which only admins can read (view them in the Supabase table editor).

## 2026-10-29

### Added
- **Practice Interviews** section on the Resources page, right under the APM Playbook. Has 55 public videos from Aced (formerly Exponent) in 8 topics, with "Start here" picks first.
- **Interview guides** for six round types (Product Sense, Product Strategy, Analytical and Execution, Estimation, Leadership and Drive, Technical). Each covers what the round tests, where it shows up, how to approach it, what works, and what hurts. Written by PMA from public information.
- The APM Playbook's Interviews step links to Practice Interviews.
- **Portfolio Factory** (BYU IS Careers' portfolio website guide) added to Build with AI and linked from the APM Playbook's Experience step.
- **Resources feedback card** at the bottom of Resources: a 1 to 5 rating plus an optional "How can we be more helpful?" comment. Visitors don't need to sign in. Officers see responses at `/admin/feedback`.

### Changed
- The "Mock Interview Videos" category is gone. Its five videos now live in Practice Interviews.
- `user_feedback` now accepts anonymous `rating` entries and records the `page` they came from (migration `20261029120000_feedback_ratings`).

### Notes
- 44 unlisted videos from the Aced PM course are recorded in `src/lib/videoLibrary.ts` (`fromCourse: true`). They're hidden from the site on purpose.

## 2026-10-26

### Changed
- Moved to a new Supabase project (`eekhwyjcivruiqmtdeeq`). Public content, images, and the approved member list were copied over. Member accounts and private data from the old project could not be migrated, so members sign up again.

## 2026-10-09

### Added
- The APM Playbook on the Resources page, built from Nathan McCauley's workshop deck.
- Curated member resources: 5 categories, each resource with tips. Content lives in `src/lib/resources.ts`.

## 2026-10-05

### Added
- Live event Q&A page at `/events/ask` with a Slido QR code, linked from the events page.
