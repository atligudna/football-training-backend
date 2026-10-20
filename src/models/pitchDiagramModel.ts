import { randomUUID } from "crypto";

import { db } from "../config/db";

export type PitchOrientation =
    | "landscape"
    | "portrait";

export type PitchObjectType =
    | "cone"
    | "pole"
    | "ball"
    | "goal"
    | "player"
    | "arrow"
    | "area"
    | "label";

export interface PitchDiagramObject {
    id: string;
    type: PitchObjectType;

    x: number;
    y: number;

    rotation?: number;

    size?:
    | "small"
    | "medium"
    | "large";

    color?:
    | "blue"
    | "red"
    | "yellow"
    | "white"
    | "black";

    goalType?:
    | "full"
    | "seven"
    | "mini";

    lineStyle?:
    | "solid"
    | "dashed";

    text?: string;

    width?: number;
    height?: number;
}

interface PitchDiagramRow {
    id: string;
    title: string;
    orientation: PitchOrientation;
    objects: PitchDiagramObject[];
    created_by: number;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
}

export interface PitchDiagram {
    id: string;
    title: string;
    orientation: PitchOrientation;
    objects: PitchDiagramObject[];
    createdAt: string;
    updatedAt: string;
}

export interface CreatePitchDiagramInput {
    title: string;
    orientation: PitchOrientation;
    objects: PitchDiagramObject[];
    createdBy: number;
}

export interface UpdatePitchDiagramInput {
    title?: string;
    orientation?: PitchOrientation;
    objects?: PitchDiagramObject[];
}

function mapRowToPitchDiagram(
    row: PitchDiagramRow
): PitchDiagram {
    return {
        id: row.id,
        title: row.title,
        orientation: row.orientation,
        objects: Array.isArray(row.objects)
            ? row.objects
            : [],
        createdAt:
            row.created_at.toISOString(),
        updatedAt:
            row.updated_at.toISOString(),
    };
}

export const PitchDiagramModel = {
    async getAll(
        userId: number
    ): Promise<PitchDiagram[]> {
        const rows =
            await db.any<PitchDiagramRow>(
                `
          SELECT *
          FROM pitch_diagrams
          WHERE created_by = $1
            AND is_deleted = FALSE
          ORDER BY
            updated_at DESC,
            created_at DESC
        `,
                [userId]
            );

        return rows.map(
            mapRowToPitchDiagram
        );
    },
    async getById(
        id: string,
        userId: number
    ): Promise<PitchDiagram | null> {
        const row =
            await db.oneOrNone<PitchDiagramRow>(
                `
          SELECT *
          FROM pitch_diagrams
          WHERE id = $1
            AND created_by = $2
            AND is_deleted = FALSE
        `,
                [
                    id,
                    userId,
                ]
            );

        return row
            ? mapRowToPitchDiagram(row)
            : null;
    },
    async create(
        data: CreatePitchDiagramInput
    ): Promise<PitchDiagram> {
        const id =
            randomUUID();

        const row =
            await db.one<PitchDiagramRow>(
                `
          INSERT INTO pitch_diagrams
          (
            id,
            title,
            orientation,
            objects,
            created_by
          )
          VALUES
          (
            $1,
            $2,
            $3,
            $4::jsonb,
            $5
          )
          RETURNING *
        `,
                [
                    id,
                    data.title,
                    data.orientation,
                    JSON.stringify(
                        data.objects
                    ),
                    data.createdBy,
                ]
            );

        return mapRowToPitchDiagram(
            row
        );
    },
    async update(
        id: string,
        userId: number,
        data: UpdatePitchDiagramInput
    ): Promise<PitchDiagram | null> {
        const existing =
            await this.getById(
                id,
                userId
            );

        if (!existing) {
            return null;
        }

        const row =
            await db.one<PitchDiagramRow>(
                `
        UPDATE pitch_diagrams
        SET
          title = $3,
          orientation = $4,
          objects = $5::jsonb,
          updated_at = NOW()
        WHERE id = $1
          AND created_by = $2
          AND is_deleted = FALSE
        RETURNING *
      `,
                [
                    id,
                    userId,
                    data.title ??
                    existing.title,
                    data.orientation ??
                    existing.orientation,
                    JSON.stringify(
                        data.objects ??
                        existing.objects
                    ),
                ]
            );

        return mapRowToPitchDiagram(
            row
        );
    },
    async remove(
        id: string,
        userId: number
    ): Promise<boolean> {
        return db.tx(async (transaction) => {
            const existing =
                await transaction.oneOrNone<{
                    id: string;
                }>(
                    `
          SELECT id
          FROM pitch_diagrams
          WHERE id = $1
            AND created_by = $2
            AND is_deleted = FALSE
        `,
                    [
                        id,
                        userId,
                    ]
                );

            if (!existing) {
                return false;
            }

            await transaction.none(
                `
        UPDATE drills
        SET
          pitch_diagram_id = NULL,
          updated_at = NOW()
        WHERE pitch_diagram_id = $1
          AND created_by = $2
      `,
                [
                    id,
                    userId,
                ]
            );

            const result =
                await transaction.result(
                    `
          UPDATE pitch_diagrams
          SET
            is_deleted = TRUE,
            updated_at = NOW()
          WHERE id = $1
            AND created_by = $2
            AND is_deleted = FALSE
        `,
                    [
                        id,
                        userId,
                    ]
                );

            return result.rowCount > 0;
        });
    },
};