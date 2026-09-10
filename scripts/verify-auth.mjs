/**
 * End-to-end auth gate.
 *
 * Drives a real browser rather than curl, because the failure mode under test
 * is browser cookie policy — curl stores any cookie it is given and would
 * report a false pass. Login can return HTTP 200 with a valid payload while
 * the browser silently discards the Set-Cookie header, leaving every
 * following request 401 and the app merely *looking* broken.
 *
 * Run: node scripts/verify-auth.mjs
 */
import { chromium } from 'playwright'

const WEB = 'http://localhost:5173'
const API = 'http://localhost:8080'
const LOGIN_PATH = '/login'
const EMAIL = 'demo@sulattam.local'
const PASSWORD = 'DemoPass123!'

// `channel: 'chromium'` pins this to the full Chrome-for-Testing build
// (installed via the root `postinstall` script's `playwright install
// chromium`, which fetches that same "chromium" channel — not Playwright's
// separate default headless-shell build) rather than Playwright's default
// headless shell target.
let browser
try {
  browser = await chromium.launch({ channel: 'chromium' })
} catch (err) {
  if (/Executable doesn't exist/.test(err.message)) {
    console.error(
      '\nFAIL: Playwright\'s Chromium build is not installed.\n' +
      'Run `npm install` (which provisions it via the `postinstall` script), ' +
      'or `npx playwright install chromium` directly, then re-run `npm run verify:auth`.'
    )
  } else {
    console.error(`\nFAIL: could not launch the browser: ${err.message}`)
  }
  process.exit(1)
}
const context = await browser.newContext()
const page = await context.newPage()

const failures = []

try {
  await page.goto(`${WEB}${LOGIN_PATH}`, { waitUntil: 'networkidle' })

  await page.locator('input[type="email"]').fill(EMAIL)
  await page.locator('input[type="password"]').fill(PASSWORD)
  await page.getByRole('button', { name: /sign in/i }).click()

  // main.tsx wraps the app in react-router's <HashRouter>, so the route
  // lives in the URL *hash* (`#/login`), not `location.pathname` — the
  // pathname never changes on client-side navigation. SignIn.tsx navigates
  // to `/` ~1.2s after a successful login (see the setTimeout in
  // frontend/src/pages/SignIn.tsx). Wait for that hash change rather than a
  // fixed sleep, but don't hang forever if login failed and the app never
  // leaves #/login.
  await page
    .waitForURL((url) => url.hash !== `#${LOGIN_PATH}`, { timeout: 5000 })
    .catch(() => {})

  const cookies = await context.cookies()
  const token = cookies.find((c) => c.name === 'token')

  if (!token) {
    failures.push(
      'FAIL: no `token` cookie was stored. The browser rejected it — ' +
      'check COOKIE_SECURE / COOKIE_SAMESITE in docker-compose.yml.'
    )
  } else {
    console.log(`PASS: token cookie stored (httpOnly=${token.httpOnly}, sameSite=${token.sameSite})`)
  }

  // /login is wrapped in <RedirectIfAuth>, so a genuinely successful login
  // navigates away from it. With HashRouter the route lives in the hash, so
  // that is what must be checked (not a substring match against a URL
  // fragment that never appears on this site, and not `pathname`, which
  // HashRouter never touches). If the cookie was rejected or the request
  // 401ed, the app stays on #/login and this check catches it.
  const finalHash = new URL(page.url()).hash
  if (finalHash === `#${LOGIN_PATH}`) {
    failures.push(`FAIL: still on the login page after submitting (${page.url()})`)
  } else {
    console.log(`PASS: redirected to ${page.url()}`)
  }

  // The decisive check: an authenticated endpoint must succeed with the
  // cookie the browser actually kept (not one curl was handed directly).
  const status = await page.evaluate(async (apiBase) => {
    const res = await fetch(`${apiBase}/gets/current_user_info.php`, {
      credentials: 'include',
    })
    return res.status
  }, API)

  if (status === 200) {
    console.log('PASS: authenticated request returned 200')
  } else {
    failures.push(`FAIL: authenticated request returned ${status} (expected 200)`)
  }
} catch (err) {
  failures.push(`FAIL: ${err.message}`)
} finally {
  await browser.close()
}

if (failures.length > 0) {
  console.error('\n' + failures.join('\n'))
  process.exit(1)
}
console.log('\nAll auth checks passed.')
