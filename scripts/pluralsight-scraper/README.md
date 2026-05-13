# Pluralsight Scraper

Scheduled GitHub Action that scrapes the top 3 in-progress courses from
Pluralsight every 12 hours and writes them to the `pluralsight_courses`
table in Supabase. The site reads from that table to render the
"Currently Learning" section.

## Required GitHub repository secrets

Add these under **Repo → Settings → Secrets and variables → Actions**:

- `PLURALSIGHT_EMAIL` — your Pluralsight login email
- `PLURALSIGHT_PASSWORD` — your Pluralsight password (no SSO/MFA)
- `SUPABASE_URL` — `https://wtejtydkkregmkxicnyo.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` — service role key from
  Supabase → Project Settings → API. **Never** commit this or expose
  it to the browser.

## Run manually

In GitHub: **Actions → Scrape Pluralsight Currently Learning → Run workflow**.

## Local test

```bash
cd scripts/pluralsight-scraper
npm install
npx playwright install chromium
PLURALSIGHT_EMAIL=... PLURALSIGHT_PASSWORD=... \
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
node scrape.mjs
```

## Selector fragility

Pluralsight's dashboard markup changes occasionally. If a run reports
"No in-progress courses found", update the selectors near the top of
`scrape.mjs`.
