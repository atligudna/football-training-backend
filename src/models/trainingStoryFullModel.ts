import { db } from "../config/db";

type TrainingStoryStatus =
  | "draft"
  | "planned"
  | "active"
  | "completed"
  | "archived";

interface TrainingStoryRow {
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

interface PitchRow {
  id: string;
  training_story_id: string;
  name: string;
  coach_name: string | null;
  player_group: string | null;
  order_index: number;
}

interface ActivityBlockRow {
  id: string;
  pitch_id: string;
  title: string;
  type: string;
  order_index: number;
  duration_minutes: number;
}

interface ActivityRow {
  id: string;
  activity_block_id: string;
  title: string;
  type: string;
  description: string;
  duration_minutes: number;
  notes: string | null;
  order_index: number;
}

interface CoachingPointRow {
  id: string;
  activity_id: string;
  text: string;
  order_index: number;
}

interface PlayerFocusRow {
  id: string;
  activity_id: string;
  text: string;
  order_index: number;
}

interface EquipmentItemRow {
  id: string;
  activity_id: string;
  name: string;
  quantity: number;
  order_index: number;
}

interface ReviewRow {
  training_story_id: string;
  completed_at: Date;
  overall_rating: number;
  went_well: string;
  improve_next_time: string;
  notes: string;
}

export interface FullTrainingStory {
  id: string;
  title: string;
  description: string;
  ageGroup: string;
  durationMinutes: number;
  theme?: string;
  tags: string[];
  objectives: string[];
  status: TrainingStoryStatus;
  pitches: FullPitch[];
  review?: FullTrainingReview;
  createdAt: string;
  updatedAt: string;
}

export interface FullPitch {
  id: string;
  name: string;
  coachName?: string;
  playerGroup?: string;
  order: number;
  activityBlocks: FullActivityBlock[];
}

export interface FullActivityBlock {
  id: string;
  title: string;
  type: string;
  order: number;
  durationMinutes: number;
  activities: FullActivity[];
}

export interface FullActivity {
  id: string;
  title: string;
  type: string;
  description: string;
  durationMinutes: number;
  notes?: string;
  coachingPoints: FullTextItem[];
  playerFocus: FullTextItem[];
  equipment: FullEquipmentItem[];
  order: number;
}

export interface FullTextItem {
  id: string;
  text: string;
  order: number;
}

export interface FullEquipmentItem {
  id: string;
  name: string;
  quantity: number;
  order: number;
}

export interface FullTrainingReview {
  completedAt: string;
  overallRating: number;
  wentWell: string;
  improveNextTime: string;
  notes: string;
}

function toIsoString(value: Date) {
  return value.toISOString();
}

export async function getFullTrainingStoryByIdAndOwnerEmail(
  id: string,
  ownerEmail: string
): Promise<FullTrainingStory | null> {
  return db.tx(async (transaction) => {
    const story = await transaction.oneOrNone<TrainingStoryRow>(
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

    if (!story) return null;

    const pitches = await transaction.any<PitchRow>(
      `
        SELECT
          id,
          training_story_id,
          name,
          coach_name,
          player_group,
          order_index
        FROM pitches
        WHERE training_story_id = $1
        ORDER BY order_index ASC, id ASC
      `,
      [story.id]
    );

    const activityBlocks = await transaction.any<ActivityBlockRow>(
      `
        SELECT
          ab.id,
          ab.pitch_id,
          ab.title,
          ab.type,
          ab.order_index,
          ab.duration_minutes
        FROM activity_blocks ab
        JOIN pitches p
          ON p.id = ab.pitch_id
        WHERE p.training_story_id = $1
        ORDER BY ab.order_index ASC, ab.id ASC
      `,
      [story.id]
    );

    const activities = await transaction.any<ActivityRow>(
      `
        SELECT
          a.id,
          a.activity_block_id,
          a.title,
          a.type,
          a.description,
          a.duration_minutes,
          a.notes,
          a.order_index
        FROM activities a
        JOIN activity_blocks ab
          ON ab.id = a.activity_block_id
        JOIN pitches p
          ON p.id = ab.pitch_id
        WHERE p.training_story_id = $1
        ORDER BY a.order_index ASC, a.id ASC
      `,
      [story.id]
    );

    const coachingPoints = await transaction.any<CoachingPointRow>(
      `
        SELECT
          cp.id,
          cp.activity_id,
          cp.text,
          cp.order_index
        FROM coaching_points cp
        JOIN activities a
          ON a.id = cp.activity_id
        JOIN activity_blocks ab
          ON ab.id = a.activity_block_id
        JOIN pitches p
          ON p.id = ab.pitch_id
        WHERE p.training_story_id = $1
        ORDER BY cp.order_index ASC, cp.id ASC
      `,
      [story.id]
    );

    const playerFocus = await transaction.any<PlayerFocusRow>(
      `
        SELECT
          pf.id,
          pf.activity_id,
          pf.text,
          pf.order_index
        FROM player_focus pf
        JOIN activities a
          ON a.id = pf.activity_id
        JOIN activity_blocks ab
          ON ab.id = a.activity_block_id
        JOIN pitches p
          ON p.id = ab.pitch_id
        WHERE p.training_story_id = $1
        ORDER BY pf.order_index ASC, pf.id ASC
      `,
      [story.id]
    );

    const equipmentItems = await transaction.any<EquipmentItemRow>(
      `
        SELECT
          ei.id,
          ei.activity_id,
          ei.name,
          ei.quantity,
          ei.order_index
        FROM equipment_items ei
        JOIN activities a
          ON a.id = ei.activity_id
        JOIN activity_blocks ab
          ON ab.id = a.activity_block_id
        JOIN pitches p
          ON p.id = ab.pitch_id
        WHERE p.training_story_id = $1
        ORDER BY ei.order_index ASC, ei.id ASC
      `,
      [story.id]
    );

    const review = await transaction.oneOrNone<ReviewRow>(
      `
        SELECT
          training_story_id,
          completed_at,
          overall_rating,
          went_well,
          improve_next_time,
          notes
        FROM training_reviews
        WHERE training_story_id = $1
        LIMIT 1
      `,
      [story.id]
    );

    const activityMap = new Map<string, FullActivity>();

    for (const activity of activities) {
      activityMap.set(activity.id, {
        id: activity.id,
        title: activity.title,
        type: activity.type,
        description: activity.description,
        durationMinutes: activity.duration_minutes,
        notes: activity.notes ?? undefined,
        coachingPoints: [],
        playerFocus: [],
        equipment: [],
        order: activity.order_index,
      });
    }

    for (const point of coachingPoints) {
      const activity = activityMap.get(point.activity_id);
      if (!activity) continue;

      activity.coachingPoints.push({
        id: point.id,
        text: point.text,
        order: point.order_index,
      });
    }

    for (const focus of playerFocus) {
      const activity = activityMap.get(focus.activity_id);
      if (!activity) continue;

      activity.playerFocus.push({
        id: focus.id,
        text: focus.text,
        order: focus.order_index,
      });
    }

    for (const item of equipmentItems) {
      const activity = activityMap.get(item.activity_id);
      if (!activity) continue;

      activity.equipment.push({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        order: item.order_index,
      });
    }

    const blockMap = new Map<string, FullActivityBlock>();

    for (const block of activityBlocks) {
      blockMap.set(block.id, {
        id: block.id,
        title: block.title,
        type: block.type,
        order: block.order_index,
        durationMinutes: block.duration_minutes,
        activities: activities
          .filter((activity) => activity.activity_block_id === block.id)
          .map((activity) => activityMap.get(activity.id))
          .filter((activity): activity is FullActivity => Boolean(activity)),
      });
    }

    const fullPitches: FullPitch[] = pitches.map((pitch) => ({
      id: pitch.id,
      name: pitch.name,
      coachName: pitch.coach_name ?? undefined,
      playerGroup: pitch.player_group ?? undefined,
      order: pitch.order_index,
      activityBlocks: activityBlocks
        .filter((block) => block.pitch_id === pitch.id)
        .map((block) => blockMap.get(block.id))
        .filter((block): block is FullActivityBlock => Boolean(block)),
    }));

    return {
      id: story.id,
      title: story.title,
      description: story.description,
      ageGroup: story.age_group,
      durationMinutes: story.duration_minutes,
      theme: story.theme ?? undefined,
      tags: story.tags,
      objectives: story.objectives,
      status: story.status,
      pitches: fullPitches,
      review: review
        ? {
            completedAt: toIsoString(review.completed_at),
            overallRating: review.overall_rating,
            wentWell: review.went_well,
            improveNextTime: review.improve_next_time,
            notes: review.notes,
          }
        : undefined,
      createdAt: toIsoString(story.created_at),
      updatedAt: toIsoString(story.updated_at),
    };
  });
}