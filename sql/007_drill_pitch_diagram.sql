ALTER TABLE drills
ADD COLUMN IF NOT EXISTS pitch_diagram_id UUID;

ALTER TABLE drills
DROP CONSTRAINT IF EXISTS drills_pitch_diagram_id_fkey;

ALTER TABLE drills
ADD CONSTRAINT drills_pitch_diagram_id_fkey
FOREIGN KEY (pitch_diagram_id)
REFERENCES pitch_diagrams(id)
ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS
    idx_drills_pitch_diagram_id
ON drills(pitch_diagram_id);