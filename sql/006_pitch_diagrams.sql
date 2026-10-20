CREATE TABLE IF NOT EXISTS pitch_diagrams (
    id UUID PRIMARY KEY,

    title VARCHAR(150) NOT NULL,

    orientation VARCHAR(20) NOT NULL
        DEFAULT 'landscape',

    objects JSONB NOT NULL
        DEFAULT '[]'::jsonb,

    created_by INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    is_deleted BOOLEAN NOT NULL
        DEFAULT FALSE,

    CONSTRAINT pitch_diagrams_orientation_check
        CHECK (
            orientation IN (
                'landscape',
                'portrait'
            )
        ),

    CONSTRAINT pitch_diagrams_objects_array_check
        CHECK (
            jsonb_typeof(objects) = 'array'
        )
);

CREATE INDEX IF NOT EXISTS
    idx_pitch_diagrams_created_by
ON pitch_diagrams(created_by);

CREATE INDEX IF NOT EXISTS
    idx_pitch_diagrams_updated_at
ON pitch_diagrams(updated_at DESC);