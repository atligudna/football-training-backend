import { db } from "../config/db";

export interface TrainingPlayerFocusRow {
  id: string;
  activity_id: string;
  text: string;
  order_index: number;
}

export interface CreateTrainingPlayerFocusInput {
  activityId: string;
  ownerEmail: string;
  text: string;
  orderIndex?: number;
}

export interface UpdateTrainingPlayerFocusInput {
  id: string;
  ownerEmail: string;
  text: string;
  orderIndex: number;
}

export async function getPlayerFocusByActivityId(
  activityId: string,
  ownerEmail: string
): Promise<TrainingPlayerFocusRow[]> {
  return db.any<TrainingPlayerFocusRow>(
    `
      SELECT pf.id, pf.activity_id, pf.text, pf.order_index
      FROM player_focus pf
      JOIN activities a ON a.id = pf.activity_id
      JOIN activity_blocks ab ON ab.id = a.activity_block_id
      JOIN pitches p ON p.id = ab.pitch_id
      JOIN training_stories ts ON ts.id = p.training_story_id
      WHERE pf.activity_id = $1
        AND ts.owner_email = $2
      ORDER BY pf.order_index ASC
    `,
    [activityId, ownerEmail]
  );
}

export async function getPlayerFocusByIdAndOwnerEmail(
  id: string,
  ownerEmail: string
): Promise<TrainingPlayerFocusRow | null> {
  return db.oneOrNone<TrainingPlayerFocusRow>(
    `
      SELECT pf.id, pf.activity_id, pf.text, pf.order_index
      FROM player_focus pf
      JOIN activities a ON a.id = pf.activity_id
      JOIN activity_blocks ab ON ab.id = a.activity_block_id
      JOIN pitches p ON p.id = ab.pitch_id
      JOIN training_stories ts ON ts.id = p.training_story_id
      WHERE pf.id = $1
        AND ts.owner_email = $2
      LIMIT 1
    `,
    [id, ownerEmail]
  );
}

export async function createTrainingPlayerFocus(
  input: CreateTrainingPlayerFocusInput
): Promise<TrainingPlayerFocusRow | null> {
  return db.oneOrNone<TrainingPlayerFocusRow>(
    `
      INSERT INTO player_focus (activity_id, text, order_index)
      SELECT a.id, $3, $4
      FROM activities a
      JOIN activity_blocks ab ON ab.id = a.activity_block_id
      JOIN pitches p ON p.id = ab.pitch_id
      JOIN training_stories ts ON ts.id = p.training_story_id
      WHERE a.id = $1
        AND ts.owner_email = $2
      RETURNING id, activity_id, text, order_index
    `,
    [input.activityId, input.ownerEmail, input.text, input.orderIndex ?? 1]
  );
}

export async function updateTrainingPlayerFocus(
  input: UpdateTrainingPlayerFocusInput
): Promise<TrainingPlayerFocusRow | null> {
  return db.oneOrNone<TrainingPlayerFocusRow>(
    `
      UPDATE player_focus pf
      SET
        text = $3,
        order_index = $4
      FROM activities a
      JOIN activity_blocks ab ON ab.id = a.activity_block_id
      JOIN pitches p ON p.id = ab.pitch_id
      JOIN training_stories ts ON ts.id = p.training_story_id
      WHERE pf.activity_id = a.id
        AND pf.id = $1
        AND ts.owner_email = $2
      RETURNING pf.id, pf.activity_id, pf.text, pf.order_index
    `,
    [input.id, input.ownerEmail, input.text, input.orderIndex]
  );
}

export async function deleteTrainingPlayerFocusByIdAndOwnerEmail(
  id: string,
  ownerEmail: string
): Promise<boolean> {
  const result = await db.result(
    `
      DELETE FROM player_focus pf
      USING activities a, activity_blocks ab, pitches p, training_stories ts
      WHERE pf.activity_id = a.id
        AND a.activity_block_id = ab.id
        AND ab.pitch_id = p.id
        AND p.training_story_id = ts.id
        AND pf.id = $1
        AND ts.owner_email = $2
    `,
    [id, ownerEmail]
  );

  return result.rowCount > 0;
}