import z from "zod";

export const sessionCreateSchema = z.object({
    field_id: z.number().optional(),
    title: z.string().min(2, "Title must be 2 character"),
    date: z.string().datetime("Date must be right"),
    total_duration: z.number().min(2).max(500).optional(),
    notes: z.string().optional(),
    drills: z.array(
        z.object({
            drill_id: z.number(),
            order_number: z.number().min(1),
            duration_override: z.number().min(1).optional()
        })
    ).optional()
});

export const sessionUpdateSchema = sessionCreateSchema.partial();