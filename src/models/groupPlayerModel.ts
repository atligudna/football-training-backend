import { db } from "../config/db";
import { GroupModel } from "./groupModel";
import { PlayerModel } from "./playerModel";

interface PlayerRow {
  id: number;
  first_name: string;
  last_name: string;
  birth_year: number | null;
  position: string | null;
  notes: string | null;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface GroupPlayer {
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

function mapRowToPlayer(row: PlayerRow): GroupPlayer {
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

export const GroupPlayerModel = {
  async getPlayers(
    groupId: number,
    userId: number
  ): Promise<GroupPlayer[] | null> {
    const group = await GroupModel.getById(
      groupId,
      userId
    );

    if (!group) return null;

    const rows = await db.any<PlayerRow>(
      `
      SELECT
        p.id,
        p.first_name,
        p.last_name,
        p.birth_year,
        p.position,
        p.notes,
        p.active,
        p.created_at,
        p.updated_at
      FROM group_players gp
      JOIN players p
        ON p.id = gp.player_id
      WHERE gp.group_id = $1
        AND p.created_by = $2
        AND p.is_deleted = FALSE
      ORDER BY
        p.last_name ASC,
        p.first_name ASC,
        p.id ASC
      `,
      [groupId, userId]
    );

    return rows.map(mapRowToPlayer);
  },

  async addPlayer(
    groupId: number,
    playerId: number,
    userId: number
  ): Promise<"added" | "exists" | "group-not-found" | "player-not-found"> {
    const group = await GroupModel.getById(
      groupId,
      userId
    );

    if (!group) {
      return "group-not-found";
    }

    const player = await PlayerModel.getById(
      playerId,
      userId
    );

    if (!player) {
      return "player-not-found";
    }

    const existing = await db.oneOrNone(
      `
      SELECT 1
      FROM group_players
      WHERE group_id = $1
        AND player_id = $2
      `,
      [groupId, playerId]
    );

    if (existing) {
      return "exists";
    }

    await db.none(
      `
      INSERT INTO group_players
        (group_id, player_id)
      VALUES
        ($1, $2)
      `,
      [groupId, playerId]
    );

    return "added";
  },

  async removePlayer(
    groupId: number,
    playerId: number,
    userId: number
  ): Promise<
    | "removed"
    | "not-member"
    | "group-not-found"
    | "player-not-found"
  > {
    const group = await GroupModel.getById(
      groupId,
      userId
    );

    if (!group) {
      return "group-not-found";
    }

    const player = await PlayerModel.getById(
      playerId,
      userId
    );

    if (!player) {
      return "player-not-found";
    }

    const result = await db.result(
      `
      DELETE FROM group_players
      WHERE group_id = $1
        AND player_id = $2
      `,
      [groupId, playerId]
    );

    if (result.rowCount === 0) {
      return "not-member";
    }

    return "removed";
  },
};