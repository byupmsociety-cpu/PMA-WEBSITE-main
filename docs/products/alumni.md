# Current State of the Alumni Hub

Based on a review of the repository, the "Alumni Hub" is not a standalone product or portal but is currently integrated across multiple existing pages and database tables as a set of profile features.

## 1. Database Schema
A recent migration (`20260310000002_alumni_profiles.sql`) added key fields to the `public.profiles` table to support alumni networking:
- `is_alumni` (BOOLEAN): Flags a user as an alumni.
- `open_to_coffee_chats` (BOOLEAN): Indicates willingness to connect.
- `current_company` (TEXT): Allows alumni to list where they currently work.

## 2. Frontend Integration
These profile fields are actively used in several areas of the app:
- **Profile Page (`/profile`):** Users can toggle the "I am a BYU Alumni" checkbox, which saves their `is_alumni` status to their profile.
- **Member Directory (`/members`):**
  - Features an "Alumni Only" filter toggle.
  - Features an "Open to Coffee Chats" filter toggle.
  - Alumni profiles display an active `Alumni` badge, their `current_company`, and an `Open to Coffee Chats` badge if applicable.
- **Jobs Page (`/jobs`):** The jobs board checks if alumni are working at a specific company and displays a message like "X Alumni here" on the job card to encourage networking.
- **Discover/Roadmap (`/discover`):** Suggests alumni connections as action items.

## 3. Potential Focus Areas for Improvement
Since the fundamental data structure (profiles, flags, and company fields) is already in place, improving the Alumni Hub likely means building features that make these connections more actionable and organized.

**Potential Ideas:**
1. **Dedicated Alumni Portal (`/alumni`):** Create a standalone dashboard specific to Alumni networking, separating it from the general student member directory.
2. **Mentorship Program / Coffee Chat Scheduling:** Build a feature that allows students to actively request or schedule coffee chats with alumni marked as `open_to_coffee_chats`.
3. **Alumni Spotlights/Stories:** Add a content section highlighting successful PM alumni to drive engagement.
4. **Enhanced Admin controls:** The admin dashboard mentions "Manage alumni network access and profiles" with a "Soon" tag, this can be fleshed out.
