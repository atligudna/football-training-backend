import { db } from "../config/db";

export type TrainingActivityBlockType =
  | "warmup"
  | "technical"
  | "tactical"
  | "physical"
  | "goalkeeping"
  | "station"
  | "game"
  | "cooldown";

export interface TrainingActivityBlockRow {
  id: string;
  pitch_id: string;
  title: string;
  type: TrainingActivityBlockType;
  order_index: number;
  duration_minutes: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTrainingActivityBlockInput {
  pitchId: string;
  ownerEmail: string;
  title: string;
  type: TrainingActivityBlockType;
  orderIndex?: number;
  durationMinutes: number;
}

export interface UpdateTrainingActivityBlockInput {
  id: string;
  ownerEmail: string;
  title: string;
  type: TrainingActivityBlockType;
  orderIndex: number;
  durationMinutes: number;
}

export async function getActivityBlocksByPitchId(
  pitchId: string,
  ownerEmail: string
): Promise<TrainingActivityBlockRow[]> {
  return db.any<TrainingActivityBlockRow>(
    `
      SELECT
        ab.id,
        ab.pitch_id,
        ab.title,
        ab.type,
        ab.order_index,
        ab.duration_minutes,
        ab.created_at,
        ab.updated_at
      FROM activity_blocks ab
      JOIN pitches p
        ON p.id = ab.pitch_id
      JOIN training_stories ts
        ON ts.id = p.training_story_id
      WHERE ab.pitch_id = $1
        AND ts.owner_email = $2
      ORDER BY ab.order_index ASC, ab.created_at ASC
    `,
    [pitchId, ownerEmail]
  );
}

export async function getActivityBlockByIdAndOwnerEmail(
  id: string,
  ownerEmail: string
): Promise<TrainingActivityBlockRow | null> {
  return db.oneOrNone<TrainingActivityBlockRow>(
    `
      SELECT
        ab.id,
        ab.pitch_id,
        ab.title,
        ab.type,
        ab.order_index,
        ab.duration_minutes,
        ab.created_at,
        ab.updated_at
      FROM activity_blocks ab
      JOIN pitches p
        ON p.id = ab.pitch_id
      JOIN training_stories ts
        ON ts.id = p.training_story_id
      WHERE ab.id = $1
        AND ts.owner_email = $2
      LIMIT 1
    `,
    [id, ownerEmail]
  );
}

export async function createTrainingActivityBlock(
  input: CreateTrainingActivityBlockInput
): Promise<TrainingActivityBlockRow | null> {
  return db.oneOrNone<TrainingActivityBlockRow>(
    `
      INSERT INTO activity_blocks (
        pitch_id,
        title,
        type,
        order_index,
        duration_minutes
      )
      SELECT
        p.id,
        $3,
        $4,
        $5,
        $6
      FROM pitches p
      JOIN training_stories ts
        ON ts.id = p.training_story_id
      WHERE p.id = $1
        AND ts.owner_email = $2
      RETURNING
        id,
        pitch_id,
        title,
        type,
        order_index,
        duration_minutes,
        created_at,
        updated_at
    `,
    [
      input.pitchId,
      input.ownerEmail,
      input.title,
      input.type,
      input.orderIndex ?? 1,
      input.durationMinutes,
    ]
  );
}

export async function updateTrainingActivityBlock(
  input: UpdateTrainingActivityBlockInput
): Promise<TrainingActivityBlockRow | null> {
  return db.oneOrNone<TrainingActivityBlockRow>(
    `
      UPDATE activity_blocks ab
      SET
        title = $3,
        type = $4,
        order_index = $5,
        duration_minutes = $6,
        updated_at = now()
      FROM pitches p
      JOIN training_stories ts
        ON ts.id = p.training_story_id
      WHERE ab.pitch_id = p.id
        AND ab.id = $1
        AND ts.owner_email = $2
      RETURNING
        ab.id,
        ab.pitch_id,
        ab.title,
        ab.type,
        ab.order_index,
        ab.duration_minutes,
        ab.created_at,
        ab.updated_at
    `,
    [
      input.id,
      input.ownerEmail,
      input.title,
      input.type,
      input.orderIndex,
      input.durationMinutes,
    ]
  );
}

export async function deleteTrainingActivityBlockByIdAndOwnerEmail(
  id: string,
  ownerEmail: string
): Promise<boolean> {
  const result = await db.result(
    `
      DELETE FROM activity_blocks ab
      USING pitches p, training_stories ts
      WHERE ab.pitch_id = p.id
        AND p.training_story_id = ts.id
        AND ab.id = $1
        AND ts.owner_email = $2
    `,
    [id, ownerEmail]
  );

  return result.rowCount > 0;
}