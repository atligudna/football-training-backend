CREATE TABLE IF NOT EXISTS training_attendance (
    training_story_id UUID NOT NULL
        REFERENCES training_stories(id)
        ON DELETE CASCADE,

    player_id BIGINT NOT NULL
        REFERENCES players(id)
        ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL
        DEFAULT 'unknown',

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW(),

    PRIMARY KEY (
        training_story_id,
        player_id
    ),

    CONSTRAINT training_attendance_status_check
        CHECK (
            status IN (
                'unknown',
                'attending',
                'absent',
                'injured'
            )
        )
);

CREATE INDEX IF NOT EXISTS idx_training_attendance_player_id
    ON training_attendance(player_id);

CREATE INDEX IF NOT EXISTS idx_training_attendance_story_status
    ON training_attendance(
        training_story_id,
        status
    );
