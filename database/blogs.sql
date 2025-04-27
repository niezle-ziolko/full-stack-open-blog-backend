CREATE TABLE IF NOT EXISTS blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES ('Dan Abramov', 'https://overreacted.io/', 'On let vs const');
INSERT INTO blogs (author, url, title) VALUES ('Laurenz Albe', 'https://www.cybertec-postgresql.com/en/', 'Gaps in sequences in PostgreSQL');