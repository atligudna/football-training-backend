import { db } from "../config/db";

export type DrillType = "drill" | "station" | "game" | "break" | "reflection";

export interface DrillCoachingPoint {
  id: string;
  text: string;
}

export interface DrillEquipmentItem {
  id: string;
  name: string;
  quantity: number;
}

interface DrillRow {
  id: number;
  name: string;
  type: DrillType;
  description: string | null;
  duration_minutes: number | null;
  age_group: string | null;
  tags: string[];
  coaching_points: DrillCoachingPoint[];
  equipment_json: DrillEquipmentItem[];
  pitch_diagram_id: string | null;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface Drill {
  id: string;
  title: string;
  type: DrillType;
  description: string;
  durationMinutes: number;
  ageGroup?: string;
  tags: string[];
  coachingPoints: DrillCoachingPoint[];
  equipment: DrillEquipmentItem[];
  pitchDiagramId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDrillInput {
  title: string;
  type: DrillType;
  description?: string;
  durationMinutes?: number;
  ageGroup?: string;
  tags?: string[];
  coachingPoints?: DrillCoachingPoint[];
  equipment?: DrillEquipmentItem[];
  pitchDiagramId?: string | null;
  createdBy: number;
}

export interface UpdateDrillInput {
  title?: string;
  type?: DrillType;
  description?: string;
  durationMinutes?: number;
  ageGroup?: string;
  tags?: string[];
  coachingPoints?: DrillCoachingPoint[];
  equipment?: DrillEquipmentItem[];
  pitchDiagramId?: string | null;
}

function mapRowToDrill(row: DrillRow): Drill {
  return {
    id: String(row.id),
    title: row.name,
    type: row.type,
    description: row.description ?? "",
    durationMinutes: row.duration_minutes ?? 0,
    ageGroup: row.age_group ?? undefined,
    tags: row.tags ?? [],
    coachingPoints: row.coaching_points ?? [],
    equipment: row.equipment_json ?? [],
    pitchDiagramId: row.pitch_diagram_id ?? undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

async function validatePitchDiagramAccess(
  pitchDiagramId: string | null | undefined,
  userId: number
) {
  if (!pitchDiagramId) {
    return;
  }

  const diagram =
    await db.oneOrNone<{ id: string }>(
      `
        SELECT id
        FROM pitch_diagrams
        WHERE id = $1
          AND created_by = $2
          AND is_deleted = FALSE
      `,
      [
        pitchDiagramId,
        userId,
      ]
    );

  if (!diagram) {
    throw {
      status: 400,
      message:
        "Invalid pitch diagram",
    };
  }
}

export const DrillModel = {
  async getAll(userId: number): Promise<Drill[]> {
    const rows = await db.any<DrillRow>(
      `
      SELECT *
      FROM drills
      WHERE is_deleted = FALSE
        AND created_by = $1
      ORDER BY updated_at DESC, id DESC
      `,
      [userId]
    );

    return rows.map(mapRowToDrill);
  },

  async getById(id: number, userId: number): Promise<Drill | null> {
    const row = await db.oneOrNone<DrillRow>(
      `
      SELECT *
      FROM drills
      WHERE id = $1
        AND created_by = $2
        AND is_deleted = FALSE
      `,
      [id, userId]
    );

    return row ? mapRowToDrill(row) : null;
  },

  async create(data: CreateDrillInput): Promise<Drill> {
    await validatePitchDiagramAccess(
      data.pitchDiagramId,
      data.createdBy
    );
    const row = await db.one<DrillRow>(
      `
      INSERT INTO drills
        (
          name,
          type,
          description,
          duration_minutes,
          age_group,
          tags,
          coaching_points,
          equipment_json,
          pitch_diagram_id,
          difficulty,
          created_by
        )
      VALUES
          ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, $10, $11)
      RETURNING *
      `,
      [
        data.title,
        data.type,
        data.description ?? "",
        data.durationMinutes ?? null,
        data.ageGroup ?? null,
        data.tags ?? [],
        JSON.stringify(
          data.coachingPoints ?? []
        ),
        JSON.stringify(
          data.equipment ?? []
        ),
        data.pitchDiagramId ?? null,
        "easy",
        data.createdBy,
      ]
    );

    return mapRowToDrill(row);
  },

  async update(
    id: number,
    userId: number,
    data: UpdateDrillInput
  ): Promise<Drill | null> {
    const existing = await this.getById(id, userId);

    if (!existing) return null;
    if (
      data.pitchDiagramId !==
      undefined
    ) {
      await validatePitchDiagramAccess(
        data.pitchDiagramId,
        userId
      );
    }

    const row = await db.one<DrillRow>(
      `
      UPDATE drills
      SET
        name = $3,
        type = $4,
        description = $5,
        duration_minutes = $6,
        age_group = $7,
        tags = $8,
        coaching_points = $9::jsonb,
        equipment_json = $10::jsonb,
        pitch_diagram_id = $11,
        updated_at = NOW()
      WHERE id = $1
        AND created_by = $2
        AND is_deleted = FALSE
      RETURNING *
      `,
      [
        id,
        userId,
        data.title ?? existing.title,
        data.type ?? existing.type,
        data.description ?? existing.description,
        data.durationMinutes ?? existing.durationMinutes,
        data.ageGroup ?? existing.ageGroup ?? null,
        data.tags ?? existing.tags,
        JSON.stringify(
          data.coachingPoints ??
          existing.coachingPoints
        ),
        JSON.stringify(
          data.equipment ??
          existing.equipment
        ),
        data.pitchDiagramId !== undefined
          ? data.pitchDiagramId
          : existing.pitchDiagramId ??
          null,
      ]
    );

    return mapRowToDrill(row);
  },

  async remove(id: number, userId: number): Promise<boolean> {
    const result = await db.result(
      `
      UPDATE drills
      SET is_deleted = TRUE,
          updated_at = NOW()
      WHERE id = $1
        AND created_by = $2
        AND is_deleted = FALSE
      `,
      [id, userId]
    );

    return result.rowCount > 0;
  },

  async getDeleted(userId: number): Promise<Drill[]> {
    const rows = await db.any<DrillRow>(
      `
    SELECT *
    FROM drills
    WHERE is_deleted = TRUE
      AND created_by = $1
    ORDER BY updated_at DESC, id DESC
    `,
      [userId]
    );

    return rows.map(mapRowToDrill);
  },

  async restore(id: number, userId: number): Promise<Drill | null> {
    const row = await db.oneOrNone<DrillRow>(
      `
    UPDATE drills
    SET
      is_deleted = FALSE,
      updated_at = NOW()
    WHERE id = $1
      AND created_by = $2
      AND is_deleted = TRUE
    RETURNING *
    `,
      [id, userId]
    );

    return row ? mapRowToDrill(row) : null;
  },


};