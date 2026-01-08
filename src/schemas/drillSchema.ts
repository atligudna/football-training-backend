import { z } from "zod";


export const drillCreateSchema = z.object ({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    duration_minutes: z.number().int().positive().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    category_id: z.number().int().positive().optional(),
    field_id: z.number().int().positive().optional()
})

export const drillUpdateSchema = drillCreateSchema.partial();