import { db } from "../config/db";

interface CoachRow {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  active: boolean;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface Coach {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCoachInput {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  active?: boolean;
  createdBy: number;
}

export interface UpdateCoachInput {
  name?: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  active?: boolean;
}

function mapRowToCoach(
  row: CoachRow
): Coach {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    notes: row.notes ?? undefined,
    active: row.active,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export const CoachModel = {
  async getAll(
    userId: number
  ): Promise<Coach[]> {
    const rows = await db.any<CoachRow>(
      `
      SELECT *
      FROM coaches
      WHERE created_by = $1
        AND is_deleted = FALSE
      ORDER BY name ASC, id ASC
      `,
      [userId]
    );

    return rows.map(mapRowToCoach);
  },

  async getById(
    id: number,
    userId: number
  ): Promise<Coach | null> {
    const row =
      await db.oneOrNone<CoachRow>(
        `
        SELECT *
        FROM coaches
        WHERE id = $1
          AND created_by = $2
          AND is_deleted = FALSE
        `,
        [id, userId]
      );

    return row
      ? mapRowToCoach(row)
      : null;
  },

  async create(
    data: CreateCoachInput
  ): Promise<Coach> {
    const row = await db.one<CoachRow>(
      `
      INSERT INTO coaches
      (
        name,
        email,
        phone,
        notes,
        active,
        created_by
      )
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        data.name,
        data.email ?? null,
        data.phone ?? null,
        data.notes ?? null,
        data.active ?? true,
        data.createdBy,
      ]
    );

    return mapRowToCoach(row);
  },

  async update(
    id: number,
    userId: number,
    data: UpdateCoachInput
  ): Promise<Coach | null> {
    const existing =
      await this.getById(
        id,
        userId
      );

    if (!existing) {
      return null;
    }

    const row = await db.one<CoachRow>(
      `
      UPDATE coaches
      SET
        name = $3,
        email = $4,
        phone = $5,
        notes = $6,
        active = $7,
        updated_at = NOW()
      WHERE id = $1
        AND created_by = $2
        AND is_deleted = FALSE
      RETURNING *
      `,
      [
        id,
        userId,
        data.name ??
          existing.name,
        data.email !== undefined
          ? data.email
          : existing.email ?? null,
        data.phone !== undefined
          ? data.phone
          : existing.phone ?? null,
        data.notes !== undefined
          ? data.notes
          : existing.notes ?? null,
        data.active ??
          existing.active,
      ]
    );

    return mapRowToCoach(row);
  },

  async remove(
    id: number,
    userId: number
  ): Promise<boolean> {
    const result = await db.result(
      `
      UPDATE coaches
      SET
        is_deleted = TRUE,
        updated_at = NOW()
      WHERE id = $1
        AND created_by = $2
        AND is_deleted = FALSE
      `,
      [id, userId]
    );

    return result.rowCount > 0;
  },
};