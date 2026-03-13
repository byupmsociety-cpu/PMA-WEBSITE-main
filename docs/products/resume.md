## Resume Review

### Overview

The Resume Review feature allows PMA members to upload a resume for feedback, and enables PMA admins and superadmins to review, approve, or reject submissions. Resumes are stored in a Supabase storage bucket (`resumes`), while review metadata (owner, status, reviewer, feedback) is stored in the `asset_reviews` table with row‑level security (RLS) enforcing access rules.

### User Roles and Permissions

- **Member**
  - Can upload resumes for review via the `/resumes` page.
  - Can see only their own submissions and their current review status.
  - Can delete their own **pending** submissions.

- **Admin**
  - Can see **all** resume submissions from all members on `/admin/resumes`.
  - Can review any resume (approve or reject) and leave feedback.

- **Superadmin**
  - Has the same capabilities as Admin for this feature.
  - Can see **all** resume submissions from all members on `/admin/resumes`.
  - Can review any resume (approve or reject) and leave feedback.

### Data Model

- **Table: `asset_reviews`**
  - `id`: UUID, primary key.
  - `user_id`: UUID, owner of the resume (foreign key to `profiles.user_id`).
  - `file_url`: Public URL to the uploaded resume file in the `resumes` bucket.
  - `file_name`: Original filename for display.
  - `status`: `pending | approved | rejected` (default `pending`).
  - `feedback`: Optional text feedback from the reviewer.
  - `reviewer_id`: UUID of the reviewing admin/superadmin (`profiles.user_id`).
  - `created_at` / `updated_at`: Timestamps managed by Supabase triggers.

### Key Flows

- **Member Upload**
  - Member selects a resume file on `/resumes`.
  - File is uploaded to the `resumes` storage bucket under a user‑scoped path.
  - A new row is inserted into `asset_reviews` with:
    - `user_id = auth.uid()`
    - `status = 'pending'`
    - `file_url` and `file_name` populated from the upload result.
  - The member sees their submission in their personal list, filtered by `user_id`.

- **Admin / Superadmin Review**
  - Admins and superadmins visit `/admin/resumes`.
  - The page queries `asset_reviews` (with a join to `profiles`) **without** filtering by `user_id`; visibility is controlled entirely by RLS.
  - When an admin/superadmin reviews a resume, they can:
    - Set `status` to `approved` or `rejected`.
    - Optionally provide `feedback`.
    - Their `user_id` is stored in `reviewer_id`.

### RLS and Access Control

RLS on `asset_reviews` ensures:

- **Members**
  - `SELECT`: Can only see their own rows (`auth.uid() = user_id`).
  - `INSERT`: Can only insert rows for themselves (`auth.uid() = user_id`).
  - `DELETE`: Can only delete their own **pending** rows.

- **Admins and Superadmins**
  - `SELECT`: Can see all reviews when their profile role is `admin` or `super-admin`.
  - `UPDATE`: Can update any review when their profile role is `admin` or `super-admin`.

This is implemented via policies that check `profiles.role IN ('admin', 'super-admin')` for the current `auth.uid()`.

### Bug Fix: Superadmins Could Not See All Resumes

- **Original Issue**
  - The RLS policies on `asset_reviews` intended to give both admins and superadmins full visibility used:
    - `profiles.role IN ('admin', 'super_admin')`
  - The rest of the system (and the `profiles` table constraint) uses the hyphenated form:
    - `role IN ('super-admin','admin','user','guest')`
  - As a result, users with role `super-admin` did **not** satisfy the `asset_reviews` “admin” policies:
    - Regular admins could see and review all resumes.
    - Superadmins could only see resumes they personally submitted (via the “Users can view their own reviews” policy).

- **Change Implemented**
  - Added migration `20260313000001_fix_asset_reviews_rls.sql` to:
    - Drop the existing policies:
      - `Admins can view all reviews`
      - `Admins can update reviews`
    - Recreate them with corrected role checks:
      - `profiles.role IN ('admin', 'super-admin')`

- **Impact**
  - **Admins**: No behavioral change; they already had full visibility and can still review all resumes.
  - **Superadmins**:
    - Now see **all** resume submissions on `/admin/resumes`, including those submitted by other users.
    - Can review and update any `asset_reviews` row.
  - **Members**: No change; they still see only their own submissions.

### Testing and Verification

After applying the migration:

- Log in as a **member**:
  - Upload a resume on `/resumes`.
  - Confirm it appears in their own list and is not visible when logged out.

- Log in as an **admin**:
  - Navigate to `/admin/resumes`.
  - Confirm all member submissions, including the new one, are visible and reviewable.

- Log in as a **superadmin**:
  - Navigate to `/admin/resumes`.
  - Confirm the same full list of resumes is visible and that any resume can be approved/rejected.

