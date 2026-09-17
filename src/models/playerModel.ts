import { db } from "../config/db";

interface PlayerRow {
  id: number;
  first_name: string;
  last_name: string;
  birth_year: number | null;
  position: string | null;
  notes: string | null;
  active: boolean;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  birthYear?: number;
  position?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlayerInput {
  firstName: string;
  lastName: string;
  birthYear?: number;
  position?: string;
  notes?: string;
  active?: boolean;
  createdBy: number;
}

export interface UpdatePlayerInput {
  firstName?: string;
  lastName?: string;
  birthYear?: number | null;
  position?: string | null;
  notes?: string | null;
  active?: boolean;
}

function mapRowToPlayer(row: PlayerRow): Player {
  return {
    id: String(row.id),
    firstName: row.first_name,
    lastName: row.last_name,
    birthYear: row.birth_year ?? undefined,
    position: row.position ?? undefined,
    notes: row.notes ?? undefined,
    active: row.active,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export const PlayerModel = {
  async getAll(userId: number): Promise<Player[]> {
    const rows = await db.any<PlayerRow>(
      `
      SELECT *
      FROM players
      WHERE created_by = $1
        AND is_deleted = FALSE
      ORDER BY last_name ASC, first_name ASC, id ASC
      `,
      [userId]
    );

    return rows.map(mapRowToPlayer);
  },

  async getById(
    id: number,
    userId: number
  ): Promise<Player | null> {
    const row = await db.oneOrNone<PlayerRow>(
      `
      SELECT *
      FROM players
      WHERE id = $1
        AND created_by = $2
        AND is_deleted = FALSE
      `,
      [id, userId]
    );

    return row ? mapRowToPlayer(row) : null;
  },

  async create(data: CreatePlayerInput): Promise<Player> {
    const row = await db.one<PlayerRow>(
      `
      INSERT INTO players
      (
        first_name,
        last_name,
        birth_year,
        position,
        notes,
        active,
        created_by
      )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        data.firstName,
        data.lastName,
        data.birthYear ?? null,
        data.position ?? null,
        data.notes ?? null,
        data.active ?? true,
        data.createdBy,
      ]
    );

    return mapRowToPlayer(row);
  },

  async update(
    id: number,
    userId: number,
    data: UpdatePlayerInput
  ): Promise<Player | null> {
    const existing = await this.getById(id, userId);

    if (!existing) return null;

    const row = await db.one<PlayerRow>(
      `
      UPDATE players
      SET
        first_name = $3,
        last_name = $4,
        birth_year = $5,
        position = $6,
        notes = $7,
        active = $8,
        updated_at = NOW()
      WHERE id = $1
        AND created_by = $2
        AND is_deleted = FALSE
      RETURNING *
      `,
      [
        id,
        userId,
        data.firstName ?? existing.firstName,
        data.lastName ?? existing.lastName,
        data.birthYear !== undefined
          ? data.birthYear
          : existing.birthYear ?? null,
        data.position !== undefined
          ? data.position
          : existing.position ?? null,
        data.notes !== undefined
          ? data.notes
          : existing.notes ?? null,
        data.active ?? existing.active,
      ]
    );

    return mapRowToPlayer(row);
  },

  async remove(
    id: number,
    userId: number
  ): Promise<boolean> {
    const result = await db.result(
      `
      UPDATE players
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