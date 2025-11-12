-- db/schema.sql
-- Create core tables and indexes for Members Only

BEGIN;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id              BIGSERIAL PRIMARY KEY,
  username        TEXT NOT NULL,
  password_hash   TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT 'notMember',  -- 'member' or 'notMember'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Case-insensitive uniqueness for usernames
-- (avoids needing the citext extension)
CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_key
  ON users ((LOWER(username)));

-- POSTS (aka messages)'
CREATE TABLE IF NOT EXISTS posts (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body        TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 5000),
  is_private  BOOLEAN NOT NULL DEFAULT TRUE,  -- members-only by default
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



-- Helpful index for profile pages / feeds
CREATE INDEX IF NOT EXISTS posts_user_created_idx
  ON posts (user_id, created_at DESC);


COMMIT;
