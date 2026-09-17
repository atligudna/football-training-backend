import { db } from "../config/db";

interface GroupRow {
  id: number;
  name: string;
  age_group: string | null;
  description: string | null;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface PlayerGroup {
  id: string;
  name: string;
  ageGroup?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupInput {
  name: string;
  ageGroup?: string;
  description?: string;
  createdBy: number;
}

export interface UpdateGroupInput {
  name?: string;
  ageGroup?: string | null;
  description?: string | null;
}

function mapRowToGroup(row: GroupRow): PlayerGroup {
  return {
    id: String(row.id),
    name: row.name,
    ageGroup: row.age_group ?? undefined,
    description: row.description ?? undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export const GroupModel = {
  async getAll(userId: number): Promise<PlayerGroup[]> {
    const rows = await db.any<GroupRow>(
      `
      SELECT *
      FROM groups
      WHERE created_by = $1
        AND is_deleted = FALSE
      ORDER BY name ASC, id ASC
      `,
      [userId]
    );

    return rows.map(mapRowToGroup);
  },

  async getById(
    id: number,
    userId: number
  ): Promise<PlayerGroup | null> {
    const row = await db.oneOrNone<GroupRow>(
      `
      SELECT *
      FROM groups
      WHERE id = $1
        AND created_by = $2
        AND is_deleted = FALSE
      `,
      [id, userId]
    );

    return row ? mapRowToGroup(row) : null;
  },

  async create(
    data: CreateGroupInput
  ): Promise<PlayerGroup> {
    const row = await db.one<GroupRow>(
      `
      INSERT INTO groups
      (
        name,
        age_group,
        description,
        created_by
      )
      VALUES
        ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        data.name,
        data.ageGroup ?? null,
        data.description ?? null,
        data.createdBy,
      ]
    );

    return mapRowToGroup(row);
  },

  async update(
    id: number,
    userId: number,
    data: UpdateGroupInput
  ): Promise<PlayerGroup | null> {
    const existing = await this.getById(id, userId);

    if (!existing) return null;

    const row = await db.one<GroupRow>(
      `
      UPDATE groups
      SET
        name = $3,
        age_group = $4,
        description = $5,
        updated_at = NOW()
      WHERE id = $1
        AND created_by = $2
        AND is_deleted = FALSE
      RETURNING *
      `,
      [
        id,
        userId,
        data.name ?? existing.name,
        data.ageGroup !== undefined
          ? data.ageGroup
          : existing.ageGroup ?? null,
        data.description !== undefined
          ? data.description
          : existing.description ?? null,
      ]
    );

    return mapRowToGroup(row);
  },

  async remove(
    id: number,
    userId: number
  ): Promise<boolean> {
    const result = await db.result(
      `
      UPDATE groups
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