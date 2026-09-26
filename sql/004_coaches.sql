CREATE TABLE IF NOT EXISTS coaches (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    notes TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_by BIGINT NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_coaches_created_by
    ON coaches(created_by);

CREATE INDEX IF NOT EXISTS idx_coaches_active
    ON coaches(active);

ALTER TABLE pitches
    ADD COLUMN IF NOT EXISTS coach_id BIGINT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'pitches_coach_id_fkey'
    ) THEN
        ALTER TABLE pitches
            ADD CONSTRAINT pitches_coach_id_fkey
            FOREIGN KEY (coach_id)
            REFERENCES coaches(id)
            ON DELETE SET NULL;
    END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_pitches_coach_id
    ON pitches(coach_id);