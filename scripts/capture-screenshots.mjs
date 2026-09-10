/**
 * Captures README screenshots from the running Docker stack.
 *
 * Prerequisite: `docker compose up -d`, a healthy `web` service (Vite
 * "ready" in `docker compose logs web`), and a passing `verify-auth.mjs`.
 * Run: node scripts/capture-screenshots.mjs
 *
 * Route notes (frontend/src/App.tsx, frontend/src/main.tsx):
 *  - The app uses react-router's <HashRouter>, so real routes live in the
 *    URL hash (`#/login`), not `location.pathname`. Every navigation target
 *    and every "which page am I on" check below reads `.hash`.
 *  - Only `/` and `/login` are reachable signed out (RequireAuth guards
 *    everything else, including the article page). Capture order is:
 *    signed-out signin -> log in -> homepage -> article -> editor -> profile.
 *  - `/login` is wrapped in <RedirectIfAuth>, which reads `isTokenMissing`
 *    from UserInfoProvider. That state initializes to `false` (not yet
 *    known) before the provider's mount-time auth check resolves, so a
 *    fresh, signed-out load of `#/login` renders one render-time redirect
 *    to `#/` and then bounces back to `#/login` once the auth check fails
 *    and calls navigate('/login'). We wait for the hash to settle on
 *    `#/login` rather than assuming the first paint is the final one.
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const WEB = 'http://localhost:5173'
const OUT = 'docs/screenshots'
const EMAIL = 'demo@sulattam.local'
const PASSWORD = 'DemoPass123!'

await mkdir(OUT, { recursive: true })

function hashOf(page) {
  return new URL(page.url()).hash
}

// Same launch configuration as scripts/verify-auth.mjs (Chrome for Testing
// via the "chromium" channel, provisioned by `npx playwright install
// chromium`), so both scripts depend on the same browser build.
const browser = await chromium.launch({ channel: 'chromium' })
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2, // Retina-quality PNGs read far better in a README.
})
const page = await context.newPage()

/** Navigate to a hash route and wait for the hash to settle there. */
async function gotoHash(hashPath) {
  await page.goto(`${WEB}/#${hashPath}`, { waitUntil: 'networkidle' })
  await page
    .waitForFunction((expected) => location.hash === expected, `#${hashPath}`, { timeout: 5000 })
    .catch(() => {})
  const actual = hashOf(page)
  if (actual !== `#${hashPath}`) {
    throw new Error(`expected hash #${hashPath} but landed on ${actual} (${page.url()})`)
  }
}

async function shot(name, hashPath, { full = false } = {}) {
  await gotoHash(hashPath)
  await page.waitForTimeout(1200) // let fonts, images, and async data settle
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full })
  console.log(`captured ${name}.png (hash=${hashOf(page)})`)
}

// --- Signed-out view first: only / and /login are reachable signed out. ---
await shot('signin', '/login')

// --- Authenticate for the rest, reusing verify-auth.mjs's approach. ---
await gotoHash('/login')
await page.locator('input[type="email"]').fill(EMAIL)
await page.locator('input[type="password"]').fill(PASSWORD)
await page.getByRole('button', { name: /sign in/i }).click()
await page.waitForFunction((loginHash) => location.hash !== loginHash, '#/login', { timeout: 5000 })
console.log(`signed in (hash=${hashOf(page)})`)

await shot('homepage', '/')

// Open the first article from the homepage rather than guessing a slug.
// ArticleCard.tsx has no <a href> for the article link — the whole content
// block is a <div onClick={...navigate(...)}> — so click the visible "Read
// more..." text rather than searching for an anchor.
await gotoHash('/')
await page.waitForTimeout(1000)
await page.getByText('Read more...').first().click()
await page
  .waitForFunction(() => location.hash.startsWith('#/article/'), { timeout: 5000 })
  .catch(() => {})
if (!hashOf(page).startsWith('#/article/')) {
  throw new Error(`expected to land on an #/article/ route, got ${hashOf(page)} (${page.url()})`)
}
await page.waitForTimeout(1200)
await page.screenshot({ path: `${OUT}/article.png`, fullPage: true })
console.log(`captured article.png (hash=${hashOf(page)})`)

await shot('editor', '/editor')
await shot('profile', '/my-profile')

await browser.close()
console.log('\nAll screenshots captured.')
