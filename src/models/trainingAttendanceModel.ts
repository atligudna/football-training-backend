import { db } from "../config/db";

export type AttendanceStatus =
  | "unknown"
  | "attending"
  | "absent"
  | "injured";

interface AttendancePlayerRow {
  player_id: number;
  first_name: string;
  last_name: string;
  birth_year: number | null;
  position: string | null;
  active: boolean;
  group_ids: number[];
  group_names: string[];
  status: AttendanceStatus;
  notes: string | null;
  attendance_updated_at: Date | null;
}

export interface TrainingAttendancePlayer {
  playerId: string;
  firstName: string;
  lastName: string;
  birthYear?: number;
  position?: string;
  active: boolean;
  groupIds: string[];
  groupNames: string[];
  status: AttendanceStatus;
  notes?: string;
  updatedAt?: string;
}

export interface UpdateAttendanceInput {
  playerId: number;
  status: AttendanceStatus;
  notes?: string | null;
}

function mapRow(
  row: AttendancePlayerRow
): TrainingAttendancePlayer {
  return {
    playerId: String(row.player_id),
    firstName: row.first_name,
    lastName: row.last_name,
    birthYear:
      row.birth_year ?? undefined,
    position:
      row.position ?? undefined,
    active: row.active,
    groupIds:
      row.group_ids.map(String),
    groupNames: row.group_names,
    status: row.status,
    notes:
      row.notes ?? undefined,
    updatedAt:
      row.attendance_updated_at
        ? row.attendance_updated_at.toISOString()
        : undefined,
  };
}

export const TrainingAttendanceModel = {
  async storyExists(
    trainingStoryId: string,
    ownerEmail: string
  ): Promise<boolean> {
    const result =
      await db.oneOrNone<{ id: string }>(
        `
          SELECT id
          FROM training_stories
          WHERE id = $1
            AND owner_email = $2
          LIMIT 1
        `,
        [
          trainingStoryId,
          ownerEmail,
        ]
      );

    return Boolean(result);
  },

  async getForTrainingStory(
    trainingStoryId: string,
    ownerEmail: string,
    userId: number
  ): Promise<
    TrainingAttendancePlayer[]
  > {
    const rows =
      await db.any<AttendancePlayerRow>(
        `
          SELECT
            pl.id AS player_id,
            pl.first_name,
            pl.last_name,
            pl.birth_year,
            pl.position,
            pl.active,

            ARRAY_AGG(
              DISTINCT g.id
              ORDER BY g.id
            ) AS group_ids,

            ARRAY_AGG(
              DISTINCT g.name
              ORDER BY g.name
            ) AS group_names,

            COALESCE(
              ta.status,
              'unknown'
            ) AS status,

            ta.notes,

            ta.updated_at
              AS attendance_updated_at

          FROM training_stories ts

          JOIN pitches pi
            ON pi.training_story_id = ts.id

          JOIN groups g
            ON g.id = pi.group_id
            AND g.created_by = $3
            AND g.is_deleted = FALSE

          JOIN group_players gp
            ON gp.group_id = g.id

          JOIN players pl
            ON pl.id = gp.player_id
            AND pl.created_by = $3
            AND pl.is_deleted = FALSE

          LEFT JOIN training_attendance ta
            ON ta.training_story_id = ts.id
            AND ta.player_id = pl.id

          WHERE ts.id = $1
            AND ts.owner_email = $2

          GROUP BY
            pl.id,
            pl.first_name,
            pl.last_name,
            pl.birth_year,
            pl.position,
            pl.active,
            ta.status,
            ta.notes,
            ta.updated_at

          ORDER BY
            pl.last_name ASC,
            pl.first_name ASC,
            pl.id ASC
        `,
        [
          trainingStoryId,
          ownerEmail,
          userId,
        ]
      );

    return rows.map(mapRow);
  },

  async updateOne(
    trainingStoryId: string,
    ownerEmail: string,
    userId: number,
    input: UpdateAttendanceInput
  ): Promise<
    TrainingAttendancePlayer | null
  > {
    const saved =
      await db.oneOrNone<{
        player_id: number;
      }>(
        `
          INSERT INTO training_attendance (
            training_story_id,
            player_id,
            status,
            notes
          )

          SELECT
            ts.id,
            pl.id,
            $5,
            $6

          FROM training_stories ts

          JOIN players pl
            ON pl.id = $4
            AND pl.created_by = $3
            AND pl.is_deleted = FALSE

          WHERE ts.id = $1
            AND ts.owner_email = $2

            AND EXISTS (
              SELECT 1
              FROM pitches pi

              JOIN group_players gp
                ON gp.group_id =
                  pi.group_id

              JOIN groups g
                ON g.id =
                  pi.group_id
                AND g.created_by = $3
                AND g.is_deleted =
                  FALSE

              WHERE
                pi.training_story_id =
                  ts.id

                AND gp.player_id =
                  pl.id
            )

          ON CONFLICT (
            training_story_id,
            player_id
          )

          DO UPDATE SET
            status =
              EXCLUDED.status,
            notes =
              EXCLUDED.notes,
            updated_at =
              NOW()

          RETURNING player_id
        `,
        [
          trainingStoryId,
          ownerEmail,
          userId,
          input.playerId,
          input.status,
          input.notes ?? null,
        ]
      );

    if (!saved) {
      return null;
    }

    const attendance =
      await this.getForTrainingStory(
        trainingStoryId,
        ownerEmail,
        userId
      );

    return (
      attendance.find(
        (player) =>
          player.playerId ===
          String(saved.player_id)
      ) ?? null
    );
  },

  async updateMany(
    trainingStoryId: string,
    ownerEmail: string,
    userId: number,
    inputs: UpdateAttendanceInput[]
  ): Promise<
    TrainingAttendancePlayer[] | null
  > {
    const uniquePlayerIds = [
      ...new Set(
        inputs.map(
          (item) => item.playerId
        )
      ),
    ];

    if (uniquePlayerIds.length === 0) {
      return [];
    }

    return db.tx(
      async (transaction) => {
        const validRows =
          await transaction.any<{
            player_id: number;
          }>(
            `
              SELECT DISTINCT
                gp.player_id

              FROM training_stories ts

              JOIN pitches pi
                ON pi.training_story_id =
                  ts.id

              JOIN groups g
                ON g.id = pi.group_id
                AND g.created_by = $3
                AND g.is_deleted =
                  FALSE

              JOIN group_players gp
                ON gp.group_id = g.id

              JOIN players pl
                ON pl.id =
                  gp.player_id
                AND pl.created_by = $3
                AND pl.is_deleted =
                  FALSE

              WHERE ts.id = $1
                AND ts.owner_email = $2

                AND gp.player_id
                  IN ($4:csv)
            `,
            [
              trainingStoryId,
              ownerEmail,
              userId,
              uniquePlayerIds,
            ]
          );

        const validIds =
          new Set(
            validRows.map(
              (row) => row.player_id
            )
          );

        if (
          validIds.size !==
          uniquePlayerIds.length
        ) {
          return null;
        }

        for (const input of inputs) {
          await transaction.none(
            `
              INSERT INTO
                training_attendance (
                  training_story_id,
                  player_id,
                  status,
                  notes
                )

              VALUES (
                $1,
                $2,
                $3,
                $4
              )

              ON CONFLICT (
                training_story_id,
                player_id
              )

              DO UPDATE SET
                status =
                  EXCLUDED.status,
                notes =
                  EXCLUDED.notes,
                updated_at =
                  NOW()
            `,
            [
              trainingStoryId,
              input.playerId,
              input.status,
              input.notes ?? null,
            ]
          );
        }

        return [];
      }
    ).then(async (result) => {
      if (result === null) {
        return null;
      }

      return this.getForTrainingStory(
        trainingStoryId,
        ownerEmail,
        userId
      );
    });
  },
};