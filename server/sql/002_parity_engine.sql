-- Phase parité React/serveur, séparée de la sauvegarde historique expérimentale.
-- Exécuter après 001_initial.sql. Une seule source d'état par personnage v2.
BEGIN;
CREATE TABLE IF NOT EXISTS parity_characters (
  account_id uuid PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
  state jsonb NOT NULL CHECK (jsonb_typeof(state) = 'object'),
  revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS parity_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES parity_characters(account_id) ON DELETE CASCADE,
  revision bigint NOT NULL,
  event_type text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(account_id,revision)
);
COMMIT;