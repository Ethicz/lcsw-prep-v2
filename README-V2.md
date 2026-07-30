# LCSW Exam Prep v2 — setup

v2 = new UI (light/dark, bottom tab bar) + **user accounts** + **cloud progress sync**
backed by Netlify Functions and Netlify DB (Postgres via Neon).

Everything still works offline and logged-out exactly like v1 — accounts are optional
per user. Signing in on a second device pulls progress down and merges it safely.

## One-time deployment (about 10 minutes)

Because v2 has serverless functions, it deploys from a Git repo (not drag-and-drop).

1. **Push this folder to GitHub** (a private repo is fine). It's already a git repo:
   ```
   git remote add origin https://github.com/YOUR-USER/lcsw-prep-v2.git
   git push -u origin main
   ```
2. **Create the Netlify site**: Netlify dashboard → *Add new site* → *Import an existing
   project* → pick the repo. Build settings are read from `netlify.toml` automatically
   (publish `.`, functions bundled with esbuild). Deploy.
3. **Add the database**: on the new site → *Extensions* (or *Integrations*) → enable
   **Netlify DB** → *Add database*. This provisions a Neon Postgres instance and sets
   the `NETLIFY_DATABASE_URL` environment variable automatically. (Unclaimed dev
   databases expire — click **Claim database** to link it to a free Neon account so
   it's permanent.)
4. **Set the auth secret**: Site configuration → Environment variables → add
   `JWT_SECRET` = a long random string (40+ characters — password-manager-generate one).
5. **Redeploy** (Deploys → Trigger deploy) so the functions pick up the env vars.

That's it. Tables are created automatically on first signup. Share the new URL with
the group; each person creates their own account under the Account tab (👤).

## What syncs

The entire progress store: per-question spaced-repetition history, sessions, stars,
notes, trap counts, coach plan, exam date. Sync is automatic (a few seconds after
answering) plus a manual "Sync now" button. Conflicts merge per-question by most
recent, stars/notes union — nothing is overwritten destructively.

## Migrating from v1

On a device with v1 progress: v1 → Stats → **Export progress**, then v2 → Stats →
**Import (replace)**, then sign in — it uploads. (v1 and v2 use the same storage
format.)

## Security notes

- Passwords: bcrypt-hashed (cost 10), never stored or logged in plain text.
- Sessions: 30-day HS256 JWTs signed with `JWT_SECRET`.
- No rate limiting is configured — fine for a private study group; add Netlify's
  rate limiting rules if the URL ever leaks.
- The site keeps `noindex` and should stay unlisted (TDC copyright).

## Local development

`npm i -g netlify-cli`, then `netlify dev` in this folder (link the site when asked)
— it runs functions + DB env locally. The static app alone also works with any
static server (accounts show "sync error" until functions exist).
