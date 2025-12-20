CREATE TYPE difficulty_level AS ENUM ('easy','medium','hard');
CREATE TYPE user_role AS ENUM ('coach','admin');
CREATE TYPE surface_type AS ENUM ('grass','artificial','hybrid','indoor');
CREATE TYPE drill_item_type AS ENUM 
    ('player', 'cone', 'ball', 'goal', 'arrow', 'run', 'zone', 'pass', 'shot', 'dribble');


CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'coach',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    permissions JSONB DEFAULT '{}'
);

CREATE TABLE fields (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surface surface_type NOT NULL,
    width INTEGER NOT NULL CHECK (width > 0),
    height INTEGER NOT NULL CHECK (height > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE drills (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER CHECK (duration_minutes > 0),
    difficulty difficulty_level NOT NULL,
    popularity INTEGER NOT NULL DEFAULT 0,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    field_id BIGINT REFERENCES fields(id) ON DELETE SET NULL,
    created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE drill_items (
    id BIGSERIAL PRIMARY KEY,
    drill_id BIGINT NOT NULL REFERENCES drills(id) ON DELETE CASCADE,
    type drill_item_type NOT NULL,
    x NUMERIC(5,2) NOT NULL CHECK (x >= 0 AND x <= 100),
    y NUMERIC(5,2) NOT NULL CHECK (y >= 0 AND y <= 100),
    rotation NUMERIC(6,2),
    color VARCHAR(50),
    label VARCHAR(255),
    team_color VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sessions (
    id BIGSERIAL PRIMARY KEY,
    coach_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    field_id BIGINT REFERENCES fields(id),
    title VARCHAR(255) NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    total_duration INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE session_drills (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    drill_id BIGINT NOT NULL REFERENCES drills(id) ON DELETE CASCADE,
    order_number INTEGER NOT NULL CHECK (order_number > 0),
    duration_override INTEGER CHECK (duration_override > 0),
    UNIQUE (session_id, order_number),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE equipment (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE drill_equipment (
    id BIGSERIAL PRIMARY KEY,
    drill_id BIGINT NOT NULL REFERENCES drills(id) ON DELETE CASCADE,
    equipment_id BIGINT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity >= 1),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE drill_tags (
    drill_id BIGINT REFERENCES drills(id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (drill_id, tag_id)
);


CREATE INDEX idx_drills_category ON drills(category_id);
CREATE INDEX idx_drills_creator ON drills(created_by);
CREATE INDEX idx_drill_items_drill ON drill_items(drill_id);
CREATE INDEX idx_sessions_coßach ON sessions(coach_id);
CREATE INDEX idx_session_drills_session ON session_drills(session_id);