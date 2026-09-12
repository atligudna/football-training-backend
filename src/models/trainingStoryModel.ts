import { db } from "../config/db";

export type TrainingStoryStatus =
  | "draft"
  | "planned"
  | "active"
  | "completed"
  | "archived";

export interface TrainingStoryRow {
  id: string;
  owner_email: string;
  title: string;
  description: string;
  age_group: string;
  duration_minutes: number;
  theme: string | null;
  tags: string[];
  objectives: string[];
  status: TrainingStoryStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTrainingStoryInput {
  ownerEmail: string;
  title: string;
  description: string;
  ageGroup: string;
  durationMinutes: number;
  theme?: string;
  tags?: string[];
  objectives?: string[];
  status?: TrainingStoryStatus;
}

export async function getTrainingStoriesByOwnerEmail(
  ownerEmail: string
): Promise<TrainingStoryRow[]> {
  return db.any<TrainingStoryRow>(
    `
      SELECT
        id,
        owner_email,
        title,
        description,
        age_group,
        duration_minutes,
        theme,
        tags,
        objectives,
        status,
        created_at,
        updated_at
      FROM training_stories
      WHERE owner_email = $1
      ORDER BY updated_at DESC
    `,
    [ownerEmail]
  );
}

export async function getTrainingStoryByIdAndOwnerEmail(
  id: string,
  ownerEmail: string
): Promise<TrainingStoryRow | null> {
  return db.oneOrNone<TrainingStoryRow>(
    `
      SELECT
        id,
        owner_email,
        title,
        description,
        age_group,
        duration_minutes,
        theme,
        tags,
        objectives,
        status,
        created_at,
        updated_at
      FROM training_stories
      WHERE id = $1
        AND owner_email = $2
      LIMIT 1
    `,
    [id, ownerEmail]
  );
}

export async function createTrainingStory(
  input: CreateTrainingStoryInput
): Promise<TrainingStoryRow> {
  return db.one<TrainingStoryRow>(
    `
      INSERT INTO training_stories (
        owner_email,
        title,
        description,
        age_group,
        duration_minutes,
        theme,
        tags,
        objectives,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING
        id,
        owner_email,
        title,
        description,
        age_group,
        duration_minutes,
        theme,
        tags,
        objectives,
        status,
        created_at,
        updated_at
    `,
    [
      input.ownerEmail,
      input.title,
      input.description,
      input.ageGroup,
      input.durationMinutes,
      input.theme ?? null,
      input.tags ?? [],
      input.objectives ?? [],
      input.status ?? "draft",
    ]
  );
}