import { db } from "../config/db";

export interface TrainingEquipmentItemRow {
  id: string;
  activity_id: string;
  name: string;
  quantity: number;
  order_index: number;
}

export interface CreateTrainingEquipmentItemInput {
  activityId: string;
  ownerEmail: string;
  name: string;
  quantity?: number;
  orderIndex?: number;
}

export interface UpdateTrainingEquipmentItemInput {
  id: string;
  ownerEmail: string;
  name: string;
  quantity: number;
  orderIndex: number;
}

export async function getEquipmentItemsByActivityId(
  activityId: string,
  ownerEmail: string
): Promise<TrainingEquipmentItemRow[]> {
  return db.any<TrainingEquipmentItemRow>(
    `
      SELECT ei.id, ei.activity_id, ei.name, ei.quantity, ei.order_index
      FROM equipment_items ei
      JOIN activities a ON a.id = ei.activity_id
      JOIN activity_blocks ab ON ab.id = a.activity_block_id
      JOIN pitches p ON p.id = ab.pitch_id
      JOIN training_stories ts ON ts.id = p.training_story_id
      WHERE ei.activity_id = $1
        AND ts.owner_email = $2
      ORDER BY ei.order_index ASC
    `,
    [activityId, ownerEmail]
  );
}

export async function getEquipmentItemByIdAndOwnerEmail(
  id: string,
  ownerEmail: string
): Promise<TrainingEquipmentItemRow | null> {
  return db.oneOrNone<TrainingEquipmentItemRow>(
    `
      SELECT ei.id, ei.activity_id, ei.name, ei.quantity, ei.order_index
      FROM equipment_items ei
      JOIN activities a ON a.id = ei.activity_id
      JOIN activity_blocks ab ON ab.id = a.activity_block_id
      JOIN pitches p ON p.id = ab.pitch_id
      JOIN training_stories ts ON ts.id = p.training_story_id
      WHERE ei.id = $1
        AND ts.owner_email = $2
      LIMIT 1
    `,
    [id, ownerEmail]
  );
}

export async function createTrainingEquipmentItem(
  input: CreateTrainingEquipmentItemInput
): Promise<TrainingEquipmentItemRow | null> {
  return db.oneOrNone<TrainingEquipmentItemRow>(
    `
      INSERT INTO equipment_items (activity_id, name, quantity, order_index)
      SELECT a.id, $3, $4, $5
      FROM activities a
      JOIN activity_blocks ab ON ab.id = a.activity_block_id
      JOIN pitches p ON p.id = ab.pitch_id
      JOIN training_stories ts ON ts.id = p.training_story_id
      WHERE a.id = $1
        AND ts.owner_email = $2
      RETURNING id, activity_id, name, quantity, order_index
    `,
    [
      input.activityId,
      input.ownerEmail,
      input.name,
      input.quantity ?? 1,
      input.orderIndex ?? 1,
    ]
  );
}

export async function updateTrainingEquipmentItem(
  input: UpdateTrainingEquipmentItemInput
): Promise<TrainingEquipmentItemRow | null> {
  return db.oneOrNone<TrainingEquipmentItemRow>(
    `
      UPDATE equipment_items ei
      SET
        name = $3,
        quantity = $4,
        order_index = $5
      FROM activities a
      JOIN activity_blocks ab ON ab.id = a.activity_block_id
      JOIN pitches p ON p.id = ab.pitch_id
      JOIN training_stories ts ON ts.id = p.training_story_id
      WHERE ei.activity_id = a.id
        AND ei.id = $1
        AND ts.owner_email = $2
      RETURNING ei.id, ei.activity_id, ei.name, ei.quantity, ei.order_index
    `,
    [input.id, input.ownerEmail, input.name, input.quantity, input.orderIndex]
  );
}

export async function deleteTrainingEquipmentItemByIdAndOwnerEmail(
  id: string,
  ownerEmail: string
): Promise<boolean> {
  const result = await db.result(
    `
      DELETE FROM equipment_items ei
      USING activities a, activity_blocks ab, pitches p, training_stories ts
      WHERE ei.activity_id = a.id
        AND a.activity_block_id = ab.id
        AND ab.pitch_id = p.id
        AND p.training_story_id = ts.id
        AND ei.id = $1
        AND ts.owner_email = $2
    `,
    [id, ownerEmail]
  );

  return result.rowCount > 0;
}