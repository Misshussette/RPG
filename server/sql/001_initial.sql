-- Première infrastructure serveur, non destinée à la production sans audit.
BEGIN;
CREATE TABLE IF NOT EXISTS accounts (
 id uuid PRIMARY KEY,
 email text NOT NULL UNIQUE,
 password_salt text NOT NULL,
 password_hash text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash text PRIMARY KEY,
 account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_account ON sessions(account_id);
CREATE TABLE IF NOT EXISTS characters (
 account_id uuid PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
 state jsonb NOT NULL,
 revision bigint NOT NULL DEFAULT 0,
 last_attack_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS game_events (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 account_id uuid NOT NULL REFERENCES accounts(id),
 event_type text NOT NULL,
 details jsonb NOT NULL DEFAULT '{}'::jsonb,
 occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS game_events_account_time ON game_events(account_id, occurred_at DESC);
CREATE TABLE IF NOT EXISTS security_alerts (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 account_id uuid NOT NULL REFERENCES accounts(id),
 code text NOT NULL,
 severity text NOT NULL CHECK(severity IN ('info','warning','critical')),
 details jsonb NOT NULL DEFAULT '{}'::jsonb,
 created_at timestamptz NOT NULL DEFAULT now(),
 reviewed_at timestamptz
);
COMMIT;
