import { db } from "../config/db";

export interface TrainingPitchRow {
  id: string;
  training_story_id: string;
  name: string;
  coach_name: string | null;
  player_group: string | null;
  order_index: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTrainingPitchInput {
  trainingStoryId: string;
  ownerEmail: string;
  name: string;
  coachName?: string | null;
  playerGroup?: string | null;
  orderIndex?: number;
}

export interface UpdateTrainingPitchInput {
  id: string;
  ownerEmail: string;
  name: string;
  coachName?: string | null;
  playerGroup?: string | null;
  orderIndex: number;
}

export async function getPitchesByTrainingStoryId(
  trainingStoryId: string,
  ownerEmail: string
): Promise<TrainingPitchRow[]> {
  return db.any<TrainingPitchRow>(
    `
      SELECT
        p.id,
        p.training_story_id,
        p.name,
        p.coach_name,
        p.player_group,
        p.order_index,
        p.created_at,
        p.updated_at
      FROM pitches p
      JOIN training_stories ts
        ON ts.id = p.training_story_id
      WHERE p.training_story_id = $1
        AND ts.owner_email = $2
      ORDER BY p.order_index ASC, p.created_at ASC
    `,
    [trainingStoryId, ownerEmail]
  );
}

export async function getPitchByIdAndOwnerEmail(
  id: string,
  ownerEmail: string
): Promise<TrainingPitchRow | null> {
  return db.oneOrNone<TrainingPitchRow>(
    `
      SELECT
        p.id,
        p.training_story_id,
        p.name,
        p.coach_name,
        p.player_group,
        p.order_index,
        p.created_at,
        p.updated_at
      FROM pitches p
      JOIN training_stories ts
        ON ts.id = p.training_story_id
      WHERE p.id = $1
        AND ts.owner_email = $2
      LIMIT 1
    `,
    [id, ownerEmail]
  );
}

export async function createTrainingPitch(
  input: CreateTrainingPitchInput
): Promise<TrainingPitchRow | null> {
  return db.oneOrNone<TrainingPitchRow>(
    `
      INSERT INTO pitches (
        training_story_id,
        name,
        coach_name,
        player_group,
        order_index
      )
      SELECT
        ts.id,
        $3,
        $4,
        $5,
        $6
      FROM training_stories ts
      WHERE ts.id = $1
        AND ts.owner_email = $2
      RETURNING
        id,
        training_story_id,
        name,
        coach_name,
        player_group,
        order_index,
        created_at,
        updated_at
    `,
    [
      input.trainingStoryId,
      input.ownerEmail,
      input.name,
      input.coachName ?? null,
      input.playerGroup ?? null,
      input.orderIndex ?? 1,
    ]
  );
}

export async function updateTrainingPitch(
  input: UpdateTrainingPitchInput
): Promise<TrainingPitchRow | null> {
  return db.oneOrNone<TrainingPitchRow>(
    `
      UPDATE pitches p
      SET
        name = $3,
        coach_name = $4,
        player_group = $5,
        order_index = $6,
        updated_at = now()
      FROM training_stories ts
      WHERE p.training_story_id = ts.id
        AND p.id = $1
        AND ts.owner_email = $2
      RETURNING
        p.id,
        p.training_story_id,
        p.name,
        p.coach_name,
        p.player_group,
        p.order_index,
        p.created_at,
        p.updated_at
    `,
    [
      input.id,
      input.ownerEmail,
      input.name,
      input.coachName ?? null,
      input.playerGroup ?? null,
      input.orderIndex,
    ]
  );
}

export async function deleteTrainingPitchByIdAndOwnerEmail(
  id: string,
  ownerEmail: string
): Promise<boolean> {
  const result = await db.result(
    `
      DELETE FROM pitches p
      USING training_stories ts
      WHERE p.training_story_id = ts.id
        AND p.id = $1
        AND ts.owner_email = $2
    `,
    [id, ownerEmail]
  );

  return result.rowCount > 0;
}