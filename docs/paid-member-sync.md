# Paid Member Sync

How to give paid PMA members access to `/resources` after dues come in, and how the signup emails are set up. First done on 2026-11-13.

## How access works

- `approved_pma_members` holds the BYU emails allowed to be members (`default_role`, `is_disabled`).
- When someone signs up, the `handle_new_user` trigger checks that table and gives them `member` (or `admin`) instead of `guest`.
- Existing accounts are not rechecked automatically. The sync below updates them too.
- Paid means the "Dues Expiration Date" is in the future, or the row has an Officer title. The logic lives in `src/lib/rosterSync.ts`.
- People not in the file, admins, blocked and deleted accounts are never changed.

## Option A: admin panel (easiest)

1. In BYU Clubs, export the PMA member list. You get a file like `Product Management Association -11-13-2026.xls`.
2. Sign in as an admin and go to `/admin/access`.
3. Upload the `.xls` as is. Review the preview (adds, re-enables, disables, upgrades, downgrades), then apply.

## Option B: from the terminal (what Claude did)

Use this when nobody wants to click through the admin panel. Needs the Supabase CLI linked to project `eekhwyjcivruiqmtdeeq`.

1. Parse the export with the project's `xlsx` package using the same rules as `rosterSync.ts`. Keep `@byu.edu` emails only and produce `(email, name, paid)` rows.
2. Preview the changes with a read-only query. Put the rows in a `values` list:

   ```sql
   with r(email, name, paid) as (values ('someone@byu.edu', 'Some One', true) /* , ... */),
   a as (select r.*, l.id lid, l.is_disabled from r left join approved_pma_members l on lower(l.email) = r.email),
   p as (select r.*, pr.role from r join profiles pr on lower(pr.email) = r.email
         where coalesce(pr.is_blocked, false) = false and pr.deleted_at is null)
   select 'list_add' kind, email, name from a where paid and lid is null
   union all select 'list_enable', email, name from a where paid and is_disabled
   union all select 'list_disable', email, name from a where not paid and lid is not null and not is_disabled
   union all select 'acct_upgrade', email, name from p where paid and role = 'guest'
   union all select 'acct_downgrade', email, name from p where not paid and role = 'member';
   ```

   ```sh
   supabase db query --remote --read-only -f plan.sql
   ```

3. Apply only what the preview lists, for example:

   ```sh
   supabase db query --remote --yes "insert into approved_pma_members (email, default_role) values ('someone@byu.edu', 'member');"
   ```

   Upgrades set `role`, `is_pma_member = true` and `membership_verified_at = now()` on `profiles`. Downgrades set `role = 'guest'` and `is_pma_member = false`.
4. Run the preview again. It should return no rows.

The Supabase MCP server does not have access to this project. Use the CLI.

## Announcing it to members

Send from Outlook (BYU mail is on Microsoft), with every paid member on BCC. Most paid members won't have an account yet, so the email has to tell them to sign up, not just sign in. Template used on 2026-11-13:

> Hey! Thanks for paying your PMA dues. You now have access to the member resource page, which has a ton of resources to help you recruit, practice for interviews, etc.
>
> If you already have an account, sign in at https://product.byu.edu/resources. If not, create one there with your BYU email and click the confirmation link we send you.
>
> Heads up: that confirmation email will come from noreply@danielwait.com (my personal domain while we get a BYU one set up). It is legit and should work great. Check your spam folder if you do not see it.
>
> Reach out to me with any questions.

On a Mac, `open -a "Microsoft Outlook" "mailto:?bcc=a@byu.edu,b@byu.edu&subject=...&body=..."` opens a ready draft (URL-encode the subject and body).

## Auth email setup

Signups need email confirmation, so every new member triggers an email. Supabase's built-in mailer only allows about 2 emails an hour, which breaks a bulk announcement. On 2026-11-13 auth was changed to:

| Setting | Value |
|---|---|
| `site_url` | `https://product.byu.edu` |
| `additional_redirect_urls` | `https://product.byu.edu/**`, `https://pma-website-bay.vercel.app/**`, `http://localhost:8080/**`, `http://localhost:5173/**` |
| SMTP | Resend: `smtp.resend.com`, port 465, user `resend`, password = Resend API key |
| Sender | `BYU Product Management Association <noreply@danielwait.com>` |
| `rate_limit.email_sent` | 100 per hour |

The Resend API key is not stored in this repo. Ask Daniel for it.

To change these, pull the live config into a scratch folder (not this repo's `supabase/config.toml`), edit it, check the diff, then push:

```sh
supabase config pull --workdir <scratch>
RESEND_API_KEY=... supabase config diff --workdir <scratch>
RESEND_API_KEY=... supabase config push --workdir <scratch> --yes
```

with the SMTP block written as:

```toml
[auth.email.smtp]
enabled = true
host = "smtp.resend.com"
port = 465
user = "resend"
pass = "env(RESEND_API_KEY)"
admin_email = "noreply@danielwait.com"
sender_name = "BYU Product Management Association"

[auth.rate_limit]
email_sent = 100
```

## When signup emails break

**Symptoms:** new members get "Error sending confirmation email" when they sign up, or never get the confirmation email. Members who already have accounts can still sign in with their password. Only new signups and password resets break.

**Common causes:**
- The Resend API key was deleted, revoked or rotated.
- The sending domain (`danielwait.com`, later `product.byu.edu`) lost its verification in Resend, for example DNS records were removed.
- The Resend account hit its plan's sending limit.
- Too many signups in one hour (over `email_sent`, currently 100).

**Find the cause:**
1. Resend dashboard, **Emails**: see whether the email was sent and what happened to it (delivered, bounced, or never got there).
2. Resend dashboard, **Domains**: the sending domain should say Verified.
3. Supabase dashboard, **Logs**, Auth: look for SMTP or rate limit errors around the failed signup.
4. Send yourself a test password reset email (uses the site's public key from `.env`):

   ```sh
   curl -X POST "https://eekhwyjcivruiqmtdeeq.supabase.co/auth/v1/recover" \
     -H "apikey: $VITE_SUPABASE_PUBLISHABLE_KEY" -H "Content-Type: application/json" \
     -d '{"email":"you@byu.edu"}'
   ```

   If the email arrives, it's fixed.

**Fix a deleted or revoked key:**
1. In Resend, create a new API key with sending access.
2. Put it in Supabase, either way:
   - **Dashboard:** Authentication, Emails, SMTP Settings. Paste the new key as the password and save. Leave everything else as it is.
   - **CLI:** `supabase config pull --workdir <scratch>`, then add the SMTP block above if it's missing (the pull leaves the password out), then `RESEND_API_KEY=<new key> supabase config push --workdir <scratch> --yes`.
3. Send the test email above.

**Fix a lost domain:** re-add the DNS records Resend shows on the domain's page, wait for Verified, then send a test email.

**Emergency fallback:** turn off custom SMTP (Authentication, Emails, SMTP Settings, disable). Supabase goes back to its built-in mailer. That works right away but only sends about 2 emails an hour. Do not turn off email confirmation to get around this, because then anyone could sign up with a paid member's email and get their access.

## Pending: send from product.byu.edu

`product.byu.edu` was added to Resend on 2026-11-13 but is not verified. BYU runs DNS for byu.edu, so BYU IT has to add these records:

| Type | Name | Value | Priority |
|---|---|---|---|
| TXT | `resend._domainkey.product.byu.edu` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7RQoVJWr9FMd0VcnpDX83PW1kDdWIv9qOrrvTwt4i0iSrDbQAZsHjpcvq+Dy7vH4ezWOL0JdQtSPjqgv4Fh1Qh2hSAOLq4aGUJHAZpfnQtzvXqwO9tvF8VD8vQ1A6ME0sanu8ahMevkrC2ejBVDO8Uj1Qth9Me1zS98IsgsIVBQIDAQAB` | |
| MX | `send.product.byu.edu` | `feedback-smtp.us-east-1.amazonses.com` | 10 |
| TXT | `send.product.byu.edu` | `v=spf1 include:amazonses.com ~all` | |
| CNAME | `rsend.product.byu.edu` | `send.forge.rmta.net` | |

Once Resend shows the domain as verified, change `admin_email` to `noreply@product.byu.edu` and push the config again.
