-- Demo content for SulatTam.
--
-- The mysql client that the official MySQL image uses to run files under
-- docker-entrypoint-initdb.d/ does not otherwise know this file is UTF-8, so
-- non-ASCII punctuation below (em dashes) would be read as Latin-1 and
-- re-encoded on insert, corrupting into mojibake (e.g. "—" -> "â€"") even
-- though the database itself is utf8mb4. Setting the session charset here
-- fixes that at import time.
SET NAMES utf8mb4;

-- Demo login (used by the README, the Task 7 screenshot script, and the
-- Task 6 auth-gate verification): demo@sulattam.local / DemoPass123!
-- Every seeded user shares this same password so one credential opens any
-- account. The hash below is a real bcrypt hash produced by:
--   docker compose exec -T api php -r 'echo password_hash("DemoPass123!", PASSWORD_DEFAULT), "\n";'

-- =========================================================================
-- Users (5) — first user is the demo admin account.
-- =========================================================================
-- Distinct avatars per user, served from frontend/public/avatars/. Users who
-- register without uploading one fall back to the schema default, which is
-- also served locally.
INSERT INTO users (username, user_profile_url, bio, email, password, is_verified, is_admin) VALUES
('demo', '/avatars/demo.svg', 'Ang opisyal na demo account ng SulatTam. Ginagamit ko ito para subukan ang bawat feature — mula sa pag-post hanggang sa comments — bago ito makarating sa totoong users.', 'demo@sulattam.local', '$2y$10$qu4vqjYPosIxZO6H9khnsuyYPnigP5BnFvItfeAKxARQsdCm5n7Se', 1, 1),
('maria_santos', '/avatars/maria_santos.svg', 'Full-stack developer mula Cebu. Mahilig magsulat tungkol sa PHP, MySQL, at kung paano ko natutunan ang web development nang autodidacta.', 'maria@sulattam.local', '$2y$10$qu4vqjYPosIxZO6H9khnsuyYPnigP5BnFvItfeAKxARQsdCm5n7Se', 1, 0),
('juan_delacruz', '/avatars/juan_delacruz.svg', 'Manunulat at dating guro ng Filipino sa hayskul. Naniniwala akong ang bawat kwento, kahit maikli, ay may dalang aral.', 'juan@sulattam.local', '$2y$10$qu4vqjYPosIxZO6H9khnsuyYPnigP5BnFvItfeAKxARQsdCm5n7Se', 1, 0),
('liza_reyes', '/avatars/liza_reyes.svg', 'UI/UX designer na lumipat mula sa print design papuntang digital. Mahilig mag-share ng design principles na applicable kahit sa developers.', 'liza@sulattam.local', '$2y$10$qu4vqjYPosIxZO6H9khnsuyYPnigP5BnFvItfeAKxARQsdCm5n7Se', 1, 0),
('carlo_mendoza', '/avatars/carlo_mendoza.svg', 'Freelance web developer, gumagawa ng React frontends at PHP backends para sa mga small business sa Pilipinas.', 'carlo@sulattam.local', '$2y$10$qu4vqjYPosIxZO6H9khnsuyYPnigP5BnFvItfeAKxARQsdCm5n7Se', 1, 0);

-- =========================================================================
-- Articles (10) — 2 per author. user_id 1..5 map to article_id 1..10 below,
-- in insertion order (demo, demo, maria, maria, juan, juan, liza, liza,
-- carlo, carlo).
-- =========================================================================
INSERT INTO articles (author_id, title, about, slug, content) VALUES
(1, 'Bakit Ako Sumulat sa SulatTam', 'Kwento kung bakit ko pinili ang SulatTam bilang tahanan ng aking mga sanaysay.', 'bakit-ako-sumulat-sa-sulattam',
'## Bakit Ako Sumulat sa SulatTam

Matagal ko nang pinapangarap na magkaroon ng sariling espasyo online kung saan pwede akong magsulat sa **sariling wika**. Hindi ito tungkol sa pagiging perpekto — mas tungkol ito sa *pagsisimula*.

### Ang Layunin

Gusto kong gawin ang SulatTam na:

- Isang lugar para sa mga Pilipinong manunulat, baguhan man o beterano
- Espasyo kung saan pwedeng magsanay magsulat nang regular
- Komunidad na nagbibigay ng puna at suporta sa bawat isa

Narito ang simpleng checklist na ginagamit ko bago mag-publish:

```text
1. Basahin muli ang draft
2. Tanggalin ang mga hindi kailangang salita
3. Siguraduhing malinaw ang mensahe
4. I-publish at ibahagi
```

Sa huli, ang pagsusulat ay hindi tungkol sa bilang ng mambabasa. Ito ay tungkol sa **pagpapahayag** ng sarili nang tapat.'),

(1, 'Paano Gumawa ng React App', 'Isang step-by-step gabay para sa mga baguhan na gustong bumuo ng kauna-unahang React app.', 'paano-gumawa-ng-react-app',
'## Paano Gumawa ng React App

Kung baguhan ka pa lang sa **React**, ito ang unang hakbang na dapat mong malaman. Gagamitin natin ang Vite bilang build tool dahil mas mabilis ito kumpara sa mga lumang setup.

### Unang Hakbang

Buksan ang terminal at i-type ang mga sumusunod:

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

### Basic na Component

Ganito ang hitsura ng isang simpleng component:

```jsx
function Greeting() {
  return <h1>Kumusta, SulatTam!</h1>;
}

export default Greeting;
```

Mga bagay na dapat tandaan habang natututo:

- Gamitin ang *functional components* sa halip na class components
- Intindihin muna ang **props** bago tumuloy sa state
- Huwag matakot gumawa ng mali — bahagi ito ng proseso ng pagkatuto

Sa susunod na artikulo, tatalakayin natin kung paano ikonekta ang React frontend sa isang PHP backend.'),

(2, 'Getting Started with PHP 8.2', 'A beginner-friendly walkthrough of what is new in PHP 8.2 and why it matters for your next project.', 'getting-started-with-php-8-2',
'## Getting Started with PHP 8.2

PHP 8.2 brought several improvements that make backend development faster and safer. Here is a quick tour of what changed and why it matters.

### Readonly Classes

One of the most useful additions is **readonly classes**, which prevent properties from being modified after construction:

```php
readonly class Article {
    public function __construct(
        public string $title,
        public string $slug
    ) {}
}
```

### Why Upgrade?

A few reasons to move your project forward:

- Better performance compared to PHP 7.x and early 8.x releases
- Stricter typing catches bugs *before* they reach production
- Deprecation notices help you clean up legacy code early

Upgrading is not always trivial, but the long-term benefits for **maintainability** are worth the effort. Start with a staging environment, run your test suite, and fix warnings one at a time.'),

(2, 'MySQL Tips Para sa Baguhan', 'Mga praktikal na tip sa MySQL para sa mga estudyanteng kakapasok pa lang sa database design.', 'mysql-tips-para-sa-baguhan',
'## MySQL Tips Para sa Baguhan

Marami akong estudyanteng tinuturuan na natatakot sa databases. Normal lang iyon — pero may ilang simpleng tip na makakatulong sa inyo.

### Gamitin ang Tamang Data Type

Huwag gamitin ang `VARCHAR(255)` para sa lahat. Halimbawa:

```sql
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    age TINYINT UNSIGNED
);
```

### Mga Dapat Tandaan

- Laging maglagay ng **PRIMARY KEY** sa bawat table
- Gamitin ang `INDEX` para mabilis ang mga query sa malalaking table
- Iwasan ang `SELECT *` sa production code — tukuyin ang mga column na kailangan

Ang MySQL ay hindi kailangang maging kakila-kilabot. Sa paulit-ulit na pagsasanay, magiging *pangalawang wika* niyo na rin ito.'),

(3, 'Ang Sining ng Pagsusulat', 'Isang pagninilay tungkol sa sining ng pagsusulat at kung paano ito nagbabago ng pananaw.', 'ang-sining-ng-pagsusulat',
'## Ang Sining ng Pagsusulat

Hindi biro ang magsulat. Bawat pangungusap ay desisyon — anong salita ang gagamitin, saan ilalagay ang bantas, kailan dapat tumigil.

### Tatlong Simpleng Prinsipyo

Sa loob ng maraming taon bilang guro, ito ang natutunan kong pinaka-importante:

- **Linawin muna ang ideya** bago pa man simulan ang pagsulat
- Magsulat nang *tapat*, hindi para lang makuha ang pabor ng iba
- I-edit nang walang awa — ang unang draft ay hindi kailangang maging perpekto

Narito ang simpleng proseso na ginagamit ko:

```text
Draft -> Basahin nang malakas -> I-edit -> Ipabasa sa iba -> Huling ayos
```

Ang pagsusulat, tulad ng anumang kasanayan, ay natututunan lamang sa **paggawa nito nang paulit-ulit**. Walang shortcut. Magsimula ka lang, kahit hindi perpekto ang unang pagtatangka.'),

(3, '5 Aral sa Buhay Estudyante', 'Limang aral na natutunan ko bilang estudyante — mula sa oras hanggang sa mga pagkakamali.', '5-aral-sa-buhay-estudyante',
'## 5 Aral sa Buhay Estudyante

Bilang dating guro, marami akong estudyanteng nakasama. Narito ang limang aral na paulit-ulit kong nakikita sa mga matagumpay na estudyante.

### Ang Limang Aral

- **Pamahalaan ang oras**, huwag hayaang ito ang mamahala sa iyo
- Magtanong kapag hindi naiintindihan — walang tanong na *tanga*
- Ang pagkakamali ay bahagi ng pagkatuto, hindi dapat ikahiya
- Gumawa ng grupo ng magkakaibigan na tumutulong magbasa
- Huwag kalimutang **magpahinga** — hindi lahat ng oras dapat puro pag-aaral

Simpleng gabay sa paghahati ng linggo:

```text
Lunes-Biyernes: klase + 2 oras pag-aaral
Sabado: proyekto o pagbabasa
Linggo: pahinga
```

### Sa Huli

Ang buhay estudyante ay hindi lang tungkol sa marka. Mahalaga rin ang proseso ng paglaki bilang tao.'),

(4, 'UI Design Principles for Devs', 'Practical UI design principles na dapat malaman ng bawat developer, kahit hindi designer.', 'ui-design-principles-for-devs',
'## UI Design Principles for Devs

You do not need to be a designer to build interfaces that feel *good*. A few core principles go a long way.

### Spacing and Hierarchy

Consistent spacing communicates structure before the user reads a single word. Use a scale instead of random pixel values:

```css
:root {
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 32px;
}
```

### Quick Checklist

- Keep **contrast** high enough for text to stay readable
- Group related elements with whitespace, not borders
- Limit yourself to *two* font sizes per section when possible

Good design is rarely about adding more. It is usually about removing what does not need to be there.'),

(4, 'Bakit Mahalaga ang Good Design', 'Kwento tungkol sa kahalagahan ng magandang disenyo sa karanasan ng user.', 'bakit-mahalaga-ang-good-design',
'## Bakit Mahalaga ang Good Design

Madalas isipin ng mga developer na ang disenyo ay trabaho lang ng designer. Pero ang totoo, bahagi ito ng **karanasan ng user** sa buong produkto.

### Epekto ng Disenyo

Isang maayos na disenyo ang:

- Nagpapabilis sa user na maintindihan kung paano gamitin ang app
- Nagbibigay ng *tiwala* sa brand o produkto
- Nagpapababa ng bounce rate dahil komportable gamitin

Halimbawa, ito ang simpleng color palette na madalas kong ginagamit:

```css
--color-primary: #2563eb;
--color-text: #1f2937;
--color-bg: #f9fafb;
```

Sa huli, ang **magandang disenyo** ay hindi luho — ito ay pangangailangan, lalo na sa panahong marami nang pagpipilian ang users.'),

(5, 'React + PHP: Full Stack Guide', 'A practical guide to combining a React frontend with a PHP backend into one cohesive app.', 'react-php-full-stack-guide',
'## React + PHP: Full Stack Guide

Combining a React frontend with a PHP backend is a common pattern for small to medium projects, and it does not require any exotic tooling.

### The Basic Flow

1. React sends a request to a PHP endpoint
2. PHP talks to MySQL and returns JSON
3. React updates the UI with the response

A minimal PHP endpoint looks like this:

```php
header("Content-Type: application/json");
echo json_encode(["status" => "ok"]);
```

And the matching fetch call on the frontend:

```js
const res = await fetch("http://localhost:8080/gets/articles.php");
const data = await res.json();
```

### Things to Watch For

- Set **CORS headers** correctly or the browser will block the request
- Keep API responses *consistent* in shape, even for errors
- Use environment variables for URLs instead of hardcoding them

Once the basic loop works, everything else — auth, pagination, uploads — builds on the same foundation.'),

(5, 'Mga Common Mistakes sa MySQL', 'Mga karaniwang pagkakamali sa MySQL na dapat iwasan ng mga baguhang developer.', 'mga-common-mistakes-sa-mysql',
'## Mga Common Mistakes sa MySQL

Sa mga proyektong nagawa ko, paulit-ulit kong nakikita ang parehong mga pagkakamali sa database design. Narito ang pinaka-karaniwan.

### Mga Dapat Iwasan

- Paggamit ng `TEXT` para sa mga column na dapat sana ay `VARCHAR`
- Kakulangan ng **foreign keys**, kaya nawawala ang data integrity
- Hindi paggamit ng *indexes* sa mga column na madalas hanapin
- Pag-iimbak ng password nang plain text sa halip na naka-hash

Halimbawa ng maayos na foreign key constraint:

```sql
ALTER TABLE comments
  ADD CONSTRAINT fk_comments_article
  FOREIGN KEY (article_id) REFERENCES articles(article_id)
  ON DELETE CASCADE;
```

Maliit na mga bagay ang mga ito, pero malaki ang epekto sa **performance at seguridad** ng aplikasyon sa mahabang panahon.');

-- =========================================================================
-- Tags (8) — tag_id 1..8 in this order:
-- filipino, webdev, react, php, writing, design, mysql, students
-- =========================================================================
INSERT INTO tags (name) VALUES
('filipino'),
('webdev'),
('react'),
('php'),
('writing'),
('design'),
('mysql'),
('students');

-- =========================================================================
-- Article-tag links, weighted so popular_tags.php shows a clear ordering:
-- webdev(7) > filipino(6) > writing(3) = design(3) > mysql(2) = php(2)
--   = react(2) = students(2)
-- =========================================================================
INSERT INTO article_tags (article_id, tag_id) VALUES
-- Article 1: Bakit Ako Sumulat sa SulatTam -> filipino, writing
(1, 1), (1, 5),
-- Article 2: Paano Gumawa ng React App -> react, webdev, design
(2, 3), (2, 2), (2, 6),
-- Article 3: Getting Started with PHP 8.2 -> php, webdev
(3, 4), (3, 2),
-- Article 4: MySQL Tips Para sa Baguhan -> mysql, webdev, students, filipino
(4, 7), (4, 2), (4, 8), (4, 1),
-- Article 5: Ang Sining ng Pagsusulat -> writing, filipino
(5, 5), (5, 1),
-- Article 6: 5 Aral sa Buhay Estudyante -> students, writing, filipino
(6, 8), (6, 5), (6, 1),
-- Article 7: UI Design Principles for Devs -> design, webdev
(7, 6), (7, 2),
-- Article 8: Bakit Mahalaga ang Good Design -> design, filipino, webdev
(8, 6), (8, 1), (8, 2),
-- Article 9: React + PHP: Full Stack Guide -> react, php, webdev
(9, 3), (9, 4), (9, 2),
-- Article 10: Mga Common Mistakes sa MySQL -> mysql, webdev, filipino
(10, 7), (10, 2), (10, 1);

-- =========================================================================
-- Comments (16) — always from a user other than the article's author.
-- user_id 1=demo, 2=maria, 3=juan, 4=liza, 5=carlo
-- =========================================================================
INSERT INTO comments (article_id, user_id, body) VALUES
(1, 2, 'Ang ganda ng simulang ito! Sana marami pang sumunod na magsusulat dito.'),
(1, 3, 'Totoo, kailangan talaga ng ganitong espasyo para sa mga Pilipinong manunulat.'),
(2, 4, 'Malinaw na paliwanag, kahit hindi ako developer nagets ko agad.'),
(3, 1, 'Great summary. The readonly classes example is very clear.'),
(3, 5, 'I upgraded last month and readonly properties saved me from a few bugs already.'),
(4, 3, 'Bilang hindi tech person, madali ko itong naintindihan. Salamat!'),
(5, 2, 'Kailangan ko talaga marinig ito ngayon. Salamat sa paalala.'),
(5, 4, 'Ang editing part talaga ang pinakamahirap para sa akin.'),
(6, 1, 'Number 4 ang pinaka-nararapat sa akin ngayon. Salamat sa artikulo.'),
(7, 3, 'As someone outside tech, this made design principles easy to understand.'),
(7, 5, 'The spacing scale tip alone improved my last project a lot.'),
(8, 2, 'Sang-ayon ako, madalas nakakalimutan ng mga developer ang bahaging ito.'),
(9, 1, 'This is exactly the kind of guide I needed when I started.'),
(9, 4, 'CORS errors used to confuse me so much before reading something like this.'),
(10, 2, 'Guilty ako sa ilan dito, lalo na sa indexes. Aayusin ko na.'),
(10, 3, 'Malaking tulong ito para sa mga baguhan tulad ko.');

-- =========================================================================
-- Favorites (12) — never the article's own author.
-- =========================================================================
INSERT INTO favorites (user_id, article_id) VALUES
(2, 1), (3, 1),
(4, 2), (5, 2),
(1, 3), (3, 3),
(4, 4),
(5, 5),
(1, 6),
(1, 7),
(2, 9),
(3, 10);

-- =========================================================================
-- Follows (8) — mix of demo following others and others following demo.
-- =========================================================================
INSERT INTO follows (follower_id, followee_id) VALUES
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(3, 1),
(4, 5),
(5, 2),
(2, 4);
