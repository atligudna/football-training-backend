import z from "zod";


export const equipmentCreateSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters")
});

export const equipmentUpdateSchema = equipmentCreateSchema.partial();