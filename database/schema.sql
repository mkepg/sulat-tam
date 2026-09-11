DROP TABLE IF EXISTS article_tags;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS follows;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS pending_articles;
DROP TABLE IF EXISTS pending_article_tags;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    -- Served locally from frontend/public/avatars/ rather than hot-linked from
    -- an external image host, where one outage would blank every default
    -- avatar at once.
    user_profile_url VARCHAR(255) NOT NULL DEFAULT '/avatars/default.svg',
    username VARCHAR(50) NOT NULL UNIQUE,
    bio TEXT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT 0,
    is_admin BOOLEAN NOT NULL DEFAULT 0,
    verification_token VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE articles (
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(50) NOT NULL,
    about VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (author_id, slug),
    FOREIGN KEY (author_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE favorites (
    user_id INT NOT NULL,
    article_id INT NOT NULL,
    favorited_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, article_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(article_id)
        ON DELETE CASCADE
);

CREATE TABLE tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE article_tags (
    article_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES articles(article_id)
        ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
        ON DELETE CASCADE
);

CREATE TABLE follows (
    follower_id INT NOT NULL,
    followee_id INT NOT NULL,
    followed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, followee_id),
    FOREIGN KEY (follower_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY (followee_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    user_id INT NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(article_id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE pending_articles (
    pending_article_id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(50) NOT NULL,
    about VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE pending_article_tags (
    pending_article_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (pending_article_id, tag_id),
    FOREIGN KEY (pending_article_id) REFERENCES pending_articles(pending_article_id)
        ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
        ON DELETE CASCADE
);
