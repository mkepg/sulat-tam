# API Reference

Every route below is a standalone PHP script under `backend/` — there is no
router or framework, so the path on disk *is* the URL path. This document
was written by reading each of the 28 files directly (method checks,
parameter reads, and `json_encode` calls), not from any design doc.

- **Base URL:** `VITE_API_URL` in the frontend (`http://localhost:8080` in
  the default Docker Compose stack — see `docker-compose.yml`). All paths
  below are relative to it, e.g. `{BASE_URL}/auths/login.php`.
- **Authentication:** a JWT in a `token` httpOnly cookie, set by
  `auths/login.php` and read by every protected endpoint. The frontend must
  send `credentials: 'include'` (axios: `withCredentials: true`) on every
  request for the browser to attach it; there is no `Authorization` header
  fallback anywhere in this codebase. Every protected endpoint decodes the
  cookie with HS256 against the same `JWT_SECRET`-derived key
  (`backend/config/config.php`) and returns `401` if it's missing, invalid,
  or expired.
- **Shared error shape:** `{"error": "<message>"}`, with an appropriate HTTP
  status code (`400`, `401`, `403`, `404`, `405`, `409`, `500`) set via
  `http_response_code()` before the body. The one exception is
  `auths/verify.php`, which responds with an HTML page instead of JSON,
  since it is opened directly from an emailed link.
- **CORS:** every endpoint (except `admin/admin.php` and `auths/verify.php`,
  neither of which is called via `fetch`/`axios`) echoes
  `Access-Control-Allow-Origin` back only when the request's `Origin` header
  matches an entry in `ALLOWED_ORIGINS` (comma-separated env var), and
  answers `OPTIONS` preflights with a bare `200`.
- **Auth column legend:**
  - **Shared gate** — the endpoint does `include '../checkToken.php'`.
  - **Inline** — the endpoint decodes the JWT itself
    (`JWT::decode($_COOKIE['token'], ...)` in a `try`/`catch`) to get
    `$decoded->user_id` in its own scope.
  - **None** — no cookie or token is checked.
  - **Session (admin)** — a separate mechanism: a native PHP session set by
    a login form on the same page, gated on `users.is_admin = 1`. It does
    not read the `token` cookie at all.

## Auth (`backend/auths/`)

| Path | Method | Auth | Parameters | Response |
|---|---|---|---|---|
| `auths/register.php` | POST | None | form body: `username`, `email`, `password` | `201 {"message": "..."}` on success (sends a verification email via PHPMailer/MailHog). `400 {"error": "..."}` for missing fields, non-lowercase-alphanumeric username, or a weak password (needs 8+ chars, upper, lower, digit, symbol). `409 {"error": "..."}` if a *verified* user already owns the username/email (an *unverified* collision is silently deleted and replaced). `500 {"error": "..."}` on DB insert failure or if the verification email fails to send. |
| `auths/login.php` | POST | None (this issues the token) | form body: `email`, `password` | `200 {"user": {id, user_profile_url, username, bio, email}, "message": "..."}` and sets the `token` cookie (HS256 JWT, 7-day expiry, httpOnly, `Secure`/`SameSite` from `config/config.php`). `400 {"error": "..."}` missing credentials. `401 {"error": "Email or Password is incorrect"}`. `403 {"error": "Please verify your email before logging in."}` if `is_verified` is 0. |
| `auths/verify.php` | GET | None | query string: `token` | Not JSON. Returns an HTML page that runs `alert(...); window.close();` — "Invalid verification link" if `token` is empty, "Invalid or expired token" if no user matches, otherwise sets `is_verified = 1`, clears `verification_token`, and shows a success alert. |
| `auths/logout.php` | POST | None (no cookie check — always succeeds) | none | `200 {"message": "Logged out successfully"}`, re-sets `token` to an empty string with the same cookie flags. `405 {"error": "Invalid request method"}` for non-POST. |

## Reads (`backend/gets/`)

| Path | Method | Auth | Parameters | Response |
|---|---|---|---|---|
| `gets/global_articles.php` | GET | None | query: `limit` (default 10), `page` (default 1) | `200 {"articles": [{id, username, userProfileImageUrl, postDate, title, about, favorites, slug}, ...]}` — all articles, newest first. `500 {"error": "..."}` on query failure. |
| `gets/global_articles_count.php` | GET | None | none | `200 {"count": N}` — total row count of `articles`. `500 {"error": "..."}`. |
| `gets/popular_tags.php` | GET | None | none | `200 [{"id", "name", "count"}, ...]` — **a bare JSON array**, not wrapped in an object like every other list endpoint. Top 20 tags by usage, `LIMIT 20` is hardcoded. `500 {"error": "..."}`. |
| `gets/feed_articles.php` | GET | Inline | query: `limit` (default 8), `page` (default 1) | `200 {"articles": [...]}` — articles authored by users the caller follows (`JOIN follows ON followee_id = author_id`), newest first. Same article shape as `global_articles.php`. `401`/`500 {"error": "..."}`. |
| `gets/feed_articles_count.php` | GET | Inline | none | `200 {"count": N}` — count of articles from followed authors. |
| `gets/current_user_articles.php` | GET | Inline | query: `limit` (default 10), `page` (default 1) | `200 {"articles": [...]}` — the caller's own articles. |
| `gets/current_user_articles_count.php` | GET | Inline | none | `200 {"count": N}`. |
| `gets/current_user_info.php` | GET | Inline | none | `200 {"user": {user_id, user_profile_url, username, bio, email}}` for the caller. `404 {"error": "User not found"}`. `401 {"error": "..."}` on bad/missing token. |
| `gets/favorite_articles.php` | GET | Inline | query: `limit` (default 8), `page` (default 1) | `200 {"articles": [...]}` — articles the caller has favorited. |
| `gets/favorite_articles_count.php` | GET | Inline | none | `200 {"count": N}` — caller's favorite count. |
| `gets/favorite_status.php` | GET | Inline | query: `article_id` (numeric, required) | `200 {"favorited": bool, "favoritesCount": N}` for that article and the caller. `400 {"error": "Invalid article_id"}`. |
| `gets/follow_status.php` | GET | Inline | query: `followee_id` (numeric, required, must differ from caller) | `200 {"following": bool, "followersCount": N}`. `400 {"error": "Invalid followee_id"}`. |
| `gets/articles_by_tag.php` | GET | Shared gate | query: `tag` (numeric tag id, required), `limit` (default 10), `page` (default 1) | `200 {"articles": [...]}` — articles carrying that tag. `400 {"error": "Valid tag ID is required"}`. |
| `gets/articles_by_tag_count.php` | GET | Shared gate | query: `tag` (numeric, required) | `200 {"count": N}`. |
| `gets/public_user_info.php` | GET | Shared gate | query: `username` (required) | `200 {"user": {user_id, user_profile_url, username, bio, email}}` for the named user, despite the "public" name this still requires a valid `token` cookie. `400 {"error": "Missing username"}`. `404 {"error": "User not found"}`. |
| `gets/public_user_articles.php` | GET | Shared gate | query: `username` (required), `limit` (default 10), `page` (default 1) | `200 {"articles": [...], "count": N}` — the named user's articles. Also requires a valid cookie despite the name. `400 {"error": "Missing username"}`. |
| `gets/public_favorite_articles.php` | GET | Shared gate | query: `username` (required), `limit` (default 10), `page` (default 1) | `200 {"articles": [...], "count": N}` — articles the named user has favorited. Also requires a valid cookie despite the name. |
| `gets/public_view_article.php` | GET | Shared gate (plus an extra explicit cookie-presence check before the include) | query: `username`, `slug` (both required) | `200 {"article": {id, title, about, content, slug, postDate, tags: [...]}, "author": {id, username, userProfileImageUrl}, "comments": [{id, body, date, username, userProfileImageUrl}, ...]}`. `400 {"error": "Username and slug are required"}`. `404 {"error": "Article not found"}`. |

## Writes (`backend/posts/`)

| Path | Method | Auth | Parameters | Response |
|---|---|---|---|---|
| `posts/create_article.php` | POST | Inline | URL-encoded body (parsed via `parse_str` regardless of header): `title`, `description`, `body`, `tags` (whitespace-separated tag names, created if new) | `201 {"message": "Article created successfully."}`. Writes directly into `articles` + `article_tags` — **not** into the `pending_articles` moderation queue (see `ARCHITECTURE.md`). Auto-generates a unique `slug` from the title, scoped per author. `400 {"error": "Missing required fields"}`. `500 {"error": "Failed to create article"}`. |
| `posts/comment.php` | POST | Inline | JSON body: `article_id`, `body` | `200 {"comments": [{id, body, date, username, userProfileImageUrl}, ...]}` — the full, newly-updated comment list for that article (not just the new comment). `400 {"error": "Missing article ID or comment body"}`. `500 {"error": "Failed to post comment"}`. |

## Updates (`backend/updates/`)

| Path | Method | Auth | Parameters | Response |
|---|---|---|---|---|
| `updates/favorites.php` | POST | Inline | JSON body: `article_id` | Toggles: `200 {"message": "Article favorited"/"Article unfavorited", "favorited": bool, "favoritesCount": N}`. `400 {"error": "Invalid or missing article_id"}`. |
| `updates/follows.php` | POST | Inline | JSON body: `followee_id` | Toggles: `200 {"message": "User followed"/"User unfollowed", "following": bool, "followersCount": N}`. `400 {"error": "Invalid followee_id"}` (also rejects following oneself). |
| `updates/user_info.php` | POST | Inline | multipart/form-data: `username`, `email`, `bio` (optional), `password` (optional, re-hashed if present), `image` (optional file, uploaded to ImgBB and stored as `user_profile_url`) | `200 {"user": {id, user_profile_url, username, bio, email}, "message": "..."}`. `400 {"error": "Missing required fields"}` or `{"error": "Username must be lowercase and alphanumeric only."}`. `409 {"error": "Username or email already in use"}`. |

## Admin (`backend/admin/`)

| Path | Method | Auth | Parameters | Response |
|---|---|---|---|---|
| `admin/admin.php` | GET / POST | Session (admin) | Login POST: `email`, `password`, `login`. Action POST: `action` (`approve`\|`reject`), `pending_article_id`. Logout: `?logout=1` (GET). | Not a JSON API — a server-rendered HTML admin panel, not called from the React app. Unauthenticated `GET`/`POST` renders a login form gated on `users.email` + `password_verify()` + `is_admin = 1`. Once authenticated, lists all `pending_articles` and lets the admin **approve** (copies the row and its tags into `articles`/`article_tags`, then deletes the pending rows) or **reject** (deletes the pending rows) each one, redirecting back to `admin.php` after every POST. |
