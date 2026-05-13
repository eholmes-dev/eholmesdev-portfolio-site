import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs/promises';
import path from 'node:path';

const {
  PLURALSIGHT_EMAIL,
  PLURALSIGHT_PASSWORD,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env;

for (const [k, v] of Object.entries({
  PLURALSIGHT_EMAIL,
  PLURALSIGHT_PASSWORD,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
})) {
  if (!v) {
    console.error(`Missing required env var: ${k}`);
    process.exit(1);
  }
}

const CACHE_PATH = path.resolve('cache.json');

async function scrape() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  });
  const page = await context.newPage();

  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(60000);

  try {
    // Login
    await page.goto('https://app.pluralsight.com/id/', { waitUntil: 'domcontentloaded' });
    await page.fill('input[name="Username"], input[type="email"]', PLURALSIGHT_EMAIL);
    await page.fill('input[name="Password"], input[type="password"]', PLURALSIGHT_PASSWORD);
    await page.click('button[type="submit"]');

    // Wait until we leave the /id/ login page (successful auth redirects away)
    await page.waitForURL((url) => !url.pathname.startsWith('/id'), { timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');

    // Land on the home dashboard which shows the "Continue learning" rail
    await page.goto('https://app.pluralsight.com/', { waitUntil: 'domcontentloaded' });
    // Give the SPA time to hydrate the rail (avoid networkidle — analytics never settle)
    await page.waitForTimeout(8000);

    const courses = await page.evaluate(() => {
      const results = [];
      const seen = new Set();

      // Try common card selectors used on the home/continue-learning rail.
      const selectors = [
        '[data-testid*="continue"] a[href*="/courses/"]',
        '[data-testid*="in-progress"] a[href*="/courses/"]',
        'section:has(h2:matches("(?i)continue|in progress")) a[href*="/courses/"]',
        'a[href*="/course-player"]',
        'a[href*="/library/courses/"]',
      ];

      for (const sel of selectors) {
        let nodes = [];
        try {
          nodes = Array.from(document.querySelectorAll(sel));
        } catch {
          continue;
        }
        for (const n of nodes) {
          const title =
            n.getAttribute('aria-label')?.trim() ||
            n.querySelector('h3,h4,[class*="title" i]')?.textContent?.trim() ||
            n.textContent?.trim();
          if (title && title.length > 2 && !seen.has(title)) {
            seen.add(title);
            results.push({ title });
          }
        }
        if (results.length >= 3) break;
      }

      return results.slice(0, 3);
    });

    if (!courses.length) {
      throw new Error(
        'No in-progress courses found. Pluralsight markup may have changed; update selectors in scrape.mjs.'
      );
    }

    const enriched = courses.map((c, i) => ({
      title: c.title,
      position: i + 1,
      last_accessed_at: new Date().toISOString(),
    }));

    await fs.writeFile(
      CACHE_PATH,
      JSON.stringify({ scrapedAt: new Date().toISOString(), courses: enriched }, null, 2)
    );

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Replace top 3 rows.
    const { error: delErr } = await supabase
      .from('pluralsight_courses')
      .delete()
      .gte('position', 1);
    if (delErr) throw delErr;

    const { error: insErr } = await supabase
      .from('pluralsight_courses')
      .insert(enriched);
    if (insErr) throw insErr;

    console.log('Updated courses:', enriched);
  } finally {
    await browser.close();
  }
}

scrape().catch((err) => {
  console.error(err);
  process.exit(1);
});
