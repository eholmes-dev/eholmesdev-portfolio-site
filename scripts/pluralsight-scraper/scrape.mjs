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
const DEBUG_DIR = path.resolve('debug');
const DEBUG_LOG_PATH = path.join(DEBUG_DIR, 'run.log');

async function logDebug(message) {
  const line = `[${new Date().toISOString()}] ${message}`;
  console.log(line);
  await fs.appendFile(DEBUG_LOG_PATH, `${line}\n`);
}

async function scrape() {
  await fs.mkdir(DEBUG_DIR, { recursive: true });
  await fs.writeFile(DEBUG_LOG_PATH, '');

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
    await logDebug('Browser launched successfully');
    await logDebug('Attempting to navigate to Pluralsight login page...');
    await logDebug('Opening Pluralsight login page');
    await page.goto('https://app.pluralsight.com/id/', { waitUntil: 'domcontentloaded' });
    
    await logDebug('Filling email field');
    await page.fill('input[name="Username"], input[type="email"]', PLURALSIGHT_EMAIL);
    
    await logDebug('Filling password field');
    await page.fill('input[name="Password"], input[type="password"]', PLURALSIGHT_PASSWORD);
    
    await logDebug(`Login page loaded at ${page.url()}`);
    
    // Use waitForNavigation instead of waitForLoadState to handle redirect
    await logDebug('Clicking submit button');
    await Promise.allSettled([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 20000 }),
      page.click('button[type="submit"]'),
    ]);

    await logDebug(`Post-submit URL: ${page.url()}`);
    await page.waitForTimeout(3000);

    // Land on the home dashboard which shows the "Continue learning" rail
    await logDebug('Opening Pluralsight home dashboard');
    await page.goto('https://app.pluralsight.com/', { waitUntil: 'domcontentloaded' });
    await logDebug(`Dashboard URL: ${page.url()}`);
    
    if (page.url().includes('/id')) {
      throw new Error(`Login did not complete; still on authentication flow at ${page.url()}`);
    }

    // Give the SPA time to hydrate the rail (avoid networkidle — analytics never settle)
    await logDebug('Waiting for page to stabilize');
    await page.waitForTimeout(5000);

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

    await logDebug(`Found ${courses.length} courses`);

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

    await logDebug(`Synced ${enriched.length} courses to Supabase`);
    console.log('Updated courses:', enriched);
  } catch (err) {
    try {
      const screenshotPath = path.join(DEBUG_DIR, 'failure.png');
      const htmlPath = path.join(DEBUG_DIR, 'failure.html');
      const statePath = path.join(DEBUG_DIR, 'failure-state.json');

      await logDebug('Capturing failure diagnostics...');
      await page.screenshot({ path: screenshotPath, fullPage: true });
      await fs.writeFile(htmlPath, await page.content());
      await fs.writeFile(
        statePath,
        JSON.stringify(
          {
            url: page.url(),
            title: await page.title().catch(() => null),
            error: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err,
          },
          null,
          2
        )
      );
      await logDebug(`Saved failure artifacts to ${DEBUG_DIR}`);
    } catch (debugErr) {
      console.error('Failed to capture debug info:', debugErr);
    }
    throw err;
  } finally {
    await browser.close();
  }
}

scrape().catch((err) => {
  console.error(err);
  process.exit(1);
});
