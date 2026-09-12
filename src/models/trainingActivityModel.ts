import { db } from "../config/db";

export type TrainingActivityType =
  | "drill"
  | "station"
  | "game"
  | "break"
  | "reflection";

export interface TrainingActivityRow {
  id: string;
  activity_block_id: string;
  title: string;
  type: TrainingActivityType;
  description: string;
  duration_minutes: number;
  notes: string | null;
  order_index: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTrainingActivityInput {
  activityBlockId: string;
  ownerEmail: string;
  title: string;
  type: TrainingActivityType;
  description?: string;
  durationMinutes: number;
  notes?: string | null;
  orderIndex?: number;
}

export interface UpdateTrainingActivityInput {
  id: string;
  ownerEmail: string;
  title: string;
  type: TrainingActivityType;
  description: string;
  durationMinutes: number;
  notes?: string | null;
  orderIndex: number;
}

export async function getActivitiesByActivityBlockId(
  activityBlockId: string,
  ownerEmail: string
): Promise<TrainingActivityRow[]> {
  return db.any<TrainingActivityRow>(
    `
      SELECT
        a.id,
        a.activity_block_id,
        a.title,
        a.type,
        a.description,
        a.duration_minutes,
        a.notes,
        a.order_index,
        a.created_at,
        a.updated_at
      FROM activities a
      JOIN activity_blocks ab
        ON ab.id = a.activity_block_id
      JOIN pitches p
        ON p.id = ab.pitch_id
      JOIN training_stories ts
        ON ts.id = p.training_story_id
      WHERE a.activity_block_id = $1
        AND ts.owner_email = $2
      ORDER BY a.order_index ASC, a.created_at ASC
    `,
    [activityBlockId, ownerEmail]
  );
}

export async function getActivityByIdAndOwnerEmail(
  id: string,
  ownerEmail: string
): Promise<TrainingActivityRow | null> {
  return db.oneOrNone<TrainingActivityRow>(
    `
      SELECT
        a.id,
        a.activity_block_id,
        a.title,
        a.type,
        a.description,
        a.duration_minutes,
        a.notes,
        a.order_index,
        a.created_at,
        a.updated_at
      FROM activities a
      JOIN activity_blocks ab
        ON ab.id = a.activity_block_id
      JOIN pitches p
        ON p.id = ab.pitch_id
      JOIN training_stories ts
        ON ts.id = p.training_story_id
      WHERE a.id = $1
        AND ts.owner_email = $2
      LIMIT 1
    `,
    [id, ownerEmail]
  );
}

export async function createTrainingActivity(
  input: CreateTrainingActivityInput
): Promise<TrainingActivityRow | null> {
  return db.oneOrNone<TrainingActivityRow>(
    `
      INSERT INTO activities (
        activity_block_id,
        title,
        type,
        description,
        duration_minutes,
        notes,
        order_index
      )
      SELECT
        ab.id,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8
      FROM activity_blocks ab
      JOIN pitches p
        ON p.id = ab.pitch_id
      JOIN training_stories ts
        ON ts.id = p.training_story_id
      WHERE ab.id = $1
        AND ts.owner_email = $2
      RETURNING
        id,
        activity_block_id,
        title,
        type,
        description,
        duration_minutes,
        notes,
        order_index,
        created_at,
        updated_at
    `,
    [
      input.activityBlockId,
      input.ownerEmail,
      input.title,
      input.type,
      input.description ?? "",
      input.durationMinutes,
      input.notes ?? null,
      input.orderIndex ?? 1,
    ]
  );
}

export async function updateTrainingActivity(
  input: UpdateTrainingActivityInput
): Promise<TrainingActivityRow | null> {
  return db.oneOrNone<TrainingActivityRow>(
    `
      UPDATE activities a
      SET
        title = $3,
        type = $4,
        description = $5,
        duration_minutes = $6,
        notes = $7,
        order_index = $8,
        updated_at = now()
      FROM activity_blocks ab
      JOIN pitches p
        ON p.id = ab.pitch_id
      JOIN training_stories ts
        ON ts.id = p.training_story_id
      WHERE a.activity_block_id = ab.id
        AND a.id = $1
        AND ts.owner_email = $2
      RETURNING
        a.id,
        a.activity_block_id,
        a.title,
        a.type,
        a.description,
        a.duration_minutes,
        a.notes,
        a.order_index,
        a.created_at,
        a.updated_at
    `,
    [
      input.id,
      input.ownerEmail,
      input.title,
      input.type,
      input.description,
      input.durationMinutes,
      input.notes ?? null,
      input.orderIndex,
    ]
  );
}

export async function deleteTrainingActivityByIdAndOwnerEmail(
  id: string,
  ownerEmail: string
): Promise<boolean> {
  const result = await db.result(
    `
      DELETE FROM activities a
      USING activity_blocks ab, pitches p, training_stories ts
      WHERE a.activity_block_id = ab.id
        AND ab.pitch_id = p.id
        AND p.training_story_id = ts.id
        AND a.id = $1
        AND ts.owner_email = $2
    `,
    [id, ownerEmail]
  );

  return result.rowCount > 0;
}