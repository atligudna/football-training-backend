import { db } from "../config/db";

export interface TrainingCoachingPointRow {
  id: string;
  activity_id: string;
  text: string;
  order_index: number;
}

export interface CreateTrainingCoachingPointInput {
  activityId: string;
  ownerEmail: string;
  text: string;
  orderIndex?: number;
}

export interface UpdateTrainingCoachingPointInput {
  id: string;
  ownerEmail: string;
  text: string;
  orderIndex: number;
}

export async function getCoachingPointsByActivityId(
  activityId: string,
  ownerEmail: string
): Promise<TrainingCoachingPointRow[]> {
  return db.any<TrainingCoachingPointRow>(
    `
      SELECT cp.id, cp.activity_id, cp.text, cp.order_index
      FROM coaching_points cp
      JOIN activities a ON a.id = cp.activity_id
      JOIN activity_blocks ab ON ab.id = a.activity_block_id
      JOIN pitches p ON p.id = ab.pitch_id
      JOIN training_stories ts ON ts.id = p.training_story_id
      WHERE cp.activity_id = $1
        AND ts.owner_email = $2
      ORDER BY cp.order_index ASC
    `,
    [activityId, ownerEmail]
  );
}

export async function getCoachingPointByIdAndOwnerEmail(
  id: string,
  ownerEmail: string
): Promise<TrainingCoachingPointRow | null> {
  return db.oneOrNone<TrainingCoachingPointRow>(
    `
      SELECT cp.id, cp.activity_id, cp.text, cp.order_index
      FROM coaching_points cp
      JOIN activities a ON a.id = cp.activity_id
      JOIN activity_blocks ab ON ab.id = a.activity_block_id
      JOIN pitches p ON p.id = ab.pitch_id
      JOIN training_stories ts ON ts.id = p.training_story_id
      WHERE cp.id = $1
        AND ts.owner_email = $2
      LIMIT 1
    `,
    [id, ownerEmail]
  );
}

export async function createTrainingCoachingPoint(
  input: CreateTrainingCoachingPointInput
): Promise<TrainingCoachingPointRow | null> {
  return db.oneOrNone<TrainingCoachingPointRow>(
    `
      INSERT INTO coaching_points (activity_id, text, order_index)
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

export async function updateTrainingCoachingPoint(
  input: UpdateTrainingCoachingPointInput
): Promise<TrainingCoachingPointRow | null> {
  return db.oneOrNone<TrainingCoachingPointRow>(
    `
      UPDATE coaching_points cp
      SET
        text = $3,
        order_index = $4
      FROM activities a
      JOIN activity_blocks ab ON ab.id = a.activity_block_id
      JOIN pitches p ON p.id = ab.pitch_id
      JOIN training_stories ts ON ts.id = p.training_story_id
      WHERE cp.activity_id = a.id
        AND cp.id = $1
        AND ts.owner_email = $2
      RETURNING cp.id, cp.activity_id, cp.text, cp.order_index
    `,
    [input.id, input.ownerEmail, input.text, input.orderIndex]
  );
}

export async function deleteTrainingCoachingPointByIdAndOwnerEmail(
  id: string,
  ownerEmail: string
): Promise<boolean> {
  const result = await db.result(
    `
      DELETE FROM coaching_points cp
      USING activities a, activity_blocks ab, pitches p, training_stories ts
      WHERE cp.activity_id = a.id
        AND a.activity_block_id = ab.id
        AND ab.pitch_id = p.id
        AND p.training_story_id = ts.id
        AND cp.id = $1
        AND ts.owner_email = $2
    `,
    [id, ownerEmail]
  );

  return result.rowCount > 0;
}