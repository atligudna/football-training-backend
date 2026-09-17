-- 003_players_groups.sql
-- Feature #052
-- Players, groups, group membership and Training Story group linking.

-- =========================================================
-- Players
-- =========================================================

CREATE TABLE IF NOT EXISTS players (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_year INTEGER,
    position VARCHAR(50),
    notes TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT players_birth_year_check
        CHECK (
            birth_year IS NULL
            OR birth_year BETWEEN 1900 AND 2100
        )
);

CREATE INDEX IF NOT EXISTS idx_players_created_by
    ON players(created_by);

CREATE INDEX IF NOT EXISTS idx_players_active
    ON players(active);


-- =========================================================
-- Groups
-- =========================================================

CREATE TABLE IF NOT EXISTS groups (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age_group VARCHAR(50),
    description TEXT,
    created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_groups_created_by
    ON groups(created_by);


-- =========================================================
-- Group ↔ Players
-- =========================================================

CREATE TABLE IF NOT EXISTS group_players (
    group_id BIGINT NOT NULL
        REFERENCES groups(id) ON DELETE CASCADE,

    player_id BIGINT NOT NULL
        REFERENCES players(id) ON DELETE CASCADE,

    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (group_id, player_id)
);

CREATE INDEX IF NOT EXISTS idx_group_players_player_id
    ON group_players(player_id);


-- =========================================================
-- Pitch ↔ Group
-- =========================================================

ALTER TABLE pitches
    ADD COLUMN IF NOT EXISTS group_id BIGINT;


-- PostgreSQL does not support
-- ADD CONSTRAINT IF NOT EXISTS,
-- so check pg_constraint first.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'pitches_group_id_fkey'
    ) THEN
        ALTER TABLE pitches
            ADD CONSTRAINT pitches_group_id_fkey
            FOREIGN KEY (group_id)
            REFERENCES groups(id)
            ON DELETE SET NULL;
    END IF;
END
$$;


CREATE INDEX IF NOT EXISTS idx_pitches_group_id
    ON pitches(group_id);