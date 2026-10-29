# Changelog

Notable changes to the BYU PMA website. Newest first.

## 2026-10-29

### Added
- **Practice Interviews** section on the Resources page, right under the APM Playbook. Has 55 public videos from Aced (formerly Exponent) in 8 topics, with "Start here" picks first.
- **Interview guides** for six round types (Product Sense, Product Strategy, Analytical and Execution, Estimation, Leadership and Drive, Technical). Each covers what the round tests, where it shows up, how to approach it, what works, and what hurts. Written by PMA from public information.
- The APM Playbook's Interviews step links to Practice Interviews.
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
